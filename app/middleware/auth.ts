export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, fetchUser } = useAuth()
  
  // Try to fetch user if not already loaded
  if (!isAuthenticated.value) {
    await fetchUser()
  }

  // If still not authenticated, redirect to login
  if (!isAuthenticated.value) {
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})

