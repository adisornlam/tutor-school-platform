import { requireAuth } from '../../utils/auth.middleware'
import { query } from '../../utils/db'
import { getUserRoles } from '../../services/auth.service'
import type { UserRole } from '../../../shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  // Check if user has admin role (including tutor)
  const roles = await getUserRoles(auth.userId)
  const allowedRoles: UserRole[] = ['system_admin', 'owner', 'branch_admin', 'tutor']
  if (!roles.some(role => allowedRoles.includes(role as UserRole))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Admin or Tutor role required.'
    })
  }

  const queryParams = getQuery(event)
  const search = queryParams.search as string | undefined
  const page = parseInt(queryParams.page as string) || 1
  const limit = parseInt(queryParams.limit as string) || 20
  const offset = (page - 1) * limit

  // Determine user type and get filter conditions
  const isSystemAdmin = roles.includes('system_admin' as UserRole) || roles.includes('owner' as UserRole)
  const isBranchAdmin = roles.includes('branch_admin' as UserRole)
  const isTutor = roles.includes('tutor' as UserRole)

  // Get branch_id for Branch Admin
  let branchIds: number[] = []
  if (isBranchAdmin && !isSystemAdmin) {
    const branchAdmins = await query<{ branch_id: number }>(
      'SELECT branch_id FROM branch_admins WHERE user_id = ?',
      [auth.userId]
    )
    branchIds = branchAdmins.map(ba => ba.branch_id)
    
    if (branchIds.length === 0) {
      // Branch Admin with no assigned branch - return empty
      return {
        success: true,
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      }
    }
  }

  // Get tutor_id and course_ids for Tutor
  let tutorId: number | null = null
  let courseIds: number[] = []
  if (isTutor && !isSystemAdmin && !isBranchAdmin) {
    // Get tutor_id from tutors table
    const tutors = await query<{ id: number }>(
      'SELECT id FROM tutors WHERE user_id = ?',
      [auth.userId]
    )
    
    if (tutors.length === 0) {
      // Tutor with no tutor profile - return empty
      return {
        success: true,
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      }
    }
    
    tutorId = tutors[0].id
    
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
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      }
    }
  }

  // Build query - only students
  let whereConditions: string[] = []
  const queryValues: any[] = []

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

  // Always filter by student role
  whereConditions.push(`r.name = 'student'`)

  // Filter by branch for Branch Admin
  if (isBranchAdmin && !isSystemAdmin && branchIds.length > 0) {
    whereConditions.push(`e.branch_id IN (${branchIds.map(() => '?').join(',')})`)
    queryValues.push(...branchIds)
  }

  // Filter by course for Tutor
  if (isTutor && !isSystemAdmin && !isBranchAdmin && courseIds.length > 0) {
    whereConditions.push(`e.course_id IN (${courseIds.map(() => '?').join(',')})`)
    queryValues.push(...courseIds)
  }

  const whereClause = whereConditions.length > 0 
    ? `WHERE ${whereConditions.join(' AND ')}`
    : ''

  // Build FROM clause with necessary JOINs
  // For System Admin: No enrollment filter needed
  // For Branch Admin: Need to filter by branch_id in enrollments
  // For Tutor: Need to filter by course_id in enrollments
  let fromClause = `FROM users u
     INNER JOIN user_roles ur ON u.id = ur.user_id
     INNER JOIN roles r ON ur.role_id = r.id`
  
  // Add JOINs for branch/tutor filtering
  if (isBranchAdmin && !isSystemAdmin && branchIds.length > 0) {
    // Branch Admin: Only show students enrolled in their branch
    fromClause += ` INNER JOIN enrollments e ON u.id = e.student_id`
  } else if (isTutor && !isSystemAdmin && !isBranchAdmin && courseIds.length > 0) {
    // Tutor: Only show students enrolled in their courses
    fromClause += ` INNER JOIN enrollments e ON u.id = e.student_id`
  }

  // Get total count
  const countResult = await query<{ count: number }>(
    `SELECT COUNT(DISTINCT u.id) as count
     ${fromClause}
     ${whereClause}`,
    queryValues
  )

  const total = countResult[0]?.count || 0

  // Get students with parent information
  const students = await query<any>(
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
       GROUP_CONCAT(DISTINCT CONCAT(
         IFNULL(p.id, ''), ':', 
         IFNULL(CONCAT(p.first_name, ' ', p.last_name), ''), ':', 
         IFNULL(ps.relationship, '')
       ) SEPARATOR '||') as parent_info
     ${fromClause}
     LEFT JOIN parent_students ps ON u.id = ps.student_id
     LEFT JOIN users p ON ps.parent_id = p.id
     ${whereClause}
     GROUP BY u.id
     ORDER BY u.created_at DESC
     LIMIT ? OFFSET ?`,
    [...queryValues, limit, offset]
  )

  // Format students with parents
  const formattedStudents = students.map((student: any) => {
    const parents: Array<{ id: number; name: string; relationship: string }> = []
    
    if (student.parent_info) {
      // Split by || first (separator), then by : (field separator)
      const parentInfos = student.parent_info.split('||').filter((info: string) => info.trim() !== '')
      for (const info of parentInfos) {
        const [parentId, parentName, relationship] = info.split(':')
        if (parentId && parentName && parentId !== '' && parentName !== '') {
          parents.push({
            id: parseInt(parentId),
            name: parentName,
            relationship: relationship || 'guardian'
          })
        }
      }
    }

    return {
      id: student.id,
      username: student.username,
      email: student.email,
      first_name: student.first_name,
      last_name: student.last_name,
      phone: student.phone,
      status: student.status,
      parents: parents,
      created_at: student.created_at,
      updated_at: student.updated_at
    }
  })

  return {
    success: true,
    data: formattedStudents,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
})

