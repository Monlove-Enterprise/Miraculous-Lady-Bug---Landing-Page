<script setup lang="ts">
// Automatic launch switch-over — see utils/launchGate.ts for the why/when.
// Evaluated fresh on every SSR request (and matched by server/middleware/
// launch-gate.ts, which blocks every other new-site route the same way), so
// the flip needs no deploy or manual step on the day itself.
import { isLaunched } from '~/utils/launchGate'

const launched = isLaunched()
</script>

<template>
  <LegacyLanding v-if="!launched" />
  <NewHomepage v-else />
</template>
