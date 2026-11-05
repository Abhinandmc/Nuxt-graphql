
import { db } from '../utils/db'

type CatalogArgs = {
  search?: string | null
  category?: string | null
  sort?: string | null
  page?: number | null
  limit?: number | null
  minPrice?: number | null
  maxPrice?: number | null
}

type ProductRow = {
  id: number | string
  name: string
  slug: string
  description: string
  featured: boolean
  category_id: number | string
  category_name: string
  category_slug: string
}

async function mapProduct(row: ProductRow) {
  const [variants, images] = await Promise.all([
    db.query(
      `SELECT id, name, sku, price_paise AS "pricePaise", stock
       FROM product_variants WHERE product_id = $1 ORDER BY id`,
      [row.id]
    ),
    db.query(
      `SELECT id, url, alt FROM product_images
       WHERE product_id = $1 ORDER BY id`,
      [row.id]
    ),
  ])

  return {
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    description: row.description,
    featured: row.featured,
    category: {
      id: String(row.category_id),
      name: row.category_name,
      slug: row.category_slug,
    },
    variants: variants.rows.map((v) => ({
      ...v,
      id: String(v.id),
      pricePaise: Number(v.pricePaise),
      stock: Number(v.stock),
    })),
    images: images.rows.map((img) => ({
      ...img,
      id: String(img.id),
    })),
  }
}

export async function getProductBySlug(slug: string) {
  const result = await db.query(
    `SELECT
       p.id, p.name, p.slug, p.description, p.featured,
       c.id AS category_id, c.name AS category_name,
       c.slug AS category_slug
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.slug = $1
     LIMIT 1`,
    [slug]
  )

  const row = result.rows[0]
  if (!row) return null

  return mapProduct(row)
}

export async function getCatalog(args: CatalogArgs) {
  const page = Math.max(1, args.page ?? 1)
  const limit = Math.min(50, Math.max(1, args.limit ?? 12))
  const offset = (page - 1) * limit

  const conditions: string[] = []
  const values: unknown[] = []

  function addCondition(sql: string, value: unknown) {
    values.push(value)
    conditions.push(sql.replace('?', `$${values.length}`))
  }

  if (args.search?.trim()) {
    addCondition(
      `(p.name ILIKE '%' || ? || '%' OR p.description ILIKE '%' || ? || '%')`,
      args.search.trim()
    )
    // The two search placeholders need separate PostgreSQL parameters.
    const searchIndex = values.length
    conditions[conditions.length - 1] =
      `(p.name ILIKE '%' || $${searchIndex} || '%' OR p.description ILIKE '%' || $${searchIndex} || '%')`
  }

  if (args.category) {
    addCondition('c.slug = ?', args.category)
  }

  if (args.minPrice != null) {
    addCondition(
      `EXISTS (
        SELECT 1 FROM product_variants v
        WHERE v.product_id = p.id AND v.price_paise >= ?
      )`,
      args.minPrice * 100
    )
  }

  if (args.maxPrice != null) {
    addCondition(
      `EXISTS (
        SELECT 1 FROM product_variants v
        WHERE v.product_id = p.id AND v.price_paise <= ?
      )`,
      args.maxPrice * 100
    )
  }

  const where = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : ''

  const sortMap: Record<string, string> = {
    newest: 'p.created_at DESC',
    'price-asc': 'min_price ASC',
    'price-desc': 'min_price DESC',
    'name-asc': 'p.name ASC',
  }

  const sort = sortMap[args.sort ?? 'newest'] ?? sortMap.newest

  const countResult = await db.query(
    `SELECT COUNT(*)::int AS total
     FROM products p
     JOIN categories c ON c.id = p.category_id
     ${where}`,
    values
  )

  const total = countResult.rows[0].total

  const listValues = [...values, limit, offset]

  const productsResult = await db.query(
    `SELECT
       p.id, p.name, p.slug, p.description, p.featured,
       c.id AS category_id, c.name AS category_name,
       c.slug AS category_slug,
       COALESCE((
         SELECT MIN(v.price_paise)
         FROM product_variants v WHERE v.product_id = p.id
       ), 0) AS min_price
     FROM products p
     JOIN categories c ON c.id = p.category_id
     ${where}
     ORDER BY ${sort}, p.id ASC
     LIMIT $${listValues.length - 1}
     OFFSET $${listValues.length}`,
    listValues
  )

  const items = await Promise.all(
    productsResult.rows.map((row) => mapProduct(row))
  )

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}
