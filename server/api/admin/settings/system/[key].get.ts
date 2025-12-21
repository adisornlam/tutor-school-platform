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

  const settingKey = getRouterParam(event, 'key')
  if (!settingKey) {
    throw createError({
      statusCode: 400,
      message: 'Setting key is required'
    })
  }

  try {
    const settings = await query<any[]>(
      'SELECT id, `key`, value, type, category, description, is_public FROM system_settings WHERE `key` = ?',
      [settingKey]
    )

    if (settings.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Setting not found'
      })
    }

    const setting = settings[0]
    let parsedValue: any = setting.value

    // Parse value based on type
    if (setting.type === 'number') {
      parsedValue = setting.value ? parseFloat(setting.value) : null
    } else if (setting.type === 'boolean') {
      parsedValue = setting.value === 'true' || setting.value === '1'
    } else if (setting.type === 'json') {
      try {
        parsedValue = setting.value ? JSON.parse(setting.value) : null
      } catch (e) {
        parsedValue = setting.value
      }
    }

    return {
      success: true,
      data: {
        ...setting,
        value: parsedValue
      }
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error fetching system setting:', error)
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw createError({
        statusCode: 400,
        message: 'System settings table does not exist. Please run migration first.'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch system setting'
    })
  }
})

