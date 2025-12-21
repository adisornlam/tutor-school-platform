import { requireAuth } from '#server/utils/auth.middleware'
import { query, execute } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const userId = parseInt(getRouterParam(event, 'userId') || '0')
  const addressId = parseInt(getRouterParam(event, 'addressId') || '0')
  
  if (!userId || !addressId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid user ID or address ID'
    })
  }

  try {
    // Check if address exists and belongs to user
    const addresses = await query(
      'SELECT id FROM user_addresses WHERE id = ? AND user_id = ?',
      [addressId, userId]
    )
    
    if (addresses.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Address not found'
      })
    }

    // Set all addresses to false
    await execute(
      'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
      [userId]
    )

    // Set this address as default
    await execute(
      'UPDATE user_addresses SET is_default = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [addressId, userId]
    )

    // Get updated address
    const updated = await query(
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
      WHERE id = ? AND user_id = ?`,
      [addressId, userId]
    )

    return {
      success: true,
      data: updated[0]
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error setting default address:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to set default address'
    })
  }
})

