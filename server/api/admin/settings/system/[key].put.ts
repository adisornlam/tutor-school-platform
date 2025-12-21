import { requireAuth } from '../../../../utils/auth.middleware'
import { execute, query } from '../../../../utils/db'
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

  const body = await readBody<{ value: any }>()

  if (body.value === undefined) {
    throw createError({
      statusCode: 400,
      message: 'Value is required'
    })
  }

  try {
    // Get existing setting to check type
    const existing = await query<any[]>(
      'SELECT id, type FROM system_settings WHERE `key` = ?',
      [settingKey]
    )

    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Setting not found'
      })
    }

    const settingType = existing[0].type
    let valueToStore: string

    // Convert value to string based on type
    if (settingType === 'boolean') {
      valueToStore = body.value ? 'true' : 'false'
    } else if (settingType === 'number') {
      valueToStore = String(body.value)
    } else if (settingType === 'json') {
      valueToStore = typeof body.value === 'string' 
        ? body.value 
        : JSON.stringify(body.value)
    } else {
      valueToStore = String(body.value)
    }

    // Update setting
    await execute(
      'UPDATE system_settings SET value = ?, updated_at = NOW() WHERE `key` = ?',
      [valueToStore, settingKey]
    )

    // Get updated setting
    const updated = await query<any[]>(
      'SELECT id, `key`, value, type, category, description, is_public FROM system_settings WHERE `key` = ?',
      [settingKey]
    )

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

    return {
      success: true,
      data: {
        ...updated[0],
        value: parsedValue
      },
      message: 'System setting updated successfully'
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error updating system setting:', error)
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw createError({
        statusCode: 400,
        message: 'System settings table does not exist. Please run migration first.'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to update system setting'
    })
  }
})

