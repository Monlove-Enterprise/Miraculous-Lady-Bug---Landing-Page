// TikTok Pixel loader — only ever activated AFTER cookie consent (mirrors
// useMetaPixel). enable() injects the base SDK, loads the pixel and fires a
// PageView; trackRegistration() fires the sign-up conversion.
const PIXEL_ID = 'DA86VHJC77U6VIRE2RS0'

let injected = false

function injectBaseCode() {
  const w = window as any
  const d = document
  const t = 'ttq'
  if (w[t] && w[t].load) return
  w.TiktokAnalyticsObject = t
  const ttq: any = (w[t] = w[t] || [])
  ttq.methods = [
    'page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once',
    'ready', 'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent',
    'revokeConsent', 'grantConsent',
  ]
  ttq.setAndDefer = function (obj: any, method: string) {
    obj[method] = function () {
      // eslint-disable-next-line prefer-rest-params
      obj.push([method].concat(Array.prototype.slice.call(arguments, 0)))
    }
  }
  for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i])
  ttq.instance = function (id: string) {
    const e = ttq._i[id] || []
    for (let n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n])
    return e
  }
  ttq.load = function (e: string, n?: any) {
    const r = 'https://analytics.tiktok.com/i18n/pixel/events.js'
    ttq._i = ttq._i || {}
    ttq._i[e] = []
    ttq._i[e]._u = r
    ttq._t = ttq._t || {}
    ttq._t[e] = +new Date()
    ttq._o = ttq._o || {}
    ttq._o[e] = n || {}
    const s = d.createElement('script')
    s.type = 'text/javascript'
    s.async = true
    s.src = r + '?sdkid=' + e + '&lib=' + t
    const f = d.getElementsByTagName('script')[0]
    f.parentNode!.insertBefore(s, f)
  }
}

export function useTikTokPixel() {
  /** Load the pixel and fire PageView. Idempotent + client-only. */
  function enable() {
    if (injected || typeof window === 'undefined') return
    injected = true
    injectBaseCode()
    const ttq = (window as any).ttq
    ttq.load(PIXEL_ID)
    ttq.page()
  }

  /** Fire the sign-up conversion. No-op if consent was not accepted. */
  function trackRegistration() {
    if (typeof window === 'undefined') return
    const ttq = (window as any).ttq
    if (injected && ttq) ttq.track('CompleteRegistration')
  }

  return { enable, trackRegistration }
}
