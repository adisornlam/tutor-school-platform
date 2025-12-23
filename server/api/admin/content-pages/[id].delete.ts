import { requireAuth } from '../../../utils/auth.middleware'
import { query } from '../../../utils/db'
import { getUserRoles } from '../../../services/auth.service'
import { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  const roles = await getUserRoles(auth.userId)
  const allowedRoles: UserRole[] = [UserRole.SYSTEM_ADMIN, UserRole.OWNER, UserRole.ADMIN]
  
  if (!roles.some(role => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Admin role required.'
    })
  }
  
  const id = parseInt(getRouterParam(event, 'id') || '0')
  
  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      message: 'Valid ID is required'
    })
  }
  
  // Check if page exists
  const existing = await query<{ id: number }>(
    'SELECT id FROM content_pages WHERE id = ? LIMIT 1',
    [id]
  )
  
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Page not found'
    })
  }
  
  try {
    await query('DELETE FROM content_pages WHERE id = ?', [id])
    
    return {
      success: true,
      message: 'Page deleted successfully'
    }
  } catch (error: any) {
    console.error('Error deleting content page:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete content page'
    })
  }
})

