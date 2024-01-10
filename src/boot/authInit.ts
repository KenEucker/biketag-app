import { boot } from 'quasar/wrappers'

import { Auth0Plugin, createAuth0 } from '@auth0/auth0-vue'
import { Plugin } from 'vue'

let auth0: Auth0Plugin | null | Plugin = null

async function createAuth() {
  const CALLBACK_URI = window.location.origin
  auth0 = createAuth0({
    domain: process.env.A_DOMAIN as string,
    clientId: process.env.A_CID as string,
    authorizationParams: {
      redirect_uri: CALLBACK_URI,
    },
  })

  return auth0
}

export default boot(({ app }) => {
  createAuth()
  app.config.globalProperties.$auth = auth0
  app.use(auth0 as Plugin)
})

export { createAuth }
