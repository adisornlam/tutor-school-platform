import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import { readFileSync } from 'fs'
import { join } from 'path'

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tutordb'
}

interface AdminUser {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
  role: 'system_admin' | 'owner'
}

async function createAdmin() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🔐 Creating admin user...')
    console.log('')
    
    // Admin user data
    const adminUser: AdminUser = {
      email: 'admin@kdcschool.com',
      password: 'admin123', // Default password - should be changed
      first_name: 'System',
      last_name: 'Administrator',
      phone: '0812345678',
      role: 'system_admin'
    }
    
    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [adminUser.email]
    ) as any[]
    
    if (existingUsers.length > 0) {
      console.log('⚠️  Admin user already exists!')
      console.log(`   Email: ${adminUser.email}`)
      console.log('')
      console.log('To reset password, delete the user first or update manually.')
      return
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(adminUser.password, 12)
    
    // Create user
    const [userResult] = await connection.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, status, email_verified_at)
       VALUES (?, ?, ?, ?, ?, 'active', NOW())`,
      [
        adminUser.email,
        passwordHash,
        adminUser.first_name,
        adminUser.last_name,
        adminUser.phone || null
      ]
    ) as any[]
    
    const userId = userResult.insertId
    console.log(`✅ User created with ID: ${userId}`)
    
    // Get role ID
    const [roles] = await connection.execute(
      'SELECT id FROM roles WHERE name = ?',
      [adminUser.role]
    ) as any[]
    
    if (roles.length === 0) {
      throw new Error(`Role '${adminUser.role}' not found`)
    }
    
    const roleId = roles[0].id
    
    // Assign role
    await connection.execute(
      'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
      [userId, roleId]
    )
    
    console.log(`✅ Role '${adminUser.role}' assigned`)
    console.log('')
    console.log('📋 Admin User Details:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   Email:    ${adminUser.email}`)
    console.log(`   Password: ${adminUser.password}`)
    console.log(`   Name:     ${adminUser.first_name} ${adminUser.last_name}`)
    console.log(`   Role:     ${adminUser.role}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('⚠️  IMPORTANT: Change the password after first login!')
    console.log('')
    
  } catch (error: any) {
    console.error('❌ Error creating admin user:', error.message)
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

createAdmin()

