<script setup lang="ts">
import type { CityRow } from '~/server/api/cities.get'
import { countryNameByCode } from '~/utils/countries'
import { HIDDEN_CITY_SLUGS } from '~/utils/hiddenCities'
import { toCityDisplayRows, formatCityDate } from '~/utils/cityDisplayRows'

const { t, locale } = useLocale()
const route = useRoute()

// Subscribe-band stars — Math, 2026-10-15: "the stars should shine a bit
// more randomly". The old .bg-stars utility twinkles two layers of stars
// in lockstep (all stars in a layer pulse together); these are real
// elements, each with its own animation-duration/delay, so they drift in
// and out of sync with each other. Fixed (not Math.random()) so SSR and
// client markup match — "random-looking" layout, not regenerated per load.
/* Math, 2026-10-15: "its a bit bright can we add in degardé or reduce
   opacity" — peak brightness per star scaled down ~40%. */
/* Math, 2026-10-15: "the stars have to be smaller" — size scaled down
   ~45% from the previous pass. Peaks already top out at 0.59 (never 100%
   opacity), confirmed. */
const subscribeStars = [
  { left: 62.7, top: 7.1, size: 5.1, peak: 0.37, duration: 4.63, delay: 3.38 },
  { left: 86.8, top: 12.4, size: 5.7, peak: 0.31, duration: 2.92, delay: 2.53 },
  { left: 4.5, top: 21.9, size: 6.7, peak: 0.46, duration: 2.93, delay: 2.95 },
  { left: 78.9, top: 5.6, size: 7.4, peak: 0.51, duration: 3.32, delay: 0.78 },
  { left: 92.9, top: 33.6, size: 4.2, peak: 0.33, duration: 5.0, delay: 3.02 },
  { left: 78.7, top: 67.0, size: 6.2, peak: 0.59, duration: 3.45, delay: 2.76 },
  { left: 80.8, top: 57.6, size: 7.6, peak: 0.47, duration: 4.53, delay: 0.23 },
  { left: 23.7, top: 29.6, size: 4.2, peak: 0.37, duration: 2.53, delay: 1.39 },
  { left: 62.4, top: 36.0, size: 5.5, peak: 0.36, duration: 3.08, delay: 4.68 },
  { left: 63.6, top: 56.8, size: 4.6, peak: 0.52, duration: 2.74, delay: 1.9 },
  { left: 96.0, top: 59.4, size: 6.3, peak: 0.5, duration: 4.98, delay: 3.88 },
  { left: 23.8, top: 7.7, size: 5.2, peak: 0.38, duration: 2.9, delay: 4.71 },
  { left: 85.3, top: 31.7, size: 6.7, peak: 0.42, duration: 5.22, delay: 2.29 },
  { left: 27.2, top: 26.0, size: 6.3, peak: 0.38, duration: 4.13, delay: 4.49 },
  { left: 39.9, top: 23.6, size: 8.2, peak: 0.45, duration: 2.5, delay: 0.24 },
  { left: 12.4, top: 58.3, size: 7.3, peak: 0.43, duration: 2.41, delay: 1.91 },
]

const { data: citiesData } = await useFetch<CityRow[]>('/api/cities')
const cities = computed(() => citiesData.value ?? [])

const mapCities = computed(() => cities.value.filter((c) => !HIDDEN_CITY_SLUGS.has(c.slug)))

// Next few dates across all tour stops (residency cities have no single
// start_date, so they're naturally excluded — the Paris residency gets its
// own page). Qatar has a tour-format date but is still in HIDDEN_CITY_SLUGS
// (venue not finalized), so it needs the same explicit filter as the map.
// Expanded to one row PER PERFORMANCE (toCityDisplayRows), not per city —
// Math, 2026-10-15: "Kitchener needs two entire lines... not two dates on
// the same line" — so a two-night stop like Kitchener takes two full rows
// here, same as the villes listing, and the slice(0, 6) counts performances.
const upcomingCities = computed(() =>
  toCityDisplayRows(
    cities.value.filter((c) => c.format === 'tournee' && c.startDate && !HIDDEN_CITY_SLUGS.has(c.slug)),
  )
    .sort((a, b) => new Date(a.displayDate!).getTime() - new Date(b.displayDate!).getTime())
    .slice(0, 6),
)

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
    <!-- Sparkle/art/title/subtitle is the flat art direction straight out of
         design-source/POSTER/MLL_261009_CoverART_4X5_REVEAL.png (cropped
         above "a musical by" + the logo row) — pixel-exact per Math rather
         than reconstructed from the separate layers. Credit, tagline and CTA
         are website-only additions below it, in that order (Math, 2026-10-14:
         "the quote under the tickets"). -->
    <section class="hero" :style="tuning ? heroStyle : undefined">
      <!-- Math, 2026-10-15: "c'est pas super clean... vous avez mélangé les
           étoiles. Mettez les étoiles sur la bannière get exclusive content
           et sur le poster on met rien." Poster stays clean — no stars, no
           honeycomb. -->
      <img class="hero__poster-img" src="/images/hero-poster.webp" :alt="t('hero.logoAlt')" />

      <img
        class="hero__credit-img"
        src="/images/hero-musicalby.webp"
        :alt="`${t('hero.musicalBy')} Ella Louise Allaire & Martin Lord Ferguson`"
      />

      <div class="hero__lockup">
        <div class="hero__ctas">
          <!-- Single hero CTA per Math — the waitlist sign-up now lives in its
               own section/page (subscribe band + /signup), not competing here. -->
          <NuxtLink to="/villes" class="cta">
            {{ t('villes.cta.buy') }}
          </NuxtLink>
        </div>
        <p class="hero__tagline">{{ t('hero.tagline') }}</p>
      </div>
    </section>

    <!-- ===================== MAP ===================== -->
    <section class="map-section">
      <div class="container">
        <h2 class="section-title">{{ t('map.heading') }}</h2>
        <p class="section-lead">{{ t('map.lead') }}</p>
        <WorldMap :cities="mapCities" />
        <div class="map-legend">
          <span class="map-legend__item"><i class="map-legend__dot map-legend__dot--tournee" />{{ t('map.legendTour') }}</span>
        </div>
      </div>
    </section>

    <!-- ===================== UPCOMING DATES ===================== -->
    <!-- Math, 2026-10-15: "honeycombs not on the map please just on the
         dates", then "on the main page the honeycombs are not to the edge"
         — a separate full-width section (own bg-honeycomb, reaching the
         real page edges like every other page) instead of a narrower div
         nested inside .map-section's .container. -->
    <section class="dates-section bg-honeycomb">
      <div class="container">
        <h3 class="upcoming__heading">{{ t('upcoming.heading') }}</h3>
        <!-- Math, 2026-10-15: "le layout [de where the show is going] était
             mieux" — same row structure as pages/villes/index.vue (city+
             country | venue+dates | status), own class names (city-row*)
             since .btn/.badge already mean something different on this page
             (subscribe band). -->
        <ul v-if="upcomingCities.length" class="city-list">
          <li v-for="c in upcomingCities" :key="c.rowKey" class="city-row">
            <NuxtLink :to="`/villes/${c.slug}`" class="city-row__place">
              <p class="city-row__city">{{ c.city }}</p>
              <p class="city-row__country">{{ countryName(c) }}</p>
            </NuxtLink>
            <div class="city-row__details">
              <p v-if="c.venue" class="city-row__venue">{{ c.venue }}</p>
              <p class="city-row__dates">{{ formatCityDate(c.displayDate, locale) }}</p>
            </div>
            <div class="city-row__action">
              <!-- Math, 2026-10-15: "remove the confirmed and add buy
                   tickets and VIP, two different clickable links" — same
                   treatment as pages/villes/index.vue. -->
              <span v-if="c.status !== 'confirmee' && c.status !== 'en_vente'" class="city-badge" :class="`city-badge--${c.status}`">{{ t(`villes.status.${c.status}`) }}</span>
              <template v-else>
                <a :href="c.ticketUrl || '/signup'" class="city-btn city-btn--buy">{{ t('villes.cta.buy') }}</a>
                <NuxtLink to="/vip" class="city-btn city-btn--vip">{{ t('nav.vip') }}</NuxtLink>
              </template>
            </div>
          </li>
        </ul>
        <p v-else class="section-lead">{{ t('upcoming.empty') }}</p>

        <div class="upcoming__more">
          <NuxtLink to="/villes" class="btn btn--outline">{{ t('upcoming.seeAll') }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ===================== TRAILER ===================== -->
    <!-- YouTube embed (CLAUDE.md: never self-hosted video) — Math,
         2026-10-06, https://youtu.be/v7n0ZGZsahI -->
    <section class="trailer-section">
      <div class="container">
        <h2 class="section-title">{{ t('trailer.heading') }}</h2>
      </div>
      <!-- Math: "here is a new background for the trailer section can you
           make it fit so the video arrives in between lady bug and
           catnoir" — full-width banner (Ladybug left, Cat Noir right,
           empty "stage" gap between them), sized to the image's own
           aspect ratio so it's never cropped/distorted; the video sits
           positioned in that gap (measured from the source art: the gap
           runs ~36.5%-65% of the image width, centered ~50.7%). -->
      <div class="trailer-banner">
        <div class="trailer-embed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/v7n0ZGZsahI"
            :title="t('trailer.heading')"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <!-- ===================== SOCIAL / FOLLOW ===================== -->
    <section class="social-section">
      <div class="container">
        <h2 class="section-title">{{ t('social.heading') }}</h2>
        <p class="section-lead">{{ t('social.lead') }}</p>
        <div class="social-grid">
          <a
            v-for="i in 8"
            :key="i"
            href="https://www.instagram.com/miraculousladybuglive/"
            target="_blank"
            rel="noopener noreferrer"
            class="social-grid__tile"
            :aria-label="t('social.heading')"
          >
            <img :src="`/images/social/ig-${i}.jpg`" alt="" loading="lazy" />
          </a>
        </div>
      </div>
    </section>

    <!-- ===================== SUBSCRIBE BAND ===================== -->
    <!-- Math, 2026-10-15: "mettez les étoiles sur la bannière get exclusive
         content", then "the stars should shine a bit more randomly" —
         individually-animated star elements instead of the shared
         bg-stars utility, see subscribeStars above. -->
    <section class="subscribe-band">
      <div class="subscribe-band__stars" aria-hidden="true">
        <span
          v-for="(s, i) in subscribeStars"
          :key="i"
          class="subscribe-band__star"
          :style="{
            left: s.left + '%',
            top: s.top + '%',
            width: s.size + 'px',
            height: s.size + 'px',
            '--peak': s.peak,
            animationDuration: s.duration + 's',
            animationDelay: s.delay + 's',
          }"
        />
      </div>
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
  justify-content: flex-start;
  gap: 1.2rem;
  min-height: 100svh;
  padding: 1.75rem 1.5rem 2rem;
  overflow: hidden;
  /* Scarlet of the key-art assets (matches the Ladybug's suit so it melts into
     the bg). Fades to the dark "Help bring…" section from ~78% — the bottom of
     her suit — so her whole suit stays on scarlet and only the CTA/credit band
     melts to dark. Same stacked layout + fade on desktop and mobile.
     Pink corner glow (added then removed same day, 2026-10-15) — Math: "on
     the cover art section there is a weird colour to the right like pink
     or something". Cover art/hero stays pure red, nothing added. */
  background: linear-gradient(180deg, var(--scarlet) 0%, var(--scarlet) 78%, var(--ink-soft) 100%);
}
.hero__honeycomb {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='157' viewBox='0 0 90 157'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23f3e9d8' fill-opacity='0.1'%3E%3Cpath d='M44.77 29.6l41.6 24v48l-41.6 24L3.2 101.6v-48l41.57-24zM9.6 57.28v40.64l35.17 20.29 35.2-20.32V57.28l-35.2-20.29L9.6 57.28zM0 48l41.54-24V0h-6.4v20.32L0 40.61v7.36zm0 59.2L41.54 131.2v25.6h-6.4v-21.92L0 114.59v-7.36zM48 0v24L89.57 48H89.6v-7.39h-.3.2L54.4 20.32V0h-6.4zm0 156.8v-25.6l41.57-24H89.6v7.39h-.3.2L54.4 134.88V156.8h-6.4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  -webkit-mask-image: radial-gradient(70% 70% at 15% 15%, black 0%, black 35%, transparent 75%);
  mask-image: radial-gradient(70% 70% at 15% 15%, black 0%, black 35%, transparent 75%);
}


/* Flat poster art — pixel-exact crop of the reference, scales as one piece
   so the sparkle/art/title/subtitle relationship can't drift out of position
   again. */
.hero__poster-img {
  position: relative;
  z-index: 2;
  /* Math, 2026-10-14: "still too small... lots of space as long as we fit
     get tickets in the screen" — measured directly: even at the 340px floor
     there was ~250px of unused height below the CTA on a 390x844 phone, so
     width (not height) is the real constraint on mobile. 95vw fills almost
     edge to edge there (paired with reduced side padding below) while still
     being one continuous formula — ceiling just reached earlier (~674px
     viewport instead of ~890px). */
  width: clamp(360px, 95vw, 640px);
  height: auto;
  display: block;
}
.hero__credit-img {
  position: relative;
  z-index: 2;
  width: clamp(130px, 17vw, 180px);
  height: auto;
  margin-top: -0.6rem;
}

/* CTA, then tagline below it — website-only additions, not part of the key
   art (Math, 2026-10-14: "the quote under the tickets"). */
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
  margin-top: 1rem;
}
.hero__tagline {
  font-size: clamp(1.05rem, 1.5vw, 1.6rem);
  color: #fff;
  width: 100%;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.22);
}

.cta {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 2.2rem;
  border: none;
  border-radius: 999px;
  background: var(--cream);
  color: #150a0b;
  font-family: var(--font-display);
  font-size: 1.25rem;
  letter-spacing: 0.03em;
  cursor: pointer;
  box-shadow: 0 14px 30px -12px rgba(0, 0, 0, 0.6);
  transition: transform 0.15s ease, background 0.15s ease;
}
.cta:hover {
  background: #fff;
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


/* ---------------------------- MAP / DATES / TRAILER / SOCIAL ---------------------------- */
.map-section,
.dates-section,
.trailer-section,
.social-section {
  padding: 4rem 0;
  background: var(--ink);
}
/* Math, 2026-10-15: "there is a green flare on the map that is not
   necessary" — green touch removed, cream wash kept for warmth. Green is
   no longer used anywhere on the site. */
.map-section {
  background:
    radial-gradient(130% 80% at 50% 100%, rgba(243, 233, 216, 0.06), transparent 70%),
    var(--ink);
}
/* Was the bottom half of .map-section; split into its own full-width
   section (Math, 2026-10-15: "on the main page the honeycombs are not to
   the edge") so bg-honeycomb reaches the real page edges, same as every
   other page, instead of being nested inside .map-section's .container. */
/* padding-top instead of 0 + the heading's own margin-top (Math, 2026-10-15:
   "make the honeycomb up to the upper section") — that margin was
   collapsing straight through this section's own box (no border/padding
   to stop it) and escaping above it, leaving a honeycomb-free gap between
   this section and .map-section above. Padding is part of the box, so
   bg-honeycomb now covers right up to the section above with no seam.
   Then "remove the honeycombs at the footer its like if they appear
   below... but when I take a screenshot they dont appear" — the pseudo-
   element has nothing to do with SiteFooter in the DOM, but overflow:
   hidden here clips it defensively to this section's own box, ruling out
   any compositing/painting edge case letting it visually extend past it. */
.dates-section {
  padding-top: 3rem;
  overflow: hidden;
}
/* Math, 2026-10-15: "maybe the trailer section could be a other colour, so
   the first page is less black" — went through red, several rounds of
   green, and pink, then: "instead of the pink can we use the blue of
   marinette's hair" — swapped to --blue, brightened to "more electric".
   Then "with degradé please" (read as edges-bright/middle-dark, backwards),
   corrected: "the blue I meant degradé on the top and on the bottom not in
   the middle" — solid --blue through the body, with the fade confined to
   short transition zones right at the top and bottom seams (blending into
   the black sections above/below), not a fade spanning the whole section. */
/* Math: "the degradé of the blu is great but can it be longer" — longer
   fade zones at the top/bottom seams (was 8%/92%, now 25%/75%). */
/* Math: "ok lets remove the blue and add some cream instead" — same
   gradient structure, cream instead of --blue; the default red
   section-title already reads well on cream, so no color override needed. */
/* Math: "ok forget the cream for the website trailer section lets go back
   to green" — same gradient structure, --green instead (flat fill in the
   middle, not the earlier vivid top-glow neon version that read "too
   video game"). */
/* Math: "Can we replace the green with this please" — branded Ladybug
   key-art background (public/images/trailer-bg.webp) instead of a flat
   color fill. */
/* Math: "can the trailer title be in the red to pink band" — the title
   moved back to a plain --ink background in the banner redesign (there's
   no vertical room to overlay it on the image itself without covering
   Ladybug/Cat Noir's heads, which reach nearly the full height of the
   art). Instead, the title's own band is now the same red-to-pink
   gradient as the banner's edges, so it reads as one continuous colored
   section instead of title-on-black above a colorful image. */
.trailer-section {
  padding-bottom: 0;
  background: linear-gradient(90deg, #e91d26, #e921a9);
}
.trailer-section .section-title {
  color: var(--cream);
}
.trailer-banner {
  position: relative;
  width: 100%;
  /* Matches the source art's own ratio (7842x1847) exactly, so cover never
     has to crop or upscale it — same "keep it crisp, don't distort"
     reasoning as the Story page background. */
  aspect-ratio: 7842 / 1847;
  margin-top: 2.5rem;
  background-image: url('/images/trailer-bg.webp');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
/* Math: "can you make the player bigger so it touches ladybug and cat
   noir" — widened to the gap's full measured width (28.51% of the
   banner); since the banner scales as one locked-aspect-ratio unit, this
   percentage holds at every viewport width, so no separate mobile value
   is needed. */
.trailer-embed {
  position: absolute;
  left: 50.7%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 28.51%;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  overflow: hidden;
  background: var(--ink-panel);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
}

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
  margin-bottom: 1rem;
  color: var(--cream-dim);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-align: center;
}
/* Same row structure/styling as pages/villes/index.vue's .list/.row. Math,
   2026-10-15: "no honeycomb... on the dates lines" — opaque gap color so
   the newly-added bg-honeycomb on this element can't bleed through the
   1px dividers between rows. */
.city-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  max-width: 820px;
  margin: 0 auto;
  background: var(--ink-panel);
  border-radius: 14px;
  overflow: hidden;
}
/* Math: "if we put cream behind the tour dates just for fun" — cream card
   instead of the dark --ink-panel, text/badges/VIP button flipped to dark
   ink so they stay legible on the light background; red left accent and
   the Buy Tickets button (already red-on-white) carry over unchanged. */
.city-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
  padding: 1.5rem 1.6rem;
  border-left: 3px solid var(--red);
  /* Math, 2026-10-15: "the red degradé could be a bit more prominent". */
  background: linear-gradient(90deg, rgba(244, 14, 4, 0.2), transparent 45%), var(--cream);
  color: #1c0f0d;
  transition: background 0.15s ease;
  align-items: center;
}
@media (min-width: 720px) {
  .city-row { grid-template-columns: 1.1fr 1.4fr auto; }
}
/* Math, 2026-10-15: "can the whole line go a bit more red when the cursor
   goes over?" — flat full-width tint instead of a gradient that fades out
   partway, so the whole row shifts together. */
.city-row:hover {
  background: linear-gradient(rgba(244, 14, 4, 0.22), rgba(244, 14, 4, 0.22)), var(--cream);
}
.city-row__place { display: block; text-decoration: none; color: inherit; }
.city-row__city {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: #1c0f0d;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.city-row__country { color: rgba(28, 15, 13, 0.55); font-size: 0.85rem; }
.city-row__details { color: rgba(28, 15, 13, 0.6); font-size: 0.9rem; }
.city-row__venue { color: #1c0f0d; margin-bottom: 0.15rem; }
.city-row__dates { color: rgba(28, 15, 13, 0.6); }
.city-row__action { display: flex; align-items: center; gap: 0.9rem; flex-wrap: wrap; }
.city-badge {
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
}
.city-badge--en_vente { background: rgba(244, 14, 4, 0.14); color: var(--red); }
.city-badge--confirmee { background: rgba(28, 15, 13, 0.08); color: #1c0f0d; }
.city-badge--envisagee { background: rgba(28, 15, 13, 0.06); color: rgba(28, 15, 13, 0.55); }
.city-badge--epuisee { background: rgba(28, 15, 13, 0.06); color: rgba(28, 15, 13, 0.55); text-decoration: line-through; }
.city-btn {
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
  text-decoration: none;
  transition: transform 0.15s ease, background 0.15s ease;
  white-space: nowrap;
}
.city-btn--buy { background: var(--red); color: #fff; }
.city-btn--buy:hover { background: #ff1f4a; transform: translateY(-1px); }
.city-btn--vip { background: #1c0f0d; color: var(--cream); }
.city-btn--vip:hover { background: #000; transform: translateY(-1px); }

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

.trailer-embed iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
  max-width: 760px;
  margin: 0 auto 2rem;
}
.social-grid__tile {
  display: block;
  aspect-ratio: 1;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(244, 14, 4, 0.14), rgba(243, 233, 216, 0.06));
  overflow: hidden;
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.social-grid__tile:hover { transform: translateY(-2px); opacity: 0.85; }
.social-grid__tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
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
  position: relative;
  overflow: hidden;
  padding: 3.5rem 0;
  text-align: center;
  background: linear-gradient(120deg, var(--red), var(--red-deep));
}
.subscribe-band__stars {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.subscribe-band__star {
  position: absolute;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath d='M8 0 Q9.2 6.8 16 8 Q9.2 9.2 8 16 Q6.8 9.2 0 8 Q6.8 6.8 8 0 Z' fill='%23f3e9d8'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.08;
  animation-name: subscribe-star-twinkle;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
@keyframes subscribe-star-twinkle {
  0% { opacity: 0.08; }
  100% { opacity: var(--peak, 0.5); }
}
@media (prefers-reduced-motion: reduce) {
  .subscribe-band__star { animation: none; opacity: 0.3; }
}
/* Content above the star layer. */
.subscribe-band .container {
  position: relative;
  z-index: 2;
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

/* Mobile: same poster stack, just a tighter viewport. Poster width is NOT
   overridden here — the base clamp() already scales continuously down to
   small phones; a separate fixed value here created a visible jump right at
   this breakpoint (Math, 2026-10-14). */
@media (max-width: 859px) {
  .hero {
    /* No forced min-height on mobile — the poster+credit+CTA+tagline block
       is shorter than a full screen here, and 100svh left a lot of empty
       red space below the tagline (Math, 2026-10-14). Let it hug content. */
    min-height: 0;
    padding: 1.75rem 0.5rem 2.5rem;
    gap: 0.9rem;
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
