import { query } from '../utils/db'

export default defineEventHandler(async (event) => {
  const queryParams = getQuery(event)
  const limit = parseInt(queryParams.limit as string) || 10
  const category = queryParams.category as string | undefined
  const featured = queryParams.featured === 'true'

  let sql = `
    SELECT 
      id,
      title,
      slug,
      excerpt,
      category,
      icon,
      featured_image_url,
      is_featured,
      view_count,
      published_at,
      created_at
    FROM articles
    WHERE status = 'published'
  `
  
  const params: any[] = []

  if (category) {
    sql += ` AND category = ?`
    params.push(category)
  }

  if (featured) {
    sql += ` AND is_featured = TRUE`
  }

  sql += ` ORDER BY display_order ASC, published_at DESC LIMIT ?`
  params.push(limit)

  try {
    const articles = await query(sql, params)
    
    return {
      success: true,
      data: articles
    }
  } catch (error: any) {
    console.error('Error fetching articles:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch articles'
    })
  }
})

