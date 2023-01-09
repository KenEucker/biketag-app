import { authGuard } from '@auth0/auth0-vue'
const useAuthGuard =
  process.env.AUTH0_DOMAIN && process.env.AUTH0_CID ? authGuard : undefined

export default useAuthGuard
