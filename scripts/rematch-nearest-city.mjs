#!/usr/bin/env node
/**
 * Re-matches every subscriber who already has coordinates against whatever
 * is CURRENTLY in the `cities` table, and re-pushes NEAREST_CITY/
 * NEAREST_DATE/NEAREST_TICKET_URL/SECOND_NEAREST_* to Brevo.
 *
 * Math, 2026-10-17: "I dont have dates yet but want to be ready" — for
 * whenever new tour stops (US, UK, wherever) get added later. Unlike
 * scripts/backfill-nearest-city.mjs, this does NO geocoding — every
 * subscriber it touches already has lat/lng on file (from the signup-time
 * flow or a prior backfill run), so this is pure local math (haversine)
 * plus a Brevo push. No Nominatim/Photon calls, no 1 req/sec rate limit, so
 * it runs in minutes even for the whole list, not an hour.
 *
 * Run this any time the `cities` table changes in a way that could change
 * who's nearest to whom: new cities added, a city's start_date/ticket_url
 * changes, or a city goes epuisee (sold out, so it's excluded again).
 *
 * Dry-run by default (no DB writes, no Brevo calls). `--commit` applies.
 *
 *   node scripts/rematch-nearest-city.mjs            # DRY-RUN
 *   node scripts/rematch-nearest-city.mjs --commit
 *
 * Reads DATABASE_URL + BREVO_API_KEY from env.
 */
import postgres from 'postgres'

const COMMIT = process.argv.includes('--commit')

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

const sql = postgres(url, { prepare: false, max: 1 })
const maskEmail = (e) => e.replace(/(.{2}).*(@.*)/, '$1***$2')

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

// Same CLUSTER_RADIUS_KM logic as server/utils/nearestCity.ts and
// scripts/backfill-nearest-city.mjs — kept in sync across all three.
const CLUSTER_RADIUS_KM = 40

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const subscribers = await sql`
  SELECT id, email, lat, lng
  FROM subscribers
  WHERE lat IS NOT NULL AND lng IS NOT NULL
  ORDER BY id
`

const tourCities = await sql`
  SELECT slug, city, region, start_date, ticket_url, lat, lng
  FROM cities
  WHERE format = 'tournee'
    AND lat IS NOT NULL AND lng IS NOT NULL
    AND start_date IS NOT NULL
    AND status NOT IN ('epuisee', 'envisagee')
`

console.log(`\n=== RE-MATCH NEAREST CITY — ${COMMIT ? 'COMMIT' : 'DRY-RUN (rien envoyé/écrit)'} ===`)
console.log(`Abonnés avec coordonnées à réévaluer : ${subscribers.length}`)
console.log(`Villes de tournée éligibles : ${tourCities.length}\n`)

if (!tourCities.length) {
  console.log('Aucune ville de tournée avec lat/lng + start_date — rien à faire.')
  await sql.end()
  process.exit(0)
}

let matched = 0
let synced = 0
let failed = 0

for (const s of subscribers) {
  const ranked = tourCities
    .map((c) => ({ city: c, dist: distanceKm(Number(s.lat), Number(s.lng), Number(c.lat), Number(c.lng)) }))
    .sort((a, b) => a.dist - b.dist)
  const best = ranked[0]
  if (!best) continue
  const second = ranked[1] && ranked[1].dist <= CLUSTER_RADIUS_KM ? ranked[1] : undefined
  matched++

  const display = [best.city.city, best.city.region].filter(Boolean).join(', ')
  const dateDisplay = fmtDate(best.city.start_date)
  const secondDisplay = second ? [second.city.city, second.city.region].filter(Boolean).join(', ') : undefined
  const secondDateDisplay = second ? fmtDate(second.city.start_date) : undefined

  if (matched <= 20 || matched % 1000 === 0) {
    const secondNote = second ? ` + ${secondDisplay} (${Math.round(second.dist)}km)` : ''
    console.log(
      `  ${maskEmail(s.email)} -> ${display} (${dateDisplay}), ${Math.round(best.dist)}km${secondNote}`,
    )
  }

  if (!COMMIT) continue

  await sql`
    UPDATE subscribers
    SET nearest_city_slug = ${best.city.slug}, updated_at = now()
    WHERE id = ${s.id}
  `

  const attributes = { NEAREST_CITY: display, NEAREST_DATE: dateDisplay }
  if (best.city.ticket_url) attributes.NEAREST_TICKET_URL = best.city.ticket_url
  if (second) {
    attributes.SECOND_NEAREST_CITY = secondDisplay
    attributes.SECOND_NEAREST_DATE = secondDateDisplay
    if (second.city.ticket_url) attributes.SECOND_NEAREST_TICKET_URL = second.city.ticket_url
  }

  try {
    await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(s.email)}`, {
      method: 'PUT',
      headers: { 'api-key': apiKey, 'content-type': 'application/json' },
      body: JSON.stringify({ attributes }),
    }).then((r) => {
      if (!r.ok) throw new Error(`Brevo ${r.status}`)
    })
    synced++
    if (synced % 500 === 0) console.log(`  ...synced ${synced}/${matched} to Brevo`)
  } catch (err) {
    failed++
    console.error(`    Brevo sync failed for ${maskEmail(s.email)}: ${err.message}`)
  }
}

console.log(`\nMatched: ${matched}/${subscribers.length}  Brevo synced: ${synced}  Failed: ${failed}`)
if (!COMMIT) console.log('\n(DRY-RUN — rien écrit/envoyé. Relancer avec --commit pour appliquer.)')

await sql.end()
