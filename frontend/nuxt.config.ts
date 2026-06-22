// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@element-plus/nuxt', '@nuxt/eslint'],

  routeRules: {
    '/': { redirect: '/panel' },
  },

  runtimeConfig: {
    apiBaseServer: 'http://api:3000/api',
    public: {
      apiBase: '/api',
    },
  },
})