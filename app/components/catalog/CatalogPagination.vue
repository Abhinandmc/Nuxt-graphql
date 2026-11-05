<script setup lang="ts">
const props = defineProps<{
  page: number
  totalPages: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

const pages = computed(() => {
  const total = props.totalPages
  const current = props.page
  const windowSize = 5

  if (total <= windowSize) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  let start = Math.max(1, current - Math.floor(windowSize / 2))
  let end = start + windowSize - 1

  if (end > total) {
    end = total
    start = Math.max(1, end - windowSize + 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="pagination"
    aria-label="Pagination"
  >
    <button
      type="button"
      class="pagination__btn"
      :disabled="page <= 1"
      @click="emit('change', page - 1)"
    >
      Previous
    </button>

    <ul class="pagination__pages">
      <li v-for="item in pages" :key="item">
        <button
          type="button"
          class="pagination__page"
          :class="{ active: item === page }"
          :aria-current="item === page ? 'page' : undefined"
          @click="emit('change', item)"
        >
          {{ item }}
        </button>
      </li>
    </ul>

    <button
      type="button"
      class="pagination__btn"
      :disabled="page >= totalPages"
      @click="emit('change', page + 1)"
    >
      Next
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 8px;
}

.pagination__pages {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pagination__btn,
.pagination__page {
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  color: var(--ink);
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 150ms ease,
    border-color 150ms ease,
    color 150ms ease;
}

.pagination__page {
  min-width: 40px;
  padding: 0;
}

.pagination__btn:hover:not(:disabled),
.pagination__page:hover:not(.active) {
  border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
  background: var(--surface-muted);
}

.pagination__page.active {
  border-color: var(--ink);
  background: var(--ink);
  color: #fff;
  cursor: default;
}

.pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
