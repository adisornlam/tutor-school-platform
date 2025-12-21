import { requireAuth } from '../../../../utils/auth.middleware'
import { execute, query } from '../../../../utils/db'
import { getUserRoles } from '../../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface UpdateBranchBody {
  name?: string
  code?: string
  address?: string | null
  phone?: string | null
  email?: string | null
  status?: 'active' | 'inactive'
}

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

  const body = await readBody<UpdateBranchBody>(event)

  // Check if branch exists
  const existing = await query('SELECT id FROM branches WHERE id = ?', [branchId])
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Branch not found'
    })
  }

  // Check if code is being changed and already exists
  if (body.code) {
    const codeCheck = await query<{ id: number }>(
      'SELECT id FROM branches WHERE code = ? AND id != ?',
      [body.code, branchId]
    )
    if (codeCheck.length > 0) {
      throw createError({
        statusCode: 409,
        message: 'Branch code already exists'
      })
    }
  }

  // Build update query
  const updateFields: string[] = []
  const updateValues: any[] = []

  if (body.name !== undefined) {
    updateFields.push('name = ?')
    updateValues.push(body.name)
  }
  if (body.code !== undefined) {
    updateFields.push('code = ?')
    updateValues.push(body.code)
  }
  if (body.address !== undefined) {
    updateFields.push('address = ?')
    updateValues.push(body.address)
  }
  if (body.phone !== undefined) {
    updateFields.push('phone = ?')
    updateValues.push(body.phone)
  }
  if (body.email !== undefined) {
    updateFields.push('email = ?')
    updateValues.push(body.email)
  }
  if (body.status !== undefined) {
    updateFields.push('status = ?')
    updateValues.push(body.status)
  }

  if (updateFields.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No fields to update'
    })
  }

  updateValues.push(branchId)
  await execute(
    `UPDATE branches SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`,
    updateValues
  )

  // Get updated branch
  const branches = await query('SELECT * FROM branches WHERE id = ?', [branchId])

  return {
    success: true,
    data: branches[0],
    message: 'Branch updated successfully'
  }
})

