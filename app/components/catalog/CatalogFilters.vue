<script setup lang="ts">
type Category = { id: string; name: string; slug: string }

const props = defineProps<{
  search: string
  category: string
  minPrice: string
  maxPrice: string
  categories: Category[]
}>()

const emit = defineEmits<{
  change: [updates: {
    search?: string
    category?: string
    minPrice?: string
    maxPrice?: string
  }]
}>()

const localSearch = ref(props.search)

watch(
  () => props.search,
  (value) => {
    localSearch.value = value
  }
)

let searchTimer: ReturnType<typeof setTimeout> | null = null

function onSearchInput(event: Event) {
  localSearch.value = (event.target as HTMLInputElement).value

  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    emit('change', { search: localSearch.value })
  }, 300)
}

function clearFilters() {
  localSearch.value = ''
  emit('change', {
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  })
}

const hasActiveFilters = computed(
  () =>
    Boolean(props.search) ||
    Boolean(props.category) ||
    Boolean(props.minPrice) ||
    Boolean(props.maxPrice)
)
</script>

<template>
  <aside class="filters" aria-label="Product filters">
    <div class="filters__header">
      <h2 class="filters__title">Filters</h2>
      <button
        v-if="hasActiveFilters"
        type="button"
        class="filters__clear"
        @click="clearFilters"
      >
        Clear
      </button>
    </div>

    <div class="filters__group">
      <label class="filters__label" for="catalog-search">Search</label>
      <input
        id="catalog-search"
        class="filters__input"
        :value="localSearch"
        type="search"
        placeholder="Search products..."
        autocomplete="off"
        @input="onSearchInput"
      />
    </div>

    <div class="filters__group">
      <label class="filters__label" for="catalog-category">Category</label>
      <select
        id="catalog-category"
        class="filters__select"
        :value="category"
        @change="emit('change', {
          category: ($event.target as HTMLSelectElement).value,
        })"
      >
        <option value="">All categories</option>
        <option
          v-for="item in categories"
          :key="item.id"
          :value="item.slug"
        >
          {{ item.name }}
        </option>
      </select>
    </div>

    <div class="filters__group">
      <p class="filters__label" id="price-label">Price range (₹)</p>
      <div class="filters__price" role="group" aria-labelledby="price-label">
        <input
          class="filters__input"
          type="number"
          min="0"
          :value="minPrice"
          placeholder="Min"
          aria-label="Minimum price"
          @change="emit('change', {
            minPrice: ($event.target as HTMLInputElement).value,
          })"
        />
        <span class="filters__price-sep" aria-hidden="true">–</span>
        <input
          class="filters__input"
          type="number"
          min="0"
          :value="maxPrice"
          placeholder="Max"
          aria-label="Maximum price"
          @change="emit('change', {
            maxPrice: ($event.target as HTMLInputElement).value,
          })"
        />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.filters {
  position: sticky;
  top: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 22px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 0 rgba(15, 23, 32, 0.03);
}

.filters__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.filters__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--ink);
}

.filters__clear {
  border: none;
  background: transparent;
  padding: 0;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent);
  cursor: pointer;
}

.filters__clear:hover {
  text-decoration: underline;
}

.filters__group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filters__label {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 650;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--muted);
}

.filters__input,
.filters__select {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface-muted);
  color: var(--ink);
  font: inherit;
  font-size: 0.95rem;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;
}

.filters__input:focus,
.filters__select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent);
  background: #fff;
}

.filters__select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%235a6570' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.filters__price {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 8px;
  align-items: center;
}

.filters__price-sep {
  color: var(--muted);
}
</style>
