import { requireAuth } from '../../utils/auth.middleware'
import { getUserRoles } from '../../services/auth.service'
import { createUser, findUserByIdentifier, findUserByEmail } from '../../services/auth.service'
import { query, execute } from '../../utils/db'
import bcrypt from 'bcryptjs'
import type { UserRole } from '../../../shared/types/user.types'

interface CreateUserBody {
  username: string
  email?: string | null
  password: string
  first_name: string
  last_name: string
  phone?: string | null
  roles: string[]
}

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  // Check if user has admin role
  const roles = await getUserRoles(auth.userId)
  const adminRoles: UserRole[] = ['system_admin', 'owner']
  if (!roles.some(role => adminRoles.includes(role as UserRole))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. System Admin or Owner role required.'
    })
  }

  const body = await readBody<CreateUserBody>(event)

  // Validation
  if (!body.username || !body.password || !body.first_name || !body.last_name) {
    throw createError({
      statusCode: 400,
      message: 'Username, password, first name, and last name are required'
    })
  }

  if (!body.roles || body.roles.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'At least one role is required'
    })
  }

  // Check if username exists
  const existingUser = await findUserByIdentifier(body.username)
  if (existingUser) {
    throw createError({
      statusCode: 409,
      message: 'Username already exists'
    })
  }

  // Check if email exists (if provided)
  if (body.email) {
    const existingEmailUser = await findUserByEmail(body.email)
    if (existingEmailUser) {
      throw createError({
        statusCode: 409,
        message: 'Email already exists'
      })
    }
  }

    // Validate roles
    const validRoles = await query<{ id: number; name: string }>(
      'SELECT id, name FROM roles WHERE name IN (?)',
      [body.roles]
    )

  if (validRoles.length !== body.roles.length) {
    throw createError({
      statusCode: 400,
      message: 'Invalid role(s) provided'
    })
  }

  // Create user
  const passwordHash = await bcrypt.hash(body.password, 12)
  
  const result = await execute(
    `INSERT INTO users (username, email, password_hash, first_name, last_name, phone, status)
     VALUES (?, ?, ?, ?, ?, ?, 'active')`,
    [
      body.username,
      body.email || null,
      passwordHash,
      body.first_name,
      body.last_name,
      body.phone || null
    ]
  )

  const userId = result.insertId

  // Assign roles
  for (const role of validRoles) {
    await execute(
      'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
      [userId, role.id]
    )
  }

  // Get created user with roles
  const { getUserWithRoles } = await import('../../services/auth.service')
  const user = await getUserWithRoles(userId)

  if (!user) {
    throw createError({
      statusCode: 500,
      message: 'Failed to create user'
    })
  }

  return {
    success: true,
    data: user,
    message: 'User created successfully'
  }
})

