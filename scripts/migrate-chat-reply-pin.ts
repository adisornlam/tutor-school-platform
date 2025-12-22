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

async function migrateChatReplyPin() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🔄 Migrating chat message reply and pin features...')
    console.log('')
    
    const dbName = config.database
    const tableName = 'chat_messages'
    
    // Check if reply_to_id column exists
    const [replyToColumns] = await connection.execute<any[]>(
      `SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = 'reply_to_id'`,
      [dbName, tableName]
    )
    
    if (replyToColumns[0].count === 0) {
      console.log('   ➕ Adding reply_to_id column...')
      await connection.execute(
        `ALTER TABLE ${tableName} ADD COLUMN reply_to_id INT NULL AFTER file_type`
      )
      console.log('   ✅ Added reply_to_id column')
    } else {
      console.log('   ⚠️  reply_to_id column already exists, skipping...')
    }
    
    // Check if is_pinned column exists
    const [pinnedColumns] = await connection.execute<any[]>(
      `SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = 'is_pinned'`,
      [dbName, tableName]
    )
    
    if (pinnedColumns[0].count === 0) {
      console.log('   ➕ Adding is_pinned column...')
      await connection.execute(
        `ALTER TABLE ${tableName} ADD COLUMN is_pinned BOOLEAN DEFAULT FALSE AFTER reply_to_id`
      )
      console.log('   ✅ Added is_pinned column')
    } else {
      console.log('   ⚠️  is_pinned column already exists, skipping...')
    }
    
    // Check if foreign key exists
    const [fks] = await connection.execute<any[]>(
      `SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND CONSTRAINT_NAME = 'chat_messages_ibfk_reply'`,
      [dbName, tableName]
    )
    
    if (fks[0].count === 0) {
      console.log('   ➕ Adding foreign key constraint...')
      await connection.execute(
        `ALTER TABLE ${tableName} ADD CONSTRAINT chat_messages_ibfk_reply 
         FOREIGN KEY (reply_to_id) REFERENCES chat_messages(id) ON DELETE SET NULL`
      )
      console.log('   ✅ Added foreign key constraint')
    } else {
      console.log('   ⚠️  Foreign key already exists, skipping...')
    }
    
    // Add indexes
    try {
      console.log('   ➕ Adding indexes...')
      await connection.execute(`CREATE INDEX idx_reply_to ON ${tableName}(reply_to_id)`)
      console.log('   ✅ Added idx_reply_to index')
    } catch (error: any) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('   ⚠️  idx_reply_to index already exists, skipping...')
      } else {
        throw error
      }
    }
    
    try {
      await connection.execute(`CREATE INDEX idx_is_pinned ON ${tableName}(is_pinned)`)
      console.log('   ✅ Added idx_is_pinned index')
    } catch (error: any) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('   ⚠️  idx_is_pinned index already exists, skipping...')
      } else {
        throw error
      }
    }
    
    console.log('')
    console.log('✅ Chat message reply and pin migration completed successfully!')
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

migrateChatReplyPin()

