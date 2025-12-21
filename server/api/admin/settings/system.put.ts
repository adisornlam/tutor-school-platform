import { requireAuth } from '../../../utils/auth.middleware'
import { execute, query } from '../../../utils/db'
import { getUserRoles } from '../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

interface UpdateSystemSettingsBody {
  settings: Array<{
    key: string
    value: any
  }>
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

  const body = await readBody<UpdateSystemSettingsBody>()

  if (!body.settings || !Array.isArray(body.settings) || body.settings.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Settings array is required'
    })
  }

  try {
    const updatedSettings: any[] = []

    for (const setting of body.settings) {
      // Get existing setting to check type
      const existing = await query<any[]>(
        'SELECT id, type FROM system_settings WHERE `key` = ?',
        [setting.key]
      )

      if (existing.length === 0) {
        throw createError({
          statusCode: 404,
          message: `Setting with key "${setting.key}" not found`
        })
      }

      const settingType = existing[0].type
      let valueToStore: string = setting.value

      // Convert value to string based on type
      if (settingType === 'boolean') {
        valueToStore = setting.value ? 'true' : 'false'
      } else if (settingType === 'number') {
        valueToStore = String(setting.value)
      } else if (settingType === 'json') {
        valueToStore = typeof setting.value === 'string' 
          ? setting.value 
          : JSON.stringify(setting.value)
      } else {
        valueToStore = String(setting.value)
      }

      // Update setting
      await execute(
        'UPDATE system_settings SET value = ?, updated_at = NOW() WHERE `key` = ?',
        [valueToStore, setting.key]
      )

      // Get updated setting
      const updated = await query<any[]>(
        'SELECT id, `key`, value, type, category, description, is_public FROM system_settings WHERE `key` = ?',
        [setting.key]
      )

      if (updated.length > 0) {
        let parsedValue: any = updated[0].value

        // Parse value based on type
        if (settingType === 'number') {
          parsedValue = updated[0].value ? parseFloat(updated[0].value) : null
        } else if (settingType === 'boolean') {
          parsedValue = updated[0].value === 'true' || updated[0].value === '1'
        } else if (settingType === 'json') {
          try {
            parsedValue = updated[0].value ? JSON.parse(updated[0].value) : null
          } catch (e) {
            parsedValue = updated[0].value
          }
        }

        updatedSettings.push({
          ...updated[0],
          value: parsedValue
        })
      }
    }

    return {
      success: true,
      data: updatedSettings,
      message: 'System settings updated successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error updating system settings:', error)
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw createError({
        statusCode: 400,
        message: 'System settings table does not exist. Please run migration first.'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to update system settings'
    })
  }
})

