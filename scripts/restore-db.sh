#!/bin/bash

# Database Restore Script
# Restore database from backup file

# ตรวจสอบว่ามี argument หรือไม่
if [ -z "$1" ]; then
    echo "❌ กรุณาระบุไฟล์ backup ที่ต้องการ restore"
    echo ""
    echo "วิธีใช้งาน:"
    echo "  bun run db:restore <backup_file>"
    echo ""
    echo "ตัวอย่าง:"
    echo "  bun run db:restore docs/backups/backup_tutordb_20251219_180159.sql"
    echo "  bun run db:restore docs/backups/backup_tutordb_latest.sql"
    exit 1
fi

BACKUP_FILE="$1"

# ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ ไม่พบไฟล์ backup: $BACKUP_FILE"
    exit 1
fi

# ตั้งค่า
DB_HOST="localhost"
DB_PORT="3307"
DB_USER="root"
DB_NAME="tutordb"

# หา mysql path
MYSQL=""
if command -v mysql &> /dev/null; then
    MYSQL="mysql"
elif [ -f "/Applications/XAMPP/xamppfiles/bin/mysql" ]; then
    MYSQL="/Applications/XAMPP/xamppfiles/bin/mysql"
elif [ -f "/usr/local/mysql/bin/mysql" ]; then
    MYSQL="/usr/local/mysql/bin/mysql"
elif [ -f "/opt/homebrew/bin/mysql" ]; then
    MYSQL="/opt/homebrew/bin/mysql"
else
    echo "❌ ไม่พบ mysql!"
    echo "กรุณาติดตั้ง MySQL หรือ XAMPP"
    exit 1
fi

echo "🔄 กำลัง restore database..."
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "mysql: $MYSQL"
echo "Backup file: $BACKUP_FILE"
echo ""
echo "⚠️  คำเตือน: การ restore จะเขียนทับข้อมูลเดิมทั้งหมด!"
read -p "คุณแน่ใจหรือไม่? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ ยกเลิกการ restore"
    exit 0
fi

# Restore database (remove GTID_PURGED lines for compatibility)
sed -e '/GTID_PURGED/d' -e '/SET @@GLOBAL.GTID_PURGED/d' "$BACKUP_FILE" | "$MYSQL" -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME"

# ตรวจสอบว่าสำเร็จหรือไม่
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Restore สำเร็จ!"
    echo "Database: $DB_NAME"
else
    echo ""
    echo "❌ Restore ล้มเหลว!"
    echo "กรุณาตรวจสอบ:"
    echo "  1. MySQL กำลังทำงานอยู่"
    echo "  2. Port ถูกต้อง ($DB_PORT)"
    echo "  3. Username และ Password ถูกต้อง"
    echo "  4. ไฟล์ backup ไม่เสียหาย"
    exit 1
fi

