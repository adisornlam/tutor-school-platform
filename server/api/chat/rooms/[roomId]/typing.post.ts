import { requireAuth } from '#server/utils/auth.middleware'
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
    // Emit typing event via Socket.IO
    const nitroApp = useNitroApp()
    const io = (nitroApp as any).io
    
    if (io) {
      try {
        io.to(`room:${roomId}`).emit('user_typing', {
          userId: auth.userId,
          roomId,
          timestamp: new Date().toISOString()
        })
      } catch (emitError: any) {
        // Ignore ECONNRESET errors (client disconnected)
        if (emitError.code !== 'ECONNRESET' && emitError.message !== 'read ECONNRESET') {
          console.error('[API] Error emitting typing event:', emitError)
        }
      }
    }

    return {
      success: true
    }
  } catch (error: any) {
    // Ignore ECONNRESET errors
    if (error.code !== 'ECONNRESET' && error.message !== 'read ECONNRESET') {
      console.error('[API] Error emitting typing event:', error)
      throw createError({
        statusCode: 500,
        message: error.message || 'Failed to emit typing event'
      })
    }
    return { success: true }
  }
})

