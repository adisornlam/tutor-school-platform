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
  
  const body = await readBody(event)
  const { slug, title, content, meta_title, meta_description, meta_keywords, is_active, display_order } = body
  
  // Validation
  if (!slug || !title) {
    throw createError({
      statusCode: 400,
      message: 'Slug and title are required'
    })
  }
  
  // Check if slug already exists
  const existing = await query<{ id: number }>(
    'SELECT id FROM content_pages WHERE slug = ? LIMIT 1',
    [slug]
  )
  
  if (existing.length > 0) {
    throw createError({
      statusCode: 400,
      message: 'Page with this slug already exists'
    })
  }
  
  try {
    const result = await query<{ insertId: number }>(
      `INSERT INTO content_pages (slug, title, content, meta_title, meta_description, meta_keywords, is_active, display_order, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        title,
        content || null,
        meta_title || null,
        meta_description || null,
        meta_keywords || null,
        is_active !== undefined ? is_active : true,
        display_order || 0,
        auth.userId
      ]
    )
    
    const [newPage] = await query<{
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
      [result.insertId]
    )
    
    return {
      success: true,
      data: newPage
    }
  } catch (error: any) {
    console.error('Error creating content page:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create content page'
    })
  }
})

