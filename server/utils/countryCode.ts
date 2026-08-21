// Reverse map: localized country NAME → ISO 3166-1 alpha-2 code.
//
// The stored `country` column holds whatever name the geocoder (Photon) emits,
// which in practice is often the country's NATIVE name ("México", "Nederland",
// "中国", "대한민국"), not the requested FR/EN. So we index each ISO code's name
// across a broad set of languages, plus the app's own EN/FR list and a few
// known aliases. Unknown names return undefined (caller leaves country_code
// NULL rather than guessing). Combined multilingual strings
// ("België / Belgique / Belgien", "Κύπρος - Kıbrıs") are split and each part
// tried.
import { countries } from '../../utils/countries'

// Languages Photon may emit a country name in (native + major UI languages).
const LANGS = [
  'en', 'fr', 'de', 'it', 'es', 'pt', 'nl', 'sv', 'da', 'nb', 'no', 'fi', 'is',
  'pl', 'cs', 'sk', 'ro', 'hu', 'el', 'tr', 'ru', 'uk', 'bg', 'sr', 'hr', 'sl',
  'lt', 'lv', 'et', 'ga', 'zh', 'ja', 'ko', 'th', 'vi', 'id', 'ms', 'hi', 'ur',
  'fa', 'ar', 'he', 'hy', 'ka', 'kk', 'uz', 'mn', 'az', 'sq', 'mk', 'be',
]

const nameMap = new Map<string, string>()

function add(name: string | undefined | null, code: string) {
  if (name) nameMap.set(name.trim().toLowerCase(), code)
}

// The app's own list (exact spellings used elsewhere in the UI).
for (const c of countries) {
  add(c.en, c.code)
  add(c.fr, c.code)
}

// Every ISO code, named across the language set.
for (const lang of LANGS) {
  let dn: Intl.DisplayNames | undefined
  try {
    dn = new Intl.DisplayNames([lang], { type: 'region' })
  } catch {
    dn = undefined
  }
  if (!dn) continue
  for (const c of countries) {
    try {
      add(dn.of(c.code), c.code)
    } catch {
      /* skip unknown region for this language */
    }
  }
}

// Known alternate spellings the geocoder returns that the above misses.
const ALIASES: Record<string, string> = {
  turkey: 'TR', // ICU now says "Türkiye"
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
  'ประเทศไทย': 'TH', // Thai, name not in ICU 'th' region data
  'ελλάς': 'GR', // archaic Greek form; ICU 'el' says "Ελλάδα"
  'république démocratique du congo': 'CD', // ICU 'fr' says "Congo-Kinshasa"
}
for (const [name, code] of Object.entries(ALIASES)) add(name, code)

// Split combined multilingual names on "/" or a space-padded dash only, so
// hyphenated single names (Guinea-Bissau, Timor-Leste) are never split.
const SEPARATORS = /\s*\/\s*|\s+[-–—]\s+/

/** Map a localized country name to ISO 3166-1 alpha-2, or undefined if unknown. */
export function nameToCode(name?: string): string | undefined {
  if (!name) return undefined
  const direct = nameMap.get(name.trim().toLowerCase())
  if (direct) return direct
  if (SEPARATORS.test(name)) {
    for (const part of name.split(SEPARATORS)) {
      const code = nameMap.get(part.trim().toLowerCase())
      if (code) return code
    }
  }
  return undefined
}
