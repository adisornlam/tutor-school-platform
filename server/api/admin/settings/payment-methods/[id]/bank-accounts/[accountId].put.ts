import { requireAuth } from '../../../../../../utils/auth.middleware'
import { execute, query } from '../../../../../../utils/db'
import { getUserRoles } from '../../../../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface UpdateBankAccountBody {
  bank_name?: string
  account_name?: string
  account_number?: string
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
  const accountId = parseInt(getRouterParam(event, 'accountId') || '0')
  
  if (!paymentMethodId || !accountId) {
    throw createError({
      statusCode: 400,
      message: 'Payment method ID and account ID are required'
    })
  }

  const body = await readBody<UpdateBankAccountBody>()

  try {
    // Verify bank account exists and belongs to the payment method
    const accounts = await query<{ id: number; payment_method_id: number }>(
      'SELECT id, payment_method_id FROM bank_accounts WHERE id = ? AND payment_method_id = ?',
      [accountId, paymentMethodId]
    )

    if (accounts.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Bank account not found'
      })
    }

    // If setting as default, unset other defaults for this payment method
    if (body.is_default) {
      await execute(
        'UPDATE bank_accounts SET is_default = FALSE WHERE payment_method_id = ? AND is_default = TRUE AND id != ?',
        [paymentMethodId, accountId]
      )
    }

    // Build update query dynamically
    const updates: string[] = []
    const values: any[] = []

    if (body.bank_name !== undefined) {
      updates.push('bank_name = ?')
      values.push(body.bank_name)
    }
    if (body.account_name !== undefined) {
      updates.push('account_name = ?')
      values.push(body.account_name)
    }
    if (body.account_number !== undefined) {
      updates.push('account_number = ?')
      values.push(body.account_number)
    }
    if (body.account_type !== undefined) {
      updates.push('account_type = ?')
      values.push(body.account_type)
    }
    if (body.branch_name !== undefined) {
      updates.push('branch_name = ?')
      values.push(body.branch_name || null)
    }
    if (body.qr_code_url !== undefined) {
      updates.push('qr_code_url = ?')
      values.push(body.qr_code_url || null)
    }
    if (body.is_active !== undefined) {
      updates.push('is_active = ?')
      values.push(body.is_active)
    }
    if (body.is_default !== undefined) {
      updates.push('is_default = ?')
      values.push(body.is_default)
    }
    if (body.display_order !== undefined) {
      updates.push('display_order = ?')
      values.push(body.display_order)
    }

    if (updates.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No fields to update'
      })
    }

    updates.push('updated_at = NOW()')
    values.push(accountId)

    await execute(
      `UPDATE bank_accounts SET ${updates.join(', ')} WHERE id = ?`,
      values
    )

    // Get updated bank account
    const updated = await query<any>(
      'SELECT * FROM bank_accounts WHERE id = ?',
      [accountId]
    )

    return {
      success: true,
      data: updated[0],
      message: 'Bank account updated successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error updating bank account:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to update bank account'
    })
  }
})

