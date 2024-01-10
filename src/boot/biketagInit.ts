import { boot } from 'quasar/wrappers'

import { createBikeTag } from 'biketag-vue'

export default boot(({ app }) => {
  app.use(createBikeTag())
})

export { createBikeTag }

/// TODO: DOCUMENT WHAT NEEDS TO BE COMPLETED FOR QUASAR
/// Resolve triple/quadra reloads upon new update (only dev?)
/// Integrate the authGuard for protected routes (see commented out code)
/// Implement a splash screen for the app
