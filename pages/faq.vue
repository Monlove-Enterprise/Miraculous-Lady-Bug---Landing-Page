<script setup lang="ts">
const { t } = useLocale()

useHead(() => ({ title: `${t('faq.title')} — Miraculous Live` }))

const items = computed(() =>
  t('faq.questions')
    .split('|')
    .map((q, i) => ({ q, a: t('faq.answers').split('|')[i] })),
)
</script>

<template>
  <main class="faq bg-honeycomb">
    <SiteHeader />

    <div class="container">
      <NuxtLink to="/" class="back">← {{ t('cast.back') }}</NuxtLink>

      <header class="faq__head">
        <h1 class="faq__title">{{ t('faq.title') }}</h1>
      </header>

      <div class="faq__list">
        <section v-for="item in items" :key="item.q" class="faq__item">
          <h2 class="faq__question">{{ item.q }}</h2>
          <p class="faq__answer">{{ item.a }}</p>
        </section>
      </div>
    </div>
    <SiteFooter />
  </main>
</template>

<style scoped>
.faq {
  min-height: 100dvh;
  padding-bottom: 6rem;
  background:
    radial-gradient(80% 55% at 18% 0%, rgba(255, 127, 166, 0.24), transparent 62%),
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

.faq__list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  max-width: 760px;
  background: rgba(243, 233, 216, 0.08);
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
