# 📅 Calendar Events System Analysis (Universal)

## 🎯 ภาพรวม

ระบบปฏิทินและ Events สำหรับทุก Role ในระบบ (System Admin, Owner, Admin, Branch Admin, Tutor, Student, Parent)

---

## 📊 Database Schema

### ตาราง: `calendar_events` (ชื่อกลางๆ สำหรับทุก role)

```sql
CREATE TABLE IF NOT EXISTS calendar_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL, -- ผู้สร้าง event (ไม่ใช่ tutor_id แล้ว)
    title VARCHAR(300) NOT NULL,
    description TEXT,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME NOT NULL,
    location VARCHAR(500),
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color code
    is_all_day BOOLEAN DEFAULT FALSE,
    reminder_minutes INT DEFAULT NULL, -- 15, 30, 60, 1440 (1 วัน), etc.
    is_shared BOOLEAN DEFAULT FALSE,
    shared_scope ENUM('private', 'tutors', 'students', 'parents', 'admins', 'branch_admins', 'branch_students', 'branch_parents', 'public') DEFAULT 'private',
    shared_branch_id INT NULL, -- ถ้าแชร์แค่ branch ใด branch หนึ่ง
    event_type ENUM('personal', 'meeting', 'holiday', 'announcement', 'other') DEFAULT 'personal',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    INDEX idx_user_datetime (user_id, start_datetime),
    INDEX idx_shared_scope (is_shared, shared_scope, shared_branch_id),
    INDEX idx_datetime (start_datetime),
    INDEX idx_event_type (event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### ตาราง: `calendar_event_shared_with` (สำหรับแชร์แบบระบุคน)

```sql
CREATE TABLE IF NOT EXISTS calendar_event_shared_with (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    shared_with_user_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES calendar_events(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_user (event_id, shared_with_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 👥 Role-Based Features

### 1. **System Admin / Owner / Admin (กลาง)**
- ✅ สร้าง Event ได้
- ✅ แชร์ Event ให้:
  - ทุกคน (Public)
  - Admins (System Admin, Owner, Admin)
  - Branch Admins
  - Tutors
  - Students
  - Parents
  - Branch ใด Branch หนึ่ง (Students/Parents/Tutors ในสาขานั้น)
- ✅ ดู Events ทั้งหมดได้ (ถ้าต้องการ)
- ✅ Event Type: personal, meeting, announcement, holiday, other

### 2. **Branch Admin**
- ✅ สร้าง Event ได้
- ✅ แชร์ Event ให้:
  - ทุกคน (Public)
  - Branch Admins (เฉพาะสาขาของตัวเอง หรือทุกสาขา)
  - Tutors (เฉพาะสาขาของตัวเอง)
  - Students (เฉพาะสาขาของตัวเอง)
  - Parents (เฉพาะสาขาของตัวเอง)
  - Branch ใด Branch หนึ่ง (ถ้ามีสิทธิ์จัดการหลายสาขา)
- ✅ ดู Events ที่เกี่ยวข้องกับสาขาของตัวเอง
- ✅ Event Type: personal, meeting, announcement, other

### 3. **Tutor**
- ✅ สร้าง Event ได้
- ✅ แชร์ Event ให้:
  - Tutors (ครูทุกคน หรือเฉพาะสาขาที่สอน)
  - Admins
  - Branch Admins (สาขาที่สอน)
  - Students (เฉพาะนักเรียนที่สอน)
  - Parents (เฉพาะผู้ปกครองของนักเรียนที่สอน)
- ✅ ดู Events ส่วนตัว + Events ที่แชร์มา
- ✅ Event Type: personal, meeting, other

### 4. **Student**
- ✅ สร้าง Event ได้
- ✅ แชร์ Event ให้:
  - Parents (ผู้ปกครองของตัวเอง)
  - Tutors (ครูที่สอน)
  - Branch Admins (สาขาที่เรียน)
- ✅ ดู Events ส่วนตัว + Events ที่ครู/โรงเรียนแชร์มา
- ✅ Event Type: personal, other

### 5. **Parent**
- ✅ สร้าง Event ได้
- ✅ แชร์ Event ให้:
  - Students (บุตรหลาน)
  - Tutors (ครูที่สอนบุตรหลาน)
  - Branch Admins (สาขาที่บุตรหลานเรียน)
- ✅ ดู Events ส่วนตัว + Events ที่ครู/โรงเรียนแชร์มา
- ✅ Event Type: personal, other

---

## 🎨 Features ที่ควรมี (Universal)

### 1. **สร้าง Event**
- ✅ ชื่อ Event (title) - **required**
- ✅ คำอธิบาย (description) - optional
- ✅ วันเวลาเริ่มต้น (start_datetime) - **required**
- ✅ วันเวลาสิ้นสุด (end_datetime) - **required**
- ✅ ทั้งวัน (all day event) - checkbox
- ✅ สถานที่ (location) - optional
- ✅ สี Event (color picker) - default blue
- ✅ ประเภท Event (event_type) - dropdown
  - Personal (ส่วนตัว)
  - Meeting (ประชุม)
  - Holiday (วันหยุด)
  - Announcement (ประกาศ) - สำหรับ Admin/Branch Admin
  - Other (อื่นๆ)
- ✅ ตั้งเตือน (reminder) - dropdown
  - ไม่มี
  - 15 นาทีก่อน
  - 30 นาทีก่อน
  - 1 ชั่วโมงก่อน
  - 1 วันก่อน
  - 2 วันก่อน
- ✅ แชร์ Event (checkbox)
  - ถ้าเลือกแชร์ → แสดงตัวเลือกการแชร์ตาม role

### 2. **ตัวเลือกการแชร์ (Share Options) - ตาม Role**

#### สำหรับ System Admin / Owner / Admin:
```
☑ แชร์ Event

แชร์ให้:
○ ทุกคน (Public)
○ ผู้ดูแลระบบ (Admins)
○ ผู้ดูแลสาขา (Branch Admins)
  └─ [ทุกสาขา / เลือกสาขาเฉพาะ: ______]
○ ครูทุกคน (Tutors)
  └─ [ทุกสาขา / เลือกสาขาเฉพาะ: ______]
○ นักเรียน (Students)
  └─ [ทุกสาขา / เลือกสาขาเฉพาะ: ______]
○ ผู้ปกครอง (Parents)
  └─ [ทุกสาขา / เลือกสาขาเฉพาะ: ______]
○ ระบุคนเฉพาะ (Advanced)
```

#### สำหรับ Branch Admin:
```
☑ แชร์ Event

แชร์ให้:
○ ทุกคน (Public)
○ ผู้ดูแลสาขา (Branch Admins)
○ ครู (Tutors)
  └─ [สาขาของฉัน / สาขาอื่น: ______]
○ นักเรียน (Students)
  └─ [สาขาของฉัน / สาขาอื่น: ______]
○ ผู้ปกครอง (Parents)
  └─ [สาขาของฉัน / สาขาอื่น: ______]
○ ระบุคนเฉพาะ (Advanced)
```

#### สำหรับ Tutor:
```
☑ แชร์ Event

แชร์ให้:
○ ครูทุกคน (Tutors)
  └─ [ทุกสาขา / สาขาที่ฉันสอน: ______]
○ ผู้ดูแลระบบ (Admins)
○ ผู้ดูแลสาขา (Branch Admins)
○ นักเรียนที่ฉันสอน (Students)
○ ผู้ปกครองของนักเรียนที่ฉันสอน (Parents)
○ ระบุคนเฉพาะ (Advanced)
```

#### สำหรับ Student:
```
☑ แชร์ Event

แชร์ให้:
○ ผู้ปกครองของฉัน (Parents)
○ ครูที่สอนฉัน (Tutors)
○ ผู้ดูแลสาขา (Branch Admins)
○ ระบุคนเฉพาะ (Advanced)
```

#### สำหรับ Parent:
```
☑ แชร์ Event

แชร์ให้:
○ บุตรหลาน (Students)
○ ครูที่สอนบุตรหลาน (Tutors)
○ ผู้ดูแลสาขา (Branch Admins)
○ ระบุคนเฉพาะ (Advanced)
```

### 3. **แก้ไข Event**
- แก้ไขข้อมูลทั้งหมดได้
- เปลี่ยนสถานะการแชร์ได้
- เจ้าของ event เท่านั้นที่แก้ไขได้

### 4. **ลบ Event**
- ลบได้เฉพาะ event ที่ตัวเองสร้าง
- ถ้ามีการแชร์ → คนอื่นจะไม่เห็น event นี้แล้ว

### 5. **ดู Event ในปฏิทิน**
- แสดง event ส่วนตัวด้วยสีที่กำหนด
- แสดง event ที่แชร์มาแยกสี (เช่น สีเทา)
- แสดง course schedules (ถ้าเป็น Tutor/Student) แยกสีอีกสีหนึ่ง
- แสดง enrollments/classes (ถ้าเป็น Student/Parent) แยกสีอีกสีหนึ่ง

---

## 🔌 API Endpoints

### Base Path: `/api/calendar/events`

### GET `/api/calendar/events`
**Description**: ดึง events ของผู้ใช้ (รวมทั้งที่แชร์มา)

**Access**: ทุก role ที่ login แล้ว

**Query Params**:
- `start_date`: วันที่เริ่มต้น (filter)
- `end_date`: วันที่สิ้นสุด (filter)
- `include_shared`: boolean (default: true) - รวม events ที่แชร์มา
- `event_type`: filter by type
- `branch_id`: filter by branch (ถ้าเป็น branch-specific)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 10,
      "title": "ประชุมทีม",
      "description": "ประชุมวางแผนการสอน",
      "start_datetime": "2025-01-25T10:00:00",
      "end_datetime": "2025-01-25T11:00:00",
      "location": "ห้องประชุม",
      "color": "#10B981",
      "is_all_day": false,
      "reminder_minutes": 15,
      "event_type": "meeting",
      "is_shared": true,
      "shared_scope": "tutors",
      "shared_branch_id": null,
      "is_mine": true,
      "created_by": {
        "id": 10,
        "first_name": "สมชาย",
        "last_name": "ใจดี",
        "role": "tutor"
      }
    },
    {
      "id": 2,
      "user_id": 5,
      "title": "วันหยุดราชการ",
      "description": "วันหยุดตามประกาศ",
      "start_datetime": "2025-01-26T00:00:00",
      "end_datetime": "2025-01-26T23:59:59",
      "location": null,
      "color": "#EF4444",
      "is_all_day": true,
      "reminder_minutes": null,
      "event_type": "holiday",
      "is_shared": true,
      "shared_scope": "public",
      "shared_branch_id": null,
      "is_mine": false,
      "created_by": {
        "id": 5,
        "first_name": "ผู้ดูแล",
        "last_name": "ระบบ",
        "role": "system_admin"
      }
    }
  ]
}
```

### POST `/api/calendar/events`
**Description**: สร้าง event ใหม่

**Access**: ทุก role

**Request Body**:
```json
{
  "title": "ประชุมทีม",
  "description": "ประชุมวางแผนการสอน",
  "start_datetime": "2025-01-25T10:00:00",
  "end_datetime": "2025-01-25T11:00:00",
  "location": "ห้องประชุม",
  "color": "#10B981",
  "is_all_day": false,
  "reminder_minutes": 15,
  "event_type": "meeting",
  "is_shared": true,
  "shared_scope": "tutors",
  "shared_branch_id": null
}
```

### PUT `/api/calendar/events/:id`
**Description**: แก้ไข event

**Access**: เจ้าของ event เท่านั้น

### DELETE `/api/calendar/events/:id`
**Description**: ลบ event

**Access**: เจ้าของ event เท่านั้น

### GET `/api/calendar/events/:id`
**Description**: ดูรายละเอียด event

**Access**: เจ้าของ หรือ คนที่ event ถูกแชร์ให้

---

## 🎨 UI Components

### 1. **Calendar Page Path**

สำหรับทุก role ใช้ path เดียวกัน:
- **`/calendar`** หรือ **`/admin/calendar`** (สำหรับ admin roles)

หรือถ้าเป็น student/parent:
- **`/calendar`** (ใน student layout)

### 2. **Event Modal (Create/Edit)**

```
┌─────────────────────────────────────┐
│ สร้าง Event              [X]        │
├─────────────────────────────────────┤
│ ชื่อ Event *                        │
│ [_____________________________]     │
│                                     │
│ คำอธิบาย                            │
│ [_____________________________]     │
│ [_____________________________]     │
│                                     │
│ ┌──────────┐  ┌──────────┐         │
│ │ เริ่มต้น*│  │ สิ้นสุด* │         │
│ │[วันที่/เวลา]│ │[วันที่/เวลา]│         │
│ └──────────┘  └──────────┘         │
│                                     │
│ ☑ ทั้งวัน                            │
│                                     │
│ สถานที่                             │
│ [_____________________________]     │
│                                     │
│ ประเภท Event                        │
│ [เลือก: ส่วนตัว / ประชุม / ...]    │
│                                     │
│ สี Event                            │
│ [🔵] [🟢] [🟡] [🟠] [🔴] [🟣]     │
│                                     │
│ ตั้งเตือน                           │
│ [เลือก: ไม่มี / 15 นาที / ...]     │
│                                     │
│ ☑ แชร์ Event                        │
│                                     │
│ (ถ้าเลือกแชร์ - แสดงตาม role)      │
│ แชร์ให้:                            │
│ ○ [ตัวเลือกตาม role]                │
│   └─ [ตัวเลือกเพิ่มเติมถ้ามี]       │
│                                     │
│ ┌──────────┐  ┌──────────┐         │
│ │  ยกเลิก  │  │   บันทึก  │         │
│ └──────────┘  └──────────┘         │
└─────────────────────────────────────┘
```

### 3. **Calendar Integration**

- **Event ส่วนตัว**: สีที่เลือก
- **Event ที่แชร์มา**: สีเทา (#6B7280) หรือสีที่กำหนด
- **Course Schedules** (Tutor/Student): สีเขียว (#10B981)
- **Enrollments/Classes** (Student/Parent): สีฟ้า (#3B82F6)
- **Holiday/Announcement**: สีแดง (#EF4444) หรือสีอื่น

### 4. **Calendar View ในหน้า Schedule (สำหรับ Tutor)**

ปรับปรุงหน้า `/admin/tutor/schedule` ให้:
- แสดง Course Schedules (สีเขียว)
- แสดง Personal Events (สีที่เลือก)
- แสดง Shared Events (สีเทา)

---

## 🔐 Security & Permissions

### การสร้าง Event
- ✅ ทุก role ที่ login แล้วสามารถสร้างได้

### การแก้ไข/ลบ Event
- ✅ เจ้าของ event เท่านั้น

### การดู Event
1. **Event ส่วนตัว** (`is_shared = false`):
   - เจ้าของเท่านั้น

2. **Event ที่แชร์** (`is_shared = true`):
   - ตาม `shared_scope` และ `shared_branch_id` ที่กำหนด
   - ต้องเช็ค role และ branch ของ user ที่ request

### การแชร์ Event
- ✅ ตัวเลือกการแชร์แสดงตาม role และ permissions ของ user
- ✅ System Admin/Owner สามารถแชร์ได้ทุก scope
- ✅ Branch Admin แชร์ได้แค่ scope ที่เกี่ยวข้องกับสาขา
- ✅ Tutor/Student/Parent แชร์ได้แค่ scope ที่เกี่ยวข้อง

---

## 📝 Business Rules

### 1. **Event ที่แชร์**
- เจ้าของแก้ไข/ลบได้ → คนอื่นจะไม่เห็นแล้ว
- ถ้าแก้ไขข้อมูล → คนอื่นจะเห็นการเปลี่ยนแปลงทันที
- ถ้าแก้ไขการแชร์ → คนที่ถูกเพิ่ม/ลบออกจะเห็น/ไม่เห็น event ทันที

### 2. **Event Types**
- **Personal**: Event ส่วนตัว
- **Meeting**: ประชุม, นัดหมาย
- **Holiday**: วันหยุด (มักจะแชร์ public)
- **Announcement**: ประกาศ (สำหรับ Admin/Branch Admin)
- **Other**: อื่นๆ

### 3. **Branch-based Sharing**
- ถ้า `shared_scope` มีคำว่า "branch" → ต้องเช็ค `shared_branch_id`
- ถ้า `shared_branch_id = NULL` → แชร์ทุกสาขา (สำหรับ scope นั้นๆ)
- ถ้า `shared_branch_id = 1` → แชร์เฉพาะสาขา 1

### 4. **Reminder**
- ใช้ browser notification (Web Notification API)
- หรือ email notification (optional)
- หรือแสดงใน dashboard/notifications

### 5. **Color Coding**
- **Personal Events**: สีที่เลือก (default: #3B82F6 - blue)
- **Shared Events**: #6B7280 (gray) หรือสีที่เลือก
- **Course Schedules**: #10B981 (green)
- **Holiday**: #EF4444 (red)
- **Announcement**: #F59E0B (orange)

---

## 🚀 Implementation Strategy

### Phase 1: Core Calendar System
1. ✅ Database schema (`calendar_events`)
2. ✅ API endpoints (CRUD)
3. ✅ Calendar page (`/calendar` หรือ `/admin/calendar`)
4. ✅ Event Modal (Create/Edit)
5. ✅ แสดง Events ในปฏิทิน

### Phase 2: Sharing Features
1. ⏳ การแชร์แบบ scope (tutors, students, admins, etc.)
2. ⏳ Branch-based sharing
3. ⏳ Advanced sharing (ระบุคนเฉพาะ)

### Phase 3: Integration
1. ⏳ รวม Course Schedules เข้ากับ Calendar (สำหรับ Tutor/Student)
2. ⏳ รวม Enrollments/Classes (สำหรับ Student/Parent)
3. ⏳ Filter และ grouping events

### Phase 4: Advanced Features
1. ⏳ Reminder notifications
2. ⏳ Event conflict detection
3. ⏳ Recurring events
4. ⏳ Export to calendar (iCal format)
5. ⏳ Import from calendar

---

## 💡 Use Cases

### Use Case 1: System Admin สร้างวันหยุด
- System Admin สร้าง event "วันหยุดราชการ"
- `event_type = 'holiday'`, `is_shared = true`, `shared_scope = 'public'`
- ทุกคนในระบบเห็น event นี้

### Use Case 2: Branch Admin แชร์ประกาศ
- Branch Admin สร้าง event "ประชุมผู้ปกครอง"
- `event_type = 'announcement'`, `is_shared = true`, `shared_scope = 'branch_parents'`, `shared_branch_id = 1`
- ผู้ปกครองของนักเรียนในสาขา 1 เห็น event นี้

### Use Case 3: Tutor สร้าง Event ส่วนตัว
- Tutor สร้าง event "วันหยุดส่วนตัว"
- `is_shared = false`
- แสดงเฉพาะในปฏิทินของ Tutor คนนี้

### Use Case 4: Student ดูปฏิทิน
- Student เข้าดูปฏิทิน
- เห็น:
  - Events ส่วนตัว
  - Events ที่ครูแชร์มา
  - Events ที่โรงเรียนแชร์มา (holiday, announcement)
  - Course schedules (ตารางเรียน)

### Use Case 5: Parent ดูปฏิทิน
- Parent เข้าดูปฏิทิน
- เห็น:
  - Events ส่วนตัว
  - Events ที่บุตรหลานแชร์มา
  - Events ที่ครู/โรงเรียนแชร์มา
  - Classes ของบุตรหลาน

---

## 📊 Migration Strategy

### จาก Tutor Events → Calendar Events

ถ้ามี `tutor_events` table อยู่แล้ว:
1. สร้าง `calendar_events` table ใหม่
2. Migrate data จาก `tutor_events`:
   ```sql
   INSERT INTO calendar_events (
     user_id, title, description, start_datetime, end_datetime,
     location, color, is_all_day, reminder_minutes, is_shared,
     shared_scope, shared_branch_id, event_type, created_at, updated_at
   )
   SELECT 
     u.id as user_id,
     te.title, te.description, te.start_datetime, te.end_datetime,
     te.location, te.color, te.is_all_day, te.reminder_minutes, te.is_shared,
     te.shared_scope, te.shared_branch_id, 'personal' as event_type,
     te.created_at, te.updated_at
   FROM tutor_events te
   INNER JOIN tutors t ON te.tutor_id = t.id
   INNER JOIN users u ON t.user_id = u.id;
   ```
3. Drop `tutor_events` table (หลังจากตรวจสอบแล้ว)

---

## 🎯 Benefits of Universal Calendar

1. **Consistency**: ระบบเดียวกันสำหรับทุก role
2. **Collaboration**: ทุกคนสามารถแชร์ events กันได้
3. **Flexibility**: แต่ละ role มีตัวเลือกการแชร์ที่เหมาะสม
4. **Scalability**: เพิ่ม role ใหม่ได้ง่าย
5. **User Experience**: ใช้งานง่าย ไม่ต้องเรียนรู้หลายระบบ

