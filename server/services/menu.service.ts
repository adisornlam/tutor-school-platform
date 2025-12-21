import { query } from '../utils/db'
import { UserRole } from '#shared/types/user.types'

export interface AdminMenu {
  id: number
  code: string
  name: string
  name_en: string | null
  icon: string | null
  href: string | null
  parent_code: string | null
  display_order: number
  is_active: boolean
  roles: string[] | null
  children?: AdminMenu[]
}

/**
 * Get admin menus for a specific user role
 */
export async function getAdminMenus(userRoles: UserRole[]): Promise<AdminMenu[]> {
  try {
    console.log('[Menu Service] Getting menus for roles:', userRoles)
    
    // Get all active menus
    const allMenus = await query<AdminMenu>(
      `SELECT id, code, name, name_en, icon, href, parent_code, display_order, is_active, roles
       FROM admin_menus
       WHERE is_active = TRUE
       ORDER BY display_order ASC, name ASC`
    )
    
    console.log('[Menu Service] Total menus in DB:', allMenus.length)
    
    // If no menus found, return empty array (table might not exist yet)
    if (!allMenus || allMenus.length === 0) {
      console.warn('[Menu Service] No admin menus found in database. Please run migration: bun run db:migrate-menus')
      return []
    }

  // Filter menus by user roles
  const filteredMenus = allMenus.filter(menu => {
    if (!menu.roles) {
      console.log(`[Menu Service] Menu ${menu.code} has no roles restriction - allowing`)
      return true // If no roles specified, allow all
    }
    
    try {
      const allowedRoles = JSON.parse(menu.roles as any) as string[]
      const hasAccess = userRoles.some(role => allowedRoles.includes(role))
      console.log(`[Menu Service] Menu ${menu.code} - Allowed roles: ${allowedRoles.join(', ')}, User has access: ${hasAccess}`)
      return hasAccess
    } catch (error) {
      console.error(`[Menu Service] Error parsing roles for menu ${menu.code}:`, error)
      return true
    }
  })
  
  console.log('[Menu Service] Filtered menus:', filteredMenus.length)

  // Build hierarchy
  const menuMap = new Map<string, AdminMenu>()
  const rootMenus: AdminMenu[] = []

  // First pass: create menu objects
  filteredMenus.forEach(menu => {
    menuMap.set(menu.code, { ...menu, children: [] })
  })

  // Second pass: build hierarchy
  filteredMenus.forEach(menu => {
    const menuItem = menuMap.get(menu.code)!
    
    if (menu.parent_code) {
      const parent = menuMap.get(menu.parent_code)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(menuItem)
      }
    } else {
      rootMenus.push(menuItem)
    }
  })

  // Sort children
  const sortMenus = (menus: AdminMenu[]) => {
    menus.sort((a, b) => a.display_order - b.display_order)
    menus.forEach(menu => {
      if (menu.children && menu.children.length > 0) {
        sortMenus(menu.children)
      }
    })
  }

    sortMenus(rootMenus)

    return rootMenus
  } catch (error: any) {
    // If table doesn't exist, return empty array
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.error('admin_menus table does not exist. Please run migration: bun run db:migrate-menus')
      return []
    }
    throw error
  }
}

