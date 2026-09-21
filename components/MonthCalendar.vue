<script setup lang="ts">
// Full month-grid calendar (reference: Wicked's Broadway Direct calendar).
// Generic: each entry is a day + a short label (a showtime for a single-venue
// residency, or a city name for the multi-city tour) — the caller decides
// what the label means and whether it links anywhere. Pure date arithmetic,
// no calendar library.
export interface CalendarEvent {
  id: number | string
  date: string // ISO date/datetime — only the calendar day is used for grouping
  label: string
  muted?: boolean // e.g. sold-out — shown struck-through/dim instead of accented
  to?: string // optional link (e.g. a city's page)
}

const props = defineProps<{ events: CalendarEvent[] }>()
const { t, locale } = useLocale()

const firstEvent = props.events[0]?.date
const current = ref(firstEvent ? new Date(firstEvent) : new Date())
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
  const map = new Map<string, CalendarEvent[]>()
  for (const e of props.events) {
    const d = new Date(e.date)
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(e)
  }
  for (const list of map.values()) list.sort((a, b) => a.date.localeCompare(b.date))
  return map
})

interface Cell { date: number; key: string; events: CalendarEvent[] }
const cells = computed<Cell[]>(() => {
  const year = current.value.getFullYear()
  const month = current.value.getMonth()
  const startWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const out: Cell[] = []
  for (let i = 0; i < startWeekday; i++) out.push({ date: 0, key: `blank-${i}`, events: [] })
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${month}-${d}`
    out.push({ date: d, key, events: byDay.value.get(key) ?? [] })
  }
  return out
})
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
        :class="{ 'is-blank': c.date === 0, 'has-events': c.events.length > 0 }"
      >
        <span v-if="c.date" class="monthcal__date">{{ c.date }}</span>
        <template v-for="e in c.events" :key="e.id">
          <NuxtLink v-if="e.to" :to="e.to" class="monthcal__event" :class="{ 'is-muted': e.muted }">
            {{ e.label }}
          </NuxtLink>
          <p v-else class="monthcal__event" :class="{ 'is-muted': e.muted }">{{ e.label }}</p>
        </template>
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
.monthcal__cell.has-events { background: rgba(244, 14, 4, 0.06); }
.monthcal__date { color: var(--cream-dim); font-size: 0.85rem; }
.monthcal__event {
  display: block;
  margin-top: 0.3rem;
  color: var(--red);
  font-weight: 700;
  font-size: 0.72rem;
  line-height: 1.3;
}
a.monthcal__event:hover { color: #ff1f4a; text-decoration: underline; }
.monthcal__event.is-muted { color: var(--cream-dim); text-decoration: line-through; font-weight: 500; }

@media (max-width: 620px) {
  .monthcal__cell { min-height: 60px; font-size: 0.85em; }
  .monthcal__grid--head span { font-size: 0.6rem; }
}
</style>
