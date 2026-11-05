
import { db } from '../utils/db'

export default defineEventHandler(async () => {
  const result = await db.query(
    'SELECT current_database() AS database, COUNT(*)::int AS product_count FROM products'
  )

  return result.rows[0]
})
