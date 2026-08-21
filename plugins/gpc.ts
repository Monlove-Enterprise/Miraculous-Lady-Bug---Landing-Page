// Global Privacy Control detection (universal — runs on server and client).
//
// GPC is a browser signal that legally means "opt out of ad tracking" (CCPA/
// CPRA). We read it from the Sec-GPC request header (SSR) and from
// navigator.globalPrivacyControl (client), and expose it as useState('gpc').
// It is treated as a refusal for the advertising pixel — but it NEVER overrides
// an explicit choice the visitor already made (see useConsent effectiveConsent).
export default defineNuxtPlugin(() => {
  const gpc = useState<boolean>('gpc', () => false)

  if (import.meta.server) {
    const headers = useRequestHeaders(['sec-gpc'])
    if (headers['sec-gpc'] === '1') gpc.value = true
  } else if (typeof navigator !== 'undefined' && (navigator as any).globalPrivacyControl === true) {
    gpc.value = true
  }
})
