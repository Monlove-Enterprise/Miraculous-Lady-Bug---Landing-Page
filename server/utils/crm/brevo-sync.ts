// Focused Brevo sync with per-consent-list routing.
//
// Kept separate from the generic provider (crm/brevo.ts, which stays intact):
// this one routes each contact to the Brevo list that matches its consent
// combo, upserts it, and returns the Brevo contact id. A contact whose phone
// duplicates another subscriber's is pushed WITHOUT the SMS attribute (Brevo
// rejects duplicate SMS numbers), so the contact still lands for email.

export interface BrevoListIds {
  emailSms: number
  email: number
  sms: number
  noConsent: number
}

/** Map a consent combo to its Brevo list id. */
export function listForConsent(
  emailConsent: boolean,
  smsConsent: boolean,
  ids: BrevoListIds,
): number {
  if (emailConsent && smsConsent) return ids.emailSms
  if (emailConsent && !smsConsent) return ids.email
  if (!emailConsent && smsConsent) return ids.sms
  return ids.noConsent
}

export interface BrevoSyncInput {
  email: string
  firstName?: string | null
  city?: string | null
  country?: string | null
  countryCode?: string | null
  phone?: string | null
  emailConsent: boolean
  emailConsentAt?: string | null
  smsConsent: boolean
  smsConsentAt?: string | null
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  createdAt?: string | null
}

function buildAttributes(s: BrevoSyncInput, omitSms: boolean): Record<string, unknown> {
  const a: Record<string, unknown> = {
    OPT_IN_EMAIL: s.emailConsent,
    OPT_IN_SMS: s.smsConsent && !omitSms,
  }
  if (s.firstName) {
    a.PRENOM = s.firstName // legacy attribute (kept for existing data/segments)
    a.FIRSTNAME = s.firstName // read by the welcome template: {{ contact.FIRSTNAME }}
  }
  if (s.city) a.VILLE = s.city
  if (s.country) a.PAYS = s.country
  if (s.countryCode) a.COUNTRY_CODE = s.countryCode
  if (s.phone && !omitSms) a.SMS = s.phone
  if (s.emailConsentAt) a.OPT_IN_EMAIL_DATE = s.emailConsentAt
  if (s.smsConsentAt && !omitSms) a.OPT_IN_SMS_DATE = s.smsConsentAt
  if (s.utmSource) a.UTM_SOURCE = s.utmSource
  if (s.utmMedium) a.UTM_MEDIUM = s.utmMedium
  if (s.utmCampaign) a.UTM_CAMPAIGN = s.utmCampaign
  if (s.createdAt) a.DATE_INSCRIPTION = s.createdAt
  return a
}

/** A Brevo error caused by the phone (duplicate SMS across contacts, or invalid). */
function isPhoneError(err: any): boolean {
  const msg = String(err?.data?.message || err?.message || '').toLowerCase()
  return msg.includes('sms') || msg.includes('phone')
}

async function postContact(
  s: BrevoSyncInput,
  headers: Record<string, string>,
  listId: number,
  omitSms: boolean,
): Promise<number> {
  // POST with updateEnabled → create, or update an existing contact.
  const res: any = await $fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers,
    body: {
      email: s.email,
      attributes: buildAttributes(s, omitSms),
      listIds: [listId],
      updateEnabled: true,
    },
  })
  // Create returns { id }; update returns 204 (no body) → fetch the id.
  let id: number | undefined = res?.id
  if (!id) {
    const got: any = await $fetch(
      `https://api.brevo.com/v3/contacts/${encodeURIComponent(s.email)}`,
      { headers },
    )
    id = got?.id
  }
  if (!id) throw new Error('Brevo: aucun contact id renvoyé')
  return id
}

/**
 * Upsert the subscriber into Brevo on the given list; return the Brevo contact
 * id. Throws on API error (caller records crm_last_error). `omitSms` drops the
 * phone up front (known DB duplicate). If Brevo still rejects on the phone —
 * a formatting-level duplicate or an invalid number our check missed — retry
 * once email-only so the contact still lands.
 */
export async function syncSubscriberToBrevo(
  s: BrevoSyncInput,
  opts: { apiKey: string; listId: number; omitSms: boolean },
): Promise<number> {
  const headers = {
    'api-key': opts.apiKey,
    'content-type': 'application/json',
    accept: 'application/json',
  }
  try {
    return await postContact(s, headers, opts.listId, opts.omitSms)
  } catch (err) {
    if (!opts.omitSms && isPhoneError(err)) {
      return await postContact(s, headers, opts.listId, true)
    }
    throw err
  }
}
