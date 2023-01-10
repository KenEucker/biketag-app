import { defineConfig, type UserConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { checker } from 'vite-plugin-checker'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import Markdown from 'vite-plugin-vue-markdown'
import WindiCSS from 'vite-plugin-windicss'

import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'

/**
 * Vite Configure
 *
 * @see {@link https://vitejs.dev/config/}
 */
export default defineConfig(async ({ command, mode }): Promise<UserConfig> => {
  const config: UserConfig = {
    // https://vitejs.dev/config/shared-options.html#base
    base: './',
    // https://vitejs.dev/config/shared-options.html#define
    define: {
      'process.env': {
        ACCESS_TOKEN:
          process.env.ACCESS_TOKEN ?? '8b4e2b86a724bf3f39d6766de6e67212',
        CONTEXT: process.env.CONTEXT ?? null,
        APP_ID: process.env.APP_ID ?? 'com.app.biketag-admin',
        ADMIN: process.env.ADMIN ?? 'biketag@biketag.org',
        AMBASSADOR_ROLE: process.env.AMBASSADOR_ROLE ?? 'rol_iET51vzIn8z6Utz0',
        PLAYER_ROLE: process.env.ADMIN ?? 'rol_pcbQ68Q9L0yn1o3O',
        /* Auth0 Configuration */
        A_AUDIENCE: process.env.A_AUDIENCE ?? null,
        A_CID: process.env.A_CID ?? null,
        A_DOMAIN: process.env.A_DOMAIN ?? null,
        A_TOKEN: process.env.A_TOKEN ?? null,
        A_M_CS: process.env.A_M_CS ?? null,
        A_M_CID: process.env.A_M_CID ?? null,
        /* BikeTag Configuration */
        GAME_NAME: process.env.GAME_NAME ?? 'null',
        GAME_SOURCE: process.env.GAME_SOURCE ?? null,
        HOST: process.env.HOST ?? 'biketag.org',
        HOST_KEY: process.env.HOST_KEY ?? 'BikeTagAdminPlatform',
        /* Imgur Admin Configuration */
        IA_CID: process.env.IA_CID ?? null,
        IA_CSECRET: process.env.IA_CSECRET ?? null,
        IA_RTOKEN: process.env.IA_RTOKEN ?? null,
        IA_TOKEN: process.env.IA_TOKEN ?? null,
        /* Imgur Configuration */
        I_CID: process.env.I_CID ?? null,
        I_CSECRET: process.env.I_CSECRET ?? null,
        I_RTOKEN: process.env.I_RTOKEN ?? null,
        I_TOKEN: process.env.I_TOKEN ?? null,
        /* Sanity Admin Configuration */
        SA_CDN_URL: process.env.SA_CDN_URL ?? 'https://cdn.sanity.io/images/',
        SA_DSET: process.env.SA_DSET ?? null,
        SA_PID: process.env.SA_PID ?? null,
        SA_TOKEN: process.env.SA_TOKEN ?? null,
        /* Sanity Configuration */
        S_CURL: process.env.S_CURL ?? 'https://cdn.sanity.io/images/',
        S_DSET: process.env.S_DSET ?? null,
        S_PID: process.env.S_PID ?? null,
        S_TOKEN: process.env.S_TOKEN ?? null,
        /* Google Configuration */
        G_AKEY: process.env.G_AKEY ?? null
      }
    },
    plugins: [
      // Vue3
      vue({
        template: {
          // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin#image-loading
          transformAssetUrls
        },
        include: [/\.vue$/, /\.md$/]
      }),
      Markdown(),
      // Vuetify Loader
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin#vite-plugin-vuetify
      vuetify({
        autoImport: true,
        styles: { configFile: 'src/styles/settings.scss' }
      }),
      WindiCSS(),
      // vite-plugin-checker
      // https://github.com/fi3ework/vite-plugin-checker
      checker({
        typescript: true,
        vueTsc: true,
        eslint: {
          lintCommand:
            'eslint . --fix --cache --cache-location ./node_modules/.vite/vite-plugin-eslint' // for example, lint .ts & .tsx
        }
      })
    ],
    // https://vitejs.dev/config/server-options.html
    server: {
      host: 'localhost',
      port: 8000,
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..']
      }
    },
    preview: {
      port: 80
    },
    // Resolver
    resolve: {
      // https://vitejs.dev/config/shared-options.html#resolve-alias
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': fileURLToPath(new URL('./node_modules', import.meta.url))
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
    },
    // Build Options
    // https://vitejs.dev/config/build-options.html
    build: {
      // Build Target
      // https://vitejs.dev/config/build-options.html#build-target
      target: 'esnext',
      // Minify option
      // https://vitejs.dev/config/build-options.html#build-minify
      minify: 'esbuild',
      // Rollup Options
      // https://vitejs.dev/config/build-options.html#build-rollupoptions
      rollupOptions: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        output: {
          manualChunks: {
            // Split external library from transpiled code.
            vue: ['vue', 'vue-router', 'pinia', 'pinia-plugin-persistedstate'],
            vuetify: [
              'vuetify',
              'vuetify/components',
              'vuetify/directives',
              'webfontloader'
            ],
            materialdesignicons: ['@mdi/font/css/materialdesignicons.css']
          },
          plugins: [
            mode === 'analyze'
              ? visualizer({
                  open: true,
                  filename: 'dist/stats.html'
                })
              : undefined
            /*
            // if you use Code encryption by rollup-plugin-obfuscator
            // https://github.com/getkey/rollup-plugin-obfuscator
            obfuscator({
              globalOptions: {
                debugProtection: true,
              },
            }),
            */
          ]
        }
      }
    },
    esbuild: {
      // Drop console when production build.
      drop: command === 'serve' ? [] : ['console']
    }
  }

  // Write meta data.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pack = require('./package.json')
  fs.writeFileSync(
    fileURLToPath(new URL('./src/Meta.ts', import.meta.url)),
    `import type MetaInterface from '@/interfaces/MetaInterface';

// This file is auto-generated by the build system.
const meta: MetaInterface = {
  version: '${pack.version}',
  date: '${new Date().toISOString()}',
};
export default meta;
`
  )

  return config
})
