<script setup lang="ts">
const { t } = useLocale()

useHead(() => ({
  title: `${t('form.title')} — Miraculous Live`,
}))
</script>

<template>
  <main class="signup-page">
    <SiteHeader />

    <section class="signup-section">
      <div class="container signup-section__inner">
        <div class="signup-section__intro">
          <h1 class="signup-section__title">
            {{ t('signup.introTitleA') }}<br /><span class="nowrap">{{ t('signup.introTitleB') }}</span><br />{{ t('signup.introTitleC') }}
          </h1>
          <p class="signup-section__text">{{ t('signup.introText') }}</p>
          <p class="signup-section__microcopy">{{ t('signup.microcopy') }}</p>
        </div>
        <SignupForm />
      </div>
    </section>

    <SiteFooter />
  </main>
</template>

<style scoped>
.signup-page { min-height: 100dvh; }

.signup-section {
  position: relative;
  padding: 4rem 0;
  background:
    radial-gradient(80% 60% at 20% 0%, rgba(244, 14, 4, 0.22), transparent 60%),
    var(--ink-soft);
}
.signup-section__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
}
.signup-section__title {
  /* Lower floor + steeper vw scaling than the usual clamp here: "Miraculous
     Ladybug & Cat Noir" is forced onto one line (.nowrap below) and needs to
     shrink to fit narrow phones instead of overflowing the container. */
  font-size: clamp(1.15rem, 6vw, 2.2rem);
  line-height: 1.15;
  color: var(--red);
  text-transform: uppercase;
  margin-bottom: 1rem;
}
.signup-section__title .nowrap { white-space: nowrap; }
.signup-section__text {
  color: var(--cream-dim);
  font-size: clamp(0.98rem, 1.1vw, 1.3rem);
  max-width: 46ch;
}
.signup-section__microcopy {
  margin-top: 1.1rem;
  max-width: 46ch;
  color: var(--cream);
  font-size: clamp(0.95rem, 1.05vw, 1.2rem);
  font-weight: 600;
  border-left: 3px solid var(--red);
  padding-left: 0.9rem;
}

@media (min-width: 860px) {
  .signup-section__inner {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: start;
  }
}
</style>
