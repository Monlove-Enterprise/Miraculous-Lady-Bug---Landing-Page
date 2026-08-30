// Sends the transactional "welcome" email on sign-up via Brevo's SMTP API,
// using a pre-built Brevo template. Subject, sender and content all live in the
// template, so the brand can edit the copy without a deploy. English-only for
// now (single template). Callers treat this as best-effort — a failed email
// must never block a sign-up (Postgres stays the source of truth).
export async function sendBrevoWelcomeEmail(opts: {
  apiKey: string
  templateId: number
  email: string
  firstName?: string
  city?: string
}): Promise<void> {
  await $fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': opts.apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: {
      templateId: opts.templateId,
      to: [{ email: opts.email, ...(opts.firstName ? { name: opts.firstName } : {}) }],
      // Exposed to the template as {{ params.PRENOM }} / {{ params.VILLE }}.
      params: {
        PRENOM: opts.firstName || '',
        VILLE: opts.city || '',
      },
    },
  })
}
