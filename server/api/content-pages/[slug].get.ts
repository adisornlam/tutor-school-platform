import { query } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug parameter is required'
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
      created_at: Date
      updated_at: Date
    }>(
      'SELECT id, slug, title, content, meta_title, meta_description, meta_keywords, is_active, created_at, updated_at FROM content_pages WHERE slug = ? AND is_active = TRUE LIMIT 1',
      [slug]
    )
    
    if (pages.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Page not found'
      })
    }
    
    return {
      success: true,
      data: pages[0]
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error fetching content page:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch content page'
    })
  }
})

