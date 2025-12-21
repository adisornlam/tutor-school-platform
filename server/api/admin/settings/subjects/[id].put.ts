import { requireAuth } from '../../../../utils/auth.middleware'
import { execute, query } from '../../../../utils/db'
import { getUserRoles } from '../../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface UpdateSubjectBody {
  code?: string
  name?: string
  short_name?: string | null
  description?: string | null
  icon?: string | null
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

  const subjectId = parseInt(getRouterParam(event, 'id') || '0')
  if (!subjectId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid subject ID'
    })
  }

  const body = await readBody<UpdateSubjectBody>()

  try {
    const existing = await query('SELECT id FROM subjects WHERE id = ?', [subjectId])
    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Subject not found'
      })
    }

    if (body.code) {
      const codeCheck = await query<{ id: number }>(
        'SELECT id FROM subjects WHERE code = ? AND id != ?',
        [body.code, subjectId]
      )
      if (codeCheck.length > 0) {
        throw createError({
          statusCode: 409,
          message: 'Subject code already exists'
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
    if (body.short_name !== undefined) {
      updateFields.push('short_name = ?')
      updateValues.push(body.short_name)
    }
    if (body.description !== undefined) {
      updateFields.push('description = ?')
      updateValues.push(body.description)
    }
    if (body.icon !== undefined) {
      updateFields.push('icon = ?')
      updateValues.push(body.icon)
    }

    if (updateFields.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No fields to update'
      })
    }

    updateValues.push(subjectId)
    await execute(
      `UPDATE subjects SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    )

    const subjects = await query('SELECT * FROM subjects WHERE id = ?', [subjectId])

    return {
      success: true,
      data: subjects[0],
      message: 'Subject updated successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw createError({
        statusCode: 400,
        message: 'Subjects table does not exist. Please run migration first.'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to update subject'
    })
  }
})

