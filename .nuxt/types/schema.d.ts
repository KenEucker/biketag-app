import { NuxtModule, RuntimeConfig } from 'nuxt/schema'
declare module 'nuxt/schema' {
  interface NuxtConfig {
    ["auth"]?: typeof import("@sidebase/nuxt-auth").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["colorMode"]?: typeof import("@nuxtjs/color-mode").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["tailwindcss"]?: typeof import("@nuxtjs/tailwindcss").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["ui"]?: typeof import("@nuxt/ui").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["icon"]?: typeof import("nuxt-icon").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["pinia"]?: typeof import("@pinia/nuxt").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    modules?: (undefined | null | false | NuxtModule | string | [NuxtModule | string, Record<string, any>] | ["@sidebase/nuxt-auth", Exclude<NuxtConfig["auth"], boolean>] | ["@nuxtjs/color-mode", Exclude<NuxtConfig["colorMode"], boolean>] | ["@nuxtjs/tailwindcss", Exclude<NuxtConfig["tailwindcss"], boolean>] | ["@nuxt/ui", Exclude<NuxtConfig["ui"], boolean>] | ["nuxt-icon", Exclude<NuxtConfig["icon"], boolean>] | ["@pinia/nuxt", Exclude<NuxtConfig["pinia"], boolean>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
  interface RuntimeConfig {
   app: {
      baseURL: string,

      buildAssetsDir: string,

      cdnURL: string,
   },

   nextAuthSecret: string,

   auth0Audience: string,

   auth0ClientId: string,

   auth0ClientSecret: string,

   auth0Issuer: string,

   A_M_CS: string,

   A_M_CID: string,
  }
  interface PublicRuntimeConfig {
   ACCESS_TOKEN: string,

   CONTEXT: string,

   APP_ID: string,

   ADMIN: string,

   AMBASSADOR_ROLE: string,

   PLAYER_ROLE: string,

   GAME_NAME: string,

   GAME_SOURCE: string,

   HOST: string,

   HOST_KEY: string,

   IA_CID: string,

   IA_CSECRET: string,

   IA_RTOKEN: string,

   IA_TOKEN: string,

   I_CID: string,

   I_CSECRET: string,

   I_RTOKEN: string,

   I_TOKEN: string,

   SA_CDN_URL: string,

   SA_DSET: string,

   SA_PID: string,

   SA_TOKEN: string,

   S_CURL: string,

   S_DSET: string,

   S_PID: string,

   S_TOKEN: string,

   G_AKEY: string,

   auth: {
      computed: {
         origin: string,

         pathname: string,

         fullBaseUrl: string,
      },

      isEnabled: boolean,

      session: {
         enableRefreshPeriodically: boolean,

         enableRefreshOnWindowFocus: boolean,
      },

      globalAppMiddleware: {
         isEnabled: boolean,

         allow404WithoutAuth: boolean,

         addDefaultCallbackUrl: boolean,
      },

      provider: {
         type: string,

         trustHost: boolean,

         defaultProvider: any,

         addDefaultCallbackUrl: boolean,
      },

      origin: string,

      baseURL: string,

      addDefaultCallbackUrl: boolean,
   },
  }
}
declare module 'vue' {
        interface ComponentCustomProperties {
          $config: RuntimeConfig
        }
      }