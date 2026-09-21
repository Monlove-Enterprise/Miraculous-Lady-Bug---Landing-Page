<script setup lang="ts">
// Full-width dark top bar (reference: Wicked's header) — pinned to the real
// viewport edges, not centred in a max-width column, so it scales on wide
// desktops. Desktop nav = grouped dropdowns (native <details>/<summary>, no
// extra JS). Below 720px the grouped nav is replaced by a flat full-screen
// menu (mirrors Wicked's mobile hamburger: nested items flattened out, only
// Tickets stays grouped) since nested dropdowns are awkward on touch.
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

      <nav class="siteheader__nav" :aria-label="t('nav.ariaLabel')">
        <details class="navdrop">
          <summary>{{ t('nav.tickets') }}</summary>
          <div class="navdrop__panel">
            <NuxtLink to="/villes">{{ t('nav.allCities') }}</NuxtLink>
            <NuxtLink to="/vip">{{ t('nav.vip') }}</NuxtLink>
          </div>
        </details>

        <details class="navdrop">
          <summary>{{ t('nav.theShow') }}</summary>
          <div class="navdrop__panel">
            <NuxtLink to="/story">{{ t('nav.story') }}</NuxtLink>
            <NuxtLink to="/cast">{{ t('nav.cast') }}</NuxtLink>
            <NuxtLink to="/sights-sounds">{{ t('nav.sightsSounds') }}</NuxtLink>
            <NuxtLink to="/for-good">{{ t('nav.forGood') }}</NuxtLink>
            <NuxtLink to="/reviews">{{ t('nav.reviews') }}</NuxtLink>
            <NuxtLink to="/news">{{ t('nav.news') }}</NuxtLink>
          </div>
        </details>

        <NuxtLink to="/faq" class="siteheader__link">{{ t('nav.faq') }}</NuxtLink>
      </nav>

      <div class="siteheader__right">
        <button class="siteheader__lang" type="button" @click="toggle">
          <span :class="{ on: locale === 'fr' }">FR</span>
          <span class="sep">/</span>
          <span :class="{ on: locale === 'en' }">EN</span>
        </button>
        <NuxtLink to="/villes" class="siteheader__tickets">{{ t('villes.cta.buy') }}</NuxtLink>
        <button
          class="siteheader__burger"
          type="button"
          :aria-expanded="mobileOpen"
          :aria-label="t('nav.ariaLabel')"
          @click="mobileOpen = !mobileOpen"
        >
          <span /><span /><span />
        </button>
      </div>
    </div>

    <!-- Mobile flat menu — everything nested under "The Show" on desktop is
         flattened here, matching Wicked's hamburger pattern. -->
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

.siteheader__nav {
  display: flex;
  gap: 0.4rem;
  justify-content: center;
}

.siteheader__link {
  padding: 0.5rem 0.9rem;
  border-radius: 6px;
  color: var(--cream-dim);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: color 0.15s ease, background 0.15s ease;
}
.siteheader__link:hover { color: var(--cream); background: rgba(243, 233, 216, 0.06); }
.siteheader__link.router-link-active { color: var(--red); }

.navdrop { position: relative; }
.navdrop summary {
  list-style: none;
  cursor: pointer;
  padding: 0.5rem 0.9rem;
  border-radius: 6px;
  color: var(--cream-dim);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: color 0.15s ease, background 0.15s ease;
}
.navdrop summary::-webkit-details-marker { display: none; }
.navdrop summary:hover { color: var(--cream); background: rgba(243, 233, 216, 0.06); }
.navdrop[open] summary { color: var(--red); }

.navdrop__panel {
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  min-width: 220px;
  padding: 0.6rem;
  background: var(--ink-panel);
  border: 1px solid rgba(243, 233, 216, 0.12);
  border-radius: 10px;
  box-shadow: 0 16px 36px -12px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.navdrop__panel a {
  padding: 0.55rem 0.7rem;
  border-radius: 6px;
  color: var(--cream);
  font-size: 0.88rem;
  transition: background 0.15s ease, color 0.15s ease;
}
.navdrop__panel a:hover { background: rgba(244, 14, 4, 0.14); color: var(--red); }

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

.siteheader__lang {
  display: flex;
  gap: 0.3rem;
  align-items: center;
  padding: 0.35rem 0.7rem;
  background: rgba(243, 233, 216, 0.06);
  border: 1px solid rgba(243, 233, 216, 0.18);
  border-radius: 999px;
  color: var(--cream-dim);
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}
.siteheader__lang span.on { color: var(--scarlet); }
.siteheader__lang .sep { opacity: 0.4; }

.siteheader__burger {
  display: none;
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

@media (max-width: 720px) {
  .siteheader__nav { display: none; }
  .siteheader__tickets { display: none; }
  .siteheader__lang { display: none; }
  .siteheader__burger { display: flex; }
}
</style>
