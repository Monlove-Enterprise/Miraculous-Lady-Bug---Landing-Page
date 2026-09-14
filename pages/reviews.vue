<script setup lang="ts">
const { t } = useLocale()
useHead(() => ({ title: `${t('nav.reviews')} — Miraculous Live` }))
</script>

<template>
  <ComingSoonPage :title="t('nav.reviews')" />
</template>
