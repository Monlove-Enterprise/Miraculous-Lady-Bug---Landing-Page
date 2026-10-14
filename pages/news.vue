<script setup lang="ts">
import type { NewsRow } from '~/server/api/news.get'

const { t, locale } = useLocale()

useHead(() => ({
  title: `${t('news.title')} — Miraculous Live`,
  meta: [{ name: 'description', content: t('news.metaDescription') }],
}))

const { data } = await useFetch<NewsRow[]>('/api/news')
const articles = computed(() => data.value ?? [])

function dateLabel(d: string) {
  return new Date(d).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <main class="news">
    <SiteHeader />

    <div class="container">
      <NuxtLink to="/" class="back">← {{ t('cast.back') }}</NuxtLink>

      <header class="news__head">
        <h1 class="news__title">{{ t('news.title') }}</h1>
        <p class="news__intro">{{ t('news.intro') }}</p>
      </header>

      <p v-if="!articles.length" class="news__empty">{{ t('news.empty') }}</p>

      <ul v-else class="news__list">
        <li v-for="a in articles" :key="a.id" class="news__card">
          <img v-if="a.imageUrl" :src="a.imageUrl" alt="" class="news__card-img" />
          <div class="news__card-body">
            <p class="news__card-meta">{{ a.source }} · {{ dateLabel(a.publishedAt) }}</p>
            <h2 class="news__card-title">{{ a.title }}</h2>
            <p v-if="a.excerpt" class="news__card-excerpt">{{ a.excerpt }}</p>
            <a :href="a.url" target="_blank" rel="noopener noreferrer" class="news__card-link">
              {{ t('news.readMore') }} →
            </a>
          </div>
        </li>
      </ul>

    </div>
    <SiteFooter />
  </main>
</template>

<style scoped>
.news {
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

.news__head { max-width: 760px; margin-bottom: 3rem; }
.news__title {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 7vw, 3.6rem);
  color: var(--red);
  text-transform: uppercase;
  margin-bottom: 1rem;
}
.news__intro { color: var(--cream); font-size: clamp(1.05rem, 2.2vw, 1.25rem); }

.news__empty {
  color: var(--cream-dim);
  padding: 2.5rem;
  background: var(--ink-panel);
  border-radius: 16px;
  text-align: center;
  max-width: 620px;
}

.news__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.4rem;
}
.news__card {
  background: var(--ink-panel);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.news__card-img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
.news__card-body { padding: 1.4rem; }
.news__card-meta {
  color: var(--cream-dim);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}
.news__card-title {
  font-family: var(--font-display);
  color: var(--cream);
  font-size: 1.15rem;
  margin-bottom: 0.6rem;
  line-height: 1.3;
}
.news__card-excerpt { color: var(--cream-dim); font-size: 0.9rem; margin-bottom: 0.9rem; line-height: 1.5; }
.news__card-link { color: var(--red); font-weight: 700; font-size: 0.85rem; }
.news__card-link:hover { color: #ff1f4a; }

.news__footer-links { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 3rem 0 0.75rem; }
.news__footer-links a { color: var(--cream-dim); transition: color 0.15s ease; }
.news__footer-links a:hover { color: var(--red); }
.news__footer-license { font-size: 0.72rem; color: rgba(203, 192, 174, 0.4); }
</style>
