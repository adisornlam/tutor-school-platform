import { requireAuth } from '#server/utils/auth.middleware'
import { getAllChatRooms } from '#server/services/chat.service'
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

  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 50
  const offset = parseInt(query.offset as string) || 0
  const filters: any = {}

  if (query.status) {
    filters.status = query.status as 'active' | 'archived' | 'closed'
  }
  if (query.courseId) {
    filters.courseId = parseInt(query.courseId as string)
  }
  if (query.studentId) {
    filters.studentId = parseInt(query.studentId as string)
  }
  if (query.tutorId) {
    filters.tutorId = parseInt(query.tutorId as string)
  }

  try {
    const result = await getAllChatRooms(limit, offset, filters)
    
    return {
      success: true,
      data: result.rooms,
      pagination: {
        total: result.total,
        limit,
        offset,
        totalPages: Math.ceil(result.total / limit)
      }
    }
  } catch (error: any) {
    console.error('[API] Error fetching chat rooms (admin):', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch chat rooms'
    })
  }
})

