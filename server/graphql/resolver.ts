
import { db } from '../utils/db'
import { getCatalog, getProductBySlug } from '../services/catelog.service'

export const resolvers = {
  Query: {
    products: (_parent: unknown, args: Parameters<typeof getCatalog>[0]) =>
      getCatalog(args),

    product: (_parent: unknown, args: { slug: string }) =>
      getProductBySlug(args.slug),

    categories: async () => {
      const result = await db.query(
        'SELECT id, name, slug FROM categories ORDER BY name'
      )

      return result.rows.map((row) => ({
        ...row,
        id: String(row.id),
      }))
    },
  },
}
