<script setup lang="ts">
import { findPerson } from '~/utils/castData'

const route = useRoute()
const { t, locale } = useLocale()
const slug = String(route.params.slug)

const person = findPerson(slug)
if (!person) {
  throw createError({ statusCode: 404, statusMessage: 'Person not found', fatal: false })
}

useHead(() => ({ title: `${person!.name} — Miraculous Live` }))

const role = computed(() => (locale.value === 'fr' ? person!.roleFr : person!.roleEn))
const bio = computed(() => (locale.value === 'fr' ? person!.bioFr : person!.bioEn))
function monogram(): string {
  if (!person!.name) return '🐞'
  return person!.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
</script>

<template>
  <main class="person">
    <SiteHeader />

    <div class="container">
      <NuxtLink to="/cast" class="back">← {{ t('cast.backToCast') }}</NuxtLink>

      <div class="person__layout">
        <div class="person__photo">
          <img v-if="person.photo" :src="person.photo" :alt="person.name" />
          <span v-else class="person__mono">{{ monogram() }}</span>
        </div>

        <div class="person__info">
          <p class="person__role">{{ role }}</p>
          <h1 class="person__name">{{ person.name }}</h1>
          <p class="person__bio">{{ bio || t('cast.bioComingSoon') }}</p>
        </div>
      </div>
    </div>
    <SiteFooter />
  </main>
</template>

<style scoped>
.person {
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

.person__layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 900px;
}
.person__photo {
  position: relative;
  aspect-ratio: 3 / 4;
  max-width: 340px;
  border-radius: 16px;
  overflow: hidden;
  display: grid;
  place-items: center;
  background:
    radial-gradient(120% 90% at 50% 0%, rgba(244, 14, 4, 0.28), transparent 65%),
    var(--ink-soft);
}
.person__photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.person__mono {
  font-family: var(--font-display);
  font-size: 3.5rem;
  color: rgba(243, 233, 216, 0.55);
}
.person__role {
  color: var(--red);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}
.person__name {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 5vw, 2.6rem);
  color: var(--cream);
  text-transform: uppercase;
  margin-bottom: 1.2rem;
}
.person__bio {
  color: var(--cream-dim);
  font-size: 1rem;
  line-height: 1.6;
  max-width: 55ch;
}

@media (min-width: 640px) {
  .person__layout {
    grid-template-columns: 300px 1fr;
    align-items: start;
  }
  .person__photo { max-width: none; }
}
</style>
