<script setup lang="ts">
// Minimal cross-page nav so the built-out pages (cast, villes) are actually
// reachable from one another and from the landing — the landing itself stays
// untouched otherwise (per Math: not replacing it yet, just want to be able
// to browse between what exists).
const { t } = useLocale()
const route = useRoute()

const links = [
  { to: '/', key: 'nav.home' },
  { to: '/cast', key: 'nav.cast' },
  { to: '/villes', key: 'nav.cities' },
]
</script>

<template>
  <nav class="sitenav" :aria-label="t('nav.ariaLabel')">
    <NuxtLink
      v-for="l in links"
      :key="l.to"
      :to="l.to"
      class="sitenav__link"
      :class="{ on: route.path === l.to }"
    >
      {{ t(l.key) }}
    </NuxtLink>
  </nav>
</template>

<style scoped>
.sitenav {
  position: fixed;
  top: 1.1rem;
  left: 1.1rem;
  z-index: 50;
  display: flex;
  gap: 0.3rem;
  padding: 0.35rem;
  background: rgba(10, 5, 7, 0.6);
  border: 1px solid rgba(243, 233, 216, 0.25);
  border-radius: 999px;
  backdrop-filter: blur(6px);
}
.sitenav__link {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  color: var(--cream-dim);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-decoration: none;
  transition: color 0.15s ease, background 0.15s ease;
  white-space: nowrap;
}
.sitenav__link:hover {
  color: var(--cream);
}
.sitenav__link.on {
  background: var(--red);
  color: #fff;
}

@media (max-width: 480px) {
  .sitenav__link {
    padding: 0.4rem 0.6rem;
    font-size: 0.72rem;
  }
}
</style>
