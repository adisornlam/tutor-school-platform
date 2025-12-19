import { requireAuth } from '../../../utils/auth.middleware'
import { getUserRoles, getUserWithRoles } from '../../../services/auth.service'
import { findUserByIdentifier, findUserByEmail } from '../../../services/auth.service'
import { query, execute } from '../../../utils/db'
import bcrypt from 'bcryptjs'
import type { UserRole } from '../../../../shared/types/user.types'

interface UpdateUserBody {
  username?: string
  email?: string | null
  password?: string
  first_name?: string
  last_name?: string
  phone?: string | null
  roles?: string[]
}

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  // Check if user has admin role (system_admin, owner, branch_admin)
  const roles = await getUserRoles(auth.userId)
  const adminRoles: UserRole[] = ['system_admin', 'owner', 'branch_admin']
  if (!roles.some(role => adminRoles.includes(role as UserRole))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Admin role required.'
    })
  }

  const userId = parseInt(getRouterParam(event, 'id') || '0')
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid user ID'
    })
  }

  const body = await readBody<UpdateUserBody>(event)

  // Get existing user
  const { findUserById } = await import('../../../services/auth.service')
  const existingUser = await findUserById(userId)
  if (!existingUser) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    })
  }

  // Check if username is being changed and already exists
  if (body.username && body.username !== existingUser.username) {
    const usernameUser = await findUserByIdentifier(body.username)
    if (usernameUser && usernameUser.id !== userId) {
      throw createError({
        statusCode: 409,
        message: 'Username already exists'
      })
    }
  }

  // Check if email is being changed and already exists
  if (body.email !== undefined && body.email !== existingUser.email) {
    if (body.email) {
      const emailUser = await findUserByEmail(body.email)
      if (emailUser && emailUser.id !== userId) {
        throw createError({
          statusCode: 409,
          message: 'Email already exists'
        })
      }
    }
  }

  // Build update query
  const updateFields: string[] = []
  const updateValues: any[] = []

  if (body.username !== undefined) {
    updateFields.push('username = ?')
    updateValues.push(body.username)
  }
  if (body.email !== undefined) {
    updateFields.push('email = ?')
    updateValues.push(body.email)
  }
  if (body.password) {
    const passwordHash = await bcrypt.hash(body.password, 12)
    updateFields.push('password_hash = ?')
    updateValues.push(passwordHash)
  }
  if (body.first_name !== undefined) {
    updateFields.push('first_name = ?')
    updateValues.push(body.first_name)
  }
  if (body.last_name !== undefined) {
    updateFields.push('last_name = ?')
    updateValues.push(body.last_name)
  }
  if (body.phone !== undefined) {
    updateFields.push('phone = ?')
    updateValues.push(body.phone)
  }

  // Update user if there are fields to update
  if (updateFields.length > 0) {
    updateValues.push(userId)
    await execute(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      updateValues
    )
  }

  // Update roles if provided
  if (body.roles !== undefined) {
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

    // Remove existing roles
    await execute('DELETE FROM user_roles WHERE user_id = ?', [userId])

    // Assign new roles
    for (const role of validRoles) {
      await execute(
        'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
        [userId, role.id]
      )
    }
  }

  // Get updated user with roles
  const user = await getUserWithRoles(userId)
  if (!user) {
    throw createError({
      statusCode: 500,
      message: 'Failed to get updated user'
    })
  }

  return {
    success: true,
    data: user,
    message: 'User updated successfully'
  }
})

