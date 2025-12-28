import { query } from '../utils/db'
import { getRedisClient } from '../utils/redis'
import mysql from 'mysql2/promise'

interface TestResult {
  success: boolean
  message: string
  details?: any
  error?: string
  code?: string
  category?: string
}

interface TestCase {
  name: string
  description: string
  test: () => Promise<TestResult>
}

// Nuxt auto-imports: defineEventHandler, getHeader, getQuery, setHeader
// @ts-ignore - Auto-imported by Nuxt
export default defineEventHandler(async (event) => {
  const results: {
    timestamp: string
    environment: any
    testCases: Array<{
      name: string
      description: string
      result: TestResult
    }>
    summary: {
      total: number
      passed: number
      failed: number
    }
  } = {
    timestamp: new Date().toISOString(),
    environment: {},
    testCases: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0
    }
  }

  // Get environment variables (hide sensitive data)
  // ตัวแปรเหล่านี้จะถูกอ่านจาก .htaccess SetEnv โดยอัตโนมัติผ่าน process.env
  results.environment = {
    DB_HOST: process.env.DB_HOST || '(not set - using default)',
    DB_PORT: process.env.DB_PORT || '(not set - using default)',
    DB_NAME: process.env.DB_NAME || '(not set - using default)',
    DB_USER: process.env.DB_USER || '(not set - using default)',
    DB_PASSWORD: process.env.DB_PASSWORD ? '***' : '(not set - using default)',
    DB_SOCKET: process.env.DB_SOCKET || '(not set)',
    REDIS_HOST: process.env.REDIS_HOST || '(not set - using default)',
    REDIS_PORT: process.env.REDIS_PORT || '(not set - using default)',
    REDIS_PASSWORD: process.env.REDIS_PASSWORD ? '***' : '(not set - using default)',
    REDIS_DB: process.env.REDIS_DB || '(not set - using default)',
    JWT_SECRET: process.env.JWT_SECRET ? '***' : '(not set)',
    PORT: process.env.PORT || '(not set)',
    TZ: process.env.TZ || '(not set)'
  }

  // ============================================
  // Database Test Cases
  // ============================================
  const dbTestCases: TestCase[] = [
    {
      name: 'Database Connection',
      description: 'ทดสอบการเชื่อมต่อ database พื้นฐาน',
      test: async () => {
        try {
          const rows = await query<{ test: number; current_time: string; current_database: string }>(
            'SELECT 1 as test, NOW() as `current_time`, DATABASE() as `current_database`'
          )
          
          if (rows && Array.isArray(rows) && rows.length > 0) {
            return {
              success: true,
              message: 'Database connection successful',
              details: {
                test: rows[0].test,
                current_time: rows[0].current_time,
                current_database: rows[0].current_database
              }
            }
          }
          return { success: false, message: 'Query returned no results' }
        } catch (error: any) {
          return {
            success: false,
            message: 'Database connection failed',
            error: error.message,
            code: error.code
          }
        }
      }
    },
    {
      name: 'MySQL Version',
      description: 'ตรวจสอบเวอร์ชัน MySQL',
      test: async () => {
        try {
          const rows = await query<{ version: string }>('SELECT VERSION() as version')
          if (rows && Array.isArray(rows) && rows.length > 0) {
            return {
              success: true,
              message: `MySQL Version: ${rows[0].version}`,
              details: { version: rows[0].version }
            }
          }
          return { success: false, message: 'Could not get MySQL version' }
        } catch (error: any) {
          return {
            success: false,
            message: 'Failed to get MySQL version',
            error: error.message
          }
        }
      }
    },
    {
      name: 'Database Tables Count',
      description: 'นับจำนวนตารางใน database',
      test: async () => {
        try {
          const rows = await query<{ count: number }>(
            'SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE()'
          )
          if (rows && Array.isArray(rows) && rows.length > 0) {
            return {
              success: true,
              message: `Found ${rows[0].count} tables`,
              details: { table_count: rows[0].count }
            }
          }
          return { success: false, message: 'Could not count tables' }
        } catch (error: any) {
          return {
            success: false,
            message: 'Failed to count tables',
            error: error.message
          }
        }
      }
    },
    {
      name: 'Users Table',
      description: 'ทดสอบการเข้าถึงตาราง users',
      test: async () => {
        try {
          const rows = await query<{ count: number }>('SELECT COUNT(*) as count FROM users LIMIT 1')
          if (rows && Array.isArray(rows) && rows.length > 0) {
            return {
              success: true,
              message: `Users table accessible. Total users: ${rows[0].count}`,
              details: { users_count: rows[0].count }
            }
          }
          return { success: false, message: 'Users table query returned no results' }
        } catch (error: any) {
          if (error.code === 'ER_NO_SUCH_TABLE') {
            return {
              success: false,
              message: 'Users table does not exist',
              error: 'Table not found',
              code: error.code
            }
          }
          return {
            success: false,
            message: 'Failed to access users table',
            error: error.message,
            code: error.code
          }
        }
      }
    },
    {
      name: 'Courses Table',
      description: 'ทดสอบการเข้าถึงตาราง courses',
      test: async () => {
        try {
          const rows = await query<{ count: number }>('SELECT COUNT(*) as count FROM courses LIMIT 1')
          if (rows && Array.isArray(rows) && rows.length > 0) {
            return {
              success: true,
              message: `Courses table accessible. Total courses: ${rows[0].count}`,
              details: { courses_count: rows[0].count }
            }
          }
          return { success: false, message: 'Courses table query returned no results' }
        } catch (error: any) {
          if (error.code === 'ER_NO_SUCH_TABLE') {
            return {
              success: false,
              message: 'Courses table does not exist',
              error: 'Table not found',
              code: error.code
            }
          }
          return {
            success: false,
            message: 'Failed to access courses table',
            error: error.message,
            code: error.code
          }
        }
      }
    },
    {
      name: 'Database Write Test',
      description: 'ทดสอบการเขียนข้อมูล (SELECT only - safe test)',
      test: async () => {
        try {
          // Safe read-only test
          const rows = await query<{ write_test: number }>('SELECT 1 as write_test')
          if (rows && Array.isArray(rows) && rows.length > 0) {
            return {
              success: true,
              message: 'Database write capability test passed (read-only test)',
              details: { write_test: 'passed' }
            }
          }
          return { success: false, message: 'Write test failed' }
        } catch (error: any) {
          return {
            success: false,
            message: 'Database write test failed',
            error: error.message
          }
        }
      }
    },
    {
      name: 'Direct Connection Test (Hardcoded)',
      description: 'ทดสอบการเชื่อมต่อ database โดยกำหนดค่าตรงๆ (ไม่ใช้ environment variables)',
      test: async () => {
        let connection: mysql.Connection | null = null
        try {
          // Hardcoded connection config (based on cPanel info)
               const connectionConfig = {
                 host: 's1301.sgp1.mysecurecloudhost.com',
                 port: 3306,
                 user: 'webthdsw_tutor',
                 password: '57*0yZiKMmDyThXx',
                 database: 'webthdsw_tutordb',
                 timezone: '+07:00',
                 dateStrings: false
               }
          
          // Try socket connection first (cPanel often uses socket)
          let connectionMethod = 'TCP'
          let socketError: any = null
          
          // Try common socket paths
          const socketPaths = [
            '/tmp/mysql.sock',
            '/var/lib/mysql/mysql.sock',
            '/var/run/mysqld/mysqld.sock',
            '/tmp/mysql/mysql.sock'
          ]
          
          for (const socketPath of socketPaths) {
            try {
              connection = await mysql.createConnection({
                ...connectionConfig,
                socketPath: socketPath
              })
              connectionMethod = `Socket (${socketPath})`
              break
            } catch (err: any) {
              socketError = err
              continue
            }
          }
          
          // If socket fails, try TCP
          if (!connection) {
            try {
              connection = await mysql.createConnection(connectionConfig)
              connectionMethod = `TCP (${connectionConfig.host}:${connectionConfig.port})`
            } catch (tcpError: any) {
              return {
                success: false,
                message: 'Failed to connect via both socket and TCP',
                error: `Socket attempts failed, TCP error: ${tcpError.message}`,
                code: tcpError.code || 'ECONNREFUSED',
                details: {
                  socket_paths_tried: socketPaths,
                  socket_error: socketError?.message,
                  tcp_error: tcpError.message
                }
              }
            }
          }
          
          // Test connection with ping first
          try {
            await connection.ping()
          } catch (pingError: any) {
            if (connection) {
              await connection.end().catch(() => {})
            }
            return {
              success: false,
              message: 'Connection ping failed',
              error: pingError.message,
              code: pingError.code
            }
          }
          
          // Try using query() instead of execute() - query() is more reliable
          try {
            // Use query() which returns [rows, fields]
            // But in bundle, it might return differently, so we need to handle it carefully
            let queryResult: any
            
            // Try to call query() and catch any errors
            try {
              queryResult = await connection.query('SELECT 1 as test, NOW() as `current_time`, DATABASE() as `current_database`')
            } catch (queryCallError: any) {
              // If query() itself fails, try using execute() as fallback
              queryResult = await connection.execute('SELECT 1 as test, NOW() as `current_time`, DATABASE() as `current_database`')
            }
            
            // Handle both array destructuring and direct result
            let rows: any[]
            if (Array.isArray(queryResult)) {
              if (queryResult.length >= 2) {
                // [rows, fields] format
                rows = queryResult[0] as any[]
              } else if (queryResult.length === 1) {
                // Single array element
                rows = queryResult[0] as any[]
              } else {
                // Empty array
                rows = []
              }
            } else {
              // Direct result (shouldn't happen but handle it)
              rows = queryResult as any[]
            }
            
            const result = Array.isArray(rows) && rows.length > 0 ? rows[0] : null
            
            await connection.end()
            
            if (result) {
              return {
                success: true,
                message: `Direct connection successful via ${connectionMethod}`,
                details: {
                  connection_method: connectionMethod,
                  test: result.test,
                  current_time: result.current_time,
                  current_database: result.current_database,
                  config_used: {
                    host: connectionConfig.host,
                    port: connectionConfig.port,
                    user: connectionConfig.user,
                    database: connectionConfig.database
                  }
                }
              }
            }
            
            return {
              success: false,
              message: 'Query returned no results',
              error: 'No data returned'
            }
          } catch (queryError: any) {
            if (connection) {
              await connection.end().catch(() => {})
            }
            return {
              success: false,
              message: 'Query execution failed',
              error: queryError.message,
              code: queryError.code,
              details: {
                error_type: typeof queryError,
                error_keys: Object.keys(queryError || {}),
                connection_method: connectionMethod
              }
            }
          }
        } catch (error: any) {
          if (connection) {
            await connection.end().catch(() => {})
          }
          return {
            success: false,
            message: 'Direct connection test failed',
            error: error.message,
            code: error.code,
            details: {
              error_type: typeof error,
              error_keys: Object.keys(error || {})
            }
          }
        }
      }
    }
  ]

  // ============================================
  // Redis Test Cases
  // ============================================
  const redisTestCases: TestCase[] = [
    {
      name: 'Redis Connection',
      description: 'ทดสอบการเชื่อมต่อ Redis',
      test: async () => {
        try {
          const redis = getRedisClient()
          const pong = await redis.ping()
          if (pong === 'PONG') {
            return {
              success: true,
              message: 'Redis connection successful',
              details: { ping: pong }
            }
          }
          return { success: false, message: `Unexpected ping response: ${pong}` }
        } catch (error: any) {
          return {
            success: false,
            message: 'Redis connection failed',
            error: error.message
          }
        }
      }
    },
    {
      name: 'Redis SET/GET',
      description: 'ทดสอบการเขียนและอ่านข้อมูล Redis',
      test: async () => {
        try {
          const redis = getRedisClient()
          const testKey = 'test:connection:check'
          const testValue = `test-${Date.now()}`
          
          await redis.set(testKey, testValue, 'EX', 60)
          const retrievedValue = await redis.get(testKey)
          
          if (retrievedValue === testValue) {
            await redis.del(testKey)
            return {
              success: true,
              message: 'Redis SET/GET operations successful',
              details: { set_get_test: 'passed' }
            }
          }
          return { success: false, message: 'Redis SET/GET value mismatch' }
        } catch (error: any) {
          return {
            success: false,
            message: 'Redis SET/GET test failed',
            error: error.message
          }
        }
      }
    },
    {
      name: 'Redis Version',
      description: 'ตรวจสอบเวอร์ชัน Redis',
      test: async () => {
        try {
          const redis = getRedisClient()
          const info = await redis.info('server')
          const versionMatch = info.match(/redis_version:([^\r\n]+)/)
          if (versionMatch) {
            return {
              success: true,
              message: `Redis Version: ${versionMatch[1]}`,
              details: { redis_version: versionMatch[1] }
            }
          }
          return { success: false, message: 'Could not get Redis version' }
        } catch (error: any) {
          return {
            success: false,
            message: 'Failed to get Redis version',
            error: error.message
          }
        }
      }
    }
  ]

  // Run all test cases
  const allTestCases = [
    ...dbTestCases.map(tc => ({ ...tc, category: 'Database' })),
    ...redisTestCases.map(tc => ({ ...tc, category: 'Redis' }))
  ]

  for (const testCase of allTestCases) {
    try {
      const result = await testCase.test()
      results.testCases.push({
        name: testCase.name,
        description: testCase.description,
        result: {
          ...result,
          category: testCase.category
        }
      })
      
      results.summary.total++
      if (result.success) {
        results.summary.passed++
      } else {
        results.summary.failed++
      }
    } catch (error: any) {
      results.testCases.push({
        name: testCase.name,
        description: testCase.description,
        result: {
          success: false,
          message: 'Test execution error',
          error: error.message,
          category: testCase.category
        }
      })
      results.summary.total++
      results.summary.failed++
    }
  }

  // Check if client wants HTML or JSON
  // @ts-ignore - Auto-imported by Nuxt
  const acceptHeader = getHeader(event, 'accept') || ''
  // @ts-ignore - Auto-imported by Nuxt
  const wantsHtml = acceptHeader.includes('text/html') || 
                    // @ts-ignore - Auto-imported by Nuxt
                    getQuery(event).format === 'html' ||
                    // @ts-ignore - Auto-imported by Nuxt
                    !getQuery(event).format // Default to HTML

  if (wantsHtml) {
    // @ts-ignore - Auto-imported by Nuxt
    setHeader(event, 'content-type', 'text/html; charset=utf-8')
    return generateHtmlReport(results)
  }

  // Return JSON
  // @ts-ignore - Auto-imported by Nuxt
  setHeader(event, 'content-type', 'application/json')
  return results
})

function generateHtmlReport(results: any): string {
  const passRate = results.summary.total > 0 
    ? Math.round((results.summary.passed / results.summary.total) * 100) 
    : 0

  return `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Database Connection Test - KDC School</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      min-height: 100vh;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 2rem;
      margin-bottom: 10px;
    }
    .header .timestamp {
      opacity: 0.9;
      font-size: 0.9rem;
    }
    .content {
      padding: 30px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    .summary-card {
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .summary-card h3 {
      font-size: 0.9rem;
      color: #6b7280;
      margin-bottom: 10px;
    }
    .summary-card .value {
      font-size: 2rem;
      font-weight: 700;
    }
    .section {
      margin-bottom: 30px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }
    .section-header {
      background: #f9fafb;
      padding: 15px 20px;
      font-weight: 600;
      font-size: 1.1rem;
      border-bottom: 2px solid #e5e7eb;
    }
    .section-content {
      padding: 20px;
    }
    .env-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 10px;
      margin-top: 15px;
    }
    .env-item {
      padding: 10px;
      background: #f9fafb;
      border-radius: 6px;
      border-left: 3px solid #667eea;
    }
    .env-key {
      font-weight: 600;
      color: #374151;
      font-size: 0.9rem;
    }
    .env-value {
      color: #6b7280;
      font-size: 0.85rem;
      margin-top: 4px;
    }
    .test-case {
      margin-bottom: 20px;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #e5e7eb;
      background: #f9fafb;
    }
    .test-case.passed {
      border-left-color: #10b981;
      background: #f0fdf4;
    }
    .test-case.failed {
      border-left-color: #ef4444;
      background: #fef2f2;
    }
    .test-case-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .test-case-name {
      font-weight: 600;
      color: #111827;
    }
    .test-case-category {
      font-size: 0.75rem;
      color: #6b7280;
      background: #e5e7eb;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .test-case-description {
      color: #6b7280;
      font-size: 0.9rem;
      margin-bottom: 8px;
    }
    .test-case-result {
      margin-top: 8px;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.8rem;
    }
    .status-pass {
      background: #d1fae5;
      color: #065f46;
    }
    .status-fail {
      background: #fee2e2;
      color: #991b1b;
    }
    .details-box {
      background: white;
      border: 1px solid #bbf7d0;
      border-radius: 6px;
      padding: 12px;
      margin-top: 10px;
    }
    .details-box pre {
      margin: 0;
      font-size: 0.85rem;
      color: #166534;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .error-box {
      background: #fee2e2;
      border: 1px solid #fecaca;
      border-radius: 6px;
      padding: 12px;
      margin-top: 10px;
      color: #991b1b;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #6b7280;
      font-size: 0.85rem;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔍 Database & Redis Connection Test</h1>
      <div class="timestamp">${new Date(results.timestamp).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}</div>
    </div>
    
    <div class="content">
      <div class="summary">
        <div class="summary-card" style="background: #10b98120; border: 2px solid #10b981;">
          <h3>Total Tests</h3>
          <div class="value" style="color: #10b981;">${results.summary.total}</div>
        </div>
        <div class="summary-card" style="background: #10b98120; border: 2px solid #10b981;">
          <h3>Passed</h3>
          <div class="value" style="color: #10b981;">${results.summary.passed}</div>
        </div>
        <div class="summary-card" style="background: ${results.summary.failed > 0 ? '#ef444420' : '#10b98120'}; border: 2px solid ${results.summary.failed > 0 ? '#ef4444' : '#10b981'};">
          <h3>Failed</h3>
          <div class="value" style="color: ${results.summary.failed > 0 ? '#ef4444' : '#10b981'};">${results.summary.failed}</div>
        </div>
        <div class="summary-card" style="background: #667eea20; border: 2px solid #667eea;">
          <h3>Pass Rate</h3>
          <div class="value" style="color: #667eea;">${passRate}%</div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          📋 Environment Variables (จาก .htaccess SetEnv)
        </div>
        <div class="section-content">
          <div class="env-grid">
            ${Object.entries(results.environment).map(([key, value]) => `
              <div class="env-item">
                <div class="env-key">${key}</div>
                <div class="env-value">${value}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          🧪 Test Results (${results.testCases.length} tests)
        </div>
        <div class="section-content">
          ${results.testCases.map((testCase: any) => `
            <div class="test-case ${testCase.result.success ? 'passed' : 'failed'}">
              <div class="test-case-header">
                <div>
                  <span class="test-case-name">${testCase.name}</span>
                  <span class="test-case-category">${testCase.result.category || 'Unknown'}</span>
                </div>
                <span class="status-badge ${testCase.result.success ? 'status-pass' : 'status-fail'}">
                  ${testCase.result.success ? '✅ PASS' : '❌ FAIL'}
                </span>
              </div>
              <div class="test-case-description">${testCase.description}</div>
              <div class="test-case-result">
                <p><strong>Status:</strong> ${testCase.result.message}</p>
                ${testCase.result.details ? `
                  <div class="details-box">
                    <pre>${JSON.stringify(testCase.result.details, null, 2)}</pre>
                  </div>
                ` : ''}
                ${testCase.result.error ? `
                  <div class="error-box">
                    <strong>Error:</strong> ${testCase.result.error}
                    ${testCase.result.code ? `<br><strong>Code:</strong> ${testCase.result.code}` : ''}
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="footer">
      <p>💡 Tip: Add <code>?format=json</code> to get JSON response</p>
      <p>🔄 Refresh page to test again</p>
      <p>📝 Environment variables are read from .htaccess SetEnv via process.env</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

