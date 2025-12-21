import { query } from '../utils/db'

export default defineEventHandler(async (event) => {
  const queryParams = getQuery(event)
  const limit = parseInt(queryParams.limit as string) || 10

  const sql = `
    SELECT 
      id,
      name,
      role,
      comment,
      rating,
      avatar_url,
      display_order
    FROM testimonials
    WHERE status = 'approved'
    ORDER BY display_order ASC, created_at DESC
    LIMIT ?
  `
  
  try {
    const testimonials = await query(sql, [limit])
    
    return {
      success: true,
      data: testimonials
    }
  } catch (error: any) {
    console.error('Error fetching testimonials:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch testimonials'
    })
  }
})

