import { requireAuth } from '#server/utils/auth.middleware'
import { query, execute } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const courseId = parseInt(getRouterParam(event, 'id') || '0')
  
  if (!courseId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid course ID'
    })
  }

  const body = await readBody(event)
  
  if (!body.status) {
    throw createError({
      statusCode: 400,
      message: 'Status is required'
    })
  }

  // Validate status
  const validStatuses = ['draft', 'published', 'archived']
  if (!validStatuses.includes(body.status)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid course status'
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

  try {
    await execute(
      'UPDATE courses SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [body.status, courseId]
    )

    const course = await query(
      'SELECT * FROM courses WHERE id = ?',
      [courseId]
    )

    return {
      success: true,
      data: course[0]
    }
  } catch (error: any) {
    console.error('Error updating course status:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update course status'
    })
  }
})

