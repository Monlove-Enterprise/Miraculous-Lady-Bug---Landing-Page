#!/usr/bin/env node
/**
 * Applies Math's updated routing sheet (MIRACULOUS_TOUR2027 V6.xlsx,
 * 2026-10-14) to the `cities` table: removes 3 cities dropped from the
 * tour, fixes Chicago's venue, adds Washington DC, and confirms Doha/Qatar's
 * venue + real date range (was a venue-TBD placeholder). One-off, idempotent
 * (safe to re-run — upserts by slug). A pre-run backup of the full table is
 * at the time this was written; see session notes.
 *
 *   node scripts/update-cities-v6-routing.mjs            # DRY-RUN
 *   node scripts/update-cities-v6-routing.mjs --commit
 */
import postgres from 'postgres'

const COMMIT = process.argv.includes('--commit')
const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL manquante')
  process.exit(1)
}

// No longer in the V6 routing — dropped from the tour entirely.
const DELETE_SLUGS = ['austin-tx', 'new-orleans-la', 'san-antonio-tx']

// Upserted by slug. Only rows that actually changed vs the current seed are
// listed — everything else in `cities` is untouched.
const UPSERT_ROWS = [
  // Venue corrected: was "The Auditorium", V6 sheet says "Chicago Theatre".
  { slug: 'chicago-il', city: 'Chicago', region: 'IL', country_code: 'US', venue: 'Chicago Theatre', promoter: null, format: 'tournee', status: 'confirmee', start_date: '2027-03-04', end_date: '2027-03-04', lat: 41.8781, lng: -87.6298 },
  // Still "PAS CONFIRMÉ" in V6 (venue/capacity blank) — downgraded to envisagee.
  { slug: 'lansing-mi', city: 'Lansing', region: 'MI', country_code: 'US', venue: null, promoter: null, format: 'tournee', status: 'envisagee', start_date: '2027-03-05', end_date: '2027-03-05', lat: 42.7325, lng: -84.5555 },
  // New in V6.
  { slug: 'washington-dc', city: 'Washington', region: 'DC', country_code: 'US', venue: 'Warner Theatre', promoter: null, format: 'tournee', status: 'confirmee', start_date: '2027-03-20', end_date: '2027-03-20', lat: 38.9072, lng: -77.0369 },
  // Was a country-only placeholder (venue null, single date); V6 has a real
  // confirmed run: Doha, AL Mayassa Theatre, cap 2300, May 18–23 (dark May
  // 21; May 22–23 are two-show days) — range stored here, no per-night
  // `performances` rows since this is format='tournee', not a residency.
  { slug: 'qatar-2027', city: 'Doha', region: null, country_code: 'QA', venue: 'AL Mayassa Theatre', promoter: 'Events & Entertainment Enterprises', format: 'tournee', status: 'confirmee', start_date: '2027-05-18', end_date: '2027-05-23', lat: 25.2854, lng: 51.5310 },
]

const sql = postgres(url, { prepare: false, max: 1 })

const existing = await sql`select slug, city, venue, start_date, end_date, status from cities where slug = ANY(${DELETE_SLUGS})`
console.log(`\n=== UPDATE CITIES (V6 ROUTING) — ${COMMIT ? 'COMMIT' : 'DRY-RUN'} ===`)
console.log(`\nTo delete (${existing.length}):`)
for (const r of existing) console.log(`  ${r.slug} — ${r.city}, ${r.venue}, ${r.start_date}`)

console.log(`\nTo upsert (${UPSERT_ROWS.length}):`)
for (const r of UPSERT_ROWS) console.log(`  ${r.slug} — ${r.city}${r.region ? ', ' + r.region : ''} — ${r.venue ?? '(venue TBD)'} — ${r.start_date}..${r.end_date} — ${r.status}`)

if (!COMMIT) {
  console.log('\n(DRY-RUN — rien modifié. Relancer avec --commit.)')
  await sql.end()
  process.exit(0)
}

if (existing.length) {
  await sql`delete from cities where slug = ANY(${DELETE_SLUGS})`
  console.log(`\nSupprimé : ${existing.length}`)
}

for (const r of UPSERT_ROWS) {
  await sql`
    insert into cities (slug, city, region, country_code, venue, promoter, format, status, start_date, end_date, lat, lng)
    values (${r.slug}, ${r.city}, ${r.region}, ${r.country_code}, ${r.venue}, ${r.promoter}, ${r.format}, ${r.status}, ${r.start_date}, ${r.end_date}, ${r.lat}, ${r.lng})
    on conflict (slug) do update set
      city = excluded.city, region = excluded.region, country_code = excluded.country_code,
      venue = excluded.venue, promoter = excluded.promoter, format = excluded.format,
      status = excluded.status, start_date = excluded.start_date, end_date = excluded.end_date,
      lat = excluded.lat, lng = excluded.lng, updated_at = now()
  `
}
console.log(`Upserté : ${UPSERT_ROWS.length}`)
await sql.end()
