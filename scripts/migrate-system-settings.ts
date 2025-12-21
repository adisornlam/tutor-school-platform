import mysql from 'mysql2/promise'
import { readFileSync } from 'fs'
import { join } from 'path'

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tutordb',
  multipleStatements: true
}

async function migrateSystemSettings() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🔄 Migrating system settings table...')
    console.log('')
    
    // Read SQL file
    const sqlPath = join(process.cwd(), 'docs/migrations/add_system_settings_table.sql')
    const sql = readFileSync(sqlPath, 'utf-8')
    
    // Execute SQL
    await connection.query(sql)
    
    console.log('✅ System settings table created successfully!')
    console.log('✅ Default system settings inserted!')
    console.log('')
    
    // Verify by querying some settings
    const [settings] = await connection.execute(
      'SELECT `key`, value, category FROM system_settings ORDER BY category, `key`'
    ) as any[]
    
    console.log('📋 System Settings Created:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    const groupedByCategory: Record<string, any[]> = {}
    settings.forEach((setting: any) => {
      if (!groupedByCategory[setting.category]) {
        groupedByCategory[setting.category] = []
      }
      groupedByCategory[setting.category].push(setting)
    })
    
    Object.keys(groupedByCategory).forEach(category => {
      console.log(`\n📁 ${category.toUpperCase()}:`)
      groupedByCategory[category].forEach((setting: any) => {
        const valueDisplay = setting.value && setting.value.length > 50 
          ? setting.value.substring(0, 50) + '...' 
          : setting.value
        console.log(`   • ${setting.key}: ${valueDisplay}`)
      })
    })
    
    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`✅ Total: ${settings.length} settings created`)
    console.log('')
    
  } catch (error: any) {
    console.error('❌ Error migrating system settings:', error.message)
    if (error.sql) {
      console.error('SQL:', error.sql)
    }
    process.exit(1)
  } finally {
    await connection.end()
  }
}

// Run migration
migrateSystemSettings()

