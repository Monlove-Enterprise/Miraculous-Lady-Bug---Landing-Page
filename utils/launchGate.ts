// Automatic site switch-over: the full multi-page site goes live the moment
// the tour is announced. Math needs it to flip with no manual action on the
// day itself (confirmed 2026-10-07: not available to push a deploy on the
// 13th). Until this instant, every route except the current live landing +
// its legal pages serves exactly what's in production today; from this
// instant on, the whole new site is reachable automatically.
//
// 2026-10-13T01:00:00 America/New_York (EDT, UTC-4 — DST doesn't end until
// the following week, so this offset is correct for the cutover date
// itself). Works out to 2026-10-13T07:00 Paris (CEST) — Math wants it live
// with margin before he leaves home that morning (confirmed 2026-10-07),
// and wants zero manual steps that day either way.
export const LAUNCH_AT = Date.parse('2026-10-13T01:00:00-04:00')

export function isLaunched(now: number = Date.now()): boolean {
  return now >= LAUNCH_AT
}
