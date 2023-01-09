// Load vue core
import { createApp } from 'vue'
import router from './router'
import store from './store'
import auth from './auth'

// Load Vuetify
import vuetify from './plugins/vuetify'

/// Load Styles
import './styles/base.scss'

// Load Layout vue.
import App from './App.vue'

/** Register Vue */
const app = createApp(App)

// Register Auth
if (auth) {
  console.info('Registering Authentication Module')
  app.use(auth)
}

// Register Core
app.use(router)
app.use(store)

// Register Components
app.use(vuetify)

// Run!
router.isReady().then(() => {
  app.mount('#app')
})
