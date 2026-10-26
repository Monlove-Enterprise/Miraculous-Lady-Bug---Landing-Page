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

// Sends the "Presale Open" template (same one used for the presale blast) to
// a brand-new subscriber, so joining after the campaign already went out
// doesn't mean missing the presale code — Math, 2026-10-21: "now when people
// are subscribing since the presale is open can we send them another email
// with the presale code". Gated server-side by isPresaleActive() so it stops
// firing on its own once general on-sale opens (utils/presaleWindow.ts).
// Best-effort, same as the welcome email — a failed send must never block
// sign-up.
export async function sendBrevoPresaleEmail(opts: {
  apiKey: string
  templateId: number
  email: string
  firstName?: string
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
    },
  })
}

// Sends the "tickets are on sale" template to a brand-new subscriber once the
// presale window has closed — picks the US/CA or rest-of-world template id
// (caller resolves which) so someone joining after the on-sale campaigns
// already went out still hears tickets are on sale. Math, 2026-10-26: "keep
// the welcome email and then send them an email saying the tickets are on
// sale" for future subscribers, now that the presale is over. Best-effort,
// same as the other transactional sends.
export async function sendBrevoOnsaleEmail(opts: {
  apiKey: string
  templateId: number
  email: string
  firstName?: string
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
    },
  })
}
