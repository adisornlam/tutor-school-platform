import { requireAuth } from '../../utils/auth.middleware'
import { execute, query } from '../../utils/db'
import { getUserRoles } from '../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface CreateArticleBody {
  title: string
  slug?: string
  excerpt?: string
  content: string
  category?: string
  icon?: string
  featured_image_url?: string
  status?: 'draft' | 'published' | 'archived'
  is_featured?: boolean
  display_order?: number
  published_at?: string
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

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

  const body = await readBody<CreateArticleBody>()

  if (!body.title || !body.content) {
    throw createError({
      statusCode: 400,
      message: 'Title and content are required'
    })
  }

  // Generate slug if not provided
  let slug = body.slug || generateSlug(body.title)
  
  // Ensure slug is unique
  let uniqueSlug = slug
  let counter = 1
  while (true) {
    const existing = await query<{ id: number }>(
      'SELECT id FROM articles WHERE slug = ?',
      [uniqueSlug]
    )
    if (existing.length === 0) break
    uniqueSlug = `${slug}-${counter}`
    counter++
  }

  // Validate status
  const validStatuses = ['draft', 'published', 'archived']
  const status = body.status && validStatuses.includes(body.status) ? body.status : 'draft'

  // Set published_at if status is published
  let publishedAt = body.published_at ? new Date(body.published_at) : null
  if (status === 'published' && !publishedAt) {
    publishedAt = new Date()
  }
  if (status !== 'published') {
    publishedAt = null
  }

  try {
    const result = await execute(
      `INSERT INTO articles (
        title, slug, excerpt, content, category, icon, 
        featured_image_url, author_id, status, is_featured, 
        display_order, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.title,
        uniqueSlug,
        body.excerpt || null,
        body.content,
        body.category || null,
        body.icon || null,
        body.featured_image_url || null,
        auth.userId,
        status,
        body.is_featured || false,
        body.display_order || 0,
        publishedAt
      ]
    )

    return {
      success: true,
      data: {
        id: result.insertId,
        slug: uniqueSlug
      }
    }
  } catch (error: any) {
    console.error('Error creating article:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create article'
    })
  }
})

