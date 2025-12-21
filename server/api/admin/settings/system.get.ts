import { requireAuth } from '../../../utils/auth.middleware'
import { query } from '../../../utils/db'
import { getUserRoles } from '../../../services/auth.service'
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

  const queryParams = getQuery(event)
  const category = queryParams.category as string | undefined
  const publicOnly = queryParams.public === 'true'

  try {
    let sql = 'SELECT id, `key`, value, type, category, description, is_public, created_at, updated_at FROM system_settings WHERE 1=1'
    const params: any[] = []

    if (category) {
      sql += ' AND category = ?'
      params.push(category)
    }

    if (publicOnly) {
      sql += ' AND is_public = TRUE'
    }

    sql += ' ORDER BY category, `key`'

    const settings = await query(sql, params)

    // Parse values based on type
    const formattedSettings = settings.map((setting: any) => {
      let parsedValue: any = setting.value

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
        ...setting,
        value: parsedValue
      }
    })

    // Group by category if no category filter
    if (!category) {
      const grouped: Record<string, any[]> = {}
      formattedSettings.forEach((setting: any) => {
        if (!grouped[setting.category]) {
          grouped[setting.category] = []
        }
        grouped[setting.category].push(setting)
      })

      return {
        success: true,
        data: grouped
      }
    }

    return {
      success: true,
      data: formattedSettings
    }
  } catch (error: any) {
    console.error('Error fetching system settings:', error)
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw createError({
        statusCode: 400,
        message: 'System settings table does not exist. Please run migration first.'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch system settings'
    })
  }
})

