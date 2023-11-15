import App from './App.vue'
import { createApp } from 'vue'
import router from './router'
import { createHead } from '@vueuse/head'
import { store } from './store'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'
import VueToast from 'vue-toast-notification'
import VueGoogleMaps from 'vue-google-maps-community-fork'
import Markdown from 'vue3-markdown-it'
import './assets/index.postcss'
// import './index.css'

import { IonicVue } from '@ionic/vue'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

/* Theme */
import 'vue-toast-notification/dist/theme-sugar.css'
import './theme/main.scss'




const head = createHead()
const app = createApp(App)

app.use(IonicVue)
app.use(store)
app.use(router)
app.use(head)
app.use(createPinia())
app.use(createAuth0({
  domain: process.env.A_DOMAIN as string,
  clientId: process.env.A_CID as string,
  // onRedirectCallback: (appState: any) => {
  //   router.push(
  //     appState && appState.targetUrl
  //       ? appState.targetUrl
  //       : window.location.pathname
  //   )
  // },
}))
app.use(VueToast)
app.use(Markdown)
app.use(VueGoogleMaps, {
  load: {
    key: process.env.G_AKEY,
  },
})
app.provide('toast', app.config.globalProperties.$toast)
app.provide('auth', app.config.globalProperties.$auth)

app.mount('#app')
