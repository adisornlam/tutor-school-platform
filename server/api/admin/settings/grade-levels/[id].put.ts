import { requireAuth } from '../../../../utils/auth.middleware'
import { execute, query } from '../../../../utils/db'
import { getUserRoles } from '../../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface UpdateGradeLevelBody {
  code?: string
  name?: string
  level_type?: 'elementary' | 'secondary'
  grade_number?: number
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

  const gradeLevelId = parseInt(getRouterParam(event, 'id') || '0')
  if (!gradeLevelId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid grade level ID'
    })
  }

  const body = await readBody<UpdateGradeLevelBody>()

  try {
    const existing = await query('SELECT id FROM grade_levels WHERE id = ?', [gradeLevelId])
    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Grade level not found'
      })
    }

    if (body.code) {
      const codeCheck = await query<{ id: number }>(
        'SELECT id FROM grade_levels WHERE code = ? AND id != ?',
        [body.code, gradeLevelId]
      )
      if (codeCheck.length > 0) {
        throw createError({
          statusCode: 409,
          message: 'Grade level code already exists'
        })
      }
    }

    const updateFields: string[] = []
    const updateValues: any[] = []

    if (body.code !== undefined) {
      updateFields.push('code = ?')
      updateValues.push(body.code)
    }
    if (body.name !== undefined) {
      updateFields.push('name = ?')
      updateValues.push(body.name)
    }
    if (body.level_type !== undefined) {
      updateFields.push('level_type = ?')
      updateValues.push(body.level_type)
    }
    if (body.grade_number !== undefined) {
      updateFields.push('grade_number = ?')
      updateValues.push(body.grade_number)
    }
    if (body.display_order !== undefined) {
      updateFields.push('display_order = ?')
      updateValues.push(body.display_order)
    }

    if (updateFields.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No fields to update'
      })
    }

    updateValues.push(gradeLevelId)
    await execute(
      `UPDATE grade_levels SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    )

    const gradeLevels = await query('SELECT * FROM grade_levels WHERE id = ?', [gradeLevelId])

    return {
      success: true,
      data: gradeLevels[0],
      message: 'Grade level updated successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw createError({
        statusCode: 400,
        message: 'Grade levels table does not exist. Please run migration first.'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to update grade level'
    })
  }
})

