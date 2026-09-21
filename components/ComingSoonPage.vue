<script setup lang="ts">
// Shared shell for nav sections that don't have content yet (The Story,
// Sights & Sounds, For Good, Reviews, VIP). Keeps them reachable from the nav
// today, swappable for real content later without touching the nav or layout.
const { t } = useLocale()
defineProps<{ title: string }>()
</script>

<template>
  <main class="stub">
    <SiteHeader />
    <div class="container">
      <NuxtLink to="/" class="back">← {{ t('nav.home') }}</NuxtLink>
      <h1 class="stub__title">{{ title }}</h1>
      <p class="stub__note">{{ t('stub.comingSoon') }}</p>
    </div>
    <SiteFooter />
  </main>
</template>

<style scoped>
.stub {
  min-height: 100dvh;
  padding-bottom: 6rem;
  background:
    radial-gradient(80% 50% at 20% 0%, rgba(244, 14, 4, 0.16), transparent 60%),
    var(--ink);
}
.container { padding-top: 3rem; }
.back {
  display: inline-block;
  color: var(--cream-dim);
  font-size: 0.9rem;
  margin-bottom: 2.5rem;
  transition: color 0.15s ease;
}
.back:hover { color: var(--red); }
.stub__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 3rem);
  color: var(--red);
  text-transform: uppercase;
  margin-bottom: 1rem;
}
.stub__note {
  display: inline-block;
  color: var(--cream-dim);
  font-size: 0.9rem;
  padding: 0.5rem 0.9rem;
  border: 1px dashed rgba(244, 14, 4, 0.4);
  border-radius: 999px;
}
</style>
