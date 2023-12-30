// https://v3.nuxtjs.org/api/configuration/nuxt.config
const deploymentDomain = process.env.AUTH_ORIGIN ?? 'http://localhost:3000'
const isDeployed = (
  process.env.AUTH_ORIGIN === 'http://localhost:3000'
  || !process.env.AUTH_ORIGIN
) ? false : true

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
    // '@nuxtjs/axios',
    '@sidebase/nuxt-auth',
    // '@nuxtjs/tailwindcss',,
    '@nuxtjs/color-mode',
    '@nuxt/ui',
    'nuxt-icon',
    '@pinia/nuxt',
  ],
  css: ['~/assets/css/tailwind.css'],
  ssr: false,
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  baseUrl: {
    port: 3000,
  },
  devServer: {
    port: 3000
  },
  colorMode: {
    classSuffix: ''
  },
  auth: {
    provider: {
      type: 'authjs',
      addDefaultCallbackUrl: true
    },
    // https://sidebase.io/nuxt-auth/v0.6/configuration/nuxt-auth-handler#nuxtauthhandler
    origin: deploymentDomain,
    // https://sidebase.io/nuxt-auth/v0.6/configuration/nuxt-config#module-nuxtconfigts
    baseURL: 'http://localhost:3000',
    addDefaultCallbackUrl: true,
    globalAppMiddleware: {
      isEnabled: true,
      allow404WithoutAuth: true,
      addDefaultCallbackUrl: true
    },
  },
  runtimeConfig: {
    /* Auth0 Configuration */
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
    auth0Audience: process.env.A_AUDIENCE,
    auth0ClientId: process.env.A_CID,
    auth0ClientSecret: process.env.A_CS,
    auth0Issuer: process.env.A_DOMAIN,
    
    /* Auth0 Admin Configuration */
    A_M_CS: process.env.A_M_CS ?? '',
    A_M_CID: process.env.A_M_CID ?? '',

    public: {
      /* Application Configuration */
      ACCESS_TOKEN:
        process.env.ACCESS_TOKEN ?? '8b4e2b86a724bf3f39d6766de6e67212',
      CONTEXT: process.env.CONTEXT ?? '',
      APP_ID: process.env.APP_ID ?? 'com.app.biketag',
      ADMIN: process.env.ADMIN ?? 'biketag@biketag.org',
      AMBASSADOR_ROLE: process.env.AMBASSADOR_ROLE ?? 'rol_iET51vzIn8z6Utz0',
      PLAYER_ROLE: process.env.ADMIN ?? 'rol_pcbQ68Q9L0yn1o3O',
      /* BikeTag Configuration */
      GAME_NAME: process.env.GAME_NAME ?? 'null',
      GAME_SOURCE: process.env.GAME_SOURCE ?? '',
      HOST: process.env.HOST ?? 'biketag.io',
      HOST_KEY: process.env.HOST_KEY ?? 'ItsABikeTagGame',
      /* Imgur Admin Configuration */
      IA_CID: process.env.IA_CID ?? '',
      IA_CSECRET: process.env.IA_CSECRET ?? '',
      IA_RTOKEN: process.env.IA_RTOKEN ?? '',
      IA_TOKEN: process.env.IA_TOKEN ?? '',
      /* Imgur Configuration */
      I_CID: process.env.I_CID ?? '',
      I_CSECRET: process.env.I_CSECRET ?? '',
      I_RTOKEN: process.env.I_RTOKEN ?? '',
      I_TOKEN: process.env.I_TOKEN ?? '',
      /* Sanity Admin Configuration */
      SA_CDN_URL: process.env.SA_CDN_URL ?? 'https://cdn.sanity.io/images/',
      SA_DSET: process.env.SA_DSET ?? '',
      SA_PID: process.env.SA_PID ?? '',
      SA_TOKEN: process.env.SA_TOKEN ?? '',
      /* Sanity Configuration */
      S_CURL: process.env.S_CURL ?? 'https://cdn.sanity.io/images/',
      S_DSET: process.env.S_DSET ?? '',
      S_PID: process.env.S_PID ?? '',
      S_TOKEN: process.env.S_TOKEN ?? '',
      /* Google Configuration */
      G_AKEY: process.env.G_AKEY ?? '',
    },
  }
});
