import { requireAuth } from '../../../../utils/auth.middleware'
import { execute, query } from '../../../../utils/db'
import { getUserRoles } from '../../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface UpdatePaymentMethodBody {
  name?: string
  name_en?: string
  description?: string
  icon?: string
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

  const id = parseInt(getRouterParam(event, 'id') || '0')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Payment method ID is required'
    })
  }

  const body = await readBody<UpdatePaymentMethodBody>()

  try {
    // Check if payment method exists
    const existing = await query<{ id: number; code: string }>(
      'SELECT id, code FROM payment_methods WHERE id = ?',
      [id]
    )

    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Payment method not found'
      })
    }

    // If setting as default, unset other defaults
    if (body.is_default) {
      await execute(
        'UPDATE payment_methods SET is_default = FALSE WHERE is_default = TRUE AND id != ?',
        [id]
      )
    }

    // Build update query dynamically
    const updates: string[] = []
    const values: any[] = []

    if (body.name !== undefined) {
      updates.push('name = ?')
      values.push(body.name)
    }
    if (body.name_en !== undefined) {
      updates.push('name_en = ?')
      values.push(body.name_en || null)
    }
    if (body.description !== undefined) {
      updates.push('description = ?')
      values.push(body.description || null)
    }
    if (body.icon !== undefined) {
      updates.push('icon = ?')
      values.push(body.icon || null)
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
    values.push(id)

    await execute(
      `UPDATE payment_methods SET ${updates.join(', ')} WHERE id = ?`,
      values
    )

    // Get updated payment method
    const updated = await query<any>(
      'SELECT * FROM payment_methods WHERE id = ?',
      [id]
    )

    return {
      success: true,
      data: updated[0],
      message: 'Payment method updated successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error updating payment method:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to update payment method'
    })
  }
})

