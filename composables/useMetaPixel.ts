// Meta (Facebook) Pixel loader — only ever activated AFTER cookie consent.
//
// enable()  → injects the base pixel snippet once, then fires PageView.
// trackLead() → fires the sign-up conversion (only if the pixel is loaded).
//
// The standard Meta snippet ships a <noscript><img> fallback that fires
// unconditionally; it is deliberately omitted here so nothing tracks without
// consent. The readable code below is the exact equivalent of that snippet.
const PIXEL_ID = '1686724105767256'

let injected = false

function injectBaseCode() {
  const f = window as any
  if (f.fbq) return
  const n: any = (f.fbq = function () {
    // eslint-disable-next-line prefer-rest-params
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
  })
  if (!f._fbq) f._fbq = n
  n.push = n
  n.loaded = true
  n.version = '2.0'
  n.queue = []
  const t = document.createElement('script')
  t.async = true
  t.src = 'https://connect.facebook.net/en_US/fbevents.js'
  const s = document.getElementsByTagName('script')[0]
  s.parentNode!.insertBefore(t, s)
}

export function useMetaPixel() {
  /** Load the pixel and fire PageView. Idempotent + client-only. */
  function enable() {
    if (injected || typeof window === 'undefined') return
    injected = true
    injectBaseCode()
    const f = window as any
    f.fbq('init', PIXEL_ID)
    f.fbq('track', 'PageView')
  }

  /** Fire the sign-up conversion. No-op if consent was not accepted. */
  function trackLead() {
    if (typeof window === 'undefined') return
    const f = window as any
    if (injected && f.fbq) f.fbq('track', 'Lead')
  }

  return { enable, trackLead }
}
