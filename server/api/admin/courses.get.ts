import { requireAuth } from '../../utils/auth.middleware'
import { query } from '../../utils/db'
import { getUserRoles } from '../../services/auth.service'
import { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  // Check if user has admin role (including tutor)
  const roles = await getUserRoles(auth.userId)
  const allowedRoles: UserRole[] = [UserRole.SYSTEM_ADMIN, UserRole.OWNER, UserRole.ADMIN, UserRole.BRANCH_ADMIN, UserRole.TUTOR]
  if (!roles.some(role => allowedRoles.includes(role as UserRole))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Admin or Tutor role required.'
    })
  }
  
  const queryParams = getQuery(event)
  const search = queryParams.search as string | undefined
  const type = queryParams.type as string | undefined
  const status = queryParams.status as string | undefined

  // Determine user type and get filter conditions
  const isSystemAdmin = roles.includes(UserRole.SYSTEM_ADMIN) || roles.includes(UserRole.OWNER)
  const isAdmin = roles.includes(UserRole.ADMIN) // Admin กลาง - จัดการได้ทุกสาขา
  const isBranchAdmin = roles.includes(UserRole.BRANCH_ADMIN)
  const isTutor = roles.includes(UserRole.TUTOR)

  // Get tutor_id and course_ids for Tutor
  let courseIds: number[] = []
  if (isTutor && !isSystemAdmin && !isAdmin && !isBranchAdmin) {
    // Get tutor_id from tutors table
    const tutors = await query<{ id: number }>(
      'SELECT id FROM tutors WHERE user_id = ?',
      [auth.userId]
    )
    
    if (tutors.length === 0 || !tutors[0]) {
      // Tutor with no tutor profile - return empty
      return {
        success: true,
        data: []
      }
    }
    
    const tutorId = tutors[0].id
    
    // Get course_ids that this tutor teaches
    const tutorCourses = await query<{ course_id: number }>(
      'SELECT DISTINCT course_id FROM tutor_courses WHERE tutor_id = ?',
      [tutorId]
    )
    courseIds = tutorCourses.map(tc => tc.course_id)
    
    if (courseIds.length === 0) {
      // Tutor with no assigned courses - return empty
      return {
        success: true,
        data: []
      }
    }
  }

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

  // Filter by course_ids for Tutor
  if (isTutor && !isSystemAdmin && !isAdmin && !isBranchAdmin && courseIds.length > 0) {
    sql += ` AND c.id IN (${courseIds.map(() => '?').join(',')})`
    params.push(...courseIds)
  }

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

