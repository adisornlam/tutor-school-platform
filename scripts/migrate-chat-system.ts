import mysql from 'mysql2/promise'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load .env if exists
try {
  const envPath = join(process.cwd(), '.env')
  const envContent = readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=')
    if (key && values.length) {
      const value = values.join('=').trim().replace(/^["']|["']$/g, '')
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = value
      }
    }
  })
} catch (error) {
  // .env file not found, use defaults
}

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tutordb'
}

async function migrateChatSystem() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🔄 Migrating chat system tables...')
    console.log('')
    
    // Read SQL file
    const sqlPath = join(__dirname, '../docs/migrations/add_chat_system_tables.sql')
    const sql = readFileSync(sqlPath, 'utf-8')
    
    // Execute SQL statements
    const statements = sql.split(';').filter(s => s.trim().length > 0)
    
    for (const statement of statements) {
      try {
        await connection.execute(statement.trim() + ';')
        console.log('   ✅ Executed SQL statement')
      } catch (error: any) {
        if (error.code === 'ER_DUP_TABLE') {
          console.log('   ⚠️  Table already exists, skipping...')
        } else {
          throw error
        }
      }
    }
    
    console.log('')
    console.log('✅ Chat system migration completed successfully!')
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
    if (error.sqlMessage) {
      console.error('   SQL Error:', error.sqlMessage)
    }
    process.exit(1)
  } finally {
    await connection.end()
  }
}

migrateChatSystem()

