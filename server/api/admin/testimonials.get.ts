import { requireAuth } from '../../utils/auth.middleware'
import { query } from '../../utils/db'
import { getUserRoles } from '../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  const roles = await getUserRoles(auth.userId)
  const allowedRoles: UserRole[] = ['system_admin', 'owner', 'admin']
  if (!roles.some(role => allowedRoles.includes(role as UserRole))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Admin role required.'
    })
  }

  const queryParams = getQuery(event)
  const search = queryParams.search as string | undefined
  const status = queryParams.status as string | undefined

  let sql = `
    SELECT 
      id,
      name,
      role,
      comment,
      rating,
      avatar_url,
      status,
      display_order,
      created_at,
      updated_at
    FROM testimonials
    WHERE 1=1
  `
  
  const params: any[] = []

  if (search) {
    sql += ` AND (name LIKE ? OR role LIKE ? OR comment LIKE ?)`
    const searchPattern = `%${search}%`
    params.push(searchPattern, searchPattern, searchPattern)
  }

  if (status) {
    sql += ` AND status = ?`
    params.push(status)
  }

  sql += ` ORDER BY display_order ASC, created_at DESC`

  try {
    const testimonials = await query(sql, params)
    
    return {
      success: true,
      data: testimonials
    }
  } catch (error: any) {
    console.error('Error fetching testimonials:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch testimonials'
    })
  }
})

