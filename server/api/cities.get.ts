import { getSql, ensureSchema, withDbTimeout } from '../utils/db'

export interface CityRow {
  id: number
  slug: string
  city: string
  region: string | null
  countryCode: string
  venue: string | null
  format: 'tournee' | 'residence'
  status: 'envisagee' | 'confirmee' | 'en_vente' | 'epuisee'
  startDate: string | null
  endDate: string | null
  startTime: string | null
  endTime: string | null
  openingAt: string | null
  ticketUrl: string | null
  startTicketUrl: string | null
  endTicketUrl: string | null
  lat: number | null
  lng: number | null
}

// Public, read-only — no PII, no financial fields (promoter/guarantee stay
// server-side only, never selected here).
export default defineEventHandler(async (): Promise<CityRow[]> => {
  await ensureSchema()
  const db = getSql()
  const rows = await withDbTimeout(
    db<any[]>`
      SELECT id, slug, city, region, country_code, venue, format, status,
             start_date, end_date, start_time, end_time, opening_at, ticket_url,
             start_ticket_url, end_ticket_url, lat, lng
      FROM cities
      ORDER BY start_date NULLS LAST, city ASC
    `,
    'GET /api/cities',
  )
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    city: r.city,
    region: r.region,
    countryCode: r.country_code,
    venue: r.venue,
    format: r.format,
    status: r.status,
    startDate: r.start_date,
    endDate: r.end_date,
    startTime: r.start_time,
    endTime: r.end_time,
    openingAt: r.opening_at,
    ticketUrl: r.ticket_url,
    startTicketUrl: r.start_ticket_url,
    endTicketUrl: r.end_ticket_url,
    lat: r.lat !== null ? Number(r.lat) : null,
    lng: r.lng !== null ? Number(r.lng) : null,
  }))
})
