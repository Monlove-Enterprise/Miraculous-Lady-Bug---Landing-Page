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
import { getEmailProvider, getSmsProvider, type CrmContact } from '../utils/crm'
import { upsertSubscriber, markCrmSynced, type SubscriberInput } from '../utils/subscribers'
import { resolveCountryForCity } from '../utils/geocode'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
  // so it's never left NULL.
  let country = (body?.country || '').trim() || undefined
  if (!country) {
    country = (await resolveCountryForCity(city)).country
  }

  if (body?.ageConfirmed !== true) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vous devez confirmer avoir 16 ans ou plus.',
    })
  }

  const phone = normalizePhone(body.phone)
  if (!phone) {
    throw createError({ statusCode: 400, statusMessage: 'Un numéro de téléphone valide est requis.' })
  }

  const now = new Date().toISOString()
  const emailConsent = Boolean(body.emailConsent)
  const smsConsent = Boolean(body.smsConsent)
  // Archive the exact wording only when the matching box was actually ticked.
  const emailConsentText = emailConsent ? body.emailConsentText?.trim() || undefined : undefined
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

  // ---- 2. Best-effort CRM sync (channel-routed) ----
  const contact: CrmContact = {
    email,
    firstName: subscriber.firstName,
    city,
    country,
    phone,
    emailConsent,
    emailConsentDate: subscriber.emailConsentAt,
    smsConsent,
    smsConsentDate: subscriber.smsConsentAt,
    utmSource: subscriber.utmSource,
    utmMedium: subscriber.utmMedium,
    utmCampaign: subscriber.utmCampaign,
    signupDate: now,
  }

  try {
    const emailProvider = getEmailProvider()
    await emailProvider.upsertContact(contact)

    // SMS goes to its own platform only when consented; skip the second call
    // if it's the same platform as email (already covered above).
    if (smsConsent && phone) {
      const smsProvider = getSmsProvider()
      if (smsProvider.name !== emailProvider.name) {
        await smsProvider.upsertContact(contact)
      }
    }

    await markCrmSynced(email)
  } catch (err: any) {
    // Kept in Postgres with crm_synced = false → resynced later. Not fatal.
    console.error('[subscribe] CRM sync failed (kept for retry):', err?.message || err)
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
