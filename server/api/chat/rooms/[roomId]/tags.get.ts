import { requireAuth } from '#server/utils/auth.middleware'
import { query } from '#server/utils/db'
import { verifyRoomAccess } from '#server/services/chat.service'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const roomId = parseInt(getRouterParam(event, 'roomId') || '0')

  if (!roomId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid room ID'
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
    const tags = await query<any>(`
      SELECT 
        crt.*,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name
      FROM chat_room_tags crt
      LEFT JOIN users u ON crt.created_by = u.id
      WHERE crt.room_id = ?
      ORDER BY crt.created_at DESC
    `, [roomId])

    const formattedTags = tags.map((tag: any) => ({
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
    }))

    return {
      success: true,
      data: formattedTags
    }
  } catch (error: any) {
    console.error('[API] Error fetching tags:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch tags'
    })
  }
})

