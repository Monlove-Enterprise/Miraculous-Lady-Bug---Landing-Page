<script setup lang="ts">
import { countryNameByCode } from '~/utils/countries'
import type { CityRow } from '~/server/api/cities.get'
import type { PerformanceRow } from '~/server/api/cities/[slug].get'

const route = useRoute()
const { t, locale } = useLocale()
const slug = String(route.params.ville)

const { data } = await useFetch<{ city: CityRow; performances: PerformanceRow[] }>(
  `/api/cities/${slug}`,
)

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Ville introuvable', fatal: false })
}

const city = computed(() => data.value!.city)
const performances = computed(() => data.value!.performances)

useHead(() => ({ title: `${city.value.city} — Miraculous Live` }))

// Local, possibly-flipped status: the countdown reaching zero switches the
// displayed state to "en_vente" for everyone at the same instant (date-driven,
// never the visitor's clock/IP) without a page reload.
const status = ref(city.value.status)
watch(city, (c) => (status.value = c.status))

function countryName() {
  return countryNameByCode(city.value.countryCode, locale.value)
}
function onCountdownZero() {
  status.value = 'en_vente'
}
function datesLabel() {
  const c = city.value
  if (!c.startDate) return null
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  return c.endDate && c.endDate !== c.startDate ? `${fmt(c.startDate)} – ${fmt(c.endDate)}` : fmt(c.startDate)
}
// Ticket links always carry UTM so ticketing-platform traffic is attributable.
function withUtm(url: string): string {
  if (!/^https?:\/\//.test(url)) return url
  try {
    const u = new URL(url)
    u.searchParams.set('utm_source', 'miraculousladybuglive')
    u.searchParams.set('utm_medium', 'villes')
    u.searchParams.set('utm_campaign', city.value.slug)
    return u.toString()
  } catch {
    return url
  }
}
const ticketHref = computed(() => (city.value.ticketUrl ? withUtm(city.value.ticketUrl) : '#'))

// Group performances by calendar day for the weekly-strip layout.
const performancesByDay = computed(() => {
  const groups = new Map<string, PerformanceRow[]>()
  for (const p of performances.value) {
    const key = new Date(p.startsAt).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(p)
  }
  return [...groups.entries()]
})
function perfTime(p: PerformanceRow) {
  return new Date(p.startsAt).toLocaleTimeString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}
</script>

<template>
  <main class="ville">
    <SiteHeader />

    <div class="container">
      <NuxtLink to="/villes" class="back">← {{ t('villes.backToList') }}</NuxtLink>

      <header class="ville__head">
        <span class="badge" :class="`badge--${status}`">{{ t(`villes.status.${status}`) }}</span>
        <span v-if="city.format === 'residence'" class="badge badge--residence">
          {{ t('villes.residencyBadge') }}
        </span>
        <h1 class="ville__title">{{ city.city }}</h1>
        <p class="ville__country">{{ countryName() }}</p>
        <p v-if="city.venue" class="ville__venue">{{ city.venue }}</p>
        <p v-if="datesLabel()" class="ville__dates">{{ datesLabel() }}</p>
        <p class="ville__note">{{ t('villes.note') }}</p>
      </header>

      <!-- ---- Résidence : calendrier de représentations ---- -->
      <section v-if="city.format === 'residence'" class="ville__panel ville__panel--wide">
        <h2 class="ville__panel-heading">{{ t('villes.calendarHeading') }}</h2>
        <div v-if="performancesByDay.length" class="calendar">
          <div v-for="[day, perfs] in performancesByDay" :key="day" class="calendar__day">
            <p class="calendar__date">{{ day }}</p>
            <p v-for="p in perfs" :key="p.id" class="calendar__time" :class="{ 'is-soldout': p.soldOut }">
              {{ p.soldOut ? t('villes.perfSoldOut') : perfTime(p) }}
            </p>
          </div>
        </div>
        <p v-else class="ville__panel-text">{{ t('villes.calendarEmpty') }}</p>
      </section>

      <!-- ---- État : à l'étude ---- -->
      <section v-if="status === 'envisagee'" class="ville__panel">
        <p class="ville__panel-text">{{ t('villes.detail.envisageeText') }}</p>
        <NuxtLink to="/signup" class="btn btn--interest">{{ t('villes.cta.interest') }}</NuxtLink>
      </section>

      <!-- ---- État : confirmée (countdown si date connue) ---- -->
      <section v-else-if="status === 'confirmee'" class="ville__panel">
        <template v-if="city.openingAt">
          <p class="ville__panel-text">{{ t('villes.detail.confirmeeText') }}</p>
          <CityCountdown :target="city.openingAt" @reached-zero="onCountdownZero" />
        </template>
        <p v-else class="ville__panel-text">{{ t('villes.openingTbd') }}</p>
      </section>

      <!-- ---- État : en vente ---- -->
      <section v-else-if="status === 'en_vente'" class="ville__panel">
        <p class="ville__panel-text">{{ t('villes.detail.enVenteText') }}</p>
        <a :href="ticketHref" class="btn btn--buy btn--lg">{{ t('villes.cta.buy') }}</a>
      </section>

      <!-- ---- État : complet ---- -->
      <section v-else-if="status === 'epuisee'" class="ville__panel">
        <p class="ville__panel-text">{{ t('villes.detail.epuiseeText') }}</p>
        <NuxtLink to="/signup" class="btn btn--interest">{{ t('villes.cta.interest') }}</NuxtLink>
      </section>

    </div>
    <SiteFooter />
  </main>
</template>

<style scoped>
.ville {
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

.ville__head { max-width: 760px; margin-bottom: 2.5rem; }
.ville__title {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 8vw, 4rem);
  color: var(--cream);
  text-transform: uppercase;
  margin: 0.6rem 0 0.2rem;
}
.ville__country { color: var(--cream-dim); font-size: 1rem; margin-bottom: 0.75rem; }
.ville__venue { color: var(--cream); font-size: 1.05rem; }
.ville__dates { color: var(--cream-dim); font-size: 0.95rem; margin-bottom: 0.5rem; }
.ville__note {
  display: inline-block;
  margin-top: 1rem;
  color: var(--cream-dim);
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  border: 1px dashed rgba(244, 14, 4, 0.4);
  border-radius: 999px;
}

.badge {
  display: inline-block;
  margin-right: 0.5rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.badge--en_vente { background: rgba(244, 14, 4, 0.16); color: var(--red); }
.badge--confirmee { background: rgba(243, 233, 216, 0.12); color: var(--cream); }
.badge--envisagee { background: rgba(243, 233, 216, 0.06); color: var(--cream-dim); }
.badge--epuisee { background: rgba(243, 233, 216, 0.06); color: var(--cream-dim); }
.badge--residence { background: rgba(244, 14, 4, 0.16); color: var(--red); }

.ville__panel {
  padding: 2.2rem;
  border-radius: 16px;
  background: var(--ink-panel);
  max-width: 620px;
  margin-bottom: 2rem;
}
.ville__panel--wide { max-width: 900px; }
.ville__panel-heading {
  font-family: var(--font-display);
  color: var(--red);
  text-transform: uppercase;
  font-size: 1.3rem;
  margin-bottom: 1.2rem;
}
.ville__panel-text { color: var(--cream); margin-bottom: 1.4rem; }

.calendar {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 0.6rem;
}
.calendar__day {
  padding: 0.8rem 0.7rem;
  background: rgba(243, 233, 216, 0.05);
  border-radius: 10px;
  text-align: center;
}
.calendar__date { color: var(--cream-dim); font-size: 0.78rem; margin-bottom: 0.5rem; }
.calendar__time { color: var(--red); font-weight: 700; font-size: 0.9rem; }
.calendar__time.is-soldout { color: var(--cream-dim); text-decoration: line-through; font-weight: 500; }

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
}
.btn--buy { background: var(--red); color: #fff; }
.btn--buy:hover { background: #ff1f4a; transform: translateY(-1px); }
.btn--lg { padding: 0.9rem 2rem; font-size: 1.05rem; }
.btn--interest { background: transparent; border: 1px solid rgba(243, 233, 216, 0.3); color: var(--cream); }
.btn--interest:hover { border-color: var(--red); color: var(--red); }

.ville__footer-links { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem; }
.ville__footer-links a { color: var(--cream-dim); transition: color 0.15s ease; }
.ville__footer-links a:hover { color: var(--red); }
.ville__footer-license { font-size: 0.72rem; color: rgba(203, 192, 174, 0.4); }
</style>
