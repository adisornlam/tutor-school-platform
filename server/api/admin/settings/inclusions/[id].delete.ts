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

  const inclusionId = parseInt(getRouterParam(event, 'id') || '0')
  if (!inclusionId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid inclusion ID'
    })
  }

  try {
    const existing = await query('SELECT id FROM inclusions WHERE id = ?', [inclusionId])
    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Inclusion not found'
      })
    }

    // Check if inclusion is being used in course_inclusions
    const usage = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM course_inclusions WHERE inclusion_id = ?',
      [inclusionId]
    )
    if (usage[0]?.count > 0) {
      throw createError({
        statusCode: 400,
        message: 'Cannot delete inclusion. It is being used in courses.'
      })
    }

    await execute('DELETE FROM inclusions WHERE id = ?', [inclusionId])

    return {
      success: true,
      message: 'Inclusion deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw createError({
        statusCode: 400,
        message: 'Inclusions table does not exist. Please run migration first.'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to delete inclusion'
    })
  }
})

