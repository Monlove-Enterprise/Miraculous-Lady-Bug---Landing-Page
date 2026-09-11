#!/usr/bin/env node
/**
 * Pushes the corrected SMS attribute to Brevo for exactly the rows a prior
 * scripts/backfill-phone-e164.mjs --commit run touched — nothing else.
 *
 * Unlike scripts/sync-brevo.mjs (a full attribute upsert), this issues a
 * targeted PUT with only `{ attributes: { SMS } }`, which Brevo merges into
 * the existing contact — every other attribute (CITY, COUNTRY, SMS_CONSENT,
 * list membership...) is left exactly as it is.
 *
 * Dry-run by default (no Brevo calls). `--commit` applies.
 *
 *   node scripts/resync-phone-brevo.mjs --file=<path from the backfill run>
 *   node scripts/resync-phone-brevo.mjs --file=<path> --commit
 *
 * Reads DATABASE_URL + BREVO_API_KEY from env.
 */
import postgres from 'postgres'
import fs from 'node:fs'

const COMMIT = process.argv.includes('--commit')
const fileArg = process.argv.find((a) => a.startsWith('--file='))
if (!fileArg) {
  console.error('Usage: node scripts/resync-phone-brevo.mjs --file=<ids.json> [--commit]')
  process.exit(1)
}
const idsFile = fileArg.slice('--file='.length)

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

const ids = JSON.parse(fs.readFileSync(idsFile, 'utf8'))
if (!Array.isArray(ids) || ids.length === 0) {
  console.log('Aucun id à traiter dans ce fichier.')
  process.exit(0)
}

const sql = postgres(url, { prepare: false, max: 1 })
const rows = await sql`select id, email, phone from subscribers where id = any(${ids})`
const maskEmail = (e) => e.replace(/(.{2}).*(@.*)/, '$1***$2')

console.log(`\n=== RESYNC SMS BREVO — ${COMMIT ? 'COMMIT' : 'DRY-RUN (aucun envoi)'} ===`)
console.log(`Lignes à traiter : ${rows.length}`)

if (!COMMIT) {
  for (const r of rows) console.log(`  ${maskEmail(r.email)}  SMS -> ${r.phone}`)
  console.log('\n(DRY-RUN — rien envoyé. Relancer avec --commit pour pousser.)')
  await sql.end()
  process.exit(0)
}

let ok = 0
let notFound = 0
let failed = 0
for (const r of rows) {
  try {
    const res = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(r.email)}`, {
      method: 'PUT',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ attributes: { SMS: r.phone } }),
    })
    if (res.status === 404) {
      notFound++
      console.log(`  x ${maskEmail(r.email)} : contact introuvable dans Brevo (non créé)`)
      continue
    }
    if (!res.ok) {
      const t = await res.text()
      throw new Error(`HTTP ${res.status} ${t.slice(0, 200)}`)
    }
    ok++
  } catch (e) {
    failed++
    console.log(`  x ${maskEmail(r.email)} : ${String(e?.message || e).slice(0, 150)}`)
  }
}

console.log(`\nMis à jour : ${ok}   Introuvables : ${notFound}   Échecs : ${failed}`)
await sql.end()
