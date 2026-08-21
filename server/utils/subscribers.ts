import { getSql, ensureSchema } from './db'

// Postgres is the source of truth. The API writes here first, then best-effort
// syncs to the CRM and flips crm_synced. Failed CRM syncs stay recoverable.
export interface SubscriberInput {
  email: string
  firstName?: string
  city: string
  country?: string
  /** ISO 3166-1 alpha-2, derived from the country name (see countryCode.ts). */
  countryCode?: string
  postalCode?: string
  phone?: string
  emailConsent: boolean
  emailConsentAt?: string
  /** Exact consent wording the user accepted — legal proof, archived verbatim. */
  emailConsentText?: string
  smsConsent: boolean
  smsConsentAt?: string
  smsConsentText?: string
  ageConfirmed: boolean
  /** UI locale the form was submitted in (which consent text they saw). */
  locale?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  /** Raw document.referrer — used to attribute the source when no UTM is present. */
  referrer?: string
  ip?: string
}

/** Insert the subscriber, or update it on email conflict. Returns the row id. */
export async function upsertSubscriber(input: SubscriberInput): Promise<number> {
  await ensureSchema()
  const db = getSql()
  const rows = await db<{ id: number }[]>`
    INSERT INTO subscribers (
      email, first_name, city, country, country_code, postal_code, phone,
      email_consent, email_consent_at, email_consent_text,
      sms_consent, sms_consent_at, sms_consent_text,
      age_confirmed, locale, utm_source, utm_medium, utm_campaign, referrer, ip, crm_synced
    ) VALUES (
      ${input.email}, ${input.firstName ?? null}, ${input.city}, ${input.country ?? null}, ${input.countryCode ?? null}, ${input.postalCode ?? null}, ${input.phone ?? null},
      ${input.emailConsent}, ${input.emailConsentAt ?? null}, ${input.emailConsentText ?? null},
      ${input.smsConsent}, ${input.smsConsentAt ?? null}, ${input.smsConsentText ?? null},
      ${input.ageConfirmed}, ${input.locale ?? null}, ${input.utmSource ?? null}, ${input.utmMedium ?? null}, ${input.utmCampaign ?? null}, ${input.referrer ?? null},
      ${input.ip ?? null}, false
    )
    ON CONFLICT (email) DO UPDATE SET
      first_name         = COALESCE(EXCLUDED.first_name, subscribers.first_name),
      city               = EXCLUDED.city,
      country            = COALESCE(EXCLUDED.country, subscribers.country),
      country_code       = COALESCE(EXCLUDED.country_code, subscribers.country_code),
      postal_code        = COALESCE(EXCLUDED.postal_code, subscribers.postal_code),
      phone              = COALESCE(EXCLUDED.phone, subscribers.phone),
      email_consent      = EXCLUDED.email_consent,
      email_consent_at   = COALESCE(EXCLUDED.email_consent_at, subscribers.email_consent_at),
      email_consent_text = COALESCE(EXCLUDED.email_consent_text, subscribers.email_consent_text),
      sms_consent        = EXCLUDED.sms_consent,
      sms_consent_at     = COALESCE(EXCLUDED.sms_consent_at, subscribers.sms_consent_at),
      sms_consent_text   = COALESCE(EXCLUDED.sms_consent_text, subscribers.sms_consent_text),
      age_confirmed      = EXCLUDED.age_confirmed,
      locale             = COALESCE(EXCLUDED.locale, subscribers.locale),
      utm_source         = COALESCE(EXCLUDED.utm_source, subscribers.utm_source),
      utm_medium         = COALESCE(EXCLUDED.utm_medium, subscribers.utm_medium),
      utm_campaign       = COALESCE(EXCLUDED.utm_campaign, subscribers.utm_campaign),
      referrer           = COALESCE(EXCLUDED.referrer, subscribers.referrer),
      ip                 = EXCLUDED.ip,
      crm_synced         = false,
      updated_at         = now()
    RETURNING id
  `
  return rows[0]!.id
}

/** Mark a subscriber as successfully pushed to the CRM. */
export async function markCrmSynced(email: string): Promise<void> {
  const db = getSql()
  await db`UPDATE subscribers SET crm_synced = true, updated_at = now() WHERE email = ${email}`
}
