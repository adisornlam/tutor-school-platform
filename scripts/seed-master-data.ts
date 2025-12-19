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

interface Branch {
  name: string
  code: string
  address?: string
  phone?: string
  email?: string
}

async function seedMasterData() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🌱 Seeding master data...')
    console.log('')
    
    // Branches data
    const branches: Branch[] = [
      {
        name: 'แฟชั่นไอส์แลนด์',
        code: 'FASHION_ISLAND',
        address: 'แฟชั่นไอส์แลนด์ กรุงเทพมหานคร',
        phone: '02-123-4567',
        email: 'fashionisland@kdcschool.com'
      },
      {
        name: 'สระบุรี',
        code: 'SARABURI',
        address: 'สระบุรี',
        phone: '036-123-4567',
        email: 'saraburi@kdcschool.com'
      }
    ]
    
    console.log('📌 Creating branches...')
    
    for (const branch of branches) {
      // Check if branch already exists
      const [existingBranches] = await connection.execute(
        'SELECT id FROM branches WHERE code = ?',
        [branch.code]
      ) as any[]
      
      if (existingBranches.length > 0) {
        console.log(`   ⚠️  Branch "${branch.name}" already exists (code: ${branch.code})`)
        continue
      }
      
      // Insert branch
      await connection.execute(
        `INSERT INTO branches (name, code, address, phone, email, status)
         VALUES (?, ?, ?, ?, ?, 'active')`,
        [
          branch.name,
          branch.code,
          branch.address || null,
          branch.phone || null,
          branch.email || null
        ]
      )
      
      console.log(`   ✅ Created branch: ${branch.name} (${branch.code})`)
    }
    
    console.log('')
    console.log('✅ Master data seeding completed!')
    console.log('')
    
    // Display created branches
    const [allBranches] = await connection.execute(
      'SELECT id, name, code, status FROM branches ORDER BY id'
    ) as any[]
    
    console.log('📋 Current Branches:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    allBranches.forEach((branch: any) => {
      console.log(`   ID: ${branch.id} | ${branch.name} (${branch.code}) | ${branch.status}`)
    })
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    
  } catch (error: any) {
    console.error('❌ Error seeding master data:', error.message)
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

seedMasterData()

