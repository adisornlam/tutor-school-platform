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

async function migratePaymentMethods() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🔄 Migrating payment methods tables...')
    console.log('')
    
    // Read SQL file
    const sqlPath = join(process.cwd(), 'docs/migrations/add_payment_methods_tables.sql')
    const sql = readFileSync(sqlPath, 'utf-8')
    
    // Execute SQL
    await connection.query(sql)
    
    console.log('✅ Payment methods tables created successfully!')
    console.log('✅ Default payment methods inserted!')
    console.log('')
    
    // Verify by querying payment methods
    const [methods] = await connection.execute(
      'SELECT id, code, name, type, is_active, is_default FROM payment_methods ORDER BY display_order'
    ) as any[]
    
    console.log('📋 Payment Methods Created:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    methods.forEach((method: any) => {
      console.log(`   • ${method.name} (${method.code})`)
      console.log(`     Type: ${method.type}, Active: ${method.is_active ? 'Yes' : 'No'}, Default: ${method.is_default ? 'Yes' : 'No'}`)
    })
    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`✅ Total: ${methods.length} payment methods created`)
    console.log('')
    
  } catch (error: any) {
    console.error('❌ Error migrating payment methods:', error.message)
    if (error.sql) {
      console.error('SQL:', error.sql)
    }
    process.exit(1)
  } finally {
    await connection.end()
  }
}

// Run migration
migratePaymentMethods()

