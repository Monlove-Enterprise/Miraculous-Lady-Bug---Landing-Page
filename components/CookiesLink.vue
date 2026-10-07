<script setup lang="ts">
// Footer "Cookies" link — lets a visitor reopen the consent banner and change
// their choice (GDPR: withdraw as easily as give). Clearing the stored choice
// makes CookieBanner reappear; on the next load the pixel no longer loads.
const { t } = useLocale()
const { reset } = useConsent()
</script>

<template>
  <button type="button" class="cookies-link" @click="reset">{{ t('footer.cookies') }}</button>
</template>

<style scoped>
.cookies-link {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: var(--cream-dim);
  cursor: pointer;
  transition: color 0.15s ease;
}
.cookies-link:hover {
  color: var(--red);
}
</style>
