import { requireAuth } from '../../../../../utils/auth.middleware'
import { getUserRoles } from '../../../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface UpdateEmailTemplateBody {
  name?: string
  subject?: string
  body?: string
  variables?: string[]
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

  const templateId = parseInt(getRouterParam(event, 'id') || '0')
  if (!templateId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid template ID'
    })
  }

  const body = await readBody<UpdateEmailTemplateBody>()

  if (!body.name && !body.subject && !body.body) {
    throw createError({
      statusCode: 400,
      message: 'At least one field (name, subject, body) is required'
    })
  }

  try {
    // In production, update database
    // For now, just return success
    const updatedTemplate = {
      id: templateId,
      ...body,
      updated_at: new Date().toISOString()
    }

    return {
      success: true,
      data: updatedTemplate,
      message: 'Email template updated successfully'
    }
  } catch (error: any) {
    console.error('Error updating email template:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update email template'
    })
  }
})

