import { requireAuth } from '../../../../../utils/auth.middleware'
import { query } from '../../../../../utils/db'
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

  const paymentMethodId = parseInt(getRouterParam(event, 'id') || '0')
  if (!paymentMethodId) {
    throw createError({
      statusCode: 400,
      message: 'Payment method ID is required'
    })
  }

  try {
    // Verify payment method exists and is bank_transfer type
    const methods = await query<{ id: number; type: string }>(
      'SELECT id, type FROM payment_methods WHERE id = ?',
      [paymentMethodId]
    )

    if (methods.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Payment method not found'
      })
    }

    if (methods[0].type !== 'bank_transfer') {
      throw createError({
        statusCode: 400,
        message: 'Bank accounts are only available for bank_transfer payment methods'
      })
    }

    const accounts = await query(
      `SELECT 
        id,
        payment_method_id,
        bank_name,
        account_name,
        account_number,
        account_type,
        branch_name,
        qr_code_url,
        is_active,
        is_default,
        display_order,
        created_at,
        updated_at
      FROM bank_accounts
      WHERE payment_method_id = ?
      ORDER BY display_order, bank_name, account_name`,
      [paymentMethodId]
    )

    return {
      success: true,
      data: accounts
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error fetching bank accounts:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch bank accounts'
    })
  }
})

