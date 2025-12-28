import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

export function getDatabase() {
  // ✅ ใช้ process.env โดยตรงเพื่อให้อ่านค่า environment variables ตอน runtime
  // ไม่ใช้ useRuntimeConfig() เพราะอาจจะ bundle ค่า default ตอน build
  if (!pool) {
    const connectionConfig: any = {
      database: process.env.DB_NAME || 'webthdsw_tutordb',
      user: process.env.DB_USER || 'webthdsw_tutor',
      password: process.env.DB_PASSWORD || '57*0yZiKMmDyThXx',
      waitForConnections: true,
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '50'), // ✅ Increased from 10 to 50 for better concurrency
      queueLimit: 0,
      // Note: acquireTimeout and timeout are not valid mysql2 options, removed to avoid warnings
      timezone: '+07:00', // Asia/Bangkok
      dateStrings: false,
      enableKeepAlive: true, // ✅ Keep connections alive
      keepAliveInitialDelay: 0
    }
    
    // ใช้ Socket file ถ้ามี (สำหรับ cPanel/shared hosting)
    if (process.env.DB_SOCKET) {
      connectionConfig.socketPath = process.env.DB_SOCKET
      console.log('[Database] ✅ Using socket connection:', process.env.DB_SOCKET)
      console.log('[Database] ✅ Database:', connectionConfig.database)
      console.log('[Database] ✅ User:', connectionConfig.user)
    } else {
      // ใช้ TCP connection
      connectionConfig.host = process.env.DB_HOST || '192.250.235.23'
      connectionConfig.port = parseInt(process.env.DB_PORT || '3306')
      console.log('[Database] ✅ Using TCP connection:', `${connectionConfig.host}:${connectionConfig.port}`)
      console.log('[Database] ✅ Database:', connectionConfig.database)
      console.log('[Database] ✅ User:', connectionConfig.user)
    }
    
    pool = mysql.createPool(connectionConfig)
  }
  
  return pool
}

export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  try {
    const db = getDatabase()
    const connection = await db.getConnection()
    
    try {
      // Try multiple approaches to handle bundling issues
      let queryResult: any
      let lastError: any = null
      
      // Approach 1: Try using bind() first (most reliable)
      try {
        if (typeof connection.query === 'function') {
          const boundQuery = connection.query.bind(connection)
          queryResult = await boundQuery(sql, params || [])
        } else {
          throw new Error('connection.query is not a function')
        }
      } catch (err1: any) {
        lastError = err1
        // Approach 2: Try using call()
        try {
          if (connection.query && typeof connection.query.call === 'function') {
            queryResult = await connection.query.call(connection, sql, params || [])
          } else {
            throw new Error('connection.query.call is not a function')
          }
        } catch (err2: any) {
          lastError = err2
          // Approach 3: Try using Reflect.apply()
          try {
            if (typeof connection.query === 'function') {
              queryResult = await Reflect.apply(connection.query, connection, [sql, params || []])
            } else {
              throw new Error('connection.query is not a function for Reflect.apply')
            }
          } catch (err3: any) {
            lastError = err3
            // Approach 4: Try direct call (last resort)
            try {
              queryResult = await (connection as any).query(sql, params || [])
            } catch (err4: any) {
              lastError = err4
              // If all approaches fail, throw the last error
              throw new Error(`All query approaches failed. Last error: ${lastError.message}`)
            }
          }
        }
      }
      
      // Handle result - query() returns [rows, fields]
      let rows: any[]
      if (Array.isArray(queryResult)) {
        if (queryResult.length >= 2) {
          rows = queryResult[0] as any[]
        } else if (queryResult.length === 1) {
          rows = queryResult[0] as any[]
        } else {
          rows = []
        }
      } else {
        rows = queryResult as any[]
      }
      
      return rows as T[]
    } finally {
      connection.release()
    }
  } catch (error: any) {
    console.error('[Database] Query error:', {
      sql,
      params,
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      errorType: typeof error,
      errorKeys: Object.keys(error || {})
    })
    throw error
  }
}

export async function queryOne<T = any>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const results = await query<T>(sql, params)
  return results[0] || null
}

export async function execute(
  sql: string,
  params?: any[]
): Promise<mysql.ResultSetHeader> {
  const db = getDatabase()
  const connection = await db.getConnection()
  
  try {
    // Try multiple approaches to handle bundling issues
    let queryResult: any
    let lastError: any = null
    
    // Approach 1: Try using bind() first (most reliable)
    try {
      if (typeof connection.query === 'function') {
        const boundQuery = connection.query.bind(connection)
        queryResult = await boundQuery(sql, params || [])
      } else {
        throw new Error('connection.query is not a function')
      }
    } catch (err1: any) {
      lastError = err1
      // Approach 2: Try using call()
      try {
        if (connection.query && typeof connection.query.call === 'function') {
          queryResult = await connection.query.call(connection, sql, params || [])
        } else {
          throw new Error('connection.query.call is not a function')
        }
      } catch (err2: any) {
        lastError = err2
        // Approach 3: Try using Reflect.apply()
        try {
          if (typeof connection.query === 'function') {
            queryResult = await Reflect.apply(connection.query, connection, [sql, params || []])
          } else {
            throw new Error('connection.query is not a function for Reflect.apply')
          }
        } catch (err3: any) {
          lastError = err3
          // Approach 4: Try direct call (last resort)
          try {
            queryResult = await (connection as any).query(sql, params || [])
          } catch (err4: any) {
            lastError = err4
            // If all approaches fail, throw the last error
            throw new Error(`All query approaches failed. Last error: ${lastError.message}`)
          }
        }
      }
    }
    
    // Handle result - query() returns [result, fields]
    let result: any
    if (Array.isArray(queryResult)) {
      if (queryResult.length >= 2) {
        result = queryResult[0]
      } else if (queryResult.length === 1) {
        result = queryResult[0]
      } else {
        result = null
      }
    } else {
      result = queryResult
    }
    
    return result as mysql.ResultSetHeader
  } finally {
    connection.release()
  }
}

// Transaction helper
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const db = getDatabase()
  const connection = await db.getConnection()
  
  try {
    await connection.beginTransaction()
    const result = await callback(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

