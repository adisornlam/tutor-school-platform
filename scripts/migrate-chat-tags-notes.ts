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
  database: process.env.DB_NAME || 'tutordb',
  multipleStatements: true
}

async function migrateChatTagsNotes() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🔄 Migrating chat room tags and notes tables...')
    console.log('')
    
    // Read SQL file
    const sqlPath = join(__dirname, '../docs/migrations/add_chat_room_tags_notes.sql')
    const sql = readFileSync(sqlPath, 'utf-8')
    
    // Execute SQL statements
    const statements = sql.split(';').filter(s => s.trim().length > 0)
    
    for (const statement of statements) {
      try {
        const trimmedStatement = statement.trim()
        if (trimmedStatement.length > 0) {
          await connection.execute(trimmedStatement + ';')
          console.log('   ✅ Executed SQL statement')
        }
      } catch (error: any) {
        if (error.code === 'ER_DUP_TABLE') {
          console.log('   ⚠️  Table already exists, skipping...')
        } else {
          throw error
        }
      }
    }
    
    console.log('')
    console.log('✅ Chat room tags and notes migration completed successfully!')
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
    if (error.sqlMessage) {
      console.error('   SQL Error:', error.sqlMessage)
    }
    if (error.sql) {
      console.error('   SQL:', error.sql)
    }
    process.exit(1)
  } finally {
    await connection.end()
  }
}

migrateChatTagsNotes()

