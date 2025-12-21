import { requireAuth } from '../../../../../utils/auth.middleware'
import { execute, query } from '../../../../../utils/db'
import { getUserRoles } from '../../../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface CreateBankAccountBody {
  bank_name: string
  account_name: string
  account_number: string
  account_type?: 'savings' | 'current'
  branch_name?: string
  qr_code_url?: string
  is_active?: boolean
  is_default?: boolean
  display_order?: number
}

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

  const body = await readBody<CreateBankAccountBody>()

  // Validation
  if (!body.bank_name || !body.account_name || !body.account_number) {
    throw createError({
      statusCode: 400,
      message: 'Bank name, account name, and account number are required'
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

    // If setting as default, unset other defaults for this payment method
    if (body.is_default) {
      await execute(
        'UPDATE bank_accounts SET is_default = FALSE WHERE payment_method_id = ? AND is_default = TRUE',
        [paymentMethodId]
      )
    }

    // Insert new bank account
    await execute(
      `INSERT INTO bank_accounts (
        payment_method_id, bank_name, account_name, account_number,
        account_type, branch_name, qr_code_url,
        is_active, is_default, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        paymentMethodId,
        body.bank_name,
        body.account_name,
        body.account_number,
        body.account_type || 'savings',
        body.branch_name || null,
        body.qr_code_url || null,
        body.is_active !== undefined ? body.is_active : true,
        body.is_default !== undefined ? body.is_default : false,
        body.display_order || 0
      ]
    )

    // Get created bank account
    const created = await query<any>(
      'SELECT * FROM bank_accounts WHERE payment_method_id = ? AND account_number = ? ORDER BY id DESC LIMIT 1',
      [paymentMethodId, body.account_number]
    )

    return {
      success: true,
      data: created[0],
      message: 'Bank account created successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error creating bank account:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create bank account'
    })
  }
})

