<script setup lang="ts">
// Full month-grid performance calendar (reference: Wicked's Broadway Direct
// calendar) — used on residency-format city pages (the Lido). Pure date
// arithmetic, no calendar library.
import type { PerformanceRow } from '~/server/api/cities/[slug].get'

const props = defineProps<{ performances: PerformanceRow[] }>()
const { t, locale } = useLocale()

const firstPerf = props.performances[0]?.startsAt
const current = ref(firstPerf ? new Date(firstPerf) : new Date())
current.value.setDate(1)

function prevMonth() {
  const d = new Date(current.value)
  d.setMonth(d.getMonth() - 1)
  current.value = d
}
function nextMonth() {
  const d = new Date(current.value)
  d.setMonth(d.getMonth() + 1)
  current.value = d
}

const monthLabel = computed(() =>
  current.value
    .toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' })
    .toUpperCase(),
)

const weekdayLabels = computed(() => {
  const sunday = new Date(2026, 7, 2) // a known Sunday, locale-agnostic anchor
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday)
    d.setDate(sunday.getDate() + i)
    return d.toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'short' }).toUpperCase()
  })
})

const byDay = computed(() => {
  const map = new Map<string, PerformanceRow[]>()
  for (const p of props.performances) {
    const d = new Date(p.startsAt)
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(p)
  }
  for (const list of map.values()) list.sort((a, b) => a.startsAt.localeCompare(b.startsAt))
  return map
})

interface Cell { date: number; key: string; perfs: PerformanceRow[] }
const cells = computed<Cell[]>(() => {
  const year = current.value.getFullYear()
  const month = current.value.getMonth()
  const startWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const out: Cell[] = []
  for (let i = 0; i < startWeekday; i++) out.push({ date: 0, key: `blank-${i}`, perfs: [] })
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${month}-${d}`
    out.push({ date: d, key, perfs: byDay.value.get(key) ?? [] })
  }
  return out
})

function perfTime(p: PerformanceRow) {
  return new Date(p.startsAt).toLocaleTimeString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="monthcal">
    <div class="monthcal__nav">
      <button type="button" :aria-label="t('calendar.prevMonth')" @click="prevMonth">←</button>
      <h3 class="monthcal__month">{{ monthLabel }}</h3>
      <button type="button" :aria-label="t('calendar.nextMonth')" @click="nextMonth">→</button>
    </div>

    <div class="monthcal__grid monthcal__grid--head">
      <span v-for="w in weekdayLabels" :key="w">{{ w }}</span>
    </div>
    <div class="monthcal__grid">
      <div
        v-for="c in cells"
        :key="c.key"
        class="monthcal__cell"
        :class="{ 'is-blank': c.date === 0, 'has-shows': c.perfs.length > 0 }"
      >
        <span v-if="c.date" class="monthcal__date">{{ c.date }}</span>
        <p v-for="p in c.perfs" :key="p.id" class="monthcal__time" :class="{ 'is-soldout': p.soldOut }">
          {{ p.soldOut ? t('villes.perfSoldOut') : perfTime(p) }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.monthcal__nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 1.4rem;
}
.monthcal__nav button {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid rgba(243, 233, 216, 0.25);
  color: var(--cream);
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}
.monthcal__nav button:hover { border-color: var(--red); color: var(--red); }
.monthcal__month {
  font-family: var(--font-display);
  color: var(--red);
  text-transform: uppercase;
  font-size: 1.2rem;
  letter-spacing: 0.03em;
  min-width: 14ch;
  text-align: center;
}

.monthcal__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: rgba(243, 233, 216, 0.08);
}
.monthcal__grid--head {
  background: none;
  margin-bottom: 0.4rem;
}
.monthcal__grid--head span {
  text-align: center;
  color: var(--cream-dim);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding-bottom: 0.4rem;
}
.monthcal__cell {
  min-height: 84px;
  padding: 0.5rem 0.4rem;
  background: var(--ink-panel);
}
.monthcal__cell.is-blank { background: transparent; }
.monthcal__cell.has-shows { background: rgba(244, 14, 4, 0.06); }
.monthcal__date { color: var(--cream-dim); font-size: 0.85rem; }
.monthcal__time {
  margin-top: 0.3rem;
  color: var(--red);
  font-weight: 700;
  font-size: 0.72rem;
}
.monthcal__time.is-soldout { color: var(--cream-dim); text-decoration: line-through; font-weight: 500; }

@media (max-width: 620px) {
  .monthcal__cell { min-height: 60px; font-size: 0.85em; }
  .monthcal__grid--head span { font-size: 0.6rem; }
}
</style>
