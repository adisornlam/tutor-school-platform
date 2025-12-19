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

interface OwnerUser {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
  role: 'owner'
}

async function createOwner() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('👑 Creating owner user...')
    console.log('')
    
    // Owner user data
    const ownerUser: OwnerUser = {
      email: 'owner@kdcschool.com',
      password: 'owner123', // Default password - should be changed
      first_name: 'Owner',
      last_name: 'KDC School',
      phone: '0812345679',
      role: 'owner'
    }
    
    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [ownerUser.email]
    ) as any[]
    
    if (existingUsers.length > 0) {
      console.log('⚠️  Owner user already exists!')
      console.log(`   Email: ${ownerUser.email}`)
      return
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(ownerUser.password, 12)
    
    // Create user
    const [userResult] = await connection.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, status, email_verified_at)
       VALUES (?, ?, ?, ?, ?, 'active', NOW())`,
      [
        ownerUser.email,
        passwordHash,
        ownerUser.first_name,
        ownerUser.last_name,
        ownerUser.phone || null
      ]
    ) as any[]
    
    const userId = userResult.insertId
    console.log(`✅ User created with ID: ${userId}`)
    
    // Get role ID
    const [roles] = await connection.execute(
      'SELECT id FROM roles WHERE name = ?',
      [ownerUser.role]
    ) as any[]
    
    if (roles.length === 0) {
      throw new Error(`Role '${ownerUser.role}' not found`)
    }
    
    const roleId = roles[0].id
    
    // Assign role
    await connection.execute(
      'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
      [userId, roleId]
    )
    
    console.log(`✅ Role '${ownerUser.role}' assigned`)
    console.log('')
    console.log('📋 Owner User Details:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   Email:    ${ownerUser.email}`)
    console.log(`   Password: ${ownerUser.password}`)
    console.log(`   Name:     ${ownerUser.first_name} ${ownerUser.last_name}`)
    console.log(`   Role:     ${ownerUser.role}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('⚠️  IMPORTANT: Change the password after first login!')
    console.log('')
    
  } catch (error: any) {
    console.error('❌ Error creating owner user:', error.message)
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

createOwner()

