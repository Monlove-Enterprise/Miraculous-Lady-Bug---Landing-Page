-- Migration: news (press/articles roundup).
--
-- External articles only — title, source, link out, optional excerpt/image.
-- No article bodies hosted here. Applied automatically/idempotently by
-- server/utils/db.ts ensureSchema() on next deploy; can also be run manually
-- in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS news (
  id           serial PRIMARY KEY,
  title        text NOT NULL,
  source       text NOT NULL,
  url          text NOT NULL,
  published_at date NOT NULL,
  excerpt      text,
  image_url    text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS news_published_at_idx ON news (published_at DESC);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS news_public_read ON news;
CREATE POLICY news_public_read ON news FOR SELECT USING (true);
