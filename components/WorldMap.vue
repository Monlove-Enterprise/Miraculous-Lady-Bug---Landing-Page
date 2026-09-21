<script setup lang="ts">
// On-brand SVG world map — no external map service/API key. Land outline is
// a static path baked once from Natural Earth 110m data (utils/worldMapPath.ts);
// city pins are plotted at runtime from real lat/lng (the same equirectangular
// projection used to bake the outline, so they line up). Zoom/pan is done by
// mutating the SVG viewBox directly — no mapping library needed for that either.
import { WORLD_LAND_PATH, WORLD_MAP_WIDTH, WORLD_MAP_HEIGHT, projectLatLng } from '~/utils/worldMapPath'
import { COUNTRY_BORDERS_PATH, US_STATE_BORDERS_PATH } from '~/utils/worldMapBorders'
import type { CityRow } from '~/server/api/cities.get'

const props = defineProps<{ cities: CityRow[] }>()
const { t } = useLocale()

const pins = computed(() =>
  props.cities
    .filter((c) => c.lat !== null && c.lng !== null)
    .map((c) => {
      const [x, y] = projectLatLng(c.lat!, c.lng!)
      return { ...c, x, y }
    }),
)

const hovered = ref<number | null>(null)

// ---- Pan/zoom state: the SVG viewBox itself, in map-space units ----
const MIN_W = WORLD_MAP_WIDTH / 8 // max ~8x zoom
const svgRoot = ref<SVGSVGElement | null>(null)
const vb = reactive({ x: 0, y: 0, w: WORLD_MAP_WIDTH, h: WORLD_MAP_HEIGHT })
const viewBoxAttr = computed(() => `${vb.x} ${vb.y} ${vb.w} ${vb.h}`)
const zoomPct = computed(() => Math.round((WORLD_MAP_WIDTH / vb.w) * 100))

function clampView() {
  vb.w = Math.min(WORLD_MAP_WIDTH, Math.max(MIN_W, vb.w))
  vb.h = vb.w * (WORLD_MAP_HEIGHT / WORLD_MAP_WIDTH)
  vb.x = Math.min(Math.max(vb.x, 0), Math.max(0, WORLD_MAP_WIDTH - vb.w))
  vb.y = Math.min(Math.max(vb.y, 0), Math.max(0, WORLD_MAP_HEIGHT - vb.h))
}

function zoomAt(clientX: number, clientY: number, factor: number) {
  const el = svgRoot.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const fx = (clientX - rect.left) / rect.width
  const fy = (clientY - rect.top) / rect.height
  const svgX = vb.x + fx * vb.w
  const svgY = vb.y + fy * vb.h
  const newW = vb.w * factor
  vb.w = newW
  vb.h = newW * (WORLD_MAP_HEIGHT / WORLD_MAP_WIDTH)
  vb.x = svgX - fx * vb.w
  vb.y = svgY - fy * vb.h
  clampView()
}

// No wheel-to-zoom on purpose: hijacking the wheel event breaks normal page
// scroll for anyone whose cursor happens to be over the map — zoom is
// buttons + drag-to-pan only.
function zoomButton(factor: number) {
  const el = svgRoot.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor)
}
function resetView() {
  vb.x = 0
  vb.y = 0
  vb.w = WORLD_MAP_WIDTH
  vb.h = WORLD_MAP_HEIGHT
}

// Drag-to-pan (pointer events cover mouse + touch + pen in one handler).
const dragging = ref(false)
let lastX = 0
let lastY = 0
function onPointerDown(e: PointerEvent) {
  dragging.value = true
  lastX = e.clientX
  lastY = e.clientY
  ;(e.target as Element).setPointerCapture?.(e.pointerId)
}
function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  const el = svgRoot.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  vb.x -= ((e.clientX - lastX) / rect.width) * vb.w
  vb.y -= ((e.clientY - lastY) / rect.height) * vb.h
  lastX = e.clientX
  lastY = e.clientY
  clampView()
}
function onPointerUp() {
  dragging.value = false
}
</script>

<template>
  <div class="worldmap">
    <svg
      ref="svgRoot"
      class="worldmap__svg"
      :class="{ 'is-dragging': dragging }"
      :viewBox="viewBoxAttr"
      role="img"
      aria-hidden="true"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @pointerleave="onPointerUp"
    >
      <path :d="WORLD_LAND_PATH" class="worldmap__land" />
      <path :d="COUNTRY_BORDERS_PATH" class="worldmap__country-border" vector-effect="non-scaling-stroke" />
      <!-- US state lines only past ~2.5x zoom — clutter at world scale,
           useful once several nearby tour cities need telling apart. -->
      <path
        v-if="zoomPct >= 250"
        :d="US_STATE_BORDERS_PATH"
        class="worldmap__state-border"
        vector-effect="non-scaling-stroke"
      />
      <g v-for="p in pins" :key="p.id">
        <NuxtLink :to="`/villes/${p.slug}`" class="worldmap__pin-link">
          <circle
            :cx="p.x"
            :cy="p.y"
            :r="(hovered === p.id ? 6.5 : 5) * (vb.w / WORLD_MAP_WIDTH)"
            class="worldmap__pin"
            :class="`worldmap__pin--${p.format}`"
            @mouseenter="hovered = p.id"
            @mouseleave="hovered = null"
          />
        </NuxtLink>
      </g>
    </svg>

    <div
      v-for="p in pins"
      :key="'lbl-' + p.id"
      v-show="hovered === p.id"
      class="worldmap__tooltip"
      :style="{ left: ((p.x - vb.x) / vb.w) * 100 + '%', top: ((p.y - vb.y) / vb.h) * 100 + '%' }"
    >
      {{ p.city }}
    </div>

    <div class="worldmap__zoom">
      <button type="button" :aria-label="t('map.zoomIn')" @click="zoomButton(1 / 1.5)">+</button>
      <button type="button" :aria-label="t('map.zoomOut')" @click="zoomButton(1.5)">−</button>
      <button v-if="zoomPct > 100" type="button" class="worldmap__reset" :aria-label="t('map.zoomReset')" @click="resetView">
        {{ t('map.zoomReset') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.worldmap {
  position: relative;
  width: 100%;
}
.worldmap__svg {
  width: 100%;
  height: auto;
  display: block;
  cursor: grab;
  touch-action: none;
}
.worldmap__svg.is-dragging { cursor: grabbing; }
.worldmap__land {
  fill: rgba(243, 233, 216, 0.1);
  stroke: rgba(243, 233, 216, 0.16);
  stroke-width: 0.5;
}
.worldmap__country-border {
  fill: none;
  stroke: rgba(243, 233, 216, 0.22);
  stroke-width: 0.6;
}
.worldmap__state-border {
  fill: none;
  stroke: rgba(243, 233, 216, 0.15);
  stroke-width: 0.5;
  stroke-dasharray: 2 2;
}
.worldmap__pin-link { cursor: pointer; }
.worldmap__pin {
  transition: r 0.15s ease;
}
.worldmap__pin--tournee { fill: var(--red); }
.worldmap__pin--residence { fill: var(--cream); }

.worldmap__tooltip {
  position: absolute;
  transform: translate(-50%, -140%);
  padding: 0.3rem 0.6rem;
  background: var(--ink-panel);
  border: 1px solid rgba(243, 233, 216, 0.2);
  border-radius: 6px;
  color: var(--cream);
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
}

.worldmap__zoom {
  position: absolute;
  right: 0.7rem;
  bottom: 0.7rem;
  display: flex;
  gap: 0.4rem;
}
.worldmap__zoom button {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--ink-panel);
  border: 1px solid rgba(243, 233, 216, 0.18);
  color: var(--cream);
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.worldmap__zoom button:hover { background: rgba(244, 14, 4, 0.16); color: var(--red); }
.worldmap__reset {
  width: auto !important;
  padding: 0 0.7rem;
  font-size: 0.72rem !important;
  font-weight: 700;
  text-transform: uppercase;
}
</style>
