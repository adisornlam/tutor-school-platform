import { requireAuth } from '../../../utils/auth.middleware'
import { query } from '../../../utils/db'
import { getUserRoles } from '../../../services/auth.service'
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

  try {
    const paymentMethods = await query(
      `SELECT 
        id,
        code,
        name,
        name_en,
        type,
        description,
        icon,
        is_active,
        is_default,
        display_order,
        created_at,
        updated_at
      FROM payment_methods
      ORDER BY display_order, name`
    )

    return {
      success: true,
      data: paymentMethods
    }
  } catch (error: any) {
    console.error('Error fetching payment methods:', error)
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw createError({
        statusCode: 400,
        message: 'Payment methods table does not exist. Please run migration first.'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch payment methods'
    })
  }
})

