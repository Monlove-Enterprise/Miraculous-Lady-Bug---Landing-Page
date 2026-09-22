#!/usr/bin/env node
/**
 * Seeds the `cities` table with the confirmed engagements Math provided
 * (2026-09-14) — dates/venues/promoters are real, but NO financial figures
 * (guarantees/deposits) from the booking sheet are stored here; those stay
 * out of the codebase entirely. All rows start as status='confirmee' — dates
 * and venues are locked with the promoter, but tickets are not on sale yet
 * (no `opening_at`/`ticket_url` known).
 *
 * Only inserts a row if its slug doesn't already exist — safe to re-run.
 *
 *   node scripts/seed-cities.mjs            # DRY-RUN
 *   node scripts/seed-cities.mjs --commit
 */
import postgres from 'postgres'

const COMMIT = process.argv.includes('--commit')
const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL manquante')
  process.exit(1)
}

const rows = [
  { slug: 'louisville-ky', city: 'Louisville', region: 'KY', country_code: 'US', venue: 'The Louisville Palace Theatre', promoter: 'Live Nation', format: 'tournee', status: 'confirmee', start_date: '2027-03-02', end_date: '2027-03-02', lat: 38.2527, lng: -85.7585 },
  { slug: 'st-louis-mo', city: 'St. Louis', region: 'MO', country_code: 'US', venue: 'Stifel Theatre', promoter: 'Live Nation', format: 'tournee', status: 'confirmee', start_date: '2027-02-27', end_date: '2027-02-27', lat: 38.6270, lng: -90.1994 },
  { slug: 'indianapolis-in', city: 'Indianapolis', region: 'IN', country_code: 'US', venue: 'Old National Centre (Murat Theatre)', promoter: 'Live Nation – Great Lakes', format: 'tournee', status: 'confirmee', start_date: '2027-02-28', end_date: '2027-02-28', lat: 39.7684, lng: -86.1581 },
  // Two performances confirmed (Math, 2026-09-22): Sat Mar 6 + Sun Mar 7.
  { slug: 'kitchener-on', city: 'Kitchener', region: 'ON', country_code: 'CA', venue: 'Centre In The Square', promoter: 'Centre In The Square', format: 'tournee', status: 'confirmee', start_date: '2027-03-06', end_date: '2027-03-07', lat: 43.4516, lng: -80.4925 },
  { slug: 'brooklyn-ny', city: 'Brooklyn', region: 'NY', country_code: 'US', venue: 'Kings Theatre', promoter: 'ATG Entertainment', format: 'tournee', status: 'confirmee', start_date: '2027-03-09', end_date: '2027-03-09', lat: 40.6782, lng: -73.9442 },
  { slug: 'new-brunswick-nj', city: 'New Brunswick', region: 'NJ', country_code: 'US', venue: 'State Theatre', promoter: 'Music Without Borders', format: 'tournee', status: 'confirmee', start_date: '2027-03-10', end_date: '2027-03-10', lat: 40.4862, lng: -74.4518 },
  { slug: 'waterbury-ct', city: 'Waterbury', region: 'CT', country_code: 'US', venue: 'The Palace Theater', promoter: 'Music Without Borders', format: 'tournee', status: 'confirmee', start_date: '2027-03-11', end_date: '2027-03-11', lat: 41.5582, lng: -73.0515 },
  { slug: 'lancaster-pa', city: 'Lancaster', region: 'PA', country_code: 'US', venue: 'American Music Theatre', promoter: 'Philip Citron Inc.', format: 'tournee', status: 'confirmee', start_date: '2027-03-12', end_date: '2027-03-12', lat: 40.0379, lng: -76.3055 },
  { slug: 'staten-island-ny', city: 'Staten Island', region: 'NY', country_code: 'US', venue: 'St. George Theatre', promoter: 'Philip Citron Inc.', format: 'tournee', status: 'confirmee', start_date: '2027-03-13', end_date: '2027-03-13', lat: 40.5795, lng: -74.1502 },
  { slug: 'greensburg-pa', city: 'Greensburg', region: 'PA', country_code: 'US', venue: 'The Palace Theater', promoter: 'Drusky Entertainment', format: 'tournee', status: 'confirmee', start_date: '2027-03-14', end_date: '2027-03-14', lat: 40.3015, lng: -79.5389 },
  { slug: 'jacksonville-fl', city: 'Jacksonville', region: 'FL', country_code: 'US', venue: 'Florida Theatre', promoter: 'Florida Theatre Performing Arts', format: 'tournee', status: 'confirmee', start_date: '2027-03-19', end_date: '2027-03-19', lat: 30.3322, lng: -81.6557 },
  // Venue not yet finalized — country only, per Math (2026-09-14).
  { slug: 'qatar-2027', city: 'À déterminer', region: null, country_code: 'QA', venue: null, promoter: 'Events & Entertainment Enterprises', format: 'tournee', status: 'confirmee', start_date: '2027-05-17', end_date: '2027-05-17', lat: null, lng: null },
  // Permanent residency — no confirmed performance dates yet (calendar to
  // follow in `performances` once available).
  { slug: 'paris', city: 'Paris', region: null, country_code: 'FR', venue: 'Le Lido, Paris', promoter: null, format: 'residence', status: 'confirmee', start_date: null, end_date: null, lat: 48.8566, lng: 2.3522 },
]

const sql = postgres(url, { prepare: false, max: 1 })

const existing = await sql`select slug from cities`
const existingSlugs = new Set(existing.map((r) => r.slug))
const toInsert = rows.filter((r) => !existingSlugs.has(r.slug))

console.log(`\n=== SEED CITIES — ${COMMIT ? 'COMMIT' : 'DRY-RUN'} ===`)
console.log(`Déjà en base : ${rows.length - toInsert.length}`)
console.log(`À insérer : ${toInsert.length}`)
for (const r of toInsert) console.log(`  ${r.slug} — ${r.city}${r.region ? ', ' + r.region : ''} (${r.country_code}) — ${r.format}`)

if (!COMMIT) {
  console.log('\n(DRY-RUN — rien inséré. Relancer avec --commit.)')
  await sql.end()
  process.exit(0)
}

for (const r of toInsert) {
  await sql`
    insert into cities (slug, city, region, country_code, venue, promoter, format, status, start_date, end_date, lat, lng)
    values (${r.slug}, ${r.city}, ${r.region}, ${r.country_code}, ${r.venue}, ${r.promoter}, ${r.format}, ${r.status}, ${r.start_date}, ${r.end_date}, ${r.lat}, ${r.lng})
  `
}
console.log(`\nInséré : ${toInsert.length}`)
await sql.end()
