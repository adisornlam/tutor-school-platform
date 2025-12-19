import { requireAuth } from '../../utils/auth.middleware'
import { query } from '../../utils/db'
import { getUserRoles } from '../../services/auth.service'
import type { UserRole } from '../../../shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  // Check if user has admin role (system_admin, owner, branch_admin)
  const roles = await getUserRoles(auth.userId)
  const adminRoles: UserRole[] = ['system_admin', 'owner', 'branch_admin']
  if (!roles.some(role => adminRoles.includes(role as UserRole))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Admin role required.'
    })
  }

  const queryParams = getQuery(event)
  const role = queryParams.role as string | undefined
  const search = queryParams.search as string | undefined
  const page = parseInt(queryParams.page as string) || 1
  const limit = parseInt(queryParams.limit as string) || 20
  const offset = (page - 1) * limit

  // Build query
  // Note: deleted_at field may not exist in all databases, so we check for it
  // For now, we'll filter by status instead of deleted_at
  let whereConditions: string[] = []
  const queryValues: any[] = []

  // Filter by role
  if (role) {
    whereConditions.push(`r.name = ?`)
    queryValues.push(role)
  }

  // Filter by status
  const status = queryParams.status as string | undefined
  if (status) {
    whereConditions.push(`u.status = ?`)
    queryValues.push(status)
  }

  // Search by username, email, first_name, last_name
  if (search) {
    whereConditions.push(`(
      u.username LIKE ? OR 
      u.email LIKE ? OR 
      u.first_name LIKE ? OR 
      u.last_name LIKE ?
    )`)
    const searchPattern = `%${search}%`
    queryValues.push(searchPattern, searchPattern, searchPattern, searchPattern)
  }

  const whereClause = whereConditions.length > 0 
    ? `WHERE ${whereConditions.join(' AND ')}`
    : ''

  // Get total count
  const countResult = await query<{ count: number }>(
    `SELECT COUNT(DISTINCT u.id) as count
     FROM users u
     LEFT JOIN user_roles ur ON u.id = ur.user_id
     LEFT JOIN roles r ON ur.role_id = r.id
     ${whereClause}`,
    queryValues
  )

  const total = countResult[0]?.count || 0

  // Get users with roles
  const users = await query<any>(
    `SELECT 
       u.id,
       u.username,
       u.email,
       u.first_name,
       u.last_name,
       u.phone,
       u.status,
       u.created_at,
       u.updated_at,
       GROUP_CONCAT(DISTINCT r.name) as roles
     FROM users u
     LEFT JOIN user_roles ur ON u.id = ur.user_id
     LEFT JOIN roles r ON ur.role_id = r.id
     ${whereClause}
     GROUP BY u.id
     ORDER BY u.created_at DESC
     LIMIT ? OFFSET ?`,
    [...queryValues, limit, offset]
  )

  // Format users
  const formattedUsers = users.map((user: any) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    status: user.status,
    roles: user.roles ? user.roles.split(',') : [],
    created_at: user.created_at,
    updated_at: user.updated_at
  }))

  return {
    success: true,
    data: formattedUsers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
})

