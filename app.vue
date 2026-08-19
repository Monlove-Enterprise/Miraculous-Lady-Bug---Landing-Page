<script setup lang="ts">
// Per-route canonical + og:url so each page (home, legal pages) points to its
// own URL — a single hard-coded canonical would tell Google the legal pages are
// duplicates of the home page.
const route = useRoute()
const canonical = computed(() => `https://miraculousladybuglive.com${route.path}`)
useHead({
  link: [{ rel: 'canonical', href: canonical }],
  meta: [{ property: 'og:url', content: canonical }],
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPage />
  <CookieBanner />
</template>
