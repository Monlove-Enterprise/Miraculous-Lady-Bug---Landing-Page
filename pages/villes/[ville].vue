<script setup lang="ts">
import { findCity, withTicketUtm, type CityStatus } from '~/utils/toursCitiesPlaceholder'

const route = useRoute()
const { t, locale } = useLocale()

const city = findCity(String(route.params.ville))

if (!city) {
  throw createError({ statusCode: 404, statusMessage: 'Ville introuvable', fatal: false })
}

useHead(() => ({
  title: city ? `${cityName()} — Miraculous Live` : 'Miraculous Live',
}))

// Local, possibly-flipped status: the countdown reaching zero switches the
// displayed state to "en_vente" for everyone at the same instant (date-driven,
// never the visitor's clock/IP) without a page reload.
const status = ref<CityStatus>(city!.status)

function cityName() {
  return locale.value === 'fr' ? city!.cityFr : city!.cityEn
}
function countryName() {
  return locale.value === 'fr' ? city!.countryFr : city!.countryEn
}
function onCountdownZero() {
  status.value = 'en_vente'
}
const ticketHref = computed(() =>
  city!.ticketUrl ? withTicketUtm(city!.ticketUrl, city!.slug) : '#',
)
</script>

<template>
  <main v-if="city" class="ville">
    <SiteHeader />

    <div class="container">
      <NuxtLink to="/villes" class="back">← {{ t('villes.backToList') }}</NuxtLink>

      <header class="ville__head">
        <span class="badge" :class="`badge--${status}`">{{ t(`villes.status.${status}`) }}</span>
        <h1 class="ville__title">{{ cityName() }}</h1>
        <p class="ville__country">{{ countryName() }}</p>
        <p v-if="city.venue" class="ville__venue">{{ city.venue }}</p>
        <p v-if="city.dates" class="ville__dates">{{ city.dates }}</p>
        <p class="ville__note">{{ t('villes.note') }}</p>
      </header>

      <!-- ---- État : à l'étude ---- -->
      <section v-if="status === 'envisagee'" class="ville__panel">
        <p class="ville__panel-text">{{ t('villes.detail.envisageeText') }}</p>
        <NuxtLink to="/#signup" class="btn btn--interest">{{ t('villes.cta.interest') }}</NuxtLink>
      </section>

      <!-- ---- État : confirmée (countdown si date connue) ---- -->
      <section v-else-if="status === 'confirmee'" class="ville__panel">
        <template v-if="city.openingDate">
          <p class="ville__panel-text">{{ t('villes.detail.confirmeeText') }}</p>
          <CityCountdown :target="city.openingDate" @reached-zero="onCountdownZero" />
        </template>
        <p v-else class="ville__panel-text">{{ t('villes.openingTbd') }}</p>
      </section>

      <!-- ---- État : en vente ---- -->
      <section v-else-if="status === 'en_vente'" class="ville__panel">
        <p class="ville__panel-text">{{ t('villes.detail.enVenteText') }}</p>
        <a :href="ticketHref" class="btn btn--buy btn--lg">{{ t('villes.cta.buy') }}</a>
      </section>

      <!-- ---- État : complet ---- -->
      <section v-else class="ville__panel">
        <p class="ville__panel-text">{{ t('villes.detail.epuiseeText') }}</p>
        <NuxtLink to="/#signup" class="btn btn--interest">{{ t('villes.cta.interest') }}</NuxtLink>
      </section>

      <footer class="ville__footer">
        <nav class="ville__footer-links">
          <NuxtLink to="/mentions-legales">{{ t('footer.legal') }}</NuxtLink>
          <span aria-hidden="true">·</span>
          <NuxtLink to="/confidentialite">{{ t('footer.privacy') }}</NuxtLink>
          <span aria-hidden="true">·</span>
          <NuxtLink to="/conditions">{{ t('footer.terms') }}</NuxtLink>
        </nav>
        <p class="ville__footer-license">{{ t('footer.copyright') }}</p>
      </footer>
    </div>
  </main>
</template>

<style scoped>
.ville {
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

.ville__panel {
  padding: 2.2rem;
  border-radius: 16px;
  background: var(--ink-panel);
  max-width: 620px;
  margin-bottom: 3rem;
}
.ville__panel-text { color: var(--cream); margin-bottom: 1.4rem; }

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
