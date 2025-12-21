import { requireAuth } from '../../../utils/auth.middleware'
import { execute, query } from '../../../utils/db'
import { getUserRoles } from '../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  const roles = await getUserRoles(auth.userId)
  const allowedRoles: UserRole[] = ['system_admin', 'owner', 'admin']
  if (!roles.some(role => allowedRoles.includes(role as UserRole))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Admin role required.'
    })
  }

  const articleId = parseInt(getRouterParam(event, 'id') || '0')
  if (!articleId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid article ID'
    })
  }

  // Check if article exists
  const existing = await query<{ id: number }>(
    'SELECT id FROM articles WHERE id = ?',
    [articleId]
  )

  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Article not found'
    })
  }

  try {
    await execute('DELETE FROM articles WHERE id = ?', [articleId])

    return {
      success: true,
      message: 'Article deleted successfully'
    }
  } catch (error: any) {
    console.error('Error deleting article:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete article'
    })
  }
})

