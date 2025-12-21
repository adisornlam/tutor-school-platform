import { createUser, getUserWithRoles } from '../../services/auth.service'
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt'
import type { RegisterData } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const body = await readBody<RegisterData>(event)
  
  // Validation
  if (!body.username || !body.password || !body.first_name || !body.last_name) {
    throw createError({
      statusCode: 400,
      message: 'Username, password, first name, and last name are required'
    })
  }
  
  // Check if username exists
  const { findUserByIdentifier } = await import('../../services/auth.service')
  const existingUser = await findUserByIdentifier(body.username)
  
  if (existingUser) {
    throw createError({
      statusCode: 409,
      message: 'Username already registered'
    })
  }
  
  // Check if email exists (if provided)
  if (body.email) {
    const { findUserByEmail } = await import('../../services/auth.service')
    const existingEmailUser = await findUserByEmail(body.email)
    
    if (existingEmailUser) {
      throw createError({
        statusCode: 409,
        message: 'Email already registered'
      })
    }
  }
  
  // Create user
  const user = await createUser(body)
  
  // Assign role if provided (parent or student)
  if (body.role) {
    const { queryOne, execute } = await import('../../utils/db')
    const roleRecord = await queryOne<{ id: number }>(
      'SELECT id FROM roles WHERE name = ?',
      [body.role]
    )
    
    if (roleRecord) {
      // Remove default student role first
      await execute(
        'DELETE FROM user_roles WHERE user_id = ?',
        [user.id]
      )
      
      // Assign the specified role
      await execute(
        'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
        [user.id, roleRecord.id]
      )
    }
  }
  
  const userWithRoles = await getUserWithRoles(user.id)
  
  if (!userWithRoles) {
    throw createError({
      statusCode: 500,
      message: 'Failed to create user'
    })
  }
  
  const accessToken = generateAccessToken(userWithRoles)
  const refreshToken = generateRefreshToken(user.id)
  
  // Store refresh token
  const { execute } = await import('../../utils/db')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)
  
  await execute(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES (?, ?, ?)`,
    [user.id, refreshToken, expiresAt]
  )
  
  // Set cookies
  setCookie(event, 'access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60
  })
  
  setCookie(event, 'refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60
  })
  
  return {
    success: true,
    data: {
      user: userWithRoles,
      accessToken
    }
  }
})

