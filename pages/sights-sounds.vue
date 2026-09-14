<script setup lang="ts">
const { t } = useLocale()
useHead(() => ({ title: `${t('nav.sightsSounds')} — Miraculous Live` }))
</script>

<template>
  <ComingSoonPage :title="t('nav.sightsSounds')" />
</template>
