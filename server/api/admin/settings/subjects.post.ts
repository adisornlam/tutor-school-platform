import { requireAuth } from '../../../utils/auth.middleware'
import { execute, query } from '../../../utils/db'
import { getUserRoles } from '../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface CreateSubjectBody {
  code: string
  name: string
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

  const body = await readBody<CreateSubjectBody>()

  if (!body.code || !body.name) {
    throw createError({
      statusCode: 400,
      message: 'Code and name are required'
    })
  }

  try {
    const existing = await query<{ id: number }>(
      'SELECT id FROM subjects WHERE code = ?',
      [body.code]
    )

    if (existing.length > 0) {
      throw createError({
        statusCode: 409,
        message: 'Subject code already exists'
      })
    }

    const result = await execute(
      `INSERT INTO subjects (code, name, short_name, description, icon)
       VALUES (?, ?, ?, ?, ?)`,
      [
        body.code,
        body.name,
        body.short_name || null,
        body.description || null,
        body.icon || null
      ]
    )

    const subjects = await query(
      'SELECT * FROM subjects WHERE id = ?',
      [result.insertId]
    )

    return {
      success: true,
      data: subjects[0],
      message: 'Subject created successfully'
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
      message: 'Failed to create subject'
    })
  }
})

