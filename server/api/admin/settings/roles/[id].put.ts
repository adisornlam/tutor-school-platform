import { requireAuth } from '../../../../utils/auth.middleware'
import { execute, query } from '../../../../utils/db'
import { getUserRoles } from '../../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface UpdateRoleBody {
  name?: string
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

  const roleId = parseInt(getRouterParam(event, 'id') || '0')
  if (!roleId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid role ID'
    })
  }

  const body = await readBody<UpdateRoleBody>()

  try {
    const existing = await query('SELECT id FROM roles WHERE id = ?', [roleId])
    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Role not found'
      })
    }

    if (body.name) {
      const nameCheck = await query<{ id: number }>(
        'SELECT id FROM roles WHERE name = ? AND id != ?',
        [body.name, roleId]
      )
      if (nameCheck.length > 0) {
        throw createError({
          statusCode: 409,
          message: 'Role name already exists'
        })
      }
    }

    const updateFields: string[] = []
    const updateValues: any[] = []

    if (body.name !== undefined) {
      updateFields.push('name = ?')
      updateValues.push(body.name)
    }
    if (body.description !== undefined) {
      updateFields.push('description = ?')
      updateValues.push(body.description)
    }

    if (updateFields.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No fields to update'
      })
    }

    updateValues.push(roleId)
    await execute(
      `UPDATE roles SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    )

    const roles = await query('SELECT * FROM roles WHERE id = ?', [roleId])

    return {
      success: true,
      data: roles[0],
      message: 'Role updated successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      message: 'Failed to update role'
    })
  }
})

