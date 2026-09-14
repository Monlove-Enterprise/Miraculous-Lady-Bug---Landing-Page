<script setup lang="ts">
const { t } = useLocale()
useHead(() => ({ title: `${t('nav.vip')} — Miraculous Live` }))
</script>

<template>
  <ComingSoonPage :title="t('nav.vip')" />
</template>
