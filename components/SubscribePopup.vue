<script setup lang="ts">
// Soft, dismissible nudge to subscribe — shown once per visitor, triggered by
// exit-intent (desktop) or a timed fallback (touch devices have no mouse to
// leave the window from). Math, 2026-10-21: "a soft page to encourage people
// to subscribe. Something they can exit."
import { isPresaleActive } from '~/utils/presaleWindow'

const { t } = useLocale()
const route = useRoute()

const STORAGE_KEY = 'mlb-subscribe-popup-dismissed'
const SNOOZE_DAYS = 7
const FALLBACK_DELAY_MS = 30_000

const show = ref(false)
let fallbackTimer: ReturnType<typeof setTimeout> | undefined

function alreadyHandled() {
  if (typeof localStorage === 'undefined') return true
  if (localStorage.getItem('mlb-subscribed')) return true
  const dismissedAt = Number(localStorage.getItem(STORAGE_KEY) || 0)
  if (!dismissedAt) return false
  return Date.now() - dismissedAt < SNOOZE_DAYS * 24 * 60 * 60 * 1000
}

function trigger() {
  if (show.value || alreadyHandled()) return
  show.value = true
}

function onMouseLeave(e: MouseEvent) {
  // Exit-intent: mouse leaving through the top of the viewport.
  if (e.clientY <= 0) trigger()
}

function close(snooze: boolean) {
  show.value = false
  if (snooze && typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && show.value) close(true)
}

// Never on the signup page itself, and never once general on-sale has
// started (the copy specifically promises presale access).
const eligible = computed(() => route.path !== '/signup' && isPresaleActive())

onMounted(() => {
  if (!eligible.value || alreadyHandled()) return
  document.addEventListener('mouseleave', onMouseLeave)
  document.addEventListener('keydown', onKeydown)
  fallbackTimer = setTimeout(trigger, FALLBACK_DELAY_MS)
})
onBeforeUnmount(() => {
  document.removeEventListener('mouseleave', onMouseLeave)
  document.removeEventListener('keydown', onKeydown)
  clearTimeout(fallbackTimer)
})
</script>

<template>
  <Transition name="subscribe-popup">
    <div
      v-if="show"
      class="subscribe-popup__backdrop"
      @click.self="close(true)"
    >
      <div class="subscribe-popup" role="dialog" aria-modal="true" :aria-label="t('subscribePopup.kicker')">
        <button
          type="button"
          class="subscribe-popup__close"
          :aria-label="t('subscribePopup.close')"
          @click="close(true)"
        >
          ×
        </button>
        <p class="subscribe-popup__kicker">{{ t('subscribePopup.kicker') }}</p>
        <p class="subscribe-popup__text">{{ t('subscribePopup.text') }}</p>
        <div class="subscribe-popup__actions">
          <NuxtLink to="/signup" class="subscribe-popup__cta" @click="close(false)">
            {{ t('subscribePopup.cta') }}
          </NuxtLink>
          <button type="button" class="subscribe-popup__dismiss" @click="close(true)">
            {{ t('subscribePopup.dismiss') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.subscribe-popup__backdrop {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(10, 5, 6, 0.72);
  backdrop-filter: blur(4px);
}
.subscribe-popup {
  position: relative;
  width: 100%;
  max-width: 400px;
  padding: 2rem 1.75rem 1.75rem;
  background: rgba(20, 10, 13, 0.97);
  border: 1px solid rgba(244, 14, 4, 0.4);
  border-radius: 16px;
  box-shadow: 0 32px 80px -24px rgba(0, 0, 0, 0.9);
  text-align: center;
}
.subscribe-popup__close {
  position: absolute;
  top: 0.6rem;
  right: 0.75rem;
  background: none;
  border: none;
  color: var(--cream-dim);
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.15s ease;
}
.subscribe-popup__close:hover {
  color: var(--cream);
}
.subscribe-popup__kicker {
  font-family: var(--font-display);
  color: var(--red);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.95rem;
  margin: 0 0 0.5rem;
}
.subscribe-popup__text {
  color: var(--cream);
  font-size: 1.1rem;
  line-height: 1.4;
  margin: 0 0 1.5rem;
}
.subscribe-popup__actions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.subscribe-popup__cta {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  background: var(--red);
  color: #fff;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: background 0.15s ease;
}
.subscribe-popup__cta:hover {
  background: #ff3a1f;
}
.subscribe-popup__dismiss {
  background: none;
  border: none;
  color: var(--cream-dim);
  font-family: var(--font-body);
  font-size: 0.85rem;
  text-decoration: underline;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.15s ease;
}
.subscribe-popup__dismiss:hover {
  color: var(--cream);
}

.subscribe-popup-enter-active,
.subscribe-popup-leave-active {
  transition: opacity 0.2s ease;
}
.subscribe-popup-enter-from,
.subscribe-popup-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .subscribe-popup-enter-active,
  .subscribe-popup-leave-active {
    transition: none;
  }
}
</style>
