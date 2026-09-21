<script setup lang="ts">
// Full-width dark top bar — pinned to the real viewport edges, not centred in
// a max-width column, so it scales on wide desktops. Nav is a single
// hamburger, centred, at every screen size (per Math) — opens the same flat
// link list + language toggle on desktop and mobile alike, rather than
// separate desktop dropdowns vs. mobile flat menu.
const { t, locale, toggle } = useLocale()
const route = useRoute()

const mobileOpen = ref(false)
watch(
  () => route.fullPath,
  () => (mobileOpen.value = false),
)
</script>

<template>
  <header class="siteheader">
    <div class="siteheader__bar">
      <NuxtLink to="/" class="siteheader__logo">
        <img src="/images/ladybug-icon.png" :alt="t('nav.wordmark')" />
      </NuxtLink>

      <button
        class="siteheader__burger"
        type="button"
        :aria-expanded="mobileOpen"
        :aria-label="t('nav.ariaLabel')"
        @click="mobileOpen = !mobileOpen"
      >
        <span /><span /><span />
      </button>

      <div class="siteheader__right">
        <NuxtLink to="/villes" class="siteheader__tickets">{{ t('villes.cta.buy') }}</NuxtLink>
      </div>
    </div>

    <!-- Same flat menu at every screen size — opened from the centred
         hamburger. -->
    <div v-if="mobileOpen" class="siteheader__mobile">
      <NuxtLink to="/" class="siteheader__mobile-link">{{ t('nav.home') }}</NuxtLink>
      <NuxtLink to="/villes" class="siteheader__mobile-link">{{ t('nav.allCities') }}</NuxtLink>
      <NuxtLink to="/vip" class="siteheader__mobile-link">{{ t('nav.vip') }}</NuxtLink>
      <NuxtLink to="/story" class="siteheader__mobile-link">{{ t('nav.story') }}</NuxtLink>
      <NuxtLink to="/cast" class="siteheader__mobile-link">{{ t('nav.cast') }}</NuxtLink>
      <NuxtLink to="/sights-sounds" class="siteheader__mobile-link">{{ t('nav.sightsSounds') }}</NuxtLink>
      <NuxtLink to="/for-good" class="siteheader__mobile-link">{{ t('nav.forGood') }}</NuxtLink>
      <NuxtLink to="/reviews" class="siteheader__mobile-link">{{ t('nav.reviews') }}</NuxtLink>
      <NuxtLink to="/news" class="siteheader__mobile-link">{{ t('nav.news') }}</NuxtLink>
      <NuxtLink to="/faq" class="siteheader__mobile-link">{{ t('nav.faq') }}</NuxtLink>
      <button class="siteheader__mobile-lang" type="button" @click="toggle">
        🌐 <span :class="{ on: locale === 'fr' }">FR</span> / <span :class="{ on: locale === 'en' }">EN</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.siteheader {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--ink);
  border-bottom: 1px solid rgba(243, 233, 216, 0.1);
}
/* 3-column grid (not flex + space-between) so the nav sits at the TRUE
   visual centre of the bar, not just centred in whatever space is left
   between the logo and the right-hand group — those two aren't the same
   width, so flex centring drifted as the window got wider. The two 1fr
   edge columns stay equal width, keeping the nav dead-centre at any size. */
.siteheader__bar {
  width: 100%;
  padding: 0.9rem clamp(1rem, 2vw, 1.75rem);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
}
.siteheader__logo { justify-self: start; }
.siteheader__right { justify-self: end; }

.siteheader__logo {
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.siteheader__logo img {
  height: 34px;
  width: auto;
  display: block;
  transition: transform 0.15s ease;
}
.siteheader__logo:hover img { transform: scale(1.08); }

.siteheader__right {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

/* Rectangle, not a pill — matches Wicked's header CTA. A diagonal shine
   sweeps across on hover for a bit of polish. */
.siteheader__tickets {
  position: relative;
  overflow: hidden;
  padding: 0.65rem 1.3rem;
  border-radius: 3px;
  background: var(--cream);
  color: #150a0b;
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.siteheader__tickets::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, transparent 40%, rgba(244, 14, 4, 0.35) 50%, transparent 60%);
  transform: translateX(-120%);
  transition: transform 0.55s ease;
}
.siteheader__tickets:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px -6px rgba(244, 14, 4, 0.55);
}
.siteheader__tickets:hover::after { transform: translateX(120%); }

.siteheader__burger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 34px;
  height: 34px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
}
.siteheader__burger span {
  display: block;
  height: 2px;
  background: var(--cream);
  border-radius: 2px;
}

.siteheader__mobile {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1.2rem 1.5rem;
  background: var(--ink);
  border-top: 1px solid rgba(243, 233, 216, 0.1);
}
.siteheader__mobile-link {
  padding: 0.85rem 0.2rem;
  color: var(--cream);
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border-bottom: 1px solid rgba(243, 233, 216, 0.08);
}
.siteheader__mobile-link.router-link-active { color: var(--red); }
.siteheader__mobile-lang {
  margin-top: 1rem;
  align-self: flex-start;
  padding: 0.5rem 0.9rem;
  background: rgba(243, 233, 216, 0.06);
  border: 1px solid rgba(243, 233, 216, 0.18);
  border-radius: 999px;
  color: var(--cream-dim);
  font-size: 0.8rem;
  font-weight: 700;
}
.siteheader__mobile-lang span.on { color: var(--scarlet); }

@media (max-width: 480px) {
  .siteheader__tickets { display: none; }
}
</style>
