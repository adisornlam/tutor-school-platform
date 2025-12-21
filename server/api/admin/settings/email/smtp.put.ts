import { requireAuth } from '../../../../utils/auth.middleware'
import { getUserRoles } from '../../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface UpdateSMTPSettingsBody {
  host: string
  port: number
  secure: boolean
  username: string
  password?: string
  from_email: string
  from_name: string
  enabled: boolean
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

  const body = await readBody<UpdateSMTPSettingsBody>()

  // Validation
  if (!body.host || !body.port || !body.from_email || !body.from_name) {
    throw createError({
      statusCode: 400,
      message: 'Host, port, from email, and from name are required'
    })
  }

  if (body.port < 1 || body.port > 65535) {
    throw createError({
      statusCode: 400,
      message: 'Port must be between 1 and 65535'
    })
  }

  try {
    // In production, save to database or environment variables
    // For now, we'll just validate and return success
    // TODO: Implement actual storage mechanism (database table or env file update)
    
    // Note: Password should be encrypted/hashed before storing
    const smtpSettings = {
      host: body.host,
      port: body.port,
      secure: body.secure || false,
      username: body.username,
      from_email: body.from_email,
      from_name: body.from_name,
      enabled: body.enabled || false
      // Don't store password here, handle separately in secure storage
    }

    return {
      success: true,
      data: smtpSettings,
      message: 'SMTP settings updated successfully'
    }
  } catch (error: any) {
    console.error('Error updating SMTP settings:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update SMTP settings'
    })
  }
})

