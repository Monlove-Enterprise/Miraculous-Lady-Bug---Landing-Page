#!/usr/bin/env node
/**
 * Seeds the `news` table (press/articles roundup). Add entries to the `rows`
 * array below as Math shares real published articles — only inserts a row if
 * its `url` doesn't already exist, so it's safe to re-run after adding more.
 *
 *   node scripts/seed-news.mjs            # DRY-RUN
 *   node scripts/seed-news.mjs --commit
 */
import postgres from 'postgres'

const COMMIT = process.argv.includes('--commit')
const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL manquante')
  process.exit(1)
}

const rows = [
  // { title: '...', source: 'Variety', url: 'https://...', published_at: '2027-01-15', excerpt: '...', image_url: null },
]

const sql = postgres(url, { prepare: false, max: 1 })

const existing = await sql`select url from news`
const existingUrls = new Set(existing.map((r) => r.url))
const toInsert = rows.filter((r) => !existingUrls.has(r.url))

console.log(`\n=== SEED NEWS — ${COMMIT ? 'COMMIT' : 'DRY-RUN'} ===`)
console.log(`Déjà en base : ${rows.length - toInsert.length}`)
console.log(`À insérer : ${toInsert.length}`)
for (const r of toInsert) console.log(`  ${r.published_at} — ${r.title} (${r.source})`)

if (!COMMIT) {
  console.log('\n(DRY-RUN — rien inséré. Relancer avec --commit.)')
  await sql.end()
  process.exit(0)
}

for (const r of toInsert) {
  await sql`
    insert into news (title, source, url, published_at, excerpt, image_url)
    values (${r.title}, ${r.source}, ${r.url}, ${r.published_at}, ${r.excerpt ?? null}, ${r.image_url ?? null})
  `
}
console.log(`\nInséré : ${toInsert.length}`)
await sql.end()
