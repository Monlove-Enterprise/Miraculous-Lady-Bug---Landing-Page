<script setup lang="ts">
import { sortedCountries } from '~/utils/countries'

// Mirrors the shape returned by GET /api/city-search (kept local to avoid a
// client→server type import across Nuxt's split tsconfigs).
interface CitySuggestion {
  label: string
  city: string
  country?: string
  countryCode?: string
  state?: string
}

const { t, locale } = useLocale()
const route = useRoute()
// Meta pixel conversion — fires only if the visitor accepted cookies.
const { trackLead } = useMetaPixel()

// The email-consent notice is stored verbatim as the proof; for display we turn
// its trailing "privacy policy" phrase into a link without duplicating it.
const consentBefore = computed(() => {
  const full = t('form.emailConsentNotice')
  const i = full.lastIndexOf(t('form.legalLink'))
  return i >= 0 ? full.slice(0, i) : full
})
const consentAfter = computed(() => {
  const full = t('form.emailConsentNotice')
  const link = t('form.legalLink')
  const i = full.lastIndexOf(link)
  return i >= 0 ? full.slice(i + link.length) : ''
})

// SMS consent: the full carrier-required text is ONE i18n string (also what's
// stored verbatim in sms_consent_text). For display we show its first sentence
// next to the checkbox and the mandatory disclosures just below — smaller but
// still legible (screenshot serves as proof to the carrier).
const smsFirst = computed(() => {
  const full = t('form.smsConsent')
  const i = full.indexOf('. ')
  return i >= 0 ? full.slice(0, i + 1) : full
})
const smsRest = computed(() => {
  const full = t('form.smsConsent')
  const i = full.indexOf('. ')
  return i >= 0 ? full.slice(i + 2) : ''
})

const loading = ref(false)
const done = ref(false)
const errorMsg = ref('')

const firstName = ref('')
const email = ref('')
const cityQuery = ref('') // what the user typed in the city field
const city = ref('') // required — normalised city name (set on pick, or free-text fallback)
const cityCountry = ref('') // country that came with the picked city
const dialCode = ref('+33')
const phone = ref('')
const smsConsent = ref(false)
const ageConfirmed = ref(false)

const dialOptions = computed(() => sortedCountries(locale.value))
const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))
// Phone is required. The dial code lives in its own select, so this checks the
// national number only — at least 6 digits rejects obvious junk without being
// so strict it blocks valid short national formats.
const phoneValid = computed(() => phone.value.replace(/\D/g, '').length >= 6)

// ---- City autocomplete (server-proxied Places provider) ----
const suggestions = ref<CitySuggestion[]>([])
const showSuggest = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | undefined
let reqSeq = 0

function onCityInput() {
  // Any edit invalidates a previously picked city until they choose again.
  city.value = ''
  cityCountry.value = ''
  const q = cityQuery.value.trim()
  clearTimeout(debounceTimer)
  if (q.length < 2) {
    suggestions.value = []
    showSuggest.value = false
    return
  }
  debounceTimer = setTimeout(() => fetchCities(q), 220)
}

async function fetchCities(q: string) {
  const seq = ++reqSeq
  try {
    const res = await $fetch<CitySuggestion[]>('/api/city-search', {
      params: { q, lang: locale.value },
    })
    if (seq !== reqSeq) return // a newer keystroke already fired; drop stale result
    suggestions.value = res
    showSuggest.value = res.length > 0
  } catch {
    // Autocomplete is best-effort; free-text fallback still lets them submit.
  }
}

function pickCity(s: CitySuggestion) {
  city.value = s.city
  cityCountry.value = s.country || ''
  cityQuery.value = s.label
  suggestions.value = []
  showSuggest.value = false
}

function onCityBlur() {
  // Delay so a mousedown on a suggestion registers before the list hides.
  setTimeout(() => (showSuggest.value = false), 150)
}

// UTM attribution captured from the landing URL, forwarded with the contact.
const utm = {
  source: (route.query.utm_source as string) || '',
  medium: (route.query.utm_medium as string) || '',
  campaign: (route.query.utm_campaign as string) || '',
}

async function submit() {
  errorMsg.value = ''
  // Free-text fallback: if they typed a city but never picked a suggestion,
  // submit the raw text (country stays empty) rather than blocking them.
  if (!city.value && cityQuery.value.trim()) city.value = cityQuery.value.trim()
  if (!emailValid.value) return void (errorMsg.value = t('form.errEmail'))
  if (!city.value) return void (errorMsg.value = t('form.errCity'))
  if (!phoneValid.value) return void (errorMsg.value = t('form.errPhone'))
  if (!ageConfirmed.value) return void (errorMsg.value = t('form.errAge'))

  loading.value = true
  try {
    await $fetch('/api/subscribe', {
      method: 'POST',
      body: {
        firstName: firstName.value,
        email: email.value,
        city: city.value,
        country: cityCountry.value,
        phone: `${dialCode.value} ${phone.value.trim()}`,
        // Email consent is implicit on submit (no checkbox); the notice shown
        // under the button is archived verbatim as the consent proof.
        emailConsent: true,
        emailConsentText: t('form.emailConsentNotice'),
        smsConsent: smsConsent.value,
        smsConsentText: smsConsent.value ? t('form.smsConsent') : undefined,
        ageConfirmed: ageConfirmed.value,
        locale: locale.value,
        utmSource: utm.source,
        utmMedium: utm.medium,
        utmCampaign: utm.campaign,
        // Where they came from — lets the server attribute untagged traffic
        // (FB, TikTok…) by referrer when no UTM is present.
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      },
    })
    done.value = true
    // Report the sign-up to Meta (no-op unless the pixel was consented to).
    trackLead()
  } catch (err: any) {
    errorMsg.value =
      err?.data?.statusMessage || err?.statusMessage || t('form.errGeneric')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="signup">
    <!-- FORM -->
    <form v-if="!done" class="form" novalidate @submit.prevent="submit">
      <h2 class="form__title">{{ t('form.title') }}</h2>
      <p class="form__lead">{{ t('form.lead') }}</p>

      <div class="field">
        <label for="firstName">{{ t('form.firstName') }}</label>
        <input
          id="firstName"
          v-model="firstName"
          type="text"
          autocomplete="given-name"
          :placeholder="t('form.firstNamePlaceholder')"
        />
      </div>

      <div class="field">
        <label for="email">{{ t('form.email') }} <span class="req">*</span></label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          autocomplete="email"
          :placeholder="t('form.emailPlaceholder')"
        />
      </div>

      <div class="field city-field">
        <label for="city">{{ t('form.city') }} <span class="req">*</span></label>
        <input
          id="city"
          v-model="cityQuery"
          type="text"
          required
          autocomplete="off"
          role="combobox"
          aria-autocomplete="list"
          :aria-expanded="showSuggest"
          :placeholder="t('form.cityPlaceholder')"
          @input="onCityInput"
          @focus="showSuggest = suggestions.length > 0"
          @blur="onCityBlur"
        />
        <ul v-if="showSuggest" class="suggest" role="listbox">
          <li
            v-for="s in suggestions"
            :key="s.label"
            class="suggest__item"
            role="option"
            @mousedown.prevent="pickCity(s)"
          >
            {{ s.label }}
          </li>
        </ul>
      </div>

      <div class="field">
        <label for="phone">{{ t('form.phone') }} <span class="req">*</span></label>
        <div class="phone-group">
          <select v-model="dialCode" class="select dial" :aria-label="t('form.dialCode')">
            <option v-for="c in dialOptions" :key="c.code" :value="c.dial">
              {{ c[locale] }} ({{ c.dial }})
            </option>
          </select>
          <input
            id="phone"
            v-model="phone"
            type="tel"
            autocomplete="tel"
            :placeholder="t('form.phonePlaceholder')"
          />
        </div>
      </div>

      <label class="check">
        <input v-model="smsConsent" type="checkbox" />
        <span>{{ smsFirst }}</span>
      </label>
      <p class="sms-note">{{ smsRest }}</p>

      <label class="check check--required">
        <input v-model="ageConfirmed" type="checkbox" />
        <span>{{ t('form.age') }} <span class="req">*</span></span>
      </label>

      <p v-if="errorMsg" class="error" role="alert">{{ errorMsg }}</p>

      <button class="btn" type="submit" :disabled="loading">
        {{ loading ? t('form.submitting') : t('form.submit') }}
      </button>

      <p class="consent-note">{{ consentBefore }}<NuxtLink to="/confidentialite">{{ t('form.legalLink') }}</NuxtLink>{{ consentAfter }}</p>
    </form>

    <!-- DONE -->
    <div v-else class="form done">
      <h2 class="form__title">{{ t('form.doneTitle') }}</h2>
      <p class="form__lead">{{ t('form.doneText') }}</p>
      <div class="done__mark" aria-hidden="true">🐞</div>
    </div>
  </div>
</template>

<style scoped>
.signup {
  width: 100%;
  max-width: 460px;
  margin-inline: auto;
  background: var(--ink-panel);
  border: 1px solid rgba(244, 14, 4, 0.35);
  border-radius: 18px;
  padding: 2rem 1.75rem 2.25rem;
  box-shadow: 0 30px 80px -30px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.02) inset;
}

.form__title {
  font-size: clamp(1.6rem, 5vw, 2.1rem);
  color: var(--cream);
  margin-bottom: 0.4rem;
}
.form__lead {
  color: var(--cream-dim);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.field {
  margin-bottom: 1rem;
}
.field label {
  display: block;
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--cream-dim);
  margin-bottom: 0.4rem;
}
.req {
  color: var(--red);
}
.opt {
  text-transform: none;
  letter-spacing: 0;
  opacity: 0.65;
}

.field input,
.select {
  width: 100%;
  padding: 0.85rem 1rem;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  color: var(--cream);
  font-size: 1rem;
  font-family: var(--font-body);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.field input::placeholder {
  color: rgba(203, 192, 174, 0.4);
}
.field input:focus,
.select:focus {
  outline: none;
  border-color: var(--red);
  box-shadow: 0 0 0 3px rgba(244, 14, 4, 0.25);
}

/* Native select styling */
.select {
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23cbc0ae' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.4rem;
}
.select.empty {
  color: rgba(203, 192, 174, 0.4);
}
.select option {
  color: #111;
}

/* City autocomplete */
.city-field {
  position: relative;
}
.suggest {
  position: absolute;
  z-index: 20;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  margin: 0;
  padding: 0.25rem;
  list-style: none;
  background: var(--ink-panel);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 10px;
  box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.9);
  max-height: 240px;
  overflow-y: auto;
}
.suggest__item {
  padding: 0.6rem 0.75rem;
  border-radius: 7px;
  color: var(--cream);
  font-size: 0.95rem;
  cursor: pointer;
}
.suggest__item:hover {
  background: rgba(244, 14, 4, 0.18);
}

.phone-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.phone-group .dial {
  width: 100%;
}
.phone-group input {
  width: 100%;
}

.check {
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
  font-size: 0.9rem;
  color: var(--cream-dim);
  margin: 0.5rem 0 0.75rem;
  cursor: pointer;
}
.check input {
  margin-top: 0.2rem;
  width: 18px;
  height: 18px;
  accent-color: var(--red);
  flex: none;
}
.check--required {
  margin-bottom: 1.25rem;
}

.sms-note {
  margin: -0.35rem 0 0.9rem;
  padding-left: 1.85rem; /* align under the checkbox label text */
  font-size: 0.82rem; /* ~13px — legible for the carrier screenshot */
  line-height: 1.5;
  color: var(--cream-dim);
}

.btn {
  width: 100%;
  padding: 0.95rem 1rem;
  border: none;
  border-radius: 999px;
  background: var(--red);
  color: #fff;
  font-family: var(--font-display);
  font-size: 1.15rem;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: transform 0.12s ease, background 0.15s ease;
}
.btn:hover:not(:disabled) {
  background: #ff3a1f;
  transform: translateY(-1px);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #ff6b81;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.consent-note {
  margin-top: 1rem;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--cream-dim);
}
.consent-note a {
  color: var(--cream);
  text-decoration: underline;
}
.consent-note a:hover {
  color: var(--red);
}

.done {
  text-align: center;
}
.done__mark {
  font-size: 3rem;
  margin-top: 1rem;
}
</style>
