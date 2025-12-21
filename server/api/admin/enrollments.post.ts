import { requireAuth } from '../../utils/auth.middleware'
import { query, execute } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  const body = await readBody(event)
  
  // Validation
  if (!body.student_id || !body.course_id) {
    throw createError({
      statusCode: 400,
      message: 'Student ID and Course ID are required'
    })
  }

  // Validate enrollment_type
  const enrollmentType = body.enrollment_type || 'onsite'
  if (!['onsite', 'online'].includes(enrollmentType)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid enrollment type. Must be "onsite" or "online"'
    })
  }

  // For onsite enrollment, branch_id is required
  // For online enrollment, shipping_address_id is required
  if (enrollmentType === 'onsite' && !body.branch_id) {
    throw createError({
      statusCode: 400,
      message: 'Branch ID is required for onsite enrollment'
    })
  }

  if (enrollmentType === 'online' && !body.shipping_address_id) {
    throw createError({
      statusCode: 400,
      message: 'Shipping address ID is required for online enrollment'
    })
  }

  // Validate status if provided
  const validStatuses = ['pending', 'active', 'completed', 'cancelled']
  if (body.status && !validStatuses.includes(body.status)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid enrollment status'
    })
  }

  try {
    // Check if student exists
    const students = await query(
      'SELECT id FROM users WHERE id = ?',
      [body.student_id]
    )
    
    if (students.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Student not found'
      })
    }

    // Check if course exists
    const courses = await query(
      'SELECT id FROM courses WHERE id = ?',
      [body.course_id]
    )
    
    if (courses.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Course not found'
      })
    }

    // Check if branch exists (only for onsite enrollment)
    if (enrollmentType === 'onsite') {
      const branches = await query(
        'SELECT id FROM branches WHERE id = ? AND status = "active"',
        [body.branch_id]
      )
      
      if (branches.length === 0) {
        throw createError({
          statusCode: 404,
          message: 'Branch not found or inactive'
        })
      }
    }

    // Check if shipping address exists and belongs to student (only for online enrollment)
    if (enrollmentType === 'online') {
      const addresses = await query(
        'SELECT id FROM user_addresses WHERE id = ? AND user_id = ?',
        [body.shipping_address_id, body.student_id]
      )
      
      if (addresses.length === 0) {
        throw createError({
          statusCode: 404,
          message: 'Shipping address not found or does not belong to student'
        })
      }
    }

    // Check if enrollment already exists
    let existingQuery = ''
    let existingParams: any[] = []
    
    if (enrollmentType === 'onsite') {
      existingQuery = 'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ? AND branch_id = ? AND enrollment_type = ?'
      existingParams = [body.student_id, body.course_id, body.branch_id, enrollmentType]
    } else {
      existingQuery = 'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ? AND enrollment_type = ? AND shipping_address_id = ?'
      existingParams = [body.student_id, body.course_id, enrollmentType, body.shipping_address_id]
    }
    
    const existing = await query(existingQuery, existingParams)
    
    if (existing.length > 0) {
      throw createError({
        statusCode: 409,
        message: 'Enrollment already exists for this student and course'
      })
    }

    // Insert enrollment
    const result = await execute(
      `INSERT INTO enrollments (
        student_id, course_id, branch_id, enrollment_type, shipping_address_id,
        enrollment_date, status, payment_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.student_id,
        body.course_id,
        enrollmentType === 'onsite' ? body.branch_id : null,
        enrollmentType,
        enrollmentType === 'online' ? body.shipping_address_id : null,
        body.enrollment_date || new Date(),
        body.status || 'pending',
        body.payment_id || null
      ]
    )

    const enrollmentId = result.insertId

    // Update course_branches current_enrollments if needed (only for onsite)
    if (body.status === 'active' && enrollmentType === 'onsite' && body.branch_id) {
      await execute(
        `UPDATE course_branches 
         SET current_enrollments = current_enrollments + 1 
         WHERE course_id = ? AND branch_id = ?`,
        [body.course_id, body.branch_id]
      )
    }

    // Get enrollment with related data
    let enrollmentQuery = `
      SELECT 
        e.id,
        e.student_id,
        e.course_id,
        e.branch_id,
        e.enrollment_type,
        e.shipping_address_id,
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
        b.name as branch_name,
        b.code as branch_code
      FROM enrollments e
      INNER JOIN users s ON e.student_id = s.id
      INNER JOIN courses c ON e.course_id = c.id
      LEFT JOIN branches b ON e.branch_id = b.id
      WHERE e.id = ?
    `
    
    const enrollment = await query(enrollmentQuery, [enrollmentId])

    return {
      success: true,
      data: enrollment[0]
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error creating enrollment:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create enrollment'
    })
  }
})

