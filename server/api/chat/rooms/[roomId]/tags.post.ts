import { requireAuth } from '#server/utils/auth.middleware'
import { execute, query } from '#server/utils/db'
import { verifyRoomAccess } from '#server/services/chat.service'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const roomId = parseInt(getRouterParam(event, 'roomId') || '0')
  const body = await readBody(event)

  if (!roomId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid room ID'
    })
  }

  if (!body.tag_name || !body.tag_name.trim()) {
    throw createError({
      statusCode: 400,
      message: 'Tag name is required'
    })
  }

  // Verify access
  const hasAccess = await verifyRoomAccess(auth.userId, roomId)
  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: 'Access denied to this room'
    })
  }

  try {
    const result = await execute(
      'INSERT INTO chat_room_tags (room_id, tag_name, color, created_by) VALUES (?, ?, ?, ?)',
      [roomId, body.tag_name.trim(), body.color || '#3B82F6', auth.userId]
    )

    const tags = await query<any>(`
      SELECT 
        crt.*,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name
      FROM chat_room_tags crt
      LEFT JOIN users u ON crt.created_by = u.id
      WHERE crt.id = ?
    `, [result.insertId])

    if (!tags || tags.length === 0) {
      throw createError({
        statusCode: 500,
        message: 'Failed to retrieve created tag'
      })
    }

    const tag = tags[0]
    const formattedTag = {
      id: tag.id,
      room_id: tag.room_id,
      tag_name: tag.tag_name,
      color: tag.color,
      created_by: tag.created_by,
      created_at: tag.created_at,
      creator: {
        id: tag.created_by,
        first_name: tag.creator_first_name,
        last_name: tag.creator_last_name
      }
    }

    return {
      success: true,
      data: formattedTag
    }
  } catch (error: any) {
    console.error('[API] Error creating tag:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create tag'
    })
  }
})

