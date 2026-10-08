// Automatic site switch-over: the full multi-page site goes live at General
// On Sale, not at the tour announcement (confirmed 2026-10-08 — Math:
// "the site should be live only the 23rd when it's the official general
// onsale", matching emails/content/onsale.json). Until this instant, every
// route except the current live landing + its legal pages serves exactly
// what's in production today; from this instant on, the whole new site is
// reachable automatically. No manual action needed that day either way
// (confirmed 2026-10-07: Math isn't available to push a deploy on the day).
//
// 2026-10-23T01:00:00 America/New_York (EDT, UTC-4 — DST doesn't end until
// the following week, so this offset is correct for the cutover date
// itself). Works out to 2026-10-23T07:00 Paris (CEST) — Math wants it live
// with margin before he leaves home that morning.
export const LAUNCH_AT = Date.parse('2026-10-23T01:00:00-04:00')

export function isLaunched(now: number = Date.now()): boolean {
  return now >= LAUNCH_AT
}
