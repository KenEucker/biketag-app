import { createAuth0 } from '@auth0/auth0-vue'
import { authGuard } from '@auth0/auth0-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

export const useAuthGuard = process.env.AUTH0_DOMAIN && process.env.AUTH0_CID ? authGuard : undefined

export const auth: any =
    process.env.AUTH0_DOMAIN && process.env.AUTH0_CID
        ? createAuth0({
            domain: process.env.A_DOMAIN ?? '',
            client_id: process.env.A_CID ?? '',
            audience: process.env.A_AUDIENCE,
            onRedirectCallback: (appState: any) => {
                router.push(
                    appState && appState.targetUrl
                        ? appState.targetUrl
                        : window.location.pathname
                )
            },
            redirect_uri: window.location.origin,
            useRefreshTokens: true,
        })
        : {}

if (process.env.AUTH0_DOMAIN && process.env.AUTH0_CID) {
    auth.initialized = true
}