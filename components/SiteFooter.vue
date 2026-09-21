<script setup lang="ts">
// Multi-column footer (reference: Wicked's Tickets/About/Translate columns)
// — used on every page instead of each page carrying its own minimal footer.
const { t, locale, toggle } = useLocale()
</script>

<template>
  <footer class="sitefooter">
    <div class="container sitefooter__grid">
      <div class="sitefooter__brand">
        <NuxtLink to="/">
          <img src="/images/ladybug-icon.png" alt="" class="sitefooter__logo-icon" />
        </NuxtLink>
        <nav class="sitefooter__social" :aria-label="t('footer.socialAria')">
          <a href="https://www.instagram.com/miraculousladybuglive/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.66-.67 1.07-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63 19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0z" />
              <path d="M12 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
              <circle cx="18.41" cy="5.59" r="1.44" />
            </svg>
          </a>
          <a href="https://www.facebook.com/miraculousladybuglive/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
            </svg>
          </a>
          <a href="https://www.tiktok.com/@miraculousladybuglive_" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
          </a>
        </nav>
      </div>

      <div class="sitefooter__col">
        <h3>{{ t('footer.ticketsHeading') }}</h3>
        <NuxtLink to="/villes">{{ t('nav.allCities') }}</NuxtLink>
        <NuxtLink to="/vip">{{ t('nav.vip') }}</NuxtLink>
      </div>

      <div class="sitefooter__col">
        <h3>{{ t('footer.aboutHeading') }}</h3>
        <NuxtLink to="/story">{{ t('nav.story') }}</NuxtLink>
        <NuxtLink to="/cast">{{ t('nav.cast') }}</NuxtLink>
        <NuxtLink to="/sights-sounds">{{ t('nav.sightsSounds') }}</NuxtLink>
        <NuxtLink to="/for-good">{{ t('nav.forGood') }}</NuxtLink>
        <NuxtLink to="/reviews">{{ t('nav.reviews') }}</NuxtLink>
        <NuxtLink to="/news">{{ t('nav.news') }}</NuxtLink>
        <NuxtLink to="/faq">{{ t('nav.faq') }}</NuxtLink>
      </div>

      <div class="sitefooter__col">
        <h3>{{ t('footer.languageHeading') }}</h3>
        <button type="button" class="sitefooter__lang-btn" :class="{ on: locale === 'fr' }" @click="toggle">
          {{ t('footer.french') }}
        </button>
        <button type="button" class="sitefooter__lang-btn" :class="{ on: locale === 'en' }" @click="toggle">
          {{ t('footer.english') }}
        </button>
      </div>
    </div>

    <div class="container sitefooter__bottom">
      <nav class="sitefooter__legal">
        <NuxtLink to="/mentions-legales">{{ t('footer.legal') }}</NuxtLink>
        <span aria-hidden="true">·</span>
        <NuxtLink to="/confidentialite">{{ t('footer.privacy') }}</NuxtLink>
        <span aria-hidden="true">·</span>
        <NuxtLink to="/conditions">{{ t('footer.terms') }}</NuxtLink>
      </nav>
      <p class="sitefooter__license">{{ t('footer.copyright') }}</p>
      <p class="sitefooter__license">{{ t('footer.trademark') }}</p>
      <div class="sitefooter__logos">
        <img class="sitefooter__partner-logo sitefooter__partner-logo--monlove" src="/images/monlove-logo.png" alt="MONLOVE" />
        <img class="sitefooter__partner-logo sitefooter__partner-logo--corp" src="/images/miraculous-corp.png" alt="Miraculous Corp" />
      </div>
    </div>
  </footer>
</template>

<style scoped>
.sitefooter {
  padding-top: 3.5rem;
  background: var(--ink);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.sitefooter__grid {
  display: grid;
  grid-template-columns: 1.4fr repeat(3, 1fr);
  gap: 2.5rem;
  padding-bottom: 3rem;
}

.sitefooter__brand { display: flex; flex-direction: column; gap: 1.2rem; }
.sitefooter__logo-icon { width: 40px; height: auto; }
.sitefooter__social { display: flex; gap: 0.6rem; }
.sitefooter__social a {
  display: inline-flex;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--cream-dim);
  border: 1px solid rgba(243, 233, 216, 0.18);
  transition: color 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
}
.sitefooter__social a:hover { color: var(--red); border-color: var(--red); transform: translateY(-2px); }
.sitefooter__social svg { width: 17px; height: 17px; fill: currentColor; }

.sitefooter__col h3 {
  color: var(--cream-dim);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
}
.sitefooter__col { display: flex; flex-direction: column; gap: 0.65rem; }
.sitefooter__col a {
  color: var(--cream);
  font-size: 0.9rem;
  transition: color 0.15s ease;
}
.sitefooter__col a:hover { color: var(--red); }

.sitefooter__lang-btn {
  text-align: left;
  background: none;
  border: none;
  padding: 0;
  color: var(--cream);
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.15s ease;
}
.sitefooter__lang-btn:hover { color: var(--red); }
.sitefooter__lang-btn.on { color: var(--scarlet); font-weight: 700; }

.sitefooter__bottom {
  position: relative;
  padding: 1.8rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  text-align: center;
  color: rgba(203, 192, 174, 0.5);
  font-size: 0.85rem;
}
.sitefooter__legal {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 0.75rem;
}
.sitefooter__legal a { color: var(--cream-dim); transition: color 0.15s ease; }
.sitefooter__legal a:hover { color: var(--red); }
.sitefooter__license {
  max-width: 60ch;
  margin: 0 auto 0.35rem;
  font-size: 0.72rem;
  line-height: 1.5;
  color: rgba(203, 192, 174, 0.4);
}
.sitefooter__logos {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 1.6rem;
}
.sitefooter__partner-logo { display: block; width: auto; opacity: 0.9; }
.sitefooter__partner-logo--monlove { height: 22px; }
.sitefooter__partner-logo--corp { height: 40px; }

@media (max-width: 860px) {
  .sitefooter__grid { grid-template-columns: 1fr 1fr; }
  .sitefooter__logos { position: static; transform: none; justify-content: center; margin-top: 1.5rem; }
}
@media (max-width: 520px) {
  .sitefooter__grid { grid-template-columns: 1fr; }
}
</style>
