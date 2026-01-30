import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxthub/core',
    '@vite-pwa/nuxt',
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'One Piece Card Collection',
      short_name: 'OP Cards',
      description: 'Ma collection de cartes One Piece',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: '/images/icon-app.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/images/icon-app.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  }
})
