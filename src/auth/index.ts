import { createAuth0 } from '@auth0/auth0-vue'

export const auth =
  process.env.A_DOMAIN && process.env.A_CID
    ? createAuth0({
        domain: process.env.A_DOMAIN ?? '',
        audience: process.env.A_AUDIENCE ?? '',
        client_id: process.env.A_CID ?? '',
        redirect_uri: window.location.origin,
        useRefreshTokens: true
      })
    : undefined

export default auth
