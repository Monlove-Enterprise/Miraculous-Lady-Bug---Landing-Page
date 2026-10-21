<script setup lang="ts">
import { countryNameByCode } from '~/utils/countries'
import { HIDDEN_CITY_SLUGS } from '~/utils/hiddenCities'
import { toCityDisplayRows, formatCityDate, formatCityTime, type CityDisplayRow } from '~/utils/cityDisplayRows'
import type { CityRow } from '~/server/api/cities.get'

// English visitors use /cities instead of /villes — Math, 2026-10-21.
definePageMeta({ alias: ['/cities'] })

const { t, locale, cityPath } = useLocale()

useHead(() => ({
  title: `${t('villes.title')} — Miraculous Live`,
  meta: [{ name: 'description', content: t('villes.metaDescription') }],
}))

const { data } = await useFetch<CityRow[]>('/api/cities')
// A tour stop with two distinct nights (e.g. Kitchener: Mar 6 AND Mar 7) is
// two separate performances, not a date range — Math, 2026-10-15: "Kitchener
// needs two entire lines... not two dates on the same line, but two entire
// lines" — so toCityDisplayRows expands it into two full rows here.
const cities = computed(() =>
  toCityDisplayRows((data.value ?? []).filter((c) => !HIDDEN_CITY_SLUGS.has(c.slug))),
)

function countryName(c: CityDisplayRow) {
  return countryNameByCode(c.countryCode, locale.value)
}
function statusLabel(c: CityDisplayRow) {
  return t(`villes.status.${c.status}`)
}
// Math, 2026-10-15: "remove on sale date to be announced" — only renders
// once a real opening date is known; no more TBD placeholder text.
function openingLabel(c: CityDisplayRow) {
  if (!c.openingAt) return ''
  const formatted = new Date(c.openingAt).toLocaleDateString(
    locale.value === 'fr' ? 'fr-FR' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' },
  )
  return t('villes.openingOn').replace('{date}', formatted)
}
</script>

<template>
  <main class="villes bg-honeycomb">
    <SiteHeader />

    <div class="container">
      <NuxtLink to="/" class="back">← {{ t('villes.back') }}</NuxtLink>

      <header class="villes__head">
        <h1 class="villes__title">{{ t('villes.title') }}</h1>
      </header>

      <ul class="list">
        <li v-for="c in cities" :key="c.rowKey" class="row" :class="`row--${c.status}`">
          <NuxtLink :to="cityPath(c.slug)" class="row__place">
            <p class="row__city">{{ c.city }}{{ c.region ? `, ${c.region}` : '' }}</p>
            <p class="row__country">{{ countryName(c) }}</p>
          </NuxtLink>

          <div class="row__details">
            <p v-if="c.venue" class="row__venue">{{ c.venue }}</p>
            <p class="row__dates">
              {{ formatCityDate(c.displayDate, locale) }}<span v-if="c.displayTime"> — {{ formatCityTime(c.displayTime, locale) }}</span>
            </p>
            <p v-if="c.status === 'confirmee' && c.openingAt" class="row__opening">{{ openingLabel(c) }}</p>
          </div>

          <div class="row__action">
            <span v-if="c.status !== 'confirmee'" class="badge" :class="`badge--${c.status}`">{{ statusLabel(c) }}</span>

            <template v-if="c.status === 'en_vente' || c.status === 'confirmee'">
              <a :href="c.ticketUrl || '/signup'" class="btn btn--buy">{{ t('villes.cta.buy') }}</a>
              <a :href="c.ticketUrl || '/signup'" class="btn btn--vip">{{ t('nav.vip') }}</a>
            </template>
            <NuxtLink v-else-if="c.status === 'envisagee'" to="/signup" class="btn btn--interest">
              {{ t('villes.cta.interest') }}
            </NuxtLink>
            <button v-else-if="c.status === 'epuisee'" class="btn btn--soldout" type="button" disabled>
              {{ t('villes.cta.soldout') }}
            </button>
            <span v-else class="btn btn--pending">{{ t('villes.cta.pending') }}</span>
          </div>
        </li>
      </ul>

    </div>
    <SiteFooter />
  </main>
</template>

<style scoped>
.villes {
  min-height: 100dvh;
  padding-bottom: 6rem;
  background:
    radial-gradient(120% 85% at 50% 100%, rgba(243, 233, 216, 0.045), transparent 68%),
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

.villes__head { max-width: 760px; margin-bottom: 3rem; }
.villes__title {
  font-size: clamp(2.2rem, 7vw, 3.6rem);
  color: var(--red);
  text-transform: uppercase;
  margin-bottom: 1rem;
  text-wrap: balance;
}

/* ---- List ---- */
/* Math, 2026-10-15: "on the where the tour is going I dont want to see the
   honey combs on the dates lines though" — the page's bg-honeycomb was
   bleeding through the translucent 1px gaps between rows, showing as faint
   honeycomb lines between each date. Opaque background instead, so the
   page's honeycomb texture can't show through here. */
.list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--ink-panel);
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 4rem;
}
/* Math, 2026-10-15: "same thing on where the show is going... I want all
   the dates in cream please" — same cream-card treatment as the homepage's
   city-row, text/badges/VIP button flipped to dark ink for legibility.
   Then "the red degradé could be a bit more prominent" — bumped opacity. */
.row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
  padding: 1.5rem 1.6rem;
  border-left: 3px solid var(--red);
  background: linear-gradient(90deg, rgba(244, 14, 4, 0.2), transparent 45%), var(--cream);
  color: #1c0f0d;
  transition: background 0.15s ease;
  align-items: center;
}
/* Math, 2026-10-15: "can the whole line go a bit more red when the cursor
   goes over?" — the old gradient hover only reddened the left ~55% of the
   row; flat full-width tint instead so the whole row shifts together. */
.row:hover {
  background: linear-gradient(rgba(244, 14, 4, 0.22), rgba(244, 14, 4, 0.22)), var(--cream);
}

.row__place {
  display: block;
  text-decoration: none;
  color: inherit;
}
.row__city {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: #1c0f0d;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.row__country {
  color: rgba(28, 15, 13, 0.55);
  font-size: 0.85rem;
}

.row__details { color: rgba(28, 15, 13, 0.6); font-size: 0.9rem; }
.row__venue { color: #1c0f0d; margin-bottom: 0.15rem; }
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
.badge--en_vente { background: rgba(244, 14, 4, 0.14); color: var(--red); }
.badge--confirmee { background: rgba(28, 15, 13, 0.08); color: #1c0f0d; }
.badge--envisagee { background: rgba(28, 15, 13, 0.06); color: rgba(28, 15, 13, 0.55); }
.badge--epuisee { background: rgba(28, 15, 13, 0.06); color: rgba(28, 15, 13, 0.55); text-decoration: line-through; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 1.2rem;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;
  white-space: nowrap;
}
.btn--buy { background: var(--red); color: #fff; }
.btn--buy:hover { background: #ff1f4a; transform: translateY(-1px); }
.btn--vip { background: #1c0f0d; color: var(--cream); }
.btn--vip:hover { background: #000; transform: translateY(-1px); }
.btn--interest { background: transparent; border: 1px solid rgba(28, 15, 13, 0.3); color: #1c0f0d; }
.btn--interest:hover { border-color: var(--red); color: var(--red); }
.btn--soldout { background: rgba(28, 15, 13, 0.08); color: rgba(28, 15, 13, 0.55); cursor: not-allowed; }
.btn--pending { background: transparent; color: rgba(28, 15, 13, 0.55); font-weight: 500; padding: 0.55rem 0; }

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
