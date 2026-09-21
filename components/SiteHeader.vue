<script setup lang="ts">
// Full dark top bar with dropdown menus (reference: Wicked's TICKETS / THE
// SHOW header). Used on every page EXCEPT the landing (which keeps its
// current full-bleed hero untouched and only gets a "Book Now" button —
// Math doesn't want the landing replaced yet, just made navigable). Native
// <details>/<summary> for the dropdowns — accessible, keyboard-friendly, no
// extra JS needed to open/close/click-outside.
const { t, locale, toggle } = useLocale()
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
      </div>
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
.siteheader__bar {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0.9rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

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
  flex: 1;
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

.siteheader__tickets {
  padding: 0.5rem 1.1rem;
  border-radius: 999px;
  background: var(--red);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
  transition: background 0.15s ease, transform 0.15s ease;
}
.siteheader__tickets:hover { background: #ff1f4a; transform: translateY(-1px); }

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

@media (max-width: 720px) {
  .siteheader__bar { flex-wrap: wrap; }
  .siteheader__nav { order: 3; width: 100%; justify-content: flex-start; overflow-x: auto; }
}
</style>
