<script setup lang="ts">
// Cookie-consent banner. Shows once until the visitor accepts or declines.
// On accept it loads the Meta pixel (PageView); on decline nothing loads.
const { t } = useLocale()
const { consent, load, set, gpc } = useConsent()
const { enable } = useMetaPixel()

// Render only after mount so the server never emits the banner (avoids a flash
// for returning visitors whose choice is stored client-side).
const ready = ref(false)
const dismissedGpc = ref(false)
onMounted(() => {
  load()
  ready.value = true
})

// Normal accept/decline prompt when undecided and no GPC signal; a passive GPC
// notice (no re-ask) when the browser signals an opt-out.
const showPrompt = computed(() => ready.value && consent.value === 'unset' && !gpc.value)
const showGpc = computed(
  () => ready.value && consent.value === 'unset' && gpc.value && !dismissedGpc.value,
)

function accept() {
  set('accepted')
  enable()
}
function decline() {
  set('declined')
}
</script>

<template>
  <Transition name="cookie">
    <div
      v-if="showPrompt"
      class="cookie"
      role="dialog"
      aria-live="polite"
      :aria-label="t('cookie.aria')"
    >
      <p class="cookie__text">
        {{ t('cookie.text') }}
        <NuxtLink to="/confidentialite" class="cookie__link">{{ t('cookie.link') }}</NuxtLink>.
      </p>
      <div class="cookie__actions">
        <button type="button" class="cookie__btn cookie__btn--ghost" @click="decline">
          {{ t('cookie.decline') }}
        </button>
        <button type="button" class="cookie__btn cookie__btn--solid" @click="accept">
          {{ t('cookie.accept') }}
        </button>
      </div>
    </div>
    <div v-else-if="showGpc" class="cookie cookie--gpc" role="status" aria-live="polite">
      <p class="cookie__text">
        {{ t('cookie.gpcNotice') }}
        <NuxtLink to="/confidentialite" class="cookie__link">{{ t('cookie.link') }}</NuxtLink>.
      </p>
      <button
        type="button"
        class="cookie__close"
        :aria-label="t('cookie.close')"
        @click="dismissedGpc = true"
      >
        ×
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.cookie {
  position: fixed;
  z-index: 70;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  margin-inline: auto;
  max-width: 620px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem 1.25rem;
  padding: 1rem 1.15rem;
  background: rgba(20, 10, 13, 0.96);
  border: 1px solid rgba(244, 14, 4, 0.4);
  border-radius: 14px;
  box-shadow: 0 24px 60px -24px rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
}
.cookie__text {
  flex: 1 1 260px;
  color: var(--cream-dim);
  font-size: 0.85rem;
  line-height: 1.5;
}
.cookie__link {
  color: var(--cream);
  text-decoration: underline;
}
.cookie__link:hover {
  color: var(--red);
}
.cookie__actions {
  display: flex;
  gap: 0.6rem;
  margin-left: auto;
}
.cookie__btn {
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
}
.cookie__btn:active {
  transform: translateY(1px);
}
.cookie__btn--ghost {
  background: transparent;
  border: 1px solid rgba(243, 233, 216, 0.3);
  color: var(--cream-dim);
}
.cookie__btn--ghost:hover {
  border-color: var(--cream-dim);
  color: var(--cream);
}
.cookie__btn--solid {
  background: var(--red);
  border: 1px solid var(--red);
  color: #fff;
}
.cookie__btn--solid:hover {
  background: #ff3a1f;
}

/* GPC passive notice */
.cookie__close {
  flex: none;
  margin-left: auto;
  padding: 0 0.35rem;
  background: none;
  border: none;
  color: var(--cream-dim);
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  transition: color 0.15s ease;
}
.cookie__close:hover {
  color: var(--cream);
}

/* Entrance */
.cookie-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.cookie-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
@media (prefers-reduced-motion: reduce) {
  .cookie-enter-active {
    transition: none;
  }
}
</style>
