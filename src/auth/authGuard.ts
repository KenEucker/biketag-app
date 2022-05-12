import { getInstance } from './authWrapper'

export const authGuard = (
  to: { fullPath: string },
  from: any,
  next: (arg0?: boolean) => any
) => {
  const authService = getInstance()

  const fn = () => {
    if (authService.isAuthenticated) {
      return next()
    }

    authService.loginWithRedirect(to.fullPath.includes("http://") ? to.fullPath : window.location.origin)
    return next(false)
  }

  if (!authService.loading) {
    return fn()
  }

  authService.$watch('loading', (loading: boolean) => {
    if (loading === false) {
      return fn()
    }

    return next(false)
  })
}
