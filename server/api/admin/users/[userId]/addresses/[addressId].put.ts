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

  const body = await readBody(event)

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

  // Validate address_type if provided
  if (body.address_type) {
    const validAddressTypes = ['home', 'work', 'other']
    if (!validAddressTypes.includes(body.address_type)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid address type'
      })
    }
  }

  try {
    // If is_default is true, set all other addresses to false
    if (body.is_default) {
      await execute(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ? AND id != ?',
        [userId, addressId]
      )
    }

    // Build update query
    const updates: string[] = []
    const params: any[] = []

    if (body.address_type !== undefined) {
      updates.push('address_type = ?')
      params.push(body.address_type)
    }

    if (body.recipient_name !== undefined) {
      updates.push('recipient_name = ?')
      params.push(body.recipient_name)
    }

    if (body.phone !== undefined) {
      updates.push('phone = ?')
      params.push(body.phone)
    }

    if (body.address_line1 !== undefined) {
      updates.push('address_line1 = ?')
      params.push(body.address_line1)
    }

    if (body.address_line2 !== undefined) {
      updates.push('address_line2 = ?')
      params.push(body.address_line2 || null)
    }

    if (body.subdistrict !== undefined) {
      updates.push('subdistrict = ?')
      params.push(body.subdistrict || null)
    }

    if (body.district !== undefined) {
      updates.push('district = ?')
      params.push(body.district || null)
    }

    if (body.province !== undefined) {
      updates.push('province = ?')
      params.push(body.province)
    }

    if (body.postal_code !== undefined) {
      updates.push('postal_code = ?')
      params.push(body.postal_code)
    }

    if (body.country !== undefined) {
      updates.push('country = ?')
      params.push(body.country)
    }

    if (body.is_default !== undefined) {
      updates.push('is_default = ?')
      params.push(body.is_default)
    }

    if (updates.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No fields to update'
      })
    }

    updates.push('updated_at = CURRENT_TIMESTAMP')
    params.push(addressId, userId)

    // Update address
    await execute(
      `UPDATE user_addresses SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
      params
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
    console.error('Error updating user address:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update user address'
    })
  }
})

