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

async function migrate() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('📦 Starting database migration...')
    
    // Read schema file
    const schemaPath = join(process.cwd(), 'docs', 'DATABASE_SCHEMA.sql')
    let schema: string
    
    try {
      schema = readFileSync(schemaPath, 'utf-8')
    } catch (error) {
      console.error('❌ Schema file not found. Please create DATABASE_SCHEMA.sql in docs/')
      process.exit(1)
    }
    
    // Execute schema
    await connection.query(schema)
    
    console.log('✅ Database migration completed successfully!')
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    await connection.end()
  }
}

migrate()

