<script setup lang="ts">
import { computed } from 'vue'

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

const props = defineProps<{
  product: Product
}>()

function formatPrice(pricePaise: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(pricePaise / 100)
}

const lowestPrice = computed(() => {
  if (!props.product.variants.length) return null
  return Math.min(...props.product.variants.map((v) => v.pricePaise))
})

const inStock = computed(() =>
  props.product.variants.some((v) => v.stock > 0)
)
</script>

<template>
  <article class="product-card" :class="{ featured: product.featured }">
    <NuxtLink :to="`/products/${product.slug}`" class="product-card__link">
      <div class="product-card__media">
        <img
          v-if="product.images[0]"
          :src="product.images[0].url"
          :alt="product.images[0].alt || product.name"
          loading="lazy"
        />
        <div v-else class="product-card__placeholder" aria-hidden="true">
          No image
        </div>
        <span v-if="product.featured" class="product-card__badge">Featured</span>
        <span
          v-if="!inStock"
          class="product-card__badge product-card__badge--muted"
        >
          Out of stock
        </span>
      </div>

      <div class="product-card__body">
        <p v-if="product.category" class="product-card__category">
          {{ product.category.name }}
        </p>
        <h2 class="product-card__title">{{ product.name }}</h2>
        <p class="product-card__desc">{{ product.description }}</p>
        <p v-if="lowestPrice !== null" class="product-card__price">
          {{ formatPrice(lowestPrice) }}
        </p>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
.product-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.product-card:hover {
  border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
  box-shadow: 0 12px 28px rgba(15, 23, 32, 0.08);
  transform: translateY(-2px);
}

.product-card.featured {
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
}

.product-card__link {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: inherit;
  text-decoration: none;
}

.product-card__media {
  position: relative;
  aspect-ratio: 1;
  background: var(--surface-muted);
  overflow: hidden;
}

.product-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 320ms ease;
}

.product-card:hover .product-card__media img {
  transform: scale(1.04);
}

.product-card__placeholder {
  display: grid;
  place-items: center;
  height: 100%;
  color: var(--muted);
  font-size: 0.875rem;
}

.product-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--ink);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.product-card__badge--muted {
  left: auto;
  right: 12px;
  background: color-mix(in srgb, var(--ink) 55%, transparent);
}

.product-card__body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 16px 18px;
  flex: 1;
}

.product-card__category {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent);
}

.product-card__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 650;
  line-height: 1.25;
  color: var(--ink);
}

.product-card__desc {
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.9rem;
  line-height: 1.45;
  color: var(--muted);
}

.product-card__price {
  margin: auto 0 0;
  padding-top: 10px;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--ink);
}
</style>
