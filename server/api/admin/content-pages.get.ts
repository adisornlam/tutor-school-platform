import { requireAuth } from '../../utils/auth.middleware'
import { query } from '../../utils/db'
import { getUserRoles } from '../../services/auth.service'
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
  
  try {
    const pages = await query<{
      id: number
      slug: string
      title: string
      content: string | null
      meta_title: string | null
      meta_description: string | null
      meta_keywords: string | null
      is_active: boolean
      display_order: number
      created_by: number
      created_at: Date
      updated_at: Date
    }>(
      'SELECT id, slug, title, content, meta_title, meta_description, meta_keywords, is_active, display_order, created_by, created_at, updated_at FROM content_pages ORDER BY display_order ASC, title ASC'
    )
    
    return {
      success: true,
      data: pages
    }
  } catch (error: any) {
    console.error('Error fetching content pages:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch content pages'
    })
  }
})

