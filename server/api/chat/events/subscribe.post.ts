import { requireAuth } from '#server/utils/auth.middleware'
import { subscribeToRoom, sendSSE, userConnections } from '#server/utils/sse'
import { verifyRoomAccess } from '#server/services/chat.service'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const body = await readBody(event)
  const roomId = parseInt(body.roomId || '0')
  
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

  // Subscribe user to room
  subscribeToRoom(roomId, auth.userId)
  console.log(`[SSE] ✅ User ${auth.userId} subscribed to room ${roomId} via API`)

  // Notify all user's connections about the subscription
  const connections = userConnections.get(auth.userId)
  if (connections) {
    for (const conn of connections) {
      try {
        await sendSSE(conn, 'room_subscribed', {
          roomId,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error(`[SSE] Error sending room_subscribed to user ${auth.userId}:`, error)
      }
    }
  }

  return {
    success: true,
    roomId
  }
})

