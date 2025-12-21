import { requireAuth } from '#server/utils/auth.middleware'
import { getChatRoom, verifyRoomAccess } from '#server/services/chat.service'

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
    const room = await getChatRoom(roomId)
    
    if (!room) {
      throw createError({
        statusCode: 404,
        message: 'Chat room not found'
      })
    }
    
    return {
      success: true,
      data: room
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('[API] Error fetching chat room:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch chat room'
    })
  }
})

