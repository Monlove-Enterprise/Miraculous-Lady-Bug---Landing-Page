<script setup lang="ts">
const { t } = useLocale()
useHead(() => ({ title: `${t('nav.forGood')} — Miraculous Live` }))
</script>

<template>
  <ComingSoonPage :title="t('nav.forGood')" />
</template>
