<script setup lang="ts">
import { countryNameByCode } from '~/utils/countries'
import { HIDDEN_CITY_SLUGS } from '~/utils/hiddenCities'
import type { CityRow } from '~/server/api/cities.get'

const { t, locale } = useLocale()

useHead(() => ({
  title: `${t('villes.title')} — Miraculous Live`,
  meta: [{ name: 'description', content: t('villes.metaDescription') }],
}))

const { data } = await useFetch<CityRow[]>('/api/cities')
const cities = computed(() => (data.value ?? []).filter((c) => !HIDDEN_CITY_SLUGS.has(c.slug)))

function countryName(c: CityRow) {
  return countryNameByCode(c.countryCode, locale.value)
}
function statusLabel(c: CityRow) {
  return t(`villes.status.${c.status}`)
}
// Tour stops (format 'tournee') with a date range are distinct single-night
// performances, not a continuous run (e.g. Kitchener: separate shows Mar 6
// AND Mar 7) — an en-dash range read as ambiguous/residency-like, so these
// render as separate lines instead (Math, 2026-10-15).
function datesLines(c: CityRow): string[] {
  if (!c.startDate) return []
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  if (!c.endDate || c.endDate === c.startDate) return [fmt(c.startDate)]
  if (c.format === 'tournee') return [fmt(c.startDate), fmt(c.endDate)]
  return [`${fmt(c.startDate)} – ${fmt(c.endDate)}`]
}
function openingLabel(c: CityRow) {
  if (!c.openingAt) return t('villes.openingTbd')
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
        <li v-for="c in cities" :key="c.slug" class="row" :class="`row--${c.status}`">
          <NuxtLink :to="`/villes/${c.slug}`" class="row__place">
            <p class="row__city">{{ c.city }}</p>
            <p class="row__country">{{ countryName(c) }}</p>
          </NuxtLink>

          <div class="row__details">
            <p v-if="c.venue" class="row__venue">{{ c.venue }}</p>
            <p v-for="d in datesLines(c)" :key="d" class="row__dates">{{ d }}</p>
            <p v-if="c.status === 'confirmee'" class="row__opening">{{ openingLabel(c) }}</p>
          </div>

          <div class="row__action">
            <span class="badge" :class="`badge--${c.status}`">{{ statusLabel(c) }}</span>

            <template v-if="c.status === 'en_vente'">
              <a :href="c.ticketUrl" class="btn btn--buy">{{ t('villes.cta.buy') }}</a>
              <NuxtLink to="/vip" class="btn btn--vip">{{ t('nav.vip') }}</NuxtLink>
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
    radial-gradient(80% 50% at 15% 0%, rgba(255, 45, 143, 0.14), transparent 60%),
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
.btn--vip { background: var(--cream); color: #150a0b; }
.btn--vip:hover { background: #fff; transform: translateY(-1px); }
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
