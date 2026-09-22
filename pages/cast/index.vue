<script setup lang="ts">
import { creative, cast, type Person } from '~/utils/castData'

const { t, locale } = useLocale()

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
  <main class="cast">
    <SiteHeader />

    <div class="container">
      <NuxtLink to="/" class="back">← {{ t('cast.back') }}</NuxtLink>

      <header class="cast__head">
        <h1 class="cast__title">{{ t('cast.title') }}</h1>
        <p class="cast__intro">{{ t('cast.intro') }}</p>
        <p class="cast__note">{{ t('cast.note') }}</p>
      </header>

      <!-- Creative team -->
      <section class="cast__section" aria-labelledby="creative-h">
        <h2 id="creative-h" class="cast__heading">{{ t('cast.creativeHeading') }}</h2>
        <ul class="grid">
          <li v-for="(p, i) in creative" :key="'c' + i" class="card">
            <NuxtLink v-if="p.slug" :to="`/cast/${p.slug}`" class="card__link">
              <div class="card__photo" :class="{ 'card__photo--photo': p.photo }" aria-hidden="true">
                <img v-if="p.photo" :src="p.photo" :alt="p.name" class="card__img" />
                <span v-else class="card__mono">{{ monogram(p) }}</span>
              </div>
              <p class="card__role">{{ roleOf(p) }}</p>
              <p class="card__name">{{ p.name || t('cast.tba') }}</p>
            </NuxtLink>
            <div v-else class="card__link">
              <div class="card__photo" aria-hidden="true">
                <span class="card__mono">{{ monogram(p) }}</span>
              </div>
              <p class="card__role">{{ roleOf(p) }}</p>
              <p class="card__name">{{ p.name || t('cast.tba') }}</p>
            </div>
          </li>
        </ul>
      </section>

      <!-- Cast -->
      <section class="cast__section" aria-labelledby="cast-h">
        <h2 id="cast-h" class="cast__heading">{{ t('cast.castHeading') }}</h2>
        <ul class="grid">
          <li v-for="(p, i) in cast" :key="'a' + i" class="card">
            <div class="card__photo" aria-hidden="true">
              <span class="card__mono">{{ monogram(p) }}</span>
            </div>
            <p class="card__role">{{ roleOf(p) }}</p>
            <p class="card__name">{{ p.name || t('cast.tba') }}</p>
          </li>
        </ul>
      </section>

    </div>
    <SiteFooter />
  </main>
</template>

<style scoped>
.cast {
  min-height: 100dvh;
  padding-bottom: 6rem;
  background:
    radial-gradient(80% 50% at 20% 0%, rgba(244, 14, 4, 0.16), transparent 60%),
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
.cast__note {
  display: inline-block;
  color: var(--cream-dim);
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  border: 1px dashed rgba(244, 14, 4, 0.4);
  border-radius: 999px;
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

/* Card grid */
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
  background:
    radial-gradient(120% 90% at 50% 0%, rgba(244, 14, 4, 0.28), transparent 65%),
    var(--ink-soft);
}
/* Subtle ladybug polka-dot texture — placeholder (no photo) only; a real
   photo's transparent background reveals the plain gradient above instead,
   so every headshot sits on the exact same clean backdrop. */
.card__photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(243, 233, 216, 0.09) 2px, transparent 2.5px);
  background-size: 26px 26px;
}
.card__photo--photo::after { display: none; }
.card__mono {
  position: relative;
  z-index: 1;
  font-family: var(--font-display);
  font-size: 2.4rem;
  color: rgba(243, 233, 216, 0.55);
  letter-spacing: 0.04em;
}
.card__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  margin-bottom: 0.35rem;
}
.card__name {
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--cream);
  line-height: 1.1;
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
  border-top: 1px solid rgba(243, 233, 216, 0.1);
  text-align: center;
}
.cast__footer-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: var(--cream-dim);
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}
.cast__footer-links a { text-decoration: underline; }
.cast__footer-links a:hover { color: var(--red); }
.cast__footer-license {
  color: rgba(203, 192, 174, 0.5);
  font-size: 0.75rem;
}
</style>
