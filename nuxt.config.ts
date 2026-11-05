// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  modules: ['@pinia/nuxt'],

  // Keep names like CatalogFilters (not CatalogCatalogFilters)
  components: [
    { path: '~/components', pathPrefix: false },
  ],

  typescript: {
    strict: true,
  },

  devtools: {
    enabled: true,
  },
})
