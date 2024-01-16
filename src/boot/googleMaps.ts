import { boot } from 'quasar/wrappers'
import VueGoogleMaps from 'vue-google-maps-community-fork'

export default boot(({ app }) => {
  app.use(VueGoogleMaps, {
    load: {
      key: process.env.G_AKEY,
    },
  })
})
