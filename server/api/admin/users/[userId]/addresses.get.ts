import { requireAuth } from '#server/utils/auth.middleware'
import { query } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const userId = parseInt(getRouterParam(event, 'userId') || '0')
  
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid user ID'
    })
  }

  try {
    const addresses = await query(
      `SELECT 
        id,
        user_id,
        address_type,
        recipient_name,
        phone,
        address_line1,
        address_line2,
        subdistrict,
        district,
        province,
        postal_code,
        country,
        is_default,
        created_at,
        updated_at
      FROM user_addresses
      WHERE user_id = ?
      ORDER BY is_default DESC, created_at ASC`,
      [userId]
    )

    return {
      success: true,
      data: addresses
    }
  } catch (error: any) {
    console.error('Error fetching user addresses:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch user addresses'
    })
  }
})

