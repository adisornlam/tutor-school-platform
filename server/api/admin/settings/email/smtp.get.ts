import { requireAuth } from '../../../../utils/auth.middleware'
import { query } from '../../../../utils/db'
import { getUserRoles } from '../../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

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

  try {
    // For now, return default structure. In production, this would query from a settings table
    // We can store SMTP settings in environment variables or a settings table
    const smtpSettings = {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      username: process.env.SMTP_USERNAME || '',
      password: '', // Never return password
      from_email: process.env.SMTP_FROM_EMAIL || '',
      from_name: process.env.SMTP_FROM_NAME || '',
      enabled: process.env.SMTP_ENABLED === 'true'
    }

    return {
      success: true,
      data: smtpSettings
    }
  } catch (error: any) {
    console.error('Error fetching SMTP settings:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch SMTP settings'
    })
  }
})

