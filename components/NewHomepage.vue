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
// here, same as the villes listing, and the slice counts performances.
// Math, 2026-10-16: "condense that section so we can add more cities on
// mobile" — rows are now much more compact on mobile (see .city-row's
// max-width: 719px block below), so 6 -> 10 fits in roughly the same
// scroll length it used to take to show 6.
const upcomingCities = computed(() =>
  toCityDisplayRows(
    cities.value.filter((c) => c.format === 'tournee' && c.startDate && !HIDDEN_CITY_SLUGS.has(c.slug)),
  )
    .sort((a, b) => new Date(a.displayDate!).getTime() - new Date(b.displayDate!).getTime())
    .slice(0, 10),
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
      <!-- Math: "can we make the star on the poster art shine" — the
           sparkle is baked into the flat key-art image itself; this is a
           separate animated glow overlaid directly on top of it (not a
           new decorative star — the no-stars-on-the-poster decision from
           2026-10-15 above was about adding more, not animating the one
           that's already part of the official art), positioned to match
           where it sits in the source image (~18.5%, ~12% from the
           top-left). -->
      <!-- Math, 2026-10-19: "mettre a jour le poster avec une mention
           tickets on sale october 23rd" — sits above the key art rather
           than baked into hero-poster.webp itself, so the date can change
           later without a new export of the poster image. -->
      <p class="hero__onsale-banner">{{ t('hero.onSaleBanner') }}</p>
      <div class="hero__poster-wrap">
        <img class="hero__poster-img" src="/images/hero-poster.webp" :alt="t('hero.logoAlt')" />
        <div class="hero__poster-star" aria-hidden="true">
          <img class="hero__poster-star-img" src="/images/hero-poster.webp" alt="" />
        </div>
      </div>

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
         2026-10-18, swapped the desktop trailer for
         https://youtu.be/OLCe-Vm62-E (same video used as the generic
         on-sale email trailer, emails/build.mjs DEFAULT_VIDEO_URL) -->
    <section class="trailer-section">
      <div class="container">
        <h2 class="section-title">{{ t('trailer.heading') }}</h2>
      </div>
      <!-- Math, 2026-10-16: "can we make the player bigger so it fits under
           the player" + sent Ladybug and Cat Noir as separate cutouts
           ("they are in backgrounds") — the old flattened banner image
           locked the characters and the video gap to one fixed baked-in
           layout, so none of the three could grow independently. Rebuilt
           with the plain gradient (.trailer-section's own background
           shows through — no image here anymore) and the two characters
           as their own layered, independently-sized images, flanking a
           bigger centered video. -->
      <div class="trailer-banner">
        <img class="trailer-char trailer-char--lb" src="/images/trailer-ladybug.webp" alt="" aria-hidden="true" />
        <!-- Math, 2026-10-16: sent a native 9:16 Short
             (youtube.com/shorts/mIxEgeRMiag) to use on mobile instead of
             cropping/squeezing the 16:9 trailer — two iframes, toggled by
             CSS media query (.trailer-embed--desktop/--mobile below), so
             each breakpoint gets the video cut actually made for it. -->
        <div class="trailer-embed">
          <iframe
            class="trailer-embed__frame trailer-embed__frame--desktop"
            src="https://www.youtube-nocookie.com/embed/OLCe-Vm62-E"
            :title="t('trailer.heading')"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
          />
          <iframe
            class="trailer-embed__frame trailer-embed__frame--mobile"
            src="https://www.youtube-nocookie.com/embed/mIxEgeRMiag"
            :title="t('trailer.heading')"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
          />
        </div>
        <img class="trailer-char trailer-char--cn" src="/images/trailer-catnoir.webp" alt="" aria-hidden="true" />
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
.hero__poster-wrap {
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
}
.hero__poster-img {
  position: static;
  width: 100%;
  height: auto;
  display: block;
}
/* Math, 2026-10-16 (round 2): "the start on the covert art blinking does
   not work at all. It has to be the design that shines not a new light" —
   two problems with the first attempt. First, the window's position/size
   (18.5%/11.9%, 7.5% square) was measured wrong — a pixel scan of the real
   hero-poster.webp (not the old key art) puts the sparkle's actual
   bounding box at 17.3–23.0% horizontally / 7.6–15.8% vertically, taller
   than it is wide, so the old square window only ever covered its
   bottom-right corner. Second, brightness/blend-mode:screen on an
   already-near-white graphic is a no-op (screen(white, x) = white) and so
   is animating the overlay's opacity, because the SAME white sparkle is
   always sitting underneath it in the base poster image at full strength
   — changing the copy on top changes nothing visible. The only way for
   literally this artwork to visibly "shine" is to let the copy grow
   larger than its own resting footprint, so it's still exactly the same
   sparkle, just periodically bigger — no added shape, no new light
   source, just this star pulsing size the way a twinkle actually reads. */
.hero__poster-star {
  position: absolute;
  left: 15.338%;
  top: 4.75%;
  width: 9.602%;
  height: 13.975%;
  overflow: hidden;
  pointer-events: none;
  -webkit-mask-image: radial-gradient(ellipse, black 40%, transparent 85%);
  mask-image: radial-gradient(ellipse, black 40%, transparent 85%);
  animation: hero-star-shine 2.2s ease-in-out infinite;
  transform-origin: center;
}
.hero__poster-star-img {
  /* Re-offsets this copy of hero-poster.webp so it lines up pixel-for-
     pixel with the one underneath, inside this smaller window: width is
     1 / 0.09602 = 1041.47% of the window's own width to bring the full
     poster back to its natural size, shifted by -(0.15338/0.09602) and
     -(0.0475/0.13975) to re-center the sparkle under the window. */
  position: absolute;
  left: -159.74%;
  top: -33.99%;
  width: 1041.466%;
  /* Global `img { max-width: 100% }` (main.css) would otherwise clamp this
     back down to the window's own tiny width, shrinking the whole poster
     into the crop instead of showing a 1:1 zoomed-in slice of it. */
  max-width: none;
  height: auto;
}
/* Math, 2026-10-16: "and the start is animated but can it shine ?" — the
   size pulse alone read as the star growing, not glinting. Added a soft
   white drop-shadow synced to the same peak (not a separate always-on
   light): filter:drop-shadow follows this element's own masked shape
   and isn't clipped by its own overflow:hidden, so the glow bleeds
   outward from the star's silhouette right as it grows, then fades back
   out with it — still this star's own flash, timed to its own motion. */
@keyframes hero-star-shine {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
  }
  50% {
    transform: scale(1.5);
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 14px rgba(255, 255, 255, 0.6));
  }
}
@media (prefers-reduced-motion: reduce) {
  .hero__poster-star { animation: none; }
}
/* On-sale banner, straight bar above the poster art — Math, 2026-10-19:
   "bof, pas sur aussi oblique" — dropped the rotated ribbon for a flat,
   legible bar instead. */
.hero__onsale-banner {
  position: relative;
  z-index: 3;
  margin: 0 0 0.6rem;
  padding: 0.5rem 1.4rem;
  background: var(--cream);
  color: #150a0b;
  font-family: var(--font-display);
  font-size: clamp(0.85rem, 2vw, 1.15rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  text-align: center;
  text-transform: uppercase;
  border-radius: 999px;
  box-shadow: 0 6px 16px -6px rgba(0, 0, 0, 0.5);
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
/* Math, 2026-10-16: went through several rounds of a blue glow/grid
   treatment for this section (radial glow, square grid, bolder glow,
   grid-only) referencing miraculous.com/games/'s green floor-grid —
   ended with "lets remove the grids I dont like it thanks for trying" —
   back to the plain flat --ink background, nothing else. The social
   tiles' own neon-blue border/glow (added in the same round) wasn't
   called out as unwanted, so it's untouched. */
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
  /* Math, 2026-10-16: "the band color is not exactly the same" — a plain
     2-stop gradient between the edge colors doesn't match because the
     banner's own gradient isn't linear (flat red for the first ~25%, flat
     pink for the last ~10%, curved between). These stops are sampled
     directly off design-source/Backgrounds/Background_trailer.png at 10%
     increments across its width, so the CSS curve matches the image's
     curve, not just its two endpoints. */
  background: linear-gradient(
    90deg,
    #ff0000 0%,
    #ff0000 20%,
    #ff0029 30%,
    #ff0042 40%,
    #ff0054 50%,
    #ff0064 60%,
    #ff0073 70%,
    #fe0581 80%,
    #fd0a87 90%,
    #fd0a87 100%
  );
}
.trailer-section .section-title {
  color: var(--cream);
}
/* Math, 2026-10-16: "lady bug and cat noir and the player could be bigger"
   — no longer one flattened image, so none of the three is locked to a
   baked-in layout anymore. Characters are flex items pinned to the
   banner's own bottom edge (space-between keeps them at the outer
   edges). Height uses min(vw, cap) rather than a fixed-floor clamp()
   specifically so it keeps shrinking smoothly with the viewport down to
   the mobile breakpoint — a floor here left a band of mid-width
   viewports (~640-950px) where the banner's height stayed constant while
   it kept getting narrower, which pushed Cat Noir (wider per unit height
   than Ladybug, 1.875:1 vs 2.391:1) into the video.
   Then: "if you make ladybug and cat noir bigger the player has to be
   bigger... would it work so it lines up with them" — characters bumped
   94% -> 100% of the banner's height, and the video moved from a
   separately centered, absolutely-positioned layer (vertically centered,
   so it floated above the characters' feet) to sitting on the same
   bottom edge as the characters ("lines up with them"), and widened to
   keep pace (38% -> 42%, 620px -> 680px cap). Checked for overlap at a
   spread of viewport widths (641-2560px) with the new sizes: narrowest
   gap is ~30px at 641px.
   Then: "the player is not centered between ladybug and cat noir" —
   flex's justify-content:space-between puts EQUAL GAPS on each side of
   the embed, not an equal DISTANCE from each container edge; since Cat
   Noir is wider per unit height than Ladybug (1.875:1 vs 2.391:1), equal
   gaps left the embed's midpoint shifted toward Ladybug's side. First
   fix attempt (grid-template-columns: 1fr auto 1fr) traded that bug for
   a worse one: the embed's own `width: min(42%, 680px)` is a percentage,
   and a percentage width on the single item inside an "auto"-sized grid
   track is circular (the track needs the item's size to size itself, the
   item needs the track's size to resolve its percentage) — browsers fall
   back to a tiny indeterminate size instead (rendered ~126px instead of
   ~800px).
   Then: "we need to align the preview with the characters and the
   preview has to be centered in the section" — true section-centering
   alone wasn't enough: pinning Ladybug/Cat Noir to equal OUTER padding
   (3% from each edge) left their INNER edges (facing the video)
   asymmetric, since Cat Noir is wider — so the video's gap to Ladybug
   read as bigger than its gap to Cat Noir even though the video itself
   sat dead-center. Fixed by positioning all three purely relative to the
   video instead of to the section's edges: the video is absolutely
   centered (left:50%/translateX(-50%)), and each character's INNER edge
   is pinned a fixed distance (half the video's width + a small gap) from
   that same center — so both characters now sit exactly as far from the
   video as each other, by construction, regardless of their own
   differing widths. Checked bounds at 641-2560px: both characters stay
   comfortably inside the viewport at every width (narrowest margin
   ~66px at 641px). */
.trailer-banner {
  position: relative;
  width: 100%;
  height: min(40vw, 640px);
  margin-top: 2.5rem;
}
.trailer-char {
  position: absolute;
  bottom: 0;
  height: 100%;
  width: auto;
  pointer-events: none;
  user-select: none;
}
/* Math, 2026-10-16: "it can be a tad bigger so it barely touches the two
   characters" — embed grown 42%/680px -> 48%/760px, and the gap to each
   character shrunk from 2% to 0.5% to match. Half-width here (min(24%,
   380px)) must stay in sync with the embed's own width below. */
.trailer-char--lb { right: calc(50% + min(24%, 380px) + 0.5%); }
.trailer-char--cn { left: calc(50% + min(24%, 380px) + 0.5%); }
.trailer-embed {
  position: absolute;
  left: 50%;
  /* Math, 2026-10-16: "the player has to be higher" — was bottom:0,
     flush with the characters' feet. Raised to 20%, then "even higher
     the player" — raised again to 32%. */
  bottom: 32%;
  transform: translateX(-50%);
  width: min(48%, 760px);
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  overflow: hidden;
  background: var(--ink-panel);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
}
/* Math, 2026-10-16: "the scaling of the lady bug and cat noir on the
   trailer section is not optimized in mobile the player is also very
   small" — fitting all three side by side the same way as desktop left
   barely any width per element once the viewport got narrow. First fix
   stacked them instead (video full-width on top, characters in a row
   below). Then, once the video grew to "barely touch" the characters on
   desktop: "on mobile the character falls below the player can they
   stay left and right and can we reduce the player more on mobile so
   the characters stays on the side" — back to side-by-side, reusing the
   same center-pinned positioning as desktop, with a smaller 16:9 video.
   Then Math sent a native 9:16 Short (mIxEgeRMiag) for mobile — switched
   from width-driven sizing to height-driven (height:95% of the banner,
   aspect-ratio 9/16 derives the width), same logic as the characters,
   since a tall narrow video needs much less horizontal room than a wide
   one for the same visual size. Character position math recomputed for
   the new derived width: embed_height = 0.95 * min(0.40vw, 640px) =
   min(0.38vw, 608px); embed_width = embed_height * 9/16 = min(0.2138vw,
   342px); half of that is min(10.69%, 171px). Checked bounds at
   320-640px: narrowest margin ~48px at 320px (wide room to spare, since
   the vertical video is much narrower than the old 16:9 crop was).
   Bug found after shipping: "the player goes in front of the trailer
   title" — desktop's bottom:32% was still in effect, and combined with
   height:95% that's 127% of the banner's own height, so the video's top
   27% spilled out above .trailer-banner into the title above it (which
   has no overflow:hidden to catch it). Added a mobile-specific
   bottom:3% so bottom + height stays under 100% (93%), and recomputed
   the character math for the resulting slightly smaller width:
   embed_height = 0.90 * min(0.40vw, 640px) = min(0.36vw, 576px);
   embed_width = embed_height * 9/16 = min(0.2025vw, 324px); half of
   that is min(10.1%, 162px). */
@media (max-width: 640px) {
  .trailer-char--lb { right: calc(50% + min(10.1%, 162px) + 3%); }
  .trailer-char--cn { left: calc(50% + min(10.1%, 162px) + 3%); }
  .trailer-embed {
    width: auto;
    height: 90%;
    bottom: 3%;
    aspect-ratio: 9 / 16;
  }
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
/* Math, 2026-10-16: "the dates are also very big the lines, condense that
   section so we can add more cities on mobile" — below 720px each row was
   three full-width stacked blocks (city+country, venue+date, badge+button)
   at full desktop padding/font-size, so very few rows fit on screen.
   Pulled city+country and venue+date onto one line each (baseline-aligned,
   a bullet between venue and date) and shrunk padding/gaps/font-sizes.
   Placed after the base .city-row__* / .city-badge / .city-btn rules
   (not right after the min-width:720px block above) so it actually wins
   the cascade — same specificity, later source wins, and the base rules
   used to come after it and silently override it. */
@media (max-width: 719px) {
  .city-row { padding: 0.75rem 1rem; gap: 0.3rem; }
  .city-row__place {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .city-row__city { font-size: 1.1rem; }
  .city-row__country { font-size: 0.7rem; }
  .city-row__details {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    flex-wrap: wrap;
    font-size: 0.78rem;
  }
  .city-row__venue { margin-bottom: 0; }
  .city-row__dates::before { content: '•'; margin-right: 0.4rem; color: rgba(28, 15, 13, 0.35); }
  .city-row__action { gap: 0.5rem; }
  .city-badge { padding: 0.2rem 0.55rem; font-size: 0.6rem; }
  .city-btn { padding: 0.38rem 0.85rem; font-size: 0.72rem; }
}

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

.trailer-embed__frame {
  width: 100%;
  height: 100%;
  border: 0;
}
/* Desktop (16:9 trailer) shows by default; mobile (9:16 Short) swaps in
   at the same breakpoint as the rest of the mobile trailer layout. */
.trailer-embed__frame--desktop { display: block; }
.trailer-embed__frame--mobile { display: none; }
@media (max-width: 640px) {
  .trailer-embed__frame--desktop { display: none; }
  .trailer-embed__frame--mobile { display: block; }
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
  /* Math, 2026-10-16: "I want something more bold" (Follow Us section) —
     a thin neon-blue border + glow, echoing the glowing card borders on
     miraculous.com/games/. */
  border: 1px solid rgba(70, 140, 255, 0.45);
  box-shadow: 0 0 16px rgba(50, 120, 255, 0.3);
  transition: transform 0.15s ease, opacity 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.social-grid__tile:hover {
  transform: translateY(-2px);
  opacity: 0.85;
  border-color: rgba(110, 170, 255, 0.85);
  box-shadow: 0 0 26px rgba(80, 150, 255, 0.55);
}
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
