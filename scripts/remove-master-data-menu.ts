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

async function removeMasterDataMenu() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🔄 Removing "จัดการข้อมูลหลัก" menu...')
    console.log('')
    
    // Deactivate or delete SETTINGS_MASTER_DATA menu
    const [masterDataMenu] = await connection.execute(
      'SELECT id, code, name FROM admin_menus WHERE code = ?',
      ['SETTINGS_MASTER_DATA']
    ) as any[]
    
    if (masterDataMenu.length > 0) {
      // Deactivate it
      await connection.execute(
        'UPDATE admin_menus SET is_active = FALSE WHERE code = ?',
        ['SETTINGS_MASTER_DATA']
      )
      console.log(`   ✅ Deactivated menu: ${masterDataMenu[0].name} (${masterDataMenu[0].code})`)
    } else {
      console.log('   ℹ️  "จัดการข้อมูลหลัก" menu not found (already removed)')
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

removeMasterDataMenu()

