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

  const subjectId = parseInt(getRouterParam(event, 'id') || '0')
  if (!subjectId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid subject ID'
    })
  }

  try {
    const existing = await query('SELECT id FROM subjects WHERE id = ?', [subjectId])
    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Subject not found'
      })
    }

    // Check if subject is being used in course_subjects
    const usage = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM course_subjects WHERE subject_id = ?',
      [subjectId]
    )
    if (usage[0]?.count > 0) {
      throw createError({
        statusCode: 400,
        message: 'Cannot delete subject. It is being used in courses.'
      })
    }

    await execute('DELETE FROM subjects WHERE id = ?', [subjectId])

    return {
      success: true,
      message: 'Subject deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw createError({
        statusCode: 400,
        message: 'Subjects table does not exist. Please run migration first.'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to delete subject'
    })
  }
})

