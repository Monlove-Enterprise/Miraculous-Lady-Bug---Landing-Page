import { getSql, ensureSchema } from '../../utils/db'
import type { CityRow } from '../cities.get'

export interface PerformanceRow {
  id: number
  startsAt: string
  soldOut: boolean
  ticketUrl: string | null
}

export default defineEventHandler(async (event): Promise<{ city: CityRow; performances: PerformanceRow[] } | null> => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'slug requis' })

  await ensureSchema()
  const db = getSql()

  const [row] = await db<any[]>`
    SELECT id, slug, city, region, country_code, venue, format, status,
           start_date, end_date, opening_at, ticket_url, lat, lng
    FROM cities WHERE slug = ${slug}
  `
  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'Ville introuvable', fatal: false })
  }

  const city: CityRow = {
    id: row.id,
    slug: row.slug,
    city: row.city,
    region: row.region,
    countryCode: row.country_code,
    venue: row.venue,
    format: row.format,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date,
    openingAt: row.opening_at,
    ticketUrl: row.ticket_url,
    lat: row.lat !== null ? Number(row.lat) : null,
    lng: row.lng !== null ? Number(row.lng) : null,
  }

  let performances: PerformanceRow[] = []
  if (city.format === 'residence') {
    const perfRows = await db<any[]>`
      SELECT id, starts_at, sold_out, ticket_url
      FROM performances WHERE city_id = ${city.id}
      ORDER BY starts_at ASC
    `
    performances = perfRows.map((p) => ({
      id: p.id,
      startsAt: p.starts_at,
      soldOut: p.sold_out,
      ticketUrl: p.ticket_url,
    }))
  }

  return { city, performances }
})
