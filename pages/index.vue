<script setup lang="ts">
const { t, locale, toggle } = useLocale()
const route = useRoute()

function scrollToSignup() {
  document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })
}

// ---- Live layout tuner (only visible with ?tune=1 in the URL) ----
const tuning = computed(() => route.query.tune !== undefined)
const heroH = ref(72) // hero height (svh)
const topPad = ref(7) // space above the content (vh)
const artW = ref(60) // key-art width (% of viewport)
const artX = ref(-5) // key-art horizontal offset (%)
const artY = ref(0) // key-art vertical offset (%)
const textScale = ref(1) // scale of the centered logo/tagline/CTA block

const heroStyle = computed(() => ({
  '--hero-h': heroH.value + 'svh',
  '--hero-pt': topPad.value + 'vh',
  '--art-w': artW.value + '%',
  '--art-x': artX.value + '%',
  '--art-y': artY.value + '%',
  '--content-scale': String(textScale.value),
}))

const tuneSummary = computed(
  () =>
    `hero-h:${heroH.value}svh top:${topPad.value}vh art-w:${artW.value}% x:${artX.value}% y:${artY.value}% text:${textScale.value}`,
)
const copied = ref(false)

// Persist tuner values in the browser (only in ?tune=1 mode) so adjustments
// survive a reload. The public site (no ?tune) always uses the baked defaults.
onMounted(() => {
  if (!tuning.value) return
  try {
    const s = JSON.parse(localStorage.getItem('heroTune') || 'null')
    if (s) {
      heroH.value = s.heroH ?? heroH.value
      topPad.value = s.topPad ?? topPad.value
      artW.value = s.artW ?? artW.value
      artX.value = s.artX ?? artX.value
      artY.value = s.artY ?? artY.value
      textScale.value = s.textScale ?? textScale.value
    }
  } catch {}
  watch([heroH, topPad, artW, artX, artY, textScale], () => {
    try {
      localStorage.setItem(
        'heroTune',
        JSON.stringify({
          heroH: heroH.value,
          topPad: topPad.value,
          artW: artW.value,
          artX: artX.value,
          artY: artY.value,
          textScale: textScale.value,
        }),
      )
    } catch {}
  })
})

function copyTune() {
  try {
    navigator.clipboard?.writeText(tuneSummary.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {}
}
</script>

<template>
  <div class="page">
    <!-- Language toggle (French launch default; English for client review) -->
    <button class="lang" type="button" @click="toggle">
      <span :class="{ on: locale === 'fr' }">FR</span>
      <span class="sep">/</span>
      <span :class="{ on: locale === 'en' }">EN</span>
    </button>

    <!-- Live layout tuner — add ?tune=1 to the URL to show it -->
    <div v-if="tuning" class="tuner">
      <strong>Réglages hero</strong>
      <label>Hauteur&nbsp;: {{ heroH }}svh
        <input v-model.number="heroH" type="range" min="45" max="100" />
      </label>
      <label>Haut (air)&nbsp;: {{ topPad }}vh
        <input v-model.number="topPad" type="range" min="0" max="24" />
      </label>
      <label>Image&nbsp;: {{ artW }}%
        <input v-model.number="artW" type="range" min="20" max="80" />
      </label>
      <label>Image X&nbsp;: {{ artX }}%
        <input v-model.number="artX" type="range" min="-25" max="40" />
      </label>
      <label>Image Y&nbsp;: {{ artY }}%
        <input v-model.number="artY" type="range" min="-20" max="20" />
      </label>
      <label>Texte&nbsp;: {{ textScale }}×
        <input v-model.number="textScale" type="range" min="0.6" max="1.6" step="0.05" />
      </label>
      <code>{{ tuneSummary }}</code>
      <button type="button" class="tuner__copy" @click="copyTune">
        {{ copied ? 'Copié ✓' : 'Copier les valeurs' }}
      </button>
    </div>

    <!-- ===================== HERO ===================== -->
    <!-- DOM order (title, art, lockup) drives both layouts: on desktop the art
         is an absolute bottom-left overlay so title+lockup centre; on mobile the
         art returns to flow, giving title → Ladybug → tagline/CTA/credit. -->
    <section class="hero">
      <img class="hero__bug" src="/images/ladybug-icon.png" alt="" aria-hidden="true" />

      <img class="hero__logo" src="/images/title-treatment.png" :alt="t('hero.logoAlt')" />

      <div class="hero__art" aria-hidden="true">
        <img src="/images/ladybug-hero.png" alt="" />
      </div>

      <div class="hero__lockup">
        <p class="hero__tagline">{{ t('hero.tagline') }}</p>
        <button class="cta" type="button" @click="scrollToSignup">
          {{ t('hero.cta') }}
          <span class="cta__arrow" aria-hidden="true">↓</span>
        </button>
        <p class="hero__credit">
          <span class="hero__credit-label">{{ t('hero.musicalBy') }}</span>
          <span class="hero__credit-names">Ella Louise Allaire &amp; Martin Lord Ferguson</span>
        </p>
      </div>
    </section>

    <!-- ===================== SIGNUP ===================== -->
    <section id="signup" class="signup-section">
      <div class="container signup-section__inner">
        <div class="signup-section__intro">
          <h1 class="signup-section__title">
            {{ t('signup.introTitleA') }}<br />{{ t('signup.introTitleB') }}<br />{{ t('signup.introTitleC') }}
          </h1>
          <p class="signup-section__text">{{ t('signup.introText') }}</p>
          <p class="signup-section__microcopy">{{ t('signup.microcopy') }}</p>
        </div>
        <SignupForm />
      </div>
    </section>

    <footer class="footer">
      <div class="container footer__inner">
        <nav class="footer__links">
          <NuxtLink to="/mentions-legales">{{ t('footer.legal') }}</NuxtLink>
          <span aria-hidden="true">·</span>
          <NuxtLink to="/confidentialite">{{ t('footer.privacy') }}</NuxtLink>
          <span aria-hidden="true">·</span>
          <NuxtLink to="/conditions">{{ t('footer.terms') }}</NuxtLink>
        </nav>
        <p class="footer__license">{{ t('footer.copyright') }}</p>
        <p class="footer__license">{{ t('footer.trademark') }}</p>

        <div class="footer__logos">
          <img class="footer__logo footer__logo--monlove" src="/images/monlove-logo.png" alt="MONLOVE" />
          <img class="footer__logo footer__logo--corp" src="/images/miraculous-corp.png" alt="Miraculous Corp" />
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.page {
  min-height: 100dvh;
  overflow-x: clip; /* no horizontal scroll from full-bleed hero elements */
}

/* --------------------------- LANG TOGGLE --------------------------- */
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
.lang span.on {
  color: var(--red);
}
.lang .sep {
  opacity: 0.4;
}

/* --------------------------- LIVE TUNER --------------------------- */
.tuner {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 230px;
  padding: 0.9rem 1rem;
  background: rgba(10, 5, 7, 0.85);
  border: 1px solid rgba(228, 3, 46, 0.5);
  border-radius: 12px;
  color: var(--cream);
  font-size: 0.78rem;
  backdrop-filter: blur(8px);
}
.tuner strong {
  color: var(--red);
  font-size: 0.8rem;
}
.tuner label {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.tuner input[type='range'] {
  width: 100%;
  accent-color: var(--red);
}
.tuner code {
  margin-top: 0.25rem;
  font-size: 0.68rem;
  color: var(--cream-dim);
  word-break: break-all;
}
.tuner__copy {
  margin-top: 0.35rem;
  padding: 0.45rem;
  border: none;
  border-radius: 8px;
  background: var(--red);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}
.tuner__copy:hover {
  background: #ff1f4a;
}

/* ------------------------------- HERO ------------------------------- */
.hero {
  position: relative;
  min-height: 88svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
  padding: 5rem 1.5rem 3.25rem;
  overflow: hidden;
  background: var(--red);
}

/* Miraculous ladybug emblem, top-left */
.hero__bug {
  position: absolute;
  top: 1.3rem;
  left: 1.5rem;
  width: 58px;
  height: auto;
  z-index: 6;
  filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.3));
}

/* Ladybug portrait — absolute bottom-left overlay on desktop. */
.hero__art {
  position: absolute;
  left: 0;
  bottom: 0;
  width: clamp(300px, 32vw, 640px);
  z-index: 1;
  pointer-events: none;
}
.hero__art img {
  width: 100%;
  height: auto;
  display: block;
}

/* Title treatment */
.hero__logo {
  position: relative;
  z-index: 2;
  width: clamp(300px, 44vw, 700px);
  height: auto;
  filter: drop-shadow(0 8px 22px rgba(0, 0, 0, 0.22));
}

/* Tagline + CTA + credit, centred. Width-constrained so long lines (tagline,
   composer names) wrap on narrow screens instead of being clipped by the hero's
   overflow; on desktop the cap is wide enough to keep them on one line. */
.hero__lockup {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
}
.hero__tagline {
  font-size: clamp(1.05rem, 1.5vw, 1.6rem);
  color: #fff;
  width: 100%;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.22);
}

/* Composer credit — centred under the CTA (part of the lockup). */
.hero__credit {
  width: 100%;
  margin: 0.25rem 0 0;
  text-align: center;
  font-family: var(--font-display);
  line-height: 1.25;
}
.hero__credit-label {
  display: block;
  color: #300a0d;
  font-size: clamp(0.72rem, 0.9vw, 0.92rem);
  letter-spacing: 0.05em;
  margin-bottom: 0.25em;
}
.hero__credit-names {
  display: block;
  color: #fff;
  font-size: clamp(0.9rem, 1.15vw, 1.2rem);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.cta {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 2.2rem;
  border: none;
  border-radius: 999px;
  background: #150a0b;
  color: #fff;
  font-family: var(--font-display);
  font-size: 1.25rem;
  letter-spacing: 0.03em;
  cursor: pointer;
  box-shadow: 0 14px 30px -12px rgba(0, 0, 0, 0.6);
  transition: transform 0.15s ease, background 0.15s ease;
}
.cta:hover {
  background: #000;
  transform: translateY(-2px);
}
.cta__arrow {
  animation: bob 1.6s ease-in-out infinite;
}

.scroll-hint {
  display: none; /* removed: overlapped the CTA on the compact hero */
  position: absolute;
  left: 50%;
  bottom: 1.5rem;
  transform: translateX(-50%);
  width: 26px;
  height: 42px;
  border: 2px solid rgba(243, 233, 216, 0.5);
  border-radius: 20px;
  background: transparent;
  cursor: pointer;
  z-index: 3;
}
.scroll-hint span {
  position: absolute;
  left: 50%;
  top: 8px;
  width: 4px;
  height: 8px;
  margin-left: -2px;
  border-radius: 2px;
  background: var(--cream);
  animation: bob 1.6s ease-in-out infinite;
}

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

/* ------------------------------ SIGNUP ------------------------------ */
.signup-section {
  position: relative;
  padding: 5rem 0 4rem;
  background:
    radial-gradient(80% 60% at 20% 0%, rgba(168, 0, 32, 0.25), transparent 60%),
    var(--ink-soft);
  border-top: 1px solid rgba(228, 3, 46, 0.25);
}
.signup-section__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
}
.signup-section__title {
  /* Sized so the longest forced line ("MIRACULOUS LADYBUG & CAT NOIR" in FR)
     fits on one line inside the narrower 2-column desktop title column. */
  font-size: clamp(1.2rem, 1.95vw, 1.85rem);
  line-height: 1.1;
  color: var(--red);
  text-transform: uppercase;
  margin-bottom: 1rem;
}
.signup-section__text {
  color: var(--cream-dim);
  font-size: clamp(0.98rem, 1.1vw, 1.3rem);
  max-width: 46ch; /* tidy paragraph; wraps responsively */
}
/* Participation nudge, right before the form — a touch emphasised */
.signup-section__microcopy {
  margin-top: 1.1rem;
  max-width: 46ch;
  color: var(--cream);
  font-size: clamp(0.95rem, 1.05vw, 1.2rem);
  font-weight: 600;
  border-left: 3px solid var(--red);
  padding-left: 0.9rem;
}

/* ------------------------------ FOOTER ------------------------------ */
.footer {
  padding: 2rem 0;
  background: var(--ink);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.footer__inner {
  position: relative;
  text-align: center;
  color: rgba(203, 192, 174, 0.5);
  font-size: 0.85rem;
}

/* Partner logos, right-aligned and vertically centred against the credits */
.footer__logos {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 1.6rem;
}
.footer__logo {
  display: block;
  width: auto;
  opacity: 0.9;
}
.footer__logo--monlove {
  height: 22px;
}
.footer__logo--corp {
  height: 40px;
}
.footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 0.75rem;
}
.footer__links a {
  color: var(--cream-dim);
  transition: color 0.15s ease;
}
.footer__links a:hover {
  color: var(--red);
}
.footer__license {
  max-width: 60ch;
  margin: 0 auto 0.35rem;
  font-size: 0.72rem;
  line-height: 1.5;
  color: rgba(203, 192, 174, 0.4);
}
.footer__rights {
  margin-top: 0.6rem;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  color: rgba(203, 192, 174, 0.55);
}

/* ---------------------------- RESPONSIVE ---------------------------- */
@media (min-width: 860px) {
  .signup-section__inner {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: start; /* Be Miraculous sits higher, aligned to the top */
  }
  /* Tagline on a single line on desktop */
  .hero__tagline {
    max-width: none;
    white-space: nowrap;
  }
}

/* Mobile: key art sits at the TOP, full and sharp; content stacks below.
   Stays at 860px: below that the desktop overlay (centred copy on top of the
   art) collides with the characters, so the stacked layout has to take over. */
@media (max-width: 859px) {
  .hero {
    justify-content: flex-start;
    min-height: auto; /* fit content — no empty gap before the signup */
    padding: 4.5rem 1.25rem 2.5rem;
    gap: 1.25rem;
  }
  .hero__bug {
    width: 34px; /* match the visual weight of the FR/EN toggle */
    top: 1.1rem;
    left: 1.1rem;
  }
  /* Title on top, then the Ladybug returns to flow below it (DOM order) */
  .hero__logo {
    width: min(84%, 380px);
  }
  .hero__art {
    position: static;
    width: min(74%, 340px);
    align-self: center;
  }

  /* Less gap before the signup section; "Be Miraculous" sits higher */
  .signup-section {
    padding-top: 2rem;
  }
  .signup-section__inner {
    gap: 1.75rem;
  }
  /* Scale the title down on narrow phones so the long forced line
     ("Miraculous Ladybug & Cat Noir" in FR) always fits without re-wrapping.
     Capped at 1.25rem for phones ~435px and wider. */
  .signup-section__title {
    font-size: min(1.2rem, 4.1vw);
  }
  /* Footer logos drop below the credits, centred */
  .footer__logos {
    position: static;
    transform: none;
    justify-content: center;
    margin-top: 1.5rem;
  }
}
</style>
