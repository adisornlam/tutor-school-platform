# วิเคราะห์ Server Information

**วันที่**: 28 ธันวาคม 2024  
**Source**: cPanel Server Information

---

## 📋 Server Information

| Item | Detail |
|------|--------|
| **Hosting Package** | `ac2` |
| **Server Name** | `s1301` |
| **cPanel Version** | `130.0 (build 17)` |
| **Apache Version** | `2.4.65` |
| **Database Version** | `10.6.24-MariaDB` ⭐ |
| **Architecture** | `x86_64` |
| **Operating System** | `linux` |
| **Shared IP Address** | `192.250.235.23` ⭐ |
| **Path to Sendmail** | `/usr/sbin/sendmail` |
| **Path to Perl** | `/usr/bin/perl` |
| **Perl Version** | `5.26.3` |
| **Kernel Version** | `4.18.0-513.11.1.lve.el8.x86_64` |

---

## ✅ ข้อมูลที่มีประโยชน์

### 1. **Database Version: `10.6.24-MariaDB`** ⭐⭐⭐

**ประโยชน์:**
- ✅ **ยืนยันว่าเป็น MariaDB ไม่ใช่ MySQL** - สำคัญมาก!
- ✅ **เวอร์ชัน 10.6.24** - รู้ SQL syntax compatibility
- ✅ **Authentication methods** - MariaDB 10.6 รองรับ `mysql_native_password` และ `caching_sha2_password`
- ✅ **SQL reserved words** - รู้ว่าต้องใช้ backticks สำหรับ reserved words

**การใช้งาน:**
- ✅ ใช้ backticks ใน SQL queries (เช่น `` `current_time` ``)
- ✅ ตรวจสอบ authentication protocol compatibility
- ✅ รู้ SQL syntax features ที่รองรับ

**ตัวอย่าง:**
```sql
-- ✅ ถูกต้อง (ใช้ backticks)
SELECT NOW() as `current_time`, DATABASE() as `current_database`

-- ❌ ผิด (reserved words)
SELECT NOW() as current_time, DATABASE() as current_database
```

### 2. **Shared IP Address: `192.250.235.23`** ⭐⭐⭐

**ประโยชน์:**
- ✅ **ยืนยัน IP address ที่ใช้** - ตรงกับที่อัปเดตใน code แล้ว
- ✅ **Remote connection** - ใช้สำหรับ remote database connection
- ✅ **Whitelist IP** - ใช้สำหรับ Remote MySQL whitelist

**การใช้งาน:**
- ✅ ใช้ใน `DB_HOST` environment variable
- ✅ ใช้ใน connection config
- ✅ ใช้สำหรับ whitelist IP ใน Remote MySQL

**สถานะ:**
- ✅ อัปเดตใน `server/utils/db.ts` แล้ว
- ✅ อัปเดตใน `nuxt.config.ts` แล้ว
- ✅ อัปเดตใน `server/api/testdb.get.ts` แล้ว

### 3. **Server Name: `s1301`** ⭐⭐

**ประโยชน์:**
- ✅ **ยืนยัน hostname** - ตรงกับ `s1301.sgp1.mysecurecloudhost.com` ที่เคยใช้
- ✅ **Server identification** - รู้ว่าเป็น server ไหน

**การใช้งาน:**
- ✅ ใช้เป็น hostname alternative (ถ้า IP ไม่ทำงาน)
- ✅ ใช้สำหรับ logging และ debugging

### 4. **cPanel Version: `130.0 (build 17)`** ⭐

**ประโยชน์:**
- ✅ **ยืนยันว่าเป็น cPanel** - รู้ environment
- ✅ **Feature compatibility** - รู้ features ที่รองรับ

**การใช้งาน:**
- ✅ รู้ว่าใช้ cPanel environment
- ✅ รู้ว่าใช้ Passenger/Node.js app setup

### 5. **Apache Version: `2.4.65`** ⭐

**ประโยชน์:**
- ✅ **Web server info** - รู้ว่าใช้ Apache
- ✅ **.htaccess support** - Apache รองรับ `.htaccess` และ `SetEnv`

**การใช้งาน:**
- ✅ ใช้ `.htaccess` สำหรับ environment variables
- ✅ ใช้ `SetEnv` ใน `.htaccess` (Litespeed module)

### 6. **Operating System: `linux`** ⭐

**ประโยชน์:**
- ✅ **Platform info** - รู้ว่าเป็น Linux
- ✅ **Path separators** - ใช้ `/` สำหรับ paths

**การใช้งาน:**
- ✅ Socket paths: `/tmp/mysql.sock`, `/var/lib/mysql/mysql.sock`
- ✅ File paths: `/home/webthdsw/kdcschool.webthdesign.com`

### 7. **Architecture: `x86_64`** ⭐

**ประโยชน์:**
- ✅ **64-bit system** - รู้ว่าเป็น 64-bit
- ✅ **Binary compatibility** - รู้ binary compatibility

**การใช้งาน:**
- ✅ ใช้ Node.js binaries ที่รองรับ x86_64
- ✅ ใช้ native modules ที่รองรับ x86_64

---

## 🔍 การวิเคราะห์ปัญหา Database Connection

### ปัญหาที่พบ:
1. ✅ **SQL Syntax Error** (`ER_PARSE_ERROR`)
   - **สาเหตุ**: MariaDB 10.6 มี reserved words มากกว่า MySQL
   - **แก้ไข**: ใช้ backticks สำหรับ reserved words (เช่น `` `current_time` ``)

2. ✅ **Access Denied** (`ER_ACCESS_DENIED_ERROR`)
   - **สาเหตุ**: Authentication protocol หรือ credentials ไม่ถูกต้อง
   - **แก้ไข**: ใช้ `process.env` แทน `useRuntimeConfig()`

3. ✅ **Cannot read properties of undefined (reading 'apply')**
   - **สาเหตุ**: `pool.execute()` ไม่ทำงานใน bundle
   - **แก้ไข**: ใช้ `pool.query()` แทน

### ข้อมูลที่ช่วยแก้ปัญหา:

1. **MariaDB 10.6.24**:
   - ✅ รู้ว่าเป็น MariaDB → ใช้ backticks ใน SQL
   - ✅ รู้ authentication methods ที่รองรับ
   - ✅ รู้ SQL syntax compatibility

2. **IP Address `192.250.235.23`**:
   - ✅ ยืนยัน IP ที่ใช้ถูกต้อง
   - ✅ ใช้สำหรับ remote connection

3. **cPanel Environment**:
   - ✅ รู้ว่าใช้ `.htaccess` สำหรับ environment variables
   - ✅ รู้ว่าใช้ Passenger/Node.js app

---

## 💡 คำแนะนำ

### 1. **MariaDB-Specific Considerations**

```typescript
// ✅ ใช้ backticks สำหรับ reserved words
const rows = await query<{ current_time: string }>(
  'SELECT NOW() as `current_time`, DATABASE() as `current_database`'
)

// ✅ ตรวจสอบ MariaDB version
const version = await queryOne<{ version: string }>(
  'SELECT VERSION() as version'
)
```

### 2. **Connection Configuration**

```typescript
// ✅ ใช้ IP address ที่ยืนยันแล้ว
connectionConfig.host = process.env.DB_HOST || '192.250.235.23'

// ✅ รองรับทั้ง Socket และ TCP
if (process.env.DB_SOCKET) {
  connectionConfig.socketPath = process.env.DB_SOCKET
} else {
  connectionConfig.host = process.env.DB_HOST || '192.250.235.23'
  connectionConfig.port = parseInt(process.env.DB_PORT || '3306')
}
```

### 3. **Environment Variables**

```apache
# .htaccess (Apache/Litespeed)
<IfModule Litespeed>
  SetEnv DB_HOST 192.250.235.23
  SetEnv DB_PORT 3306
  SetEnv DB_NAME webthdsw_tutordb
  SetEnv DB_USER webthdsw_tutor
  SetEnv DB_PASSWORD 57*0yZiKMmDyThXx
</IfModule>
```

---

## 📊 สรุปประโยชน์

| ข้อมูล | ประโยชน์ | ความสำคัญ |
|--------|----------|-----------|
| **Database Version** | MariaDB 10.6.24 - SQL syntax, auth methods | ⭐⭐⭐ |
| **Shared IP Address** | `192.250.235.23` - Connection config | ⭐⭐⭐ |
| **Server Name** | `s1301` - Hostname alternative | ⭐⭐ |
| **cPanel Version** | Environment info | ⭐ |
| **Apache Version** | .htaccess support | ⭐ |
| **Operating System** | Linux - Path separators | ⭐ |
| **Architecture** | x86_64 - Binary compatibility | ⭐ |

---

## ✅ สรุป

**ข้อมูลนี้มีประโยชน์มาก!** โดยเฉพาะ:

1. ✅ **Database Version** - ช่วยแก้ SQL syntax errors
2. ✅ **IP Address** - ยืนยัน connection config
3. ✅ **Server Name** - ยืนยัน hostname
4. ✅ **cPanel/Apache** - รู้ environment และ features

**ข้อมูลเหล่านี้ช่วย:**
- ✅ แก้ไข SQL syntax errors (MariaDB reserved words)
- ✅ ยืนยัน connection configuration
- ✅ Debug authentication issues
- ✅ Optimize connection settings

---

**คำแนะนำ**: เก็บข้อมูลนี้ไว้สำหรับ reference และ debugging ในอนาคต ✅

