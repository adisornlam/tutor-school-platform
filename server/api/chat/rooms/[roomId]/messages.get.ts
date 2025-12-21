import { requireAuth } from '#server/utils/auth.middleware'
import { getChatMessages, verifyRoomAccess } from '#server/services/chat.service'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const roomId = parseInt(getRouterParam(event, 'roomId') || '0')
  
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 50
  const offset = parseInt(query.offset as string) || 0

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
    const messages = await getChatMessages(roomId, limit, offset)
    
    return {
      success: true,
      data: messages
    }
  } catch (error: any) {
    console.error('[API] Error fetching messages:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch messages'
    })
  }
})

