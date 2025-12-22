import { requireAuth } from '#server/utils/auth.middleware'
import { getChatMessages, verifyRoomAccess } from '#server/services/chat.service'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const roomId = parseInt(getRouterParam(event, 'roomId') || '0')
  
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 50
  const offset = parseInt(query.offset as string) || 0
  const since = query.since ? parseInt(query.since as string) : undefined

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
    let messages = await getChatMessages(roomId, limit, offset)
    
    // If "since" parameter is provided, filter messages after that ID
    if (since) {
      messages = messages.filter(msg => {
        const msgId = msg.id as number
        return typeof msgId === 'number' && msgId > since
      })
    }
    
    return {
      success: true,
      data: messages
    }
  } catch (error: any) {
    console.error('[API] Error fetching messages:', error)
    console.error('[API] Error details:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      stack: error.stack
    })
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch messages',
      data: process.env.NODE_ENV === 'development' ? {
        originalError: error.message,
        code: error.code,
        sqlState: error.sqlState
      } : undefined
    })
  }
})

