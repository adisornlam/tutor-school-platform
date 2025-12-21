import { requireAuth } from '../../../../../utils/auth.middleware'
import { execute, query } from '../../../../../utils/db'
import { getUserRoles } from '../../../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface UpdateGatewayBody {
  gateway_code: string
  gateway_name: string
  api_key?: string
  api_secret?: string
  merchant_id?: string
  webhook_secret?: string
  endpoint_url?: string
  is_test_mode?: boolean
  is_active?: boolean
  config?: any
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

  const body = await readBody<UpdateGatewayBody>()

  if (!body.gateway_code || !body.gateway_name) {
    throw createError({
      statusCode: 400,
      message: 'Gateway code and name are required'
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

    // Check if gateway config already exists
    const existing = await query<{ id: number; api_secret: string | null; webhook_secret: string | null }>(
      'SELECT id, api_secret, webhook_secret FROM payment_gateways WHERE payment_method_id = ?',
      [paymentMethodId]
    )

    const configJson = body.config ? JSON.stringify(body.config) : null

    if (existing.length > 0) {
      // Update existing gateway
      // Only update api_secret/webhook_secret if provided (not masked)
      const updates: string[] = ['gateway_code = ?', 'gateway_name = ?', 'updated_at = NOW()']
      const values: any[] = [body.gateway_code, body.gateway_name]

      if (body.api_key !== undefined) {
        updates.push('api_key = ?')
        values.push(body.api_key || null)
      }
      if (body.api_secret !== undefined && !body.api_secret.includes('****')) {
        updates.push('api_secret = ?')
        values.push(body.api_secret || null)
      }
      if (body.merchant_id !== undefined) {
        updates.push('merchant_id = ?')
        values.push(body.merchant_id || null)
      }
      if (body.webhook_secret !== undefined && !body.webhook_secret.includes('****')) {
        updates.push('webhook_secret = ?')
        values.push(body.webhook_secret || null)
      }
      if (body.endpoint_url !== undefined) {
        updates.push('endpoint_url = ?')
        values.push(body.endpoint_url || null)
      }
      if (body.is_test_mode !== undefined) {
        updates.push('is_test_mode = ?')
        values.push(body.is_test_mode)
      }
      if (body.is_active !== undefined) {
        updates.push('is_active = ?')
        values.push(body.is_active)
      }
      if (body.config !== undefined) {
        updates.push('config = ?')
        values.push(configJson)
      }

      values.push(existing[0].id)

      await execute(
        `UPDATE payment_gateways SET ${updates.join(', ')} WHERE id = ?`,
        values
      )
    } else {
      // Insert new gateway
      await execute(
        `INSERT INTO payment_gateways (
          payment_method_id, gateway_code, gateway_name,
          api_key, api_secret, merchant_id, webhook_secret,
          endpoint_url, is_test_mode, is_active, config
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          paymentMethodId,
          body.gateway_code,
          body.gateway_name,
          body.api_key || null,
          body.api_secret || null,
          body.merchant_id || null,
          body.webhook_secret || null,
          body.endpoint_url || null,
          body.is_test_mode !== undefined ? body.is_test_mode : true,
          body.is_active !== undefined ? body.is_active : true,
          configJson
        ]
      )
    }

    // Get updated/created gateway (mask sensitive fields)
    const gateways = await query<any>(
      'SELECT * FROM payment_gateways WHERE payment_method_id = ?',
      [paymentMethodId]
    )

    if (gateways.length > 0) {
      const gateway = { ...gateways[0] }
      if (gateway.api_secret) {
        gateway.api_secret = gateway.api_secret.substring(0, 4) + '****'
      }
      if (gateway.webhook_secret) {
        gateway.webhook_secret = gateway.webhook_secret.substring(0, 4) + '****'
      }
      if (gateway.config) {
        try {
          gateway.config = JSON.parse(gateway.config)
        } catch (e) {
          // Ignore parse errors
        }
      }

      return {
        success: true,
        data: gateway,
        message: 'Payment gateway configuration updated successfully'
      }
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to save gateway configuration'
    })
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error updating payment gateway:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to update payment gateway'
    })
  }
})

