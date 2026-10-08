// Cities not ready to show publicly yet (Math, 2026-10-08: Paris/Lido
// residency venue isn't confirmed, Qatar isn't ready either — hide from
// every tour listing, not just the world map). Still reachable by direct
// URL (/villes/paris) and in the admin-facing cities table; just excluded
// from anywhere the tour is listed out for visitors.
export const HIDDEN_CITY_SLUGS = new Set(['paris', 'qatar-2027'])
