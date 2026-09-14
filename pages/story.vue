<script setup lang="ts">
const { t } = useLocale()
useHead(() => ({ title: `${t('nav.story')} — Miraculous Live` }))
</script>

<template>
  <ComingSoonPage :title="t('nav.story')" />
</template>
