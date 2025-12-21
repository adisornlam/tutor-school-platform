import { query } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Article slug is required'
    })
  }

  try {
    const articles = await query<{
      id: number
      title: string
      slug: string
      excerpt: string | null
      content: string
      category: string | null
      icon: string | null
      featured_image_url: string | null
      is_featured: boolean
      view_count: number
      published_at: Date | null
      created_at: Date
      updated_at: Date
      author_first_name: string | null
      author_last_name: string | null
    }>(
      `SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.content,
        a.category,
        a.icon,
        a.featured_image_url,
        a.is_featured,
        a.view_count,
        a.published_at,
        a.created_at,
        a.updated_at,
        u.first_name as author_first_name,
        u.last_name as author_last_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.slug = ? AND a.status = 'published'`,
      [slug]
    )

    if (articles.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Article not found'
      })
    }

    const article = articles[0]

    // Increment view count
    try {
      await query(
        'UPDATE articles SET view_count = view_count + 1 WHERE id = ?',
        [article.id]
      )
    } catch (error) {
      // Ignore error if update fails
      console.error('Failed to increment view count:', error)
    }

    return {
      success: true,
      data: {
        ...article,
        author_name: article.author_first_name && article.author_last_name
          ? `${article.author_first_name} ${article.author_last_name}`
          : null
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error fetching article:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch article'
    })
  }
})

