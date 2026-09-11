#!/usr/bin/env node
/**
 * Backfill malformed `phone` values to valid E.164, using libphonenumber-js —
 * the same library and rules as the live normalisation in
 * server/api/subscribe.post.ts. Fixes two known defects from before that
 * normalisation existed:
 *   - a doubled dialing code (e.g. "+1+13313018576") from a visitor pasting
 *     their own full international number while the dial-code select kept
 *     its default
 *   - a national "0" kept after the dialing code (e.g. "+4407826200997"
 *     instead of "+447826200997") — whether it's dropped varies by country,
 *     so this can't be fixed with a blind regex; it needs the recorded
 *     `country_code` to look up that country's own rule
 *
 * A row is only touched if a fix can be derived from data already on the row
 * (the phone value itself, or its `country_code`) — nothing is guessed. Any
 * row that still doesn't validate after every deterministic attempt is left
 * untouched and reported for manual review.
 *
 * Dry-run by default (no writes). `--commit` applies. `--limit=` caps how many
 * flagged-invalid rows are processed (default 1000, enough for the current
 * backlog).
 *
 *   node scripts/backfill-phone-e164.mjs                # DRY-RUN
 *   node scripts/backfill-phone-e164.mjs --commit
 *   node scripts/backfill-phone-e164.mjs --commit --limit=100
 *
 * On --commit, rows actually changed have crm_synced set to false (same
 * mechanism the rest of this codebase already uses to queue a CRM resync) and
 * their numeric `id`s are written to a temp file (path printed at the end)
 * for scripts/resync-phone-brevo.mjs to push just the SMS attribute for
 * exactly those rows — no email addresses touch disk.
 *
 * Reads DATABASE_URL from env.
 */
import postgres from 'postgres'
import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs'
import { parsePhoneNumberFromString, getCountryCallingCode } from 'libphonenumber-js'

const COMMIT = process.argv.includes('--commit')
const limitArg = process.argv.find((a) => a.startsWith('--limit='))
const LIMIT = limitArg ? Number(limitArg.split('=')[1]) : 1000

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL manquante')
  process.exit(1)
}

const sql = postgres(url, { prepare: false, max: 1 })

/**
 * Tries every deterministic repair, in order, and returns the first valid
 * E.164 result — or undefined if none of them validate.
 */
function tryFix(phone, countryCode) {
  // 1. Already valid as its own self-contained international number.
  const asIs = parsePhoneNumberFromString(phone)
  if (asIs?.isValid()) return asIs.number

  const hasMultiplePlus = (phone.match(/\+/g) || []).length > 1
  const lastPlusSegment = hasMultiplePlus ? phone.slice(phone.lastIndexOf('+')) : null

  // 2. Doubled dialing code: the part after the LAST "+" is a self-contained
  //    number on its own (the visitor's own pasted number wins over the
  //    stale dial-code prefix in front of it).
  if (lastPlusSegment) {
    const fromLastPlus = parsePhoneNumberFromString(lastPlusSegment)
    if (fromLastPlus?.isValid()) return fromLastPlus.number
  }

  if (!countryCode) return undefined // nothing left to try without a known country

  // 3. National "0" (or other national prefix) kept after the dialing code:
  //    strip the calling code implied by the recorded country, then re-parse
  //    the remainder as a NATIONAL number for that country — libphonenumber-js
  //    applies that country's own national-prefix rule.
  let callingCode
  try {
    callingCode = getCountryCallingCode(countryCode)
  } catch {
    return undefined // country_code isn't a country libphonenumber-js knows
  }
  const candidateDigits = (lastPlusSegment || phone).replace(/\D/g, '')
  if (!candidateDigits.startsWith(callingCode)) return undefined // doesn't match — don't guess
  const nationalRemainder = candidateDigits.slice(callingCode.length)
  const stripped = parsePhoneNumberFromString(nationalRemainder, countryCode)
  if (stripped?.isValid()) return stripped.number

  return undefined
}

const rows = await sql`
  select id, email, phone, country_code
  from subscribers
  where phone is not null and length(trim(phone)) > 0
  order by created_at asc`

let examined = 0
let alreadyValid = 0
const corrected = [] // { id, before, after }
const unresolved = [] // { id, email, phone, country_code }

for (const r of rows) {
  examined++
  const asIs = parsePhoneNumberFromString(r.phone)
  if (asIs?.isValid()) {
    alreadyValid++
    continue
  }
  const fixed = tryFix(r.phone, r.country_code || undefined)
  if (fixed && fixed !== r.phone) {
    corrected.push({ id: r.id, before: r.phone, after: fixed })
  } else {
    unresolved.push({ id: r.id, email: r.email, phone: r.phone, country_code: r.country_code })
  }
}

console.log(`\n=== BACKFILL PHONE E.164 — ${COMMIT ? 'COMMIT' : 'DRY-RUN (aucune écriture)'} ===`)
console.log(`Examinées   : ${examined}`)
console.log(`Déjà valides (inchangées) : ${alreadyValid}`)
console.log(`Corrigeables : ${corrected.length}`)
console.log(`Non traitées (laissées inchangées) : ${unresolved.length}`)

console.log('\n--- Échantillon des corrections (max 10) ---')
for (const c of corrected.slice(0, 10)) console.log(`  #${c.id}  ${c.before}  ->  ${c.after}`)

console.log('\n--- Lignes non traitées (revue manuelle) ---')
for (const u of unresolved) {
  console.log(`  #${u.id}  ${u.email.replace(/(.{2}).*(@.*)/, '$1***$2')}  phone=${u.phone}  country_code=${u.country_code ?? 'NULL'}`)
}

if (!COMMIT) {
  console.log('\n(DRY-RUN — rien écrit. Relancer avec --commit pour appliquer.)')
  await sql.end()
  process.exit(0)
}

const toApply = corrected.slice(0, LIMIT)
let applied = 0
for (const c of toApply) {
  await sql`
    update subscribers
    set phone = ${c.after}, crm_synced = false, updated_at = now()
    where id = ${c.id}`
  applied++
}

const idsFile = path.join(os.tmpdir(), `phone-backfill-ids-${Date.now()}.json`)
fs.writeFileSync(idsFile, JSON.stringify(toApply.map((c) => c.id)))

console.log(`\nAppliqué : ${applied} ligne(s) corrigée(s).`)
console.log(`IDs des lignes modifiées écrits dans : ${idsFile}`)
console.log(`(à passer à scripts/resync-phone-brevo.mjs --file=${idsFile})`)

await sql.end()
