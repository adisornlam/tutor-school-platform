# คู่มือการตั้งค่า MySQL สำหรับโปรเจกต์

## 📊 สถานะปัจจุบัน

### ✅ สิ่งที่มีอยู่แล้ว
- **XAMPP ติดตั้งแล้ว**: `/Applications/XAMPP/xamppfiles/`
- **MySQL Binary พร้อมใช้งาน**: `/Applications/XAMPP/xamppfiles/bin/mysql`
- **MySQL Data Directory**: `/Applications/XAMPP/xamppfiles/var/mysql/`
- **MySQL Config**: `/Applications/XAMPP/xamppfiles/etc/my.cnf`

### ⚠️ ปัญหาที่พบ
1. **MySQL Service ไม่ได้ทำงาน**: MariaDB is not running
2. **Port 3306 ถูกใช้งาน**: Cursor IDE กำลังใช้ port 3306 อยู่

---

## 🔧 วิธีแก้ไขปัญหา

### วิธีที่ 1: ใช้ XAMPP Control Panel (แนะนำ)

1. **เปิด XAMPP Control Panel**
   ```bash
   open /Applications/XAMPP/xamppfiles/xampp
   ```

2. **ตรวจสอบ Port 3306**
   - ถ้า Cursor หรือโปรแกรมอื่นใช้ port 3306 อยู่
   - ต้องปิดโปรแกรมนั้นก่อน หรือเปลี่ยน port ของ MySQL

3. **Start MySQL**
   - คลิก "Start" ที่ MySQL ใน XAMPP Control Panel
   - หรือใช้คำสั่ง:
   ```bash
   sudo /Applications/XAMPP/xamppfiles/xampp startmysql
   ```

---

### วิธีที่ 2: ใช้ Terminal Command

#### ตรวจสอบ Port 3306
```bash
lsof -i :3306
```

#### ถ้ามี process ใช้ port 3306 อยู่
```bash
# หา PID ของ process
lsof -i :3306

# Kill process (แทน PID ด้วยตัวเลขจริง)
kill -9 <PID>
```

#### Start MySQL
```bash
sudo /Applications/XAMPP/xamppfiles/xampp startmysql
```

#### ตรวจสอบสถานะ
```bash
/Applications/XAMPP/xamppfiles/bin/mysql.server status
```

---

### วิธีที่ 3: เปลี่ยน Port MySQL (ถ้า port 3306 ถูกใช้งาน)

#### แก้ไข Config File
```bash
sudo nano /Applications/XAMPP/xamppfiles/etc/my.cnf
```

#### เปลี่ยน port จาก 3306 เป็น 3307
```ini
[client]
port = 3307

[mysqld]
port = 3307
```

#### Restart MySQL
```bash
sudo /Applications/XAMPP/xamppfiles/xampp restartmysql
```

---

## 🧪 ทดสอบการเชื่อมต่อ

### วิธีที่ 1: ใช้ MySQL Client
```bash
# ใช้ MySQL จาก XAMPP
/Applications/XAMPP/xamppfiles/bin/mysql -u root -p

# หรือถ้าเปลี่ยน port แล้ว
/Applications/XAMPP/xamppfiles/bin/mysql -u root -p -P 3307
```

### วิธีที่ 2: ใช้ MySQL Client จาก Terminal (ถ้า install แยก)
```bash
# เพิ่ม XAMPP MySQL ไปใน PATH
export PATH="/Applications/XAMPP/xamppfiles/bin:$PATH"

# ทดสอบ
mysql -u root -p
```

---

## 📝 การตั้งค่า MySQL สำหรับโปรเจกต์

### 1. สร้าง Database
```sql
CREATE DATABASE tutor_school CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. สร้าง User (แนะนำ)
```sql
CREATE USER 'tutor_school_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON tutor_school.* TO 'tutor_school_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Import Schema
```bash
# ใช้ MySQL client
/Applications/XAMPP/xamppfiles/bin/mysql -u root -p tutor_school < DATABASE_SCHEMA.sql

# หรือใช้ user ที่สร้างไว้
/Applications/XAMPP/xamppfiles/bin/mysql -u tutor_school_user -p tutor_school < DATABASE_SCHEMA.sql
```

---

## 🔐 Environment Variables

สร้างไฟล์ `.env` ในโปรเจกต์:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tutor_school
DB_USER=tutor_school_user
DB_PASSWORD=your_secure_password

# หรือถ้าใช้ root (ไม่แนะนำสำหรับ production)
# DB_USER=root
# DB_PASSWORD=
```

---

## 🚀 Quick Start Commands

### Start MySQL
```bash
sudo /Applications/XAMPP/xamppfiles/xampp startmysql
```

### Stop MySQL
```bash
sudo /Applications/XAMPP/xamppfiles/xampp stopmysql
```

### Restart MySQL
```bash
sudo /Applications/XAMPP/xamppfiles/xampp restartmysql
```

### Check Status
```bash
/Applications/XAMPP/xamppfiles/bin/mysql.server status
```

### Connect to MySQL
```bash
/Applications/XAMPP/xamppfiles/bin/mysql -u root -p
```

---

## ⚠️ ปัญหาที่พบบ่อย

### 1. Port 3306 ถูกใช้งาน
**อาการ**: `ERROR! MySQL is not running` หรือ `Port 3306 is already in use`

**วิธีแก้**:
- ตรวจสอบ process ที่ใช้ port: `lsof -i :3306`
- Kill process หรือเปลี่ยน port MySQL

### 2. Permission Denied
**อาการ**: `Permission denied` เมื่อ start MySQL

**วิธีแก้**:
- ใช้ `sudo` เมื่อ start/stop MySQL
- ตรวจสอบ ownership ของ MySQL data directory

### 3. MySQL ไม่สามารถ start ได้
**อาการ**: MySQL start แล้วหยุดทันที

**วิธีแก้**:
- ตรวจสอบ error log: `/Applications/XAMPP/xamppfiles/var/mysql/*.err`
- ตรวจสอบ disk space
- ตรวจสอบ MySQL config file

### 4. ไม่สามารถเชื่อมต่อได้
**อาการ**: `Can't connect to MySQL server`

**วิธีแก้**:
- ตรวจสอบว่า MySQL running: `mysql.server status`
- ตรวจสอบ port: `lsof -i :3306`
- ตรวจสอบ firewall settings

---

## 📚 ข้อมูลเพิ่มเติม

### MySQL Default Settings (XAMPP)
- **Port**: 3306
- **Socket**: `/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock`
- **Data Directory**: `/Applications/XAMPP/xamppfiles/var/mysql/`
- **Config File**: `/Applications/XAMPP/xamppfiles/etc/my.cnf`
- **Error Log**: `/Applications/XAMPP/xamppfiles/var/mysql/*.err`

### Default User
- **Username**: `root`
- **Password**: (ว่างเปล่า - ไม่มี password)

---

## ✅ Checklist

- [ ] ตรวจสอบว่า MySQL ติดตั้งแล้ว
- [ ] ตรวจสอบ port 3306 ไม่ถูกใช้งาน
- [ ] Start MySQL service
- [ ] ทดสอบการเชื่อมต่อ
- [ ] สร้าง database `tutor_school`
- [ ] สร้าง user สำหรับโปรเจกต์
- [ ] Import database schema
- [ ] ตั้งค่า environment variables

---

## 🔗 เอกสารที่เกี่ยวข้อง

- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Database Schema
- [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) - แผนการพัฒนา

---

*อัปเดตล่าสุด: 2024*

