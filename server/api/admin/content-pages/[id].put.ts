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
  
  const body = await readBody(event)
  const { slug, title, content, meta_title, meta_description, meta_keywords, is_active, display_order } = body
  
  // Validation
  if (!slug || !title) {
    throw createError({
      statusCode: 400,
      message: 'Slug and title are required'
    })
  }
  
  // Check if page exists
  const existing = await query<{ id: number; slug: string }>(
    'SELECT id, slug FROM content_pages WHERE id = ? LIMIT 1',
    [id]
  )
  
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Page not found'
    })
  }
  
  // Check if slug is already used by another page
  if (slug !== existing[0].slug) {
    const slugCheck = await query<{ id: number }>(
      'SELECT id FROM content_pages WHERE slug = ? AND id != ? LIMIT 1',
      [slug, id]
    )
    
    if (slugCheck.length > 0) {
      throw createError({
        statusCode: 400,
        message: 'Page with this slug already exists'
      })
    }
  }
  
  try {
    await query(
      `UPDATE content_pages 
       SET slug = ?, title = ?, content = ?, meta_title = ?, meta_description = ?, meta_keywords = ?, 
           is_active = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        slug,
        title,
        content || null,
        meta_title || null,
        meta_description || null,
        meta_keywords || null,
        is_active !== undefined ? is_active : true,
        display_order || 0,
        id
      ]
    )
    
    const [updatedPage] = await query<{
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
      'SELECT * FROM content_pages WHERE id = ? LIMIT 1',
      [id]
    )
    
    return {
      success: true,
      data: updatedPage
    }
  } catch (error: any) {
    console.error('Error updating content page:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update content page'
    })
  }
})

