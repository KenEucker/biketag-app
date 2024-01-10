import { boot } from 'quasar/wrappers'

import { createBikeTag } from 'biketag-vue'

export default boot(({ app }) => {
  app.use(createBikeTag())
})

export { createBikeTag }
