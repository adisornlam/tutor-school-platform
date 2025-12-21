// Example API route that emits Socket.IO events
// Best Practice: Use nitroApp.io to emit events from API routes

export default defineEventHandler(async (event) => {
  const nitroApp = useNitroApp()
  const io = nitroApp.io

  if (!io) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Socket.IO not initialized'
    })
  }

  const body = await readBody(event)
  const { userId, message, roomId } = body

  // Emit to specific user
  if (userId) {
    io.to(`user:${userId}`).emit('notification', {
      message: message || 'You have a new notification',
      timestamp: new Date().toISOString()
    })
    console.log(`[API] Notification sent to user:${userId}`)
  }

  // Emit to specific room
  if (roomId) {
    io.to(`room:${roomId}`).emit('room_notification', {
      message: message || 'Room notification',
      timestamp: new Date().toISOString()
    })
    console.log(`[API] Notification sent to room:${roomId}`)
  }

  // Emit to all clients (if no specific target)
  if (!userId && !roomId) {
    io.emit('broadcast', {
      message: message || 'Broadcast message',
      timestamp: new Date().toISOString()
    })
    console.log('[API] Broadcast sent to all clients')
  }

  return {
    success: true,
    message: 'Notification sent'
  }
})

