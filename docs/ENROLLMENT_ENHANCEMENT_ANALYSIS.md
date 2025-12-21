# วิเคราะห์ระบบการลงทะเบียนที่สมบูรณ์

## 📋 สถานการณ์ปัจจุบัน

### ปัญหาที่พบ:
1. ❌ ไม่มี field แยกประเภทการลงทะเบียน (เรียนสด vs เรียนออนไลน์)
2. ❌ ไม่มีตารางเก็บที่อยู่ของผู้เรียน (สำหรับส่งเอกสาร)
3. ❌ ไม่มีปุ่มสมัครเรียนในหน้า course detail
4. ❌ หน้าลงทะเบียนแสดงนักเรียนทั้งหมดแบบ dropdown (ไม่ searchable)

---

## 🎯 สิ่งที่ต้องเพิ่ม

### 1. Database Schema Enhancements

#### 1.1 ตาราง `user_addresses` (ใหม่)
สำหรับเก็บที่อยู่ของผู้เรียน (สามารถมีหลายที่อยู่ได้)

```sql
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
```

**เหตุผล:**
- ผู้เรียนออนไลน์ต้องส่งเอกสารไปตามที่อยู่
- ผู้เรียนอาจมีหลายที่อยู่ (บ้าน, ที่ทำงาน)
- ต้องระบุผู้รับเอกสาร

#### 1.2 เพิ่ม Fields ใน `enrollments` table

```sql
ALTER TABLE enrollments
ADD COLUMN enrollment_type ENUM('onsite', 'online') DEFAULT 'onsite' AFTER branch_id,
ADD COLUMN shipping_address_id INT NULL AFTER enrollment_type,
ADD INDEX idx_enrollment_type (enrollment_type),
ADD INDEX idx_shipping_address (shipping_address_id),
ADD FOREIGN KEY (shipping_address_id) REFERENCES user_addresses(id) ON DELETE SET NULL;
```

**เหตุผล:**
- แยกประเภทการเรียน: เรียนสด (onsite) vs เรียนออนไลน์ (online)
- สำหรับเรียนออนไลน์ ต้องเก็บ shipping_address_id สำหรับส่งเอกสาร
- สำหรับเรียนสด branch_id จะใช้สำหรับระบุสถานที่เรียน

**Note:** 
- ถ้า `enrollment_type = 'onsite'` → ใช้ `branch_id` เป็นหลัก
- ถ้า `enrollment_type = 'online'` → ใช้ `shipping_address_id` เป็นหลัก, `branch_id` อาจเป็น null หรือใช้เป็น branch ที่จัดการ

#### 1.3 เพิ่ม Field ใน `courses` table (ถ้ายังไม่มี)

```sql
-- ตรวจสอบว่ามี onsite_price และ online_price หรือยัง
ALTER TABLE courses
ADD COLUMN onsite_price DECIMAL(10, 2) NULL AFTER price,
ADD COLUMN online_price DECIMAL(10, 2) NULL AFTER onsite_price;
```

**เหตุผล:**
- ราคาเรียนสดและเรียนออนไลน์อาจแตกต่างกัน

---

### 2. Frontend Enhancements

#### 2.1 หน้า Course Detail (`/admin/courses/[id]/index.vue` หรือ public course page)

**ต้องเพิ่ม:**
- ปุ่ม "สมัครเรียนออนไลน์" 
- เมื่อคลิก → เปิด modal/form สำหรับลงทะเบียนเรียนออนไลน์
- Form ต้องมี:
  - เลือกผู้เรียน (searchable)
  - เลือกที่อยู่จัดส่ง (หรือเพิ่มที่อยู่ใหม่)
  - แสดงราคา (online_price)
  - ยืนยันการลงทะเบียน

**Flow:**
```
User clicks "สมัครเรียนออนไลน์"
  → Check if logged in
    → If not logged in: Redirect to login with return URL
    → If logged in: Open enrollment modal
      → Select student (if parent) or auto-select (if student)
      → Select/Add shipping address
      → Confirm enrollment
      → Create enrollment with type='online'
      → Redirect to payment (if needed)
```

#### 2.2 EnrollmentModal Component

**ต้องแก้ไข:**
1. **เปลี่ยน Student Select จาก dropdown เป็น Searchable Select**
   - ใช้ input + dropdown combo
   - ค้นหาแบบ real-time (debounce)
   - แสดงผล: "ชื่อ-นามสกุล (@username)"

2. **เพิ่ม Enrollment Type Selection**
   - Radio buttons: "เรียนสด" / "เรียนออนไลน์"
   - ถ้าเลือก "เรียนออนไลน์" → แสดง shipping address selection

3. **เพิ่ม Shipping Address Selection (สำหรับเรียนออนไลน์)**
   - Dropdown เลือกที่อยู่ (จาก user_addresses)
   - ปุ่ม "เพิ่มที่อยู่ใหม่"
   - Form เพิ่มที่อยู่ใหม่ (inline หรือ modal)

#### 2.3 หน้า Enrollment Edit (`/admin/enrollments/[id]/edit.vue`)

**ต้องแก้ไข:**
- เพิ่ม field `enrollment_type`
- เพิ่ม field `shipping_address_id` (แสดงเมื่อ enrollment_type = 'online')
- Logic: ถ้าเปลี่ยนจาก 'online' เป็น 'onsite' → ล้าง shipping_address_id

#### 2.4 หน้า Enrollment Detail (`/admin/enrollments/[id]/index.vue`)

**ต้องแสดง:**
- Enrollment Type: "เรียนสด" / "เรียนออนไลน์"
- Shipping Address (ถ้าเป็น online enrollment)

---

### 3. API Enhancements

#### 3.1 User Addresses API

**Endpoints ที่ต้องสร้าง:**
- `GET /api/admin/users/:userId/addresses` - ดึงที่อยู่ของผู้ใช้
- `POST /api/admin/users/:userId/addresses` - เพิ่มที่อยู่ใหม่
- `PUT /api/admin/users/:userId/addresses/:addressId` - แก้ไขที่อยู่
- `DELETE /api/admin/users/:userId/addresses/:addressId` - ลบที่อยู่
- `PATCH /api/admin/users/:userId/addresses/:addressId/set-default` - ตั้งเป็น default

**สำหรับ Student/Parent:**
- `GET /api/student/addresses` - ดึงที่อยู่ของตนเอง
- `POST /api/student/addresses` - เพิ่มที่อยู่
- `PUT /api/student/addresses/:id` - แก้ไขที่อยู่
- `DELETE /api/student/addresses/:id` - ลบที่อยู่

#### 3.2 Enrollment API Updates

**ต้องแก้ไข:**
- `POST /api/admin/enrollments` - รับ `enrollment_type` และ `shipping_address_id`
- `PUT /api/admin/enrollments/:id` - รองรับแก้ไข `enrollment_type` และ `shipping_address_id`
- `GET /api/admin/enrollments/:id` - return `enrollment_type` และ shipping address data

**Validation:**
- ถ้า `enrollment_type = 'online'` → ต้องมี `shipping_address_id`
- ถ้า `enrollment_type = 'onsite'` → ต้องมี `branch_id`

#### 3.3 Student Search API

**Endpoint สำหรับค้นหานักเรียน:**
- `GET /api/admin/users/search?q=ชื่อ&role=student`
- Return: `{ success: true, data: [{ id, first_name, last_name, username, email, ... }] }`
- Support pagination

---

### 4. Component Enhancements

#### 4.1 SearchableSelect Component (ใหม่)

สร้าง reusable component สำหรับ searchable select

```vue
<SearchableSelect
  v-model="selectedValue"
  :options="students"
  :loading="loading"
  :search-placeholder="'ค้นหานักเรียน...'"
  :display-field="(item) => `${item.first_name} ${item.last_name} (@${item.username})`"
  @search="handleSearch"
/>
```

#### 4.2 AddressForm Component (ใหม่)

Form สำหรับเพิ่ม/แก้ไขที่อยู่

**Fields:**
- recipient_name (ผู้รับ)
- phone (เบอร์โทร)
- address_line1 (ที่อยู่บรรทัด 1) *
- address_line2 (ที่อยู่บรรทัด 2)
- subdistrict (ตำบล/แขวง)
- district (อำเภอ/เขต)
- province (จังหวัด) *
- postal_code (รหัสไปรษณีย์) *
- is_default (ตั้งเป็นที่อยู่หลัก)

#### 4.3 AddressSelect Component (ใหม่)

Component สำหรับเลือกที่อยู่ (dropdown + add new)

```vue
<AddressSelect
  v-model="selectedAddressId"
  :user-id="studentId"
  @add-new="openAddressForm"
/>
```

---

## 📊 Database Migration Script

```sql
-- ============================================
-- ENROLLMENT ENHANCEMENT MIGRATION
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
ALTER TABLE enrollments
ADD COLUMN enrollment_type ENUM('onsite', 'online') DEFAULT 'onsite' AFTER branch_id,
ADD COLUMN shipping_address_id INT NULL AFTER enrollment_type,
ADD INDEX idx_enrollment_type (enrollment_type),
ADD INDEX idx_shipping_address (shipping_address_id);

-- Add foreign key (after column exists)
ALTER TABLE enrollments
ADD FOREIGN KEY (shipping_address_id) REFERENCES user_addresses(id) ON DELETE SET NULL;

-- 3. Add price fields to courses (if not exists)
-- Check if columns exist first
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS onsite_price DECIMAL(10, 2) NULL AFTER price,
ADD COLUMN IF NOT EXISTS online_price DECIMAL(10, 2) NULL AFTER onsite_price;
```

---

## 🎨 UI/UX Flow

### Flow การลงทะเบียนเรียนออนไลน์:

```
1. User เปิดหน้า Course Detail
   ↓
2. คลิกปุ่ม "สมัครเรียนออนไลน์"
   ↓
3. Check Authentication
   - ถ้าไม่ได้ login → Redirect to login
   - ถ้า login แล้ว → ต่อไป
   ↓
4. เปิด Enrollment Modal/Form
   - เลือกผู้เรียน (Searchable Select)
     * ถ้าเป็น Student: Auto-select ตัวเอง
     * ถ้าเป็น Parent: เลือกบุตรหลาน
   - เลือกที่อยู่จัดส่ง
     * เลือกจากรายการที่มี
     * หรือคลิก "เพิ่มที่อยู่ใหม่"
   ↓
5. ยืนยันข้อมูล
   - แสดงสรุป: คอร์ส, ราคา, ที่อยู่จัดส่ง
   ↓
6. สร้าง Enrollment
   - enrollment_type = 'online'
   - shipping_address_id = selected address
   ↓
7. Redirect to Payment (ถ้าจำเป็น)
   หรือแสดง "ลงทะเบียนสำเร็จ"
```

---

## ✅ Checklist

### Database
- [ ] สร้างตาราง `user_addresses`
- [ ] เพิ่ม `enrollment_type` ใน `enrollments`
- [ ] เพิ่ม `shipping_address_id` ใน `enrollments`
- [ ] เพิ่ม `onsite_price`, `online_price` ใน `courses` (ถ้ายังไม่มี)

### API Backend
- [ ] สร้าง User Addresses API (CRUD)
- [ ] แก้ไข Enrollment API (รองรับ enrollment_type และ shipping_address_id)
- [ ] สร้าง Student Search API
- [ ] Update validation logic

### Frontend Components
- [ ] สร้าง SearchableSelect component
- [ ] สร้าง AddressForm component
- [ ] สร้าง AddressSelect component
- [ ] แก้ไข EnrollmentModal (searchable student, enrollment type, address)
- [ ] แก้ไข Enrollment Edit page
- [ ] แก้ไข Enrollment Detail page

### Pages
- [ ] เพิ่มปุ่ม "สมัครเรียนออนไลน์" ในหน้า Course Detail
- [ ] สร้างหน้า Public Course Detail (ถ้ายังไม่มี)
- [ ] สร้างหน้า Student Addresses Management

---

## 🔍 Additional Considerations

### 1. Material Delivery Integration
- เมื่อสร้าง enrollment แบบ online → อาจต้องสร้าง record ใน `material_deliveries` อัตโนมัติ
- ใช้ shipping_address จาก enrollment

### 2. Pricing Logic
- ถ้ามี promotion → ต้องคำนวณราคาตาม enrollment_type
- online_price อาจถูกกว่า onsite_price

### 3. Branch Logic
- สำหรับ online enrollment:
  - `branch_id` อาจเป็น null หรือใช้เป็น branch ที่จัดการ
  - ไม่จำเป็นต้องมี branch_id

### 4. Validation Rules
- Online enrollment: ต้องมี shipping_address_id
- Onsite enrollment: ต้องมี branch_id
- Student must exist and be active
- Address must belong to the student (or parent's student)

---

*อัปเดตล่าสุด: 2025-01-20*

