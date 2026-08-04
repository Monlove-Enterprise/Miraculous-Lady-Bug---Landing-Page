// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: ['@vercel/analytics/nuxt'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Miraculous : Ladybug & Cat Noir — Le Spectacle Live',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Miraculous : Ladybug & Cat Noir arrive sur scène. Inscrivez-vous pour être les premiers informés de la billetterie et des dates.',
        },
        { name: 'theme-color', content: '#0a0507' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        {
          property: 'og:title',
          content: 'Miraculous : Ladybug & Cat Noir — Le Spectacle Live',
        },
        {
          property: 'og:description',
          content:
            'Le spectacle live événement. Inscrivez-vous pour ne rien manquer.',
        },
        { property: 'og:image', content: '/images/keyart-horizontal.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
    },
  },

  // Server-side secrets & config. Set the relevant keys in .env (see .env.example).
  runtimeConfig: {
    // CRM routing (per channel). Values: 'brevo' | 'klaviyo'.
    crmProvider: process.env.CRM_PROVIDER || 'brevo', // global default
    crmEmailProvider: process.env.CRM_EMAIL_PROVIDER || '', // email platform (defaults to crmProvider)
    crmSmsProvider: process.env.CRM_SMS_PROVIDER || '', // SMS default (defaults to crmProvider)
    crmSmsCountryRouting: process.env.CRM_SMS_COUNTRY_ROUTING || '', // JSON: {"US":"klaviyo"}
    brevoApiKey: process.env.BREVO_API_KEY || '',
    brevoListId: process.env.BREVO_LIST_ID || '',
    klaviyoApiKey: process.env.KLAVIYO_API_KEY || '',
    // DATABASE_URL is read directly from process.env in server/utils/db.ts
    public: {},
  },
})
