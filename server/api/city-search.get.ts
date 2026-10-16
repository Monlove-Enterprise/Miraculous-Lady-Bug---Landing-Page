/**
 * GET /api/city-search?q=mont&lang=fr
 *
 * City autocomplete for the sign-up form. The provider is proxied server-side so
 * the front-end never holds an API key and results come back normalised
 * (city + country + country code) for clean per-city geo-demand analysis.
 *
 * Default provider is Photon (Komoot / OpenStreetMap): free, no API key. It can
 * be swapped for a paid provider (e.g. Google Places) later without touching the
 * front-end — only this file changes.
 */

export interface CitySuggestion {
  /** Display string shown in the dropdown, e.g. "Montréal, Québec, Canada". */
  label: string
  /** City name stored as the `city` field, e.g. "Montréal". */
  city: string
  /** Country name, e.g. "Canada". */
  country?: string
  /** ISO country code, e.g. "CA". */
  countryCode?: string
  /** Region/state, used only to disambiguate the label. */
  state?: string
  /** Latitude/longitude, used server-side to find the subscriber's nearest
   *  tour stop (see server/api/subscribe.post.ts) — Photon already returns
   *  these on every feature, just forwarded through here. */
  lat?: number
  lng?: number
}

// Photon's `layer=city` already narrows to populated places; this is a safety
// net against the occasional region/county slipping through.
const PLACE_TYPES = new Set(['city', 'town', 'village', 'municipality', 'district'])

// Rank populated places so a real city (e.g. Montréal QC) sorts above a tiny
// same-named village (e.g. Montreal, Wisconsin) that Photon matches first on an
// unaccented query. Use the OSM tag `osm_value` (city/town/village) — Photon's
// coarse `type` is "city" for every populated place, so it can't tell them
// apart. Tie-break by geographic extent (bigger place first). Lower = higher.
const TYPE_RANK: Record<string, number> = {
  city: 0,
  municipality: 1,
  town: 2,
  village: 3,
  hamlet: 4,
  district: 5,
}
function placeRank(f: PhotonFeature): number {
  return TYPE_RANK[f.properties?.osm_value || ''] ?? 6
}
function extentArea(f: PhotonFeature): number {
  const e = f.properties?.extent
  if (!e || e.length < 4) return 0
  return Math.abs(e[2] - e[0]) * Math.abs(e[1] - e[3])
}
function comparePlaces(a: PhotonFeature, b: PhotonFeature): number {
  return placeRank(a) - placeRank(b) || extentArea(b) - extentArea(a)
}

export default defineEventHandler(async (event): Promise<CitySuggestion[]> => {
  const query = getQuery(event)
  const q = ((query.q as string) || '').trim()
  const lang = normLang(query.lang as string)
  if (q.length < 2) return []

  try {
    return await searchPhoton(q, lang)
  } catch (err: any) {
    console.error('[city-search] provider failed:', err?.message || err)
    return []
  }
})

// Photon only supports a handful of UI languages; fall back to English.
function normLang(raw?: string): string {
  const l = (raw || 'en').slice(0, 2).toLowerCase()
  return ['fr', 'en', 'de', 'it'].includes(l) ? l : 'en'
}

interface PhotonFeature {
  properties?: {
    name?: string
    country?: string
    countrycode?: string
    state?: string
    type?: string
    osm_value?: string
    extent?: number[]
  }
  // GeoJSON Point: [lng, lat] — note the order.
  geometry?: {
    coordinates?: [number, number]
  }
}

async function searchPhoton(q: string, lang: string): Promise<CitySuggestion[]> {
  const url =
    'https://photon.komoot.io/api/' +
    `?q=${encodeURIComponent(q)}` +
    `&lang=${lang}` +
    '&limit=10' +
    '&layer=city'

  const res = await $fetch<{ features?: PhotonFeature[] }>(url)
  // Float real cities (and larger places) above tiny same-named villages.
  const feats = (res.features || []).slice().sort(comparePlaces)
  const seen = new Set<string>()
  const out: CitySuggestion[] = []

  for (const f of feats) {
    const p = f.properties || {}
    const type = p.type || p.osm_value
    if (type && !PLACE_TYPES.has(type)) continue

    const city = p.name?.trim()
    if (!city) continue

    const label = [city, p.state, p.country].filter(Boolean).join(', ')
    const key = label.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)

    const [lng, lat] = f.geometry?.coordinates || []

    out.push({
      label,
      city,
      country: p.country || undefined,
      countryCode: p.countrycode || undefined,
      state: p.state || undefined,
      lat,
      lng,
    })
    if (out.length >= 6) break
  }

  return out
}
