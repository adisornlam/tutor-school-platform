import { requireAuth } from '../../../utils/auth.middleware'
import { execute, query } from '../../../utils/db'
import { getUserRoles } from '../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface CreateGradeLevelBody {
  code: string
  name: string
  level_type: 'elementary' | 'secondary'
  grade_number: number
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

  const body = await readBody<CreateGradeLevelBody>()

  if (!body.code || !body.name || !body.level_type || !body.grade_number) {
    throw createError({
      statusCode: 400,
      message: 'Code, name, level_type, and grade_number are required'
    })
  }

  // Check if code already exists
  const existing = await query<{ id: number }>(
    'SELECT id FROM grade_levels WHERE code = ?',
    [body.code]
  )

  if (existing.length > 0) {
    throw createError({
      statusCode: 409,
      message: 'Grade level code already exists'
    })
  }

  try {
    const result = await execute(
      `INSERT INTO grade_levels (code, name, level_type, grade_number, display_order)
       VALUES (?, ?, ?, ?, ?)`,
      [
        body.code,
        body.name,
        body.level_type,
        body.grade_number,
        body.display_order || 0
      ]
    )

    const gradeLevels = await query(
      'SELECT * FROM grade_levels WHERE id = ?',
      [result.insertId]
    )

    return {
      success: true,
      data: gradeLevels[0],
      message: 'Grade level created successfully'
    }
  } catch (error: any) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw createError({
        statusCode: 400,
        message: 'Grade levels table does not exist. Please run migration first.'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to create grade level'
    })
  }
})

