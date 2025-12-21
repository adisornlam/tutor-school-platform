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

async function fixAdminRoleMenus() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🔧 Fixing admin role menu permissions...')
    console.log('')
    console.log('📋 Removing "admin" role from menus that should only be visible to system_admin and owner')
    console.log('')
    
    // Menus that should ONLY be accessible to system_admin and owner
    // Admin (Admin กลาง) should NOT see these menus
    const restrictedMenuCodes = [
      'REPORTS_USERS',           // รายงานผู้ใช้งาน
      'SETTINGS',                // ตั้งค่า (Parent)
      'SETTINGS_EMAIL',          // ตั้งค่าอีเมล์
      'SETTINGS_SYSTEM',         // ตั้งค่าระบบ
      'SETTINGS_BRANCHES',       // สาขา
      'SETTINGS_GRADE_LEVELS',   // ระดับชั้น
      'SETTINGS_SUBJECTS',       // วิชา
      'SETTINGS_INCLUSIONS',     // สิ่งที่ได้รับ
      'SETTINGS_ROLES',          // บทบาทผู้ใช้
      'SETTINGS_PAYMENT_METHODS', // วิธีการชำระเงิน
      'SETTINGS_USERS'           // จัดการผู้ใช้งาน
    ]
    
    // Get all menus - need to build query with individual placeholders
    const placeholders = restrictedMenuCodes.map(() => '?').join(',')
    const [menus] = await connection.execute(
      `SELECT id, code, name, roles FROM admin_menus WHERE code IN (${placeholders})`,
      restrictedMenuCodes
    ) as any[]
    
    console.log(`Found ${menus.length} restricted menus`)
    console.log('')
    
    let updatedCount = 0
    
    for (const menu of menus) {
      try {
        // Parse existing roles
        const existingRoles = JSON.parse(menu.roles || '[]') as string[]
        
        // Check if 'admin' is in the roles
        if (!existingRoles.includes('admin')) {
          console.log(`   ⏭️  Menu "${menu.name}" (${menu.code}) - admin role already removed`)
          continue
        }
        
        // Remove 'admin' from roles (keep only system_admin and owner)
        const updatedRoles = existingRoles.filter((role: string) => role !== 'admin')
        const rolesJson = JSON.stringify(updatedRoles)
        
        await connection.execute(
          'UPDATE admin_menus SET roles = ? WHERE id = ?',
          [rolesJson, menu.id]
        )
        
        console.log(`   ✅ Updated menu "${menu.name}" (${menu.code})`)
        console.log(`      Old roles: ${existingRoles.join(', ')}`)
        console.log(`      New roles: ${updatedRoles.join(', ')}`)
        updatedCount++
      } catch (error: any) {
        console.error(`   ❌ Error updating menu ${menu.code}: ${error.message}`)
      }
    }
    
    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`✅ Updated ${updatedCount} menu(s)`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('📊 Summary:')
    console.log('   Admin กลาง (admin role) will now see:')
    console.log('   ✅ Dashboard, ผู้เรียน, คอร์สเรียน, การลงทะเบียน, การชำระเงิน, โปรโมชั่น')
    console.log('   ✅ รายงาน (ยกเว้น รายงานผู้ใช้งาน)')
    console.log('   ❌ ตั้งค่า (ทั้งหมด) - ไม่เห็นแล้ว')
    console.log('   ❌ รายงานผู้ใช้งาน - ไม่เห็นแล้ว')
    console.log('   ❌ จัดการผู้ใช้งาน - ไม่เห็นแล้ว')
    console.log('')
    
  } catch (error: any) {
    console.error('❌ Error fixing admin role menus:', error.message)
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

fixAdminRoleMenus()

