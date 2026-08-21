-- Migration: add ISO 3166-1 alpha-2 country_code to subscribers.
--
-- Kept alongside the existing localized `country` name (which is NOT dropped).
-- This is applied AUTOMATICALLY and idempotently by server/utils/db.ts
-- ensureSchema() on the next deploy — this file documents the change and can be
-- run manually in the Supabase SQL editor if preferred. Both are safe to run
-- repeatedly (IF NOT EXISTS).

ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS country_code text;
CREATE INDEX IF NOT EXISTS subscribers_country_code_idx ON subscribers (country_code);
