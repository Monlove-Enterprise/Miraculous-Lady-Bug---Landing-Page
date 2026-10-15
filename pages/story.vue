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
        <!-- Math: "you did not fix the story page actually just make the
             image smaller to the right of the text and leave the text on
             black" — a real positioned image now, not a CSS background
             behind the text; page background goes back to flat --ink. -->
        <img class="story__art" src="/images/story-bg.webp" alt="" aria-hidden="true" />
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
        <p class="story__cta-kicker">{{ t('story.ctaKicker') }}</p>
        <NuxtLink to="/signup" class="btn btn--buy">{{ t('form.submit') }}</NuxtLink>
      </section>

    </div>
    <SiteFooter />
  </main>
</template>

<style scoped>
.story {
  min-height: 100dvh;
  padding-bottom: 6rem;
  /* Math, 2026-10-15: after several passes trying to make the Eiffel Tower
     art work as a full background behind the text (corner-glow, recrops,
     overlay opacity...): "you did not fix the story page actually just
     make the image smaller to the right of the text and leave the text on
     black" — scrapped the background approach entirely. Flat --ink again;
     the art is now a real <img> (.story__art) positioned beside the
     header text, not behind it. */
  background: var(--ink);
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

.story__head { position: relative; max-width: 760px; margin-bottom: 3rem; }
/* Smaller, to the right of the text, on the plain --ink background —
   not a full-bleed background image behind it. */
.story__art {
  display: none;
}
@media (min-width: 1300px) {
  /* Only once the viewport is comfortably past .container's own 1200px
     max-width (so .story__head's 760px + this image + the gap between
     them can't ever exceed the available content width and overflow). */
  .story__art {
    display: block;
    position: absolute;
    top: 0;
    left: calc(100% + 2.5rem);
    width: 280px;
    height: auto;
    border-radius: 16px;
    opacity: 0.9;
  }
}
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
.story__cta-kicker {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3.2vw, 1.9rem);
  color: var(--red);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 1.1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.6rem;
  border-radius: 999px;
  font-family: var(--font-display);
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
