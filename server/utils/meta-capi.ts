// Meta Conversions API (server-side). Sends a web event straight to Meta, so
// conversions survive browser blocking (Safari/iOS/adblockers). Deduplicated
// with the browser pixel via a shared event_id (same event_name). NO PII is
// sent — matching uses only the pixel cookies (_fbp/_fbc), IP and user-agent,
// so this never shares email/phone (respects the SMS no-share clause).

export interface MetaEventContext {
  eventId: string
  fbp?: string
  fbc?: string
  ip?: string
  userAgent?: string
  url?: string
}

export async function sendMetaEvent(
  eventName: string,
  ctx: MetaEventContext,
  opts: { accessToken: string; pixelId: string },
): Promise<void> {
  const userData: Record<string, unknown> = {}
  if (ctx.ip) userData.client_ip_address = ctx.ip
  if (ctx.userAgent) userData.client_user_agent = ctx.userAgent
  if (ctx.fbp) userData.fbp = ctx.fbp
  if (ctx.fbc) userData.fbc = ctx.fbc

  await $fetch(`https://graph.facebook.com/v21.0/${opts.pixelId}/events`, {
    method: 'POST',
    body: {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: ctx.eventId,
          action_source: 'website',
          ...(ctx.url ? { event_source_url: ctx.url } : {}),
          user_data: userData,
        },
      ],
      access_token: opts.accessToken,
    },
  })
}
