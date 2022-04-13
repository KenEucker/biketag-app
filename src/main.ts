import App from './App.vue'
import { createApp } from 'vue'
import router from './router'
import { createHead } from '@vueuse/head'
import { store } from './store'
import { createPinia } from 'pinia'
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
import './theme/main.scss'

const head = createHead()
const app = createApp(App)

app.use(IonicVue)
app.use(store)
app.use(router)
app.use(head)
app.use(createPinia())

app.mount('#app')
