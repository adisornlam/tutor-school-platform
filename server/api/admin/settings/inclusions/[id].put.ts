import { requireAuth } from '../../../../utils/auth.middleware'
import { execute, query } from '../../../../utils/db'
import { getUserRoles } from '../../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface UpdateInclusionBody {
  code?: string
  name?: string
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

  const inclusionId = parseInt(getRouterParam(event, 'id') || '0')
  if (!inclusionId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid inclusion ID'
    })
  }

  const body = await readBody<UpdateInclusionBody>()

  try {
    const existing = await query('SELECT id FROM inclusions WHERE id = ?', [inclusionId])
    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Inclusion not found'
      })
    }

    if (body.code) {
      const codeCheck = await query<{ id: number }>(
        'SELECT id FROM inclusions WHERE code = ? AND id != ?',
        [body.code, inclusionId]
      )
      if (codeCheck.length > 0) {
        throw createError({
          statusCode: 409,
          message: 'Inclusion code already exists'
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

    updateValues.push(inclusionId)
    await execute(
      `UPDATE inclusions SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    )

    const inclusions = await query('SELECT * FROM inclusions WHERE id = ?', [inclusionId])

    return {
      success: true,
      data: inclusions[0],
      message: 'Inclusion updated successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw createError({
        statusCode: 400,
        message: 'Inclusions table does not exist. Please run migration first.'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to update inclusion'
    })
  }
})

