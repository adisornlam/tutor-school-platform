import { requireAuth } from '#server/utils/auth.middleware'
import { verifyRoomAccess, markMessagesAsRead } from '#server/services/chat.service'

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

  // Verify access
  const hasAccess = await verifyRoomAccess(auth.userId, roomId)
  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: 'Access denied to this room'
    })
  }

  try {
    // Mark messages as read in database
    await markMessagesAsRead(roomId, auth.userId, body.messageId)

    // Emit messages_read event via Socket.IO
    const nitroApp = useNitroApp()
    const io = (nitroApp as any).io
    
    if (io) {
      try {
        io.to(`room:${roomId}`).emit('messages_read', {
          roomId,
          userId: auth.userId,
          messageId: body.messageId,
          timestamp: new Date().toISOString()
        })
      } catch (emitError: any) {
        // Ignore ECONNRESET errors (client disconnected)
        if (emitError.code !== 'ECONNRESET' && emitError.message !== 'read ECONNRESET') {
          console.error('[API] Error emitting messages_read event:', emitError)
        }
      }
    }

    return {
      success: true
    }
  } catch (error: any) {
    console.error('[API] Error marking messages as read:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to mark messages as read'
    })
  }
})

