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
            'Miraculous : Ladybug & Cat Noir — The Live Stage Spectacular. Le spectacle musical arrive sur scène. Rejoignez la liste d’attente officielle pour être les premiers informés des dates et de la billetterie.',
        },
        { name: 'theme-color', content: '#f40e04' },
        { name: 'robots', content: 'index, follow' },
        // Open Graph (link-share preview — Facebook / Instagram / Messenger…)
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Miraculous Live' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:locale:alternate', content: 'en_US' },
        {
          property: 'og:title',
          content: 'Miraculous : Ladybug & Cat Noir — The Live Stage Spectacular',
        },
        {
          property: 'og:description',
          content:
            'Le spectacle musical événement. Rejoignez la liste d’attente officielle pour ne rien manquer.',
        },
        {
          property: 'og:image',
          content: 'https://miraculousladybuglive.com/images/og-cover.jpg',
        },
        {
          property: 'og:image:secure_url',
          content: 'https://miraculousladybuglive.com/images/og-cover.jpg',
        },
        { property: 'og:image:type', content: 'image/jpeg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        {
          property: 'og:image:alt',
          content: 'Miraculous : Ladybug & Cat Noir — The Live Stage Spectacular',
        },
        // Twitter / X card
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content: 'Miraculous : Ladybug & Cat Noir — The Live Stage Spectacular',
        },
        {
          name: 'twitter:description',
          content:
            'Le spectacle musical événement. Rejoignez la liste d’attente officielle pour ne rien manquer.',
        },
        {
          name: 'twitter:image',
          content: 'https://miraculousladybuglive.com/images/og-cover.jpg',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebSite',
                '@id': 'https://miraculousladybuglive.com/#website',
                url: 'https://miraculousladybuglive.com/',
                name: 'Miraculous : Ladybug & Cat Noir — The Live Stage Spectacular',
                inLanguage: ['fr', 'en'],
                publisher: { '@id': 'https://miraculousladybuglive.com/#org' },
              },
              {
                '@type': 'Organization',
                '@id': 'https://miraculousladybuglive.com/#org',
                name: 'Monlove International',
                url: 'https://miraculousladybuglive.com/',
                logo: 'https://miraculousladybuglive.com/apple-touch-icon.png',
              },
            ],
          }),
        },
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
    // Per-consent Brevo list routing (defaults match the 4 lists imported 2026-08-25).
    brevoListEmailSms: process.env.BREVO_LIST_EMAIL_SMS || '3',
    brevoListEmail: process.env.BREVO_LIST_EMAIL || '4',
    brevoListSms: process.env.BREVO_LIST_SMS || '5',
    brevoListNoconsent: process.env.BREVO_LIST_NOCONSENT || '6',
    klaviyoApiKey: process.env.KLAVIYO_API_KEY || '',
    // DATABASE_URL is read directly from process.env in server/utils/db.ts
    public: {},
  },
})
