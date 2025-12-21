import { requireAuth } from '../../utils/auth.middleware'
import { execute } from '../../utils/db'
import { getUserRoles } from '../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface CreateTestimonialBody {
  name: string
  role: string
  comment: string
  rating: number
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

  const body = await readBody<CreateTestimonialBody>()

  if (!body.name || !body.role || !body.comment || !body.rating) {
    throw createError({
      statusCode: 400,
      message: 'Name, role, comment, and rating are required'
    })
  }

  // Validate rating
  if (body.rating < 1 || body.rating > 5) {
    throw createError({
      statusCode: 400,
      message: 'Rating must be between 1 and 5'
    })
  }

  // Validate status
  const validStatuses = ['pending', 'approved', 'rejected']
  const status = body.status && validStatuses.includes(body.status) ? body.status : 'pending'

  try {
    const result = await execute(
      `INSERT INTO testimonials (name, role, comment, rating, avatar_url, status, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        body.name,
        body.role,
        body.comment,
        body.rating,
        body.avatar_url || null,
        status,
        body.display_order || 0
      ]
    )

    return {
      success: true,
      data: {
        id: result.insertId
      }
    }
  } catch (error: any) {
    console.error('Error creating testimonial:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create testimonial'
    })
  }
})

