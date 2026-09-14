<script setup lang="ts">
import { cities, type City } from '~/utils/toursCitiesPlaceholder'

const { t, locale } = useLocale()

useHead(() => ({
  title: `${t('villes.title')} — Miraculous Live`,
  meta: [{ name: 'description', content: t('villes.metaDescription') }],
}))

function cityName(c: City) {
  return locale.value === 'fr' ? c.cityFr : c.cityEn
}
function countryName(c: City) {
  return locale.value === 'fr' ? c.countryFr : c.countryEn
}
function statusLabel(c: City) {
  return t(`villes.status.${c.status}`)
}
function openingLabel(c: City) {
  if (!c.openingDate) return t('villes.openingTbd')
  const d = new Date(c.openingDate)
  const formatted = d.toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return t('villes.openingOn').replace('{date}', formatted)
}
</script>

<template>
  <main class="villes">
    <SiteHeader />

    <div class="container">
      <NuxtLink to="/" class="back">← {{ t('villes.back') }}</NuxtLink>

      <header class="villes__head">
        <h1 class="villes__title">{{ t('villes.title') }}</h1>
        <p class="villes__intro">{{ t('villes.intro') }}</p>
        <p class="villes__note">{{ t('villes.note') }}</p>
      </header>

      <ul class="list">
        <li v-for="c in cities" :key="c.slug" class="row" :class="`row--${c.status}`">
          <NuxtLink :to="`/villes/${c.slug}`" class="row__place">
            <p class="row__city">{{ cityName(c) }}</p>
            <p class="row__country">{{ countryName(c) }}</p>
          </NuxtLink>

          <div class="row__details">
            <p v-if="c.venue" class="row__venue">{{ c.venue }}</p>
            <p v-if="c.dates" class="row__dates">{{ c.dates }}</p>
            <p v-if="c.status === 'confirmee'" class="row__opening">{{ openingLabel(c) }}</p>
          </div>

          <div class="row__action">
            <span class="badge" :class="`badge--${c.status}`">{{ statusLabel(c) }}</span>

            <a v-if="c.status === 'en_vente'" :href="c.ticketUrl" class="btn btn--buy">
              {{ t('villes.cta.buy') }}
            </a>
            <NuxtLink v-else-if="c.status === 'envisagee'" to="/#signup" class="btn btn--interest">
              {{ t('villes.cta.interest') }}
            </NuxtLink>
            <button v-else-if="c.status === 'epuisee'" class="btn btn--soldout" type="button" disabled>
              {{ t('villes.cta.soldout') }}
            </button>
            <span v-else class="btn btn--pending">{{ t('villes.cta.pending') }}</span>
          </div>
        </li>
      </ul>

      <footer class="villes__footer">
        <nav class="villes__footer-links">
          <NuxtLink to="/mentions-legales">{{ t('footer.legal') }}</NuxtLink>
          <span aria-hidden="true">·</span>
          <NuxtLink to="/confidentialite">{{ t('footer.privacy') }}</NuxtLink>
          <span aria-hidden="true">·</span>
          <NuxtLink to="/conditions">{{ t('footer.terms') }}</NuxtLink>
        </nav>
        <p class="villes__footer-license">{{ t('footer.copyright') }}</p>
      </footer>
    </div>
  </main>
</template>

<style scoped>
.villes {
  min-height: 100dvh;
  padding: 4rem 0 6rem;
  background:
    radial-gradient(80% 50% at 20% 0%, rgba(244, 14, 4, 0.16), transparent 60%),
    var(--ink);
}

.lang {
  position: fixed;
  top: 1.1rem;
  right: 1.1rem;
  z-index: 50;
  display: flex;
  gap: 0.35rem;
  align-items: center;
  padding: 0.4rem 0.75rem;
  background: rgba(10, 5, 7, 0.6);
  border: 1px solid rgba(243, 233, 216, 0.25);
  border-radius: 999px;
  color: var(--cream-dim);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  backdrop-filter: blur(6px);
}
.lang span.on { color: var(--scarlet); }
.lang .sep { opacity: 0.4; }

.back {
  display: inline-block;
  color: var(--cream-dim);
  font-size: 0.9rem;
  margin-bottom: 2.5rem;
  transition: color 0.15s ease;
}
.back:hover { color: var(--red); }

.villes__head { max-width: 760px; margin-bottom: 3rem; }
.villes__title {
  font-size: clamp(2.2rem, 7vw, 3.6rem);
  color: var(--red);
  text-transform: uppercase;
  margin-bottom: 1rem;
  text-wrap: balance;
}
.villes__intro {
  color: var(--cream);
  font-size: clamp(1.05rem, 2.6vw, 1.3rem);
  margin-bottom: 1rem;
}
.villes__note {
  display: inline-block;
  color: var(--cream-dim);
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  border: 1px dashed rgba(244, 14, 4, 0.4);
  border-radius: 999px;
}

/* ---- List ---- */
.list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: rgba(243, 233, 216, 0.08);
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 4rem;
}
.row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
  padding: 1.5rem 1.6rem;
  background: var(--ink-panel);
  align-items: center;
}

.row__place {
  display: block;
  text-decoration: none;
  color: inherit;
}
.row__city {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--cream);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.row__country {
  color: var(--cream-dim);
  font-size: 0.85rem;
}

.row__details { color: var(--cream-dim); font-size: 0.9rem; }
.row__venue { color: var(--cream); margin-bottom: 0.15rem; }
.row__opening { margin-top: 0.25rem; color: var(--red); font-weight: 600; }

.row__action {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
}
.badge--en_vente { background: rgba(244, 14, 4, 0.16); color: var(--red); }
.badge--confirmee { background: rgba(243, 233, 216, 0.12); color: var(--cream); }
.badge--envisagee { background: rgba(243, 233, 216, 0.06); color: var(--cream-dim); }
.badge--epuisee { background: rgba(243, 233, 216, 0.06); color: var(--cream-dim); text-decoration: line-through; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 1.2rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;
  white-space: nowrap;
}
.btn--buy { background: var(--red); color: #fff; }
.btn--buy:hover { background: #ff1f4a; transform: translateY(-1px); }
.btn--interest { background: transparent; border: 1px solid rgba(243, 233, 216, 0.3); color: var(--cream); }
.btn--interest:hover { border-color: var(--red); color: var(--red); }
.btn--soldout { background: rgba(243, 233, 216, 0.08); color: var(--cream-dim); cursor: not-allowed; }
.btn--pending { background: transparent; color: var(--cream-dim); font-weight: 500; padding: 0.55rem 0; }

.villes__footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.villes__footer-links a { color: var(--cream-dim); transition: color 0.15s ease; }
.villes__footer-links a:hover { color: var(--red); }
.villes__footer-license {
  font-size: 0.72rem;
  color: rgba(203, 192, 174, 0.4);
}

@media (min-width: 720px) {
  .row {
    grid-template-columns: 1.1fr 1.4fr auto;
  }
}
</style>
