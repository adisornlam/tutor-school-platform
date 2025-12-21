import { requireAuth } from '#server/utils/auth.middleware'
import { query, execute } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const courseId = parseInt(getRouterParam(event, 'id') || '0')
  const imageId = parseInt(getRouterParam(event, 'imageId') || '0')
  
  if (!courseId || !imageId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid course ID or image ID'
    })
  }

  // Check if image exists and belongs to the course
  const existing = await query(
    'SELECT id FROM course_images WHERE id = ? AND course_id = ?',
    [imageId, courseId]
  )
  
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Course image not found'
    })
  }

  try {
    await execute(
      'DELETE FROM course_images WHERE id = ? AND course_id = ?',
      [imageId, courseId]
    )

    return {
      success: true,
      message: 'Course image deleted successfully'
    }
  } catch (error: any) {
    console.error('Error deleting course image:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete course image'
    })
  }
})

