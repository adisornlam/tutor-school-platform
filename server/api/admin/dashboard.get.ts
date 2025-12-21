import { requireAuth } from '../../utils/auth.middleware'
import { getUserRoles } from '../../services/auth.service'
import { query } from '../../utils/db'
import type { UserRole } from '#shared/types/user.types'
import { getHighestPriorityRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await requireAuth(event)
    const userId = auth.userId
    
    // Get user roles
    const roles = await getUserRoles(userId)
    
    if (!roles || roles.length === 0) {
      throw createError({
        statusCode: 403,
        message: 'User has no roles'
      })
    }
    
    // Get highest priority role (for dashboard customization)
    const primaryRole = getHighestPriorityRole(roles)
    
    if (!primaryRole) {
      throw createError({
        statusCode: 403,
        message: 'Could not determine user role'
      })
    }
    
    // Get user's branch_id if exists (for branch_admin)
    let userBranchId: number | null = null
    if (primaryRole === 'branch_admin') {
      try {
        const branchAdmins = await query<any[]>(
          'SELECT branch_id FROM branch_admins WHERE user_id = ? LIMIT 1',
          [userId]
        )
        if (branchAdmins && branchAdmins.length > 0 && branchAdmins[0].branch_id) {
          userBranchId = branchAdmins[0].branch_id
        }
      } catch (error) {
        // branch_admins table might not exist, ignore
      }
    }

    // Get tutor_id for tutor
    let tutorId: number | null = null
    let tutorCourseIds: number[] = []
    if (primaryRole === 'tutor') {
      try {
        const tutors = await query<any[]>(
          'SELECT id FROM tutors WHERE user_id = ? LIMIT 1',
          [userId]
        )
        if (tutors && tutors.length > 0) {
          tutorId = tutors[0].id
          // Get all course_ids that this tutor teaches
          const tutorCourses = await query<any[]>(
            'SELECT DISTINCT course_id FROM tutor_courses WHERE tutor_id = ?',
            [tutorId]
          )
          tutorCourseIds = tutorCourses.map(tc => tc.course_id)
        }
      } catch (error) {
        // tutors or tutor_courses table might not exist, ignore
      }
    }
    
    const dashboardData: any = {
      stats: {},
      recentEnrollments: [],
      recentPayments: []
    }
    
    // Fetch stats based on role
    if (primaryRole === 'system_admin' || primaryRole === 'owner') {
      // System-wide stats (all branches)
      
      // Total students
      const [studentsResult] = await query<any[]>(
        `SELECT COUNT(DISTINCT u.id) as total
         FROM users u
         INNER JOIN user_roles ur ON u.id = ur.user_id
         INNER JOIN roles r ON ur.role_id = r.id
         WHERE r.name IN ('student', 'parent')
         AND u.status = 'active'`
      )
      dashboardData.stats.totalStudents = studentsResult?.[0]?.total || 0
      
      // Total courses
      const [coursesResult] = await query<any[]>(
        `SELECT COUNT(*) as total FROM courses WHERE status = 'published'`
      )
      dashboardData.stats.totalCourses = coursesResult?.[0]?.total || 0
      
      // Total enrollments
      const [enrollmentsResult] = await query<any[]>(
        `SELECT COUNT(*) as total FROM enrollments WHERE status = 'active'`
      )
      dashboardData.stats.totalEnrollments = enrollmentsResult?.[0]?.total || 0
      
      // Total revenue (this month)
      const currentMonth = new Date().getMonth() + 1
      const currentYear = new Date().getFullYear()
      const [revenueResult] = await query<any[]>(
        `SELECT COALESCE(SUM(p.amount), 0) as total
         FROM payments p
         WHERE MONTH(p.created_at) = ? AND YEAR(p.created_at) = ?
         AND p.status = 'completed'`,
        [currentMonth, currentYear]
      )
      dashboardData.stats.monthlyRevenue = parseFloat(revenueResult?.[0]?.total || '0')
      
      // Total users by role
      const [usersByRoleResult] = await query<any[]>(
        `SELECT r.name as role, COUNT(DISTINCT u.id) as count
         FROM users u
         INNER JOIN user_roles ur ON u.id = ur.user_id
         INNER JOIN roles r ON ur.role_id = r.id
         WHERE u.status = 'active'
         GROUP BY r.name`
      )
      dashboardData.stats.usersByRole = usersByRoleResult || []
      
      // Active branches
      const [branchesResult] = await query<any[]>(
        `SELECT COUNT(*) as total FROM branches WHERE status = 'active'`
      )
      dashboardData.stats.activeBranches = branchesResult?.[0]?.total || 0
      
    } else if (primaryRole === 'admin') {
      // Admin กลาง: Both branches stats
      
      // Total students (both branches)
      const [studentsResult] = await query<any[]>(
        `SELECT COUNT(DISTINCT u.id) as total
         FROM users u
         INNER JOIN user_roles ur ON u.id = ur.user_id
         INNER JOIN roles r ON ur.role_id = r.id
         WHERE r.name IN ('student', 'parent')
         AND u.status = 'active'`
      )
      dashboardData.stats.totalStudents = studentsResult?.[0]?.total || 0
      
      // Total courses
      const [coursesResult] = await query<any[]>(
        `SELECT COUNT(*) as total FROM courses WHERE status = 'published'`
      )
      dashboardData.stats.totalCourses = coursesResult?.[0]?.total || 0
      
      // Total enrollments (both branches)
      const [enrollmentsResult] = await query<any[]>(
        `SELECT COUNT(*) as total FROM enrollments WHERE status = 'active'`
      )
      dashboardData.stats.totalEnrollments = enrollmentsResult?.[0]?.total || 0
      
      // Total revenue (both branches, this month)
      const currentMonth = new Date().getMonth() + 1
      const currentYear = new Date().getFullYear()
      const [revenueResult] = await query<any[]>(
        `SELECT COALESCE(SUM(p.amount), 0) as total
         FROM payments p
         WHERE MONTH(p.created_at) = ? AND YEAR(p.created_at) = ?
         AND p.status = 'completed'`,
        [currentMonth, currentYear]
      )
      dashboardData.stats.monthlyRevenue = parseFloat(revenueResult?.[0]?.total || '0')
      
      // Pending payments
      const [pendingPaymentsResult] = await query<any[]>(
        `SELECT COUNT(*) as total FROM payments WHERE status = 'pending'`
      )
      dashboardData.stats.pendingPayments = pendingPaymentsResult?.[0]?.total || 0
      
    } else if (primaryRole === 'tutor') {
      // Tutor: Only courses and students they teach
      
      if (tutorId && tutorCourseIds.length > 0) {
        // Number of courses teaching
        dashboardData.stats.myCourses = tutorCourseIds.length
        
        // Number of students in courses they teach
        const [studentsResult] = await query<any[]>(
          `SELECT COUNT(DISTINCT e.student_id) as total
           FROM enrollments e
           WHERE e.course_id IN (${tutorCourseIds.map(() => '?').join(',')})
           AND e.status = 'active'`,
          tutorCourseIds
        )
        dashboardData.stats.myStudents = studentsResult?.[0]?.total || 0
        
        // Teaching hours (from course_schedules)
        const [teachingHoursResult] = await query<any[]>(
          `SELECT COALESCE(SUM(TIMESTAMPDIFF(HOUR, start_datetime, end_datetime)), 0) as total
           FROM course_schedules
           WHERE tutor_id = ? AND status IN ('completed', 'ongoing')`,
          [tutorId]
        )
        dashboardData.stats.teachingHours = teachingHoursResult?.[0]?.total || 0
        
        // Teaching hours this month
        const currentMonth = new Date().getMonth() + 1
        const currentYear = new Date().getFullYear()
        const [teachingHoursMonthResult] = await query<any[]>(
          `SELECT COALESCE(SUM(TIMESTAMPDIFF(HOUR, start_datetime, end_datetime)), 0) as total
           FROM course_schedules
           WHERE tutor_id = ? 
           AND MONTH(start_datetime) = ? 
           AND YEAR(start_datetime) = ?
           AND status IN ('completed', 'ongoing')`,
          [tutorId, currentMonth, currentYear]
        )
        dashboardData.stats.teachingHoursThisMonth = teachingHoursMonthResult?.[0]?.total || 0
        
        // Pending assignments (placeholder - will need assignments table later)
        dashboardData.stats.pendingAssignments = 0
        
        // Upcoming classes (today)
        const today = new Date().toISOString().split('T')[0]
        const [upcomingClassesResult] = await query<any[]>(
          `SELECT COUNT(*) as total
           FROM course_schedules
           WHERE tutor_id = ? 
           AND DATE(start_datetime) = ?
           AND status = 'scheduled'`,
          [tutorId, today]
        )
        dashboardData.stats.upcomingClassesToday = upcomingClassesResult?.[0]?.total || 0
      } else {
        // Tutor has no courses assigned
        dashboardData.stats.myCourses = 0
        dashboardData.stats.myStudents = 0
        dashboardData.stats.teachingHours = 0
        dashboardData.stats.teachingHoursThisMonth = 0
        dashboardData.stats.pendingAssignments = 0
        dashboardData.stats.upcomingClassesToday = 0
      }
      
    } else if (primaryRole === 'branch_admin') {
      // Branch Admin: Single branch stats
      
      if (!userBranchId) {
        throw createError({
          statusCode: 400,
          message: 'Branch admin must be assigned to a branch'
        })
      }
      
      // Branch students
      const [studentsResult] = await query<any[]>(
        `SELECT COUNT(DISTINCT e.student_id) as total
         FROM enrollments e
         INNER JOIN course_branches cb ON e.course_id = cb.course_id AND e.branch_id = cb.branch_id
         WHERE e.branch_id = ? AND e.status = 'active'`,
        [userBranchId]
      )
      dashboardData.stats.branchStudents = studentsResult?.[0]?.total || 0
      
      // Branch courses
      const [coursesResult] = await query<any[]>(
        `SELECT COUNT(DISTINCT c.id) as total
         FROM courses c
         INNER JOIN course_branches cb ON c.id = cb.course_id
         WHERE cb.branch_id = ? AND c.status = 'published'`,
        [userBranchId]
      )
      dashboardData.stats.branchCourses = coursesResult?.[0]?.total || 0
      
      // Branch enrollments
      const [enrollmentsResult] = await query<any[]>(
        `SELECT COUNT(*) as total 
         FROM enrollments 
         WHERE branch_id = ? AND status = 'active'`,
        [userBranchId]
      )
      dashboardData.stats.branchEnrollments = enrollmentsResult?.[0]?.total || 0
      
      // Branch revenue (this month)
      const currentMonth = new Date().getMonth() + 1
      const currentYear = new Date().getFullYear()
      const [revenueResult] = await query<any[]>(
        `SELECT COALESCE(SUM(p.amount), 0) as total
         FROM payments p
         INNER JOIN enrollments e ON p.enrollment_id = e.id
         WHERE e.branch_id = ?
         AND MONTH(p.created_at) = ? AND YEAR(p.created_at) = ?
         AND p.status = 'completed'`,
        [userBranchId, currentMonth, currentYear]
      )
      dashboardData.stats.branchRevenue = parseFloat(revenueResult?.[0]?.total || '0')
      
      // Pending payments (branch)
      const [pendingPaymentsResult] = await query<any[]>(
        `SELECT COUNT(*) as total
         FROM payments p
         INNER JOIN enrollments e ON p.enrollment_id = e.id
         WHERE e.branch_id = ? AND p.status = 'pending'`,
        [userBranchId]
      )
      dashboardData.stats.pendingPayments = pendingPaymentsResult?.[0]?.total || 0
      
      // Active tutors (branch)
      try {
        const [tutorsResult] = await query<any[]>(
          `SELECT COUNT(DISTINCT t.id) as total
           FROM tutors t
           INNER JOIN users u ON t.user_id = u.id
           INNER JOIN tutor_branches tb ON t.id = tb.tutor_id
           WHERE tb.branch_id = ? AND t.status = 'active' AND u.status = 'active'`,
          [userBranchId]
        )
        dashboardData.stats.activeTutors = tutorsResult?.[0]?.total || 0
      } catch (error) {
        // tutor_branches table might not exist, set to 0
        dashboardData.stats.activeTutors = 0
      }
      
      // Get branch name
      const [branchResult] = await query<any[]>(
        'SELECT name FROM branches WHERE id = ?',
        [userBranchId]
      )
      dashboardData.branchName = branchResult?.[0]?.name || 'Unknown'
    }
    
    // Recent enrollments (based on role scope)
    let enrollmentsQuery = `
      SELECT 
        e.id,
        e.enrollment_date,
        e.status,
        u.first_name,
        u.last_name,
        u.username,
        c.title as course_title,
        c.price as course_price,
        b.name as branch_name
      FROM enrollments e
      INNER JOIN users u ON e.student_id = u.id
      INNER JOIN courses c ON e.course_id = c.id
      LEFT JOIN branches b ON e.branch_id = b.id
      WHERE 1=1
    `
    const enrollmentsParams: any[] = []
    
    if (primaryRole === 'tutor' && tutorCourseIds.length > 0) {
      // Tutor: Only enrollments in courses they teach
      enrollmentsQuery += ` AND e.course_id IN (${tutorCourseIds.map(() => '?').join(',')})`
      enrollmentsParams.push(...tutorCourseIds)
    } else if (primaryRole === 'branch_admin' && userBranchId) {
      enrollmentsQuery += ' AND e.branch_id = ?'
      enrollmentsParams.push(userBranchId)
    }
    
    enrollmentsQuery += ' ORDER BY e.created_at DESC LIMIT 5'
    
    const recentEnrollments = await query<any[]>(
      enrollmentsQuery,
      enrollmentsParams
    )
    
    dashboardData.recentEnrollments = (Array.isArray(recentEnrollments) ? recentEnrollments : []).map((row: any) => ({
      id: row.id,
      studentName: `${row.first_name} ${row.last_name}`,
      courseName: row.course_title,
      amount: parseFloat(row.course_price || '0'),
      date: new Date(row.enrollment_date).toLocaleDateString('th-TH'),
      branchName: row.branch_name,
      status: row.status
    }))
    
    // Recent payments (based on role scope)
    let paymentsQuery = `
      SELECT 
        p.id,
        p.amount,
        p.status,
        p.created_at,
        u.first_name,
        u.last_name,
        c.title as course_title,
        b.name as branch_name
      FROM payments p
      INNER JOIN enrollments e ON p.enrollment_id = e.id
      INNER JOIN users u ON e.student_id = u.id
      INNER JOIN courses c ON e.course_id = c.id
      LEFT JOIN branches b ON e.branch_id = b.id
      WHERE 1=1
    `
    const paymentsParams: any[] = []
    
    if (primaryRole === 'branch_admin' && userBranchId) {
      paymentsQuery += ' AND e.branch_id = ?'
      paymentsParams.push(userBranchId)
    }
    
    // Only fetch payments if not tutor
    if (primaryRole !== 'tutor') {
      paymentsQuery += ' ORDER BY p.created_at DESC LIMIT 5'
      
      const recentPayments = await query<any[]>(
        paymentsQuery,
        paymentsParams
      )
      
      dashboardData.recentPayments = (Array.isArray(recentPayments) ? recentPayments : []).map((row: any) => ({
        id: row.id,
        studentName: `${row.first_name} ${row.last_name}`,
        courseName: row.course_title,
        amount: parseFloat(row.amount || '0'),
        date: new Date(row.created_at).toLocaleDateString('th-TH'),
        branchName: row.branch_name,
        status: row.status
      }))
    } else {
      // Tutor should not see payments
      dashboardData.recentPayments = []
    }
    
    return {
      success: true,
      data: dashboardData,
      role: primaryRole
    }
    
  } catch (error: any) {
    console.error('[Dashboard API] Error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch dashboard data'
    })
  }
})

