# 📊 Course Schema Enhanced Analysis

**วันที่วิเคราะห์**: 2025-01-19  
**คอร์สตัวอย่าง**: "คอร์สโค้งสุดท้าย ป.6 สอบเข้า ม.1 ปี 2569"

---

## 🔍 ข้อมูลจากภาพโฆษณา

### ข้อมูลหลัก:
- **ชื่อคอร์ส**: คอร์สโค้งสุดท้าย ป.6 สอบเข้า ม.1
- **สาขา**: แฟชั่นไอส์แลนด์
- **ระดับชั้น**: ป.6 → ม.1 (Entrance Exam)
- **ปีการศึกษา**: 2569
- **วันที่สอบจริง**: 28 มี.ค. 69

### ราคา:
- **Onsite**: 5,500 บาท
- **Online**: 4,000 บาท

### สิ่งที่ได้รับ:
**Onsite:**
- ตำรา 5 เล่ม
- กระเป๋า
- วิดีโอย้อนหลัง

**Online:**
- ตำรา 5 เล่ม
- วิดีโอย้อนหลัง
- ส่งตำราฟรีถึงบ้าน

### รอบเรียน:
- **Round 1**: เสาร์ 21, 28 ก.พ. 69 และ 7, 14, 21, 22 มี.ค. 69 (เวลา 08.30-16.15)
- **Round 2**: จันทร์-พุธ-ศุกร์ 16-18-20-23-25-27 มี.ค. 69 (เวลา 08.30-16.15)

### เนื้อหา:
- ติวเข้ม 5 วิชาหลัก: คณิต, วิทย์, อังกฤษ, ไทย, สังคม
- ติว 42 ชั่วโมงเต็ม
- มีให้เลือก 2 รอบเรียน

---

## ⚠️ สิ่งที่ต้องเพิ่มใน Schema

### 1. **Grade Levels (ระดับชั้น)** ⭐ CRITICAL
**ปัญหา**: ต้องรองรับการเลือกหลายระดับชั้น (ประถม 1-6, มัธยม 1-6)

**โครงสร้างที่แนะนำ**:
- สร้างตาราง `grade_levels` (master data)
- สร้างตาราง `course_grade_levels` (many-to-many)

**Grade Levels**:
- ประถมศึกษาปีที่ 1-6 (ป.1 - ป.6)
- มัธยมศึกษาปีที่ 1-6 (ม.1 - ม.6)

### 2. **Pricing (ราคา)** ⭐ CRITICAL
**ปัญหา**: มี 2 ราคา (Onsite และ Online)

**โครงสร้างที่แนะนำ**:
- เพิ่ม `onsite_price DECIMAL(10, 2)` ในตาราง `courses`
- เพิ่ม `online_price DECIMAL(10, 2)` ในตาราง `courses`
- หรือสร้างตาราง `course_pricing` แยก (ถ้าต้องการยืดหยุ่นมากขึ้น)

### 3. **Course Benefits/Inclusions (สิ่งที่ได้รับ)** ⭐ CRITICAL
**ปัญหา**: ต้องเก็บข้อมูลสิ่งที่ได้รับ (ตำรา, กระเป๋า, วิดีโอย้อนหลัง)

**โครงสร้างที่แนะนำ**:
- สร้างตาราง `course_inclusions` (many-to-many)
- สร้างตาราง `inclusions` (master data: ตำรา, กระเป๋า, วิดีโอย้อนหลัง, ส่งตำราฟรี)

### 4. **Course Rounds/Batches (รอบเรียน)** ⭐ CRITICAL
**ปัญหา**: คอร์สเดียวมีหลายรอบ (Round 1, Round 2)

**โครงสร้างที่แนะนำ**:
- สร้างตาราง `course_rounds` หรือ `course_batches`
- แต่ละรอบมี: ชื่อรอบ, วันที่เรียน, เวลา, ราคา (อาจแตกต่างกัน)

### 5. **Exam Date (วันที่สอบ)** ⭐ IMPORTANT
**ปัญหา**: ต้องเก็บวันที่สอบจริง

**แนะนำ**: เพิ่ม `exam_date DATETIME` ในตาราง `courses`

### 6. **Subjects (วิชา)** ⭐ IMPORTANT
**ปัญหา**: ต้องระบุว่าคอร์สมีวิชาอะไรบ้าง

**โครงสร้างที่แนะนำ**:
- สร้างตาราง `subjects` (master data)
- สร้างตาราง `course_subjects` (many-to-many)

---

## 📝 Enhanced SQL Schema

```sql
-- ============================================
-- GRADE LEVELS MODULE
-- ============================================

CREATE TABLE IF NOT EXISTS grade_levels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    level_type ENUM('elementary', 'secondary') NOT NULL,
    grade_number INT NOT NULL,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_type_grade (level_type, grade_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert grade levels
INSERT INTO grade_levels (code, name, level_type, grade_number, display_order) VALUES
('P1', 'ประถมศึกษาปีที่ 1', 'elementary', 1, 1),
('P2', 'ประถมศึกษาปีที่ 2', 'elementary', 2, 2),
('P3', 'ประถมศึกษาปีที่ 3', 'elementary', 3, 3),
('P4', 'ประถมศึกษาปีที่ 4', 'elementary', 4, 4),
('P5', 'ประถมศึกษาปีที่ 5', 'elementary', 5, 5),
('P6', 'ประถมศึกษาปีที่ 6', 'elementary', 6, 6),
('M1', 'มัธยมศึกษาปีที่ 1', 'secondary', 1, 7),
('M2', 'มัธยมศึกษาปีที่ 2', 'secondary', 2, 8),
('M3', 'มัธยมศึกษาปีที่ 3', 'secondary', 3, 9),
('M4', 'มัธยมศึกษาปีที่ 4', 'secondary', 4, 10),
('M5', 'มัธยมศึกษาปีที่ 5', 'secondary', 5, 11),
('M6', 'มัธยมศึกษาปีที่ 6', 'secondary', 6, 12);

CREATE TABLE IF NOT EXISTS course_grade_levels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    grade_level_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (grade_level_id) REFERENCES grade_levels(id) ON DELETE CASCADE,
    UNIQUE KEY unique_course_grade (course_id, grade_level_id),
    INDEX idx_course (course_id),
    INDEX idx_grade (grade_level_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PRICING ENHANCEMENT
-- ============================================

-- Add pricing columns to courses table
ALTER TABLE courses
  ADD COLUMN onsite_price DECIMAL(10, 2) NULL AFTER price,
  ADD COLUMN online_price DECIMAL(10, 2) NULL AFTER onsite_price,
  ADD COLUMN exam_date DATETIME NULL AFTER academic_year;

-- ============================================
-- INCLUSIONS MODULE (สิ่งที่ได้รับ)
-- ============================================

CREATE TABLE IF NOT EXISTS inclusions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert common inclusions
INSERT INTO inclusions (code, name, description) VALUES
('TEXTBOOK', 'ตำรา', 'ตำราหรือเอกสารประกอบการเรียน'),
('BAG', 'กระเป๋า', 'กระเป๋าใส่หนังสือ'),
('VIDEO_REPLAY', 'วิดีโอย้อนหลัง', 'วิดีโอย้อนหลังสำหรับทบทวน'),
('FREE_DELIVERY', 'ส่งตำราฟรีถึงบ้าน', 'บริการส่งตำราฟรีถึงบ้าน'),
('MATERIALS', 'เอกสารประกอบ', 'เอกสารประกอบการเรียน');

CREATE TABLE IF NOT EXISTS course_inclusions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    inclusion_id INT NOT NULL,
    enrollment_type ENUM('onsite', 'online', 'both') DEFAULT 'both',
    quantity INT DEFAULT 1,
    description VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (inclusion_id) REFERENCES inclusions(id) ON DELETE CASCADE,
    INDEX idx_course (course_id),
    INDEX idx_inclusion (inclusion_id),
    INDEX idx_enrollment_type (enrollment_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- COURSE ROUNDS/BATCHES MODULE
-- ============================================

CREATE TABLE IF NOT EXISTS course_rounds (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    round_number INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    schedule_days VARCHAR(100), -- เช่น "เสาร์", "จันทร์-พุธ-ศุกร์"
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    onsite_price DECIMAL(10, 2),
    online_price DECIMAL(10, 2),
    seat_limit INT,
    current_enrollments INT DEFAULT 0,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_course_round (course_id, round_number),
    INDEX idx_course (course_id),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS course_round_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    round_id INT NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    session_number INT,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    FOREIGN KEY (round_id) REFERENCES course_rounds(id) ON DELETE CASCADE,
    INDEX idx_round_date (round_id, session_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SUBJECTS MODULE
-- ============================================

CREATE TABLE IF NOT EXISTS subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    short_name VARCHAR(50),
    description TEXT,
    icon VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert common subjects
INSERT INTO subjects (code, name, short_name) VALUES
('MATH', 'คณิตศาสตร์', 'คณิต'),
('SCIENCE', 'วิทยาศาสตร์', 'วิทย์'),
('ENGLISH', 'ภาษาอังกฤษ', 'อังกฤษ'),
('THAI', 'ภาษาไทย', 'ไทย'),
('SOCIAL', 'สังคมศึกษา', 'สังคม'),
('PHYSICS', 'ฟิสิกส์', 'ฟิสิกส์'),
('CHEMISTRY', 'เคมี', 'เคมี'),
('BIOLOGY', 'ชีววิทยา', 'ชีวะ');

CREATE TABLE IF NOT EXISTS course_subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    subject_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_course_subject (course_id, subject_id),
    INDEX idx_course (course_id),
    INDEX idx_subject (subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 🎯 Priority Summary

### **Priority 1: Critical (ต้องเพิ่มทันที)**
1. ✅ **Grade Levels** - ตาราง `grade_levels` และ `course_grade_levels`
2. ✅ **Pricing** - `onsite_price`, `online_price`
3. ✅ **Inclusions** - ตาราง `inclusions` และ `course_inclusions`
4. ✅ **Course Rounds** - ตาราง `course_rounds` และ `course_round_schedules`

### **Priority 2: Important**
1. ✅ **Subjects** - ตาราง `subjects` และ `course_subjects`
2. ✅ **Exam Date** - `exam_date` field

---

## 📋 Example Data Structure

### Course Example:
```json
{
  "id": 1,
  "code": "ENT-P6-M1-2569",
  "title": "คอร์สโค้งสุดท้าย ป.6 สอบเข้า ม.1 ปี 2569",
  "onsite_price": 5500,
  "online_price": 4000,
  "exam_date": "2026-03-28",
  "academic_year": 2569,
  "grade_levels": ["P6", "M1"],
  "subjects": ["MATH", "SCIENCE", "ENGLISH", "THAI", "SOCIAL"],
  "rounds": [
    {
      "round_number": 1,
      "name": "รอบ 1",
      "schedule_days": "เสาร์",
      "onsite_price": 5500,
      "online_price": 4000
    },
    {
      "round_number": 2,
      "name": "รอบ 2",
      "schedule_days": "จันทร์-พุธ-ศุกร์",
      "onsite_price": 5500,
      "online_price": 4000
    }
  ],
  "inclusions": {
    "onsite": ["TEXTBOOK", "BAG", "VIDEO_REPLAY"],
    "online": ["TEXTBOOK", "VIDEO_REPLAY", "FREE_DELIVERY"]
  }
}
```

---

## ✅ สรุป

**Schema ปัจจุบัน**: ❌ **ไม่เพียงพอ** สำหรับระบบโรงเรียนไทย

**ต้องเพิ่ม**:
1. ✅ Grade Levels (ประถม 1-6, มัธยม 1-6) - many-to-many
2. ✅ Pricing (Onsite/Online) - 2 ราคา
3. ✅ Inclusions (สิ่งที่ได้รับ) - many-to-many
4. ✅ Course Rounds (รอบเรียน) - หลายรอบต่อคอร์ส
5. ✅ Subjects (วิชา) - many-to-many
6. ✅ Exam Date - วันที่สอบ

**Migration Script**: `scripts/migrate-course-schema-enhanced.ts`

---

*อัปเดตล่าสุด: 2025-01-19*

