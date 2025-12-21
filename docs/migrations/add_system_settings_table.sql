-- ============================================
-- SYSTEM SETTINGS TABLE
-- ============================================
-- Date: 2025-01-20
-- Description: สร้างตารางสำหรับเก็บการตั้งค่าระบบ
-- ============================================

CREATE TABLE IF NOT EXISTS system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    `key` VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    category VARCHAR(50) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (`key`),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DEFAULT SYSTEM SETTINGS
-- ============================================

-- General Information
INSERT INTO system_settings (`key`, value, type, category, description, is_public) VALUES
('app_name', 'KDC Tutor School', 'string', 'general', 'ชื่อแอปพลิเคชัน', TRUE),
('app_version', '1.0.0', 'string', 'general', 'เวอร์ชัน', TRUE),
('logo_url', '', 'string', 'general', 'URL โลโก้', TRUE),
('favicon_url', '', 'string', 'general', 'URL Favicon', TRUE),
('contact_email', '', 'string', 'general', 'อีเมลติดต่อ', TRUE),
('contact_phone', '', 'string', 'general', 'เบอร์โทรศัพท์ติดต่อ', TRUE),
('address', '', 'string', 'general', 'ที่อยู่', TRUE)

ON DUPLICATE KEY UPDATE
    value = VALUES(value),
    description = VALUES(description);

-- Timezone & Date/Time
INSERT INTO system_settings (`key`, value, type, category, description, is_public) VALUES
('timezone', 'Asia/Bangkok', 'string', 'timezone', 'Timezone', FALSE),
('date_format', 'DD/MM/YYYY', 'string', 'timezone', 'รูปแบบวันที่', FALSE),
('time_format', '24-hour', 'string', 'timezone', 'รูปแบบเวลา (24-hour หรือ 12-hour)', FALSE)

ON DUPLICATE KEY UPDATE
    value = VALUES(value),
    description = VALUES(description);

-- Maintenance Mode
INSERT INTO system_settings (`key`, value, type, category, description, is_public) VALUES
('maintenance_mode', 'false', 'boolean', 'maintenance', 'เปิด/ปิด Maintenance Mode', FALSE),
('maintenance_message', 'ระบบกำลังบำรุงรักษา กรุณาลองใหม่อีกครั้งในภายหลัง', 'string', 'maintenance', 'ข้อความ Maintenance', FALSE),
('maintenance_allowed_ips', '[]', 'json', 'maintenance', 'IP ที่สามารถเข้าถึงได้ระหว่าง Maintenance (JSON array)', FALSE)

ON DUPLICATE KEY UPDATE
    value = VALUES(value),
    description = VALUES(description);

-- Security Settings
INSERT INTO system_settings (`key`, value, type, category, description, is_public) VALUES
('session_timeout', '120', 'number', 'security', 'Session timeout (นาที)', FALSE),
('password_min_length', '8', 'number', 'security', 'ความยาวรหัสผ่านขั้นต่ำ', FALSE),
('password_require_special', 'false', 'boolean', 'security', 'รหัสผ่านต้องมีตัวอักษรพิเศษ', FALSE),
('password_require_uppercase', 'false', 'boolean', 'security', 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่', FALSE),
('password_require_lowercase', 'false', 'boolean', 'security', 'รหัสผ่านต้องมีตัวพิมพ์เล็ก', FALSE),
('password_require_number', 'false', 'boolean', 'security', 'รหัสผ่านต้องมีตัวเลข', FALSE),
('login_attempts_limit', '5', 'number', 'security', 'จำนวนครั้งที่พยายาม login ได้', FALSE),
('login_lockout_duration', '15', 'number', 'security', 'ระยะเวลาที่ถูก lock (นาที)', FALSE),
('two_factor_auth_enabled', 'false', 'boolean', 'security', 'เปิดใช้งาน 2FA สำหรับ admin', FALSE)

ON DUPLICATE KEY UPDATE
    value = VALUES(value),
    description = VALUES(description);

-- File Upload Settings
INSERT INTO system_settings (`key`, value, type, category, description, is_public) VALUES
('max_file_size', '10', 'number', 'file_upload', 'ขนาดไฟล์สูงสุด (MB)', FALSE),
('allowed_file_types', 'jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx', 'string', 'file_upload', 'ประเภทไฟล์ที่อนุญาต (คั่นด้วย comma)', FALSE),
('storage_type', 'local', 'string', 'file_upload', 'ประเภท storage (local, s3, etc.)', FALSE)

ON DUPLICATE KEY UPDATE
    value = VALUES(value),
    description = VALUES(description);

-- Notification Settings
INSERT INTO system_settings (`key`, value, type, category, description, is_public) VALUES
('email_notifications_enabled', 'true', 'boolean', 'notification', 'เปิดใช้งานการแจ้งเตือนทางอีเมล', FALSE),
('sms_notifications_enabled', 'false', 'boolean', 'notification', 'เปิดใช้งานการแจ้งเตือนทาง SMS', FALSE),
('course_reminder_before_minutes', '60', 'number', 'notification', 'แจ้งเตือนก่อนคอร์สเริ่ม (นาที)', FALSE),
('payment_reminder_before_days', '3', 'number', 'notification', 'แจ้งเตือนก่อนวันชำระเงิน (วัน)', FALSE)

ON DUPLICATE KEY UPDATE
    value = VALUES(value),
    description = VALUES(description);

-- Language Settings
INSERT INTO system_settings (`key`, value, type, category, description, is_public) VALUES
('default_language', 'th', 'string', 'language', 'ภาษาหลัก', TRUE),
('supported_languages', 'th,en', 'string', 'language', 'ภาษาที่รองรับ (คั่นด้วย comma)', TRUE)

ON DUPLICATE KEY UPDATE
    value = VALUES(value),
    description = VALUES(description);

-- Display Settings
INSERT INTO system_settings (`key`, value, type, category, description, is_public) VALUES
('items_per_page', '20', 'number', 'display', 'จำนวนรายการต่อหน้า', FALSE),
('theme_mode', 'light', 'string', 'display', 'Theme mode (light, dark, auto)', TRUE),
('primary_color', '#10b981', 'string', 'display', 'Primary color (hex)', TRUE),
('secondary_color', '#2563eb', 'string', 'display', 'Secondary color (hex)', TRUE)

ON DUPLICATE KEY UPDATE
    value = VALUES(value),
    description = VALUES(description);

SELECT 'System settings table created and default settings inserted!' as status;

