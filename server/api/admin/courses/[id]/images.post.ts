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
  
  // Validation
  if (!body.image_url) {
    throw createError({
      statusCode: 400,
      message: 'image_url is required'
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
    const result = await execute(
      `INSERT INTO course_images (course_id, image_url, image_type, display_order, alt_text)
       VALUES (?, ?, ?, ?, ?)`,
      [
        courseId,
        body.image_url,
        body.image_type || 'gallery',
        body.display_order || 0,
        body.alt_text || null
      ]
    )

    const image = await query(
      'SELECT * FROM course_images WHERE id = ?',
      [result.insertId]
    )

    return {
      success: true,
      data: image[0]
    }
  } catch (error: any) {
    console.error('Error adding course image:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to add course image'
    })
  }
})

