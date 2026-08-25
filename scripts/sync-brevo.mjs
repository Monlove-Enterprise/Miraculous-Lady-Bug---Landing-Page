#!/usr/bin/env node
/**
 * Catch-up sync: push subscribers with crm_synced=false to the correct Brevo
 * list (by consent combo). Dry-run by default.
 *
 *   node scripts/sync-brevo.mjs                 # DRY-RUN (no Brevo calls, no writes)
 *   node scripts/sync-brevo.mjs --commit        # actually push + flip flags
 *   node scripts/sync-brevo.mjs --commit --limit=100
 *
 * A contact whose phone duplicates another subscriber's is pushed WITHOUT the
 * SMS attribute (Brevo rejects duplicate numbers) so it still lands for email.
 * Reads DATABASE_URL + BREVO_API_KEY (+ optional BREVO_LIST_* overrides) from env.
 */
import postgres from 'postgres'

const COMMIT = process.argv.includes('--commit')
const limitArg = process.argv.find((a) => a.startsWith('--limit='))
const LIMIT = limitArg ? Number(limitArg.split('=')[1]) : 1000

const url = process.env.DATABASE_URL
const apiKey = process.env.BREVO_API_KEY
if (!url) {
  console.error('DATABASE_URL manquante')
  process.exit(1)
}
if (COMMIT && !apiKey) {
  console.error('BREVO_API_KEY manquante (requise pour --commit)')
  process.exit(1)
}

const LISTS = {
  emailSms: Number(process.env.BREVO_LIST_EMAIL_SMS || 3),
  email: Number(process.env.BREVO_LIST_EMAIL || 4),
  sms: Number(process.env.BREVO_LIST_SMS || 5),
  noConsent: Number(process.env.BREVO_LIST_NOCONSENT || 6),
}
const listFor = (e, s) =>
  e && s ? LISTS.emailSms : e && !s ? LISTS.email : !e && s ? LISTS.sms : LISTS.noConsent
const listName = (id) => Object.entries(LISTS).find(([, v]) => v === id)?.[0] || String(id)
const maskEmail = (e) => e.replace(/(.{2}).*(@.*)/, '$1***$2')

const sql = postgres(url, { prepare: false, max: 1 })

// Phones shared by >1 subscriber → push those contacts email-only.
const dupRows = await sql`
  select phone from subscribers
  where phone is not null and length(trim(phone)) > 0
  group by phone having count(*) > 1`
const dupPhones = new Set(dupRows.map((r) => r.phone))

const pending = await sql`
  select email, first_name, city, country, country_code, phone,
         email_consent, email_consent_at, sms_consent, sms_consent_at,
         utm_source, utm_medium, utm_campaign, created_at
  from subscribers
  where crm_synced = false
  order by created_at asc
  limit ${LIMIT}`

console.log(`\n=== SYNC BREVO — ${COMMIT ? 'COMMIT' : 'DRY-RUN (aucun envoi)'} ===`)
console.log(`En attente traites : ${pending.length}`)
const byList = {}
let dupCount = 0
for (const r of pending) {
  const name = listName(listFor(r.email_consent, r.sms_consent))
  byList[name] = (byList[name] || 0) + 1
  if (r.phone && dupPhones.has(r.phone)) dupCount++
}
console.log('Repartition par liste :', byList)
console.log(`Dont doublons SMS (pousses email seul) : ${dupCount}`)

if (!COMMIT) {
  console.log('\n(DRY-RUN — rien envoye. Relancer avec --commit pour pousser.)')
  await sql.end()
  process.exit(0)
}

function buildAttrs(r, omit) {
  const a = { OPT_IN_EMAIL: r.email_consent, OPT_IN_SMS: r.sms_consent && !omit }
  if (r.first_name) a.PRENOM = r.first_name
  if (r.city) a.VILLE = r.city
  if (r.country) a.PAYS = r.country
  if (r.country_code) a.COUNTRY_CODE = r.country_code
  if (r.phone && !omit) a.SMS = r.phone
  if (r.email_consent_at) a.OPT_IN_EMAIL_DATE = r.email_consent_at
  if (r.sms_consent_at && !omit) a.OPT_IN_SMS_DATE = r.sms_consent_at
  if (r.utm_source) a.UTM_SOURCE = r.utm_source
  if (r.utm_medium) a.UTM_MEDIUM = r.utm_medium
  if (r.utm_campaign) a.UTM_CAMPAIGN = r.utm_campaign
  if (r.created_at) a.DATE_INSCRIPTION = r.created_at
  return a
}

async function pushContact(r, listId, omit) {
  const resp = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      email: r.email,
      attributes: buildAttrs(r, omit),
      listIds: [listId],
      updateEnabled: true,
    }),
  })
  let id
  if (resp.status === 201) {
    const j = await resp.json().catch(() => ({}))
    id = j.id
  } else if (!resp.ok && resp.status !== 204) {
    const t = await resp.text()
    throw new Error(`HTTP ${resp.status} ${t.slice(0, 200)}`)
  }
  if (!id) {
    const g = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(r.email)}`, {
      headers: { 'api-key': apiKey, accept: 'application/json' },
    })
    if (g.ok) {
      const j = await g.json().catch(() => ({}))
      id = j.id
    }
  }
  return id
}

let ok = 0
let fail = 0
for (const r of pending) {
  const listId = listFor(r.email_consent, r.sms_consent)
  const omit = !!(r.phone && dupPhones.has(r.phone))
  try {
    let id
    try {
      id = await pushContact(r, listId, omit)
    } catch (e) {
      // Phone rejected by Brevo (format-level duplicate or invalid) → email-only.
      const m = String(e?.message || e).toLowerCase()
      if (!omit && (m.includes('sms') || m.includes('phone'))) {
        id = await pushContact(r, listId, true)
      } else {
        throw e
      }
    }
    await sql`
      update subscribers
      set crm_synced = true, crm_synced_at = now(), updated_at = now(),
          brevo_contact_id = ${id ?? null}, crm_last_error = null
      where email = ${r.email}`
    ok++
  } catch (e) {
    const msg = String(e?.message || e).slice(0, 500)
    await sql`update subscribers set crm_last_error = ${msg}, updated_at = now() where email = ${r.email}`
    fail++
    console.log(`  x ${maskEmail(r.email)} : ${msg.slice(0, 120)}`)
  }
}

console.log(`\nPousses: ${ok}   Echecs: ${fail}`)
const [v] = await sql`
  select count(*)::int total,
         count(*) filter (where crm_synced)::int synchro,
         count(*) filter (where not crm_synced)::int en_attente
  from subscribers`
console.log(`Etat: total=${v.total} synchro=${v.synchro} en_attente=${v.en_attente}`)
await sql.end()
