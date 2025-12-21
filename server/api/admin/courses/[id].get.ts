import { requireAuth } from '../../../utils/auth.middleware'
import { query } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const courseId = parseInt(getRouterParam(event, 'id') || '0')
  
  if (!courseId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid course ID'
    })
  }

  try {
    // Get course details
    // Check if thumbnail_url column exists first
    let courses: any[]
    let thumbnailUrl: string | null = null
    
    try {
      // Try with thumbnail_url first (if migration has run)
      courses = await query(
        `SELECT 
          c.id,
          c.title,
          c.description,
          c.type,
          c.price,
          c.duration_hours,
          c.level,
          c.status,
          c.code,
          c.created_by,
          c.created_at,
          c.updated_at,
          c.thumbnail_url,
          u.first_name as created_by_name,
          u.last_name as created_by_last_name
        FROM courses c
        LEFT JOIN users u ON c.created_by = u.id
        WHERE c.id = ?`,
        [courseId]
      )
      thumbnailUrl = courses[0]?.thumbnail_url || null
    } catch (err: any) {
      // If thumbnail_url column doesn't exist, query without it
      if (err.code === 'ER_BAD_FIELD_ERROR' && err.message.includes('thumbnail_url')) {
        courses = await query(
          `SELECT 
            c.id,
            c.title,
            c.description,
            c.type,
            c.price,
            c.duration_hours,
            c.level,
            c.status,
            c.code,
            c.created_by,
            c.created_at,
            c.updated_at,
            u.first_name as created_by_name,
            u.last_name as created_by_last_name
          FROM courses c
          LEFT JOIN users u ON c.created_by = u.id
          WHERE c.id = ?`,
          [courseId]
        )
        thumbnailUrl = null
      } else {
        throw err
      }
    }

    if (courses.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Course not found'
      })
    }

    const course = courses[0]

    // Get branches for this course
    const courseBranches = await query(
      `SELECT 
        cb.id,
        cb.course_id,
        cb.branch_id,
        cb.seat_limit,
        cb.current_enrollments,
        cb.is_available,
        b.name as branch_name,
        b.code as branch_code,
        b.status as branch_status
      FROM course_branches cb
      INNER JOIN branches b ON cb.branch_id = b.id
      WHERE cb.course_id = ?`,
      [courseId]
    )

    // Get images for this course (if course_images table exists)
    let courseImages: any[] = []
    try {
      courseImages = await query(
        `SELECT 
          id,
          course_id,
          image_url,
          image_type,
          display_order,
          alt_text,
          created_at
        FROM course_images
        WHERE course_id = ?
        ORDER BY display_order ASC, created_at ASC`,
        [courseId]
      )
    } catch (imgError: any) {
      // If course_images table doesn't exist yet, return empty array
      console.warn('course_images table may not exist yet:', imgError.message)
      courseImages = []
    }

    // Get enrollments with student and branch info
    const enrollments = await query(
      `SELECT 
        e.id,
        e.status,
        e.created_at as enrolled_at,
        s.id as student_id,
        s.username as student_username,
        s.first_name as student_first_name,
        s.last_name as student_last_name,
        s.email as student_email,
        b.id as branch_id,
        b.name as branch_name,
        b.code as branch_code
      FROM enrollments e
      INNER JOIN users s ON e.student_id = s.id
      INNER JOIN branches b ON e.branch_id = b.id
      WHERE e.course_id = ?
      ORDER BY e.created_at DESC`,
      [courseId]
    )

    return {
      success: true,
      data: {
        course: {
          id: course.id,
          title: course.title,
          description: course.description,
          thumbnail_url: thumbnailUrl,
          type: course.type,
          price: course.price,
          duration_hours: course.duration_hours,
          level: course.level,
          status: course.status,
          code: course.code,
          created_at: course.created_at,
          updated_at: course.updated_at,
          created_by_name: course.created_by_name,
          created_by_last_name: course.created_by_last_name
        },
        branches: courseBranches.map((cb: any) => ({
          id: cb.id,
          branch_id: cb.branch_id,
          branch_name: cb.branch_name,
          branch_code: cb.branch_code,
          branch_status: cb.branch_status,
          seat_limit: cb.seat_limit,
          current_enrollments: cb.current_enrollments,
          is_available: cb.is_available
        })),
        images: courseImages,
        enrollments: enrollments.map((e: any) => ({
          id: e.id,
          status: e.status,
          enrolled_at: e.enrolled_at,
          student: {
            id: e.student_id,
            username: e.student_username,
            first_name: e.student_first_name,
            last_name: e.student_last_name,
            email: e.student_email
          },
          branch: {
            id: e.branch_id,
            name: e.branch_name,
            code: e.branch_code
          }
        }))
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error fetching course detail:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState
    })
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch course detail',
      data: {
        originalError: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    })
  }
})

