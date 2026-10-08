// Keeps every new-site route unreachable until the automatic cutover (see
// utils/launchGate.ts). Before that instant, the deployed site behaves
// exactly like today's production landing: only "/" (rendered via
// LegacyLanding, decided in pages/index.vue) and its legal pages are public;
// everything else — /villes, /cast, /story, /news, /signup, etc. — redirects
// home instead of 404ing, since these are routes a visitor could plausibly
// guess or have bookmarked from a preview link, not routes that shouldn't
// exist at all.
import { isLaunched } from '~/utils/launchGate'

const ALWAYS_ALLOWED = new Set(['/confidentialite', '/conditions', '/mentions-legales', '/vip'])

export default defineEventHandler((event) => {
  if (isLaunched()) return

  const path = event.path.split('?')[0]

  // Nuxt/Nitro internals, static assets, and API routes (the legacy landing
  // posts to /api/subscribe) are never gated.
  if (
    path.startsWith('/_nuxt') ||
    path.startsWith('/_ipx') ||
    path.startsWith('/api/') ||
    path.startsWith('/__nuxt') ||
    /\.[a-z0-9]+$/i.test(path)
  ) {
    return
  }

  if (path === '/' || ALWAYS_ALLOWED.has(path)) return

  return sendRedirect(event, '/', 302)
})
