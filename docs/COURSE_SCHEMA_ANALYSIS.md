# 📊 Course Schema Analysis & Recommendations

**วันที่วิเคราะห์**: 2025-01-19  
**คอร์สตัวอย่าง**: "แฟชั่นไอส์แลนด์-คอร์สโควตาสุดท้าย-ป6สอบเข้า1-ป2569"

---

## 🔍 ข้อมูลจากคอร์สตัวอย่าง

จากหน้าเว็บที่วิเคราะห์:
- **ชื่อคอร์ส**: คอร์สโควตาสุดท้าย ป.6 สอบเข้า ม.1 ปี 2569
- **สาขา**: แฟชั่นไอส์แลนด์
- **ระดับชั้น**: ป.6 → ม.1 (Entrance Exam)
- **ปีการศึกษา**: 2569
- **รูปภาพ**: มีหลายรูป (gallery)
- **ประเภท**: คอร์สเตรียมสอบ (Entrance Exam)

---

## ⚠️ สิ่งที่ขาดหายไปใน Schema ปัจจุบัน

### 1. **Course Images/Media** ❌
**ปัญหา**: ไม่มี field สำหรับเก็บรูปภาพคอร์ส

**ข้อมูลที่ต้องการ**:
- Thumbnail image (รูปปก)
- Gallery images (หลายรูป)
- Cover image

**แนะนำ**: 
- เพิ่ม `thumbnail_url VARCHAR(500)` ในตาราง `courses`
- สร้างตาราง `course_images` สำหรับ gallery

### 2. **Grade Level** ❌
**ปัญหา**: `level` เป็น `beginner/intermediate/advanced` ซึ่งไม่เหมาะกับระบบโรงเรียน

**ข้อมูลที่ต้องการ**:
- ระดับชั้นต้นทาง (เช่น ป.6)
- ระดับชั้นปลายทาง (เช่น ม.1)
- ประเภทคอร์ส (เช่น Entrance Exam, Regular Course)

**แนะนำ**: 
- เพิ่ม `grade_from VARCHAR(20)` (เช่น 'ป.6', 'ม.1')
- เพิ่ม `grade_to VARCHAR(20)` (เช่น 'ม.1', 'ม.3')
- เพิ่ม `course_category ENUM('regular', 'entrance_exam', 'special', 'intensive')`

### 3. **Academic Year** ❌
**ปัญหา**: ไม่มี field สำหรับปีการศึกษา

**ข้อมูลที่ต้องการ**:
- ปีการศึกษา (เช่น 2569)
- เทอม (เช่น 1, 2, Summer)

**แนะนำ**: 
- เพิ่ม `academic_year INT` (เช่น 2569)
- เพิ่ม `semester ENUM('1', '2', 'summer', 'all') DEFAULT 'all'`

### 4. **Course Code/Slug** ❌
**ปัญหา**: ไม่มี field สำหรับ course code หรือ slug

**ข้อมูลที่ต้องการ**:
- Course code (เช่น COURSE-001)
- URL slug (เช่น 'course-quota-p6-m1-2569')

**แนะนำ**: 
- เพิ่ม `code VARCHAR(50) UNIQUE`
- เพิ่ม `slug VARCHAR(200) UNIQUE`

### 5. **Course Metadata** ❌
**ปัญหา**: ไม่มี field สำหรับข้อมูลเพิ่มเติม

**ข้อมูลที่ต้องการ**:
- Short description (คำอธิบายสั้น)
- Learning objectives
- Prerequisites
- Target audience

**แนะนำ**: 
- เพิ่ม `short_description VARCHAR(500)`
- เพิ่ม `objectives TEXT`
- เพิ่ม `prerequisites TEXT`
- เพิ่ม `target_audience TEXT`

### 6. **Course Rating/Reviews** ❌
**ปัญหา**: ไม่มี field สำหรับ rating และ reviews

**แนะนำ**: 
- สร้างตาราง `course_reviews` แยก (ถ้าต้องการ)

### 7. **Course Tags/Categories** ❌
**ปัญหา**: ไม่มี field สำหรับ tags หรือ categories

**แนะนำ**: 
- สร้างตาราง `course_tags` และ `tags` (many-to-many)

---

## 📝 SQL Migration Script

```sql
-- ============================================
-- COURSE SCHEMA ENHANCEMENTS
-- ============================================

-- 1. Add new columns to courses table
ALTER TABLE courses
  ADD COLUMN thumbnail_url VARCHAR(500) NULL AFTER description,
  ADD COLUMN code VARCHAR(50) UNIQUE NULL AFTER id,
  ADD COLUMN slug VARCHAR(200) UNIQUE NULL AFTER code,
  ADD COLUMN short_description VARCHAR(500) NULL AFTER description,
  ADD COLUMN grade_from VARCHAR(20) NULL AFTER level,
  ADD COLUMN grade_to VARCHAR(20) NULL AFTER grade_from,
  ADD COLUMN course_category ENUM('regular', 'entrance_exam', 'special', 'intensive') DEFAULT 'regular' AFTER grade_to,
  ADD COLUMN academic_year INT NULL AFTER course_category,
  ADD COLUMN semester ENUM('1', '2', 'summer', 'all') DEFAULT 'all' AFTER academic_year,
  ADD COLUMN objectives TEXT NULL AFTER description,
  ADD COLUMN prerequisites TEXT NULL AFTER objectives,
  ADD COLUMN target_audience TEXT NULL AFTER prerequisites,
  ADD INDEX idx_code (code),
  ADD INDEX idx_slug (slug),
  ADD INDEX idx_grade_from (grade_from),
  ADD INDEX idx_grade_to (grade_to),
  ADD INDEX idx_academic_year (academic_year),
  ADD INDEX idx_course_category (course_category);

-- 2. Create course_images table for gallery
CREATE TABLE IF NOT EXISTS course_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('thumbnail', 'cover', 'gallery') DEFAULT 'gallery',
    display_order INT DEFAULT 0,
    alt_text VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course_type (course_id, image_type),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create tags table
CREATE TABLE IF NOT EXISTS tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create course_tags table (many-to-many)
CREATE TABLE IF NOT EXISTS course_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_course_tag (course_id, tag_id),
    INDEX idx_course (course_id),
    INDEX idx_tag (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Create course_reviews table (optional)
CREATE TABLE IF NOT EXISTS course_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    user_id INT NOT NULL,
    enrollment_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE SET NULL,
    UNIQUE KEY unique_course_user_review (course_id, user_id),
    INDEX idx_course_rating (course_id, rating),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Add average_rating to courses (calculated field)
ALTER TABLE courses
  ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0.00 AFTER price,
  ADD COLUMN review_count INT DEFAULT 0 AFTER average_rating,
  ADD INDEX idx_rating (average_rating);
```

---

## 🎯 Priority Recommendations

### **Priority 1: Critical (ต้องเพิ่ม)**
1. ✅ **thumbnail_url** - สำหรับแสดงรูปปกคอร์ส
2. ✅ **grade_from, grade_to** - สำหรับระบุระดับชั้น
3. ✅ **academic_year** - สำหรับระบุปีการศึกษา
4. ✅ **course_category** - สำหรับแยกประเภทคอร์ส

### **Priority 2: Important (ควรเพิ่ม)**
1. ✅ **code, slug** - สำหรับ URL และการอ้างอิง
2. ✅ **short_description** - สำหรับแสดงใน listing
3. ✅ **course_images** table - สำหรับ gallery

### **Priority 3: Nice to Have (เพิ่มได้ภายหลัง)**
1. ✅ **objectives, prerequisites, target_audience** - ข้อมูลเพิ่มเติม
2. ✅ **course_tags** - สำหรับ tagging
3. ✅ **course_reviews** - สำหรับ rating และ reviews

---

## 📋 Example Data Structure

### Course Example:
```json
{
  "id": 1,
  "code": "ENT-P6-M1-2569",
  "slug": "course-quota-p6-m1-2569",
  "title": "คอร์สโควตาสุดท้าย ป.6 สอบเข้า ม.1 ปี 2569",
  "short_description": "เตรียมสอบเข้า ม.1 สำหรับนักเรียนชั้น ป.6",
  "description": "คอร์สเตรียมสอบเข้า ม.1...",
  "thumbnail_url": "/images/courses/quota-p6-m1-2569-thumb.jpg",
  "type": "hybrid",
  "price": 15000,
  "duration_hours": 120,
  "level": "intermediate",
  "grade_from": "ป.6",
  "grade_to": "ม.1",
  "course_category": "entrance_exam",
  "academic_year": 2569,
  "semester": "all",
  "objectives": "1. เตรียมความพร้อมสอบเข้า ม.1...",
  "prerequisites": "นักเรียนชั้น ป.6",
  "target_audience": "นักเรียนชั้น ป.6 ที่ต้องการสอบเข้า ม.1",
  "status": "published"
}
```

---

## ✅ สรุป

**Schema ปัจจุบัน**: ❌ **ไม่เพียงพอ** สำหรับระบบโรงเรียน

**ต้องเพิ่ม**:
- ✅ Image fields (thumbnail, gallery)
- ✅ Grade level fields (grade_from, grade_to)
- ✅ Academic year field
- ✅ Course category field
- ✅ Code/Slug fields

**แนะนำ**: รัน migration script ด้านบนเพื่อเพิ่ม fields ที่จำเป็น

---

*อัปเดตล่าสุด: 2025-01-19*

