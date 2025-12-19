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
      connectionLimit: 10,
      queueLimit: 0,
      timezone: '+07:00', // Asia/Bangkok
      dateStrings: false
    })
  }
  
  return pool
}

export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  const db = getDatabase()
  const [rows] = await db.execute(sql, params)
  return rows as T[]
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

