<script setup lang="ts">
// Countdown to a city's ticket-sale opening (CLAUDE.md chantier 3: "composant
// countdown paramétré par la date, bascule auto à zéro vers en_vente"). Purely
// date-driven — never the visitor's IP/timezone — so it agrees for everyone.
// Emits `reached-zero` once so the parent can flip its displayed status.
const props = defineProps<{ target: string }>()
const emit = defineEmits<{ 'reached-zero': [] }>()

const { t } = useLocale()

const remainingMs = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

function tick() {
  const diff = new Date(props.target).getTime() - Date.now()
  remainingMs.value = Math.max(0, diff)
  if (diff <= 0) {
    emit('reached-zero')
    if (timer) clearInterval(timer)
  }
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const days = computed(() => Math.floor(remainingMs.value / 86_400_000))
const hours = computed(() => Math.floor((remainingMs.value % 86_400_000) / 3_600_000))
const minutes = computed(() => Math.floor((remainingMs.value % 3_600_000) / 60_000))
const seconds = computed(() => Math.floor((remainingMs.value % 60_000) / 1000))
const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <div class="countdown" role="timer" :aria-label="t('villes.countdownAria')">
    <div class="countdown__unit">
      <span class="countdown__num">{{ days }}</span>
      <span class="countdown__label">{{ t('villes.countdown.days') }}</span>
    </div>
    <div class="countdown__unit">
      <span class="countdown__num">{{ pad(hours) }}</span>
      <span class="countdown__label">{{ t('villes.countdown.hours') }}</span>
    </div>
    <div class="countdown__unit">
      <span class="countdown__num">{{ pad(minutes) }}</span>
      <span class="countdown__label">{{ t('villes.countdown.minutes') }}</span>
    </div>
    <div class="countdown__unit">
      <span class="countdown__num">{{ pad(seconds) }}</span>
      <span class="countdown__label">{{ t('villes.countdown.seconds') }}</span>
    </div>
  </div>
</template>

<style scoped>
.countdown {
  display: flex;
  gap: 1.4rem;
}
.countdown__unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 3.2rem;
}
.countdown__num {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 5vw, 2.6rem);
  color: var(--red);
  line-height: 1;
}
.countdown__label {
  margin-top: 0.3rem;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--cream-dim);
}
</style>
