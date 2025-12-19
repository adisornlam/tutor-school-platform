import type { UserWithRoles } from '../../shared/types/user.types'
import { UserRole } from '../../shared/types/user.types'

/**
 * Get redirect path based on user role
 */
export function getRedirectPathByRole(user: UserWithRoles | null, redirect?: string | null): string {
  // If redirect query param exists, use it
  if (redirect) {
    return redirect
  }

  if (!user || !user.roles || user.roles.length === 0) {
    return '/my-courses'
  }

  // System Admin or Owner → Admin Dashboard
  if (user.roles.includes(UserRole.SYSTEM_ADMIN) || user.roles.includes(UserRole.OWNER)) {
    return '/admin'
  }

  // Branch Admin → Admin Dashboard (same layout, menu will be filtered by role)
  if (user.roles.includes(UserRole.BRANCH_ADMIN)) {
    return '/admin'
  }

  // Tutor → Admin Dashboard (same layout, menu will be filtered by role)
  if (user.roles.includes(UserRole.TUTOR)) {
    return '/admin'
  }

  // Student or Parent → My Courses
  return '/my-courses'
}

/**
 * Check if user is admin (system_admin, owner, or branch_admin)
 */
export function isAdmin(user: UserWithRoles | null): boolean {
  if (!user || !user.roles) return false
  const adminRoles: UserRole[] = [UserRole.SYSTEM_ADMIN, UserRole.OWNER, UserRole.BRANCH_ADMIN]
  return user.roles.some((role: UserRole) => 
    adminRoles.includes(role)
  )
}

/**
 * Check if user is student or parent
 */
export function isStudentOrParent(user: UserWithRoles | null): boolean {
  if (!user || !user.roles) return false
  const studentRoles: UserRole[] = [UserRole.STUDENT, UserRole.PARENT]
  return user.roles.some((role: UserRole) => 
    studentRoles.includes(role)
  )
}

