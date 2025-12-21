import { requireAuth } from '../../utils/auth.middleware'
import { query } from '../../utils/db'
import { getUserRoles } from '../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  // Check if user has admin role
  const roles = await getUserRoles(auth.userId)
  const allowedRoles: UserRole[] = ['system_admin', 'owner', 'admin', 'branch_admin']
  if (!roles.some(role => allowedRoles.includes(role as UserRole))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Admin role required.'
    })
  }
  
  const queryParams = getQuery(event)
  const search = queryParams.search as string | undefined
  const status = queryParams.status as string | undefined
  const courseId = queryParams.course_id as string | undefined
  const studentId = queryParams.student_id as string | undefined
  const branchId = queryParams.branch_id as string | undefined

  // Build SQL query
  // Note: enrollment_type and shipping_address_id columns were added in a migration
  // Check if columns exist first, then build appropriate query
  const params: any[] = []
  
  // Check if new columns exist
  let hasEnrollmentType = false
  let hasShippingAddress = false
  
  try {
    const columnCheck = await query<{ COLUMN_NAME: string }>(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() 
       AND TABLE_NAME = 'enrollments' 
       AND COLUMN_NAME IN ('enrollment_type', 'shipping_address_id')`
    )
    
    hasEnrollmentType = columnCheck.some(col => col.COLUMN_NAME === 'enrollment_type')
    hasShippingAddress = columnCheck.some(col => col.COLUMN_NAME === 'shipping_address_id')
  } catch (error: any) {
    console.log('[Enrollments API] Could not check column existence, assuming columns don\'t exist')
  }

  // Build SELECT clause based on column existence
  const enrollmentTypeSelect = hasEnrollmentType 
    ? `COALESCE(e.enrollment_type, 'onsite') as enrollment_type`
    : `'onsite' as enrollment_type`
  
  const shippingAddressSelect = hasShippingAddress
    ? `e.shipping_address_id`
    : `NULL as shipping_address_id`

  let sql = `
    SELECT 
      e.id,
      e.student_id,
      e.course_id,
      e.branch_id,
      ${enrollmentTypeSelect},
      ${shippingAddressSelect},
      e.enrollment_date,
      e.status,
      e.payment_id,
      e.created_at,
      e.updated_at,
      s.username as student_username,
      s.first_name as student_first_name,
      s.last_name as student_last_name,
      s.email as student_email,
      c.title as course_title,
      c.code as course_code,
      c.price as course_price,
      b.name as branch_name,
      b.code as branch_code
    FROM enrollments e
    INNER JOIN users s ON e.student_id = s.id
    INNER JOIN courses c ON e.course_id = c.id
    LEFT JOIN branches b ON e.branch_id = b.id
    WHERE 1=1
  `

  if (search) {
    sql += ` AND (
      s.username LIKE ? OR 
      s.first_name LIKE ? OR 
      s.last_name LIKE ? OR 
      s.email LIKE ? OR
      c.title LIKE ? OR 
      c.code LIKE ?
    )`
    const searchPattern = `%${search}%`
    params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern)
  }

  if (status) {
    sql += ` AND e.status = ?`
    params.push(status)
  }

  if (courseId) {
    sql += ` AND e.course_id = ?`
    params.push(parseInt(courseId))
  }

  if (studentId) {
    sql += ` AND e.student_id = ?`
    params.push(parseInt(studentId))
  }

  if (branchId) {
    sql += ` AND e.branch_id = ?`
    params.push(parseInt(branchId))
  }

  sql += ` ORDER BY e.created_at DESC`

  try {
    const enrollments = await query(sql, params)
    
    return {
      success: true,
      data: enrollments
    }
  } catch (error: any) {
    console.error('Error fetching enrollments:', error)
    console.error('SQL:', sql)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState
    })
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch enrollments'
    })
  }
})

