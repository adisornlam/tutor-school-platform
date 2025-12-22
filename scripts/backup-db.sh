#!/bin/bash

# Database Backup Script
# Backup database to Downloads folder

# ตั้งค่า
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3307}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_NAME="${DB_NAME:-tutordb}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_DIR="$PROJECT_ROOT/docs/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_tutordb_$DATE.sql"

# Load .env file if exists
if [ -f "$PROJECT_ROOT/.env" ]; then
    set -a
    source "$PROJECT_ROOT/.env" 2>/dev/null || true
    set +a
    DB_HOST="${DB_HOST:-localhost}"
    DB_PORT="${DB_PORT:-3307}"
    DB_USER="${DB_USER:-root}"
    DB_PASSWORD="${DB_PASSWORD:-}"
    DB_NAME="${DB_NAME:-tutordb}"
fi

# หา mysqldump path
MYSQLDUMP=""
if command -v mysqldump &> /dev/null; then
    MYSQLDUMP="mysqldump"
elif [ -f "/Applications/XAMPP/xamppfiles/bin/mysqldump" ]; then
    MYSQLDUMP="/Applications/XAMPP/xamppfiles/bin/mysqldump"
elif [ -f "/usr/local/mysql/bin/mysqldump" ]; then
    MYSQLDUMP="/usr/local/mysql/bin/mysqldump"
elif [ -f "/opt/homebrew/bin/mysqldump" ]; then
    MYSQLDUMP="/opt/homebrew/bin/mysqldump"
else
    echo "❌ ไม่พบ mysqldump!"
    echo "กรุณาติดตั้ง MySQL หรือ XAMPP"
    exit 1
fi

# สร้างโฟลเดอร์ backup (ถ้ายังไม่มี)
mkdir -p "$BACKUP_DIR"

echo "🔄 กำลัง backup database..."
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "mysqldump: $MYSQLDUMP"
echo "Output: $BACKUP_FILE"

# Backup database
# Use --protocol=TCP to force TCP connection instead of socket
if [ -n "$DB_PASSWORD" ]; then
    "$MYSQLDUMP" --protocol=TCP -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_FILE"
else
    "$MYSQLDUMP" --protocol=TCP -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"
fi

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
    echo ""
    echo "📝 หรือใช้ script restore:"
    echo "   bun run db:restore $BACKUP_FILE"
else
    echo ""
    echo "❌ Backup ล้มเหลว!"
    echo "กรุณาตรวจสอบ:"
    echo "  1. MySQL กำลังทำงานอยู่"
    echo "  2. Port ถูกต้อง ($DB_PORT)"
    echo "  3. Username และ Password ถูกต้อง"
    exit 1
fi

