import { requireAuth } from '../../../../../../utils/auth.middleware'
import { execute, query } from '../../../../../../utils/db'
import { getUserRoles } from '../../../../../../services/auth.service'
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

  const paymentMethodId = parseInt(getRouterParam(event, 'id') || '0')
  const accountId = parseInt(getRouterParam(event, 'accountId') || '0')
  
  if (!paymentMethodId || !accountId) {
    throw createError({
      statusCode: 400,
      message: 'Payment method ID and account ID are required'
    })
  }

  try {
    // Verify bank account exists and belongs to the payment method
    const accounts = await query<{ id: number; is_default: boolean }>(
      'SELECT id, is_default FROM bank_accounts WHERE id = ? AND payment_method_id = ?',
      [accountId, paymentMethodId]
    )

    if (accounts.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Bank account not found'
      })
    }

    const account = accounts[0]

    // Prevent deletion of default account
    if (account.is_default) {
      throw createError({
        statusCode: 400,
        message: 'Cannot delete default bank account'
      })
    }

    // Delete bank account
    await execute(
      'DELETE FROM bank_accounts WHERE id = ?',
      [accountId]
    )

    return {
      success: true,
      message: 'Bank account deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error deleting bank account:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to delete bank account'
    })
  }
})

