// Single source of truth for the presale -> general on-sale cutover, shared
// between the homepage countdown banner (components/NewHomepage.vue) and the
// server-side "send the presale code on sign-up" logic
// (server/api/subscribe.post.ts) — Math, 2026-10-21: "now when people are
// subscribing since the presale is open can we send them another email with
// the presale code". Explicit -04:00 (EDT, in effect in October) so this
// instant is correct regardless of the visitor's own time zone, same
// reasoning as utils/launchGate.ts's LAUNCH_AT.
export const GENERAL_ON_SALE_AT = Date.parse('2026-10-23T10:00:00-04:00')

export function isPresaleActive(now: number = Date.now()): boolean {
  return now < GENERAL_ON_SALE_AT
}
