<script setup lang="ts">
const route = useRoute()

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <NuxtLink to="/" class="site-header__brand" aria-label="Harbor home">
        Harbor
      </NuxtLink>

      <nav class="site-header__nav" aria-label="Primary">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="site-header__link"
          :class="{ active: isActive(link.to) }"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <NuxtLink to="/products" class="site-header__cta">
        Browse catalog
      </NuxtLink>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid color-mix(in srgb, var(--border) 80%, transparent);
  background: color-mix(in srgb, #f7f4f0 82%, transparent);
  backdrop-filter: blur(12px);
}

.site-header__inner {
  display: flex;
  align-items: center;
  gap: 24px;
  max-width: 1240px;
  margin: 0 auto;
  padding: 14px 20px;
}

.site-header__brand {
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--ink);
  text-decoration: none;
}

.site-header__nav {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 8px;
}

.site-header__link {
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--muted);
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    color 150ms ease,
    background 150ms ease;
}

.site-header__link:hover,
.site-header__link.active {
  color: var(--ink);
  background: color-mix(in srgb, var(--surface) 70%, transparent);
}

.site-header__cta {
  margin-left: auto;
  padding: 10px 16px;
  border-radius: 999px;
  background: var(--ink);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 650;
  text-decoration: none;
  transition: background 150ms ease, transform 150ms ease;
}

.site-header__cta:hover {
  background: color-mix(in srgb, var(--ink) 88%, var(--accent));
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .site-header__cta {
    display: none;
  }
}
</style>
