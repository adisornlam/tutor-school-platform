# 📦 Database Backups

โฟลเดอร์นี้เก็บไฟล์ backup ของ database `tutordb`

## 📝 วิธี Backup

```bash
bun run db:backup
```

ไฟล์ backup จะถูกสร้างที่นี่พร้อม timestamp:
- `backup_tutordb_YYYYMMDD_HHMMSS.sql`

## 🔄 วิธี Restore

### วิธีที่ 1: ใช้ Script (แนะนำ)

```bash
# Restore จากไฟล์ backup
bun run db:restore docs/backups/backup_tutordb_YYYYMMDD_HHMMSS.sql

# หรือใช้ไฟล์ล่าสุด
bun run db:restore docs/backups/backup_tutordb_latest.sql
```

### วิธีที่ 2: ใช้ Command Line

```bash
mysql -h localhost -P 3307 -u root -p tutordb < docs/backups/backup_tutordb_YYYYMMDD_HHMMSS.sql
```

### วิธีที่ 3: ใช้ DBeaver

1. เปิดไฟล์ `.sql` backup
2. คลิกขวาที่ SQL Editor → **Execute SQL Script**
3. หรือกด `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows/Linux)

## ⚠️ ข้อควรระวัง

- **การ restore จะเขียนทับข้อมูลเดิมทั้งหมด!**
- ควร backup ก่อน restore เสมอ
- ทดสอบ restore ใน database ใหม่ก่อนใช้จริง

## 📋 ไฟล์ในโฟลเดอร์นี้

ไฟล์ backup ที่เก็บไว้ในโฟลเดอร์นี้:
- `backup_tutordb_YYYYMMDD_HHMMSS.sql` - ไฟล์ backup พร้อม timestamp
- `backup_tutordb_latest.sql` - ไฟล์ backup ล่าสุด (ถ้ามี)

## 🔄 Workflow สำหรับเครื่องใหม่

เมื่อ pull code จาก git ไปที่เครื่องใหม่:

1. **Setup database:**
   ```bash
   bun run db:migrate
   ```

2. **Restore data:**
   ```bash
   bun run db:restore docs/backups/backup_tutordb_latest.sql
   ```

3. **หรือ restore จากไฟล์ที่ต้องการ:**
   ```bash
   bun run db:restore docs/backups/backup_tutordb_YYYYMMDD_HHMMSS.sql
   ```

---

**หมายเหตุ:** ไฟล์ backup ในโฟลเดอร์นี้จะถูก commit ขึ้น git เพื่อให้สามารถ restore ได้ง่ายเมื่อ pull ไปที่เครื่องอื่น

