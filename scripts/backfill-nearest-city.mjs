#!/usr/bin/env node
/**
 * Backfills NEAREST_CITY/NEAREST_DATE for subscribers who signed up before
 * that feature existed — Math, 2026-10-16: tested the tour_announce email
 * and the "Nearest to you" block rendered blank for a subscriber who typed
 * "New York" at signup, because nothing ever computed those attributes.
 *
 * For each subscriber missing lat/lng (nothing to do for ones who already
 * have it — they got it at signup via the autocomplete pick): geocodes
 * their stored free-text `city` via the same Photon provider the
 * autocomplete uses, finds the nearest tour-format city from the `cities`
 * table (haversine), stores lat/lng + nearest_city_slug in Postgres, then
 * pushes ONLY { NEAREST_CITY, NEAREST_DATE } to Brevo via a targeted PUT
 * (merges into the existing contact — every other attribute, list
 * membership, etc. is left untouched, same pattern as
 * scripts/resync-phone-brevo.mjs).
 *
 * Dry-run by default (no DB writes, no Brevo calls). `--commit` applies.
 *
 *   node scripts/backfill-nearest-city.mjs            # DRY-RUN
 *   node scripts/backfill-nearest-city.mjs --commit
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

async function geocodeCity(city) {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(city)}&lang=en&limit=1&layer=city`
  const res = await fetch(url)
  if (!res.ok) return undefined
  const json = await res.json()
  const f = json.features?.[0]
  const coords = f?.geometry?.coordinates // [lng, lat]
  if (!coords) return undefined
  return { lng: coords[0], lat: coords[1] }
}

const subscribers = await sql`
  SELECT id, email, city
  FROM subscribers
  WHERE (lat IS NULL OR lng IS NULL)
    AND city IS NOT NULL AND city != ''
  ORDER BY id
`

const tourCities = await sql`
  SELECT slug, city, region, start_date, ticket_url, lat, lng
  FROM cities
  WHERE format = 'tournee'
    AND lat IS NOT NULL AND lng IS NOT NULL
    AND start_date IS NOT NULL
    AND status != 'epuisee'
`

console.log(`\n=== BACKFILL NEAREST CITY — ${COMMIT ? 'COMMIT' : 'DRY-RUN (rien envoyé/écrit)'} ===`)
console.log(`Abonnés à traiter : ${subscribers.length}`)
console.log(`Villes de tournée éligibles : ${tourCities.length}\n`)

if (!tourCities.length) {
  console.log('Aucune ville de tournée avec lat/lng + start_date — rien à faire.')
  await sql.end()
  process.exit(0)
}

let geocoded = 0
let matched = 0
let synced = 0
let failed = 0

for (const s of subscribers) {
  // Photon has no documented hard rate limit but is a shared free service —
  // a small delay keeps this a polite, best-effort batch job.
  await new Promise((r) => setTimeout(r, 150))

  const coords = await geocodeCity(s.city).catch(() => undefined)
  if (!coords) {
    console.log(`  ${maskEmail(s.email)}  "${s.city}" -> geocode failed, skipped`)
    failed++
    continue
  }
  geocoded++

  let best
  let bestDist = Infinity
  for (const c of tourCities) {
    const d = distanceKm(coords.lat, coords.lng, Number(c.lat), Number(c.lng))
    if (d < bestDist) {
      bestDist = d
      best = c
    }
  }
  if (!best) continue
  matched++

  const display = [best.city, best.region].filter(Boolean).join(', ')
  const dateDisplay = new Date(best.start_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  console.log(
    `  ${maskEmail(s.email)}  "${s.city}" -> ${display} (${dateDisplay}), ${Math.round(bestDist)}km`,
  )

  if (!COMMIT) continue

  await sql`
    UPDATE subscribers
    SET lat = ${coords.lat}, lng = ${coords.lng}, nearest_city_slug = ${best.slug}, updated_at = now()
    WHERE id = ${s.id}
  `

  const attributes = { NEAREST_CITY: display, NEAREST_DATE: dateDisplay }
  if (best.ticket_url) attributes.NEAREST_TICKET_URL = best.ticket_url

  try {
    await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(s.email)}`, {
      method: 'PUT',
      headers: { 'api-key': apiKey, 'content-type': 'application/json' },
      body: JSON.stringify({ attributes }),
    }).then((r) => {
      if (!r.ok) throw new Error(`Brevo ${r.status}`)
    })
    synced++
  } catch (err) {
    console.error(`    Brevo sync failed for ${maskEmail(s.email)}: ${err.message}`)
  }
}

console.log(`\nGeocoded: ${geocoded}/${subscribers.length}  Matched: ${matched}  Brevo synced: ${synced}  Failed: ${failed}`)
if (!COMMIT) console.log('\n(DRY-RUN — rien écrit/envoyé. Relancer avec --commit pour appliquer.)')

await sql.end()
