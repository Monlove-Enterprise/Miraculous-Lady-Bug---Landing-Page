import postgres from 'postgres'

// Single pooled Postgres connection (Supabase / Neon via DATABASE_URL).
// `prepare: false` keeps it compatible with transaction-mode poolers.
let sql: ReturnType<typeof postgres> | null = null
let schemaReady: Promise<void> | null = null

export function getSql() {
  if (!sql) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL manquante côté serveur.')
    sql = postgres(url, {
      prepare: false,
      idle_timeout: 20,
      max: 1,
      onnotice: (notice) => {
        // The idempotent schema setup (CREATE TABLE/INDEX IF NOT EXISTS, ADD
        // COLUMN IF NOT EXISTS) emits harmless "already exists, skipping"
        // NOTICEs on every cold start. Drop those (42P07 duplicate table/index,
        // 42701 duplicate column); surface anything else.
        if (notice.code === '42P07' || notice.code === '42701') return
        console.warn('[db notice]', notice.message)
      },
    })
  }
  return sql
}

/**
 * Create the subscribers table on first use (idempotent). Runs once per
 * server instance thanks to the cached promise.
 */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    const db = getSql()
    schemaReady = (async () => {
      await db`
        CREATE TABLE IF NOT EXISTS subscribers (
          id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          email             text UNIQUE NOT NULL,
          first_name        text,
          city              text,
          country           text,
          postal_code       text,
          phone             text,
          email_consent      boolean NOT NULL DEFAULT false,
          email_consent_at   timestamptz,
          email_consent_text text,
          sms_consent        boolean NOT NULL DEFAULT false,
          sms_consent_at     timestamptz,
          sms_consent_text   text,
          age_confirmed      boolean NOT NULL DEFAULT false,
          locale             text,
          utm_source         text,
          utm_medium         text,
          utm_campaign       text,
          referrer           text,
          ip                 text,
          crm_synced         boolean NOT NULL DEFAULT false,
          created_at         timestamptz NOT NULL DEFAULT now(),
          updated_at         timestamptz NOT NULL DEFAULT now()
        )
      `
      // Idempotent column adds so an already-created table gets the newer
      // consent-text/locale columns without a manual migration.
      await db`ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS email_consent_text text`
      await db`ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS sms_consent_text text`
      await db`ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS locale text`
      await db`ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS referrer text`

      // Fast lookups for per-country export / CRM backfill.
      await db`CREATE INDEX IF NOT EXISTS subscribers_country_idx ON subscribers (country)`
      await db`CREATE INDEX IF NOT EXISTS subscribers_crm_synced_idx ON subscribers (crm_synced)`

      // Lock the table to server-only access (this table is created via raw SQL,
      // so Supabase's automatic RLS doesn't apply to it). Our connection role
      // owns the table and bypasses RLS, so writes are unaffected; the public
      // PostgREST API is blocked. Idempotent — safe to run on every cold start.
      await db`ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY`

      // Tour cities / residency performances (see migrations/003_cities.sql
      // for the full comment on the "tournee" vs "residence" format).
      await db`
        CREATE TABLE IF NOT EXISTS cities (
          id           serial PRIMARY KEY,
          slug         text UNIQUE NOT NULL,
          city         text NOT NULL,
          region       text,
          country_code text NOT NULL,
          venue        text,
          promoter     text,
          format       text NOT NULL DEFAULT 'tournee' CHECK (format IN ('tournee', 'residence')),
          status       text NOT NULL DEFAULT 'envisagee' CHECK (status IN ('envisagee', 'confirmee', 'en_vente', 'epuisee')),
          start_date   date,
          end_date     date,
          opening_at   timestamptz,
          ticket_url   text,
          lat          numeric,
          lng          numeric,
          created_at   timestamptz NOT NULL DEFAULT now(),
          updated_at   timestamptz NOT NULL DEFAULT now()
        )
      `
      await db`
        CREATE TABLE IF NOT EXISTS performances (
          id         serial PRIMARY KEY,
          city_id    integer NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
          starts_at  timestamptz NOT NULL,
          sold_out   boolean NOT NULL DEFAULT false,
          ticket_url text,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `
      await db`CREATE INDEX IF NOT EXISTS performances_city_id_idx ON performances (city_id)`
      // Public read-only content, no PII — safe under RLS with an open SELECT
      // policy so the site can read it without a server-only connection if
      // ever needed; writes still require the owning role (bypasses RLS).
      await db`ALTER TABLE cities ENABLE ROW LEVEL SECURITY`
      await db`DROP POLICY IF EXISTS cities_public_read ON cities`
      await db`CREATE POLICY cities_public_read ON cities FOR SELECT USING (true)`
    })().catch((err) => {
      // Reset so a later request can retry schema creation.
      schemaReady = null
      throw err
    })
  }
  return schemaReady
}
