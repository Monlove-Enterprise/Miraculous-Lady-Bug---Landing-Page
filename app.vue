<script setup lang="ts">
// Per-route canonical + og:url so each page (home, legal pages) points to its
// own URL — a single hard-coded canonical would tell Google the legal pages are
// duplicates of the home page.
const route = useRoute()
const canonical = computed(() => `https://miraculousladybuglive.com${route.path}`)

// /villes and /cities (and their :slug pairs) serve identical content at two
// different URLs — English visitors get /cities, French get /villes (see
// useLocale's citiesPath()/cityPath()). Without a signal, that looks like
// duplicate content to a crawler. hreflang tells it these are intentional
// language alternates rather than letting one canonical swallow the other's
// indexing (Math, 2026-10-21 SEO audit) — mirrors the sitemap.xml annotations
// from scripts/generate-sitemap.mjs.
const citiesAlternates = computed(() => {
  const m = route.path.match(/^\/(villes|cities)(\/.*)?$/)
  if (!m) return []
  const rest = m[2] ?? ''
  const frHref = `https://miraculousladybuglive.com/villes${rest}`
  const enHref = `https://miraculousladybuglive.com/cities${rest}`
  return [
    { rel: 'alternate', hreflang: 'fr', href: frHref },
    { rel: 'alternate', hreflang: 'en', href: enHref },
    { rel: 'alternate', hreflang: 'x-default', href: frHref },
  ]
})

useHead({
  link: () => [{ rel: 'canonical', href: canonical.value }, ...citiesAlternates.value],
  meta: [{ property: 'og:url', content: canonical }],
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPage />
  <CookieBanner />
</template>
