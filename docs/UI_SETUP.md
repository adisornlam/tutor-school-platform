# 🎨 UI Setup Guide

## 📦 Dependencies ที่ต้องติดตั้ง

```bash
bun add @nuxt/ui @vueuse/core @vueuse/nuxt @headlessui/vue @heroicons/vue
```

หรือ

```bash
bun install
```

---

## 🏗️ โครงสร้างที่สร้างแล้ว

### 1. Layouts
- **`homepage.vue`** - Layout สำหรับหน้าแรก (แบบ SkillLane)
- **`student.vue`** - Layout สำหรับนักเรียน/ผู้ปกครอง (หลัง login)
- **`admin.vue`** - Layout สำหรับ Admin Dashboard (แบบ Nuxt Dashboard Template)

### 2. Pages
- **`index.vue`** - หน้าแรก (Homepage แบบ SkillLane)
- **`my-courses.vue`** - หน้าคอร์สเรียนของฉัน (สำหรับนักเรียน)
- **`auth/login.vue`** - หน้าเข้าสู่ระบบ
- **`admin/index.vue`** - Admin Dashboard

### 3. Components
- **`CourseCard.vue`** - Component สำหรับแสดงคอร์สเรียน

### 4. Composables
- **`useAuth.ts`** - Composable สำหรับจัดการ authentication

### 5. Middleware
- **`auth.ts`** - ตรวจสอบ authentication
- **`guest.ts`** - ตรวจสอบว่ายังไม่ได้ login
- **`admin.ts`** - ตรวจสอบ admin role

---

## 🎯 Features

### Homepage (SkillLane Style)
- ✅ Hero section พร้อม CTA buttons
- ✅ Categories section
- ✅ Featured courses
- ✅ Features section
- ✅ Responsive design
- ✅ Modern UI with green theme

### My Courses Page
- ✅ Sidebar navigation (แบบ SkillLane)
- ✅ Tabs (ทั้งหมด, กำลังเรียน, เรียนจบแล้ว)
- ✅ Filter และ Sort
- ✅ Progress bars
- ✅ Course cards
- ✅ Empty state

### Admin Dashboard
- ✅ Collapsible sidebar
- ✅ Top header with search
- ✅ Stats cards
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Navigation menu

---

## 🚀 การใช้งาน

### 1. ติดตั้ง Dependencies
```bash
bun install
```

### 2. เริ่ม Development Server
```bash
bun run dev
```

### 3. ทดสอบ
- **Homepage**: http://localhost:4000
- **Login**: http://localhost:4000/auth/login
- **My Courses**: http://localhost:4000/my-courses (ต้อง login)
- **Admin Dashboard**: http://localhost:4000/admin (ต้อง login เป็น admin)

---

## 📝 TODO

- [ ] เพิ่ม API integration สำหรับ My Courses
- [ ] เพิ่ม Charts ใน Admin Dashboard
- [ ] เพิ่ม Dark mode toggle
- [ ] เพิ่ม i18n translations
- [ ] เพิ่ม Course detail page
- [ ] เพิ่ม Learning page

---

## 🎨 Design System

### Colors
- **Primary**: Green (#10b981)
- **Secondary**: Blue (#2563eb)
- **Background**: Gray-50 (#f9fafb)
- **Text**: Gray-900 (#111827)

### Typography
- **Font**: Sarabun, Kanit (Thai), Sans-serif
- **Headings**: Bold
- **Body**: Regular

---

*UI Setup Guide for Tutor School Platform*

