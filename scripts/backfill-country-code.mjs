#!/usr/bin/env node
/**
 * Backfill subscribers.country_code from the localized `country` name.
 *
 *   node scripts/backfill-country-code.mjs            # DRY-RUN (no writes)
 *   node scripts/backfill-country-code.mjs --commit   # apply the UPDATEs
 *
 * Maps localized country names (EN/FR/DE/IT + known aliases) to ISO 3166-1
 * alpha-2. When a name can't be resolved confidently, the row is LEFT NULL
 * (never guessed). Reports: rows resolved, rows unresolved, rows with no
 * country at all, and the distinct unresolved `country` values.
 *
 * Reads DATABASE_URL from the environment (same as the app). Dry-run does not
 * write anything.
 */
import postgres from 'postgres'

const COMMIT = process.argv.includes('--commit')
const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL manquante dans l’environnement.')
  process.exit(1)
}

// ISO 3166-1 alpha-2 code set; Intl.DisplayNames names each per language.
const CODES =
  'AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(
    ' ',
  )

// Languages Photon may emit a country name in (native + major UI languages).
const LANGS =
  'en fr de it es pt nl sv da nb no fi is pl cs sk ro hu el tr ru uk bg sr hr sl lt lv et ga zh ja ko th vi id ms hi ur fa ar he hy ka kk uz mn az sq mk be'.split(
    ' ',
  )

const map = new Map()
const add = (name, code) => {
  if (name) map.set(name.trim().toLowerCase(), code)
}
for (const lang of LANGS) {
  let dn
  try {
    dn = new Intl.DisplayNames([lang], { type: 'region' })
  } catch {
    continue
  }
  for (const code of CODES) {
    try {
      add(dn.of(code), code)
    } catch {
      /* skip */
    }
  }
}
const ALIASES = {
  turkey: 'TR',
  'united states of america': 'US',
  usa: 'US',
  'u.s.': 'US',
  'u.s.a.': 'US',
  'united kingdom of great britain and northern ireland': 'GB',
  uk: 'GB',
  'great britain': 'GB',
  'russian federation': 'RU',
  'czech republic': 'CZ',
  'republic of korea': 'KR',
  'south korea': 'KR',
  'united arab emirates': 'AE',
  kosovo: 'XK',
  'ประเทศไทย': 'TH',
  'ελλάς': 'GR',
  'république démocratique du congo': 'CD',
}
for (const [n, c] of Object.entries(ALIASES)) add(n, c)

const SEPARATORS = /\s*\/\s*|\s+[-–—]\s+/
const nameToCode = (name) => {
  if (!name) return undefined
  const direct = map.get(name.trim().toLowerCase())
  if (direct) return direct
  if (SEPARATORS.test(name)) {
    for (const part of name.split(SEPARATORS)) {
      const code = map.get(part.trim().toLowerCase())
      if (code) return code
    }
  }
  return undefined
}

const sql = postgres(url, { prepare: false, max: 1 })
try {
  // The country_code column is added by ensureSchema() on deploy. Detect it so a
  // dry-run can still preview the mapping BEFORE the column exists.
  const [{ exists: hasColumn }] = await sql`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'subscribers' AND column_name = 'country_code'
    ) AS exists`

  if (!hasColumn) {
    console.log('\n⚠️  Colonne country_code absente (sera créée au déploiement via ensureSchema).')
    if (COMMIT) {
      console.error('   Impossible d’appliquer : déploie le schéma d’abord, puis relance --commit.')
      process.exit(1)
    }
    console.log('   Dry-run sur TOUTES les lignes (aperçu de ce qui serait résolu).')
  }

  const rows = hasColumn
    ? await sql`
        SELECT country, count(*)::int AS n
        FROM subscribers
        WHERE country_code IS NULL AND country IS NOT NULL AND btrim(country) <> ''
        GROUP BY country
        ORDER BY n DESC`
    : await sql`
        SELECT country, count(*)::int AS n
        FROM subscribers
        WHERE country IS NOT NULL AND btrim(country) <> ''
        GROUP BY country
        ORDER BY n DESC`

  let resolvedRows = 0
  let failedRows = 0
  const unresolved = []
  const updates = []
  for (const r of rows) {
    const code = nameToCode(r.country)
    if (code) {
      resolvedRows += r.n
      updates.push([r.country, code])
    } else {
      failedRows += r.n
      unresolved.push({ country: r.country, n: r.n })
    }
  }

  const [{ nullc }] = hasColumn
    ? await sql`
        SELECT count(*)::int AS nullc
        FROM subscribers
        WHERE country_code IS NULL AND (country IS NULL OR btrim(country) = '')`
    : await sql`
        SELECT count(*)::int AS nullc
        FROM subscribers
        WHERE country IS NULL OR btrim(country) = ''`

  console.log(`\n=== BACKFILL country_code — ${COMMIT ? 'COMMIT' : 'DRY-RUN (no writes)'} ===`)
  console.log(`Distinct country values to map : ${rows.length}`)
  console.log(`Rows resolvable                : ${resolvedRows}`)
  console.log(`Rows unresolved (kept NULL)    : ${failedRows}`)
  console.log(`Rows with no country at all    : ${nullc}`)
  if (unresolved.length) {
    console.log(`\nUnresolved distinct country values (kept NULL):`)
    for (const u of unresolved) console.log(`  ${String(u.n).padStart(5)}  ${u.country}`)
  }

  if (COMMIT) {
    let applied = 0
    for (const [country, code] of updates) {
      const res = await sql`
        UPDATE subscribers SET country_code = ${code}
        WHERE country = ${country} AND country_code IS NULL`
      applied += res.count
    }
    console.log(`\n✅ Applied: ${applied} rows updated.`)
  } else {
    console.log(`\n(DRY-RUN — no rows written. Re-run with --commit to apply.)`)
  }
} finally {
  await sql.end()
}
