import { requireAuth } from '../../utils/auth.middleware'
import { query } from '../../utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const queryParams = getQuery(event)
  const search = queryParams.search as string | undefined
  const type = queryParams.type as string | undefined
  const status = queryParams.status as string | undefined

  let sql = `
    SELECT 
      c.id,
      c.title,
      c.description,
      c.type,
      c.price,
      c.duration_hours,
      c.level,
      c.status,
      c.code,
      c.created_at,
      c.updated_at,
      u.first_name as created_by_name,
      u.last_name as created_by_last_name
    FROM courses c
    LEFT JOIN users u ON c.created_by = u.id
    WHERE 1=1
  `
  
  const params: any[] = []

  if (search) {
    sql += ` AND (c.title LIKE ? OR c.code LIKE ? OR c.description LIKE ?)`
    const searchPattern = `%${search}%`
    params.push(searchPattern, searchPattern, searchPattern)
  }

  if (type) {
    sql += ` AND c.type = ?`
    params.push(type)
  }

  if (status) {
    sql += ` AND c.status = ?`
    params.push(status)
  }

  sql += ` ORDER BY c.created_at DESC`

  try {
    const courses = await query(sql, params)
    
    return {
      success: true,
      data: courses
    }
  } catch (error: any) {
    console.error('Error fetching courses:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch courses'
    })
  }
})

