import { requireAuth } from '../../../../utils/auth.middleware'
import { execute, query } from '../../../../utils/db'
import { getUserRoles } from '../../../../services/auth.service'
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

  try {
    // Check if payment method exists
    const existing = await query<{ id: number; code: string; is_default: boolean }>(
      'SELECT id, code, is_default FROM payment_methods WHERE id = ?',
      [id]
    )

    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Payment method not found'
      })
    }

    const method = existing[0]

    // Prevent deletion of default payment method
    if (method.is_default) {
      throw createError({
        statusCode: 400,
        message: 'Cannot delete default payment method'
      })
    }

    // Check if there are any payments using this method
    const payments = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM payments WHERE payment_method = ?',
      [method.code]
    )

    if (payments[0].count > 0) {
      throw createError({
        statusCode: 400,
        message: `Cannot delete payment method. There are ${payments[0].count} payments using this method.`
      })
    }

    // Delete payment method (CASCADE will handle related bank_accounts and payment_gateways)
    await execute(
      'DELETE FROM payment_methods WHERE id = ?',
      [id]
    )

    return {
      success: true,
      message: 'Payment method deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error deleting payment method:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to delete payment method'
    })
  }
})

