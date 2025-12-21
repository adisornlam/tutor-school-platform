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

    // Check if address is used in any enrollments
    const enrollments = await query(
      'SELECT id FROM enrollments WHERE shipping_address_id = ? LIMIT 1',
      [addressId]
    )
    
    if (enrollments.length > 0) {
      throw createError({
        statusCode: 400,
        message: 'Cannot delete address that is used in enrollments'
      })
    }

    // Delete address
    await execute(
      'DELETE FROM user_addresses WHERE id = ? AND user_id = ?',
      [addressId, userId]
    )

    return {
      success: true,
      message: 'Address deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error deleting user address:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete user address'
    })
  }
})

