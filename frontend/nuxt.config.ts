import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/main.css', '@mdi/font/css/materialdesignicons.min.css'],
  
  imports: {
    dirs: [
      'composables/api',
      'composables/function',
    ]
  },

  vite:{
    plugins: [
      tailwindcss()
    ]
  },

  modules: ['@pinia/nuxt']
})
