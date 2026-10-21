// Per-page social share card (Open Graph + Twitter) — Math, 2026-10-21 SEO
// audit: every page fell back to the same global title/description/image
// from nuxt.config.ts, so sharing e.g. a city's ticket link or a cast
// member's bio showed the generic homepage card instead of anything
// specific to that page. Meta tags only — nothing visible on the page
// itself changes.
export function usePageMeta(opts: {
  title: () => string
  description?: () => string | undefined
  image?: () => string | undefined
}) {
  useHead(() => {
    const title = opts.title()
    const description = opts.description?.()
    const image = opts.image?.()
    const meta: Array<{ name?: string; property?: string; content: string }> = [
      { property: 'og:title', content: title },
      { name: 'twitter:title', content: title },
    ]
    if (description) {
      meta.push(
        { name: 'description', content: description },
        { property: 'og:description', content: description },
        { name: 'twitter:description', content: description },
      )
    }
    if (image) {
      meta.push(
        { property: 'og:image', content: image },
        { property: 'og:image:secure_url', content: image },
        { name: 'twitter:image', content: image },
      )
    }
    return { title, meta }
  })
}
