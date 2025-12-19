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

async function removeBranchesParentMenu() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🔄 Removing BRANCHES parent menu...')
    console.log('')
    
    // Deactivate or delete BRANCHES parent menu (if it exists as parent)
    const [branchesMenu] = await connection.execute(
      'SELECT id, code, parent_code FROM admin_menus WHERE code = ? AND parent_code IS NULL',
      ['BRANCHES']
    ) as any[]
    
    if (branchesMenu.length > 0) {
      // Deactivate it instead of deleting (safer)
      await connection.execute(
        'UPDATE admin_menus SET is_active = FALSE WHERE code = ? AND parent_code IS NULL',
        ['BRANCHES']
      )
      console.log('   ✅ Deactivated BRANCHES parent menu')
    } else {
      console.log('   ℹ️  BRANCHES parent menu not found (already removed or never existed)')
    }
    
    console.log('')
    console.log('✅ Completed!')
    console.log('')
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
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

removeBranchesParentMenu()

