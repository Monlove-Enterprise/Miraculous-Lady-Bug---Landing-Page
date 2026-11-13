// Shared UTM tagging for "Buy Tickets" click destinations — Math,
// 2026-11-13: separate from pages/villes/[ville].vue's own withUtm (which
// already tags that page's ticket links with a different scheme); kept
// distinct rather than merged until Math confirms whether to unify them.
export function withBuyTicketsUtm(url: string, citySlug: string): string {
  if (!/^https?:\/\//.test(url)) return url
  try {
    const u = new URL(url)
    u.searchParams.set('utm_source', 'miraculouslive')
    u.searchParams.set('utm_medium', 'website')
    u.searchParams.set('utm_content', citySlug)
    return u.toString()
  } catch {
    return url
  }
}
