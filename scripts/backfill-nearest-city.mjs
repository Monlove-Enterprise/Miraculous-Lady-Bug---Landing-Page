#!/usr/bin/env node
/**
 * Backfills NEAREST_CITY/NEAREST_DATE for subscribers who signed up before
 * that feature existed — Math, 2026-10-16: tested the tour_announce email
 * and the "Nearest to you" block rendered blank for a subscriber who typed
 * "New York" at signup, because nothing ever computed those attributes.
 *
 * For each subscriber missing lat/lng (nothing to do for ones who already
 * have it — they got it at signup via the autocomplete pick): geocodes
 * their stored free-text `city` (Nominatim — see geocodeCity below for why
 * not Photon, which the live autocomplete still uses), finds the nearest
 * (and, if genuinely nearby, second-nearest — see CLUSTER_RADIUS_KM)
 * tour-format city from the `cities` table (haversine), stores lat/lng +
 * nearest_city_slug in Postgres, then pushes ONLY { NEAREST_CITY,
 * NEAREST_DATE, NEAREST_TICKET_URL, SECOND_NEAREST_* } to Brevo via a
 * targeted PUT (merges into the existing contact — every other attribute,
 * list membership, etc. is left untouched, same pattern as
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

// This script connects directly, so it never runs through the Nuxt server's
// ensureSchema() (server/utils/db.ts) — these columns wouldn't exist yet on
// a fresh run. Same idempotent ALTER TABLE statements, safe to repeat.
await sql`ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS lat numeric`
await sql`ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS lng numeric`
await sql`ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS nearest_city_slug text`

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

// Found mid-run (twice): a plain fetch() with no timeout hung forever on a
// dead TCP handshake, and — root cause — Photon (photon.komoot.io, the same
// free provider server/api/city-search.get.ts uses for the live autocomplete)
// started outright refusing connections from this IP partway through,
// confirmed with a raw `nc` test (Connection refused, not a timeout) after
// the burst of requests from the first failed run. Switched this one-off
// batch script to Nominatim (OpenStreetMap's own geocoder) instead — the
// live autocomplete endpoint is untouched and keeps using Photon. Nominatim
// requires an identifying User-Agent and caps at 1 request/second; the
// delay below respects that with margin.
// Math, 2026-10-17: "can you verify everyone that are in the lists close to
// the cities" — checked before committing, and found a real bug: 95 city
// strings (e.g. "London" x301, "Paris" x63, "Perth" x33) are used by
// subscribers in TWO different countries, and an unconstrained search would
// resolve every one of them to the same place (whichever Nominatim ranks
// globally first) — the London-Ontario people would have silently gotten
// London-UK's result instead of correctly matching Kitchener nearby. Now
// constrains the search to the subscriber's own stored country_code
// (available for 8677/8829 = 98%) via Nominatim's countrycodes param.
async function geocodeCity(city, countryCode, attempt = 1) {
  const cc = countryCode ? `&countrycodes=${countryCode.toLowerCase()}` : ''
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1${cc}`
  let res
  try {
    res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'MiraculousLiveBackfill/1.0 (one-off subscriber nearest-city backfill)' },
    })
  } catch (err) {
    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 2000))
      return geocodeCity(city, countryCode, attempt + 1)
    }
    throw err
  }
  if (!res.ok) return undefined
  const json = await res.json()
  const f = json?.[0]
  if (!f?.lat || !f?.lon) return undefined
  return { lat: Number(f.lat), lng: Number(f.lon) }
}

const subscribers = await sql`
  SELECT id, email, city, country_code
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

// Many subscribers share the same free-text city ("New York" x hundreds) —
// geocode each DISTINCT (city, country) pair once, not once per subscriber.
// Keyed by country too (not just city), per the ambiguous-city-name fix
// above — "london|gb" and "london|ca" are different pairs, geocoded
// separately. 8829 subscribers but only ~3100 distinct pairs in production.
function cacheKey(city, countryCode) {
  return `${city.trim().toLowerCase()}|${(countryCode || '').toUpperCase()}`
}
const uniquePairs = [
  ...new Map(subscribers.map((s) => [cacheKey(s.city, s.country_code), { city: s.city, countryCode: s.country_code }])).values(),
]

console.log(`\n=== BACKFILL NEAREST CITY — ${COMMIT ? 'COMMIT' : 'DRY-RUN (rien envoyé/écrit)'} ===`)
console.log(`Abonnés à traiter : ${subscribers.length}`)
console.log(`Paires ville+pays distinctes à géocoder : ${uniquePairs.length}`)
console.log(`Villes de tournée éligibles : ${tourCities.length}\n`)

if (!tourCities.length) {
  console.log('Aucune ville de tournée avec lat/lng + start_date — rien à faire.')
  await sql.end()
  process.exit(0)
}

// Same CLUSTER_RADIUS_KM logic as server/utils/nearestCity.ts — Math,
// 2026-10-16: "in new york there is two dates staten island and brookyl",
// a second nearby city only counts when it's genuinely close to the
// SUBSCRIBER (not relative to the first match).
const CLUSTER_RADIUS_KM = 40

function nearestOf(lat, lng) {
  const ranked = tourCities
    .map((c) => ({ city: c, dist: distanceKm(lat, lng, Number(c.lat), Number(c.lng)) }))
    .sort((a, b) => a.dist - b.dist)
  const best = ranked[0]?.city
  const bestDist = ranked[0]?.dist
  const second = ranked[1] && ranked[1].dist <= CLUSTER_RADIUS_KM ? ranked[1].city : undefined
  const secondDist = ranked[1] && ranked[1].dist <= CLUSTER_RADIUS_KM ? ranked[1].dist : undefined
  return { best, bestDist, second, secondDist }
}

// Pass 1: geocode each distinct (city, country) pair once, cache the result.
const cache = new Map() // cacheKey(city, countryCode) -> { best, bestDist, second, secondDist, coords } | null
let geocoded = 0
let geocodeFailed = 0
for (const { city, countryCode } of uniquePairs) {
  // Nominatim's usage policy caps at 1 request/second — 1100ms gives margin.
  // At ~3100 distinct pairs this pass alone takes ~55 minutes; unavoidable
  // for a free, policy-respecting provider at this volume.
  await new Promise((r) => setTimeout(r, 1100))
  const key = cacheKey(city, countryCode)
  const coords = await geocodeCity(city, countryCode).catch(() => undefined)
  if (!coords) {
    cache.set(key, null)
    geocodeFailed++
    continue
  }
  cache.set(key, { ...nearestOf(coords.lat, coords.lng), coords })
  geocoded++
  if (geocoded % 25 === 0) console.log(`  ...geocoded ${geocoded}/${uniquePairs.length} distinct pairs`)
}
console.log(`\nGeocoding done: ${geocoded} resolved, ${geocodeFailed} failed, out of ${uniquePairs.length} distinct pairs.\n`)

// Pass 2: apply the cached result to every subscriber (DB write is cheap/batched
// per unique city; Brevo still needs one call per subscriber — unavoidable,
// each contact is a separate record).
let matched = 0
let synced = 0
let failed = 0

for (const s of subscribers) {
  const key = cacheKey(s.city, s.country_code)
  const hit = cache.get(key)
  if (!hit?.best) {
    failed++
    continue
  }
  const { best, bestDist, second, secondDist, coords } = hit
  matched++

  const display = [best.city, best.region].filter(Boolean).join(', ')
  const dateDisplay = new Date(best.start_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const secondDisplay = second ? [second.city, second.region].filter(Boolean).join(', ') : undefined
  const secondDateDisplay = second
    ? new Date(second.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : undefined

  if (matched <= 20 || matched % 500 === 0) {
    const secondNote = second ? ` + ${secondDisplay} (${Math.round(secondDist)}km)` : ''
    console.log(
      `  ${maskEmail(s.email)}  "${s.city}" -> ${display} (${dateDisplay}), ${Math.round(bestDist)}km${secondNote}`,
    )
  }

  if (!COMMIT) continue

  await sql`
    UPDATE subscribers
    SET lat = ${coords.lat}, lng = ${coords.lng}, nearest_city_slug = ${best.slug}, updated_at = now()
    WHERE id = ${s.id}
  `

  const attributes = { NEAREST_CITY: display, NEAREST_DATE: dateDisplay }
  if (best.ticket_url) attributes.NEAREST_TICKET_URL = best.ticket_url
  if (second) {
    attributes.SECOND_NEAREST_CITY = secondDisplay
    attributes.SECOND_NEAREST_DATE = secondDateDisplay
    if (second.ticket_url) attributes.SECOND_NEAREST_TICKET_URL = second.ticket_url
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
    console.error(`    Brevo sync failed for ${maskEmail(s.email)}: ${err.message}`)
  }
}

console.log(`\nMatched: ${matched}/${subscribers.length}  Brevo synced: ${synced}  No match (geocode/city-match failed): ${failed}`)
if (!COMMIT) console.log('\n(DRY-RUN — rien écrit/envoyé. Relancer avec --commit pour appliquer.)')

await sql.end()
