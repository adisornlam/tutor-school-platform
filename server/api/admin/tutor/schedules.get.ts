import { requireAuth } from '../../../utils/auth.middleware'
import { query } from '../../../utils/db'
import { getUserRoles } from '../../../services/auth.service'
import { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  // Check if user has tutor role
  const roles = await getUserRoles(auth.userId)
  const isTutor = roles.includes(UserRole.TUTOR)
  const isSystemAdmin = roles.includes(UserRole.SYSTEM_ADMIN) || roles.includes(UserRole.OWNER)
  const isAdmin = roles.includes(UserRole.ADMIN)
  const isBranchAdmin = roles.includes(UserRole.BRANCH_ADMIN)
  
  // For tutor, must filter by their tutor_id
  // For admin, can view all or filter by tutor_id in query
  if (!isTutor && !isSystemAdmin && !isAdmin && !isBranchAdmin) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Tutor or Admin role required.'
    })
  }
  
  const queryParams = getQuery(event)
  const startDate = queryParams.start_date as string | undefined
  const endDate = queryParams.end_date as string | undefined
  const status = queryParams.status as string | undefined
  const courseId = queryParams.course_id as string | undefined
  const tutorId = queryParams.tutor_id as string | undefined // For admin to filter by tutor

  // Get tutor_id and branch_ids
  let filterTutorId: number | null = null
  let branchIds: number[] = []
  
  if (isTutor && !isSystemAdmin && !isAdmin && !isBranchAdmin) {
    // For tutor, get their tutor_id
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
    
    filterTutorId = tutors[0].id
  } else if (isBranchAdmin && !isSystemAdmin && !isAdmin) {
    // For branch admin, get their branch_ids
    const branchAdmins = await query<{ branch_id: number }>(
      'SELECT branch_id FROM branch_admins WHERE user_id = ?',
      [auth.userId]
    )
    branchIds = branchAdmins.map(ba => ba.branch_id)
    
    if (branchIds.length === 0) {
      // Branch admin with no branches - return empty
      return {
        success: true,
        data: []
      }
    }
  } else if (tutorId) {
    // For admin, can filter by tutor_id from query
    filterTutorId = parseInt(tutorId)
  }

  let sql = `
    SELECT 
      cs.id,
      cs.course_id,
      cs.branch_id,
      cs.tutor_id,
      cs.start_datetime,
      cs.end_datetime,
      cs.session_type,
      cs.meeting_link,
      cs.video_url,
      cs.status,
      c.title as course_title,
      c.code as course_code,
      c.type as course_type,
      b.name as branch_name,
      b.code as branch_code,
      t.id as tutor_profile_id
    FROM course_schedules cs
    INNER JOIN courses c ON cs.course_id = c.id
    INNER JOIN branches b ON cs.branch_id = b.id
    INNER JOIN tutors t ON cs.tutor_id = t.id
    WHERE 1=1
  `
  
  const params: any[] = []

  // Filter by tutor_id
  if (filterTutorId) {
    sql += ` AND cs.tutor_id = ?`
    params.push(filterTutorId)
  }

  // Filter by branch_ids for branch admin
  if (branchIds.length > 0) {
    sql += ` AND cs.branch_id IN (${branchIds.map(() => '?').join(',')})`
    params.push(...branchIds)
  }

  // Filter by date range
  if (startDate) {
    sql += ` AND DATE(cs.start_datetime) >= ?`
    params.push(startDate)
  }

  if (endDate) {
    sql += ` AND DATE(cs.start_datetime) <= ?`
    params.push(endDate)
  }

  // Filter by status
  if (status) {
    sql += ` AND cs.status = ?`
    params.push(status)
  }

  // Filter by course
  if (courseId) {
    sql += ` AND cs.course_id = ?`
    params.push(parseInt(courseId))
  }

  sql += ` ORDER BY cs.start_datetime ASC`

  try {
    const schedules = await query(sql, params)
    
    return {
      success: true,
      data: schedules.map((s: any) => ({
        id: s.id,
        course_id: s.course_id,
        branch_id: s.branch_id,
        tutor_id: s.tutor_id,
        start_datetime: s.start_datetime,
        end_datetime: s.end_datetime,
        session_type: s.session_type,
        meeting_link: s.meeting_link,
        video_url: s.video_url,
        status: s.status,
        course: {
          id: s.course_id,
          title: s.course_title,
          code: s.course_code,
          type: s.course_type
        },
        branch: {
          id: s.branch_id,
          name: s.branch_name,
          code: s.branch_code
        }
      }))
    }
  } catch (error: any) {
    console.error('Error fetching schedules:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch schedules'
    })
  }
})

