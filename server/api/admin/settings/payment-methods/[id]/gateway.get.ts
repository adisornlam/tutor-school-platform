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
    // Verify payment method exists and is payment_gateway type
    const methods = await query<{ id: number; type: string; code: string }>(
      'SELECT id, type, code FROM payment_methods WHERE id = ?',
      [paymentMethodId]
    )

    if (methods.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Payment method not found'
      })
    }

    if (methods[0].type !== 'payment_gateway') {
      throw createError({
        statusCode: 400,
        message: 'Gateway configuration is only available for payment_gateway payment methods'
      })
    }

    const gateways = await query<any>(
      `SELECT 
        id,
        payment_method_id,
        gateway_code,
        gateway_name,
        api_key,
        api_secret,
        merchant_id,
        webhook_secret,
        endpoint_url,
        is_test_mode,
        is_active,
        config,
        created_at,
        updated_at
      FROM payment_gateways
      WHERE payment_method_id = ?`,
      [paymentMethodId]
    )

    // Mask sensitive fields
    if (gateways.length > 0) {
      const gateway = gateways[0]
      if (gateway.api_secret) {
        gateway.api_secret = gateway.api_secret.substring(0, 4) + '****'
      }
      if (gateway.webhook_secret) {
        gateway.webhook_secret = gateway.webhook_secret.substring(0, 4) + '****'
      }
    }

    return {
      success: true,
      data: gateways.length > 0 ? gateways[0] : null
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error fetching payment gateway:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch payment gateway'
    })
  }
})

