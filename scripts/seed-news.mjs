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

// From https://monlove.com/miraculous-news/ (2026-09-21) — Monlove mirrors
// the original outlets' press coverage on its own site rather than linking
// out, so `url` points there. Two dates (Variety, Toy Book) weren't shown on
// the page — 2026-01-08 is inferred from the other same-wave articles + a
// ToyBook image-upload timestamp, not confirmed; fix if Math has the real ones.
const rows = [
  {
    title: '‘Miraculous: Tales of Ladybug & Cat Noir’ Getting Live Stage Show for 2027 World Tour',
    source: 'Variety',
    url: 'https://monlove.com/miraculous-variety',
    published_at: '2026-01-08', // inferred, not confirmed on page
    excerpt:
      'Miraculous Corp and Monlove have partnered to develop a new live stage production based on the global animated franchise "Miraculous," set to launch worldwide in 2027.',
  },
  {
    title: 'Miraculous Ladybug Reveals Brand-New Story in Major Theatrical Release',
    source: 'CBR',
    url: 'https://monlove.com/miraculous-cbr',
    published_at: '2026-01-08',
    excerpt:
      'The piece announces an upcoming stage play adaptation of the animated series, set to debut in 2027, created by Martin Lord Ferguson and Ella Louise Allaire.',
  },
  {
    title: 'MIRACULOUS: TALES OF LADYBUG & CAT NOIR Coming to the Stage in New Live Show',
    source: 'BroadwayWorld',
    url: 'https://monlove.com/miraculous-bw',
    published_at: '2026-01-08',
    excerpt:
      'Miraculous Corp and Monlove have partnered to create a stage production called "Miraculous Live Stage Spectacular," premiering in 2027. City and venue announcements are planned for 2026.',
  },
  {
    title: '‘Miraculous’ Set To Make Its Theatrical Debut with ‘Miraculous Live Stage Spectacular’',
    source: 'Toy Book',
    url: 'https://monlove.com/miraculous-toybook',
    published_at: '2026-01-08', // inferred, not confirmed on page
    excerpt:
      'Miraculous Corp is partnering with Montreal-based production company Monlove to present a theatrical live experience. The global tour begins in early 2027.',
  },
  {
    title: 'Miraculous Corp & Monlove Announce ‘Miraculous’ Stage Show',
    source: 'Animation Magazine',
    url: 'https://monlove.com/miraculous-animationmag',
    published_at: '2026-01-07',
    excerpt:
      'The announcement details a new live stage spectacular featuring Ladybug and Cat Noir, set to premiere in 2027.',
  },
  {
    title: 'Miraculous: Tales of Ladybug & Cat Noir Announces Live-Action Adaptation',
    source: 'ComicBook.com',
    url: 'https://monlove.com/miraculous-comicbook',
    published_at: '2026-01-08',
    excerpt:
      'The animated series about young crime fighters is getting a stage play adaptation in 2027, developed by Martin Lord Ferguson and Ella Louise Allaire.',
  },
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
