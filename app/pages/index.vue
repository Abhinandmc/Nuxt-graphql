<script setup lang="ts">
import { PRODUCTS_QUERY } from '../../graphql/quries'
import { graphqlRequest } from '../../server/utils/graphql'

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

type ProductsData = {
  products: {
    items: Product[]
  }
}

const { data } = await useAsyncData('landing-featured', () =>
  graphqlRequest<ProductsData>(PRODUCTS_QUERY, {
    sort: 'newest',
    page: 1,
    limit: 4,
  })
)

const featured = computed(() => data.value?.products.items ?? [])
</script>

<template>
  <div class="landing">
    <section class="hero" aria-label="Harbor hero">
      <div class="hero__media" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1800&q=80"
          alt=""
        />
      </div>

      <div class="hero__veil" aria-hidden="true" />

      <div class="hero__content">
        <p class="hero__brand">Harbor</p>
        <h1 class="hero__headline">Goods that earn their place.</h1>
        <p class="hero__support">
          A focused catalog of everyday essentials — filtered, sorted, and ready when you are.
        </p>
        <div class="hero__actions">
          <NuxtLink to="/products" class="hero__cta">Shop the catalog</NuxtLink>
          <NuxtLink to="/products" class="hero__cta hero__cta--ghost">
            View all products
          </NuxtLink>
        </div>
      </div>
    </section>

    <section v-if="featured.length" class="featured">
      <div class="featured__inner">
        <header class="featured__header">
          <h2 class="featured__title">Fresh arrivals</h2>
          <p class="featured__subtitle">
            Start with what’s new, then open the full shop for filters and sorting.
          </p>
        </header>

        <div class="featured__grid">
          <ProductCard
            v-for="product in featured"
            :key="product.id"
            :product="product"
          />
        </div>

        <div class="featured__footer">
          <NuxtLink to="/products" class="featured__link">
            Browse all products
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing {
  color: var(--ink);
}

.hero {
  position: relative;
  display: grid;
  align-items: end;
  min-height: min(92vh, 820px);
  overflow: hidden;
  color: #fff;
}

.hero__media {
  position: absolute;
  inset: 0;
}

.hero__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transform: scale(1.04);
  animation: hero-drift 18s ease-in-out infinite alternate;
}

.hero__veil {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(12, 20, 28, 0.78) 0%, rgba(12, 20, 28, 0.42) 52%, rgba(12, 20, 28, 0.2) 100%),
    linear-gradient(180deg, rgba(12, 20, 28, 0.15) 0%, rgba(12, 20, 28, 0.72) 100%);
}

.hero__content {
  position: relative;
  z-index: 1;
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  padding: 72px 20px 64px;
  animation: hero-rise 700ms ease both;
}

.hero__brand {
  margin: 0 0 14px;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 7vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.95;
}

.hero__headline {
  margin: 0;
  max-width: 14ch;
  font-family: var(--font-display);
  font-size: clamp(1.55rem, 3.4vw, 2.35rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
  animation: hero-rise 700ms ease 120ms both;
}

.hero__support {
  margin: 16px 0 0;
  max-width: 38ch;
  font-size: 1.05rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.82);
  animation: hero-rise 700ms ease 220ms both;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
  animation: hero-rise 700ms ease 320ms both;
}

.hero__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 22px;
  border-radius: 999px;
  background: #fff;
  color: var(--ink);
  font-weight: 700;
  text-decoration: none;
  transition: transform 160ms ease, background 160ms ease;
}

.hero__cta:hover {
  transform: translateY(-2px);
  background: #f3f6f8;
}

.hero__cta--ghost {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.45);
}

.hero__cta--ghost:hover {
  background: rgba(255, 255, 255, 0.1);
}

.featured {
  padding: 64px 20px 72px;
}

.featured__inner {
  max-width: 1240px;
  margin: 0 auto;
}

.featured__header {
  margin-bottom: 28px;
}

.featured__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 3vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.featured__subtitle {
  margin: 10px 0 0;
  max-width: 42ch;
  color: var(--muted);
  line-height: 1.5;
}

.featured__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
}

.featured__footer {
  margin-top: 28px;
}

.featured__link {
  display: inline-flex;
  font-weight: 700;
  color: var(--accent);
  text-decoration: none;
}

.featured__link:hover {
  text-decoration: underline;
}

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hero-drift {
  from {
    transform: scale(1.04) translate3d(0, 0, 0);
  }
  to {
    transform: scale(1.1) translate3d(-1.5%, -1%, 0);
  }
}

@media (max-width: 640px) {
  .hero {
    min-height: min(88vh, 700px);
  }

  .hero__content {
    padding-top: 56px;
    padding-bottom: 48px;
  }
}
</style>
