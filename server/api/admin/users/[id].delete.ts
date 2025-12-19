import { requireAuth } from '../../../utils/auth.middleware'
import { getUserRoles, findUserById } from '../../../services/auth.service'
import { execute } from '../../../utils/db'
import type { UserRole } from '../../../../shared/types/user.types'

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

  const userId = parseInt(getRouterParam(event, 'id') || '0')
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid user ID'
    })
  }

  // Prevent self-deletion
  if (userId === auth.userId) {
    throw createError({
      statusCode: 400,
      message: 'Cannot delete your own account'
    })
  }

  // Get existing user
  const existingUser = await findUserById(userId)
  if (!existingUser) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    })
  }

  // Soft delete (set status to inactive instead of deleted_at since field may not exist)
  // TODO: Add deleted_at field to users table in future migration
  await execute(
    'UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?',
    ['inactive', userId]
  )

  return {
    success: true,
    message: 'User deleted successfully'
  }
})

