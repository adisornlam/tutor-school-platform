import { requireAuth } from '#server/utils/auth.middleware'
import { getUserChatRooms } from '#server/services/chat.service'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  try {
    const rooms = await getUserChatRooms(auth.userId)
    
    return {
      success: true,
      data: rooms
    }
  } catch (error: any) {
    console.error('[API] Error fetching chat rooms:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch chat rooms'
    })
  }
})

