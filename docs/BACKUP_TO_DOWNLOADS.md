# 📦 วิธี Backup Database ไปที่ Downloads Folder

## วิธีที่ 1: ใช้ Script (แนะนำ - เร็วและง่าย)

### รันคำสั่ง:

```bash
# วิธีที่ 1: ใช้ npm script
bun run db:backup

# วิธีที่ 2: รัน script โดยตรง
bash scripts/backup-db.sh

# วิธีที่ 3: รัน script โดยตรง (ถ้าให้สิทธิ์แล้ว)
./scripts/backup-db.sh
```

### ผลลัพธ์:
- ไฟล์ backup จะถูกสร้างที่: `/Users/adisornl/Downloads/backup_tutordb_YYYYMMDD_HHMMSS.sql`
- ตัวอย่าง: `backup_tutordb_20250119_143025.sql`

---

## วิธีที่ 2: ใช้ DBeaver Free

### ขั้นตอน:

1. **เปิด DBeaver และเชื่อมต่อกับ Database**
   - เปิด DBeaver
   - เชื่อมต่อกับ MySQL database (`tutordb`)

2. **คลิกขวาที่ Database `tutordb`**
   - เลือก **Tools** → **Data Transfer**

3. **ตั้งค่า Source (ต้นทาง)**
   - Source: เลือก `tutordb` database
   - Tables: เลือก **All tables**

4. **ตั้งค่า Target (ปลายทาง)**
   - Target type: เลือก **SQL script**
   - Output file: คลิก **Browse** และไปที่ `/Users/adisornl/Downloads`
   - ตั้งชื่อไฟล์: `backup_tutordb_YYYYMMDD_HHMMSS.sql` (หรือชื่ออื่น)
   - Format: เลือก **SQL** หรือ **SQL (with data)**

5. **ตั้งค่าเพิ่มเติม**
   - ✅ Include schema (CREATE DATABASE, CREATE TABLE)
   - ✅ Include data (INSERT statements)
   - ✅ Include indexes
   - ✅ Include foreign keys

6. **คลิก "Start"** เพื่อเริ่ม backup

7. **รอให้เสร็จสิ้น** - ไฟล์ SQL จะถูกสร้างที่ Downloads folder

---

## วิธีที่ 3: ใช้ Command Line โดยตรง

### รันคำสั่ง:

```bash
# Backup ทั้ง database
mysqldump -h localhost -P 3307 -u root tutordb > /Users/adisornl/Downloads/backup_tutordb_$(date +%Y%m%d_%H%M%S).sql

# หรือตั้งชื่อเอง
mysqldump -h localhost -P 3307 -u root tutordb > /Users/adisornl/Downloads/backup_tutordb_full.sql
```

### ตัวอย่าง:

```bash
# Backup พร้อม timestamp
mysqldump -h localhost -P 3307 -u root tutordb > /Users/adisornl/Downloads/backup_tutordb_20250119_143025.sql

# Backup และ compress (ประหยัดพื้นที่)
mysqldump -h localhost -P 3307 -u root tutordb | gzip > /Users/adisornl/Downloads/backup_tutordb_$(date +%Y%m%d_%H%M%S).sql.gz
```

---

## วิธี Restore จาก Downloads

### ใช้ Command Line:

```bash
# Restore จากไฟล์ backup ใน Downloads
mysql -h localhost -P 3307 -u root -p tutordb < /Users/adisornl/Downloads/backup_tutordb_YYYYMMDD_HHMMSS.sql
```

### ใช้ DBeaver:

1. **เปิดไฟล์ SQL backup**
   - File → Open File → เลือกไฟล์จาก `/Users/adisornl/Downloads`

2. **รัน Script**
   - คลิกขวาที่ SQL Editor → **Execute SQL Script**
   - หรือกด `Cmd+Enter` (Mac)

---

## ⚙️ ตั้งค่า Script (ถ้าต้องการเปลี่ยน path)

แก้ไขไฟล์ `scripts/backup-db.sh`:

```bash
# เปลี่ยน BACKUP_DIR เป็น path อื่น
BACKUP_DIR="/path/to/your/backup/folder"
```

---

## 📋 Checklist

- [ ] ตรวจสอบว่า MySQL กำลังทำงานอยู่
- [ ] ตรวจสอบว่า Port ถูกต้อง (3307)
- [ ] รัน backup script
- [ ] ตรวจสอบไฟล์ backup ใน Downloads folder
- [ ] ทดสอบ restore (ถ้าต้องการ)

---

## 💡 Tips

1. **ตั้งชื่อไฟล์ให้มี timestamp** - เพื่อไม่ให้ทับกัน
2. **ตรวจสอบขนาดไฟล์** - ถ้าใหญ่อาจใช้เวลานาน
3. **Backup เป็นประจำ** - แนะนำทุกวันหรือทุกสัปดาห์
4. **เก็บไฟล์ backup หลายชุด** - เก็บไว้เผื่อไฟล์เสียหาย

---

## 🔧 Troubleshooting

### Error: "mysqldump: command not found"
- **แก้ไข:** ใช้ full path ของ mysqldump
  ```bash
  /Applications/XAMPP/xamppfiles/bin/mysqldump -h localhost -P 3307 -u root tutordb > /Users/adisornl/Downloads/backup.sql
  ```

### Error: "Access denied"
- **แก้ไข:** ตรวจสอบ username และ password
  ```bash
  mysqldump -h localhost -P 3307 -u root -p tutordb > /Users/adisornl/Downloads/backup.sql
  ```

### Error: "Can't connect to MySQL server"
- **แก้ไข:** ตรวจสอบว่า MySQL กำลังทำงานอยู่
  ```bash
  # ตรวจสอบว่า MySQL ทำงานอยู่
  lsof -ti:3307
  ```

---

**หมายเหตุ:** วิธีที่แนะนำที่สุดคือ **วิธีที่ 1 (ใช้ Script)** เพราะง่าย รวดเร็ว และตั้งค่าได้ตามต้องการ

