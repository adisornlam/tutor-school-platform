# วิเคราะห์ประเภทการบันทึกในปฏิทิน (Calendar Entry Types)

## 📋 สรุป
แบ่งการบันทึกในปฏิทินออกเป็น 3 ประเภท ตาม Google Calendar:
1. **กิจกรรม (Event)** - เหตุการณ์ที่มีวันเวลาและระยะเวลา เช่น ประชุม, วันหยุด, ประกาศ
2. **งาน (Task)** - งานที่ต้องทำ อาจมีวันครบกำหนด แต่ไม่มีเวลาเฉพาะ เช่น To-do list
3. **กำหนดเวลาการนัดหมาย (Appointment/Schedule)** - การนัดหมายที่มีเวลาเฉพาะ เช่น นัดหมายนักเรียน, นัดหมายประชุม

---

## 🎯 1. กิจกรรม (Event)

### ลักษณะ
- มี **วันเวลาเริ่มต้น** และ**วันเวลาสิ้นสุด** ที่ชัดเจน
- มี**ระยะเวลา** (duration)
- สามารถเป็น **All-day event** ได้
- มี**สถานที่** (location)
- มี**คำอธิบาย** (description)
- มี**สี** (color)
- มี**แจ้งเตือน** (reminder)
- สามารถ**แชร์** (share) ได้

### ตัวอย่าง
- ประชุมทีม
- วันหยุด
- ประกาศ
- ปาร์ตี้
- งานเลี้ยง

### Database Schema
ใช้ตาราง `calendar_events` ที่มีอยู่แล้ว

---

## ✅ 2. งาน (Task)

### ลักษณะ
- มี**วันครบกำหนด** (due date) แต่**ไม่มีเวลาเฉพาะ** (หรือเป็น all-day)
- อาจมี**ลำดับความสำคัญ** (priority)
- มี**สถานะ** (status): ยังไม่เริ่ม, กำลังทำ, เสร็จสิ้น, ยกเลิก
- อาจมี**วันที่เริ่มต้น** (start date)
- มี**คำอธิบาย** (description)
- อาจมี**เช็กลิสต์** (checklist) หรือ**รายการย่อย**
- มี**สี** (color) ตาม priority หรือ category
- สามารถ**แชร์**ได้ (optional)

### ตัวอย่าง
- จัดทำรายงาน
- ตรวจสอบงานนักเรียน
- เตรียมเอกสาร
- ตอบอีเมล์

### Database Schema (ใหม่)
```sql
CREATE TABLE calendar_tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(300) NOT NULL,
  description TEXT,
  due_date DATE,
  start_date DATE,
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  status ENUM('not_started', 'in_progress', 'completed', 'cancelled') DEFAULT 'not_started',
  color VARCHAR(7) DEFAULT '#10B981',
  is_shared BOOLEAN DEFAULT FALSE,
  shared_scope ENUM('private', 'tutors', 'students', 'parents', 'admins', 'branch_admins', 'public') DEFAULT 'private',
  shared_branch_id INT NULL,
  category VARCHAR(100),
  completed_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shared_branch_id) REFERENCES branches(id) ON DELETE SET NULL,
  INDEX idx_user_due_date (user_id, due_date),
  INDEX idx_status (status),
  INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE calendar_task_shared_with (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_id INT NOT NULL,
  shared_with_user_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES calendar_tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_task_user (task_id, shared_with_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 📅 3. กำหนดเวลาการนัดหมาย (Appointment/Schedule)

### ลักษณะ
- มี**วันเวลาเริ่มต้น** และ**วันเวลาสิ้นสุด** ที่ชัดเจน
- มี**ประเภท** (type): นัดหมายนักเรียน, นัดหมายประชุม, นัดหมายผู้ปกครอง, อื่นๆ
- มี**ผู้เข้าร่วม** (participants) - อาจเป็นนักเรียน, ผู้ปกครอง, ครูคนอื่น
- มี**สถานที่** (location)
- มี**คำอธิบาย** (description)
- มี**สถานะ** (status): จองแล้ว, ยืนยันแล้ว, ยกเลิก, เสร็จสิ้น
- มี**ลิงก์** (link) เช่น Zoom, Google Meet
- มี**การแจ้งเตือน** (reminder)

### ตัวอย่าง
- นัดหมายนักเรียน
- นัดหมายประชุม
- นัดหมายผู้ปกครอง
- นัดหมายเจ้าหน้าที่

### Database Schema (ใหม่)
```sql
CREATE TABLE calendar_appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL, -- ผู้สร้าง
  title VARCHAR(300) NOT NULL,
  description TEXT,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  appointment_type ENUM('student', 'meeting', 'parent', 'staff', 'other') DEFAULT 'student',
  location VARCHAR(500),
  meeting_link VARCHAR(500),
  status ENUM('scheduled', 'confirmed', 'cancelled', 'completed') DEFAULT 'scheduled',
  color VARCHAR(7) DEFAULT '#3B82F6',
  reminder_minutes INT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_datetime (user_id, start_datetime),
  INDEX idx_status (status),
  INDEX idx_type (appointment_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE calendar_appointment_participants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  appointment_id INT NOT NULL,
  user_id INT NOT NULL, -- ผู้เข้าร่วม (นักเรียน, ผู้ปกครอง, ครู)
  participant_type ENUM('student', 'parent', 'tutor', 'admin', 'other') NOT NULL,
  status ENUM('pending', 'accepted', 'declined', 'maybe') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES calendar_appointments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_appointment_user (appointment_id, user_id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 🔄 ความแตกต่างระหว่าง 3 ประเภท

| คุณสมบัติ | Event | Task | Appointment |
|---------|-------|------|-------------|
| วันเวลาเริ่มต้น | ✅ | ✅ (optional) | ✅ |
| วันเวลาสิ้นสุด | ✅ | ❌ | ✅ |
| เวลาเฉพาะ | ✅ | ❌ | ✅ |
| All-day | ✅ | ✅ (default) | ❌ |
| ผู้เข้าร่วม | ❌ | ❌ | ✅ |
| สถานะ (Status) | ❌ | ✅ | ✅ |
| ลำดับความสำคัญ | ❌ | ✅ | ❌ |
| วันครบกำหนด | ❌ | ✅ | ❌ |
| สถานที่ | ✅ | ❌ | ✅ |
| ลิงก์ประชุม | ❌ | ❌ | ✅ |

---

## 🎨 UI/UX Design

### 1. ปุ่มสร้าง (Create Button)
- ปุ่ม "สร้าง" (Create) พร้อม dropdown icon
- เมื่อคลิก แสดง dropdown menu:
  - กิจกรรม (Event)
  - งาน (Task)
  - กำหนดเวลาการนัดหมาย (Appointment)

### 2. การแสดงผลในปฏิทิน
- **Event**: แสดงเป็นบล็อกสีตาม color ที่กำหนด
- **Task**: แสดงเป็น bullet point หรือ checkbox ตามด้วยชื่อ
- **Appointment**: แสดงเป็นบล็อกสีต่างจาก Event (เช่น สีฟ้า)

### 3. เมนูจัดการวันที่ (Date Menu)
- เมื่อ hover บนวันที่ แสดงจุด 3 จุด (⋯)
- เมื่อคลิก แสดงเมนู:
  - สร้างกิจกรรม
  - สร้างงาน
  - สร้างการนัดหมาย
  - ดูรายการทั้งหมด

---

## 📝 API Endpoints

### Events (มีอยู่แล้ว)
- `GET /api/calendar/events`
- `POST /api/calendar/events`
- `GET /api/calendar/events/[id]`
- `PUT /api/calendar/events/[id]`
- `DELETE /api/calendar/events/[id]`

### Tasks (ใหม่)
- `GET /api/calendar/tasks`
- `POST /api/calendar/tasks`
- `GET /api/calendar/tasks/[id]`
- `PUT /api/calendar/tasks/[id]`
- `DELETE /api/calendar/tasks/[id]`

### Appointments (ใหม่)
- `GET /api/calendar/appointments`
- `POST /api/calendar/appointments`
- `GET /api/calendar/appointments/[id]`
- `PUT /api/calendar/appointments/[id]`
- `DELETE /api/calendar/appointments/[id]`

---

## 🚀 Implementation Plan

### Phase 1: Database Schema
1. สร้าง migration สำหรับ `calendar_tasks`
2. สร้าง migration สำหรับ `calendar_appointments`
3. สร้าง migration สำหรับ `calendar_appointment_participants`

### Phase 2: API Endpoints
1. สร้าง API endpoints สำหรับ Tasks
2. สร้าง API endpoints สำหรับ Appointments

### Phase 3: UI Components
1. สร้าง TaskModal component
2. สร้าง AppointmentModal component
3. ปรับปรุง Create Button ให้มี dropdown menu
4. เพิ่ม Date Menu (จุด 3 จุด) ในปฏิทิน

### Phase 4: Integration
1. แสดง Tasks และ Appointments ในปฏิทิน
2. รวม Events, Tasks, และ Appointments ในหน้า schedule
3. เพิ่ม filtering และ sorting

---

## 📌 หมายเหตุ
- Tasks อาจไม่มี due_date (แบบ backlog)
- Appointments อาจไม่มี participants (personal appointment)
- ทั้ง 3 ประเภทสามารถใช้ color coding ได้
- การแชร์ (sharing) ทำงานคล้ายกันทั้ง 3 ประเภท

