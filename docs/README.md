# Tutor School Platform - โรงเรียนกวดวิชา KDC

แพลตฟอร์มการศึกษาแบบ Full-stack สำหรับโรงเรียนกวดวิชาหลายสาขา โดยใช้ Nuxt.js 4

## 📚 เอกสารทั้งหมด

### 1. การวิเคราะห์ระบบ
- **[PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md)** - วิเคราะห์ระบบหลัก (ภาษาอังกฤษ)
- **[ANALYSIS_SUMMARY_TH.md](./ANALYSIS_SUMMARY_TH.md)** - สรุปการวิเคราะห์ (ภาษาไทย)
- **[ADDITIONAL_ANALYSIS.md](./ADDITIONAL_ANALYSIS.md)** - การวิเคราะห์เพิ่มเติมจากข้อมูลลูกค้า

### 2. ข้อมูลลูกค้าและความต้องการ
- **[CLIENT_REQUIREMENTS.md](./CLIENT_REQUIREMENTS.md)** - ข้อมูลโรงเรียน KDC และความต้องการ

### 3. Database Design
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Database Schema แบบละเอียด

### 4. API Design
- **[API_DESIGN.md](./API_DESIGN.md)** - API Endpoints ทั้งหมด

### 5. โครงสร้างโปรเจกต์
- **[NUXT4_PROJECT_STRUCTURE.md](./NUXT4_PROJECT_STRUCTURE.md)** - โครงสร้างโปรเจกต์ Nuxt 4

### 6. แผนการพัฒนา
- **[IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)** - แผนการพัฒนา 12 สัปดาห์

---

## 🎯 ภาพรวมโปรเจกต์

### วัตถุประสงค์
สร้างแพลตฟอร์มการศึกษาแบบ Full-stack สำหรับโรงเรียนกวดวิชา KDC ที่มี 2 สาขา โดยรองรับ:
- การลงทะเบียนและจัดการนักเรียน (ระดับประถม-มัธยม)
- การจัดการหลักสูตรและอาจารย์
- ระบบชำระเงินออนไลน์
- การเข้าถึงเนื้อหาการเรียนรู้ (Live e-Learning & Video on Demand)
- ระบบโปรโมชั่นและส่วนลด
- การแจ้งเตือนแบบ Real-time
- ระบบผู้ปกครอง
- ระบบแบบทดสอบและการบ้าน

### Tech Stack
- **Frontend + Backend**: Nuxt.js 4 (Full-stack mode)
- **Database**: MySQL 8
- **Authentication**: JWT + Refresh Token
- **Real-time**: Server-Sent Events (SSE)
- **UI Framework**: Tailwind CSS
- **State Management**: Pinia

---

## 🏫 ข้อมูลลูกค้า

### โรงเรียนกวดวิชา KDC
- **เว็บไซต์**: https://www.schoolkdc.com/
- **กลุ่มเป้าหมาย**: นักเรียนระดับประถมศึกษา (ป.1-ป.6) และมัธยมศึกษา (ม.1-ม.6)
- **จำนวนสาขา**: 2 สาขา
  - สาขาเปิดสอน (กรุงเทพฯ) - 02-947-6137, 081-1966559
  - สาขาโคราช (นครราชสีมา) - 064-035-1622, 084-9956362

### ฟีเจอร์หลัก
1. **Live e-Learning (LeL)** - เรียนสดออนไลน์ผ่าน Facebook Live หรือ Zoom
2. **Video on Demand (VoD)** - เรียนย้อนหลัง ดูได้ 24 ชั่วโมง
3. **ส่งเอกสาร** - ผ่าน Kerry Express
4. **2 สาขา** - แต่ละสาขามีอาจารย์และหลักสูตรของตัวเอง

---

## 🎨 ต้นแบบ UI/UX

- **ต้นแบบหน้าแรก**: https://www.skilllane.com/
- **Design System**: ดูใน [CLIENT_REQUIREMENTS.md](./CLIENT_REQUIREMENTS.md)

---

## 👥 ผู้ใช้งานระบบ

1. **Student (นักเรียน)** - ระดับประถม-มัธยม
2. **Parent (ผู้ปกครอง)** - ดูแลและติดตามการเรียน
3. **Tutor (อาจารย์)** - สอนและดูแลนักเรียน
4. **Branch Admin (ผู้ดูแลสาขา)** - จัดการสาขา
5. **System Admin (ผู้ดูแลระบบ)** - จัดการระบบทั้งหมด
6. **Owner (เจ้าของ)** - ดูภาพรวมและวิเคราะห์

---

## 📁 โครงสร้างโปรเจกต์ (Nuxt 4)

```
Tutor-School-Platform/
├── app/                    # Main application
│   ├── components/        # Vue components
│   ├── pages/             # File-based routing
│   ├── layouts/           # Layout components
│   ├── composables/       # Vue composables
│   ├── middleware/        # Route middleware
│   └── utils/             # Utility functions
├── server/                 # Server-side code
│   ├── api/               # API routes
│   ├── services/          # Business logic
│   └── utils/             # Server utilities
├── shared/                 # Shared code
│   ├── types/             # TypeScript types
│   └── constants/         # Constants
└── public/                # Public static files
```

ดูรายละเอียดใน [NUXT4_PROJECT_STRUCTURE.md](./NUXT4_PROJECT_STRUCTURE.md)

---

## 🗄️ Database Schema

### Core Tables
- `users`, `roles`, `user_roles` - User & Authentication
- `branches`, `branch_admins` - Branch Management
- `tutors`, `tutor_branches`, `tutor_courses` - Tutor Management
- `courses`, `course_branches`, `course_schedules` - Course Management
- `promotions`, `promotion_courses`, `promotion_branches` - Promotion System
- `enrollments`, `learning_rights` - Enrollment & Learning
- `payments`, `payment_items` - Payment System
- `learning_progress`, `course_sessions` - Learning Module
- `notifications` - Notification System

### Additional Tables (สำหรับระดับประถม-มัธยม)
- `parent_students` - Parent System
- `quizzes`, `quiz_questions`, `quiz_attempts` - Quiz System
- `assignments`, `assignment_submissions` - Assignment System
- `announcements` - Announcement System
- `materials`, `material_deliveries` - Material Delivery System

ดูรายละเอียดใน [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - ลงทะเบียน
- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - ข้อมูลผู้ใช้ปัจจุบัน

### Courses
- `GET /api/courses` - รายการคอร์ส
- `GET /api/courses/:id` - รายละเอียดคอร์ส
- `POST /api/courses` - สร้างคอร์ส (Admin)

### Enrollments
- `GET /api/enrollments` - รายการลงทะเบียน
- `POST /api/enrollments` - ลงทะเบียนเรียน

### Payments
- `GET /api/payments` - รายการชำระเงิน
- `POST /api/payments` - สร้างการชำระเงิน
- `POST /api/payments/:id/verify` - Verify payment (webhook)

### Learning
- `GET /api/learning/my-courses` - คอร์สของฉัน
- `POST /api/learning/sessions/:id/access` - เข้าถึงบทเรียน

### Notifications (SSE)
- `GET /api/sse/notifications` - Real-time notifications

ดูรายละเอียดทั้งหมดใน [API_DESIGN.md](./API_DESIGN.md)

---

## 🚀 การเริ่มต้นพัฒนา

### 1. Setup Project
```bash
npx nuxi@latest init tutor-school-platform
cd tutor-school-platform
npm install
```

### 2. Setup Database
```bash
# Create database
mysql -u root -p
CREATE DATABASE tutor_school;

# Run migrations (เมื่อมี migration files)
```

### 3. Setup Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 📅 แผนการพัฒนา

**ระยะเวลา**: 10-12 สัปดาห์

### Phase 1: Foundation (สัปดาห์ 1-2)
- Project setup
- Database schema
- Authentication system

### Phase 2: Core Modules (สัปดาห์ 3-4)
- User & Branch management
- Tutor & Course management

### Phase 3: Enrollment & Payment (สัปดาห์ 5-6)
- Enrollment system
- Payment system

### Phase 4: Promotion & Learning (สัปดาห์ 7-8)
- Promotion system
- Learning system

### Phase 5: Real-time & Additional Features (สัปดาห์ 9-10)
- Notification system (SSE)
- Parent, Quiz, Assignment systems

### Phase 6: Admin Dashboard & Polish (สัปดาห์ 11-12)
- Admin dashboard
- Testing & optimization

ดูรายละเอียดใน [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)

---

## 🎯 Features

### Must Have
- ✅ Authentication & Authorization (RBAC)
- ✅ Branch Management
- ✅ Tutor Management
- ✅ Course Management
- ✅ Enrollment System
- ✅ Payment System
- ✅ Learning System (Live + VOD)
- ✅ Promotion System
- ✅ Notification System (SSE)

### Should Have
- ✅ Parent System
- ✅ Quiz System
- ✅ Assignment System
- ✅ Announcement System

### Nice to Have
- Material Delivery System
- Advanced Analytics
- Mobile App (Future)

---

## 🛠️ Tech Stack

### Frontend
- Nuxt 4
- Vue 3 (Composition API)
- Tailwind CSS
- Pinia
- Vee-Validate

### Backend
- Nuxt 4 (Nitro server)
- MySQL 8
- JWT + Refresh Token
- Server-Sent Events (SSE)

### External Services
- Payment Gateway (Omise/2C2P)
- Video Platform (Zoom/Vimeo)
- Email Service (SendGrid/Mailgun)
- Kerry Express API

---

## 📝 Notes

- ใช้ UTC สำหรับ Timestamps ทั้งหมด
- สกุลเงินเริ่มต้น: THB (บาทไทย)
- รูปแบบวันที่: ISO 8601
- API Response: JSON format
- Error Response: Consistent error format

---

## 📞 ติดต่อ

สำหรับคำถามหรือข้อสงสัยเกี่ยวกับโปรเจกต์ กรุณาติดต่อทีมพัฒนา

---

*เอกสารนี้สรุปจากเอกสารทั้งหมดในโปรเจกต์*

