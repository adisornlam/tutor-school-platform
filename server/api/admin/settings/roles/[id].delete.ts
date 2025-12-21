import { requireAuth } from '../../../../utils/auth.middleware'
import { execute, query } from '../../../../utils/db'
import { getUserRoles } from '../../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

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

  try {
    const existing = await query('SELECT id, name FROM roles WHERE id = ?', [roleId])
    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Role not found'
      })
    }

    const roleName = (existing[0] as { name: string }).name

    // Prevent deletion of system roles
    const systemRoles = ['system_admin', 'owner', 'admin', 'branch_admin', 'tutor', 'parent', 'student']
    if (systemRoles.includes(roleName)) {
      throw createError({
        statusCode: 400,
        message: 'Cannot delete system role'
      })
    }

    // Check if role is being used in user_roles
    const usage = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM user_roles WHERE role_id = ?',
      [roleId]
    )
    if (usage[0]?.count > 0) {
      throw createError({
        statusCode: 400,
        message: 'Cannot delete role. It is being used by users.'
      })
    }

    await execute('DELETE FROM roles WHERE id = ?', [roleId])

    return {
      success: true,
      message: 'Role deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      message: 'Failed to delete role'
    })
  }
})

