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
    <!-- Public site uses the fluid CSS defaults; ?tune=1 overrides them live -->
    <section class="hero" :style="tuning ? heroStyle : undefined">
      <img class="hero__bug" src="/images/ladybug-icon.png" alt="" aria-hidden="true" />
      <div class="hero__glow" aria-hidden="true"></div>

      <!-- Key art + composer credit. The credit lives INSIDE the art box and is
           positioned/sized in % + cqw of that box, so it scales with the artwork
           and stays pinned to the same spot at any viewport — one set of values
           for both desktop and mobile. -->
      <div class="hero__art">
        <img src="/images/keyart-0808-trans.png" alt="" aria-hidden="true" />
        <p class="hero__credit">
          <span class="hero__credit-label">{{ t('hero.musicalBy') }}</span>
          <span class="hero__credit-names">Ella Louise Allaire &amp;<br />Martin Lord Ferguson</span>
        </p>
      </div>

      <!-- Content (right) -->
      <div class="hero__content container">
        <img class="hero__logo" src="/images/logo.png" :alt="t('hero.logoAlt')" />
        <p class="hero__tagline">{{ t('hero.tagline') }}</p>
        <button class="cta" type="button" @click="scrollToSignup">
          {{ t('hero.cta') }}
          <span class="cta__arrow" aria-hidden="true">↓</span>
        </button>
      </div>

      <button class="scroll-hint" type="button" :aria-label="t('hero.scrollAria')" @click="scrollToSignup">
        <span></span>
      </button>
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
  /* The art is ~60vw wide and ~1.33:1, so it is ~45vw tall. If the hero is
     taller than that, the red curtain stops short of the top — which is exactly
     the jump you saw when narrowing the window (it only "came back" at the
     mobile breakpoint, where the art switches to 132%). Cap the hero at the
     art's height so the curtain always reaches the top, without oversizing the
     artwork and shoving the characters into the copy. */
  min-height: min(var(--hero-h, 72svh), 45vw);
  display: flex;
  align-items: flex-start;
  padding-top: var(--hero-pt, 7vh);
  overflow: hidden;
  background:
    radial-gradient(90% 80% at 22% 42%, rgba(168, 0, 32, 0.28), transparent 55%),
    linear-gradient(180deg, #140809 0%, var(--ink) 70%);
}

/* Miraculous ladybug emblem, top-left */
.hero__bug {
  position: absolute;
  top: 1.3rem;
  left: 1.5rem;
  width: 58px;
  height: auto;
  z-index: 6;
  /* Dark halo so the emblem stays legible even over the red key art */
  filter: drop-shadow(0 0 12px rgba(10, 5, 7, 0.95)) drop-shadow(0 3px 8px rgba(0, 0, 0, 0.55));
}

/* Red "spotlight" sun-glow behind the art, echoing the key-art sun */
.hero__glow {
  position: absolute;
  left: -12%;
  top: 46%;
  transform: translateY(-50%);
  width: 56%;
  aspect-ratio: 1;
  background: radial-gradient(circle, rgba(228, 3, 46, 0.5) 0%, rgba(228, 3, 46, 0.12) 38%, transparent 66%);
  filter: blur(10px);
  pointer-events: none;
  z-index: 0;
}

/* Key art anchored BOTTOM-LEFT, right edge feathered into the dark.
   Size/position driven by CSS vars so the ?tune=1 panel can adjust them live. */
.hero__art {
  position: absolute;
  left: 0;
  bottom: 0;
  top: auto;
  transform: translate(var(--art-x, -4%), var(--art-y, 0%));
  /* Characters read bigger and the red curtain reaches the top */
  width: var(--art-w, clamp(440px, 60vw, 1150px));
  z-index: 1;
  filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.5));
  /* Container for the credit: makes cqw = 1% of the artwork's width, so the
     credit scales with the art instead of with the viewport. */
  container-type: inline-size;
}
.hero__art img {
  width: 100%;
  height: auto;
  display: block;
  /* Feather the right edge into the dark. Masking the IMG (not the box) keeps
     the credit text — a sibling inside the box — fully opaque. */
  -webkit-mask-image: linear-gradient(90deg, #000 86%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 86%, transparent 100%);
}

/* Content centered */
.hero__content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: clamp(560px, 46vw, 900px);
  margin: 0 auto;
  text-align: center;
  transform: scale(var(--content-scale, 1));
  transform-origin: top center;
}
.hero__logo {
  width: clamp(260px, 30vw, 600px);
  margin: 0 auto 1.5rem;
  filter: drop-shadow(0 6px 24px rgba(0, 0, 0, 0.6));
}
.hero__tagline {
  font-size: clamp(1.05rem, 1.5vw, 1.7rem);
  color: var(--cream);
  max-width: 30ch;
  margin: 0 auto 2rem;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
}

/* Composer credit — pinned to the artwork at the Eiffel-tower base.
   Position is a % of the art box and type is sized in cqw (1cqw = 1% of the
   art's width), so the whole lockup scales with the art and holds its spot at
   every screen size. These same values drive desktop AND mobile. */
.hero__credit {
  position: absolute;
  left: var(--credit-x, 23%);
  top: var(--credit-y, 82%);
  z-index: 4; /* above the art image, below the emblem */
  margin: 0;
  text-align: left;
  font-family: var(--font-display);
  line-height: 1.15;
  text-shadow: 0 0.15em 0.5em rgba(0, 0, 0, 0.95);
}
.hero__credit-label {
  display: block;
  color: var(--red);
  font-size: var(--credit-label-size, 1.45cqw);
  letter-spacing: 0.06em;
  margin-bottom: 0.15em;
}
.hero__credit-names {
  display: block;
  color: var(--cream);
  font-size: var(--credit-names-size, 1.7cqw);
  letter-spacing: 0.03em;
  text-transform: uppercase;
  white-space: nowrap;
}

.cta {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 2.2rem;
  border: none;
  border-radius: 999px;
  background: var(--red);
  color: #fff;
  font-family: var(--font-display);
  font-size: 1.25rem;
  letter-spacing: 0.03em;
  cursor: pointer;
  box-shadow: 0 12px 30px -8px rgba(228, 3, 46, 0.7);
  transition: transform 0.15s ease, background 0.15s ease;
}
.cta:hover {
  background: #ff1f4a;
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
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    min-height: auto; /* fit content — no empty gap before the signup */
    padding: 0 0 2.5rem; /* no side padding so the art can bleed to the edge */
    text-align: center;
  }
  .hero__bug {
    width: 34px; /* match the visual weight of the FR/EN toggle */
    top: 1.1rem;
    left: 1.1rem;
  }
  .hero__art {
    /* relative (not static) so the credit inside still anchors to the art */
    position: relative;
    order: -1;
    width: 132%; /* full-bleed: the red curtain fills the top of the phone */
    max-width: none;
    align-self: start;
    margin-left: -18%; /* keep the red flush left, characters toward centre */
    left: auto;
    top: auto;
    bottom: auto;
    transform: none;
    opacity: 1;
    margin-top: 0; /* red curtain reaches the very top on mobile too */
    filter: drop-shadow(0 24px 44px rgba(0, 0, 0, 0.55));
  }
  /* Melt the bottom of the art into the content below (mask the img, not the
     box, so the credit stays opaque) */
  .hero__art img {
    -webkit-mask-image: linear-gradient(180deg, #000 66%, transparent 100%);
    mask-image: linear-gradient(180deg, #000 66%, transparent 100%);
  }
  .hero__glow {
    left: 50%;
    top: 34%;
    width: 110%;
    transform: translate(-50%, -50%);
    opacity: 0.75;
  }
  .hero__content {
    /* Was -4.5rem: that pulled the logo up into the credit's zone under the
       characters' feet. Keep a light overlap only. */
    margin: -1.5rem auto 0;
    text-align: center;
  }
  .hero__logo {
    width: min(80%, 340px);
    margin-inline: auto;
  }
  .hero__tagline {
    margin-inline: auto;
  }
  /* No credit overrides here: it's pinned inside the art box in % + cqw, so it
     scales and holds its spot automatically. */

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
