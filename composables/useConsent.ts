// Cookie-consent state for the (Meta) analytics pixel.
// GDPR/ePrivacy: the pixel must NOT load until the visitor explicitly accepts.
// The choice is remembered in localStorage so the banner is shown only once.
export type ConsentState = 'accepted' | 'declined' | 'unset'

const STORAGE_KEY = 'mlb-cookie-consent'

export function useConsent() {
  // Shared across components for this request. Starts 'unset'; hydrated from
  // localStorage on the client via load().
  const consent = useState<ConsentState>('cookieConsent', () => 'unset')

  function load() {
    if (typeof localStorage === 'undefined') return
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'accepted' || v === 'declined') consent.value = v
  }

  function set(v: 'accepted' | 'declined') {
    consent.value = v
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, v)
  }

  /** Clear the stored choice so the banner shows again (consent withdrawal). */
  function reset() {
    consent.value = 'unset'
    if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY)
  }

  return { consent, load, set, reset }
}
