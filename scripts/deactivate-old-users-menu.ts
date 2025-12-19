import mysql from 'mysql2/promise'
import { readFileSync } from 'fs'
import { join } from 'path'

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tutordb'
}

async function deactivateOldUsersMenu() {
  const connection = await mysql.createConnection(config)

  try {
    console.log('🔄 Deactivating old "จัดการผู้ใช้งาน" menu...')
    console.log('')

    // Deactivate USERS parent menu and all its submenus
    const menuCodesToDeactivate = [
      'USERS',
      'USERS_ALL',
      'USERS_TUTORS',
      'USERS_STUDENTS',
      'USERS_PARENTS',
      'USERS_BRANCH_ADMINS'
    ]

    for (const menuCode of menuCodesToDeactivate) {
      const [result] = await connection.execute(
        `UPDATE admin_menus SET is_active = FALSE WHERE code = ?`,
        [menuCode]
      ) as any[]

      if (result.affectedRows > 0) {
        console.log(`   ✅ Deactivated menu: ${menuCode}`)
      } else {
        console.log(`   ⚠️  Menu "${menuCode}" not found`)
      }
    }

    console.log('')
    console.log('✅ Old "จัดการผู้ใช้งาน" menu deactivated!')
    console.log('')

    // Summary
    const [activeMenus] = await connection.execute(
      `SELECT COUNT(id) as count FROM admin_menus WHERE is_active = TRUE`
    ) as any[]
    const [deactivatedMenus] = await connection.execute(
      `SELECT COUNT(id) as count FROM admin_menus WHERE is_active = FALSE`
    ) as any[]

    console.log('📊 Summary:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   Active Menus: ${activeMenus[0].count}`)
    console.log(`   Deactivated Menus: ${deactivatedMenus[0].count}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')

  } catch (error: any) {
    console.error('❌ Error deactivating old users menu:', error.message)
    console.error(error)
    process.exit(1)
  } finally {
    await connection.end()
  }
}

// Load .env if exists
try {
  const envPath = join(process.cwd(), '.env')
  const envContent = readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=')
    if (key && values.length) {
      const value = values.join('=').trim()
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = value
      }
    }
  })
} catch (error) {
  // .env file not found, use defaults
}

deactivateOldUsersMenu()

