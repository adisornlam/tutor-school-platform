import { requireAuth } from '../../../utils/auth.middleware'
import { execute, query } from '../../../utils/db'
import { getUserRoles } from '../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  const roles = await getUserRoles(auth.userId)
  const allowedRoles: UserRole[] = ['system_admin', 'owner', 'admin']
  if (!roles.some(role => allowedRoles.includes(role as UserRole))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Admin role required.'
    })
  }

  const testimonialId = parseInt(getRouterParam(event, 'id') || '0')
  if (!testimonialId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid testimonial ID'
    })
  }

  // Check if testimonial exists
  const existing = await query<{ id: number }>(
    'SELECT id FROM testimonials WHERE id = ?',
    [testimonialId]
  )

  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Testimonial not found'
    })
  }

  try {
    await execute('DELETE FROM testimonials WHERE id = ?', [testimonialId])

    return {
      success: true,
      message: 'Testimonial deleted successfully'
    }
  } catch (error: any) {
    console.error('Error deleting testimonial:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete testimonial'
    })
  }
})

