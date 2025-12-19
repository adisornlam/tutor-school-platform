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
  SYSTEM_ADMIN = 'system_admin',
  OWNER = 'owner'
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
}

export interface AuthResponse {
  user: UserWithRoles
  accessToken: string
  refreshToken: string
}

