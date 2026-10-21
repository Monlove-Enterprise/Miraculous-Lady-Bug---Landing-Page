#!/usr/bin/env node
/**
 * Sets start_time/end_time (venue-local showtime, never converted) on
 * existing `cities` rows — Math, 2026-10-21: provided the routing sheet's
 * showtimes via screenshot. Only updates rows already seeded by
 * scripts/seed-cities.mjs; never inserts.
 *
 * Qatar and the Paris residency are deliberately excluded — "dont put the
 * qatar yet" / "stop thinking about the lido for now" / "both are not
 * confirmed yet" (Math, 2026-10-21).
 *
 * Lansing MI, Austin TX, New Orleans LA, San Antonio TX, and a newly
 * mentioned Washington DC date are NOT in this list yet — their showtimes
 * (and, for Washington DC, the date itself) weren't in the screenshot.
 *
 *   node scripts/set-city-showtimes.mjs            # DRY-RUN
 *   node scripts/set-city-showtimes.mjs --commit
 */
import postgres from 'postgres'

const COMMIT = process.argv.includes('--commit')
const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL manquante')
  process.exit(1)
}

// slug -> { start_time, end_time? } — end_time only for Kitchener's second
// (matinee) night; every other city has one night, so end_time mirrors
// start_time to match how toCityDisplayRows reads start_date/end_date.
const TIMES = {
  'st-louis-mo': { start_time: '19:00', end_time: '19:00' },
  'indianapolis-in': { start_time: '18:00', end_time: '18:00' },
  'louisville-ky': { start_time: '19:00', end_time: '19:00' },
  'chicago-il': { start_time: '18:30', end_time: '18:30' },
  'kitchener-on': { start_time: '19:00', end_time: '13:00' }, // Sat 7pm, Sun 1pm matinee
  'brooklyn-ny': { start_time: '19:00', end_time: '19:00' },
  'new-brunswick-nj': { start_time: '19:00', end_time: '19:00' },
  'waterbury-ct': { start_time: '19:00', end_time: '19:00' },
  'lancaster-pa': { start_time: '19:00', end_time: '19:00' },
  'staten-island-ny': { start_time: '18:00', end_time: '18:00' },
  'greensburg-pa': { start_time: '17:00', end_time: '17:00' },
  'newport-news-va': { start_time: '18:00', end_time: '18:00' },
  'jacksonville-fl': { start_time: '18:30', end_time: '18:30' },
  'wilmington-nc': { start_time: '18:30', end_time: '18:30' },
}

const sql = postgres(url, { prepare: false, max: 1 })

const existing = await sql`SELECT slug, city, region, start_date, end_date FROM cities WHERE slug = ANY(${Object.keys(TIMES)})`
const bySlug = new Map(existing.map((r) => [r.slug, r]))
const missing = Object.keys(TIMES).filter((s) => !bySlug.has(s))

console.log(`\n=== SET CITY SHOWTIMES — ${COMMIT ? 'COMMIT' : 'DRY-RUN'} ===`)
for (const [slug, t] of Object.entries(TIMES)) {
  const row = bySlug.get(slug)
  if (!row) continue
  const label = [row.city, row.region].filter(Boolean).join(', ')
  const sameNight = row.start_date?.toISOString?.()?.slice(0, 10) === row.end_date?.toISOString?.()?.slice(0, 10)
  console.log(`  ${slug.padEnd(20)} ${label.padEnd(22)} ${t.start_time}${sameNight ? '' : ` / ${t.end_time}`}`)
}
if (missing.length) {
  console.log(`\nSlugs not found in DB (skipped): ${missing.join(', ')}`)
}
console.log(`\nCities still needing showtimes (not in this list): lansing-mi, austin-tx, new-orleans-la, san-antonio-tx, and Washington DC (not yet seeded — needs a date)`)

if (!COMMIT) {
  console.log('\n(DRY-RUN — rien écrit. Relancer avec --commit.)')
  await sql.end()
  process.exit(0)
}

for (const [slug, t] of Object.entries(TIMES)) {
  if (!bySlug.has(slug)) continue
  await sql`UPDATE cities SET start_time = ${t.start_time}, end_time = ${t.end_time}, updated_at = now() WHERE slug = ${slug}`
}
console.log(`\nMis à jour : ${Object.keys(TIMES).filter((s) => bySlug.has(s)).length}`)
await sql.end()
