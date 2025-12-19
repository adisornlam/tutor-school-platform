# 🔐 System Admin - Roles & Permissions Analysis

**วันที่วิเคราะห์**: 2025-01-19

---

## 🎯 วัตถุประสงค์

วิเคราะห์สิทธิ์และหน้าที่ของ **System Admin** ว่าต้องเห็นและจัดการอะไรบ้าง

---

## 📊 ข้อมูล Master Data ที่มีอยู่

### 1. **Branches (สาขา)**
- แฟชั่นไอส์แลนด์
- สระบุรี

### 2. **Grade Levels (ระดับชั้น)**
- ประถม 1-6 (P1-P6)
- มัธยม 1-6 (M1-M6)

### 3. **Subjects (วิชา)**
- คณิตศาสตร์, วิทยาศาสตร์, ภาษาอังกฤษ, ภาษาไทย, สังคมศึกษา
- ฟิสิกส์, เคมี, ชีววิทยา

### 4. **Inclusions (สิ่งที่ได้รับ)**
- ตำรา, กระเป๋า, วิดีโอย้อนหลัง, ส่งตำราฟรีถึงบ้าน, เอกสารประกอบ

### 5. **Courses (คอร์สเรียน)**
- 10 คอร์ส (6 แฟชั่นไอส์แลนด์ + 4 สระบุรี)

### 6. **Users (ผู้ใช้งาน)**
- Tutors (3 คน)
- Parents (3 คน)
- Students (3 คน)
- System Admin, Owner

---

## 🔐 System Admin - หน้าที่และสิทธิ์

### **Core Responsibilities:**
1. **จัดการผู้ใช้งานทั้งหมด** (Tutors, Students, Parents, Branch Admins)
2. **จัดการสาขา** (Branches)
3. **จัดการคอร์สเรียน** (Courses)
4. **จัดการการลงทะเบียน** (Enrollments)
5. **จัดการการชำระเงิน** (Payments)
6. **จัดการโปรโมชั่น** (Promotions)
7. **ดูรายงาน** (Reports)
8. **ตั้งค่าระบบ** (System Settings)

---

## 📋 เมนูที่ควรมี (Admin Dashboard)

### 1. **Dashboard** ✅ (มีอยู่แล้ว)
- สรุปภาพรวม
- สถิติผู้ใช้งาน
- สถิติคอร์สเรียน
- สถิติการลงทะเบียน
- สถิติรายได้

### 2. **จัดการผู้ใช้งาน** ⭐ (ต้องสร้าง)

**คำถาม**: ควรรวมไว้ที่เมนูเดียวหรือไม่?

**คำตอบ**: **แนะนำให้รวมไว้ที่เมนูเดียว แต่แยกประเภท (Tabs/Filters)**

**Design:**
```
/users หรือ /admin/users
├── Tabs:
│   ├── ทั้งหมด (All Users)
│   ├── อาจารย์ (Tutors)
│   ├── นักเรียน (Students)
│   ├── ผู้ปกครอง (Parents)
│   ├── Admin สาขา (Branch Admins)
│   └── System Admin (System Admins)
│
├── Features:
│   ├── ดูรายการผู้ใช้งาน (List)
│   ├── ค้นหา (Search)
│   ├── กรองตาม Role (Filter by Role)
│   ├── กรองตามสาขา (Filter by Branch)
│   ├── เพิ่มผู้ใช้งาน (Create)
│   ├── แก้ไขผู้ใช้งาน (Edit)
│   ├── ระงับ/เปิดใช้งาน (Suspend/Activate)
│   ├── ลบผู้ใช้งาน (Delete - Soft Delete)
│   └── ดูรายละเอียด (View Details)
│
└── สำหรับ Tutors:
    ├── จัดการข้อมูลส่วนตัว
    ├── จัดการสาขาที่สอน
    ├── จัดการคอร์สที่สอน
    └── ดูประวัติการสอน
```

**URL Structure:**
- `/admin/users` - หน้าแรก (แสดงทั้งหมด)
- `/admin/users?role=tutor` - กรองตาม role
- `/admin/users/tutors` - อาจารย์
- `/admin/users/students` - นักเรียน
- `/admin/users/parents` - ผู้ปกครอง
- `/admin/users/:id` - ดูรายละเอียด

---

### 3. **จัดการสาขา** ⭐ (ต้องสร้าง)
```
/admin/branches
├── Features:
│   ├── ดูรายการสาขา (List)
│   ├── เพิ่มสาขา (Create)
│   ├── แก้ไขสาขา (Edit)
│   ├── เปิด/ปิดสาขา (Activate/Deactivate)
│   ├── จัดการ Admin สาขา (Manage Branch Admins)
│   ├── ดูสถิติสาขา (Branch Statistics)
│   └── ดูคอร์สในสาขา (View Courses)
```

---

### 4. **จัดการคอร์สเรียน** ⭐ (ต้องสร้าง)
```
/admin/courses
├── Features:
│   ├── ดูรายการคอร์ส (List)
│   ├── ค้นหา/กรอง (Search/Filter)
│   ├── เพิ่มคอร์ส (Create)
│   ├── แก้ไขคอร์ส (Edit)
│   ├── ลบคอร์ส (Delete - Soft Delete)
│   ├── จัดการอาจารย์ (Assign Tutors)
│   ├── จัดการสาขา (Assign Branches)
│   ├── จัดการระดับชั้น (Assign Grade Levels)
│   ├── จัดการวิชา (Assign Subjects)
│   ├── จัดการรอบเรียน (Manage Rounds)
│   ├── จัดการสิ่งที่ได้รับ (Manage Inclusions)
│   ├── ดูการลงทะเบียน (View Enrollments)
│   └── ดูสถิติ (View Statistics)
```

---

### 5. **จัดการอาจารย์** ⭐ (ต้องสร้าง)
```
/admin/tutors
├── Features:
│   ├── ดูรายการอาจารย์ (List)
│   ├── เพิ่มอาจารย์ (Create)
│   ├── แก้ไขอาจารย์ (Edit)
│   ├── จัดการสาขา (Assign Branches)
│   ├── จัดการคอร์ส (Assign Courses)
│   ├── ดูประวัติการสอน (View Teaching History)
│   └── ดูสถิติ (View Statistics)
```

**คำถาม**: ควรแยกจาก Users หรือไม่?

**คำตอบ**: **แนะนำให้รวมไว้ที่ Users แต่มี shortcut ไปที่ `/admin/tutors`**

---

### 6. **จัดการนักเรียน** ⭐ (ต้องสร้าง)
```
/admin/students
├── Features:
│   ├── ดูรายการนักเรียน (List)
│   ├── เพิ่มนักเรียน (Create)
│   ├── แก้ไขนักเรียน (Edit)
│   ├── จัดการผู้ปกครอง (Link Parents)
│   ├── ดูคอร์สเรียน (View Enrollments)
│   ├── ดูความคืบหน้า (View Progress)
│   └── ดูสถิติ (View Statistics)
```

**คำถาม**: ควรแยกจาก Users หรือไม่?

**คำตอบ**: **แนะนำให้รวมไว้ที่ Users แต่มี shortcut ไปที่ `/admin/students`**

---

### 7. **จัดการผู้ปกครอง** ⭐ (ต้องสร้าง)
```
/admin/parents
├── Features:
│   ├── ดูรายการผู้ปกครอง (List)
│   ├── เพิ่มผู้ปกครอง (Create)
│   ├── แก้ไขผู้ปกครอง (Edit)
│   ├── จัดการนักเรียน (Link Students)
│   ├── ดูคอร์สเรียนของลูก (View Children's Courses)
│   └── ดูสถิติ (View Statistics)
```

**คำถาม**: ควรแยกจาก Users หรือไม่?

**คำตอบ**: **แนะนำให้รวมไว้ที่ Users แต่มี shortcut ไปที่ `/admin/parents`**

---

### 8. **จัดการการลงทะเบียน** ⭐ (ต้องสร้าง)
```
/admin/enrollments
├── Features:
│   ├── ดูรายการการลงทะเบียน (List)
│   ├── ค้นหา/กรอง (Search/Filter)
│   ├── เพิ่มการลงทะเบียน (Create - Manual)
│   ├── แก้ไขสถานะ (Update Status)
│   ├── ยกเลิกการลงทะเบียน (Cancel)
│   ├── ดูรายละเอียด (View Details)
│   └── Export ข้อมูล (Export)
```

---

### 9. **จัดการการชำระเงิน** ⭐ (ต้องสร้าง)
```
/admin/payments
├── Features:
│   ├── ดูรายการการชำระเงิน (List)
│   ├── ค้นหา/กรอง (Search/Filter)
│   ├── อนุมัติการชำระเงิน (Approve Payment)
│   ├── ปฏิเสธการชำระเงิน (Reject Payment)
│   ├── Refund (คืนเงิน)
│   ├── ดูรายละเอียด (View Details)
│   ├── Export ข้อมูล (Export)
│   └── ดูรายงาน (View Reports)
```

---

### 10. **จัดการโปรโมชั่น** ⭐ (ต้องสร้าง)
```
/admin/promotions
├── Features:
│   ├── ดูรายการโปรโมชั่น (List)
│   ├── เพิ่มโปรโมชั่น (Create)
│   ├── แก้ไขโปรโมชั่น (Edit)
│   ├── เปิด/ปิดโปรโมชั่น (Activate/Deactivate)
│   ├── จัดการคอร์สที่ใช้ได้ (Assign Courses)
│   ├── จัดการสาขา (Assign Branches)
│   └── ดูสถิติการใช้งาน (View Usage Statistics)
```

---

### 11. **รายงาน** ⭐ (ต้องสร้าง)
```
/admin/reports
├── Features:
│   ├── รายงานผู้ใช้งาน (User Reports)
│   ├── รายงานคอร์สเรียน (Course Reports)
│   ├── รายงานการลงทะเบียน (Enrollment Reports)
│   ├── รายงานการชำระเงิน (Payment Reports)
│   ├── รายงานรายได้ (Revenue Reports)
│   ├── รายงานสาขา (Branch Reports)
│   └── Export ข้อมูล (Export)
```

---

### 12. **ตั้งค่าระบบ** ⭐ (ต้องสร้าง)

**คำถาม**: ต้องตั้งค่าอะไรบ้าง?

**คำตอบ**: 

#### 12.1 **การตั้งค่าอีเมล์** 📧
```
/admin/settings/email
├── Features:
│   ├── SMTP Settings
│   │   ├── SMTP Host
│   │   ├── SMTP Port
│   │   ├── SMTP Username
│   │   ├── SMTP Password
│   │   └── Encryption (TLS/SSL)
│   ├── Email Templates
│   │   ├── Welcome Email
│   │   ├── Enrollment Confirmation
│   │   ├── Payment Confirmation
│   │   ├── Course Reminder
│   │   └── Password Reset
│   └── Test Email
```

#### 12.2 **การตั้งค่าระบบ** ⚙️
```
/admin/settings/system
├── Features:
│   ├── General Settings
│   │   ├── App Name
│   │   ├── App Logo
│   │   ├── Timezone
│   │   ├── Default Language
│   │   └── Currency
│   ├── Payment Settings
│   │   ├── Bank Transfer Info
│   │   ├── Online Payment Gateway
│   │   └── Payment Methods
│   ├── Notification Settings
│   │   ├── Email Notifications
│   │   ├── SMS Notifications
│   │   └── Push Notifications
│   └── Security Settings
│       ├── Password Policy
│       ├── Session Timeout
│       └── Two-Factor Authentication
```

#### 12.3 **การตั้งค่าอื่นๆ** 🔧
```
/admin/settings/other
├── Features:
│   ├── Master Data Management
│   │   ├── Grade Levels
│   │   ├── Subjects
│   │   └── Inclusions
│   ├── File Upload Settings
│   │   ├── Max File Size
│   │   ├── Allowed File Types
│   │   └── Storage Location
│   └── Backup & Restore
│       ├── Database Backup
│       └── Restore Database
```

---

## 🎯 สรุปเมนู Admin Dashboard

### **Main Navigation:**
1. ✅ **Dashboard** - ภาพรวม
2. ⭐ **ผู้ใช้งาน** (`/admin/users`) - รวมทั้งหมด แต่แยกประเภท
3. ⭐ **สาขา** (`/admin/branches`)
4. ⭐ **คอร์สเรียน** (`/admin/courses`)
5. ⭐ **อาจารย์** (`/admin/tutors`) - Shortcut ไปที่ Users?role=tutor
6. ⭐ **นักเรียน** (`/admin/students`) - Shortcut ไปที่ Users?role=student
7. ⭐ **ผู้ปกครอง** (`/admin/parents`) - Shortcut ไปที่ Users?role=parent
8. ⭐ **การลงทะเบียน** (`/admin/enrollments`)
9. ⭐ **การชำระเงิน** (`/admin/payments`)
10. ⭐ **โปรโมชั่น** (`/admin/promotions`)
11. ⭐ **รายงาน** (`/admin/reports`)
12. ⭐ **ตั้งค่า** (`/admin/settings`)

---

## 💡 คำแนะนำ

### **1. การจัดการผู้ใช้งาน**

**แนะนำ**: **รวมไว้ที่เมนูเดียว (`/admin/users`) แต่แยกประเภทด้วย Tabs/Filters**

**เหตุผล:**
- ✅ ง่ายต่อการค้นหา (Search across all users)
- ✅ ง่ายต่อการจัดการ (Single interface)
- ✅ ลดความซับซ้อน (Less navigation)
- ✅ มี Shortcuts ไปที่ `/admin/tutors`, `/admin/students`, `/admin/parents` (Filtered views)

**Implementation:**
```vue
/admin/users
├── Tabs: [ทั้งหมด, อาจารย์, นักเรียน, ผู้ปกครอง, Admin สาขา, System Admin]
├── Search Bar
├── Filters: [Role, Branch, Status]
└── Table: [Username, Name, Email, Role, Branch, Status, Actions]
```

### **2. การตั้งค่าระบบ**

**แนะนำ**: **แยกเป็น 3 หมวดหมู่**

1. **Email Settings** (`/admin/settings/email`)
2. **System Settings** (`/admin/settings/system`)
3. **Other Settings** (`/admin/settings/other`)

**หรือใช้ Tabs:**
```
/admin/settings
├── Tab: อีเมล์
├── Tab: ระบบ
└── Tab: อื่นๆ
```

---

## 📊 Priority

### **Priority 1: Critical (ต้องมีทันที)**
1. ✅ Dashboard (มีอยู่แล้ว)
2. ⭐ ผู้ใช้งาน (รวมทั้งหมด แต่แยกประเภท)
3. ⭐ สาขา
4. ⭐ คอร์สเรียน
5. ⭐ การลงทะเบียน
6. ⭐ การชำระเงิน

### **Priority 2: Important**
1. ⭐ อาจารย์ (Shortcut)
2. ⭐ นักเรียน (Shortcut)
3. ⭐ ผู้ปกครอง (Shortcut)
4. ⭐ โปรโมชั่น

### **Priority 3: Nice to Have**
1. ⭐ รายงาน
2. ⭐ ตั้งค่าระบบ

---

## 🎨 UI/UX Recommendations

### **1. Users Management Page:**
```
┌─────────────────────────────────────────┐
│ ผู้ใช้งาน                          [+ เพิ่ม] │
├─────────────────────────────────────────┤
│ [ทั้งหมด] [อาจารย์] [นักเรียน] [ผู้ปกครอง] │
├─────────────────────────────────────────┤
│ 🔍 ค้นหา...  [Role ▼] [Branch ▼] [Status ▼] │
├─────────────────────────────────────────┤
│ Username │ Name │ Email │ Role │ Branch │ Status │ Actions │
│──────────┼──────┼───────┼──────┼────────┼────────┼────────│
│ tutor1   │ ...  │ ...   │ Tutor│ FI     │ Active │ [Edit] │
│ student1 │ ...  │ ...   │ Stu  │ FI     │ Active │ [Edit] │
└─────────────────────────────────────────┘
```

### **2. Settings Page:**
```
┌─────────────────────────────────────────┐
│ ตั้งค่าระบบ                              │
├─────────────────────────────────────────┤
│ [อีเมล์] [ระบบ] [อื่นๆ]                  │
├─────────────────────────────────────────┤
│ SMTP Settings                           │
│ ┌─────────────────────────────────────┐ │
│ │ Host: [smtp.gmail.com]              │ │
│ │ Port: [587]                         │ │
│ │ Username: [your@email.com]          │ │
│ │ Password: [••••••••]                │ │
│ └─────────────────────────────────────┘ │
│ [บันทึก]                                │
└─────────────────────────────────────────┘
```

---

*อัปเดตล่าสุด: 2025-01-19*

