<script setup lang="ts">
import { PRODUCTS_QUERY, CATEGORIES_QUERY } from '../../../graphql/quries'
import { graphqlRequest } from '../../../server/utils/graphql'
import { computed } from 'vue'
import { useCatalogFilters } from '../../../composables/useCatalogFilters'

type Product = {
  id: string
  name: string
  slug: string
  description: string
  featured: boolean
  category: { name: string; slug: string } | null
  images: { url: string; alt: string }[]
  variants: {
    id: string
    name: string
    pricePaise: number
    stock: number
  }[]
}

type ProductPage = {
  total: number
  page: number
  limit: number
  totalPages: number
  items: Product[]
}

type ProductsData = { products: ProductPage }
type CategoriesData = {
  categories: { id: string; name: string; slug: string }[]
}

const { filters, updateFilters } = useCatalogFilters()

const requestVariables = computed(() => ({
  search: filters.value.search || null,
  category: filters.value.category || null,
  sort: filters.value.sort,
  page: filters.value.page,
  limit: filters.value.limit,
  minPrice: filters.value.minPrice
    ? Number(filters.value.minPrice)
    : null,
  maxPrice: filters.value.maxPrice
    ? Number(filters.value.maxPrice)
    : null,
}))

const { data, error, status } = await useAsyncData(
  'catalog-products',
  () => graphqlRequest<ProductsData>(
    PRODUCTS_QUERY,
    requestVariables.value
  ),
  {
    watch: [requestVariables],
  }
)

const { data: categoryData } = await useAsyncData(
  'catalog-categories',
  () => graphqlRequest<CategoriesData>(CATEGORIES_QUERY)
)

const products = computed(() => data.value?.products.items ?? [])
const pagination = computed(() => data.value?.products)

async function changeFilter(
  updates: Partial<typeof filters.value>
) {
  await updateFilters({
    ...updates,
    page: 1,
  })
}
</script>

<template>
  <main class="catalog">
    <header class="catalog__header">
      <p class="catalog__eyebrow">Browse</p>
      <h1 class="catalog__title">Shop</h1>
      <p class="catalog__subtitle">
        Filter, sort, and browse the full Harbor catalog.
      </p>
    </header>

    <div class="catalog__layout">
      <CatalogFilters
        class="catalog__filters"
        :search="filters.search"
        :category="filters.category"
        :min-price="filters.minPrice"
        :max-price="filters.maxPrice"
        :categories="categoryData?.categories ?? []"
        @change="changeFilter"
      />

      <section class="catalog__main" aria-live="polite">
        <CatalogSort
          :sort="filters.sort"
          :total="pagination?.total ?? 0"
          @change="changeFilter({ sort: $event })"
        />

        <p v-if="status === 'pending'" class="catalog__state">
          Loading products...
        </p>
        <p v-else-if="error" class="catalog__state catalog__state--error">
          Unable to load products: {{ error.message }}
        </p>

        <template v-else>
          <section
            v-if="products.length"
            class="catalog__grid"
          >
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </section>

          <p v-else class="catalog__state">
            No products match your filters.
          </p>

          <CatalogPagination
            v-if="pagination"
            :page="pagination.page"
            :total-pages="pagination.totalPages"
            @change="updateFilters({ page: $event })"
          />
        </template>
      </section>
    </div>
  </main>
</template>

<style scoped>
.catalog {
  --ink: #14212b;
  --muted: #5a6570;
  --accent: #c45c26;
  --surface: #ffffff;
  --surface-muted: #f3f6f8;
  --border: #d7dee4;
  --font-display: 'Syne', sans-serif;
  --font-body: 'Figtree', sans-serif;

  max-width: 1240px;
  margin: 0 auto;
  padding: 32px 20px 56px;
  font-family: var(--font-body);
  color: var(--ink);
}

.catalog__header {
  margin-bottom: 28px;
}

.catalog__eyebrow {
  margin: 0 0 6px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
}

.catalog__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.catalog__subtitle {
  margin: 10px 0 0;
  max-width: 42ch;
  font-size: 1.05rem;
  line-height: 1.5;
  color: var(--muted);
}

.catalog__layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 28px;
  align-items: start;
}

.catalog__main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.catalog__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
}

.catalog__state {
  margin: 0;
  padding: 36px 20px;
  text-align: center;
  border: 1px dashed var(--border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface) 70%, transparent);
  color: var(--muted);
}

.catalog__state--error {
  border-color: color-mix(in srgb, #b42318 35%, var(--border));
  color: #8a1f16;
  background: #fff5f3;
}

@media (max-width: 900px) {
  .catalog__layout {
    grid-template-columns: 1fr;
  }

  .catalog__filters {
    position: static;
  }
}
</style>
