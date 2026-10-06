<script setup lang="ts">
const { t } = useLocale()

useHead(() => ({
  title: `${t('nav.sightsSounds')} — Miraculous Live`,
  meta: [{ name: 'description', content: t('sightsSounds.intro') }],
}))

// Behind-the-scenes clips from Math (2026-10-06), real YouTube titles used
// as captions rather than guessing who's on camera in each one.
const videos = [
  { id: 'tTXJ5sU0WDg', title: "MARINETTE's Passion for Fashion — BTS" },
  { id: 'DD4fon4D3II', title: 'What Drives Gabriel Agreste? — BTS' },
]
</script>

<template>
  <main class="sights">
    <SiteHeader />

    <div class="container">
      <NuxtLink to="/" class="back">← {{ t('nav.home') }}</NuxtLink>

      <header class="sights__head">
        <h1 class="sights__title">{{ t('nav.sightsSounds') }}</h1>
        <p class="sights__intro">{{ t('sightsSounds.intro') }}</p>
      </header>

      <ul class="sights__grid">
        <li v-for="v in videos" :key="v.id" class="sights__video">
          <div class="sights__embed">
            <iframe
              :src="`https://www.youtube-nocookie.com/embed/${v.id}`"
              :title="v.title"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              loading="lazy"
            />
          </div>
          <p class="sights__caption">{{ v.title }}</p>
        </li>
      </ul>
    </div>
    <SiteFooter />
  </main>
</template>

<style scoped>
.sights {
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

.sights__head { max-width: 760px; margin-bottom: 3rem; }
.sights__title {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 7vw, 3.6rem);
  color: var(--red);
  text-transform: uppercase;
  margin-bottom: 1rem;
  text-wrap: balance;
}
.sights__intro {
  color: var(--cream);
  font-size: clamp(1.05rem, 2.6vw, 1.3rem);
}

.sights__grid {
  list-style: none;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  max-width: 1000px;
}
.sights__embed {
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  background: var(--ink-panel);
}
.sights__embed iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
.sights__caption {
  margin-top: 0.9rem;
  color: var(--cream-dim);
  font-size: 0.9rem;
}

@media (min-width: 860px) {
  .sights__grid { grid-template-columns: 1fr 1fr; }
}
</style>
