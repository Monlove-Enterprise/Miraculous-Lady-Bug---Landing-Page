<script setup lang="ts">
import { creative, type Person } from '~/utils/castData'

const { t, locale } = useLocale()

// Ella & Martin (creators) get a bigger, featured side-by-side row — Math,
// 2026-10-15: "plus gros Ella et Martin, en premier et sur une ligne".
const featuredCreative = computed(() => creative.slice(0, 2))
const restCreative = computed(() => creative.slice(2))

useHead(() => ({
  title: `${t('cast.title')} — Miraculous Live`,
  meta: [{ name: 'description', content: t('cast.metaDescription') }],
}))

function roleOf(p: Person): string {
  return locale.value === 'fr' ? p.roleFr : p.roleEn
}
function bioOf(p: Person): string {
  if (!p.name) return t('cast.tbaBio')
  return (locale.value === 'fr' ? p.bioFr : p.bioEn) || ''
}
function monogram(p: Person): string {
  if (!p.name) return '🐞'
  return p.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
</script>

<template>
  <main class="cast bg-honeycomb">
    <SiteHeader />

    <div class="container">
      <NuxtLink to="/" class="back">← {{ t('cast.back') }}</NuxtLink>

      <header class="cast__head">
        <h1 class="cast__title">{{ t('cast.title') }}</h1>
        <p class="cast__intro">{{ t('cast.intro') }}</p>
      </header>

      <!-- Cast -->
      <!-- Math, 2026-10-19: "remove the place holders for the cast" — no
         real cast announced yet, so the section is just the heading + note
         until names are confirmed, instead of 4 empty "to be announced"
         cards. -->
      <section class="cast__section" aria-labelledby="cast-h">
        <h2 id="cast-h" class="cast__heading">{{ t('cast.castHeading') }}</h2>
        <p class="cast__note">{{ t('cast.castNote') }}</p>
      </section>

      <!-- Creative team -->
      <section class="cast__section" aria-labelledby="creative-h">
        <h2 id="creative-h" class="cast__heading">{{ t('cast.creativeHeading') }}</h2>

        <ul class="featured-grid">
          <li v-for="(p, i) in featuredCreative" :key="'f' + i" class="featured-card">
            <NuxtLink v-if="p.slug" :to="`/cast/${p.slug}`" class="card__link">
              <div class="featured-card__photo" :class="{ 'card__photo--photo': p.photo }" aria-hidden="true">
                <img v-if="p.photo" :src="p.photo" :alt="p.name" class="card__img card__img--center" />
                <span v-else class="card__mono">{{ monogram(p) }}</span>
              </div>
              <p class="featured-card__name">{{ p.name || t('cast.tba') }}</p>
              <p class="featured-card__role">{{ roleOf(p) }}</p>
            </NuxtLink>
          </li>
        </ul>

        <ul class="grid">
          <li v-for="(p, i) in restCreative" :key="'c' + i" class="card">
            <NuxtLink v-if="p.slug" :to="`/cast/${p.slug}`" class="card__link">
              <div
                class="card__photo"
                :class="{ 'card__photo--photo': p.photo, 'card__photo--logo': p.slug === 'real-by-fake' }"
                aria-hidden="true"
              >
                <img
                  v-if="p.photo"
                  :src="p.photo"
                  :alt="p.name"
                  class="card__img"
                  :class="{
                    'card__img--center': p.slug === 'robert-mcqueen',
                    'card__img--logo': p.slug === 'real-by-fake',
                    'card__img--zoomout': p.slug === 'vincent-fournier',
                  }"
                />
                <span v-else class="card__mono">{{ monogram(p) }}</span>
              </div>
              <p class="card__name">{{ p.name || t('cast.tba') }}</p>
              <p class="card__role">{{ roleOf(p) }}</p>
            </NuxtLink>
            <div v-else class="card__link">
              <div class="card__photo" aria-hidden="true">
                <span class="card__mono">{{ monogram(p) }}</span>
              </div>
              <p class="card__name">{{ p.name || t('cast.tba') }}</p>
              <p class="card__role">{{ roleOf(p) }}</p>
            </div>
          </li>
        </ul>
      </section>

    </div>
    <SiteFooter />
  </main>
</template>

<style scoped>
/* Math, 2026-10-19: "on enleve le creme sur la page cast et creative, on
   remet le font noir" — reverted back to the original dark page background
   (tried cream 2026-10-16, reverted). */
.cast {
  min-height: 100dvh;
  padding-bottom: 6rem;
  background:
    radial-gradient(120% 85% at 50% 100%, rgba(243, 233, 216, 0.045), transparent 68%),
    var(--ink);
}
.container { padding-top: 3rem; }

/* Lang toggle — mirrors the landing page control */
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

/* Header */
.cast__head { max-width: 760px; margin-bottom: 3.5rem; }
.cast__title {
  font-size: clamp(2.2rem, 7vw, 3.6rem);
  color: var(--red);
  text-transform: uppercase;
  margin-bottom: 1rem;
  text-wrap: balance;
}
.cast__intro {
  color: var(--cream);
  font-size: clamp(1.05rem, 2.6vw, 1.3rem);
  margin-bottom: 1rem;
}

/* Sections */
.cast__section { margin-bottom: 3.5rem; }
.cast__heading {
  font-size: clamp(1.4rem, 4vw, 2rem);
  color: var(--cream);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 1.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(243, 233, 216, 0.12);
}
.cast__note {
  color: var(--cream-dim);
  font-size: 0.95rem;
  margin: -1.25rem 0 1.5rem;
}

/* Card grid */
/* Ella & Martin — featured row, bigger than the regular grid, side by side.
   Math, 2026-10-15: "we can make them a bit smaller, that was very big" —
   max-width 760->520, name font scaled down a notch. */
/* Math, 2026-10-20: "réduire toute la carte (photo + texte ensemble)" —
   shrinking just the photo left dead space around it that read as a
   different crop; shrinking the whole card instead keeps the photo
   full-bleed (identical framing, just smaller) and stays centered on
   the page. */
.featured-grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 0 auto 2.5rem;
  max-width: 730px;
}
@media (max-width: 720px) {
  .featured-grid { grid-template-columns: 1fr; }
}
/* Math, 2026-10-15: "there is missing the frames of their picture for ella
   and martin" — the featured cards had no border/frame at all, unlike the
   regular .card cards below them. */
.featured-card {
  background: var(--ink-panel);
  border: 1px solid rgba(243, 233, 216, 0.08);
  border-radius: 16px;
  padding: 1rem 1rem 1.25rem;
  transition: transform 0.15s ease, border-color 0.15s ease;
}
.featured-card:hover {
  transform: translateY(-3px);
  border-color: rgba(244, 14, 4, 0.4);
}
/* Math, 2026-10-18: "le background des photo devraient rester en noir et
   blanc" — back to the dark --ink-soft backdrop (cream was tried 2026-10-16,
   reverted). */
.featured-card__photo {
  position: relative;
  aspect-ratio: 3 / 4;
  border-radius: 11px;
  margin-bottom: 1.1rem;
  overflow: hidden;
  background: var(--ink-soft);
}
.featured-card__name {
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.4vw, 1.5rem);
  color: var(--cream);
  line-height: 1.1;
  margin-bottom: 0.4rem;
}
.featured-card__role {
  color: var(--red);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: pre-line;
}

.grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 1.5rem;
}
.card {
  background: var(--ink-panel);
  border: 1px solid rgba(243, 233, 216, 0.08);
  border-radius: 16px;
  padding: 1rem 1rem 1.25rem;
  transition: transform 0.15s ease, border-color 0.15s ease;
}
.card:hover {
  transform: translateY(-3px);
  border-color: rgba(244, 14, 4, 0.4);
}
.card__photo {
  position: relative;
  aspect-ratio: 3 / 4;
  border-radius: 11px;
  margin-bottom: 1rem;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: var(--ink-soft);
}
/* Subtle ladybug polka-dot texture — placeholder (no photo) only; a real
   photo's transparent background reveals the plain dark backdrop above
   instead, so every headshot sits on the exact same clean backdrop. */
.card__photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(243, 233, 216, 0.12) 2px, transparent 2.5px);
  background-size: 26px 26px;
}
.card__photo--photo::after { display: none; }
.card__mono {
  position: relative;
  z-index: 1;
  font-family: var(--font-display);
  font-size: 2.4rem;
  color: rgba(28, 15, 13, 0.45);
  letter-spacing: 0.04em;
}
.card__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  filter: grayscale(1);
}
.card__img--center {
  object-position: center center;
}
/* Vincent Fournier's headshot is a tight close-up crop vs. the others —
   Math, 2026-10-20: "diminuer la photo de vincent" — scale it down so his
   face reads at the same size as the rest of the grid instead of filling
   the whole card. */
.card__img--zoomout {
  object-position: center center;
  transform: scale(0.88);
}
/* REAL by FAKE credit: a studio wordmark, not a headshot — show the whole
   logo (contain, no crop, no grayscale) instead of the face-photo treatment. */
.card__photo--logo {
  display: grid;
  place-items: center;
  padding: 1.4rem;
}
.card__img--logo {
  position: static;
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: none;
}
.card__link {
  display: block;
  color: inherit;
  text-decoration: none;
}
.card__role {
  color: var(--red);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: pre-line;
}
.card__name {
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--cream);
  line-height: 1.1;
  margin-bottom: 0.35rem;
}
.card__bio {
  margin-top: 0.5rem;
  color: var(--cream-dim);
  font-size: 0.85rem;
  line-height: 1.5;
}

/* Footer */
.cast__footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(28, 15, 13, 0.1);
  text-align: center;
}
.cast__footer-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: rgba(28, 15, 13, 0.55);
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}
.cast__footer-links a { text-decoration: underline; }
.cast__footer-links a:hover { color: var(--red); }
.cast__footer-license {
  color: rgba(28, 15, 13, 0.4);
  font-size: 0.75rem;
}
</style>
