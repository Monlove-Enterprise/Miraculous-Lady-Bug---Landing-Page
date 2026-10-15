#!/usr/bin/env node
/**
 * Jacksonville and Wilmington dates were swapped in the `cities` table.
 * Math confirmed the correct order (2026-10-15): Jacksonville = Thu Mar 18,
 * Wilmington = Fri Mar 19. The venues and the email templates were already
 * correct — this only corrects the two start_date/end_date values.
 *
 *   node scripts/fix-jacksonville-wilmington-dates.mjs            # DRY-RUN
 *   node scripts/fix-jacksonville-wilmington-dates.mjs --commit
 */
import postgres from 'postgres'

const COMMIT = process.argv.includes('--commit')
const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL manquante')
  process.exit(1)
}

const sql = postgres(url, { ssl: 'require' })

const FIXES = [
  { slug: 'jacksonville-fl', date: '2027-03-18' },
  { slug: 'wilmington-nc', date: '2027-03-19' },
]

const before = await sql`
  SELECT slug, city, venue, start_date, end_date FROM cities
  WHERE slug IN ('jacksonville-fl', 'wilmington-nc')
  ORDER BY slug
`
console.log('Before:')
console.table(before)

if (COMMIT) {
  for (const { slug, date } of FIXES) {
    await sql`
      UPDATE cities SET start_date = ${date}, end_date = ${date}, updated_at = now()
      WHERE slug = ${slug}
    `
  }
  const after = await sql`
    SELECT slug, city, venue, start_date, end_date FROM cities
    WHERE slug IN ('jacksonville-fl', 'wilmington-nc')
    ORDER BY slug
  `
  console.log('After:')
  console.table(after)
} else {
  console.log('\nDRY-RUN — pass --commit to apply.')
}

await sql.end()
