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

interface AdminCenterUser {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
  role: 'admin' // Admin กลาง
}

async function createAdminCenter() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('👤 Creating Admin กลาง user...')
    console.log('')
    
    // Admin กลาง user data
    const adminCenterUser: AdminCenterUser = {
      email: 'admincenter@kdcschool.com',
      password: 'admin123', // Default password - should be changed
      first_name: 'Admin',
      last_name: 'กลาง',
      phone: '0812345680',
      role: 'admin'
    }
    
    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id, username FROM users WHERE email = ? OR username = ?',
      [adminCenterUser.email, adminCenterUser.email.split('@')[0]]
    ) as any[]
    
    let userId: number
    
    if (existingUsers.length > 0) {
      userId = existingUsers[0].id
      console.log(`⚠️  User already exists with ID: ${userId}`)
      console.log(`   Email: ${adminCenterUser.email}`)
      console.log('   Updating role to Admin กลาง...')
      
      // Check if user already has admin role
      const [existingRoles] = await connection.execute(
        `SELECT ur.role_id, r.name 
         FROM user_roles ur 
         JOIN roles r ON ur.role_id = r.id 
         WHERE ur.user_id = ? AND r.name = 'admin'`,
        [userId]
      ) as any[]
      
      if (existingRoles.length > 0) {
        console.log('✅ User already has Admin กลาง role')
        return
      }
      
      // Remove existing roles (optional - comment out if you want to keep multiple roles)
      // await connection.execute('DELETE FROM user_roles WHERE user_id = ?', [userId])
    } else {
    
    // Hash password
    const passwordHash = await bcrypt.hash(adminCenterUser.password, 12)
    
      // Get username from email (part before @)
      const username = adminCenterUser.email.split('@')[0]
      
      // Create user
      const [userResult] = await connection.execute(
        `INSERT INTO users (username, email, password_hash, first_name, last_name, phone, status, email_verified_at)
         VALUES (?, ?, ?, ?, ?, ?, 'active', NOW())`,
        [
          username,
          adminCenterUser.email,
          passwordHash,
          adminCenterUser.first_name,
          adminCenterUser.last_name,
          adminCenterUser.phone || null
        ]
      ) as any[]
      
      userId = userResult.insertId
      console.log(`✅ User created with ID: ${userId}`)
    }
    
    // Get role ID for 'admin'
    const [roles] = await connection.execute(
      'SELECT id FROM roles WHERE name = ?',
      [adminCenterUser.role]
    ) as any[]
    
    if (roles.length === 0) {
      throw new Error(`Role '${adminCenterUser.role}' not found. Please run migration first: bun run scripts/migrate-admin-role.ts`)
    }
    
    const roleId = roles[0].id
    
    // Check if role is already assigned
    const [existingRoleAssignment] = await connection.execute(
      'SELECT id FROM user_roles WHERE user_id = ? AND role_id = ?',
      [userId, roleId]
    ) as any[]
    
    if (existingRoleAssignment.length === 0) {
      // Assign role
      await connection.execute(
        'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
        [userId, roleId]
      )
    
      console.log(`✅ Role '${adminCenterUser.role}' (Admin กลาง) assigned`)
    } else {
      console.log(`✅ Role '${adminCenterUser.role}' (Admin กลาง) already assigned`)
    }
    
    // Get user info for display
    const [userInfo] = await connection.execute(
      'SELECT username, email, first_name, last_name, phone FROM users WHERE id = ?',
      [userId]
    ) as any[]
    
    const user = userInfo[0]
    
    console.log('')
    console.log('📋 Admin กลาง User Details:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   User ID:  ${userId}`)
    console.log(`   Username: ${user.username}`)
    console.log(`   Email:    ${user.email}`)
    if (!existingUsers || existingUsers.length === 0) {
      console.log(`   Password: ${adminCenterUser.password}`)
    }
    console.log(`   Name:     ${user.first_name} ${user.last_name}`)
    console.log(`   Role:     ${adminCenterUser.role} (Admin กลาง)`)
    console.log(`   Phone:    ${user.phone || '-'}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    if (!existingUsers || existingUsers.length === 0) {
      console.log('⚠️  IMPORTANT: Change the password after first login!')
      console.log('')
    }
    console.log('✨ Admin กลาง สามารถจัดการข้อมูลได้ทั้ง 2 สาขา')
    console.log('')
    
  } catch (error: any) {
    console.error('❌ Error creating Admin กลาง user:', error.message)
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('   User with this email or username already exists')
    }
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

createAdminCenter()

