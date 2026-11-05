<script setup lang="ts">
import { PRODUCT_QUERY } from '../../../graphql/quries'
import { graphqlRequest } from '../../../server/utils/graphql'

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
    sku: string
    pricePaise: number
    stock: number
  }[]
}

type ProductData = { product: Product | null }

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data, error, status } = await useAsyncData(
  () => `product-${slug.value}`,
  () =>
    graphqlRequest<ProductData>(PRODUCT_QUERY, {
      slug: slug.value,
    }),
  {
    watch: [slug],
  }
)

const product = computed(() => data.value?.product ?? null)

if (!product.value && status.value !== 'pending') {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found',
  })
}

const selectedVariantId = ref<string | null>(null)

watch(
  product,
  (value) => {
    if (!value?.variants.length) {
      selectedVariantId.value = null
      return
    }

    const preferred =
      value.variants.find((variant) => variant.stock > 0) ?? value.variants[0]

    selectedVariantId.value = preferred.id
  },
  { immediate: true }
)

const selectedVariant = computed(() =>
  product.value?.variants.find((variant) => variant.id === selectedVariantId.value) ??
  null
)

const activeImageIndex = ref(0)

watch(product, () => {
  activeImageIndex.value = 0
})

function formatPrice(pricePaise: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(pricePaise / 100)
}
</script>

<template>
  <main class="detail">
    <p v-if="status === 'pending'" class="detail__state">Loading product...</p>
    <p v-else-if="error" class="detail__state detail__state--error">
      Unable to load product: {{ error.message }}
    </p>
    <p v-else-if="!product" class="detail__state">
      Product not found.
      <NuxtLink to="/products">Back to shop</NuxtLink>
    </p>

    <template v-else>
      <nav class="detail__crumbs" aria-label="Breadcrumb">
        <NuxtLink to="/">Home</NuxtLink>
        <span aria-hidden="true">/</span>
        <NuxtLink to="/products">Shop</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>{{ product.name }}</span>
      </nav>

      <div class="detail__layout">
        <section class="detail__gallery" aria-label="Product images">
          <div class="detail__image">
            <img
              v-if="product.images[activeImageIndex]"
              :src="product.images[activeImageIndex].url"
              :alt="product.images[activeImageIndex].alt || product.name"
            />
            <div v-else class="detail__placeholder">No image</div>
          </div>

          <div
            v-if="product.images.length > 1"
            class="detail__thumbs"
          >
            <button
              v-for="(image, index) in product.images"
              :key="image.url + index"
              type="button"
              class="detail__thumb"
              :class="{ active: index === activeImageIndex }"
              :aria-label="`View image ${index + 1}`"
              @click="activeImageIndex = index"
            >
              <img :src="image.url" :alt="image.alt || product.name" />
            </button>
          </div>
        </section>

        <section class="detail__info">
          <p v-if="product.category" class="detail__category">
            {{ product.category.name }}
          </p>
          <h1 class="detail__title">{{ product.name }}</h1>
          <p class="detail__description">{{ product.description }}</p>

          <p v-if="selectedVariant" class="detail__price">
            {{ formatPrice(selectedVariant.pricePaise) }}
          </p>

          <div v-if="product.variants.length" class="detail__variants">
            <p class="detail__label">Options</p>
            <div class="detail__variant-list" role="list">
              <button
                v-for="variant in product.variants"
                :key="variant.id"
                type="button"
                class="detail__variant"
                :class="{
                  active: variant.id === selectedVariantId,
                  disabled: variant.stock <= 0,
                }"
                :disabled="variant.stock <= 0"
                @click="selectedVariantId = variant.id"
              >
                <span>{{ variant.name }}</span>
                <small v-if="variant.stock <= 0">Out of stock</small>
                <small v-else>{{ variant.stock }} in stock</small>
              </button>
            </div>
          </div>

          <div class="detail__actions">
            <button
              type="button"
              class="detail__buy"
              :disabled="!selectedVariant || selectedVariant.stock <= 0"
            >
              {{
                selectedVariant && selectedVariant.stock > 0
                  ? 'Add to cart'
                  : 'Unavailable'
              }}
            </button>
            <NuxtLink to="/products" class="detail__back">
              Back to shop
            </NuxtLink>
          </div>
        </section>
      </div>
    </template>
  </main>
</template>

<style scoped>
.detail {
  max-width: 1240px;
  margin: 0 auto;
  padding: 28px 20px 64px;
  color: var(--ink);
}

.detail__crumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 0.9rem;
  color: var(--muted);
}

.detail__crumbs a {
  color: var(--muted);
  text-decoration: none;
  font-weight: 600;
}

.detail__crumbs a:hover {
  color: var(--ink);
  text-decoration: underline;
}

.detail__layout {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 36px;
  align-items: start;
}

.detail__gallery {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail__image {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: var(--surface);
}

.detail__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail__placeholder {
  display: grid;
  place-items: center;
  height: 100%;
  color: var(--muted);
}

.detail__thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail__thumb {
  width: 72px;
  height: 72px;
  padding: 0;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 10px;
  background: var(--surface);
  cursor: pointer;
}

.detail__thumb.active {
  border-color: var(--ink);
}

.detail__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail__info {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 8px 0;
}

.detail__category {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}

.detail__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.detail__description {
  margin: 0;
  max-width: 48ch;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--muted);
}

.detail__price {
  margin: 4px 0 0;
  font-family: var(--font-display);
  font-size: 1.65rem;
  font-weight: 800;
}

.detail__label {
  margin: 0 0 10px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}

.detail__variant-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.detail__variant {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 120px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  color: var(--ink);
  cursor: pointer;
  text-align: left;
  transition: border-color 150ms ease, background 150ms ease;
}

.detail__variant span {
  font-weight: 700;
}

.detail__variant small {
  color: var(--muted);
  font-size: 0.78rem;
}

.detail__variant.active {
  border-color: var(--ink);
  background: var(--surface-muted);
}

.detail__variant.disabled,
.detail__variant:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.detail__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-top: 10px;
}

.detail__buy {
  min-height: 48px;
  padding: 0 22px;
  border: none;
  border-radius: 999px;
  background: var(--ink);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: background 150ms ease, transform 150ms ease;
}

.detail__buy:hover:not(:disabled) {
  background: color-mix(in srgb, var(--ink) 88%, var(--accent));
  transform: translateY(-1px);
}

.detail__buy:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.detail__back {
  font-weight: 700;
  color: var(--muted);
  text-decoration: none;
}

.detail__back:hover {
  color: var(--ink);
  text-decoration: underline;
}

.detail__state {
  margin: 48px 0;
  padding: 36px 20px;
  text-align: center;
  border: 1px dashed var(--border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface) 70%, transparent);
  color: var(--muted);
}

.detail__state a {
  color: var(--accent);
  font-weight: 700;
}

.detail__state--error {
  border-color: color-mix(in srgb, #b42318 35%, var(--border));
  color: #8a1f16;
  background: #fff5f3;
}

@media (max-width: 900px) {
  .detail__layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>
