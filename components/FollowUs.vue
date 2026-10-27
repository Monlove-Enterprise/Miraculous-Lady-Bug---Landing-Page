<script setup lang="ts">
// Follow-us callout for high-intent moments (post-signup, cities page) —
// Math, 2026-10-27: the mailing list audit found /villes and the post-signup
// screen get real traffic but no prompt to follow on social, unlike the
// email templates which already have a "Follow the show" block
// (emails/partials/social.html). This mirrors that block for the site.
const { t } = useLocale()
</script>

<template>
  <div class="follow-us">
    <p class="follow-us__heading">{{ t('followUs.heading') }}</p>
    <p class="follow-us__text">{{ t('followUs.text') }}</p>
    <div class="follow-us__links">
      <a href="https://www.instagram.com/miraculousladybuglive/" target="_blank" rel="noopener noreferrer" class="follow-us__link">
        {{ t('followUs.instagram') }}
      </a>
      <a href="https://www.tiktok.com/@miraculousladybuglive_" target="_blank" rel="noopener noreferrer" class="follow-us__link">
        {{ t('followUs.tiktok') }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.follow-us {
  text-align: center;
}
.follow-us__heading {
  font-family: var(--font-display);
  color: var(--red);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.85rem;
  margin: 0 0 0.4rem;
}
.follow-us__text {
  color: var(--cream-dim);
  font-size: 0.9rem;
  margin: 0 0 0.9rem;
}
.follow-us__links {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}
.follow-us__link {
  display: inline-block;
  padding: 0.55rem 1.25rem;
  border-radius: 999px;
  border: 1px solid rgba(244, 14, 4, 0.4);
  color: var(--cream);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.follow-us__link:hover {
  background: var(--red);
  border-color: var(--red);
}
</style>
