import { getSql, ensureSchema } from './db'

/**
 * Finds a subscriber's nearest upcoming tour stop(s), for the "Nearest to
 * you" block in the tour_announce/presale_open/onsale Brevo emails
 * (emails/partials/city-block.html, {{ contact.NEAREST_CITY }} /
 * {{ contact.NEAREST_DATE }} / {{ contact.SECOND_NEAREST_CITY }} / ...) —
 * Math, 2026-10-16: tested the tour_announce email and that block rendered
 * blank, because nothing ever computed or sent those attributes.
 *
 * Returns up to two cities, not just the single closest one — Math,
 * 2026-10-16: "in new york there is two dates staten island and brookyl" —
 * a subscriber near NYC should see BOTH (Brooklyn 9km, Staten Island
 * 24km from midtown), not just whichever happens to be marginally
 * closer. A second city is only included when it's genuinely nearby too
 * (within CLUSTER_RADIUS_KM of the SUBSCRIBER, not relative to the first
 * city) — verified this doesn't over-trigger: Toronto -> Kitchener only
 * (next nearest, Greensburg PA, is 373km away); New Brunswick NJ (48km
 * from midtown) correctly stays excluded from the NYC pair.
 *
 * Only usable when the subscriber picked a real autocomplete suggestion
 * (Photon-geocoded) rather than typing free text, so lat/lng may be unset
 * — callers must handle that (block just stays empty, same graceful-
 * degradation the rest of the signup flow already uses).
 */

const CLUSTER_RADIUS_KM = 40

export interface NearestCity {
  slug: string
  /** "Brooklyn, NY" / "Jacksonville, FL" — city + region, no country (all
   *  tour stops so far are US/CA, matching the dates list elsewhere). */
  display: string
  /** "March 9, 2027" — matches the full-month style used in email copy
   *  elsewhere (e.g. "your exclusive presale opens October 21"). */
  dateDisplay: string
  /** Null until the city's ticket_url is actually set (presale/general sale)
   *  — Math, 2026-10-16: "we could have the link buy tickets directyes", a
   *  direct per-city buy link in the "Nearest to you" block. The email
   *  template wraps its button in a Brevo {% if %} so nothing dead-link
   *  shows before a city is actually on sale. */
  ticketUrl: string | null
}

export interface NearestCities {
  primary: NearestCity
  /** A second tour stop within CLUSTER_RADIUS_KM of the subscriber, if one
   *  exists — e.g. Brooklyn + Staten Island for a NYC-area subscriber.
   *  Undefined when nothing else is genuinely nearby (most cities). */
  secondary?: NearestCity
}

interface CityGeoRow {
  slug: string
  city: string
  region: string | null
  start_date: string | null
  ticket_url: string | null
}

/** Great-circle distance in km between two lat/lng points (haversine). */
function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

function toNearestCity(row: CityGeoRow): NearestCity {
  return {
    slug: row.slug,
    display: [row.city, row.region].filter(Boolean).join(', '),
    // timeZone: 'UTC' — see utils/cityDisplayRows.ts formatCityDate for why
    // (a plain calendar date parsed without it rolls back a day for any
    // viewer west of UTC, e.g. Montreal).
    dateDisplay: new Date(row.start_date!).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }),
    ticketUrl: row.ticket_url,
  }
}

/**
 * Nearest (and, if genuinely close, second-nearest) tour-format city with a
 * known lat/lng and a start_date, closest first. Returns undefined if the
 * subscriber has no coordinates, or no eligible city exists yet.
 *
 * Excludes 'envisagee' (not yet confirmed) cities as well as 'epuisee' (sold
 * out) ones — Math, 2026-10-18: "Doha n'est pas 100% confirmée encore, ne me
 * mettez pas ça dans la mailing", caught live after Doha started showing up
 * as NEAREST_CITY for real Gulf-region signups. Same exclusion applied in
 * scripts/backfill-nearest-city.mjs and scripts/rematch-nearest-city.mjs.
 */
export async function findNearestCity(
  lat: number | undefined,
  lng: number | undefined,
): Promise<NearestCities | undefined> {
  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) return undefined

  await ensureSchema()
  const db = getSql()
  const rows = await db<(CityGeoRow & { lat: number; lng: number })[]>`
    SELECT slug, city, region, start_date, ticket_url, lat, lng
    FROM cities
    WHERE format = 'tournee'
      AND lat IS NOT NULL AND lng IS NOT NULL
      AND start_date IS NOT NULL
      AND status NOT IN ('epuisee', 'envisagee')
  `
  if (!rows.length) return undefined

  const ranked = rows
    .map((row) => ({ row, dist: distanceKm(lat, lng, Number(row.lat), Number(row.lng)) }))
    .sort((a, b) => a.dist - b.dist)

  const nearest = ranked[0]
  if (!nearest) return undefined

  const second = ranked[1]
  const secondary =
    second && second.dist <= CLUSTER_RADIUS_KM ? toNearestCity(second.row) : undefined

  return { primary: toNearestCity(nearest.row), secondary }
}
