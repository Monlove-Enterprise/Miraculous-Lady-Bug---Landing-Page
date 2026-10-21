#!/usr/bin/env node
/**
 * Regenerates public/sitemap.xml — Math, 2026-10-21: the SEO audit found the
 * sitemap still had only the 4 URLs from the old legacy-landing-only site
 * (dated 2026-08-04), missing the entire new site (villes/cities, cast,
 * vip, story, faq, news, signup, sights-sounds, and every city/cast-member
 * detail page).
 *
 * /villes and /cities (and their :slug pairs) serve identical content at
 * two different URLs (English visitors get /cities, French get /villes —
 * see composables/useLocale.ts citiesPath()/cityPath()), which looks like
 * duplicate content to a crawler unless marked as intentional language
 * alternates. Each pair gets reciprocal hreflang annotations here (the
 * xhtml:link method, Google's documented sitemap-level alternative to
 * per-page <link rel="alternate"> tags).
 *
 * Hidden cities (utils/hiddenCities.ts — Paris residency, Qatar, Lansing:
 * none ready to announce publicly yet) are excluded, matching their
 * exclusion from every on-site tour listing.
 *
 * Cast/creative slugs are hardcoded here (mirroring utils/castData.ts) —
 * cheap to keep in sync since the creative team list changes rarely; the
 * `cast` performers array has no real slugs yet (roles not cast).
 *
 *   node scripts/generate-sitemap.mjs            # DRY-RUN (prints only)
 *   node scripts/generate-sitemap.mjs --commit    # writes public/sitemap.xml
 *
 * Reads DATABASE_URL from env.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const COMMIT = process.argv.includes('--commit')
const DB_URL = process.env.DATABASE_URL
if (!DB_URL) {
  console.error('DATABASE_URL manquante')
  process.exit(1)
}

const BASE = 'https://miraculousladybuglive.com'
const TODAY = new Date().toISOString().slice(0, 10)
const HIDDEN_CITY_SLUGS = new Set(['paris', 'qatar-2027', 'lansing-mi'])

// Mirrors utils/castData.ts `creative` — update both if the team changes.
const CREATIVE_SLUGS = [
  'ella-louise-allaire',
  'martin-lord-ferguson',
  'robert-mcqueen',
  'debra-brown',
  'kassandra-boivin-cenelia',
  'nicolas-vaudelet',
  'william-todd-jones',
  'sarah-tremblay',
  'serge-poupart',
  'vincent-fournier',
  'mathieu-bourassa',
  'real-by-fake',
]

const sql = postgres(DB_URL, { prepare: false, max: 1 })
const cityRows = await sql`
  SELECT slug, updated_at FROM cities
  WHERE slug != ALL(${[...HIDDEN_CITY_SLUGS]})
  ORDER BY start_date NULLS LAST
`
await sql.end()

/** @type {{loc: string, lastmod?: string, changefreq?: string, priority: string, alternates?: {hreflang: string, href: string}[]}[]} */
const urls = []

function langPair(frPath, enPath, { changefreq = 'weekly', priority = '0.8', lastmod = TODAY } = {}) {
  const frHref = `${BASE}${frPath}`
  const enHref = `${BASE}${enPath}`
  const alternates = [
    { hreflang: 'fr', href: frHref },
    { hreflang: 'en', href: enHref },
    { hreflang: 'x-default', href: frHref },
  ]
  urls.push({ loc: frHref, lastmod, changefreq, priority, alternates })
  urls.push({ loc: enHref, lastmod, changefreq, priority, alternates })
}

function single(urlPath, { changefreq = 'monthly', priority = '0.5', lastmod = TODAY } = {}) {
  urls.push({ loc: `${BASE}${urlPath}`, lastmod, changefreq, priority })
}

// Home + legal (unchanged from the previous sitemap).
single('/', { changefreq: 'weekly', priority: '1.0' })
single('/mentions-legales', { priority: '0.3' })
single('/confidentialite', { priority: '0.3' })
single('/conditions', { priority: '0.3' })

// Content pages — one URL serves both languages (client-side toggle), no
// hreflang pair needed.
single('/vip', { priority: '0.7' })
single('/story', { priority: '0.7' })
single('/cast', { priority: '0.7' })
single('/sights-sounds', { priority: '0.5' })
single('/news', { changefreq: 'weekly', priority: '0.5' })
single('/faq', { priority: '0.5' })
single('/signup', { changefreq: 'weekly', priority: '0.6' })

for (const slug of CREATIVE_SLUGS) {
  single(`/cast/${slug}`, { priority: '0.4' })
}

// The genuine duplicate-content pair: /villes (FR) <-> /cities (EN).
langPair('/villes', '/cities', { changefreq: 'daily', priority: '0.9' })
for (const row of cityRows) {
  const lastmod = row.updated_at ? new Date(row.updated_at).toISOString().slice(0, 10) : TODAY
  langPair(`/villes/${row.slug}`, `/cities/${row.slug}`, { changefreq: 'daily', priority: '0.7', lastmod })
}

console.log(`\n=== GENERATE SITEMAP — ${COMMIT ? 'COMMIT' : 'DRY-RUN'} ===`)
console.log(`URLs: ${urls.length} (${cityRows.length} cities x2 for the villes/cities pair, ${CREATIVE_SLUGS.length} cast pages, ${urls.length - cityRows.length * 2 - CREATIVE_SLUGS.length - 1} other pages)`)

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  urls
    .map((u) => {
      const alt = (u.alternates ?? [])
        .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`)
        .join('\n')
      return (
        '  <url>\n' +
        `    <loc>${u.loc}</loc>\n` +
        (alt ? `${alt}\n` : '') +
        `    <lastmod>${u.lastmod}</lastmod>\n` +
        `    <changefreq>${u.changefreq}</changefreq>\n` +
        `    <priority>${u.priority}</priority>\n` +
        '  </url>'
      )
    })
    .join('\n') +
  '\n</urlset>\n'

if (!COMMIT) {
  console.log('\n(DRY-RUN — public/sitemap.xml not written. Re-run with --commit.)')
  process.exit(0)
}

const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml')
fs.writeFileSync(outPath, xml)
console.log(`\nWritten: ${outPath}`)
