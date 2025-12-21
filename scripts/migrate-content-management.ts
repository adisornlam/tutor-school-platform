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

async function migrateContentManagement() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🔄 Migrating content management tables...')
    console.log('')
    
    // Read SQL file
    const sqlPath = join(__dirname, '../docs/migrations/add_content_management_tables.sql')
    const sql = readFileSync(sqlPath, 'utf-8')
    
    // Execute SQL statements
    const statements = sql.split(';').filter(s => s.trim().length > 0)
    
    for (const statement of statements) {
      try {
        await connection.execute(statement.trim() + ';')
        console.log('   ✅ Executed SQL statement')
      } catch (error: any) {
        if (error.code === 'ER_TABLE_EXISTS_ERROR' || error.code === 'ER_DUP_ENTRY') {
          console.log('   ⚠️  Table already exists, skipping...')
        } else {
          console.log(`   ⚠️  Error: ${error.message}`)
        }
      }
    }
    
    console.log('')
    console.log('✅ Content management tables migration completed!')
    console.log('')
    
  } catch (error: any) {
    console.error('❌ Error migrating content management tables:', error.message)
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

migrateContentManagement()

