# วิเคราะห์การจัดการหน้า Content Pages

## 📋 หน้าที่ต้องสร้าง
1. `/about` - เกี่ยวกับเรา
2. `/contact` - ติดต่อเรา
3. `/careers` - งาน/โอกาสการทำงาน
4. `/help` - ความช่วยเหลือ
5. `/support` - สนับสนุน/ช่วยเหลือ
6. `/auth/forgot-password` - ลืมรหัสผ่าน

---

## 🗄️ Database Schema

### ตาราง: `content_pages`
เก็บเนื้อหาของหน้า static pages

```sql
CREATE TABLE IF NOT EXISTS content_pages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) UNIQUE NOT NULL, -- เช่น 'about', 'contact', 'careers'
  title VARCHAR(300) NOT NULL,
  content TEXT, -- HTML content
  meta_title VARCHAR(300),
  meta_description TEXT,
  meta_keywords VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_by INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_slug (slug),
  INDEX idx_active (is_active),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 📝 หน้าต่างๆ

### 1. `/about` - เกี่ยวกับเรา
- แสดงประวัติ, วิสัยทัศน์, พันธกิจ
- สามารถแก้ไขผ่าน admin

### 2. `/contact` - ติดต่อเรา
- แสดงข้อมูลติดต่อ (ที่อยู่, เบอร์โทร, อีเมล์)
- อาจมีฟอร์มติดต่อ (optional)
- แก้ไขผ่าน admin

### 3. `/careers` - งาน/โอกาสการทำงาน
- แสดงตำแหน่งงานที่เปิดรับ
- สามารถเพิ่ม/แก้ไข/ลบตำแหน่งงานได้ (optional)
- หรือเป็น static content แบบเดียวกับ about

### 4. `/help` - ความช่วยเหลือ
- FAQ หรือคำถามที่พบบ่อย
- อาจเป็น static content หรือ dynamic FAQ

### 5. `/support` - สนับสนุน/ช่วยเหลือ
- ข้อมูลการสนับสนุน
- อาจเป็น static content

### 6. `/auth/forgot-password` - ลืมรหัสผ่าน
- หน้า form สำหรับลืมรหัสผ่าน
- ไม่ต้องใช้ content_pages (เป็น functional page)

---

## 🎨 UI Design

### Public Pages (Frontend)
- ใช้ layout: `default` หรือ `homepage`
- Responsive design
- Clean และ professional

### Admin Pages (Backend)
- ใช้ layout: `admin`
- Rich text editor สำหรับแก้ไข content
- Preview functionality

---

## 🔌 API Endpoints

### Content Pages
- `GET /api/content-pages` - ดึงรายการหน้า (สำหรับ admin)
- `GET /api/content-pages/[slug]` - ดึงหน้าเดียว (public)
- `POST /api/admin/content-pages` - สร้างหน้าใหม่
- `PUT /api/admin/content-pages/[id]` - แก้ไขหน้า
- `DELETE /api/admin/content-pages/[id]` - ลบหน้า

---

## 📱 Implementation Plan

### Phase 1: Database & API
1. สร้าง migration สำหรับ `content_pages`
2. สร้าง API endpoints

### Phase 2: Public Pages
1. สร้าง `/about`
2. สร้าง `/contact`
3. สร้าง `/careers`
4. สร้าง `/help`
5. สร้าง `/support`
6. สร้าง `/auth/forgot-password`

### Phase 3: Admin Management
1. สร้าง admin menu item
2. สร้างหน้า admin สำหรับจัดการ content pages
3. Rich text editor

---

## 🔐 Access Control

- **Public Pages**: ทุกคนเข้าถึงได้
- **Admin Management**: เฉพาะ system_admin, owner, admin

---

## 📌 Notes

- `/auth/forgot-password` เป็น functional page ไม่ต้องใช้ content management
- หน้า `/careers` อาจพัฒนาเป็น job listing ในอนาคต

