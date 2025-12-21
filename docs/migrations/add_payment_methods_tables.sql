-- ============================================
-- PAYMENT METHODS MANAGEMENT TABLES
-- ============================================
-- Date: 2025-01-20
-- Description: สร้างตารางสำหรับจัดการวิธีการชำระเงิน
-- ============================================

-- 1. Payment Methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    type ENUM('bank_transfer', 'payment_gateway', 'other') NOT NULL,
    description TEXT,
    icon VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_type (type),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bank Accounts Table
CREATE TABLE IF NOT EXISTS bank_accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    payment_method_id INT NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    account_name VARCHAR(200) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_type ENUM('savings', 'current') DEFAULT 'savings',
    branch_name VARCHAR(200),
    qr_code_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE CASCADE,
    INDEX idx_payment_method (payment_method_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Payment Gateways Table
CREATE TABLE IF NOT EXISTS payment_gateways (
    id INT PRIMARY KEY AUTO_INCREMENT,
    payment_method_id INT NOT NULL,
    gateway_code VARCHAR(50) NOT NULL,
    gateway_name VARCHAR(100) NOT NULL,
    api_key VARCHAR(500),
    api_secret VARCHAR(500),
    merchant_id VARCHAR(200),
    webhook_secret VARCHAR(500),
    endpoint_url VARCHAR(500),
    is_test_mode BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    config TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE CASCADE,
    INDEX idx_payment_method (payment_method_id),
    INDEX idx_gateway_code (gateway_code),
    INDEX idx_is_active (is_active),
    UNIQUE KEY unique_method_gateway (payment_method_id, gateway_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DEFAULT PAYMENT METHODS
-- ============================================

-- Bank Transfer (Default)
INSERT INTO payment_methods (code, name, name_en, type, description, is_active, is_default, display_order) VALUES
('bank_transfer', 'โอนเงินผ่านธนาคาร', 'Bank Transfer', 'bank_transfer', 'ชำระเงินโดยการโอนเงินผ่านธนาคาร', TRUE, TRUE, 1)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Stripe Payment Gateway
INSERT INTO payment_methods (code, name, name_en, type, description, is_active, is_default, display_order) VALUES
('stripe', 'ชำระด้วยบัตรเครดิต (Stripe)', 'Credit Card (Stripe)', 'payment_gateway', 'ชำระเงินด้วยบัตรเครดิตผ่าน Stripe', FALSE, FALSE, 2)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Ksher Thailand Payment Gateway
INSERT INTO payment_methods (code, name, name_en, type, description, is_active, is_default, display_order) VALUES
('ksher', 'ชำระผ่าน Ksher', 'Ksher Payment', 'payment_gateway', 'ชำระเงินผ่าน Ksher Thailand', FALSE, FALSE, 3)
ON DUPLICATE KEY UPDATE name=VALUES(name);

SELECT 'Payment methods tables created and default payment methods inserted!' as status;

