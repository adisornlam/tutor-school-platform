import { requireAuth } from '#server/utils/auth.middleware'
import { subscribeUser, unsubscribeUser, subscribeToRoom, unsubscribeFromRoom, sendSSE } from '#server/utils/sse'
import { getUserChatRooms, verifyRoomAccess } from '#server/services/chat.service'

export default defineEventHandler(async (event) => {
  // For SSE, we need to handle auth differently since EventSource doesn't support custom headers
  // Try to get token from query param first, then fallback to cookie/header
  const query = getQuery(event)
  let userId: number
  
  if (query.token) {
    // Verify token from query param
    try {
      const { verifyAccessToken } = await import('#server/utils/jwt')
      const { getUserWithRoles } = await import('#server/services/auth.service')
      const payload = verifyAccessToken(query.token as string)
      const user = await getUserWithRoles(payload.userId)
      if (!user) {
        throw createError({
          statusCode: 401,
          message: 'User not found'
        })
      }
      userId = user.id
    } catch (error) {
      throw createError({
        statusCode: 401,
        message: 'Invalid token'
      })
    }
  } else {
    // Fallback to standard auth
    const auth = await requireAuth(event)
    userId = auth.userId
  }

  // Set SSE headers
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'X-Accel-Buffering', 'no') // Disable nginx buffering
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Credentials', 'true')

  console.log(`[SSE] User ${userId} connecting to chat events stream`)

  // Subscribe user to SSE
  subscribeUser(userId, event)

  // Subscribe to user's chat rooms
  try {
    const rooms = await getUserChatRooms(userId)
    console.log(`[SSE] User ${userId} has ${rooms.length} rooms:`, rooms.map(r => ({ id: r.id, course_id: r.course_id, student_id: r.student_id, tutor_id: r.tutor_id })))
    for (const room of rooms) {
      subscribeToRoom(room.id, userId)
    }
    console.log(`[SSE] ✅ User ${userId} subscribed to ${rooms.length} rooms`)
  } catch (error) {
    console.error(`[SSE] ❌ Error loading rooms for user ${userId}:`, error)
  }

  // Send initial connection event
  await sendSSE(event, 'connected', {
    userId,
    timestamp: new Date().toISOString()
  })

  // Keep connection alive with heartbeat
  const heartbeatInterval = setInterval(async () => {
    try {
      await sendSSE(event, 'heartbeat', {
        timestamp: Date.now()
      })
    } catch (error) {
      // Connection closed, stop heartbeat
      clearInterval(heartbeatInterval)
    }
  }, 30000) // Every 30 seconds

  // Handle query params for room subscription (query already defined above)
  if (query.roomId) {
    const roomId = parseInt(query.roomId as string)
    if (roomId) {
      try {
        const hasAccess = await verifyRoomAccess(userId, roomId)
        if (hasAccess) {
          subscribeToRoom(roomId, userId)
          await sendSSE(event, 'room_subscribed', {
            roomId,
            timestamp: new Date().toISOString()
          })
        }
      } catch (error) {
        console.error(`[SSE] Error subscribing to room ${roomId}:`, error)
      }
    }
  }

  // Cleanup on disconnect
  event.node.req.on('close', () => {
    console.log(`[SSE] User ${userId} disconnected`)
    clearInterval(heartbeatInterval)
    unsubscribeUser(userId, event)
    
    // Unsubscribe from all rooms
    try {
      const rooms = getUserChatRooms(userId)
      rooms.then(roomList => {
        for (const room of roomList) {
          unsubscribeFromRoom(room.id, userId)
        }
      }).catch(console.error)
    } catch (error) {
      console.error(`[SSE] Error unsubscribing from rooms:`, error)
    }
  })

  // Handle errors
  event.node.req.on('error', (error) => {
    console.error(`[SSE] Connection error for user ${userId}:`, error)
    clearInterval(heartbeatInterval)
    unsubscribeUser(userId, event)
  })

  // Keep connection open
  return new Promise(() => {
    // Connection will be kept open by SSE stream
  })
})

