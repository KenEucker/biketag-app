/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

const { configure } = require('quasar/wrappers');

module.exports = configure(function (/* ctx */) {
  return {
    eslint: {
      // fix: true,
      // include: [],
      // exclude: [],
      // rawOptions: {},
      warnings: true,
      errors: true,
    },

    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: ['axios', 'createAuth0'],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: ['app.scss', 'tailwind.css'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
      'material-icons-outlined',
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node16',
      },

      vueRouterMode: 'hash', // available values: 'hash', 'history'
      // vueRouterBase,
      // vueDevtools,
      // vueOptionsAPI: false,

      // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

      // publicPath: '/',
      // analyze: true,
      // env: {},
      env: {
        ACCESS_TOKEN:
          process.env.ACCESS_TOKEN ?? '8b4e2b86a724bf3f39d6766de6e67212',
        CONTEXT: process.env.CONTEXT ?? null,
        APP_ID: process.env.APP_ID ?? 'com.app.biketag',
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
        HOST: process.env.HOST ?? 'biketag.io',
        HOST_KEY: process.env.HOST_KEY ?? 'ItsABikeTagGame',
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
        /* Reddit Configuration */
        R_CID: process.env.R_CID ?? null,
        R_CSECRET: process.env.R_CSECRET ?? null,
        R_UNAME: process.env.R_UNAME ?? null,
        R_PASS: process.env.R_PASS ?? null,
        RA_SUB: process.env.RA_SUB ?? 'biketag',
        /* Reddit Admin Configuration */
        RA_CID: process.env.RA_CID ?? null,
        RA_CSECRET: process.env.RA_CSECRET ?? null,
        RA_UNAME: process.env.RA_UNAME ?? null,
        RA_PASS: process.env.RA_PASS ?? null,
        /* Google Configuration */
        G_AKEY: process.env.G_AKEY ?? null,
        ...require('dotenv').config().parsed,
      },
      // rawDefine: {}
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      // distDir

      // extendViteConf (viteConf) {},
      // viteVuePluginOptions: {},

      // vitePlugins: [
      //   [ 'package-name', { ..options.. } ]
      // ]
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      // https: true,
      port: 8080,
      open: true, // opens browser window automatically
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {},

      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: [],
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#sourcefiles
    // sourceFiles: {
    //   rootComponent: 'src/App.vue',
    //   router: 'src/router/index',
    //   store: 'src/store/index',
    //   registerServiceWorker: 'src-pwa/register-service-worker',
    //   serviceWorker: 'src-pwa/custom-service-worker',
    //   pwaManifestFile: 'src-pwa/manifest.json',
    //   electronMain: 'src-electron/electron-main',
    //   electronPreload: 'src-electron/electron-preload'
    // },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      // ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
      // will mess up SSR

      // extendSSRWebserverConf (esbuildConf) {},
      // extendPackageJson (json) {},

      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      middlewares: [
        'render', // keep this as last one
      ],
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'generateSW', // or 'injectManifest'
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
      // useFilenameHashes: true,
      // extendGenerateSWOptions (cfg) {}
      // extendInjectManifestOptions (cfg) {},
      // extendManifestJson (json) {}
      // extendPWACustomSWConf (esbuildConf) {}
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      // extendElectronMainConf (esbuildConf)
      // extendElectronPreloadConf (esbuildConf)

      inspectPort: 5858,

      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'biketag-app',
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      contentScripts: ['my-content-script'],

      // extendBexScriptsConf (esbuildConf) {}
      // extendBexManifestJson (json) {}
    },
  };
});
