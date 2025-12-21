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

async function updateMenusForAdminRole() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🔄 Updating admin menus to include "admin" role...')
    console.log('')
    
    // Get all menus that have roles field
    const [menus] = await connection.execute(
      'SELECT id, code, name, roles FROM admin_menus WHERE roles IS NOT NULL'
    ) as any[]
    
    console.log(`Found ${menus.length} menus with role restrictions`)
    console.log('')
    
    let updatedCount = 0
    
    for (const menu of menus) {
      try {
        // Parse existing roles
        const existingRoles = JSON.parse(menu.roles || '[]') as string[]
        
        // Check if 'admin' is already in the roles
        if (existingRoles.includes('admin')) {
          console.log(`   ⏭️  Menu "${menu.name}" (${menu.code}) already includes 'admin' role`)
          continue
        }
        
        // Determine which menus should include 'admin' role
        // Admin กลาง should have access to the same menus as branch_admin
        const shouldIncludeAdmin = existingRoles.some(role => 
          ['system_admin', 'owner', 'branch_admin'].includes(role)
        )
        
        if (shouldIncludeAdmin) {
          // Add 'admin' to the roles array
          const updatedRoles = [...existingRoles, 'admin']
          const rolesJson = JSON.stringify(updatedRoles)
          
          await connection.execute(
            'UPDATE admin_menus SET roles = ? WHERE id = ?',
            [rolesJson, menu.id]
          )
          
          console.log(`   ✅ Updated menu "${menu.name}" (${menu.code})`)
          console.log(`      Old roles: ${existingRoles.join(', ')}`)
          console.log(`      New roles: ${updatedRoles.join(', ')}`)
          updatedCount++
        } else {
          console.log(`   ⏭️  Menu "${menu.name}" (${menu.code}) - Skipping (not for admin roles)`)
        }
      } catch (error: any) {
        console.error(`   ❌ Error updating menu ${menu.code}: ${error.message}`)
      }
    }
    
    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`✅ Updated ${updatedCount} menu(s)`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('✨ Admin กลาง (admin role) can now see all admin menus!')
    console.log('')
    
  } catch (error: any) {
    console.error('❌ Error updating menus:', error.message)
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

updateMenusForAdminRole()

