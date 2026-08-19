// Client-only: if the visitor already accepted cookies on a previous visit,
// load the Meta pixel immediately on startup. First-time (or previously
// declined-then-cleared) visitors see the banner instead — CookieBanner.vue
// calls enable() when they accept.
export default defineNuxtPlugin(() => {
  const { consent, load } = useConsent()
  const { enable } = useMetaPixel()
  load()
  if (consent.value === 'accepted') enable()
})
