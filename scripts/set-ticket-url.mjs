#!/usr/bin/env node
/**
 * Sets a city's ticket_url once tickets are confirmed on sale there, and
 * flips status confirmee -> en_vente so the villes page shows the "on
 * sale" state + a working Buy Tickets button instead of the countdown/
 * confirmed copy (UTM is added on the fly by the page, not stored here).
 * Reusable one-off (replaces the single-purpose
 * set-jacksonville-ticket-url.mjs script) — safe to re-run per city.
 *
 *   node scripts/set-ticket-url.mjs <slug> <ticket_url>            # DRY-RUN
 *   node scripts/set-ticket-url.mjs <slug> <ticket_url> --commit
 */
import postgres from 'postgres'

const args = process.argv.slice(2).filter((a) => a !== '--commit')
const COMMIT = process.argv.includes('--commit')
const [SLUG, TICKET_URL] = args

if (!SLUG || !TICKET_URL) {
  console.error('Usage: node scripts/set-ticket-url.mjs <slug> <ticket_url> [--commit]')
  process.exit(1)
}

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL manquante')
  process.exit(1)
}

const sql = postgres(url, { prepare: false, max: 1 })

const [before] = await sql`select slug, city, status, ticket_url from cities where slug = ${SLUG}`
if (!before) {
  console.error(`No city found for slug ${SLUG}`)
  process.exit(1)
}

console.log(`\n=== SET TICKET URL (${before.city}) — ${COMMIT ? 'COMMIT' : 'DRY-RUN'} ===`)
console.log(`Before: ${before.slug} — status=${before.status} ticket_url=${before.ticket_url ?? '(null)'}`)
console.log(`After:  ${SLUG} — status=en_vente ticket_url=${TICKET_URL}`)

if (COMMIT) {
  await sql`
    update cities
    set ticket_url = ${TICKET_URL}, status = 'en_vente', updated_at = now()
    where slug = ${SLUG}
  `
  const [after] = await sql`select slug, status, ticket_url from cities where slug = ${SLUG}`
  console.log('\nCommitted:', after)
} else {
  console.log('\nDry run only — re-run with --commit to apply.')
}

await sql.end()
