import { requireAuth } from '../../../utils/auth.middleware'
import { query } from '../../../utils/db'
import { getUserRoles, findUserById } from '../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  // Check if user has admin role (including tutor)
  const roles = await getUserRoles(auth.userId)
  const allowedRoles: UserRole[] = ['system_admin', 'owner', 'admin', 'branch_admin', 'tutor']
  if (!roles.some(role => allowedRoles.includes(role as UserRole))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Admin or Tutor role required.'
    })
  }

  const studentId = parseInt(getRouterParam(event, 'id') || '0')
  if (!studentId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid student ID'
    })
  }

  // Check access permission based on role
  const isSystemAdmin = roles.includes('system_admin' as UserRole) || roles.includes('owner' as UserRole)
  const isAdmin = roles.includes('admin' as UserRole) // Admin กลาง - จัดการได้ทุกสาขา
  const isBranchAdmin = roles.includes('branch_admin' as UserRole)
  const isTutor = roles.includes('tutor' as UserRole)

  // For Branch Admin: Check if student has enrollment in their branch
  // Admin กลาง สามารถดูได้ทุกสาขา ไม่ต้อง filter
  if (isBranchAdmin && !isSystemAdmin && !isAdmin) {
    const { query } = await import('../../../utils/db')
    const branchAdmins = await query<{ branch_id: number }>(
      'SELECT branch_id FROM branch_admins WHERE user_id = ?',
      [auth.userId]
    )
    
      if (branchAdmins.length > 0) {
        const branchIds = branchAdmins.map(ba => ba.branch_id)
        const enrollments = await query<{ id: number }>(
          `SELECT id FROM enrollments 
           WHERE student_id = ? AND branch_id IN (${branchIds.map(() => '?').join(',')})`,
          [studentId, ...branchIds]
        )
      
      if (enrollments.length === 0) {
        throw createError({
          statusCode: 403,
          message: 'Access denied. Student is not enrolled in your branch.'
        })
      }
    }
  }

  // For Tutor: Check if student is enrolled in their courses
  if (isTutor && !isSystemAdmin && !isBranchAdmin) {
    const { query } = await import('../../../utils/db')
    const tutors = await query<{ id: number }>(
      'SELECT id FROM tutors WHERE user_id = ?',
      [auth.userId]
    )
    
    if (tutors.length > 0) {
      const tutorId = tutors[0].id
      const tutorCourses = await query<{ course_id: number }>(
        'SELECT DISTINCT course_id FROM tutor_courses WHERE tutor_id = ?',
        [tutorId]
      )
      
      if (tutorCourses.length > 0) {
        const courseIds = tutorCourses.map(tc => tc.course_id)
        const enrollments = await query<{ id: number }>(
          `SELECT id FROM enrollments 
           WHERE student_id = ? AND course_id IN (${courseIds.map(() => '?').join(',')})`,
          [studentId, ...courseIds]
        )
        
        if (enrollments.length === 0) {
          throw createError({
            statusCode: 403,
            message: 'Access denied. Student is not enrolled in your courses.'
          })
        }
      } else {
        throw createError({
          statusCode: 403,
          message: 'Access denied. You have no assigned courses.'
        })
      }
    } else {
      throw createError({
        statusCode: 403,
        message: 'Access denied. Tutor profile not found.'
      })
    }
  }

  // Get student
  const student = await findUserById(studentId)
  if (!student) {
    throw createError({
      statusCode: 404,
      message: 'Student not found'
    })
  }

  // Check if user is a student
  const studentRoles = await query<{ name: string }>(
    `SELECT r.name 
     FROM user_roles ur
     JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = ? AND r.name = 'student'`,
    [studentId]
  )

  if (studentRoles.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'User is not a student'
    })
  }

  // Get parent information
  const parents = await query<any>(
    `SELECT 
       p.id,
       p.username,
       p.email,
       p.first_name,
       p.last_name,
       p.phone,
       p.status,
       ps.relationship
     FROM parent_students ps
     INNER JOIN users p ON ps.parent_id = p.id
     WHERE ps.student_id = ?`,
    [studentId]
  )

  // Get enrollments
  const enrollments = await query<any>(
    `SELECT 
       e.id,
       e.status as enrollment_status,
       e.created_at as enrolled_at,
       c.id as course_id,
       c.title as course_title,
       c.code as course_code,
       b.id as branch_id,
       b.name as branch_name,
       b.code as branch_code
     FROM enrollments e
     INNER JOIN courses c ON e.course_id = c.id
     INNER JOIN branches b ON e.branch_id = b.id
     WHERE e.student_id = ?
     ORDER BY e.created_at DESC`,
    [studentId]
  )

  // Format response
  const { password_hash, ...publicStudent } = student

  return {
    success: true,
    data: {
      student: publicStudent,
      parents: parents.map((p: any) => ({
        id: p.id,
        username: p.username,
        email: p.email,
        first_name: p.first_name,
        last_name: p.last_name,
        phone: p.phone,
        status: p.status,
        relationship: p.relationship
      })),
      enrollments: enrollments.map((e: any) => ({
        id: e.id,
        course: {
          id: e.course_id,
          title: e.course_title,
          code: e.course_code
        },
        branch: {
          id: e.branch_id,
          name: e.branch_name,
          code: e.branch_code
        },
        status: e.enrollment_status,
        enrolled_at: e.enrolled_at
      }))
    }
  }
})

