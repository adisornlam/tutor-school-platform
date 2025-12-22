import { requireAuth } from '#server/utils/auth.middleware'
import { saveMessage, verifyRoomAccess, getChatRoom } from '#server/services/chat.service'

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

  // Validate message data
  if (!body.content && !body.file_url) {
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
    // Save message to database
    const message = await saveMessage({
      room_id: roomId,
      sender_id: auth.userId,
      content: body.content || null,
      message_type: body.message_type || 'text',
      file_url: body.file_url || null,
      file_name: body.file_name || null,
      file_size: body.file_size || null,
      file_type: body.file_type || null
    })

    // Emit SSE event for real-time updates (exclude sender - they get it from REST response)
    try {
      const { emitToRoom, emitToUser } = await import('#server/utils/sse')
      // Send SSE to other users in room, but NOT to the sender
      await emitToRoom(roomId, 'new_message', message, auth.userId)
      
      // Send notification to recipient if they're not in the room
      const room = await getChatRoom(roomId)
      if (room) {
        const recipientId = room.student_id === auth.userId ? room.tutor_id : room.student_id
        await emitToUser(recipientId, 'new_message_notification', {
          roomId,
          message
        })
      }
    } catch (sseError) {
      // SSE not available, continue without real-time update
      console.warn('[API] SSE not available for real-time update:', sseError)
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

