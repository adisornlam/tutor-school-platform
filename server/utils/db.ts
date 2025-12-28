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
    // Try using getConnection() and connection.query() directly
    // This might work better in bundled code than pool.query()
    const connection = await db.getConnection()
    try {
      const [rows] = await connection.query(sql, params || [])
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
      sqlMessage: error.sqlMessage
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
  // Try using getConnection() and connection.query() directly
  const connection = await db.getConnection()
  try {
    const [result] = await connection.query(sql, params || [])
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

