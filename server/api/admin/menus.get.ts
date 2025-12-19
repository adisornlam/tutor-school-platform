import { requireAuth } from '../../utils/auth.middleware'
import { getUserRoles } from '../../services/auth.service'
import { getAdminMenus } from '../../services/menu.service'
import type { JWTPayload } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  try {
    const auth = await requireAuth(event) as JWTPayload
    
    // Get user ID from auth payload
    const userId = auth.userId
    
    console.log('[Admin Menus API] User ID:', userId)
    
    if (!userId) {
      throw createError({
        statusCode: 401,
        message: 'Invalid token payload'
      })
    }
    
    // Get user roles
    const roles = await getUserRoles(userId)
    
    console.log('[Admin Menus API] User roles:', roles)
    
    if (!roles || roles.length === 0) {
      console.warn('[Admin Menus API] User has no roles')
      throw createError({
        statusCode: 403,
        message: 'User has no roles'
      })
    }
    
    // Get menus for user roles
    const menus = await getAdminMenus(roles)
    
    console.log('[Admin Menus API] Menus found:', menus.length)
    console.log('[Admin Menus API] Menu codes:', menus.map(m => m.code))
    
    return {
      success: true,
      data: menus
    }
  } catch (error: any) {
    console.error('[Admin Menus API] Error fetching admin menus:', error)
    console.error('[Admin Menus API] Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack
    })
    
    // If it's already a createError, re-throw it
    if (error.statusCode) {
      throw error
    }
    
    // Otherwise, wrap it
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch menus'
    })
  }
})

