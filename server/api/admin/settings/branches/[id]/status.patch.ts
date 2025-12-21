import { requireAuth } from '../../../../../utils/auth.middleware'
import { execute, query } from '../../../../../utils/db'
import { getUserRoles } from '../../../../../services/auth.service'
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

  const body = await readBody<{ status: 'active' | 'inactive' }>()
  
  if (!body.status || !['active', 'inactive'].includes(body.status)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid status. Must be active or inactive'
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

  // Update status
  await execute(
    'UPDATE branches SET status = ?, updated_at = NOW() WHERE id = ?',
    [body.status, branchId]
  )

  // Get updated branch
  const branches = await query('SELECT * FROM branches WHERE id = ?', [branchId])

  return {
    success: true,
    data: branches[0],
    message: `Branch status updated to ${body.status}`
  }
})

