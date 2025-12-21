import { requireAuth } from '#server/utils/auth.middleware'
import { query, execute } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const userId = parseInt(getRouterParam(event, 'userId') || '0')
  
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid user ID'
    })
  }

  const body = await readBody(event)
  
  // Validation
  if (!body.recipient_name || !body.phone || !body.address_line1 || !body.province || !body.postal_code) {
    throw createError({
      statusCode: 400,
      message: 'Recipient name, phone, address line 1, province, and postal code are required'
    })
  }

  // Validate address_type
  const validAddressTypes = ['home', 'work', 'other']
  if (body.address_type && !validAddressTypes.includes(body.address_type)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid address type'
    })
  }

  try {
    // Check if user exists
    const users = await query(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    )
    
    if (users.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    // If is_default is true, set all other addresses to false
    if (body.is_default) {
      await execute(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
        [userId]
      )
    }

    // Insert address
    const result = await execute(
      `INSERT INTO user_addresses (
        user_id, address_type, recipient_name, phone,
        address_line1, address_line2, subdistrict, district,
        province, postal_code, country, is_default
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        body.address_type || 'home',
        body.recipient_name,
        body.phone,
        body.address_line1,
        body.address_line2 || null,
        body.subdistrict || null,
        body.district || null,
        body.province,
        body.postal_code,
        body.country || 'Thailand',
        body.is_default || false
      ]
    )

    // Get created address
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
      WHERE id = ?`,
      [result.insertId]
    )

    return {
      success: true,
      data: addresses[0]
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error creating user address:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create user address'
    })
  }
})

