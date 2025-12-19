#!/usr/bin/env bun

/**
 * Test Login API
 * Usage: bun run scripts/test-login.ts
 */

const API_BASE = process.env.API_BASE || 'http://localhost:4000/api'

interface TestCase {
  name: string
  email: string
  password: string
  expectedStatus: number
}

const testCases: TestCase[] = [
  {
    name: 'Admin Login (Success)',
    email: 'admin@kdcschool.com',
    password: 'admin123',
    expectedStatus: 200
  },
  {
    name: 'Owner Login (Success)',
    email: 'owner@kdcschool.com',
    password: 'owner123',
    expectedStatus: 200
  },
  {
    name: 'Invalid Email (Failure)',
    email: 'wrong@email.com',
    password: 'admin123',
    expectedStatus: 401
  },
  {
    name: 'Invalid Password (Failure)',
    email: 'admin@kdcschool.com',
    password: 'wrongpassword',
    expectedStatus: 401
  },
  {
    name: 'Missing Email (Validation Error)',
    email: '',
    password: 'admin123',
    expectedStatus: 400
  },
  {
    name: 'Missing Password (Validation Error)',
    email: 'admin@kdcschool.com',
    password: '',
    expectedStatus: 400
  }
]

async function testLogin(testCase: TestCase) {
  try {
    console.log(`\n🧪 Testing: ${testCase.name}`)
    console.log(`   Email: ${testCase.email || '(empty)'}`)
    console.log(`   Password: ${testCase.password ? '***' : '(empty)'}`)
    
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testCase.email,
        password: testCase.password
      })
    })
    
    const data = await response.json().catch(() => ({}))
    
    if (response.status === testCase.expectedStatus) {
      console.log(`   ✅ Status: ${response.status} (Expected: ${testCase.expectedStatus})`)
      
      if (response.status === 200) {
        console.log(`   ✅ Login successful!`)
        console.log(`   📋 User: ${data.data?.user?.first_name} ${data.data?.user?.last_name}`)
        console.log(`   📋 Roles: ${data.data?.user?.roles?.join(', ')}`)
        console.log(`   🔑 Access Token: ${data.data?.accessToken?.substring(0, 20)}...`)
      } else {
        console.log(`   📋 Error: ${data.error?.message || data.message || 'Unknown error'}`)
      }
    } else {
      console.log(`   ❌ Status: ${response.status} (Expected: ${testCase.expectedStatus})`)
      console.log(`   📋 Response:`, JSON.stringify(data, null, 2))
    }
  } catch (error: any) {
    console.log(`   ❌ Error: ${error.message}`)
    if (error.message.includes('ECONNREFUSED') || error.message.includes('Failed to fetch')) {
      console.log(`   ⚠️  Server is not running. Please start the server first:`)
      console.log(`      bun run dev`)
    }
  }
}

async function checkServer() {
  try {
    const response = await fetch(`${API_BASE.replace('/api', '')}/api/health`, {
      method: 'GET'
    })
    return response.ok
  } catch (error) {
    return false
  }
}

async function main() {
  console.log('🚀 Testing Login API')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`API Base: ${API_BASE}`)
  
  // Check if server is running
  const serverRunning = await checkServer()
  if (!serverRunning) {
    console.log('\n⚠️  Server is not running!')
    console.log('Please start the development server first:')
    console.log('  bun run dev')
    console.log('\nThen run this test again.')
    process.exit(1)
  }
  
  console.log('✅ Server is running\n')
  
  // Run all tests
  for (const testCase of testCases) {
    await testLogin(testCase)
    await new Promise(resolve => setTimeout(resolve, 500)) // Small delay between tests
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ All tests completed!')
  console.log('')
}

main().catch(console.error)

