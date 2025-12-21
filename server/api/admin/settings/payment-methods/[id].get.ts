import { requireAuth } from '../../../../utils/auth.middleware'
import { query } from '../../../../utils/db'
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
    const methods = await query<any>(
      'SELECT * FROM payment_methods WHERE id = ?',
      [id]
    )

    if (methods.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Payment method not found'
      })
    }

    return {
      success: true,
      data: methods[0]
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error fetching payment method:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch payment method'
    })
  }
})

