import { requireAuth } from '#server/utils/auth.middleware'
import { saveMessage, verifyRoomAccess, getChatRoom } from '#server/services/chat.service'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const roomId = parseInt(getRouterParam(event, 'roomId') || '0')
  const body = await readBody(event)
  
  console.log('[API] 📨 POST /chat/rooms/[roomId]/messages called:', {
    roomId,
    userId: auth.userId,
    content: body.content?.substring(0, 50),
    messageType: body.message_type,
    hasFile: !!body.file_url,
    timestamp: new Date().toISOString()
  })
  
  if (!roomId) {
    console.error('[API] ❌ Invalid room ID:', roomId)
    throw createError({
      statusCode: 400,
      message: 'Invalid room ID'
    })
  }

  // Validate message data
  if (!body.content && !body.file_url) {
    console.error('[API] ❌ Message content or file is required')
    throw createError({
      statusCode: 400,
      message: 'Message content or file is required'
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
    console.log('[API] 💾 Saving message to database...')
    // Save message to database
    const message = await saveMessage({
      room_id: roomId,
      sender_id: auth.userId,
      content: body.content || null,
      message_type: body.message_type || 'text',
      file_url: body.file_url || null,
      file_name: body.file_name || null,
      file_size: body.file_size || null,
      file_type: body.file_type || null,
      reply_to_id: body.reply_to_id || null
    })
    
    console.log('[API] ✅ Message saved to database:', {
      messageId: message.id,
      roomId: message.room_id,
      senderId: message.sender_id,
      content: message.content?.substring(0, 50),
      createdAt: message.created_at
    })

    // Emit Socket.IO event for real-time updates (exclude sender - they get it from REST response)
    try {
      const nitroApp = useNitroApp()
      const io = (nitroApp as any).io
      
      if (io) {
        console.log(`[API] 📤 Sending message ${message.id} via Socket.IO to room ${roomId}, sender: ${auth.userId}`)
        
        // Get room info to identify recipient and course
        const room = await getChatRoom(roomId)
        const recipientId = room ? (room.student_id === auth.userId ? room.tutor_id : room.student_id) : null
        const courseId = room?.course_id
        
        try {
          // ✅ Performance: Emit directly without fetching sockets (unless debug mode)
          // fetchSockets() is expensive with many connections - only use for debugging
          const DEBUG_MODE = process.env.DEBUG_SOCKET_ROOMS === 'true'
          
          if (DEBUG_MODE) {
            // Only fetch sockets in debug mode
            const roomSockets = await io.in(`room:${roomId}`).fetchSockets()
            console.log(`[API] 🔍 Room ${roomId} has ${roomSockets.length} connected socket(s)`)
            
            const userIdsInRoom = roomSockets.map((s: any) => {
              const userId = s.data?.userId || s.data?.user?.id
              return {
                socketId: s.id,
                userId: userId,
                rooms: Array.from(s.rooms || [])
              }
            })
            console.log(`[API] 👥 Users in room ${roomId}:`, JSON.stringify(userIdsInRoom, null, 2))
            
            if (room && recipientId) {
              const recipientInRoom = userIdsInRoom.some(u => u.userId === recipientId)
              console.log(`[API] 🎯 Recipient ${recipientId} in room ${roomId}:`, recipientInRoom)
            }
          }
          
          // Send to all users in room, but NOT to the sender
          // Use try-catch to handle disconnected sockets gracefully
          try {
            io.to(`room:${roomId}`).emit('new_message', message)
            if (DEBUG_MODE) {
              console.log(`[API] ✅ Emitted 'new_message' to room ${roomId} (excluded sender ${auth.userId})`)
            }
          } catch (emitError: any) {
            // Ignore ECONNRESET errors (client disconnected)
            if (emitError.code !== 'ECONNRESET' && emitError.message !== 'read ECONNRESET') {
              console.error(`[API] ❌ Error emitting to room ${roomId}:`, emitError)
            }
          }
          
          // Also send to course room for broadcast (optional - for notifications)
          // ✅ Performance: Skip fetchSockets() - emit directly
          if (courseId) {
            try {
              io.to(`course:${courseId}`).emit('course_message_notification', {
                roomId,
                message,
                recipientId
              })
              if (DEBUG_MODE) {
                console.log(`[API] 📢 Sent course notification to course:${courseId}`)
              }
            } catch (courseError: any) {
              if (courseError.code !== 'ECONNRESET' && courseError.message !== 'read ECONNRESET') {
                console.error(`[API] ❌ Error emitting to course ${courseId}:`, courseError)
              }
            }
          }
          
          // Send notification to recipient (personal notification)
          // ✅ Performance: Emit directly without fetching sockets
          if (room && recipientId) {
            try {
              io.to(`user:${recipientId}`).emit('new_message_notification', {
                roomId,
                message
              })
              if (DEBUG_MODE) {
                console.log(`[API] ✅ Sent notification to recipient ${recipientId}`)
              }
            } catch (notifyError: any) {
              // Ignore ECONNRESET errors
              if (notifyError.code !== 'ECONNRESET' && notifyError.message !== 'read ECONNRESET') {
                console.error(`[API] ❌ Error sending notification to recipient ${recipientId}:`, notifyError)
              }
            }
          }
        } catch (socketError: any) {
          // Ignore ECONNRESET errors (client disconnected during operation)
          if (socketError.code !== 'ECONNRESET' && socketError.message !== 'read ECONNRESET') {
            console.error('[API] ❌ Socket.IO error:', socketError)
          }
        }
      } else {
        console.warn('[API] ⚠️  Socket.IO not available')
      }
    } catch (socketError) {
      console.error('[API] ❌ Socket.IO error for real-time update:', socketError)
    }

    return {
      success: true,
      data: message
    }
  } catch (error: any) {
    console.error('[API] Error sending message:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to send message'
    })
  }
})

