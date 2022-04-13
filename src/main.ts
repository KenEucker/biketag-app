import App from './App.vue'
import { createApp } from 'vue'
import router from './router'
import { createHead } from '@vueuse/head'
import { store } from './store'
import { createPinia } from 'pinia'
import './assets/index.postcss'
// import './index.css'

const head = createHead()
const app = createApp(App)

app.use(store)
app.use(router)
app.use(head)
app.use(createPinia())

app.mount('#app')
