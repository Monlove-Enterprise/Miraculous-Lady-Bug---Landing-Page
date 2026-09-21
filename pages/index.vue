<script setup lang="ts">
import type { CityRow } from '~/server/api/cities.get'
import { countryNameByCode } from '~/utils/countries'

const { t, locale } = useLocale()
const route = useRoute()

const { data: citiesData } = await useFetch<CityRow[]>('/api/cities')
const cities = computed(() => citiesData.value ?? [])

// Next few dates across all tour stops (residency cities have no single
// start_date, so they're naturally excluded — the Lido gets its own page).
const upcomingCities = computed(() =>
  cities.value
    .filter((c) => c.format === 'tournee' && c.startDate)
    .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime())
    .slice(0, 6),
)

function dateLabel(c: CityRow) {
  if (!c.startDate) return ''
  return new Date(c.startDate).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
function countryName(c: CityRow) {
  return countryNameByCode(c.countryCode, locale.value)
}

// ---- Live layout tuner (only visible with ?tune=1 in the URL) ----
// Desktop hero only: tune the Ladybug size/position and the title width live,
// then bake the chosen values into the CSS defaults below.
const tuning = computed(() => route.query.tune !== undefined)
const artW = ref(26) // Ladybug width (vw)
const artLeft = ref(1.8) // Ladybug left offset (vw)
const artBottom = ref(0) // Ladybug bottom offset (px, + = higher)
const titleW = ref(39) // Title width (vw)

const heroStyle = computed(() => ({
  '--art-w': artW.value + 'vw',
  '--art-left': artLeft.value + 'vw',
  '--art-bottom': artBottom.value + 'px',
  '--title-w': titleW.value + 'vw',
}))

const tuneSummary = computed(
  () =>
    `art-w:${artW.value}vw art-left:${artLeft.value}vw art-bottom:${artBottom.value}px title-w:${titleW.value}vw`,
)
const copied = ref(false)

// Persist tuner values in the browser (only in ?tune=1 mode) so adjustments
// survive a reload. The public site (no ?tune) always uses the baked defaults.
onMounted(() => {
  if (!tuning.value) return
  try {
    const s = JSON.parse(localStorage.getItem('heroTune') || 'null')
    if (s) {
      artW.value = s.artW ?? artW.value
      artLeft.value = s.artLeft ?? artLeft.value
      artBottom.value = s.artBottom ?? artBottom.value
      titleW.value = s.titleW ?? titleW.value
    }
  } catch {}
  watch([artW, artLeft, artBottom, titleW], () => {
    try {
      localStorage.setItem(
        'heroTune',
        JSON.stringify({
          artW: artW.value,
          artLeft: artLeft.value,
          artBottom: artBottom.value,
          titleW: titleW.value,
        }),
      )
    } catch {}
  })
})

function copyTune() {
  try {
    navigator.clipboard?.writeText(tuneSummary.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {}
}
</script>

<template>
  <div class="page">
    <SiteHeader />

    <!-- Live layout tuner — add ?tune=1 to the URL to show it (desktop hero) -->
    <div v-if="tuning" class="tuner">
      <strong>Réglages hero (desktop)</strong>
      <label>Ladybug largeur&nbsp;: {{ artW }}vw
        <input v-model.number="artW" type="range" min="14" max="42" step="0.5" />
      </label>
      <label>Ladybug ← gauche&nbsp;: {{ artLeft }}vw
        <input v-model.number="artLeft" type="range" min="-6" max="24" step="0.5" />
      </label>
      <label>Ladybug ↑ hauteur&nbsp;: {{ artBottom }}px
        <input v-model.number="artBottom" type="range" min="-30" max="180" step="2" />
      </label>
      <label>Titre largeur&nbsp;: {{ titleW }}vw
        <input v-model.number="titleW" type="range" min="24" max="56" step="0.5" />
      </label>
      <code>{{ tuneSummary }}</code>
      <button type="button" class="tuner__copy" @click="copyTune">
        {{ copied ? 'Copié ✓' : 'Copier les valeurs' }}
      </button>
    </div>

    <!-- ===================== HERO ===================== -->
    <!-- DOM order (title, art, lockup) drives both layouts: on desktop the art
         is an absolute bottom-left overlay so title+lockup centre; on mobile the
         art returns to flow, giving title → Ladybug → tagline/CTA/credit. -->
    <section class="hero" :style="tuning ? heroStyle : undefined">
      <img class="hero__logo" src="/images/title-treatment.png" :alt="t('hero.logoAlt')" />

      <div class="hero__art" aria-hidden="true">
        <img src="/images/ladybug-hero.png" alt="" />
      </div>

      <div class="hero__lockup">
        <p class="hero__tagline">{{ t('hero.tagline') }}</p>
        <div class="hero__ctas">
          <!-- Single hero CTA per Math — the waitlist sign-up now lives in its
               own section/page (subscribe band + /signup), not competing here. -->
          <NuxtLink to="/villes" class="cta">
            {{ t('villes.cta.buy') }}
          </NuxtLink>
        </div>
        <p class="hero__credit">
          <span class="hero__credit-label">{{ t('hero.musicalBy') }}</span>
          <span class="hero__credit-names">Ella Louise Allaire &amp;<br />Martin Lord Ferguson</span>
        </p>
      </div>
    </section>

    <!-- ===================== MAP ===================== -->
    <section class="map-section">
      <div class="container">
        <h2 class="section-title">{{ t('map.heading') }}</h2>
        <p class="section-lead">{{ t('map.lead') }}</p>
        <WorldMap :cities="cities" />
        <div class="map-legend">
          <span class="map-legend__item"><i class="map-legend__dot map-legend__dot--tournee" />{{ t('map.legendTour') }}</span>
          <span class="map-legend__item"><i class="map-legend__dot map-legend__dot--residence" />{{ t('map.legendResidency') }}</span>
        </div>

        <h3 class="upcoming__heading">{{ t('upcoming.heading') }}</h3>
        <ul v-if="upcomingCities.length" class="upcoming">
          <li v-for="c in upcomingCities" :key="c.id" class="upcoming__row">
            <NuxtLink :to="`/villes/${c.slug}`" class="upcoming__link">
              <span class="upcoming__date">{{ dateLabel(c) }}</span>
              <span class="upcoming__place">{{ c.city }}<span class="upcoming__country">{{ countryName(c) }}</span></span>
              <span v-if="c.venue" class="upcoming__venue">{{ c.venue }}</span>
              <span class="badge" :class="`badge--${c.status}`">{{ t(`villes.status.${c.status}`) }}</span>
            </NuxtLink>
          </li>
        </ul>
        <p v-else class="section-lead">{{ t('upcoming.empty') }}</p>

        <div class="upcoming__more">
          <NuxtLink to="/villes" class="btn btn--outline">{{ t('upcoming.seeAll') }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ===================== TRAILER ===================== -->
    <!-- TODO: swap the placeholder for the real YouTube/Vimeo embed once the
         brand delivers a trailer (CLAUDE.md: never self-hosted video). -->
    <section class="trailer-section">
      <div class="container">
        <h2 class="section-title">{{ t('trailer.heading') }}</h2>
        <div class="trailer-placeholder">
          <span class="trailer-placeholder__play" aria-hidden="true">▶</span>
          <p class="trailer-placeholder__text">{{ t('trailer.comingSoon') }}</p>
        </div>
      </div>
    </section>

    <!-- ===================== SOCIAL / FOLLOW ===================== -->
    <section class="social-section">
      <div class="container">
        <h2 class="section-title">{{ t('social.heading') }}</h2>
        <p class="section-lead">{{ t('social.lead') }}</p>
        <div class="social-grid" aria-hidden="true">
          <div v-for="i in 8" :key="i" class="social-grid__tile" />
        </div>
        <div class="social-links">
          <a href="https://www.instagram.com/miraculousladybuglive/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.facebook.com/miraculousladybuglive/" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://www.tiktok.com/@miraculousladybuglive_" target="_blank" rel="noopener noreferrer">TikTok</a>
        </div>
      </div>
    </section>

    <!-- ===================== SUBSCRIBE BAND ===================== -->
    <section class="subscribe-band">
      <div class="container">
        <h2 class="subscribe-band__heading">{{ t('subscribe.heading') }}</h2>
        <p class="subscribe-band__text">{{ t('subscribe.text') }}</p>
        <NuxtLink to="/signup" class="btn btn--buy">{{ t('subscribe.cta') }}</NuxtLink>
      </div>
    </section>

    <SiteFooter />
  </div>
</template>

<style scoped>
.page {
  min-height: 100dvh;
  overflow-x: clip; /* no horizontal scroll from full-bleed hero elements */
}

/* --------------------------- LANG TOGGLE --------------------------- */
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
.lang span.on {
  color: var(--scarlet);
}
.lang .sep {
  opacity: 0.4;
}

/* --------------------------- LIVE TUNER --------------------------- */
.tuner {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 230px;
  padding: 0.9rem 1rem;
  background: rgba(10, 5, 7, 0.85);
  border: 1px solid rgba(244, 14, 4, 0.5);
  border-radius: 12px;
  color: var(--cream);
  font-size: 0.78rem;
  backdrop-filter: blur(8px);
}
.tuner strong {
  color: var(--red);
  font-size: 0.8rem;
}
.tuner label {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.tuner input[type='range'] {
  width: 100%;
  accent-color: var(--red);
}
.tuner code {
  margin-top: 0.25rem;
  font-size: 0.68rem;
  color: var(--cream-dim);
  word-break: break-all;
}
.tuner__copy {
  margin-top: 0.35rem;
  padding: 0.45rem;
  border: none;
  border-radius: 8px;
  background: var(--red);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}
.tuner__copy:hover {
  background: #ff1f4a;
}

/* ------------------------------- HERO ------------------------------- */
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  min-height: 100svh;
  padding: 3.5rem 1.5rem 2rem;
  overflow: hidden;
  /* Scarlet of the key-art assets (matches the Ladybug's suit so it melts into
     the bg). Fades to the dark "Help bring…" section from ~78% — the bottom of
     her suit — so her whole suit stays on scarlet and only the CTA/credit band
     melts to dark. Same stacked layout + fade on desktop and mobile. */
  background: linear-gradient(180deg, var(--scarlet) 0%, var(--scarlet) 78%, var(--ink-soft) 100%);
}


/* Ladybug portrait — in-flow, centred, stacked below the title at every width
   (same arrangement as mobile). Width tunable via --art-w. */
.hero__art {
  align-self: center;
  width: var(--art-w, clamp(230px, 19vw, 340px));
  z-index: 1;
  pointer-events: none;
}
.hero__art img {
  width: 100%;
  height: auto;
  display: block;
}

/* Title treatment */
.hero__logo {
  position: relative;
  z-index: 2;
  width: var(--title-w, clamp(280px, 28vw, 430px));
  height: auto;
  filter: drop-shadow(0 8px 22px rgba(0, 0, 0, 0.22));
}

/* Tagline + CTA + credit, centred. Width-constrained so long lines (tagline,
   composer names) wrap on narrow screens instead of being clipped by the hero's
   overflow; on desktop the cap is wide enough to keep them on one line. */
.hero__lockup {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.1rem;
  text-align: center;
}
.hero__tagline {
  font-size: clamp(1.05rem, 1.5vw, 1.6rem);
  color: #fff;
  width: 100%;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.22);
}

/* Composer credit — centred under the CTA (part of the lockup). */
.hero__credit {
  width: 100%;
  margin: 0.25rem 0 0;
  text-align: center;
  font-family: var(--font-display);
  line-height: 1.25;
}
.hero__credit-label {
  display: block;
  color: #fff;
  font-size: clamp(0.72rem, 0.9vw, 0.92rem);
  letter-spacing: 0.05em;
  margin-bottom: 0.25em;
}
.hero__credit-names {
  display: block;
  color: #fff;
  font-size: clamp(0.9rem, 1.15vw, 1.2rem);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.cta {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 2.2rem;
  border: none;
  border-radius: 999px;
  background: #150a0b;
  color: #fff;
  font-family: var(--font-display);
  font-size: 1.25rem;
  letter-spacing: 0.03em;
  cursor: pointer;
  box-shadow: 0 14px 30px -12px rgba(0, 0, 0, 0.6);
  transition: transform 0.15s ease, background 0.15s ease;
}
.cta:hover {
  background: #000;
  transform: translateY(-2px);
}
.cta__arrow {
  animation: bob 1.6s ease-in-out infinite;
}

.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.9rem;
}
.scroll-hint {
  display: none; /* removed: overlapped the CTA on the compact hero */
  position: absolute;
  left: 50%;
  bottom: 1.5rem;
  transform: translateX(-50%);
  width: 26px;
  height: 42px;
  border: 2px solid rgba(243, 233, 216, 0.5);
  border-radius: 20px;
  background: transparent;
  cursor: pointer;
  z-index: 3;
}
.scroll-hint span {
  position: absolute;
  left: 50%;
  top: 8px;
  width: 4px;
  height: 8px;
  margin-left: -2px;
  border-radius: 2px;
  background: var(--cream);
  animation: bob 1.6s ease-in-out infinite;
}

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}


/* ---------------------------- MAP / TRAILER / SOCIAL ---------------------------- */
.map-section,
.trailer-section,
.social-section {
  padding: 4rem 0;
  background: var(--ink);
}
.trailer-section { background: var(--ink-soft); }

.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 4.5vw, 2.4rem);
  color: var(--red);
  text-transform: uppercase;
  margin-bottom: 0.6rem;
  text-align: center;
}
.section-lead {
  color: var(--cream-dim);
  text-align: center;
  max-width: 46ch;
  margin: 0 auto 2rem;
}

.map-legend {
  display: flex;
  justify-content: center;
  gap: 1.6rem;
  margin-top: 1.2rem;
}
.map-legend__item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--cream-dim);
  font-size: 0.85rem;
}
.map-legend__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.map-legend__dot--tournee { background: var(--red); }
.map-legend__dot--residence { background: var(--cream); }

.upcoming__heading {
  margin-top: 3rem;
  margin-bottom: 1rem;
  color: var(--cream-dim);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-align: center;
}
.upcoming {
  display: flex;
  flex-direction: column;
  gap: 1px;
  max-width: 820px;
  margin: 0 auto;
  background: rgba(243, 233, 216, 0.08);
  border-radius: 12px;
  overflow: hidden;
}
.upcoming__link {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.6rem 1.2rem;
  padding: 1rem 1.3rem;
  background: var(--ink-panel);
}
.upcoming__date { color: var(--red); font-weight: 700; font-size: 0.85rem; white-space: nowrap; }
.upcoming__place { color: var(--cream); font-weight: 700; }
.upcoming__country { display: block; color: var(--cream-dim); font-weight: 400; font-size: 0.78rem; }
.upcoming__venue { grid-column: 2; color: var(--cream-dim); font-size: 0.82rem; margin-top: -0.4rem; }

.upcoming__more { display: flex; justify-content: center; margin-top: 2rem; }
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.3rem;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.15s ease, background 0.15s ease, color 0.15s ease;
}
.btn--outline {
  border: 1px solid rgba(243, 233, 216, 0.3);
  color: var(--cream);
}
.btn--outline:hover { border-color: var(--red); color: var(--red); }

.badge {
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
}
.badge--en_vente { background: rgba(244, 14, 4, 0.16); color: var(--red); }
.badge--confirmee { background: rgba(243, 233, 216, 0.12); color: var(--cream); }
.badge--envisagee { background: rgba(243, 233, 216, 0.06); color: var(--cream-dim); }
.badge--epuisee { background: rgba(243, 233, 216, 0.06); color: var(--cream-dim); text-decoration: line-through; }

@media (max-width: 560px) {
  .upcoming__link { grid-template-columns: 1fr auto; }
  .upcoming__date { grid-column: 1 / -1; }
  .upcoming__venue { grid-column: 1 / -1; }
}

.trailer-placeholder {
  max-width: 780px;
  margin: 0 auto;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  background: var(--ink-panel);
  border: 1px dashed rgba(244, 14, 4, 0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
.trailer-placeholder__play {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(244, 14, 4, 0.16);
  color: var(--red);
  font-size: 1.4rem;
}
.trailer-placeholder__text { color: var(--cream-dim); font-size: 0.9rem; }

.social-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
  max-width: 760px;
  margin: 0 auto 2rem;
}
.social-grid__tile {
  aspect-ratio: 1;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(244, 14, 4, 0.14), rgba(243, 233, 216, 0.06));
}
.social-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}
.social-links a {
  color: var(--cream);
  font-weight: 700;
  font-size: 0.9rem;
  transition: color 0.15s ease;
}
.social-links a:hover { color: var(--red); }

@media (max-width: 560px) {
  .social-grid { grid-template-columns: repeat(3, 1fr); }
}

/* --------------------------- SUBSCRIBE BAND --------------------------- */
.subscribe-band {
  padding: 3.5rem 0;
  text-align: center;
  background: linear-gradient(120deg, rgba(244, 14, 4, 0.9), rgba(244, 14, 4, 0.55));
}
.subscribe-band__heading {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2.1rem);
  color: #fff;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
}
.subscribe-band__text {
  color: rgba(255, 255, 255, 0.9);
  max-width: 50ch;
  margin: 0 auto 2.4rem;
}
.btn--buy {
  background: #150a0b;
  color: #fff;
  padding: 0.8rem 1.8rem;
  font-size: 0.95rem;
}
.btn--buy:hover { background: #000; transform: translateY(-2px); }

/* ---------------------------- RESPONSIVE ---------------------------- */
@media (min-width: 860px) {
  /* Tagline on a single line on desktop */
  .hero__tagline {
    max-width: none;
    white-space: nowrap;
  }
}

/* Mobile: key art sits at the TOP, full and sharp; content stacks below.
   Stays at 860px: below that the desktop overlay (centred copy on top of the
   art) collides with the characters, so the stacked layout has to take over. */
@media (max-width: 859px) {
  .hero {
    justify-content: center;
    min-height: 100svh; /* CTA visible above the fold on phones too */
    padding: 3.25rem 1rem 1.75rem;
    gap: 0.9rem;
  }
  /* Title on top, then the Ladybug returns to flow below it (DOM order) */
  .hero__logo {
    width: min(76%, 330px);
  }
  .hero__art {
    position: static;
    width: min(60%, 250px);
    align-self: center;
  }
  /* Keep the tagline on ONE line on phones: it needs ~26.5x its font-size in
     width (measured), so scale the font with the viewport below ~560px where the
     fixed 1.05rem would wrap. Capped at 1.05rem on wider phones. */
  .hero__tagline {
    font-size: min(1.05rem, 3.2vw);
    white-space: nowrap;
  }
}
</style>
