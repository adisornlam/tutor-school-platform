import { requireAuth } from '../../../utils/auth.middleware'
import { query } from '../../../utils/db'
import { getUserRoles } from '../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
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

  let whereConditions: string[] = []
  const queryValues: any[] = []

  if (search) {
    whereConditions.push(`(name LIKE ? OR code LIKE ? OR short_name LIKE ?)`)
    const searchPattern = `%${search}%`
    queryValues.push(searchPattern, searchPattern, searchPattern)
  }

  const whereClause = whereConditions.length > 0 
    ? `WHERE ${whereConditions.join(' AND ')}`
    : ''

  try {
    const subjects = await query(
      `SELECT 
        id,
        code,
        name,
        short_name,
        description,
        icon,
        created_at
      FROM subjects
      ${whereClause}
      ORDER BY name ASC`,
      queryValues
    )

    return {
      success: true,
      data: subjects
    }
  } catch (error: any) {
    console.error('Error fetching subjects:', error)
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return {
        success: true,
        data: []
      }
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch subjects'
    })
  }
})

