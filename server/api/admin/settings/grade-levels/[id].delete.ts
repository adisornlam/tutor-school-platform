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

  const gradeLevelId = parseInt(getRouterParam(event, 'id') || '0')
  if (!gradeLevelId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid grade level ID'
    })
  }

  try {
    const existing = await query('SELECT id FROM grade_levels WHERE id = ?', [gradeLevelId])
    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Grade level not found'
      })
    }

    // Check if grade level is being used in course_grade_levels
    const usage = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM course_grade_levels WHERE grade_level_id = ?',
      [gradeLevelId]
    )
    if (usage[0]?.count > 0) {
      throw createError({
        statusCode: 400,
        message: 'Cannot delete grade level. It is being used in courses.'
      })
    }

    await execute('DELETE FROM grade_levels WHERE id = ?', [gradeLevelId])

    return {
      success: true,
      message: 'Grade level deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw createError({
        statusCode: 400,
        message: 'Grade levels table does not exist. Please run migration first.'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to delete grade level'
    })
  }
})

