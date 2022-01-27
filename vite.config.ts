import * as path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pkg from './package.json'
import EnvironmentPlugin from 'vite-plugin-environment'
import envCompatible from 'vite-plugin-env-compatible'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      }
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  css: {
    preprocessorOptions: {
      scss: { charset: false },
      css: { charset: false },
    },
  },
  plugins: [
    vue(),
    EnvironmentPlugin({
      /* Application Configuration */
      USE_AUTHENTICATION: process.env.USE_AUTHENTICATION ?? null,
      VITE_APP_VERSION: pkg.version,
      VITE_APP_BUILD_EPOCH: process.env.NODE_ENV === 'production' ? new Date().getTime().toString() : null,
      /* BikeTag Configuration */
      GAME_NAME: process.env.GAME_NAME ?? 'prime',
      GAME_SOURCE: process.env.GAME_SOURCE ?? null,
      HOST: process.env.HOST ?? 'biketag.io',
      HOST_KEY: process.env.HOST_KEY ?? 'ItsABikeTagGame',
      ACCESS_TOKEN: process.env.ACCESS_TOKEN ?? '8b4e2b86a724bf3f39d6766de6e67212',
      /* Imgur Configuration */
      IMGUR_CLIENT_ID: process.env.IMGUR_CLIENT_ID ?? null,
      IMGUR_CLIENT_SECRET: process.env.IMGUR_CLIENT_SECRET ?? null,
      IMGUR_ACCESS_TOKEN: process.env.IMGUR_ACCESS_TOKEN ?? null,
      IMGUR_REFRESH_TOKEN: process.env.IMGUR_REFRESH_TOKEN ?? null,
      /* Sanity Configuration */
      SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID ?? null,
      SANITY_DATASET: process.env.SANITY_DATASET ?? null,
      SANITY_CDN_URL: process.env.SANITY_CDN_URL ?? 'https://cdn.sanity.io/images/',
      /* Reddit Configuration */
      REDDIT_CLIENT_ID: process.env.REDDIT_CLIENT_ID ?? null,
      REDDIT_CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET ?? null,
      REDDIT_USERNAME: process.env.REDDIT_USERNAME ?? null,
      REDDIT_PASSWORD: process.env.REDDIT_PASSWORD ?? null,
      /* Auth0 Configuration */
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID ?? null,
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN ?? null,
    }),
    envCompatible(),
  ],
  build: {
    rollupOptions: {},
  },
  server: {
    host: 'localhost',
    port: 3000,
  },
  preview: {
    port: 3000,
  },
})
