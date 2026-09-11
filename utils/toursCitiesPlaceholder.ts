// Shared placeholder data for pages/villes/index.vue and pages/villes/[ville].vue.
// No tour dates are confirmed yet — every entry here is a TODO example, not
// real info (see CLAUDE.md chantier 3). Once the `cities` Supabase table
// exists, both pages switch to fetching it; this file goes away, the
// City/CityStatus shape stays the contract the template already renders.
export type CityStatus = 'envisagee' | 'confirmee' | 'en_vente' | 'epuisee'

export interface City {
  slug: string
  cityFr: string
  cityEn: string
  countryFr: string
  countryEn: string
  venue?: string // TODO — real venue name once booked
  dates?: string // TODO — display string once dates are set
  status: CityStatus
  openingDate?: string // ISO datetime (UTC) — ticket sale opening, when known
  ticketUrl?: string // TODO — real ticketing link once on sale (UTM appended at render)
}

export const cities: City[] = [
  {
    slug: 'paris',
    cityFr: 'Paris',
    cityEn: 'Paris',
    countryFr: 'France',
    countryEn: 'France',
    venue: 'TODO — salle à confirmer',
    dates: 'TODO',
    status: 'en_vente',
    ticketUrl: '#',
  },
  {
    slug: 'los-angeles',
    cityFr: 'Los Angeles',
    cityEn: 'Los Angeles',
    countryFr: 'États-Unis',
    countryEn: 'United States',
    venue: 'TODO — venue TBC',
    dates: 'TODO',
    status: 'confirmee',
    // Near-future placeholder so the live countdown is visible when browsing.
    openingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    slug: 'londres',
    cityFr: 'Londres',
    cityEn: 'London',
    countryFr: 'Royaume-Uni',
    countryEn: 'United Kingdom',
    venue: 'TODO — venue TBC',
    dates: 'TODO',
    status: 'confirmee',
  },
  {
    slug: 'mexico',
    cityFr: 'Mexico',
    cityEn: 'Mexico City',
    countryFr: 'Mexique',
    countryEn: 'Mexico',
    status: 'envisagee',
  },
  {
    slug: 'toronto',
    cityFr: 'Toronto',
    cityEn: 'Toronto',
    countryFr: 'Canada',
    countryEn: 'Canada',
    status: 'envisagee',
  },
  {
    slug: 'new-york',
    cityFr: 'New York',
    cityEn: 'New York',
    countryFr: 'États-Unis',
    countryEn: 'United States',
    venue: 'TODO',
    dates: 'TODO',
    status: 'epuisee',
  },
]

export function findCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug)
}

/**
 * Appends standard attribution UTM params to an outbound ticketing link, per
 * CLAUDE.md chantier 3 ("UTM apposés sur les liens sortants billetterie").
 * Leaves a non-http(s) placeholder (e.g. "#") untouched.
 */
export function withTicketUtm(url: string, citySlug: string): string {
  if (!/^https?:\/\//.test(url)) return url
  try {
    const u = new URL(url)
    u.searchParams.set('utm_source', 'miraculousladybuglive')
    u.searchParams.set('utm_medium', 'villes')
    u.searchParams.set('utm_campaign', citySlug)
    return u.toString()
  } catch {
    return url
  }
}
