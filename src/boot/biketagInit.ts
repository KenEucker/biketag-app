import { boot } from 'quasar/wrappers'

import { createBikeTag, useBikeTagStore } from 'biketag-vue'
import { createBikeTagAdmin, useBikeTagAdminStore } from 'biketag-admin'

export default boot(({ app }) => {
  app.use(createBikeTag()).use(createBikeTagAdmin())
})

export {
  createBikeTag,
  useBikeTagStore,
  createBikeTagAdmin,
  useBikeTagAdminStore,
}

/// TODO: DOCUMENT WHAT NEEDS TO BE COMPLETED FOR QUASAR
/// Resolve triple/quadra reloads upon new update (only dev?)
/// Integrate the authGuard for protected routes (see commented out code)
/// Implement a splash screen for the app
