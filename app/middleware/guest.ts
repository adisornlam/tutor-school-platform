import { getRedirectPathByRole } from '~/utils/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, fetchUser, user } = useAuth()
  
  // Try to fetch user if not already loaded
  if (!isAuthenticated.value) {
    await fetchUser()
  }

  // If authenticated, redirect to dashboard based on role
  if (isAuthenticated.value) {
    const redirect = to.query.redirect as string
    const redirectPath = getRedirectPathByRole(user.value, redirect)
    return navigateTo(redirectPath)
  }
})

