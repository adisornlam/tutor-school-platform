import { requireAuth } from '../../../../utils/auth.middleware'
import { getUserRoles, findUserById, getUserWithRoles } from '../../../../services/auth.service'
import { execute } from '../../../../utils/db'
import { UserStatus } from '../../../../../shared/types/user.types'
import type { UserRole } from '../../../../../shared/types/user.types'

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

  // Prevent self-status change
  if (userId === auth.userId) {
    throw createError({
      statusCode: 400,
      message: 'Cannot change your own account status'
    })
  }

  const body = await readBody<{ status: UserStatus }>(event)
  
  if (!body.status || !Object.values(UserStatus).includes(body.status)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid status. Must be one of: active, inactive, suspended'
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

  // Update status
  await execute(
    'UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?',
    [body.status, userId]
  )

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
    message: `User status updated to ${body.status}`
  }
})

