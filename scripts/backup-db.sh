#!/bin/bash

# Database Backup Script
# Backup database to Downloads folder

# ตั้งค่า
DB_HOST="localhost"
DB_PORT="3307"
DB_USER="root"
DB_NAME="tutordb"
BACKUP_DIR="/Users/adisornl/Downloads"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_tutordb_$DATE.sql"

# สร้างโฟลเดอร์ backup (ถ้ายังไม่มี)
mkdir -p "$BACKUP_DIR"

echo "🔄 กำลัง backup database..."
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "Output: $BACKUP_FILE"

# Backup database
mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"

# ตรวจสอบว่าสำเร็จหรือไม่
if [ $? -eq 0 ]; then
    # ตรวจสอบขนาดไฟล์
    FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo ""
    echo "✅ Backup สำเร็จ!"
    echo "📁 ไฟล์: $BACKUP_FILE"
    echo "📊 ขนาด: $FILE_SIZE"
    echo ""
    echo "💡 วิธี Restore:"
    echo "   mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p $DB_NAME < $BACKUP_FILE"
else
    echo ""
    echo "❌ Backup ล้มเหลว!"
    echo "กรุณาตรวจสอบ:"
    echo "  1. MySQL กำลังทำงานอยู่"
    echo "  2. Port ถูกต้อง ($DB_PORT)"
    echo "  3. Username และ Password ถูกต้อง"
    exit 1
fi

