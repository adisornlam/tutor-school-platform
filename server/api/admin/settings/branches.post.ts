import { requireAuth } from '../../../utils/auth.middleware'
import { execute, query } from '../../../utils/db'
import { getUserRoles } from '../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface CreateBranchBody {
  name: string
  code: string
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

  const body = await readBody<CreateBranchBody>(event)

  // Validation
  if (!body.name || !body.code) {
    throw createError({
      statusCode: 400,
      message: 'Name and code are required'
    })
  }

  // Check if code already exists
  const existing = await query<{ id: number }>(
    'SELECT id FROM branches WHERE code = ?',
    [body.code]
  )

  if (existing.length > 0) {
    throw createError({
      statusCode: 409,
      message: 'Branch code already exists'
    })
  }

  // Create branch
  const result = await execute(
    `INSERT INTO branches (name, code, address, phone, email, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      body.name,
      body.code,
      body.address || null,
      body.phone || null,
      body.email || null,
      body.status || 'active'
    ]
  )

  // Get created branch
  const branches = await query(
    'SELECT * FROM branches WHERE id = ?',
    [result.insertId]
  )

  return {
    success: true,
    data: branches[0],
    message: 'Branch created successfully'
  }
})

