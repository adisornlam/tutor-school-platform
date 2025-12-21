import { requireAuth } from '../../../utils/auth.middleware'
import { query, execute } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const enrollmentId = parseInt(getRouterParam(event, 'id') || '0')
  
  if (!enrollmentId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid enrollment ID'
    })
  }

  try {
    // Get enrollment details before deletion
    const enrollment = await query(
      'SELECT id, course_id, branch_id, status FROM enrollments WHERE id = ?',
      [enrollmentId]
    )
    
    if (enrollment.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Enrollment not found'
      })
    }

    const enrollmentData = enrollment[0]

    // Delete enrollment
    await execute(
      'DELETE FROM enrollments WHERE id = ?',
      [enrollmentId]
    )

    // Update course_branches current_enrollments if was active
    if (enrollmentData.status === 'active') {
      await execute(
        `UPDATE course_branches 
         SET current_enrollments = GREATEST(0, current_enrollments - 1) 
         WHERE course_id = ? AND branch_id = ?`,
        [enrollmentData.course_id, enrollmentData.branch_id]
      )
    }

    return {
      success: true,
      message: 'Enrollment deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error deleting enrollment:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete enrollment'
    })
  }
})

