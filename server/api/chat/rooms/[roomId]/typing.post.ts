import { requireAuth } from '#server/utils/auth.middleware'
import { verifyRoomAccess } from '#server/services/chat.service'
import { emitToRoom } from '#server/utils/sse'

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
    // Emit typing event via SSE
    await emitToRoom(roomId, 'typing', {
      userId: auth.userId,
      roomId,
      timestamp: new Date().toISOString()
    })

    return {
      success: true
    }
  } catch (error: any) {
    console.error('[API] Error emitting typing event:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to emit typing event'
    })
  }
})

