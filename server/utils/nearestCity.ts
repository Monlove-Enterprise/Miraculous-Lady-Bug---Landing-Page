import { getSql, ensureSchema } from './db'

/**
 * Finds a subscriber's nearest upcoming tour stop, for the "Nearest to you"
 * block in the tour_announce/presale_open/onsale Brevo emails
 * (emails/partials/city-block.html, {{ contact.NEAREST_CITY }} /
 * {{ contact.NEAREST_DATE }}) — Math, 2026-10-16: tested the tour_announce
 * email and that block rendered blank, because nothing ever computed or sent
 * those two attributes. Only usable when the subscriber picked a real
 * autocomplete suggestion (Photon-geocoded) rather than typing free text, so
 * lat/lng may be unset — callers must handle that (block just stays empty,
 * same graceful-degradation the rest of the signup flow already uses).
 */

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

/**
 * Nearest tour-format city with a known lat/lng and a start_date (so there's
 * something to show as NEAREST_DATE), closest first. Returns undefined if the
 * subscriber has no coordinates, or no eligible city exists yet.
 */
export async function findNearestCity(
  lat: number | undefined,
  lng: number | undefined,
): Promise<NearestCity | undefined> {
  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) return undefined

  await ensureSchema()
  const db = getSql()
  const rows = await db<(CityGeoRow & { lat: number; lng: number })[]>`
    SELECT slug, city, region, start_date, ticket_url, lat, lng
    FROM cities
    WHERE format = 'tournee'
      AND lat IS NOT NULL AND lng IS NOT NULL
      AND start_date IS NOT NULL
      AND status != 'epuisee'
  `
  if (!rows.length) return undefined

  let best: (CityGeoRow & { lat: number; lng: number }) | undefined
  let bestDist = Infinity
  for (const row of rows) {
    const d = distanceKm(lat, lng, Number(row.lat), Number(row.lng))
    if (d < bestDist) {
      bestDist = d
      best = row
    }
  }
  if (!best) return undefined

  return {
    slug: best.slug,
    display: [best.city, best.region].filter(Boolean).join(', '),
    dateDisplay: new Date(best.start_date!).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    ticketUrl: best.ticket_url,
  }
}
