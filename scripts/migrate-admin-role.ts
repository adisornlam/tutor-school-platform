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

async function migrateAdminRole() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('📦 Starting admin role migration...')
    console.log(`Connecting to ${config.host}:${config.port}/${config.database}`)
    
    // Read migration file
    const migrationPath = join(process.cwd(), 'docs', 'migrations', 'add_admin_role.sql')
    let migrationSQL: string
    
    try {
      migrationSQL = readFileSync(migrationPath, 'utf-8')
    } catch (error) {
      console.error('❌ Migration file not found:', migrationPath)
      process.exit(1)
    }
    
    // Execute migration
    console.log('Running migration SQL...')
    await connection.query(migrationSQL)
    
    // Verify the role was added
    const [rows] = await connection.query<any[]>(
      "SELECT id, name, description FROM roles WHERE name = 'admin'"
    )
    
    if (rows.length > 0) {
      const role = rows[0]
      console.log('✅ Admin role migration completed successfully!')
      console.log(`   Role ID: ${role.id}`)
      console.log(`   Name: ${role.name}`)
      console.log(`   Description: ${role.description}`)
    } else {
      console.log('⚠️  Migration ran but role not found. Please check manually.')
    }
    
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
    if (error.code) {
      console.error('   Error code:', error.code)
    }
    process.exit(1)
  } finally {
    await connection.end()
  }
}

migrateAdminRole()

