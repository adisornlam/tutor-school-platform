#!/bin/bash

# Database Setup Script for Tutor School Platform
# Usage: ./scripts/setup-db.sh

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-3307}
DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD:-}
DB_NAME=${DB_NAME:-tutordb}

echo "📦 Setting up database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "User: $DB_USER"
echo ""

# Create database
echo "Creating database..."
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER $([ -n "$DB_PASSWORD" ] && echo "-p$DB_PASSWORD") <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE $DB_NAME;
SET time_zone = '+07:00';
EOF

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully"
else
    echo "❌ Failed to create database"
    exit 1
fi

# Run schema
echo ""
echo "Running database schema..."
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER $([ -n "$DB_PASSWORD" ] && echo "-p$DB_PASSWORD") $DB_NAME < docs/DATABASE_SCHEMA.sql

if [ $? -eq 0 ]; then
    echo "✅ Schema imported successfully"
else
    echo "❌ Failed to import schema"
    exit 1
fi

echo ""
echo "🎉 Database setup completed!"

