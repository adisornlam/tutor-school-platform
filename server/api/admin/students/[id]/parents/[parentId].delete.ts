import { requireAuth } from '#server/utils/auth.middleware'
import { query, execute } from '#server/utils/db'
import { getUserRoles, findUserById } from '#server/services/auth.service'
import type { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  // Check if user has admin role (system_admin, owner, admin, branch_admin)
  const roles = await getUserRoles(auth.userId)
  const allowedRoles: UserRole[] = ['system_admin', 'owner', 'admin', 'branch_admin']
  if (!roles.some(role => allowedRoles.includes(role as UserRole))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Admin role required.'
    })
  }

  // Get route params - in nested routes, we need to parse from the full path
  const routeParams = event.context.params
  const studentId = parseInt((routeParams?.id as string) || '0')
  const parentId = parseInt((routeParams?.parentId as string) || '0')

  if (!studentId || !parentId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid student ID or parent ID'
    })
  }

  // Verify student exists
  const student = await findUserById(studentId)
  if (!student) {
    throw createError({
      statusCode: 404,
      message: 'Student not found'
    })
  }

  // Verify relationship exists
  const relationship = await query<{ id: number }>(
    'SELECT id FROM parent_students WHERE parent_id = ? AND student_id = ?',
    [parentId, studentId]
  )

  if (relationship.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Parent-student relationship not found'
    })
  }

  // Delete relationship
  await execute(
    'DELETE FROM parent_students WHERE parent_id = ? AND student_id = ?',
    [parentId, studentId]
  )

  return {
    success: true,
    message: 'Parent removed successfully'
  }
})

