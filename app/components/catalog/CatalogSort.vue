<script setup lang="ts">
defineProps<{
  sort: string
  total: number
}>()

const emit = defineEmits<{
  change: [sort: string]
}>()
</script>

<template>
  <div class="sort-bar">
    <p class="sort-bar__count">
      <strong>{{ total }}</strong>
      {{ total === 1 ? 'product' : 'products' }} found
    </p>

    <div class="sort-bar__control">
      <label class="sort-bar__label" for="catalog-sort">Sort by</label>
      <select
        id="catalog-sort"
        class="sort-bar__select"
        :value="sort"
        @change="emit('change', ($event.target as HTMLSelectElement).value)"
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="name-asc">Name: A–Z</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.sort-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 20px;
  padding: 14px 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.sort-bar__count {
  margin: 0;
  font-size: 0.95rem;
  color: var(--muted);
}

.sort-bar__count strong {
  color: var(--ink);
  font-weight: 700;
}

.sort-bar__control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.sort-bar__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--muted);
  white-space: nowrap;
}

.sort-bar__select {
  min-width: 190px;
  padding: 10px 36px 10px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background-color: var(--surface-muted);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%235a6570' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  appearance: none;
  color: var(--ink);
  font: inherit;
  font-size: 0.95rem;
  cursor: pointer;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;
}

.sort-bar__select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent);
  background-color: #fff;
}
</style>
