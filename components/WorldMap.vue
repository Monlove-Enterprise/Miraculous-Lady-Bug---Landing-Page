<script setup lang="ts">
// On-brand SVG world map — no external map service/API key. Land outline is
// a static path baked once from Natural Earth 110m data (utils/worldMapPath.ts);
// city pins are plotted at runtime from real lat/lng (the same equirectangular
// projection used to bake the outline, so they line up).
import { WORLD_LAND_PATH, WORLD_MAP_WIDTH, WORLD_MAP_HEIGHT, projectLatLng } from '~/utils/worldMapPath'
import type { CityRow } from '~/server/api/cities.get'

const props = defineProps<{ cities: CityRow[] }>()
const { locale } = useLocale()

const pins = computed(() =>
  props.cities
    .filter((c) => c.lat !== null && c.lng !== null)
    .map((c) => {
      const [x, y] = projectLatLng(c.lat!, c.lng!)
      return { ...c, x, y }
    }),
)

const hovered = ref<number | null>(null)
</script>

<template>
  <div class="worldmap">
    <svg
      class="worldmap__svg"
      :viewBox="`0 0 ${WORLD_MAP_WIDTH} ${WORLD_MAP_HEIGHT}`"
      role="img"
      aria-hidden="true"
    >
      <path :d="WORLD_LAND_PATH" class="worldmap__land" />
      <g v-for="p in pins" :key="p.id">
        <NuxtLink :to="`/villes/${p.slug}`" class="worldmap__pin-link">
          <circle
            :cx="p.x"
            :cy="p.y"
            :r="hovered === p.id ? 6.5 : 5"
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
      :style="{ left: (p.x / WORLD_MAP_WIDTH) * 100 + '%', top: (p.y / WORLD_MAP_HEIGHT) * 100 + '%' }"
    >
      {{ p.city }}
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
}
.worldmap__land {
  fill: rgba(243, 233, 216, 0.1);
  stroke: rgba(243, 233, 216, 0.16);
  stroke-width: 0.5;
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
</style>
