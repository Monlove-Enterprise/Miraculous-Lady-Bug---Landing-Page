<script setup lang="ts">
import { countryNameByCode } from '~/utils/countries'
import { formatCityTime, formatCityDate } from '~/utils/cityDisplayRows'
import type { CityRow } from '~/server/api/cities.get'
import type { PerformanceRow } from '~/server/api/cities/[slug].get'

// English visitors use /cities/:slug instead of /villes/:slug — Math, 2026-10-21.
definePageMeta({ alias: ['/cities/:ville()'] })

const route = useRoute()
const { t, locale, citiesPath } = useLocale()
const slug = String(route.params.ville)

const { data } = await useFetch<{ city: CityRow; performances: PerformanceRow[] }>(
  `/api/cities/${slug}`,
)

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Ville introuvable', fatal: false })
}

const city = computed(() => data.value!.city)
const performances = computed(() => data.value!.performances)

// Real per-city description (venue + date) instead of the generic site
// default, so sharing a city's ticket link shows that city, not the
// homepage — Math, 2026-10-21 SEO audit.
usePageMeta({
  title: () => `${city.value.city} — Miraculous Live`,
  description: () => {
    const c = city.value
    const details = [c.venue, c.startDate ? formatCityDate(c.startDate, locale.value) : null].filter(Boolean)
    const place = `${c.city}${c.region ? ', ' + c.region : ''}`
    return details.length ? `${place} — ${details.join(' — ')}` : t('villes.metaDescription')
  },
})

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
// Separate lines for distinct tour performances (e.g. Kitchener: Mar 6 AND
// Mar 7), not an en-dash range, which read as one continuous/ambiguous run
// (Math, 2026-10-15).
function datesLines(): string[] {
  const c = city.value
  if (!c.startDate) return []
  // timeZone: 'UTC' — see utils/cityDisplayRows.ts formatCityDate for why
  // (a plain calendar date parsed without it rolls back a day for any
  // viewer west of UTC, e.g. Montreal).
  const fmt = (d: string, time: string | null) => {
    const date = new Date(d).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
    return time ? `${date} — ${formatCityTime(time, locale.value)}` : date
  }
  if (!c.endDate || c.endDate === c.startDate) return [fmt(c.startDate, c.startTime)]
  if (c.format === 'tournee') return [fmt(c.startDate, c.startTime), fmt(c.endDate, c.endTime)]
  return [`${fmt(c.startDate, c.startTime)} – ${fmt(c.endDate, c.endTime)}`]
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
const ticketHref = computed(() => (city.value.ticketUrl ? withUtm(city.value.ticketUrl) : '/signup'))

// Two distinct nights can sell through two different ticketing-platform
// events (e.g. Kitchener: separate Evenue IDs for Mar 6 and Mar 7) — Math,
// 2026-10-21. Falls back to the shared ticketUrl when no per-date override
// is set, so every other multi/single-night city is unaffected.
const hasTwoNights = computed(() => {
  const c = city.value
  return c.format === 'tournee' && !!c.endDate && c.endDate !== c.startDate
})
function dateLabel(d: string | null, time: string | null): string {
  if (!d) return ''
  const date = formatCityDate(d, locale.value)
  return time ? `${date} — ${formatCityTime(time, locale.value)}` : date
}
const ticketHrefStart = computed(() =>
  city.value.startTicketUrl || city.value.ticketUrl ? withUtm(city.value.startTicketUrl || city.value.ticketUrl!) : '/signup',
)
const ticketHrefEnd = computed(() =>
  city.value.endTicketUrl || city.value.ticketUrl ? withUtm(city.value.endTicketUrl || city.value.ticketUrl!) : '/signup',
)

// Performances -> generic calendar events (showtime as the label).
const calendarEvents = computed(() =>
  performances.value.map((p) => ({
    id: p.id,
    date: p.startsAt,
    label: p.soldOut
      ? t('villes.perfSoldOut')
      : new Date(p.startsAt).toLocaleTimeString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
    muted: p.soldOut,
  })),
)
</script>

<template>
  <main class="ville bg-honeycomb">
    <SiteHeader />

    <div class="container">
      <NuxtLink :to="citiesPath()" class="back">← {{ t('villes.backToList') }}</NuxtLink>

      <header class="ville__head">
        <span v-if="status !== 'confirmee'" class="badge" :class="`badge--${status}`">{{ t(`villes.status.${status}`) }}</span>
        <h1 class="ville__title">{{ city.city }}{{ city.region ? `, ${city.region}` : '' }}</h1>
        <p class="ville__country">{{ countryName() }}</p>
        <p v-if="city.venue" class="ville__venue">{{ city.venue }}</p>
        <p v-for="d in datesLines()" :key="d" class="ville__dates">{{ d }}</p>
      </header>

      <!-- ---- Résidence : calendrier de représentations ---- -->
      <section v-if="city.format === 'residence'" class="ville__panel ville__panel--wide">
        <h2 class="ville__panel-heading">{{ t('villes.calendarHeading') }}</h2>
        <MonthCalendar v-if="performances.length" :events="calendarEvents" />
        <p v-else class="ville__panel-text">{{ t('villes.calendarEmpty') }}</p>
      </section>

      <!-- ---- État : à l'étude ---- -->
      <section v-if="status === 'envisagee'" class="ville__panel">
        <p class="ville__panel-text">{{ t('villes.detail.envisageeText') }}</p>
        <NuxtLink to="/signup" class="btn btn--interest">{{ t('villes.cta.interest') }}</NuxtLink>
      </section>

      <!-- ---- État : confirmée ou en vente — mêmes CTA cliquables
           (Math, 2026-10-15: "remove the confirmed and add buy tickets and
           VIP, two different clickable links"). Countdown stays as extra
           context above the buttons when a real opening date is known. -->
      <section v-else-if="status === 'confirmee' || status === 'en_vente'" class="ville__panel ville__panel--ctas">
        <template v-if="status === 'confirmee' && city.openingAt">
          <p class="ville__panel-text">{{ t('villes.detail.confirmeeText') }}</p>
          <CityCountdown :target="city.openingAt" @reached-zero="onCountdownZero" />
        </template>
        <p v-else-if="status === 'en_vente'" class="ville__panel-text">{{ t('villes.detail.enVenteText') }}</p>
        <template v-if="hasTwoNights">
          <div class="ville__cta-row">
            <span class="ville__cta-date">{{ dateLabel(city.startDate, city.startTime) }}</span>
            <a :href="ticketHrefStart" class="btn btn--buy btn--lg">{{ t('villes.cta.buy') }}</a>
            <a :href="ticketHrefStart" class="btn btn--vip btn--lg">{{ t('nav.vip') }}</a>
          </div>
          <div class="ville__cta-row">
            <span class="ville__cta-date">{{ dateLabel(city.endDate, city.endTime) }}</span>
            <a :href="ticketHrefEnd" class="btn btn--buy btn--lg">{{ t('villes.cta.buy') }}</a>
            <a :href="ticketHrefEnd" class="btn btn--vip btn--lg">{{ t('nav.vip') }}</a>
          </div>
        </template>
        <div v-else class="ville__cta-row">
          <a :href="ticketHref" class="btn btn--buy btn--lg">{{ t('villes.cta.buy') }}</a>
          <a :href="ticketHref" class="btn btn--vip btn--lg">{{ t('nav.vip') }}</a>
        </div>
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
}
.btn--buy { background: var(--red); color: #fff; }
.btn--buy:hover { background: #ff1f4a; transform: translateY(-1px); }
.btn--vip { background: var(--cream); color: #150a0b; }
.btn--vip:hover { background: #fff; transform: translateY(-1px); }
.btn--lg { padding: 0.9rem 2rem; font-size: 1.05rem; }
.ville__cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; }
.ville__cta-row:not(:last-child) { margin-bottom: 1rem; }
.ville__cta-date { font-weight: 600; color: var(--cream); min-width: 100%; }
@media (min-width: 520px) {
  .ville__cta-date { min-width: 0; margin-right: 0.25rem; }
}
.btn--interest { background: transparent; border: 1px solid rgba(243, 233, 216, 0.3); color: var(--cream); }
.btn--interest:hover { border-color: var(--red); color: var(--red); }

.ville__footer-links { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem; }
.ville__footer-links a { color: var(--cream-dim); transition: color 0.15s ease; }
.ville__footer-links a:hover { color: var(--red); }
.ville__footer-license { font-size: 0.72rem; color: rgba(203, 192, 174, 0.4); }
</style>
