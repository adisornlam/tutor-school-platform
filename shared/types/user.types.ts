export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export enum UserRole {
  STUDENT = 'student',
  TUTOR = 'tutor',
  PARENT = 'parent',
  BRANCH_ADMIN = 'branch_admin',
  ADMIN = 'admin', // Admin กลาง - สามารถจัดการได้ทั้ง 2 สาขา
  OWNER = 'owner',
  SYSTEM_ADMIN = 'system_admin'
}

// Role hierarchy - lower number = higher priority
export const ROLE_PRIORITY: Record<UserRole, number> = {
  [UserRole.SYSTEM_ADMIN]: 1,
  [UserRole.OWNER]: 2,
  [UserRole.ADMIN]: 3,
  [UserRole.BRANCH_ADMIN]: 4,
  [UserRole.TUTOR]: 5,
  [UserRole.PARENT]: 6,
  [UserRole.STUDENT]: 7
}

/**
 * Get the highest priority role from user's roles
 */
export function getHighestPriorityRole(roles: UserRole[]): UserRole | null {
  if (!roles || roles.length === 0) return null
  
  return roles.reduce((highest, role) => {
    const currentPriority = ROLE_PRIORITY[role] || 999
    const highestPriority = ROLE_PRIORITY[highest] || 999
    return currentPriority < highestPriority ? role : highest
  })
}

/**
 * Check if user has a role with priority equal or higher than the specified role
 */
export function hasRoleOrHigher(userRoles: UserRole[], minRole: UserRole): boolean {
  if (!userRoles || userRoles.length === 0) return false
  
  const minPriority = ROLE_PRIORITY[minRole] || 999
  return userRoles.some(role => {
    const rolePriority = ROLE_PRIORITY[role] || 999
    return rolePriority <= minPriority
  })
}

// Internal user type (includes password_hash - never return to client)
export interface User {
  id: number
  username: string
  email: string | null
  password_hash: string
  first_name: string
  last_name: string
  phone?: string
  avatar_url?: string
  status: UserStatus
  email_verified_at?: Date
  created_at: Date
  updated_at: Date
}

// Public user type (without sensitive fields)
export interface PublicUser {
  id: number
  username: string
  email: string | null
  first_name: string
  last_name: string
  phone?: string
  avatar_url?: string
  status: UserStatus
  email_verified_at?: Date
  created_at: Date
  updated_at: Date
}

// User with roles (public version - no password_hash)
export interface UserWithRoles extends PublicUser {
  roles: UserRole[]
}

export interface LoginCredentials {
  username: string // Can be username or email
  password: string
}

export interface RegisterData {
  username: string
  email?: string | null
  password: string
  first_name: string
  last_name: string
  phone?: string
  role?: UserRole // Optional role for registration (student or parent)
}

export interface AuthResponse {
  user: UserWithRoles
  accessToken: string
  refreshToken: string
}

