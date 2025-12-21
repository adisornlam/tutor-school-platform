-- ============================================
-- ENROLLMENT ENHANCEMENT MIGRATION
-- ============================================
-- Date: 2025-01-20
-- Description: เพิ่มตาราง user_addresses และ fields สำหรับ enrollment type (onsite/online)
-- ============================================

-- 1. Create user_addresses table
CREATE TABLE IF NOT EXISTS user_addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    address_type ENUM('home', 'work', 'other') DEFAULT 'home',
    recipient_name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(300) NOT NULL,
    address_line2 VARCHAR(300),
    subdistrict VARCHAR(100),
    district VARCHAR(100),
    province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    country VARCHAR(100) DEFAULT 'Thailand',
    is_default BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_default (user_id, is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Add enrollment_type and shipping_address_id to enrollments
-- Check if columns already exist before adding
SET @dbname = DATABASE();
SET @tablename = 'enrollments';
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
        WHERE
            (TABLE_SCHEMA = @dbname)
            AND (TABLE_NAME = @tablename)
            AND (COLUMN_NAME = 'enrollment_type')
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN enrollment_type ENUM(\'onsite\', \'online\') DEFAULT \'onsite\' AFTER branch_id')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
        WHERE
            (TABLE_SCHEMA = @dbname)
            AND (TABLE_NAME = @tablename)
            AND (COLUMN_NAME = 'shipping_address_id')
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN shipping_address_id INT NULL AFTER enrollment_type')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add indexes if not exists
CREATE INDEX IF NOT EXISTS idx_enrollment_type ON enrollments(enrollment_type);
CREATE INDEX IF NOT EXISTS idx_shipping_address ON enrollments(shipping_address_id);

-- Add foreign key for shipping_address_id
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE
            (TABLE_SCHEMA = @dbname)
            AND (TABLE_NAME = @tablename)
            AND (COLUMN_NAME = 'shipping_address_id')
            AND (REFERENCED_TABLE_NAME = 'user_addresses')
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD FOREIGN KEY (shipping_address_id) REFERENCES user_addresses(id) ON DELETE SET NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 3. Add price fields to courses (if not exist)
SET @tablename = 'courses';
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
        WHERE
            (TABLE_SCHEMA = @dbname)
            AND (TABLE_NAME = @tablename)
            AND (COLUMN_NAME = 'onsite_price')
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN onsite_price DECIMAL(10, 2) NULL AFTER price')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
        WHERE
            (TABLE_SCHEMA = @dbname)
            AND (TABLE_NAME = @tablename)
            AND (COLUMN_NAME = 'online_price')
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN online_price DECIMAL(10, 2) NULL AFTER onsite_price')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 4. Copy existing price to onsite_price and online_price if they are null
UPDATE courses 
SET onsite_price = price, online_price = price 
WHERE (onsite_price IS NULL OR online_price IS NULL) AND price IS NOT NULL;

SELECT 'Migration completed successfully!' as status;

