import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

export function getDatabase() {
  const config = useRuntimeConfig()
  
  if (!pool) {
    pool = mysql.createPool({
      host: config.dbHost,
      port: config.dbPort,
      database: config.dbName,
      user: config.dbUser,
      password: config.dbPassword,
      waitForConnections: true,
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '50'), // ✅ Increased from 10 to 50 for better concurrency
      queueLimit: 0,
      acquireTimeout: 60000, // ✅ 60 seconds timeout
      timeout: 60000, // ✅ 60 seconds query timeout
      timezone: '+07:00', // Asia/Bangkok
      dateStrings: false,
      enableKeepAlive: true, // ✅ Keep connections alive
      keepAliveInitialDelay: 0
    })
  }
  
  return pool
}

export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  try {
    const db = getDatabase()
    const [rows] = await db.execute(sql, params || [])
    return rows as T[]
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
  const [result] = await db.execute(sql, params)
  return result as mysql.ResultSetHeader
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

