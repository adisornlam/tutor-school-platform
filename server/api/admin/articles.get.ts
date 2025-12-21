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
  const category = queryParams.category as string | undefined

  let sql = `
    SELECT 
      a.id,
      a.title,
      a.slug,
      a.excerpt,
      a.category,
      a.icon,
      a.featured_image_url,
      a.status,
      a.is_featured,
      a.view_count,
      a.display_order,
      a.published_at,
      a.created_at,
      a.updated_at,
      u.first_name as author_first_name,
      u.last_name as author_last_name
    FROM articles a
    LEFT JOIN users u ON a.author_id = u.id
    WHERE 1=1
  `
  
  const params: any[] = []

  if (search) {
    sql += ` AND (a.title LIKE ? OR a.excerpt LIKE ? OR a.content LIKE ?)`
    const searchPattern = `%${search}%`
    params.push(searchPattern, searchPattern, searchPattern)
  }

  if (status) {
    sql += ` AND a.status = ?`
    params.push(status)
  }

  if (category) {
    sql += ` AND a.category = ?`
    params.push(category)
  }

  sql += ` ORDER BY a.display_order ASC, a.created_at DESC`

  try {
    const articles = await query(sql, params)
    
    return {
      success: true,
      data: articles
    }
  } catch (error: any) {
    console.error('Error fetching articles:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch articles'
    })
  }
})

