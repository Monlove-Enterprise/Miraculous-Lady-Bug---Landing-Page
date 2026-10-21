// Originally an automatic switch-over timed to General On Sale (confirmed
// 2026-10-08 — Math: "the site should be live only the 23rd when it's the
// official general onsale"). Math chose to go live manually on 2026-10-21
// instead, ahead of that planned cutover, so the gate is left permanently
// open rather than waiting for LAUNCH_AT. Kept for the record of the
// original plan; isLaunched() no longer reads it.
export const LAUNCH_AT = Date.parse('2026-10-23T01:00:00-04:00')

export function isLaunched(_now: number = Date.now()): boolean {
  return true
}
