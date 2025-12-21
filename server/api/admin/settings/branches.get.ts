import { requireAuth } from '../../../utils/auth.middleware'
import { query } from '../../../utils/db'
import { getUserRoles } from '../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  // Check if user has admin role (system_admin, owner only for settings)
  const roles = await getUserRoles(auth.userId)
  const allowedRoles: UserRole[] = ['system_admin', 'owner']
  if (!roles.some(role => allowedRoles.includes(role as UserRole))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. System Admin or Owner role required.'
    })
  }

  const queryParams = getQuery(event)
  const search = queryParams.search as string | undefined
  const status = queryParams.status as string | undefined

  let whereConditions: string[] = []
  const queryValues: any[] = []

  if (search) {
    whereConditions.push(`(name LIKE ? OR code LIKE ? OR address LIKE ?)`)
    const searchPattern = `%${search}%`
    queryValues.push(searchPattern, searchPattern, searchPattern)
  }

  if (status) {
    whereConditions.push(`status = ?`)
    queryValues.push(status)
  }

  const whereClause = whereConditions.length > 0 
    ? `WHERE ${whereConditions.join(' AND ')}`
    : ''

  try {
    const branches = await query(
      `SELECT 
        id,
        name,
        code,
        address,
        phone,
        email,
        status,
        created_at,
        updated_at
      FROM branches
      ${whereClause}
      ORDER BY name ASC`,
      queryValues
    )

    return {
      success: true,
      data: branches
    }
  } catch (error: any) {
    console.error('Error fetching branches:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch branches'
    })
  }
})

