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

async function migrateUsernameField() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🔄 Migrating username field...')
    console.log('')
    
    // Check if username column already exists
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'username'`,
      [config.database]
    ) as any[]
    
    if (columns.length > 0) {
      console.log('   ⚠️  Column "username" already exists, skipping...')
    } else {
      // Step 1: Add username column as nullable first
      await connection.execute(
        `ALTER TABLE users 
         ADD COLUMN username VARCHAR(100) NULL AFTER email`
      )
      console.log('   ✅ Added column: username (nullable)')
      
      // Step 2: Generate username for existing users
      const [existingUsers] = await connection.execute(
        'SELECT id, email FROM users WHERE username IS NULL'
      ) as any[]
      
      if (existingUsers.length > 0) {
        console.log(`   📝 Generating usernames for ${existingUsers.length} existing users...`)
        
        for (const user of existingUsers) {
          let username: string
          
          if (user.email) {
            // Use email prefix as username
            username = user.email.split('@')[0]
          } else {
            // Use user_id as fallback
            username = `user${user.id}`
          }
          
          // Ensure uniqueness
          let uniqueUsername = username
          let counter = 1
          while (true) {
            const [existing] = await connection.execute(
              'SELECT id FROM users WHERE username = ?',
              [uniqueUsername]
            ) as any[]
            
            if (existing.length === 0) {
              break
            }
            
            uniqueUsername = `${username}${counter}`
            counter++
          }
          
          await connection.execute(
            'UPDATE users SET username = ? WHERE id = ?',
            [uniqueUsername, user.id]
          )
          
          console.log(`      → Generated username: ${uniqueUsername} for user ID ${user.id}`)
        }
      }
      
      // Step 3: Make username NOT NULL and add unique constraint
      await connection.execute(
        'ALTER TABLE users MODIFY COLUMN username VARCHAR(100) NOT NULL'
      )
      console.log('   ✅ Made username NOT NULL')
      
      // Step 4: Add unique constraint and index
      await connection.execute(
        'ALTER TABLE users ADD UNIQUE KEY idx_username (username)'
      )
      console.log('   ✅ Added unique constraint and index: idx_username')
    }
    
    // Check current email constraint
    const [emailColumns] = await connection.execute(
      `SELECT COLUMN_NAME, IS_NULLABLE, COLUMN_DEFAULT
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'email'`,
      [config.database]
    ) as any[]
    
    if (emailColumns.length > 0) {
      const emailColumn = emailColumns[0]
      
      // If email is NOT NULL, make it nullable
      if (emailColumn.IS_NULLABLE === 'NO') {
        // First, drop unique constraint if exists
        try {
          await connection.execute('ALTER TABLE users DROP INDEX idx_email')
          console.log('   ✅ Dropped old email index')
        } catch (error: any) {
          // Index might not exist or have different name
          console.log('   ⚠️  Could not drop email index (might not exist)')
        }
        
        // Make email nullable
        await connection.execute(
          'ALTER TABLE users MODIFY COLUMN email VARCHAR(255) NULL'
        )
        console.log('   ✅ Made email column nullable')
        
        // Re-add unique constraint (allows NULL)
        await connection.execute(
          'ALTER TABLE users ADD UNIQUE KEY idx_email (email(191))'
        )
        console.log('   ✅ Re-added email unique constraint (allows NULL)')
      } else {
        console.log('   ⚠️  Email column is already nullable')
      }
    }
    
    console.log('')
    console.log('✅ Username field migration completed!')
    console.log('')
    
    // Display summary
    const [userCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM users'
    ) as any[]
    
    console.log('📊 Summary:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   Total Users: ${userCount[0].count}`)
    console.log('   Username field: ✅ Added')
    console.log('   Email field: ✅ Optional (nullable)')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    
  } catch (error: any) {
    console.error('❌ Error migrating username field:', error.message)
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

migrateUsernameField()

