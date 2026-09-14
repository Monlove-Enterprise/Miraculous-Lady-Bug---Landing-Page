<script setup lang="ts">
const { t } = useLocale()
useHead(() => ({ title: `${t('nav.faq')} — Miraculous Live` }))
</script>

<template>
  <ComingSoonPage :title="t('nav.faq')" />
</template>
