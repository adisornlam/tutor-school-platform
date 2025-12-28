# เปรียบเทียบปัญหา Reddit Post กับโปรเจคนี้

**Reddit Post**: [Trying to connect NodeJS (with Express) to MySQL db hosted on CPanel](https://www.reddit.com/r/mysql/comments/lfggcx/trying_to_connect_nodejs_with_express_to_mysql_db/)

---

## 🔍 ปัญหาที่พบใน Reddit Post

### Error Message
```
ER_NOT_SUPPORTED_AUTH_MODE: 
Client does not support authentication protocol requested by server; 
consider upgrading MySQL client
```

### สาเหตุ
- **MySQL Server** ใช้ authentication protocol ใหม่ (caching_sha2_password)
- **MySQL Client** (ใน Node.js) ไม่รองรับ protocol นี้
- มักเกิดกับ MySQL 8.0+ ที่ใช้ `caching_sha2_password` เป็น default

### วิธีแก้ไขที่แนะนำ
1. **อัปเดต MySQL Client** (mysql2) เป็นเวอร์ชันล่าสุด
2. **เปลี่ยน authentication mode** ของ MySQL user:
   ```sql
   ALTER USER 'username'@'host' 
   IDENTIFIED WITH mysql_native_password BY 'password';
   ```
3. **ตรวจสอบ cPanel settings** - อนุญาต remote connection

---

## 🔍 ปัญหาที่พบในโปรเจคนี้

### Error Message
```
Cannot read properties of undefined (reading 'apply')
```

### สาเหตุ
- **Bundling Issue**: `pool.execute()` ไม่ทำงานใน Nitro bundle
- **Method Binding**: `execute()` method อาจถูก bundle ผิดพลาด
- **ไม่ใช่ปัญหา authentication** แต่เป็นปัญหา bundling

### วิธีแก้ไขที่ใช้
1. **เปลี่ยนจาก `pool.execute()` เป็น `pool.query()`**
   ```typescript
   // ❌ ไม่ทำงาน
   const [rows] = await pool.execute(sql, params)
   
   // ✅ ทำงาน
   const [rows] = await pool.query(sql, params)
   ```

2. **เพิ่ม mysql2 ใน `externals.inline`** ใน `nuxt.config.ts`

3. **Post-build script** เพื่อแก้ไข import issues

---

## 📊 เปรียบเทียบ

| หัวข้อ | Reddit Post | โปรเจคนี้ |
|--------|-------------|-----------|
| **Error Type** | `ER_NOT_SUPPORTED_AUTH_MODE` | `Cannot read properties of undefined` |
| **สาเหตุ** | Authentication protocol ไม่รองรับ | Bundling issue (`execute()` method) |
| **MySQL Version** | MySQL 8.0+ (caching_sha2_password) | ไม่ได้ระบุ (แต่ใช้ mysql2 v3.11.0) |
| **Library** | mysql/mysql2 (ไม่ระบุเวอร์ชัน) | mysql2 v3.11.0 |
| **Environment** | cPanel + Express | cPanel + Nuxt 4 + Nitro |
| **วิธีแก้** | เปลี่ยน auth mode หรืออัปเดต client | ใช้ `query()` แทน `execute()` |
| **สถานะ** | ไม่ทราบ (ไม่มี follow-up) | ✅ แก้ไขแล้ว |

---

## 💡 สรุป

### ❌ **ไม่ใช่ปัญหาเดียวกัน**

1. **Reddit Post**: 
   - ปัญหา **authentication protocol**
   - เกิดจาก MySQL server/client version mismatch
   - แก้ได้ด้วยการเปลี่ยน auth mode หรืออัปเดต client

2. **โปรเจคนี้**:
   - ปัญหา **bundling/method binding**
   - เกิดจาก Nitro bundle `execute()` method ผิดพลาด
   - แก้ได้ด้วยการใช้ `query()` แทน

### ✅ **แต่มีจุดร่วมกัน**

1. **ทั้งสองใช้ mysql2** library
2. **ทั้งสอง deploy บน cPanel**
3. **ทั้งสองเจอปัญหา connection** (แต่คนละแบบ)
4. **ทั้งสองแก้ได้** (ถ้า Reddit user ทำตามคำแนะนำ)

---

## 🔧 คำแนะนำสำหรับ Reddit User

ถ้า Reddit user ยังเจอปัญหา:

1. **ตรวจสอบ mysql2 version**:
   ```bash
   npm list mysql2
   ```
   - ควรใช้ `mysql2@^3.0.0+` (รองรับ auth modes หลายแบบ)

2. **เปลี่ยน authentication mode**:
   ```sql
   ALTER USER 'username'@'localhost' 
   IDENTIFIED WITH mysql_native_password BY 'password';
   FLUSH PRIVILEGES;
   ```

3. **ตรวจสอบ connection config**:
   ```javascript
   {
     host: 'localhost',
     user: 'username',
     password: 'password',
     database: 'database',
     // mysql2 รองรับ auth modes หลายแบบโดยอัตโนมัติ
   }
   ```

4. **ใช้ socket connection** (ถ้าเป็น local database):
   ```javascript
   {
     socketPath: '/tmp/mysql.sock', // หรือ path อื่น
     user: 'username',
     password: 'password',
     database: 'database',
   }
   ```

---

## 📚 References

- [MySQL Authentication Plugins](https://dev.mysql.com/doc/refman/8.0/en/authentication-plugins.html)
- [mysql2 GitHub - Authentication](https://github.com/sidorares/node-mysql2#authentication)
- [Stack Overflow - MySQL 8.0 Client Authentication](https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server)

---

**สรุป**: Reddit user น่าจะแก้ปัญหาได้ถ้าทำตามคำแนะนำ (เปลี่ยน auth mode หรืออัปเดต client) แต่ปัญหาของโปรเจคนี้เป็นคนละเรื่อง (bundling issue) และแก้ไขแล้ว ✅

