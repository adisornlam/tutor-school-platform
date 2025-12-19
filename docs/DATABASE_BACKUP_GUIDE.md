# 📦 คู่มือการ Backup Database ด้วย DBeaver Free

## วิธีที่ 1: ใช้ Data Transfer (แนะนำ - Backup ทั้งก้อน)

### ขั้นตอน:

1. **เปิด DBeaver และเชื่อมต่อกับ Database**
   - เปิด DBeaver
   - เชื่อมต่อกับ MySQL database (`tutordb`)

2. **คลิกขวาที่ Database `tutordb`**
   - เลือก **Tools** → **Data Transfer**

3. **ตั้งค่า Source (ต้นทาง)**
   - Source: เลือก `tutordb` database
   - Tables: เลือก **All tables** หรือเลือกเฉพาะตารางที่ต้องการ

4. **ตั้งค่า Target (ปลายทาง)**
   - Target type: เลือก **SQL script**
   - Output file: เลือกตำแหน่งที่ต้องการบันทึกไฟล์ (เช่น `backup_tutordb_2025-01-XX.sql`)
   - Format: เลือก **SQL** หรือ **SQL (with data)**

5. **ตั้งค่าเพิ่มเติม**
   - ✅ Include schema (CREATE DATABASE, CREATE TABLE)
   - ✅ Include data (INSERT statements)
   - ✅ Include indexes
   - ✅ Include foreign keys
   - ✅ Include triggers (ถ้ามี)

6. **คลิก "Start"** เพื่อเริ่ม backup

7. **รอให้เสร็จสิ้น** - ไฟล์ SQL จะถูกสร้างขึ้น

---

## วิธีที่ 2: ใช้ SQL Script Generator (Backup Structure + Data แยกกัน)

### Backup Structure (โครงสร้าง):

1. **คลิกขวาที่ Database `tutordb`**
   - เลือก **Tools** → **Generate SQL Script**

2. **ตั้งค่า**
   - Script type: **DDL** (Data Definition Language)
   - Objects: เลือก **All objects** หรือเลือกเฉพาะ
   - Output: เลือก **File** และระบุตำแหน่ง (เช่น `backup_structure.sql`)

3. **คลิก "Generate"**

### Backup Data (ข้อมูล):

1. **คลิกขวาที่ Database `tutordb`**
   - เลือก **Tools** → **Generate SQL Script**

2. **ตั้งค่า**
   - Script type: **DML** (Data Manipulation Language)
   - Objects: เลือก **All tables**
   - Output: เลือก **File** และระบุตำแหน่ง (เช่น `backup_data.sql`)

3. **คลิก "Generate"**

---

## วิธีที่ 3: ใช้ mysqldump Command Line (เร็วที่สุด - แนะนำ)

### สำหรับ macOS/Linux:

```bash
# Backup ทั้ง database (structure + data)
mysqldump -h localhost -P 3307 -u root -p tutordb > backup_tutordb_$(date +%Y%m%d_%H%M%S).sql

# Backup เฉพาะ structure (ไม่มี data)
mysqldump -h localhost -P 3307 -u root -p --no-data tutordb > backup_structure_$(date +%Y%m%d_%H%M%S).sql

# Backup เฉพาะ data (ไม่มี structure)
mysqldump -h localhost -P 3307 -u root -p --no-create-info tutordb > backup_data_$(date +%Y%m%d_%H%M%S).sql
```

### สำหรับ Windows (XAMPP):

```cmd
# ไปที่โฟลเดอร์ XAMPP MySQL
cd C:\xampp\mysql\bin

# Backup ทั้ง database
mysqldump.exe -h localhost -P 3307 -u root tutordb > backup_tutordb_%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%%time:~6,2%.sql
```

### ตัวอย่างคำสั่งที่ใช้ได้ทันที:

```bash
# Backup ทั้งก้อน (แนะนำ)
mysqldump -h localhost -P 3307 -u root tutordb > backup_tutordb_full.sql

# Backup พร้อม compress (ประหยัดพื้นที่)
mysqldump -h localhost -P 3307 -u root tutordb | gzip > backup_tutordb_full.sql.gz
```

---

## วิธีที่ 4: Backup แต่ละตารางแยกกัน (DBeaver Free)

### ขั้นตอน:

1. **คลิกขวาที่ตารางที่ต้องการ backup**
   - เลือก **Export Data**

2. **ตั้งค่า Export**
   - Format: เลือก **SQL** หรือ **CSV**
   - Output: เลือก **File**
   - ✅ Include column names
   - ✅ Include INSERT statements (ถ้าเลือก SQL)

3. **ทำซ้ำกับทุกตาราง**

**หมายเหตุ:** วิธีนี้ใช้เวลานานถ้ามีตารางเยอะ แนะนำให้ใช้วิธีที่ 1 หรือ 3 แทน

---

## วิธี Restore Database จาก Backup

### ใช้ DBeaver:

1. **เปิดไฟล์ SQL backup**
   - File → Open File → เลือกไฟล์ `.sql`

2. **รัน Script**
   - คลิกขวาที่ SQL Editor → **Execute SQL Script**
   - หรือกด `Ctrl+Enter` (Windows/Linux) / `Cmd+Enter` (Mac)

### ใช้ Command Line:

```bash
# Restore ทั้ง database
mysql -h localhost -P 3307 -u root -p tutordb < backup_tutordb_full.sql

# หรือสร้าง database ใหม่ก่อน
mysql -h localhost -P 3307 -u root -p -e "CREATE DATABASE tutordb_backup;"
mysql -h localhost -P 3307 -u root -p tutordb_backup < backup_tutordb_full.sql
```

---

## ⚠️ ข้อควรระวัง

1. **ตรวจสอบขนาดไฟล์** - ถ้า database ใหญ่อาจใช้เวลานาน
2. **ทดสอบ Restore** - ควรทดสอบ restore ใน database ใหม่ก่อนใช้จริง
3. **Backup เป็นประจำ** - แนะนำให้ backup ทุกวันหรือทุกสัปดาห์
4. **เก็บไฟล์ backup หลายชุด** - เก็บ backup หลายเวอร์ชันไว้เผื่อไฟล์เสียหาย

---

## 📅 แนะนำ Schedule Backup

### สร้าง Script สำหรับ Auto Backup:

**`backup-db.sh`** (macOS/Linux):

```bash
#!/bin/bash

# ตั้งค่า
DB_HOST="localhost"
DB_PORT="3307"
DB_USER="root"
DB_NAME="tutordb"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

# สร้างโฟลเดอร์ backup
mkdir -p $BACKUP_DIR

# Backup
mysqldump -h $DB_HOST -P $DB_PORT -u $DB_USER $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# ลบ backup เก่า (เก็บไว้ 7 วัน)
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/backup_$DATE.sql"
```

**ตั้งค่าให้รันอัตโนมัติ (cron):**

```bash
# รันทุกวันเวลา 2:00 AM
0 2 * * * /path/to/backup-db.sh
```

---

## ✅ Checklist การ Backup

- [ ] Backup ทั้ง structure และ data
- [ ] ตรวจสอบขนาดไฟล์ backup
- [ ] ทดสอบ restore ใน database ใหม่
- [ ] เก็บไฟล์ backup ไว้หลายชุด
- [ ] ตั้งค่า auto backup (ถ้าทำได้)

---

**หมายเหตุ:** สำหรับ DBeaver Free วิธีที่แนะนำที่สุดคือ **วิธีที่ 1 (Data Transfer)** เพราะทำได้ทั้งก้อนและง่ายต่อการใช้งาน

