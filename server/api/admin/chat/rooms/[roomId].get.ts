import { requireAuth } from '#server/utils/auth.middleware'
import { getChatRoom } from '#server/services/chat.service'
import { getUserWithRoles } from '#server/services/auth.service'
import { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  // Check if user is admin or higher
  const user = await getUserWithRoles(auth.userId)
  
  const adminRoles = [UserRole.SYSTEM_ADMIN, UserRole.OWNER, UserRole.ADMIN]
  if (!user || !adminRoles.some(role => user.roles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Admin role required.'
    })
  }

  const roomId = parseInt(getRouterParam(event, 'roomId') || '0')

  if (!roomId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid room ID'
    })
  }

  try {
    const room = await getChatRoom(roomId)
    
    if (!room) {
      throw createError({
        statusCode: 404,
        message: 'Chat room not found'
      })
    }
    
    return {
      success: true,
      data: room
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('[API] Error fetching chat room (admin):', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch chat room'
    })
  }
})

