import type { CityRow } from '~/server/api/cities.get'

// A city listing row is normally one city = one line. Tour stops with two
// distinct nights (e.g. Kitchener: Mar 6 AND Mar 7) are two separate
// performances, not a date range — Math, 2026-10-15: "Kitchener needs two
// entire lines... not two dates on the same line, but two entire lines" —
// so they render as two full rows here, each with its own single date,
// sharing the same venue/ticket link/slug/status. Shared by the homepage
// upcoming-dates list and pages/villes/index.vue so both stay in sync.
export interface CityDisplayRow extends CityRow {
  rowKey: string
  displayDate: string | null
  displayTime: string | null
  displayTicketUrl: string | null
}

export function toCityDisplayRows(cities: CityRow[]): CityDisplayRow[] {
  return cities.flatMap((c) => {
    if (c.format === 'tournee' && c.endDate && c.endDate !== c.startDate) {
      return [
        [c.startDate, c.startTime, c.startTicketUrl ?? c.ticketUrl],
        [c.endDate, c.endTime, c.endTicketUrl ?? c.ticketUrl],
      ].map(([d, time, url], i) => ({
        ...c,
        rowKey: `${c.slug}-${i}`,
        displayDate: d,
        displayTime: time,
        displayTicketUrl: url,
      }))
    }
    return [
      {
        ...c,
        rowKey: c.slug,
        displayDate: c.startDate,
        displayTime: c.startTime,
        displayTicketUrl: c.startTicketUrl ?? c.ticketUrl,
      },
    ]
  })
}

// `time` is a Postgres `time` value serialized as "HH:MM:SS", venue-local —
// never converted, same principle as formatCityDate's timeZone:'UTC' (a
// showtime is a fact about the venue, not about the viewer).
export function formatCityTime(time: string | null, locale: string): string {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const d = new Date(Date.UTC(2000, 0, 1, h, m))
  return d.toLocaleTimeString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  })
}

export function formatCityDate(d: string | null, locale: string): string {
  if (!d) return ''
  // Math, 2026-10-20: a viewer in Montreal saw Feb 26 for a Feb 27 show —
  // `d` is a plain calendar date (no time), but without timeZone:'UTC' here
  // it's parsed as UTC midnight then rendered in the *viewer's* local zone,
  // rolling back a day for anyone west of UTC (Paris, east of UTC, never
  // saw it). timeZone:'UTC' makes the displayed date match the stored date
  // for every viewer, regardless of where they are.
  return new Date(d).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
