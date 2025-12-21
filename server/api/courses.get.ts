import { query } from '../utils/db'

export default defineEventHandler(async (event) => {
  const queryParams = getQuery(event)
  const search = queryParams.search as string | undefined
  const type = queryParams.type as string | undefined
  const level = queryParams.level as string | undefined
  const branchId = queryParams.branch_id as string | undefined
  
  // Pagination
  const page = parseInt(queryParams.page as string) || 1
  const limit = parseInt(queryParams.limit as string) || 15
  const offset = (page - 1) * limit

  // Build SQL query - only published courses
  let sql = `
    SELECT 
      c.id,
      c.title,
      c.description,
      c.type,
      c.price,
      c.onsite_price,
      c.online_price,
      c.duration_hours,
      c.level,
      c.status,
      c.code,
      c.thumbnail_url,
      c.created_at,
      c.updated_at,
      COUNT(DISTINCT e.id) as enrollment_count
    FROM courses c
    LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'active'
    WHERE c.status = 'published'
  `
  
  const params: any[] = []

  // Filter by search
  if (search) {
    sql += ` AND (c.title LIKE ? OR c.code LIKE ? OR c.description LIKE ?)`
    const searchPattern = `%${search}%`
    params.push(searchPattern, searchPattern, searchPattern)
  }

  // Filter by type
  if (type) {
    sql += ` AND c.type = ?`
    params.push(type)
  }

  // Filter by level
  if (level) {
    sql += ` AND c.level = ?`
    params.push(level)
  }

  // Filter by branch (if course is available in that branch)
  if (branchId) {
    sql += ` AND EXISTS (
      SELECT 1 FROM course_branches cb
      INNER JOIN branches b ON cb.branch_id = b.id
      WHERE cb.course_id = c.id 
      AND cb.branch_id = ?
      AND cb.is_available = 1
      AND b.status = 'active'
    )`
    params.push(parseInt(branchId))
  }

  // Group by course fields
  sql += ` GROUP BY c.id, c.title, c.description, c.type, c.price, c.onsite_price, c.online_price, 
    c.duration_hours, c.level, c.status, c.code, c.thumbnail_url, c.created_at, c.updated_at`

  // Order by
  const sortBy = (queryParams.sort_by as string) || 'newest'
  if (sortBy === 'price_asc') {
    sql += ` ORDER BY c.price ASC`
  } else if (sortBy === 'price_desc') {
    sql += ` ORDER BY c.price DESC`
  } else if (sortBy === 'popular') {
    sql += ` ORDER BY enrollment_count DESC`
  } else {
    // newest (default)
    sql += ` ORDER BY c.created_at DESC`
  }

  try {
    // Get total count for pagination (separate query with same filters but without GROUP BY)
    const countParams: any[] = []
    let countSql = `
      SELECT COUNT(DISTINCT c.id) as total
      FROM courses c
      WHERE c.status = 'published'
    `
    
    // Apply same filters to count query
    if (search) {
      countSql += ` AND (c.title LIKE ? OR c.code LIKE ? OR c.description LIKE ?)`
      const searchPattern = `%${search}%`
      countParams.push(searchPattern, searchPattern, searchPattern)
    }
    if (type) {
      countSql += ` AND c.type = ?`
      countParams.push(type)
    }
    if (level) {
      countSql += ` AND c.level = ?`
      countParams.push(level)
    }
    if (branchId) {
      countSql += ` AND EXISTS (
        SELECT 1 FROM course_branches cb
        INNER JOIN branches b ON cb.branch_id = b.id
        WHERE cb.course_id = c.id 
        AND cb.branch_id = ?
        AND cb.is_available = 1
        AND b.status = 'active'
      )`
      countParams.push(parseInt(branchId))
    }

    // Get total count
    const countResult = await query<{ total: number }[]>(countSql, countParams)
    const total = countResult?.[0]?.total || 0
    const totalPages = Math.ceil(total / limit)

    // Add pagination
    sql += ` LIMIT ? OFFSET ?`
    params.push(limit, offset)

    const courses = await query(sql, params)
    
    // Format courses for frontend
    const formattedCourses = courses.map((course: any) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      type: course.type,
      price: parseFloat(course.price || '0'),
      onsite_price: course.onsite_price ? parseFloat(course.onsite_price) : null,
      online_price: course.online_price ? parseFloat(course.online_price) : null,
      duration_hours: course.duration_hours,
      level: course.level,
      code: course.code,
      thumbnail_url: course.thumbnail_url,
      enrollment_count: parseInt(course.enrollment_count || '0'),
      created_at: course.created_at,
      updated_at: course.updated_at
    }))
    
    return {
      success: true,
      data: formattedCourses,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }
  } catch (error: any) {
    console.error('Error fetching courses:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch courses'
    })
  }
})

