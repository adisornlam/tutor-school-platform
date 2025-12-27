# 🔧 แก้ไขปัญหา Database Connection ใน cPanel

**วันที่**: 23 ธันวาคม 2024  
**ปัญหา**: `ECONNREFUSED` - ไม่สามารถเชื่อมต่อ MySQL ได้

---

## 🔍 สาเหตุของปัญหา

### 1. **MySQL Host ไม่ถูกต้อง**
ใน cPanel/shared hosting, MySQL มักจะ:
- ใช้ **socket file** แทน TCP connection
- หรือใช้ hostname เฉพาะ (ไม่ใช่ `localhost`)

### 2. **Port Configuration**
บาง hosting ใช้ port อื่น หรือต้องใช้ socket แทน port

### 3. **Connection Method**
Node.js application ต้องรองรับทั้ง:
- TCP connection (host + port)
- Socket file connection

---

## ✅ วิธีแก้ไข

### ขั้นตอนที่ 1: ตรวจสอบ MySQL Host ใน cPanel

1. เข้า **cPanel** → **MySQL Databases**
2. ดูที่ **"Current Host"** หรือ **"Remote MySQL"**
3. บันทึกค่า:
   - **Host**: มักจะเป็น `localhost` หรือ hostname เฉพาะ
   - **Socket Path**: มักจะเป็น `/tmp/mysql.sock` หรือ `/var/lib/mysql/mysql.sock`

### ขั้นตอนที่ 2: ตั้งค่า Environment Variables

ใน cPanel → **Environment Variables**, ตรวจสอบ:

```bash
DB_HOST=localhost              # หรือ hostname เฉพาะ
DB_PORT=3306                   # หรือ port อื่น
DB_NAME=webthdsw_tutordb
DB_USER=webthdsw_tutor
DB_PASSWORD=57*0yZiKMmDyThXx
DB_SOCKET=/tmp/mysql.sock      # ⚠️ เพิ่มตัวนี้ (ถ้าใช้ socket)
```

**หมายเหตุ**: 
- ถ้าใช้ **socket file**, ตั้ง `DB_SOCKET` และไม่ต้องตั้ง `DB_PORT`
- ถ้าใช้ **TCP connection**, ตั้ง `DB_HOST` และ `DB_PORT`

### ขั้นตอนที่ 3: แก้ไข Code ให้รองรับ Socket Connection

แก้ไข `server/utils/db.ts` ให้รองรับทั้ง TCP และ Socket:

```typescript
export function getDatabase() {
  const config = useRuntimeConfig()
  
  if (!pool) {
    const connectionConfig: any = {
      database: config.dbName,
      user: config.dbUser,
      password: config.dbPassword,
      waitForConnections: true,
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '50'),
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000,
      timezone: '+07:00',
      dateStrings: false,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    }
    
    // ใช้ Socket file ถ้ามี (สำหรับ cPanel/shared hosting)
    if (process.env.DB_SOCKET) {
      connectionConfig.socketPath = process.env.DB_SOCKET
      console.log('[Database] Using socket connection:', process.env.DB_SOCKET)
    } else {
      // ใช้ TCP connection
      connectionConfig.host = config.dbHost || 'localhost'
      connectionConfig.port = config.dbPort || 3306
      console.log('[Database] Using TCP connection:', connectionConfig.host + ':' + connectionConfig.port)
    }
    
    pool = mysql.createPool(connectionConfig)
  }
  
  return pool
}
```

---

## 🔧 Implementation

### 1. แก้ไข `server/utils/db.ts`

เพิ่มการรองรับ socket connection:

```typescript
import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

export function getDatabase() {
  const config = useRuntimeConfig()
  
  if (!pool) {
    const connectionConfig: any = {
      database: config.dbName,
      user: config.dbUser,
      password: config.dbPassword,
      waitForConnections: true,
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '50'),
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000,
      timezone: '+07:00',
      dateStrings: false,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    }
    
    // ใช้ Socket file ถ้ามี (สำหรับ cPanel/shared hosting)
    if (process.env.DB_SOCKET) {
      connectionConfig.socketPath = process.env.DB_SOCKET
      console.log('[Database] ✅ Using socket connection:', process.env.DB_SOCKET)
    } else {
      // ใช้ TCP connection
      connectionConfig.host = config.dbHost || 'localhost'
      connectionConfig.port = config.dbPort || 3306
      console.log('[Database] ✅ Using TCP connection:', `${connectionConfig.host}:${connectionConfig.port}`)
    }
    
    pool = mysql.createPool(connectionConfig)
  }
  
  return pool
}

// ... rest of the code remains the same
```

### 2. อัปเดต `nuxt.config.ts` (ถ้าจำเป็น)

เพิ่ม `DB_SOCKET` ใน runtime config:

```typescript
runtimeConfig: {
  // Private (server-only)
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT || '3306'),
  dbName: process.env.DB_NAME || 'tutordb',
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbSocket: process.env.DB_SOCKET || '', // เพิ่มตัวนี้
  // ... rest
}
```

---

## 🧪 ทดสอบการเชื่อมต่อ

### วิธีที่ 1: ใช้ PHP Script (ใน cPanel)

สร้างไฟล์ `test-db.php` ใน public_html:

```php
<?php
$host = 'localhost';
$dbname = 'webthdsw_tutordb';
$user = 'webthdsw_tutor';
$pass = '57*0yZiKMmDyThXx';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    echo "✅ Database connection successful!";
} catch(PDOException $e) {
    echo "❌ Connection failed: " . $e->getMessage();
}
?>
```

เข้า `https://kdcschool.webthdesign.com/test-db.php` เพื่อทดสอบ

### วิธีที่ 2: ใช้ MySQL Client (ใน cPanel Terminal)

```bash
mysql -u webthdsw_tutor -p'57*0yZiKMmDyThXx' -h localhost webthdsw_tutordb
```

ถ้าเชื่อมต่อได้ แสดงว่า credentials ถูกต้อง

---

## 📋 Checklist การแก้ไข

### ✅ Environment Variables
- [ ] ตรวจสอบ `DB_HOST` (มักจะเป็น `localhost`)
- [ ] ตรวจสอบ `DB_PORT` (มักจะเป็น `3306`)
- [ ] ตรวจสอบ `DB_NAME` (ต้องตรงกับ database name)
- [ ] ตรวจสอบ `DB_USER` (ต้องตรงกับ username)
- [ ] ตรวจสอบ `DB_PASSWORD` (ต้องถูกต้อง)
- [ ] เพิ่ม `DB_SOCKET` (ถ้าใช้ socket connection)

### ✅ Code Changes
- [ ] แก้ไข `server/utils/db.ts` ให้รองรับ socket
- [ ] อัปเดต `nuxt.config.ts` (ถ้าจำเป็น)
- [ ] Rebuild application (`bun run build`)

### ✅ Testing
- [ ] ทดสอบ connection ด้วย PHP script
- [ ] ทดสอบ connection ด้วย MySQL client
- [ ] ทดสอบ application

---

## 🔍 วิธีหาค่า MySQL Host/Socket ใน cPanel

### วิธีที่ 1: ดูใน MySQL Databases
1. cPanel → **MySQL Databases**
2. ดูที่ **"Current Host"** หรือ **"Remote MySQL"**
3. บันทึกค่า host

### วิธีที่ 2: ใช้ PHP Script

สร้างไฟล์ `check-mysql.php`:

```php
<?php
// ตรวจสอบ MySQL socket path
$socket = ini_get('mysqli.default_socket');
echo "MySQL Socket: " . ($socket ?: 'Not set') . "<br>";

// ตรวจสอบ MySQL host
$host = ini_get('mysqli.default_host');
echo "MySQL Host: " . ($host ?: 'localhost') . "<br>";

// ตรวจสอบ MySQL port
$port = ini_get('mysqli.default_port');
echo "MySQL Port: " . ($port ?: '3306') . "<br>";

// ทดสอบ connection
$link = @mysqli_connect('localhost', 'webthdsw_tutor', '57*0yZiKMmDyThXx', 'webthdsw_tutordb');
if ($link) {
    echo "✅ Connection successful!<br>";
    echo "Socket: " . mysqli_get_host_info($link) . "<br>";
    mysqli_close($link);
} else {
    echo "❌ Connection failed: " . mysqli_connect_error() . "<br>";
}
?>
```

---

## ⚠️ ปัญหาที่พบบ่อย

### 1. **ECONNREFUSED**
- **สาเหตุ**: MySQL host/port ไม่ถูกต้อง หรือ MySQL service ไม่ได้รัน
- **วิธีแก้**: ตรวจสอบ `DB_HOST` และ `DB_PORT` หรือใช้ socket connection

### 2. **Access Denied**
- **สาเหตุ**: Username/password ไม่ถูกต้อง หรือ user ไม่มีสิทธิ์
- **วิธีแก้**: ตรวจสอบ credentials ใน cPanel → MySQL Databases

### 3. **Unknown Database**
- **สาเหตุ**: Database name ไม่ถูกต้อง
- **วิธีแก้**: ตรวจสอบ `DB_NAME` ต้องตรงกับ database name ใน cPanel

### 4. **Socket Connection Failed**
- **สาเหตุ**: Socket path ไม่ถูกต้อง
- **วิธีแก้**: ตรวจสอบ socket path ด้วย PHP script หรือใช้ TCP connection แทน

---

## 🚀 ขั้นตอนการ Deploy

1. **แก้ไข Code**:
   ```bash
   # แก้ไข server/utils/db.ts
   # เพิ่มการรองรับ socket connection
   ```

2. **ตั้งค่า Environment Variables**:
   ```bash
   # ใน cPanel → Environment Variables
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=webthdsw_tutordb
   DB_USER=webthdsw_tutor
   DB_PASSWORD=57*0yZiKMmDyThXx
   DB_SOCKET=/tmp/mysql.sock  # ถ้าใช้ socket
   ```

3. **Rebuild Application**:
   ```bash
   bun run build
   ```

4. **Upload ไฟล์ใหม่**:
   - Upload `.output` directory ไปยัง server
   - หรือใช้ git pull (ถ้าใช้ git)

5. **Restart Application**:
   - Restart Node.js application ใน cPanel

---

## 📚 เอกสารอ้างอิง

- [MySQL2 Socket Connection](https://github.com/sidorares/node-mysql2#using-connection-uri)
- [cPanel MySQL Setup](https://docs.cpanel.net/knowledge-base/databases/creating-a-mysql-database/)
- [Node.js MySQL Best Practices](https://www.npmjs.com/package/mysql2#connection-options)

---

*เอกสารนี้สรุปการแก้ไขปัญหา Database Connection ใน cPanel วันที่ 23 ธันวาคม 2024*

