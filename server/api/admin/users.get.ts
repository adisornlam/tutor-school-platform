import { requireAuth } from '../../utils/auth.middleware'
import { query } from '../../utils/db'
import { getUserRoles } from '../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  // Check if user has admin role (system_admin, owner, admin, branch_admin)
  const roles = await getUserRoles(auth.userId)
  const adminRoles: UserRole[] = ['system_admin', 'owner', 'admin', 'branch_admin']
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
  // Note: parent and student roles are excluded from results in application layer
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

  // Exclude users that ONLY have parent or student roles
  // Add condition to filter users with valid admin roles
  whereConditions.push(`u.id IN (
    SELECT DISTINCT ur_inner.user_id
    FROM user_roles ur_inner
    JOIN roles r_inner ON ur_inner.role_id = r_inner.id
    WHERE r_inner.name IN ('system_admin', 'owner', 'admin', 'branch_admin', 'tutor')
  )`)

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

  // Format users and filter out parent/student roles from display
  const formattedUsers = users.map((user: any) => {
    const allRoles = user.roles ? user.roles.split(',').filter((r: string) => r && r.trim()) : []
    // Filter out parent and student roles from display (but user still has them in DB)
    const validRoles = ['system_admin', 'owner', 'admin', 'branch_admin', 'tutor']
    const displayRoles = allRoles.filter((role: string) => validRoles.includes(role))
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      status: user.status,
      roles: displayRoles, // Only show valid roles
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  })

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

