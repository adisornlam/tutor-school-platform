# แผนการพัฒนา: Tutor School Platform

## 📅 Timeline โดยรวม

**ระยะเวลา**: 10-12 สัปดาห์

---

## Phase 1: Foundation & Setup (สัปดาห์ 1-2)

### Week 1: Project Setup
- [ ] สร้างโปรเจกต์ Nuxt 4
- [ ] ตั้งค่า TypeScript
- [ ] ตั้งค่า Tailwind CSS
- [ ] ตั้งค่า ESLint & Prettier
- [ ] ตั้งค่า Git repository
- [ ] สร้างโครงสร้าง directory ตาม Nuxt 4
- [ ] ตั้งค่า Environment variables

### Week 2: Database & Authentication
- [ ] สร้าง MySQL database
- [ ] สร้าง Database Schema (ตาม DATABASE_SCHEMA.md)
- [ ] สร้าง Migration files
- [ ] ตั้งค่า Database connection
- [ ] สร้าง Authentication system (JWT + Refresh Token)
- [ ] สร้าง RBAC foundation
- [ ] สร้าง Auth middleware
- [ ] สร้าง Auth composable (`useAuth`)

**Deliverables**:
- ✅ โปรเจกต์ Nuxt 4 พร้อมโครงสร้าง
- ✅ Database Schema ครบถ้วน
- ✅ ระบบ Authentication พร้อมใช้งาน

---

## Phase 2: Core Modules (สัปดาห์ 3-4)

### Week 3: User & Branch Management
- [ ] สร้าง User Management API
- [ ] สร้าง Branch Management API
- [ ] สร้าง Branch Admin assignment
- [ ] สร้าง UI สำหรับจัดการสาขา
- [ ] สร้าง User Profile page
- [ ] สร้าง Branch listing page

### Week 4: Tutor & Course Management
- [ ] สร้าง Tutor Management API
- [ ] สร้าง Tutor-Branch-Course relationships
- [ ] สร้าง Course Management API
- [ ] สร้าง Course Schedule API
- [ ] สร้าง UI สำหรับจัดการอาจารย์
- [ ] สร้าง UI สำหรับจัดการหลักสูตร
- [ ] สร้าง Course listing page (ตามต้นแบบ SkillLane)

**Deliverables**:
- ✅ ระบบจัดการสาขา
- ✅ ระบบจัดการอาจารย์
- ✅ ระบบจัดการหลักสูตร
- ✅ หน้าคอร์สเรียน (ตามต้นแบบ)

---

## Phase 3: Enrollment & Payment (สัปดาห์ 5-6)

### Week 5: Enrollment System
- [ ] สร้าง Enrollment API
- [ ] สร้าง Learning Rights system
- [ ] สร้าง Enrollment validation
- [ ] สร้าง Seat limit checking
- [ ] สร้าง UI สำหรับลงทะเบียน
- [ ] สร้าง Enrollment confirmation page

### Week 6: Payment System
- [ ] สร้าง Payment API
- [ ] เชื่อมต่อ Payment Gateway (Omise/2C2P)
- [ ] สร้าง Payment webhook handler
- [ ] สร้าง Invoice system
- [ ] สร้าง UI สำหรับชำระเงิน
- [ ] สร้าง Payment history page
- [ ] ทดสอบ Payment flow

**Deliverables**:
- ✅ ระบบลงทะเบียน
- ✅ ระบบชำระเงิน
- ✅ ระบบสิทธิ์การเรียนรู้

---

## Phase 4: Promotion & Learning (สัปดาห์ 7-8)

### Week 7: Promotion System
- [ ] สร้าง Promotion API
- [ ] สร้าง Promotion validation logic
- [ ] สร้าง Promotion usage tracking
- [ ] สร้าง UI สำหรับจัดการโปรโมชั่น
- [ ] สร้าง Promotion code input
- [ ] ทดสอบ Promotion rules

### Week 8: Learning System
- [ ] สร้าง Learning API
- [ ] สร้าง Learning access validation
- [ ] สร้าง Learning progress tracking
- [ ] สร้าง Video player component
- [ ] สร้าง Learning dashboard
- [ ] สร้าง Course session page
- [ ] เชื่อมต่อ Video platform (Zoom/Vimeo)

**Deliverables**:
- ✅ ระบบโปรโมชั่น
- ✅ ระบบการเรียนรู้
- ✅ Video player

---

## Phase 5: Real-time & Additional Features (สัปดาห์ 9-10)

### Week 9: Notification & Real-time
- [ ] สร้าง SSE notification system
- [ ] สร้าง Notification API
- [ ] สร้าง Notification service
- [ ] สร้าง SSE composable (`useSSE`)
- [ ] สร้าง Notification UI component
- [ ] สร้าง Notification center
- [ ] ทดสอบ Real-time notifications

### Week 10: Additional Features
- [ ] สร้าง Parent system
- [ ] สร้าง Quiz system
- [ ] สร้าง Assignment system
- [ ] สร้าง Announcement system
- [ ] สร้าง Material delivery system
- [ ] เชื่อมต่อ Kerry Express API

**Deliverables**:
- ✅ ระบบแจ้งเตือน Real-time
- ✅ ระบบผู้ปกครอง
- ✅ ระบบแบบทดสอบ
- ✅ ระบบการบ้าน

---

## Phase 6: Admin Dashboard & Polish (สัปดาห์ 11-12)

### Week 11: Admin Dashboard
- [ ] สร้าง Admin Dashboard API
- [ ] สร้าง Statistics API
- [ ] สร้าง Revenue analytics
- [ ] สร้าง Tutor performance metrics
- [ ] สร้าง Admin Dashboard UI
- [ ] สร้าง Owner Dashboard UI
- [ ] สร้าง Reports & Analytics

### Week 12: Polish & Testing
- [ ] Error handling
- [ ] Input validation
- [ ] Security audit
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Responsive design testing
- [ ] Cross-browser testing
- [ ] User acceptance testing
- [ ] Documentation

**Deliverables**:
- ✅ Admin Dashboard
- ✅ Owner Dashboard
- ✅ ระบบพร้อมใช้งาน

---

## 🎯 Priority Features

### Must Have (Phase 1-4)
1. ✅ Authentication & Authorization
2. ✅ Branch Management
3. ✅ Tutor Management
4. ✅ Course Management
5. ✅ Enrollment System
6. ✅ Payment System
7. ✅ Learning System (Live + VOD)
8. ✅ Promotion System
9. ✅ Notification System (SSE)

### Should Have (Phase 5)
10. ✅ Parent System
11. ✅ Quiz System
12. ✅ Assignment System
13. ✅ Announcement System

### Nice to Have (Phase 6+)
14. Material Delivery System
15. Advanced Analytics
16. Mobile App (Future)
17. Live Chat (Future)

---

## 🛠️ Tech Stack Decisions

### Frontend
- **Framework**: Nuxt 4
- **UI Library**: Tailwind CSS
- **State Management**: Pinia
- **Form Validation**: Vee-Validate
- **Icons**: Heroicons
- **Date Handling**: date-fns

### Backend
- **Server**: Nuxt 4 (Nitro)
- **Database**: MySQL 8
- **ORM**: Drizzle ORM หรือ Raw SQL
- **Authentication**: JWT + Refresh Token
- **Real-time**: Server-Sent Events (SSE)

### External Services
- **Payment**: Omise หรือ 2C2P
- **Video**: Zoom API หรือ Vimeo
- **Email**: SendGrid หรือ Mailgun
- **SMS**: (ถ้าจำเป็น)
- **File Storage**: AWS S3 หรือ Cloudinary
- **Delivery**: Kerry Express API

---

## 📋 Development Checklist

### Setup
- [ ] Nuxt 4 project created
- [ ] TypeScript configured
- [ ] Tailwind CSS configured
- [ ] Database schema created
- [ ] Environment variables set

### Core Features
- [ ] Authentication working
- [ ] User management working
- [ ] Branch management working
- [ ] Tutor management working
- [ ] Course management working
- [ ] Enrollment working
- [ ] Payment working
- [ ] Learning access working
- [ ] Promotion working
- [ ] Notifications working

### UI/UX
- [ ] Homepage (ตามต้นแบบ SkillLane)
- [ ] Course listing page
- [ ] Course detail page
- [ ] Student dashboard
- [ ] Parent dashboard
- [ ] Tutor dashboard
- [ ] Admin dashboard
- [ ] Responsive design

### Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Security testing
- [ ] Performance testing

### Deployment
- [ ] Production environment setup
- [ ] CI/CD pipeline
- [ ] Monitoring setup
- [ ] Backup strategy

---

## 🚀 Quick Start Guide

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

# Run migrations
npm run db:migrate
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

## 📝 Notes

- **Development**: ใช้ local MySQL database
- **Staging**: ใช้ staging server
- **Production**: ใช้ production server
- **Backup**: Backup database ทุกวัน
- **Monitoring**: ใช้ monitoring tools (Sentry, etc.)

---

*แผนการพัฒนานี้เป็นแนวทางและสามารถปรับเปลี่ยนได้ตามความเหมาะสม*

