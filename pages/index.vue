<script setup lang="ts">
const { t, locale, toggle } = useLocale()
const route = useRoute()

function scrollToSignup() {
  document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })
}

// ---- Live layout tuner (only visible with ?tune=1 in the URL) ----
// Desktop hero only: tune the Ladybug size/position and the title width live,
// then bake the chosen values into the CSS defaults below.
const tuning = computed(() => route.query.tune !== undefined)
const artW = ref(26) // Ladybug width (vw)
const artLeft = ref(1.8) // Ladybug left offset (vw)
const artBottom = ref(0) // Ladybug bottom offset (px, + = higher)
const titleW = ref(39) // Title width (vw)

const heroStyle = computed(() => ({
  '--art-w': artW.value + 'vw',
  '--art-left': artLeft.value + 'vw',
  '--art-bottom': artBottom.value + 'px',
  '--title-w': titleW.value + 'vw',
}))

const tuneSummary = computed(
  () =>
    `art-w:${artW.value}vw art-left:${artLeft.value}vw art-bottom:${artBottom.value}px title-w:${titleW.value}vw`,
)
const copied = ref(false)

// Persist tuner values in the browser (only in ?tune=1 mode) so adjustments
// survive a reload. The public site (no ?tune) always uses the baked defaults.
onMounted(() => {
  if (!tuning.value) return
  try {
    const s = JSON.parse(localStorage.getItem('heroTune') || 'null')
    if (s) {
      artW.value = s.artW ?? artW.value
      artLeft.value = s.artLeft ?? artLeft.value
      artBottom.value = s.artBottom ?? artBottom.value
      titleW.value = s.titleW ?? titleW.value
    }
  } catch {}
  watch([artW, artLeft, artBottom, titleW], () => {
    try {
      localStorage.setItem(
        'heroTune',
        JSON.stringify({
          artW: artW.value,
          artLeft: artLeft.value,
          artBottom: artBottom.value,
          titleW: titleW.value,
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

    <!-- Live layout tuner — add ?tune=1 to the URL to show it (desktop hero) -->
    <div v-if="tuning" class="tuner">
      <strong>Réglages hero (desktop)</strong>
      <label>Ladybug largeur&nbsp;: {{ artW }}vw
        <input v-model.number="artW" type="range" min="14" max="42" step="0.5" />
      </label>
      <label>Ladybug ← gauche&nbsp;: {{ artLeft }}vw
        <input v-model.number="artLeft" type="range" min="-6" max="24" step="0.5" />
      </label>
      <label>Ladybug ↑ hauteur&nbsp;: {{ artBottom }}px
        <input v-model.number="artBottom" type="range" min="-30" max="180" step="2" />
      </label>
      <label>Titre largeur&nbsp;: {{ titleW }}vw
        <input v-model.number="titleW" type="range" min="24" max="56" step="0.5" />
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
    <section class="hero" :style="tuning ? heroStyle : undefined">
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
  color: var(--scarlet);
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
  border: 1px solid rgba(244, 14, 4, 0.5);
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
  /* Exact scarlet of the delivered key-art assets (Background.png / Orange
     Background.png) — matches the Ladybug's suit so it melts into the bg.
     NOT the brand --red (#E4032E), which is a different crimson and left a
     visible seam around the character. */
  background: var(--scarlet);
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
  /* Defaults are the baked values; ?tune=1 overrides via --art-* live. */
  left: var(--art-left, 4vw);
  bottom: var(--art-bottom, 16px);
  width: var(--art-w, clamp(240px, 28vw, 520px));
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
  width: var(--title-w, clamp(280px, 32.5vw, 560px));
  height: auto;
  transform: translateY(6px); /* title + text nudged down 6px */
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
  transform: translateY(6px); /* keep in step with the title's 6px nudge */
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
  color: #fff;
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
  /* Lower the whole centred block (title + tagline + CTA + credit) on desktop */
  .hero__logo,
  .hero__lockup {
    transform: translateY(30px);
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
    /* Mobile-only fade into the dark "Help bring…" section. Solid scarlet down
       to the very bottom of the Ladybug's suit (~78%) so her whole suit blends
       into the bg; only the short bottom band (behind the CTA/credit) melts to
       dark. */
    background: linear-gradient(180deg, var(--scarlet) 0%, var(--scarlet) 78%, var(--ink-soft) 100%);
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
