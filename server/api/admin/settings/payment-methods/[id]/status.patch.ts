import { requireAuth } from '../../../../../utils/auth.middleware'
import { execute, query } from '../../../../../utils/db'
import { getUserRoles } from '../../../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  const roles = await getUserRoles(auth.userId)
  const allowedRoles: UserRole[] = ['system_admin', 'owner']
  if (!roles.some(role => allowedRoles.includes(role as UserRole))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. System Admin or Owner role required.'
    })
  }

  const id = parseInt(getRouterParam(event, 'id') || '0')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Payment method ID is required'
    })
  }

  const body = await readBody<{ is_active: boolean }>()

  if (body.is_active === undefined) {
    throw createError({
      statusCode: 400,
      message: 'is_active is required'
    })
  }

  try {
    // Check if payment method exists
    const existing = await query<{ id: number; is_default: boolean }>(
      'SELECT id, is_default FROM payment_methods WHERE id = ?',
      [id]
    )

    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Payment method not found'
      })
    }

    // Cannot deactivate default payment method
    if (existing[0].is_default && !body.is_active) {
      throw createError({
        statusCode: 400,
        message: 'Cannot deactivate default payment method'
      })
    }

    // Update status
    await execute(
      'UPDATE payment_methods SET is_active = ?, updated_at = NOW() WHERE id = ?',
      [body.is_active, id]
    )

    // Get updated payment method
    const updated = await query<any>(
      'SELECT * FROM payment_methods WHERE id = ?',
      [id]
    )

    return {
      success: true,
      data: updated[0],
      message: `Payment method ${body.is_active ? 'activated' : 'deactivated'} successfully`
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error updating payment method status:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to update payment method status'
    })
  }
})

