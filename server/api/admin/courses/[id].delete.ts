import { requireAuth } from '../../../utils/auth.middleware'
import { query, execute } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const courseId = parseInt(getRouterParam(event, 'id') || '0')
  
  if (!courseId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid course ID'
    })
  }

  // Check if course exists
  const existing = await query(
    'SELECT id FROM courses WHERE id = ?',
    [courseId]
  )
  
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Course not found'
    })
  }

  // Check if course has enrollments
  const enrollments = await query(
    'SELECT id FROM enrollments WHERE course_id = ? LIMIT 1',
    [courseId]
  )
  
  if (enrollments.length > 0) {
    throw createError({
      statusCode: 409,
      message: 'Cannot delete course with existing enrollments'
    })
  }

  try {
    await execute(
      'DELETE FROM courses WHERE id = ?',
      [courseId]
    )

    return {
      success: true,
      message: 'Course deleted successfully'
    }
  } catch (error: any) {
    console.error('Error deleting course:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete course'
    })
  }
})

