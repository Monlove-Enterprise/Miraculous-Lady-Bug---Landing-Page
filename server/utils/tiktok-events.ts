// TikTok Events API (server-side). Sends a web event straight to TikTok, so
// conversions survive browser blocking (Safari/iOS/adblockers). Deduplicated
// with the browser pixel via a shared event_id. NO PII is sent — matching uses
// only the pixel cookie (_ttp), the click id (ttclid), IP and user-agent — so
// this never shares email/phone (respects the SMS no-share clause).

export interface TikTokEventContext {
  eventId: string
  ttp?: string
  ttclid?: string
  ip?: string
  userAgent?: string
  url?: string
}

export async function sendTikTokEvent(
  eventName: string,
  ctx: TikTokEventContext,
  opts: { accessToken: string; pixelId: string },
): Promise<void> {
  const user: Record<string, unknown> = {}
  if (ctx.ttp) user.ttp = ctx.ttp
  if (ctx.ttclid) user.ttclid = ctx.ttclid
  if (ctx.ip) user.ip = ctx.ip
  if (ctx.userAgent) user.user_agent = ctx.userAgent

  await $fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
    method: 'POST',
    headers: {
      'Access-Token': opts.accessToken,
      'Content-Type': 'application/json',
    },
    body: {
      event_source: 'web',
      event_source_id: opts.pixelId,
      data: [
        {
          event: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: ctx.eventId,
          user,
          ...(ctx.url ? { page: { url: ctx.url } } : {}),
        },
      ],
    },
  })
}
