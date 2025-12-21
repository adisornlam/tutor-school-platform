export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, fetchUser, hasAnyRole, user } = useAuth()
  
  // Check authentication - try to fetch user first
  if (!isAuthenticated.value) {
    await fetchUser()
    // Wait a bit for state to update
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Check again after fetch
  if (!isAuthenticated.value) {
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  // Check admin role (including tutor since they use the same admin layout)
  const { UserRole } = await import('../../shared/types/user.types')
  const adminRoles: (UserRole | string)[] = [
    UserRole.SYSTEM_ADMIN, 
    UserRole.OWNER,
    UserRole.ADMIN, // Admin กลาง
    UserRole.BRANCH_ADMIN,
    UserRole.TUTOR // Tutors also use admin layout
  ]
  if (!hasAnyRole(adminRoles)) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Admin role required.'
    })
  }
})

