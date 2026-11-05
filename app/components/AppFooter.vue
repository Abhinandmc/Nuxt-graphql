<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__brand-block">
        <NuxtLink to="/" class="site-footer__brand">Harbor</NuxtLink>
        <p class="site-footer__tagline">
          Everyday essentials, thoughtfully sourced and ready to ship.
        </p>
      </div>

      <nav class="site-footer__nav" aria-label="Footer">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/products">Shop</NuxtLink>
      </nav>

      <p class="site-footer__copy">
        © {{ new Date().getFullYear() }} Harbor. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: auto;
  border-top: 1px solid var(--border);
  background: color-mix(in srgb, var(--ink) 92%, #1c3344);
  color: #d7dee4;
}

.site-footer__inner {
  display: grid;
  grid-template-columns: 1.4fr auto;
  gap: 24px 40px;
  max-width: 1240px;
  margin: 0 auto;
  padding: 40px 20px 28px;
}

.site-footer__brand {
  display: inline-block;
  margin-bottom: 10px;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #fff;
  text-decoration: none;
}

.site-footer__tagline {
  margin: 0;
  max-width: 36ch;
  font-size: 0.95rem;
  line-height: 1.55;
  color: #9aa7b2;
}

.site-footer__nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.site-footer__nav a {
  color: #e8eef2;
  font-weight: 600;
  text-decoration: none;
}

.site-footer__nav a:hover {
  color: #fff;
  text-decoration: underline;
}

.site-footer__copy {
  grid-column: 1 / -1;
  margin: 8px 0 0;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.85rem;
  color: #8b97a3;
}

@media (max-width: 640px) {
  .site-footer__inner {
    grid-template-columns: 1fr;
  }
}
</style>
