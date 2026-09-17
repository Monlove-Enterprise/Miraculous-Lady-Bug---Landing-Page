<script setup lang="ts">
const { t } = useLocale()

useHead(() => ({
  title: `${t('nav.story')} — Miraculous Live`,
  meta: [{ name: 'description', content: t('story.intro').slice(0, 160) }],
}))
</script>

<template>
  <main class="story">
    <SiteHeader />

    <div class="container">
      <NuxtLink to="/" class="back">← {{ t('cast.back') }}</NuxtLink>

      <header class="story__head">
        <h1 class="story__title">{{ t('nav.story') }}</h1>
        <p class="story__intro">{{ t('story.intro') }}</p>
      </header>

      <section class="story__section">
        <h2 class="story__heading">{{ t('story.mastermindsHeading') }}</h2>
        <p class="story__text">{{ t('story.mastermindsText') }}</p>
      </section>

      <section class="story__section">
        <h2 class="story__heading">{{ t('story.spectacleHeading') }}</h2>
        <p class="story__text">{{ t('story.spectacleText') }}</p>
      </section>

      <section class="story__section">
        <h2 class="story__heading">{{ t('story.nextHeading') }}</h2>
        <p class="story__text">{{ t('story.nextText') }}</p>
      </section>

      <section class="story__cta">
        <p class="story__closing">{{ t('story.closing') }}</p>
        <NuxtLink to="/#signup" class="btn btn--buy">{{ t('form.submit') }}</NuxtLink>
      </section>

      <footer class="story__footer">
        <nav class="story__footer-links">
          <NuxtLink to="/mentions-legales">{{ t('footer.legal') }}</NuxtLink>
          <span aria-hidden="true">·</span>
          <NuxtLink to="/confidentialite">{{ t('footer.privacy') }}</NuxtLink>
          <span aria-hidden="true">·</span>
          <NuxtLink to="/conditions">{{ t('footer.terms') }}</NuxtLink>
        </nav>
        <p class="story__footer-license">{{ t('footer.copyright') }}</p>
      </footer>
    </div>
  </main>
</template>

<style scoped>
.story {
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

.story__head { max-width: 760px; margin-bottom: 3rem; }
.story__title {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 7vw, 3.6rem);
  color: var(--red);
  text-transform: uppercase;
  margin-bottom: 1.2rem;
  text-wrap: balance;
}
.story__intro {
  color: var(--cream);
  font-size: clamp(1.05rem, 2.2vw, 1.25rem);
  line-height: 1.6;
}

.story__section { max-width: 720px; margin-bottom: 2.6rem; }
.story__heading {
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 3.5vw, 1.8rem);
  color: var(--cream);
  text-transform: uppercase;
  margin-bottom: 0.8rem;
}
.story__text {
  color: var(--cream-dim);
  line-height: 1.7;
  font-size: 1rem;
}

.story__cta {
  max-width: 720px;
  padding: 2rem;
  margin: 3rem 0 4rem;
  border-radius: 16px;
  background: var(--ink-panel);
}
.story__closing { color: var(--cream); margin-bottom: 1.4rem; line-height: 1.6; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.6rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.15s ease, background 0.15s ease;
}
.btn--buy { background: var(--red); color: #fff; }
.btn--buy:hover { background: #ff1f4a; transform: translateY(-1px); }

.story__footer-links { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem; }
.story__footer-links a { color: var(--cream-dim); transition: color 0.15s ease; }
.story__footer-links a:hover { color: var(--red); }
.story__footer-license { font-size: 0.72rem; color: rgba(203, 192, 174, 0.4); }
</style>
