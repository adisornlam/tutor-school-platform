import { requireAuth } from '../../../../utils/auth.middleware'
import { execute, query } from '../../../../utils/db'
import { getUserRoles } from '../../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  // Check if user has admin role (system_admin, owner only)
  const roles = await getUserRoles(auth.userId)
  const allowedRoles: UserRole[] = ['system_admin', 'owner']
  if (!roles.some(role => allowedRoles.includes(role as UserRole))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. System Admin or Owner role required.'
    })
  }

  const branchId = parseInt(getRouterParam(event, 'id') || '0')
  if (!branchId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid branch ID'
    })
  }

  // Check if branch exists
  const existing = await query('SELECT id FROM branches WHERE id = ?', [branchId])
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Branch not found'
    })
  }

  // Check if branch is being used (enrollments, course_branches, etc.)
  const enrollments = await query<{ count: number }>(
    'SELECT COUNT(*) as count FROM enrollments WHERE branch_id = ?',
    [branchId]
  )
  if (enrollments[0]?.count > 0) {
    throw createError({
      statusCode: 400,
      message: 'Cannot delete branch. It is being used in enrollments.'
    })
  }

  // Delete branch
  await execute('DELETE FROM branches WHERE id = ?', [branchId])

  return {
    success: true,
    message: 'Branch deleted successfully'
  }
})

