# 📋 วิเคราะห์ Payment Methods Management

## 🎯 Requirements

1. **Default Payment Method**: วิธีโอนเงิน (Bank Transfer)
2. **Multiple Bank Accounts**: รองรับหลายบัญชีธนาคาร
3. **Payment Gateways**: รองรับการเชื่อมต่อ payment gateway เช่น:
   - Stripe
   - Ksher Thailand
   - หรือ gateway อื่นๆ

---

## 📊 Database Structure ที่แนะนำ

### ตาราง `payment_methods`
เก็บวิธีการชำระเงินหลัก (Bank Transfer, Credit Card, etc.)

```sql
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
```

### ตาราง `bank_accounts`
เก็บบัญชีธนาคารสำหรับวิธีโอนเงิน

```sql
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
```

### ตาราง `payment_gateways`
เก็บการตั้งค่า payment gateway ต่างๆ

```sql
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
    config JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE CASCADE,
    INDEX idx_payment_method (payment_method_id),
    INDEX idx_gateway_code (gateway_code),
    INDEX idx_is_active (is_active),
    UNIQUE KEY unique_method_gateway (payment_method_id, gateway_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 📝 Default Data

### Payment Methods
```sql
INSERT INTO payment_methods (code, name, name_en, type, description, is_active, is_default, display_order) VALUES
('bank_transfer', 'โอนเงินผ่านธนาคาร', 'Bank Transfer', 'bank_transfer', 'ชำระเงินโดยการโอนเงินผ่านธนาคาร', TRUE, TRUE, 1),
('stripe', 'ชำระด้วยบัตรเครดิต (Stripe)', 'Credit Card (Stripe)', 'payment_gateway', 'ชำระเงินด้วยบัตรเครดิตผ่าน Stripe', FALSE, FALSE, 2),
('ksher', 'ชำระผ่าน Ksher', 'Ksher Payment', 'payment_gateway', 'ชำระเงินผ่าน Ksher Thailand', FALSE, FALSE, 3)
ON DUPLICATE KEY UPDATE name=VALUES(name);
```

---

## 🎨 UI Structure

### Main Page (`/admin/settings/payment-methods`)
- **Table View**: แสดงรายการ payment methods ทั้งหมด
  - Code
  - Name
  - Type (Bank Transfer / Payment Gateway)
  - Status (Active/Inactive)
  - Actions (Edit, Activate/Deactivate, Delete)

- **Add/Edit Modal**: สำหรับเพิ่ม/แก้ไข payment method
  - Basic Info (Code, Name, Type, Description, Icon)
  - Status & Display Order

### Bank Accounts Management
- **Sub-section** สำหรับ payment method ประเภท `bank_transfer`
- **Table**: แสดงบัญชีธนาคารทั้งหมด
- **Add/Edit Modal**: สำหรับเพิ่ม/แก้ไขบัญชี
  - Bank Name
  - Account Name
  - Account Number
  - Account Type (Savings/Current)
  - Branch Name
  - QR Code URL
  - Is Default
  - Display Order

### Payment Gateway Configuration
- **Sub-section** สำหรับ payment method ประเภท `payment_gateway`
- **Configuration Form**: ตาม gateway type
  - **Stripe**:
    - API Key (Publishable Key)
    - API Secret
    - Webhook Secret
    - Test Mode Toggle
  - **Ksher Thailand**:
    - Merchant ID
    - API Key
    - API Secret
    - Test Mode Toggle
    - Endpoint URL

---

## 🔐 Security Considerations

1. **Sensitive Data**: 
   - API keys และ secrets ต้องเข้ารหัสก่อนเก็บ (encrypted)
   - ไม่อนุญาตให้แสดง API secret ใน UI (แสดงเฉพาะ masked value)

2. **Access Control**: 
   - เฉพาะ `system_admin` และ `owner` เท่านั้นที่สามารถจัดการได้

3. **Validation**:
   - Payment method code ต้อง unique
   - Bank account number ต้อง validate format
   - Gateway configuration ต้อง validate ตาม gateway type

---

## 🚀 Implementation Steps

1. **สร้าง Migration Script**
   - สร้างตาราง `payment_methods`, `bank_accounts`, `payment_gateways`
   - Insert default data

2. **สร้าง API Endpoints**
   - `GET /api/admin/settings/payment-methods` - List all payment methods
   - `POST /api/admin/settings/payment-methods` - Create payment method
   - `GET /api/admin/settings/payment-methods/[id]` - Get payment method detail
   - `PUT /api/admin/settings/payment-methods/[id]` - Update payment method
   - `DELETE /api/admin/settings/payment-methods/[id]` - Delete payment method
   - `PATCH /api/admin/settings/payment-methods/[id]/status` - Toggle status
   - `GET /api/admin/settings/payment-methods/[id]/bank-accounts` - Get bank accounts
   - `POST /api/admin/settings/payment-methods/[id]/bank-accounts` - Add bank account
   - `PUT /api/admin/settings/payment-methods/[id]/bank-accounts/[accountId]` - Update bank account
   - `DELETE /api/admin/settings/payment-methods/[id]/bank-accounts/[accountId]` - Delete bank account
   - `GET /api/admin/settings/payment-methods/[id]/gateway` - Get gateway config
   - `PUT /api/admin/settings/payment-methods/[id]/gateway` - Update gateway config

3. **สร้าง UI Components**
   - `PaymentMethodsIndex.vue` - Main listing page
   - `PaymentMethodModal.vue` - Add/Edit payment method
   - `BankAccountsSection.vue` - Bank accounts management
   - `BankAccountModal.vue` - Add/Edit bank account
   - `PaymentGatewayConfig.vue` - Gateway configuration form
   - `StripeConfig.vue` - Stripe-specific config
   - `KsherConfig.vue` - Ksher-specific config

4. **Integration**
   - อัปเดต `payments` table (ถ้ายังไม่มี) ให้ reference `payment_method_id`
   - อัปเดต enrollment/payment flow ให้ใช้ payment methods

---

*Last updated: 2025-01-20*

