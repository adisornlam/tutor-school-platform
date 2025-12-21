import { requireAuth } from '../../../utils/auth.middleware'
import { execute, query } from '../../../utils/db'
import { getUserRoles } from '../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface CreatePaymentMethodBody {
  code: string
  name: string
  name_en?: string
  type: 'bank_transfer' | 'payment_gateway' | 'other'
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

  const body = await readBody<CreatePaymentMethodBody>()

  // Validation
  if (!body.code || !body.name || !body.type) {
    throw createError({
      statusCode: 400,
      message: 'Code, name, and type are required'
    })
  }

  // Validate code format
  if (!/^[a-z0-9_]+$/.test(body.code)) {
    throw createError({
      statusCode: 400,
      message: 'Code must contain only lowercase letters, numbers, and underscores'
    })
  }

  try {
    // Check if code already exists
    const existing = await query<any[]>(
      'SELECT id FROM payment_methods WHERE code = ?',
      [body.code]
    )

    if (existing.length > 0) {
      throw createError({
        statusCode: 409,
        message: 'Payment method with this code already exists'
      })
    }

    // If setting as default, unset other defaults
    if (body.is_default) {
      await execute(
        'UPDATE payment_methods SET is_default = FALSE WHERE is_default = TRUE'
      )
    }

    // Insert new payment method
    await execute(
      `INSERT INTO payment_methods (
        code, name, name_en, type, description, icon,
        is_active, is_default, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.code,
        body.name,
        body.name_en || null,
        body.type,
        body.description || null,
        body.icon || null,
        body.is_active !== undefined ? body.is_active : true,
        body.is_default !== undefined ? body.is_default : false,
        body.display_order || 0
      ]
    )

    // Get created payment method
    const [created] = await query<any[]>(
      'SELECT * FROM payment_methods WHERE code = ?',
      [body.code]
    )

    return {
      success: true,
      data: created[0],
      message: 'Payment method created successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error creating payment method:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create payment method'
    })
  }
})

