
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useCatalogFilters() {
  const route = useRoute()
  const router = useRouter()

  function readString(value: unknown, fallback = '') {
    return typeof value === 'string' ? value : fallback
  }

  function readPositiveInt(value: unknown, fallback: number) {
    const parsed = Number(value)

    return Number.isInteger(parsed) && parsed > 0
      ? parsed
      : fallback
  }

  const filters = computed(() => ({
    search: readString(route.query.search),
    category: readString(route.query.category),
    sort: ['newest', 'price-asc', 'price-desc', 'name-asc'].includes(
      readString(route.query.sort)
    )
      ? readString(route.query.sort)
      : 'newest',
    page: readPositiveInt(route.query.page, 1),
    limit: Math.min(50, readPositiveInt(route.query.limit, 12)),
    minPrice: readString(route.query.minPrice),
    maxPrice: readString(route.query.maxPrice),
  }))

  async function updateFilters(
    updates: Partial<typeof filters.value>
  ) {
    const next = { ...filters.value, ...updates }
    const query: Record<string, string> = {}

    if (next.search) query.search = next.search
    if (next.category) query.category = next.category
    if (next.sort !== 'newest') query.sort = next.sort
    if (next.page > 1) query.page = String(next.page)
    if (next.limit !== 12) query.limit = String(next.limit)
    if (next.minPrice) query.minPrice = next.minPrice
    if (next.maxPrice) query.maxPrice = next.maxPrice

    return router.push({ query })
  }

  return { filters, updateFilters }
}
