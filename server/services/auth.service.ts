import bcrypt from 'bcryptjs'
import { query, queryOne, execute } from '../utils/db'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'
import type { User, UserWithRoles, LoginCredentials, RegisterData, PublicUser } from '../../shared/types/user.types'
import { UserRole, UserStatus } from '../../shared/types/user.types'

export async function findUserByEmail(email: string): Promise<User | null> {
  return queryOne<User>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  )
}

export async function findUserByIdentifier(identifier: string): Promise<User | null> {
  // Support both username and email for login
  return queryOne<User>(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [identifier, identifier]
  )
}

export async function findUserById(id: number): Promise<User | null> {
  return queryOne<User>(
    'SELECT * FROM users WHERE id = ?',
    [id]
  )
}

export async function getUserRoles(userId: number): Promise<UserRole[]> {
  const roles = await query<{ name: string }>(
    `SELECT r.name 
     FROM user_roles ur
     JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = ?`,
    [userId]
  )
  return roles.map(r => r.name as UserRole)
}

export async function getUserWithRoles(userId: number): Promise<UserWithRoles | null> {
  const user = await findUserById(userId)
  if (!user) return null
  
  const roles = await getUserRoles(userId)
  
  // Remove sensitive fields (password_hash)
  const { password_hash, ...publicUser } = user
  return { ...publicUser, roles }
}

export async function createUser(data: RegisterData): Promise<User> {
  const passwordHash = await bcrypt.hash(data.password, 12)
  
  const result = await execute(
    `INSERT INTO users (username, email, password_hash, first_name, last_name, phone, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.username,
      data.email || null,
      passwordHash,
      data.first_name,
      data.last_name,
      data.phone || null,
      UserStatus.ACTIVE
    ]
  )
  
  // Assign student role by default
  const studentRole = await queryOne<{ id: number }>(
    'SELECT id FROM roles WHERE name = ?',
    [UserRole.STUDENT]
  )
  
  if (studentRole) {
    await execute(
      'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
      [result.insertId, studentRole.id]
    )
  }
  
  const user = await findUserById(result.insertId)
  if (!user) throw createError({ statusCode: 500, message: 'Failed to create user' })
  
  return user
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function login(credentials: LoginCredentials) {
  console.log('[Auth Service] Finding user by identifier:', credentials.username)
  const user = await findUserByIdentifier(credentials.username)
  
  if (!user) {
    console.log('[Auth Service] User not found:', credentials.username)
    throw createError({
      statusCode: 401,
      message: 'Invalid username or password'
    })
  }
  
  console.log('[Auth Service] User found:', user.id, user.username, user.status)
  
  if (user.status !== UserStatus.ACTIVE) {
    console.log('[Auth Service] Account is not active:', user.status)
    throw createError({
      statusCode: 403,
      message: 'Account is not active'
    })
  }
  
  // Get password hash from database
  console.log('[Auth Service] Getting password hash for user:', user.id)
  const userWithPassword = await queryOne<{ password_hash: string }>(
    'SELECT password_hash FROM users WHERE id = ?',
    [user.id]
  )
  
  if (!userWithPassword) {
    console.log('[Auth Service] Password hash not found for user:', user.id)
    throw createError({
      statusCode: 401,
      message: 'Invalid username or password'
    })
  }
  
  console.log('[Auth Service] Verifying password...')
  const isValid = await verifyPassword(credentials.password, userWithPassword.password_hash)
  
  if (!isValid) {
    console.log('[Auth Service] Password verification failed')
    throw createError({
      statusCode: 401,
      message: 'Invalid username or password'
    })
  }
  
  console.log('[Auth Service] Password verified successfully')
  
  const userWithRoles = await getUserWithRoles(user.id)
  if (!userWithRoles) {
    throw createError({
      statusCode: 500,
      message: 'Failed to get user roles'
    })
  }
  
  const accessToken = generateAccessToken(userWithRoles)
  const refreshToken = generateRefreshToken(user.id)
  
  // Store refresh token
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days
  
  await execute(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES (?, ?, ?)`,
    [user.id, refreshToken, expiresAt]
  )
  
  return {
    user: userWithRoles,
    accessToken,
    refreshToken
  }
}

