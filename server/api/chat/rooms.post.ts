import { requireAuth } from '#server/utils/auth.middleware'
import { createChatRoom } from '#server/services/chat.service'
import { getUserWithRoles } from '#server/services/auth.service'
import type { CreateChatRoomData } from '#shared/types/chat.types'
import { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const body = await readBody<CreateChatRoomData>(event)

  // Only students can create chat rooms
  const user = await getUserWithRoles(auth.userId)
  
  if (!user || !user.roles.includes(UserRole.STUDENT)) {
    throw createError({
      statusCode: 403,
      message: 'Only students can create chat rooms'
    })
  }

  // Validation
  if (!body.course_id || !body.tutor_id) {
    throw createError({
      statusCode: 400,
      message: 'course_id and tutor_id are required'
    })
  }

  try {
    const room = await createChatRoom(auth.userId, body)
    
    return {
      success: true,
      data: room
    }
  } catch (error: any) {
    console.error('[API] Error creating chat room:', error)
    throw createError({
      statusCode: 400,
      message: error.message || 'Failed to create chat room'
    })
  }
})

