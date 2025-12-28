# ข้อมูล Database Setup สำหรับการค้นหา

## 📋 สรุป

**โปรเจคนี้:**
- ✅ **ใช้ `mysql2`** (version 3.11.0)
- ❌ **ไม่ใช้ Prisma** (ไม่มี Prisma ในโปรเจค)

## 🔧 Database Library

### mysql2/promise
- **Version**: `^3.11.0`
- **Import**: `import mysql from 'mysql2/promise'`
- **Connection Type**: Connection Pool (`mysql.createPool`)
- **Location**: `server/utils/db.ts`

## 📝 Connection Configuration

### Environment Variables
```env
DB_HOST=localhost          # หรือ host อื่น
DB_PORT=3306              # MySQL port
DB_NAME=webthdsw_tutordb  # Database name
DB_USER=webthdsw_tutor    # Database user
DB_PASSWORD=57*0yZiKMmDyThXx  # Database password
DB_SOCKET=/tmp/mysql.sock # Socket path (optional, สำหรับ cPanel)
```

### Connection Methods
1. **Socket Connection** (ถ้ามี `DB_SOCKET`)
   - ใช้ `socketPath` option
   - เหมาะสำหรับ cPanel/shared hosting

2. **TCP Connection** (default)
   - ใช้ `host` และ `port` options
   - Default: `localhost:3306`

### Pool Configuration
```typescript
{
  database: process.env.DB_NAME || 'webthdsw_tutordb',
  user: process.env.DB_USER || 'webthdsw_tutor',
  password: process.env.DB_PASSWORD || '57*0yZiKMmDyThXx',
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0,
  timezone: '+07:00', // Asia/Bangkok
  dateStrings: false,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
}
```

## 🛠️ Functions

### `getDatabase()`
- สร้าง/return connection pool
- Singleton pattern (สร้างครั้งเดียว)

### `query<T>(sql, params?)`
- Execute SELECT queries
- Return: `Promise<T[]>` (array of rows)
- **ใช้ `pool.query()` แทน `pool.execute()`**

### `queryOne<T>(sql, params?)`
- Execute SELECT และ return แถวแรก
- Return: `Promise<T | null>`

### `execute(sql, params?)`
- Execute INSERT/UPDATE/DELETE
- Return: `Promise<mysql.ResultSetHeader>`
- **ใช้ `pool.query()` แทน `pool.execute()`**

### `transaction(callback)`
- Execute transactions
- Auto commit/rollback

## ⚠️ ปัญหาที่พบ

### 1. `pool.execute()` ไม่ทำงานใน bundle
**Error**: `Cannot read properties of undefined (reading 'apply')`

**Solution**: เปลี่ยนเป็น `pool.query()` แทน

```typescript
// ❌ ไม่ทำงาน
const [rows] = await pool.execute(sql, params)

// ✅ ทำงาน
const [rows] = await pool.query(sql, params)
```

### 2. `connection.query()` อาจมีปัญหาใน bundle
**Error**: `Cannot read properties of undefined (reading 'apply')`

**Solution**: 
- ใช้ `connection.query()` แทน `connection.execute()`
- Handle result หลายรูปแบบ
- เพิ่ม fallback ใช้ `execute()` ถ้า `query()` ไม่ทำงาน

### 3. Bundle Configuration
- `mysql2` ถูก bundle ใน `nitro.externals.inline`
- ใช้ custom Rollup plugin สำหรับ subpath imports (`mysql2/promise`)

## 🔍 Keywords สำหรับค้นหา

### ปัญหา Bundle
- `mysql2 pool.query vs pool.execute`
- `mysql2 bundle rollup webpack`
- `mysql2 Cannot read properties of undefined reading apply`
- `mysql2 promise pool bundled code`
- `mysql2 connection.query bundled`
- `nuxt nitro mysql2 bundle`
- `mysql2 execute method bundled undefined`

### Connection Issues
- `mysql2 socket connection cPanel`
- `mysql2 TCP vs socket connection`
- `mysql2 connection pool bundled`
- `mysql2 promise pool connection limit`

### Best Practices
- `mysql2 pool.query vs execute difference`
- `mysql2 bundled application best practices`
- `mysql2 connection pool configuration`
- `mysql2 timezone configuration`

## 📚 Resources

### Official Documentation
- [mysql2 GitHub](https://github.com/sidorares/node-mysql2)
- [mysql2 Promise API](https://github.com/sidorares/node-mysql2#using-promise-wrapper)
- [mysql2 Connection Pool](https://github.com/sidorares/node-mysql2#pool-options)

### Related Issues
- Search GitHub issues for: `mysql2 bundle`, `mysql2 execute undefined`, `mysql2 rollup`
- Nuxt/Nitro issues: `nuxt mysql2 bundle`, `nitro mysql2 external`

## 💡 Tips

1. **ใช้ `query()` แทน `execute()`** ใน bundled code
2. **Handle result หลายรูปแบบ** เพราะ bundle อาจ return ต่างกัน
3. **ใช้ `process.env` โดยตรง** แทน `useRuntimeConfig()` เพื่อให้อ่านค่า runtime
4. **Test connection** ก่อน deploy ด้วย `/api/testdb` endpoint
5. **Socket connection** ดีกว่า TCP สำหรับ cPanel/shared hosting

## 🔗 Related Files

- `server/utils/db.ts` - Main database utility
- `server/api/testdb.get.ts` - Database connection test endpoint
- `nuxt.config.ts` - Bundle configuration (mysql2 in externals.inline)
- `scripts/post-build.mjs` - Post-build fixes

