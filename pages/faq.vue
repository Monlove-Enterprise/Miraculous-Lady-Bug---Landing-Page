<script setup lang="ts">
import { faqEn, faqFr } from '~/utils/faqData'

const { t, locale } = useLocale()

useHead(() => ({ title: `${t('faq.title')} — Miraculous Live` }))

const categories = computed(() => (locale.value === 'fr' ? faqFr : faqEn))
</script>

<template>
  <main class="faq bg-honeycomb">
    <SiteHeader />

    <div class="container">
      <NuxtLink to="/" class="back">← {{ t('cast.back') }}</NuxtLink>

      <header class="faq__head">
        <h1 class="faq__title">{{ t('faq.title') }}</h1>
      </header>

      <section v-for="cat in categories" :key="cat.heading || 'all'" class="faq__category">
        <h2 v-if="cat.heading" class="faq__category-heading">{{ cat.heading }}</h2>
        <div class="faq__list">
          <article v-for="item in cat.items" :key="item.q" class="faq__item">
            <h3 class="faq__question">{{ item.q }}</h3>
            <p class="faq__answer">{{ item.a }}</p>
          </article>
        </div>
      </section>
    </div>
    <SiteFooter />
  </main>
</template>

<style scoped>
/* Math, 2026-10-15: "i dont like the pink splash on the other pages" —
   pink corner glow removed from this page and vip/villes/cast (same
   pattern everywhere); cream wash kept for warmth. Pink itself stays on
   the homepage trailer section and the cream date-row accents. */
.faq {
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

.faq__head { max-width: 760px; margin-bottom: 3rem; }
.faq__title {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 7vw, 3.6rem);
  color: var(--red);
  text-transform: uppercase;
  text-wrap: balance;
}

/* Math, 2026-10-18: "here are the updated FAQ" — the real FAQ document
   groups questions into named sections (About the show, Tickets &
   seating, VIP experiences...); the old flat list had none. The FR page
   still has no real categories yet (no French version of the new FAQ
   exists), so .faq__category-heading only renders when a category
   actually has a heading (see faq.vue's v-if). */
.faq__category { max-width: 760px; margin-bottom: 2.5rem; }
.faq__category:last-child { margin-bottom: 0; }
.faq__category-heading {
  font-family: var(--font-display);
  font-size: clamp(1rem, 2.4vw, 1.2rem);
  color: var(--red);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 1rem;
}

/* Math, 2026-10-15: "same on the other pages, when there is content, no
   honeycomb" — opaque gap color so the page's bg-honeycomb can't bleed
   through the 1px dividers between items (same fix as villes/index.vue). */
.faq__list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--ink-panel);
  border-radius: 14px;
  overflow: hidden;
}
.faq__item {
  padding: 1.6rem 1.8rem;
  background: var(--ink-panel);
}
.faq__question {
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 2.8vw, 1.35rem);
  color: var(--cream);
  text-transform: uppercase;
  margin-bottom: 0.7rem;
}
.faq__answer {
  color: var(--cream-dim);
  line-height: 1.7;
  font-size: 0.98rem;
}
</style>
