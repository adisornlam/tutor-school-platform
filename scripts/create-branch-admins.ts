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

interface BranchAdminUser {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  branch_code: string
}

async function createBranchAdmins() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('👤 Creating Branch Admin users...')
    console.log('')
    
    // Get role IDs
    const [roles] = await connection.execute(
      'SELECT id, name FROM roles'
    ) as any[]
    
    const roleMap = new Map(roles.map((r: any) => [r.name, r.id]))
    const branchAdminRoleId = roleMap.get('branch_admin')
    
    if (!branchAdminRoleId) {
      throw new Error('branch_admin role not found. Please seed roles first.')
    }
    
    // Get branches
    const [branches] = await connection.execute(
      'SELECT id, code, name FROM branches'
    ) as any[]
    
    if (branches.length === 0) {
      throw new Error('No branches found. Please seed master data first.')
    }
    
    const branchMap = new Map(branches.map((b: any) => [b.code, b]))
    
    // Branch admins to create
    const branchAdmins: BranchAdminUser[] = [
      {
        username: 'branch_admin_fashion',
        email: 'branch_admin_fashion@kdcschool.com',
        password: 'password123',
        first_name: 'Branch',
        last_name: 'Admin Fashion',
        branch_code: 'FASHION_ISLAND'
      },
      {
        username: 'branch_admin_saraburi',
        email: 'branch_admin_saraburi@kdcschool.com',
        password: 'password123',
        first_name: 'Branch',
        last_name: 'Admin Saraburi',
        branch_code: 'SARABURI'
      }
    ]
    
    for (const adminData of branchAdmins) {
      const branch = branchMap.get(adminData.branch_code)
      
      if (!branch) {
        console.log(`   ⚠️  Branch "${adminData.branch_code}" not found, skipping...`)
        continue
      }
      
      // Check if user already exists
      const [existingUsers] = await connection.execute(
        'SELECT id FROM users WHERE username = ? OR email = ?',
        [adminData.username, adminData.email]
      ) as any[]
      
      if (existingUsers.length > 0) {
        const userId = existingUsers[0].id
        
        // Check if user already has branch_admin role
        const [existingRoles] = await connection.execute(
          'SELECT ur.role_id FROM user_roles ur WHERE ur.user_id = ? AND ur.role_id = ?',
          [userId, branchAdminRoleId]
        ) as any[]
        
        if (existingRoles.length > 0) {
          // Check if already linked to branch
          const [existingBranchAdmins] = await connection.execute(
            'SELECT id FROM branch_admins WHERE user_id = ? AND branch_id = ?',
            [userId, branch.id]
          ) as any[]
          
          if (existingBranchAdmins.length > 0) {
            console.log(`   ⚠️  Branch admin for "${branch.name}" already exists (User ID: ${userId})`)
            continue
          } else {
            // User exists with role but not linked to branch - link it
            await connection.execute(
              'INSERT INTO branch_admins (branch_id, user_id) VALUES (?, ?)',
              [branch.id, userId]
            )
            console.log(`   ✅ Linked existing user "${adminData.username}" to branch "${branch.name}"`)
            continue
          }
        } else {
          // User exists but doesn't have branch_admin role - add role
          await connection.execute(
            'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
            [userId, branchAdminRoleId]
          )
          
          // Link to branch
          await connection.execute(
            'INSERT INTO branch_admins (branch_id, user_id) VALUES (?, ?)',
            [branch.id, userId]
          )
          console.log(`   ✅ Added branch_admin role and linked to branch "${branch.name}" for existing user "${adminData.username}"`)
          continue
        }
      }
      
      // Create new user
      const passwordHash = await bcrypt.hash(adminData.password, 12)
      
      const [userResult] = await connection.execute(
        `INSERT INTO users (username, email, password_hash, first_name, last_name, status)
         VALUES (?, ?, ?, ?, ?, 'active')`,
        [
          adminData.username,
          adminData.email,
          passwordHash,
          adminData.first_name,
          adminData.last_name
        ]
      ) as any[]
      
      const userId = userResult.insertId
      
      // Assign branch_admin role
      await connection.execute(
        'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
        [userId, branchAdminRoleId]
      )
      
      // Link to branch
      await connection.execute(
        'INSERT INTO branch_admins (branch_id, user_id) VALUES (?, ?)',
        [branch.id, userId]
      )
      
      console.log(`   ✅ Created branch admin: ${adminData.username} for "${branch.name}" (User ID: ${userId})`)
    }
    
    console.log('')
    console.log('✅ Branch admin creation completed!')
    console.log('')
    
    // Display summary
    const [branchAdminCount] = await connection.execute(
      `SELECT COUNT(DISTINCT ba.user_id) as count 
       FROM branch_admins ba
       JOIN user_roles ur ON ba.user_id = ur.user_id
       WHERE ur.role_id = ?`,
      [branchAdminRoleId]
    ) as any[]
    
    console.log('📊 Summary:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   Branch Admins: ${branchAdminCount[0].count}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    
    // Display branch admin details
    const [branchAdminDetails] = await connection.execute(
      `SELECT u.username, u.email, u.first_name, u.last_name, b.name as branch_name, b.code as branch_code
       FROM branch_admins ba
       JOIN users u ON ba.user_id = u.id
       JOIN branches b ON ba.branch_id = b.id
       JOIN user_roles ur ON u.id = ur.user_id
       WHERE ur.role_id = ?
       ORDER BY b.code`,
      [branchAdminRoleId]
    ) as any[]
    
    console.log('👥 Branch Admin Users:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    branchAdminDetails.forEach((admin: any) => {
      console.log(`   ${admin.branch_name} (${admin.branch_code}):`)
      console.log(`     - Username: ${admin.username}`)
      console.log(`     - Email: ${admin.email}`)
      console.log(`     - Name: ${admin.first_name} ${admin.last_name}`)
      console.log(`     - Password: password123`)
      console.log('')
    })
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    
  } catch (error: any) {
    console.error('❌ Error creating branch admins:', error.message)
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

createBranchAdmins()

