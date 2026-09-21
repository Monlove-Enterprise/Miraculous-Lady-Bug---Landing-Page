import { getSql, ensureSchema } from '../utils/db'

export interface NewsRow {
  id: number
  title: string
  source: string
  url: string
  publishedAt: string
  excerpt: string | null
  imageUrl: string | null
}

export default defineEventHandler(async (): Promise<NewsRow[]> => {
  await ensureSchema()
  const db = getSql()
  const rows = await db<any[]>`
    SELECT id, title, source, url, published_at, excerpt, image_url
    FROM news
    ORDER BY published_at DESC
  `
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    source: r.source,
    url: r.url,
    publishedAt: r.published_at,
    excerpt: r.excerpt,
    imageUrl: r.image_url,
  }))
})
