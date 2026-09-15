-- Migration: cities + performances (CLAUDE.md chantier 3).
--
-- `cities`: one row per engagement — a single tour stop ("tournee": one
-- date range, one ticket link) or a long-running residency ("residence":
-- e.g. the Lido, whose individual showtimes live in `performances`).
-- `performances`: only used by "residence" format cities — one row per
-- showtime, so a multi-week run can show a real calendar with per-date
-- sold-out state, instead of a single date range.
--
-- Applied automatically/idempotently by server/utils/db.ts ensureSchema() on
-- next deploy; can also be run manually in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS cities (
  id serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  city text NOT NULL,
  region text,               -- state/province code, e.g. 'NY', 'ON' (nullable)
  country_code text NOT NULL,
  venue text,
  promoter text,              -- internal reference only, never rendered publicly
  format text NOT NULL DEFAULT 'tournee'
    CHECK (format IN ('tournee', 'residence')),
  status text NOT NULL DEFAULT 'envisagee'
    CHECK (status IN ('envisagee', 'confirmee', 'en_vente', 'epuisee')),
  start_date date,
  end_date date,
  opening_at timestamptz,     -- ticket sale opening (UTC) — drives the countdown
  ticket_url text,
  lat numeric,
  lng numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS performances (
  id serial PRIMARY KEY,
  city_id integer NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  sold_out boolean NOT NULL DEFAULT false,
  ticket_url text,            -- overrides the parent city's ticket_url when set
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS performances_city_id_idx ON performances (city_id);

-- Public, read-only content (city/venue/date/showtime — no PII, no financial
-- figures, those are never stored here at all). RLS on with a SELECT-only
-- policy: the public PostgREST API can read, nothing else; writes still
-- require the server's owning DB role, which bypasses RLS entirely.
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cities_public_read ON cities;
CREATE POLICY cities_public_read ON cities FOR SELECT USING (true);

ALTER TABLE performances ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS performances_public_read ON performances;
CREATE POLICY performances_public_read ON performances FOR SELECT USING (true);
