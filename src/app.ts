// Load vue core
import { createApp } from 'vue'
import router from './router'
import store from './store'
import auth from './auth'

// Load Components
import Vuetify from './plugins/vuetify'
// import VueToast from 'vue-toast-notification'
// import VueGoogleMaps from '@fawmi/vue-google-maps'

/// Load Styles
import './styles/base.scss'

// Load Layout vue.
import App from './App.vue'

/** Register Vue */
const app = createApp(App)

// Register Auth
if (auth) {
  console.info('Registering Auth0 Plugin')
  app.use(auth)
}

// Register Core
app.use(router)
app.use(store)

// Register Components
app.use(Vuetify)
// app.use(VueToast)

// Google Maps
if (process.env.G_AKEY) {
  console.info('Registering GoogleMaps Plugin')
  // app.use(VueGoogleMaps, {
  //   load: {
  //     key: process.env.G_AKEY
  //   }
  // })
}

/// Provide
app.provide('toast', app.config.globalProperties.$toast)
app.provide('auth', app.config.globalProperties.$auth)

// Run!
router.isReady().then(() => {
  app.mount('#app')
})
