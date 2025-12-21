import { requireAuth } from '../../../utils/auth.middleware'
import { execute, query } from '../../../utils/db'
import { getUserRoles } from '../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface UpdateArticleBody {
  title?: string
  slug?: string
  excerpt?: string
  content?: string
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

  const articleId = parseInt(getRouterParam(event, 'id') || '0')
  if (!articleId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid article ID'
    })
  }

  const body = await readBody<UpdateArticleBody>()

  // Check if article exists
  const existing = await query<{ id: number; slug: string; title: string }>(
    'SELECT id, slug, title FROM articles WHERE id = ?',
    [articleId]
  )

  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Article not found'
    })
  }

  // Handle slug uniqueness
  let slug = body.slug
  if (body.title && !body.slug) {
    slug = generateSlug(body.title)
  }
  
  if (slug && slug !== existing[0].slug) {
    // Check if new slug is unique
    let uniqueSlug = slug
    let counter = 1
    while (true) {
      const slugCheck = await query<{ id: number }>(
        'SELECT id FROM articles WHERE slug = ? AND id != ?',
        [uniqueSlug, articleId]
      )
      if (slugCheck.length === 0) break
      uniqueSlug = `${slug}-${counter}`
      counter++
    }
    slug = uniqueSlug
  }

  // Validate status
  const validStatuses = ['draft', 'published', 'archived']
  let status = body.status
  if (status && !validStatuses.includes(status)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid status'
    })
  }

  // Handle published_at
  let publishedAt: Date | null = null
  if (body.published_at) {
    publishedAt = new Date(body.published_at)
  } else if (status === 'published') {
    // If status is being changed to published, set published_at to now if not already set
    const currentArticle = await query<{ published_at: Date | null; status: string }>(
      'SELECT published_at, status FROM articles WHERE id = ?',
      [articleId]
    )
    if (currentArticle.length > 0 && !currentArticle[0].published_at) {
      publishedAt = new Date()
    }
  }

  // Build update query dynamically
  const updates: string[] = []
  const values: any[] = []

  if (body.title !== undefined) {
    updates.push('title = ?')
    values.push(body.title)
  }
  if (slug !== undefined) {
    updates.push('slug = ?')
    values.push(slug)
  }
  if (body.excerpt !== undefined) {
    updates.push('excerpt = ?')
    values.push(body.excerpt)
  }
  if (body.content !== undefined) {
    updates.push('content = ?')
    values.push(body.content)
  }
  if (body.category !== undefined) {
    updates.push('category = ?')
    values.push(body.category)
  }
  if (body.icon !== undefined) {
    updates.push('icon = ?')
    values.push(body.icon)
  }
  if (body.featured_image_url !== undefined) {
    updates.push('featured_image_url = ?')
    values.push(body.featured_image_url)
  }
  if (status !== undefined) {
    updates.push('status = ?')
    values.push(status)
  }
  if (body.is_featured !== undefined) {
    updates.push('is_featured = ?')
    values.push(body.is_featured)
  }
  if (body.display_order !== undefined) {
    updates.push('display_order = ?')
    values.push(body.display_order)
  }
  if (publishedAt !== undefined) {
    updates.push('published_at = ?')
    values.push(publishedAt)
  }

  if (updates.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No fields to update'
    })
  }

  values.push(articleId)

  try {
    await execute(
      `UPDATE articles SET ${updates.join(', ')} WHERE id = ?`,
      values
    )

    return {
      success: true,
      message: 'Article updated successfully'
    }
  } catch (error: any) {
    console.error('Error updating article:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update article'
    })
  }
})

