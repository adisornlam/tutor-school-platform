import { requireAuth } from '../../../utils/auth.middleware'
import { execute, query } from '../../../utils/db'
import { getUserRoles } from '../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface CreateRoleBody {
  name: string
  description?: string | null
}

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  const roles = await getUserRoles(auth.userId)
  const allowedRoles: UserRole[] = ['system_admin', 'owner']
  if (!roles.some(role => allowedRoles.includes(role as UserRole))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. System Admin or Owner role required.'
    })
  }

  const body = await readBody<CreateRoleBody>()

  if (!body.name) {
    throw createError({
      statusCode: 400,
      message: 'Name is required'
    })
  }

  try {
    const existing = await query<{ id: number }>(
      'SELECT id FROM roles WHERE name = ?',
      [body.name]
    )

    if (existing.length > 0) {
      throw createError({
        statusCode: 409,
        message: 'Role name already exists'
      })
    }

    const result = await execute(
      `INSERT INTO roles (name, description)
       VALUES (?, ?)`,
      [
        body.name,
        body.description || null
      ]
    )

    const roles = await query(
      'SELECT * FROM roles WHERE id = ?',
      [result.insertId]
    )

    return {
      success: true,
      data: roles[0],
      message: 'Role created successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      message: 'Failed to create role'
    })
  }
})

