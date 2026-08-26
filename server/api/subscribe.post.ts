/**
 * POST /api/subscribe
 *
 * 1. Writes the subscriber to Postgres FIRST (source of truth) — with consent
 *    flags/dates, UTM attribution, IP and timestamp as proof of consent.
 * 2. Then best-effort syncs to the CRM, routed by channel:
 *      - email  → the email platform (Brevo by default)
 *      - SMS    → the SMS platform for the contact's country (only if consented)
 *    On CRM failure the DB record stays with crm_synced = false for later
 *    resynchronisation — the request still succeeds.
 *
 * Required: valid email, city, phone, age confirmation (16+).
 */
import {
  upsertSubscriber,
  markCrmSynced,
  markCrmError,
  isPhoneDuplicate,
  type SubscriberInput,
} from '../utils/subscribers'
import { syncSubscriberToBrevo, listForConsent } from '../utils/crm/brevo-sync'
import { resolveCountryForCity } from '../utils/geocode'
import { nameToCode } from '../utils/countryCode'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Fallback for the implicit email-consent proof text, per language, used only if
// the client somehow omits it. The client normally sends the exact notice shown.
const EMAIL_CONSENT_NOTICE: Record<string, string> = {
  fr: 'En vous inscrivant, vous acceptez de recevoir par e-mail les actualités et mises à jour concernant le spectacle, ainsi que toute autre communication sélectionnée. Vous pouvez vous désinscrire à tout moment. Pour en savoir plus, consultez notre politique de confidentialité.',
  en: 'By signing up, you agree to receive news and updates about the show by email, plus any other communications you selected. You can unsubscribe at any time. To learn more, see our privacy policy.',
}

interface SubscribeBody {
  email?: string
  firstName?: string
  city?: string
  country?: string
  phone?: string
  emailConsent?: boolean
  emailConsentText?: string
  smsConsent?: boolean
  smsConsentText?: string
  ageConfirmed?: boolean
  locale?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  referrer?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SubscribeBody>(event)

  const email = (body?.email || '').trim().toLowerCase()
  if (!email || !EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Une adresse e-mail valide est requise.' })
  }

  const city = (body?.city || '').trim()
  if (!city) {
    throw createError({ statusCode: 400, statusMessage: 'La ville est requise.' })
  }

  // The form only sends a country when the visitor picked an autocomplete
  // suggestion. When they just typed the city, resolve the country server-side
  // so it's never left NULL. We also derive the ISO country_code — from the
  // country name (local map, no extra network) when we have it, else from the
  // same geocode lookup — for reliable per-country segmentation.
  let country = (body?.country || '').trim() || undefined
  let countryCode: string | undefined
  if (!country) {
    const resolved = await resolveCountryForCity(city)
    country = resolved.country
    countryCode = resolved.countryCode?.toUpperCase()
  } else {
    countryCode = nameToCode(country)
  }

  if (body?.ageConfirmed !== true) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vous devez confirmer avoir 16 ans ou plus.',
    })
  }

  // Phone is optional — required only when the visitor consented to SMS.
  const phone = normalizePhone(body.phone)
  if (Boolean(body.smsConsent) && !phone) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Un numéro de téléphone valide est requis pour recevoir les SMS.',
    })
  }

  const now = new Date().toISOString()
  // Email consent is IMPLICIT: submitting the form IS the consent, so it is
  // always recorded (true + timestamp + the exact notice shown). This is the
  // sole proof, so it must never be conditional.
  const emailConsent = true
  const emailConsentLang = (body.locale || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en'
  const emailConsentText = body.emailConsentText?.trim() || EMAIL_CONSENT_NOTICE[emailConsentLang]
  const smsConsent = Boolean(body.smsConsent)
  // SMS wording archived only when the (still optional) box was ticked.
  const smsConsentText = smsConsent ? body.smsConsentText?.trim() || undefined : undefined
  const locale = body.locale?.trim().slice(0, 5) || undefined
  const ip = getRequestIP(event, { xForwardedFor: true }) || undefined

  // Attribution: an explicit UTM always wins; otherwise derive the source from
  // the referrer so untagged social traffic (Facebook, TikTok…) is still
  // attributed in the export instead of landing as NULL.
  const referrer = body.referrer?.trim() || undefined
  const derived = deriveSource(referrer)
  const utmSource = body.utmSource?.trim() || derived?.source
  const utmMedium = body.utmMedium?.trim() || derived?.medium

  // ---- 1. Persist to Postgres (source of truth) ----
  const subscriber: SubscriberInput = {
    email,
    firstName: body.firstName?.trim() || undefined,
    city,
    country,
    countryCode,
    phone,
    emailConsent,
    emailConsentAt: emailConsent ? now : undefined,
    emailConsentText,
    smsConsent,
    smsConsentAt: smsConsent ? now : undefined,
    smsConsentText,
    ageConfirmed: true,
    locale,
    utmSource,
    utmMedium,
    utmCampaign: body.utmCampaign?.trim() || undefined,
    referrer,
    ip,
  }

  try {
    await upsertSubscriber(subscriber)
  } catch (err: any) {
    console.error('[subscribe] DB write failed:', err?.message || err)
    throw createError({
      statusCode: 500,
      statusMessage: "Impossible d'enregistrer votre inscription. Veuillez réessayer.",
    })
  }

  // ---- 2. Best-effort sync to Brevo, routed to the consent-based list ----
  const config = useRuntimeConfig()
  if (config.brevoApiKey) {
    try {
      const listId = listForConsent(emailConsent, smsConsent, {
        emailSms: Number(config.brevoListEmailSms),
        email: Number(config.brevoListEmail),
        sms: Number(config.brevoListSms),
        noConsent: Number(config.brevoListNoconsent),
      })
      // A duplicate phone would be rejected by Brevo (SMS dedupe) → push email-only.
      const omitSms = Boolean(smsConsent && phone && (await isPhoneDuplicate(phone)))
      const brevoId = await syncSubscriberToBrevo(
        {
          email,
          firstName: subscriber.firstName,
          city,
          country,
          countryCode,
          phone,
          emailConsent,
          emailConsentAt: subscriber.emailConsentAt,
          smsConsent,
          smsConsentAt: subscriber.smsConsentAt,
          utmSource: subscriber.utmSource,
          utmMedium: subscriber.utmMedium,
          utmCampaign: subscriber.utmCampaign,
          createdAt: now,
        },
        { apiKey: config.brevoApiKey, listId, omitSms },
      )
      await markCrmSynced(email, brevoId)
    } catch (err: any) {
      // Kept in Postgres with crm_synced = false → retried later. Not fatal.
      const msg = err?.data?.message || err?.message || String(err)
      console.error('[subscribe] Brevo sync failed (kept for retry):', msg)
      await markCrmError(email, msg).catch(() => {})
    }
  }

  return { ok: true }
})

/**
 * Light normalisation to E.164. The phone already carries an international
 * dialing code from the front-end; this strips formatting characters.
 */
function normalizePhone(raw?: string): string | undefined {
  if (!raw) return undefined
  const trimmed = raw.trim()
  if (!trimmed) return undefined

  let digits = trimmed.replace(/[^\d+]/g, '')
  if (digits.startsWith('00')) digits = '+' + digits.slice(2)
  // A bare dialing code with no real number is not a phone.
  if (digits.replace('+', '').length < 4) return undefined
  return digits.startsWith('+') ? digits : '+' + digits
}

/**
 * Map a referrer URL to a marketing source/medium so untagged traffic is still
 * attributed. Explicit UTM always takes precedence. Own-domain (internal
 * navigation) and unparsable referrers return undefined ("direct"); an unknown
 * external referrer keeps its bare host so nothing is lost.
 */
function deriveSource(referrer?: string): { source: string; medium: string } | undefined {
  if (!referrer) return undefined
  let host: string
  try {
    host = new URL(referrer).hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return undefined
  }
  if (host === 'miraculousladybuglive.com' || host.endsWith('.miraculousladybuglive.com')) {
    return undefined // internal navigation isn't an external source
  }

  const social = 'social'
  const map: Record<string, { source: string; medium: string }> = {
    'instagram.com': { source: 'ig', medium: social },
    'facebook.com': { source: 'fb', medium: social },
    'm.facebook.com': { source: 'fb', medium: social },
    'l.facebook.com': { source: 'fb', medium: social },
    'tiktok.com': { source: 'tt', medium: social },
    'youtube.com': { source: 'youtube', medium: social },
    'youtu.be': { source: 'youtube', medium: social },
    't.co': { source: 'twitter', medium: social },
    'twitter.com': { source: 'twitter', medium: social },
    'x.com': { source: 'twitter', medium: social },
    'google.com': { source: 'google', medium: 'organic' },
    'bing.com': { source: 'bing', medium: 'organic' },
  }
  if (map[host]) return map[host]
  for (const key of Object.keys(map)) {
    if (host.endsWith('.' + key)) return map[key]
  }
  // Unknown external referrer: keep the bare host so it's still attributable.
  return { source: host, medium: 'referral' }
}
