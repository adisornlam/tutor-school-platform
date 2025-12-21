import { requireAuth } from '../../../utils/auth.middleware'
import { execute, query } from '../../../utils/db'
import { getUserRoles } from '../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface UpdateTestimonialBody {
  name?: string
  role?: string
  comment?: string
  rating?: number
  avatar_url?: string
  status?: 'pending' | 'approved' | 'rejected'
  display_order?: number
}

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

  const body = await readBody<UpdateTestimonialBody>()

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

  // Validate rating if provided
  if (body.rating !== undefined && (body.rating < 1 || body.rating > 5)) {
    throw createError({
      statusCode: 400,
      message: 'Rating must be between 1 and 5'
    })
  }

  // Validate status if provided
  if (body.status) {
    const validStatuses = ['pending', 'approved', 'rejected']
    if (!validStatuses.includes(body.status)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid status'
      })
    }
  }

  // Build update query dynamically
  const updates: string[] = []
  const values: any[] = []

  if (body.name !== undefined) {
    updates.push('name = ?')
    values.push(body.name)
  }
  if (body.role !== undefined) {
    updates.push('role = ?')
    values.push(body.role)
  }
  if (body.comment !== undefined) {
    updates.push('comment = ?')
    values.push(body.comment)
  }
  if (body.rating !== undefined) {
    updates.push('rating = ?')
    values.push(body.rating)
  }
  if (body.avatar_url !== undefined) {
    updates.push('avatar_url = ?')
    values.push(body.avatar_url)
  }
  if (body.status !== undefined) {
    updates.push('status = ?')
    values.push(body.status)
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

  values.push(testimonialId)

  try {
    await execute(
      `UPDATE testimonials SET ${updates.join(', ')} WHERE id = ?`,
      values
    )

    return {
      success: true,
      message: 'Testimonial updated successfully'
    }
  } catch (error: any) {
    console.error('Error updating testimonial:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update testimonial'
    })
  }
})

