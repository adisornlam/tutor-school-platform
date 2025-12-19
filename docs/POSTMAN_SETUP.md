# 📮 Postman Collection Setup Guide

## 📥 วิธี Import Collection

### 1. เปิด Postman
- เปิด Postman application

### 2. Import Collection
- คลิก **Import** (มุมซ้ายบน)
- เลือกไฟล์ `Tutor-School-Platform.postman_collection.json`
- หรือลากไฟล์ไปวางใน Postman

### 3. Import Environment (Optional)

- คลิก **Import** อีกครั้ง
- เลือกไฟล์ `Tutor-School-Platform.postman_environment.json`
- หรือสร้าง Environment ใหม่ชื่อ **"Tutor School Platform - Local"**:

```json
{
  "base_url": "http://localhost:4000",
  "access_token": "",
  "refresh_token": "",
  "user_id": ""
}
```

---

## 🔑 Environment Variables

### Variables ที่ใช้ใน Collection

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `base_url` | API base URL | `http://localhost:4000` |
| `access_token` | JWT access token (auto-set after login) | (empty) |
| `refresh_token` | JWT refresh token (auto-set after login) | (empty) |

### Auto-set Variables

Collection จะ auto-set variables หลังจาก login:
- `access_token` - ตั้งอัตโนมัติหลังจาก login สำเร็จ
- `user_id` - ตั้งอัตโนมัติหลังจาก login สำเร็จ

---

## 🚀 Quick Start

### 1. เริ่ม Development Server
```bash
bun run dev
```

### 2. ทดสอบ Health Check
- เปิด **Health Check > Health Check**
- คลิก **Send**
- ควรได้ response: `{"status": "ok", ...}`

### 3. Login
- เปิด **Authentication > Login - Admin**
- คลิก **Send**
- `access_token` จะถูกตั้งค่าอัตโนมัติ

### 4. ทดสอบ API อื่นๆ
- ใช้ `access_token` ที่ได้จาก login
- ทดสอบ endpoints อื่นๆ ได้เลย

---

## 📋 Collection Structure

### 1. Health Check
- ✅ Health Check

### 2. Authentication
- Register
- Login - Admin
- Login - Owner
- Login - Student
- Get Current User
- Refresh Token
- Logout

### 3. Branches
- List Branches
- Get Branch by ID
- Create Branch
- Update Branch

### 4. Courses
- List Courses
- Get Course by ID
- Create Course
- Get Course Schedules

### 5. Enrollments
- List Enrollments
- Create Enrollment
- Get Enrollment by ID
- Update Enrollment Status

### 6. Payments
- List Payments
- Get Payment by ID
- Create Payment
- Verify Payment (Webhook)
- Get Invoice

### 7. Promotions
- List Promotions
- Get Promotion by ID
- Validate Promotion Code
- Create Promotion

### 8. Learning
- Get My Courses
- Get Course Sessions
- Request Session Access
- Update Learning Progress
- Get Learning Progress

### 9. Notifications
- Get Notifications (SSE)
- List Notifications
- Mark Notification as Read
- Mark All Notifications as Read

### 10. Admin
- Get Dashboard Stats
- Get Revenue Analytics
- Get Users
- Get Tutor Performance

### 11. Tutors
- List Tutors
- Get Tutor by ID
- Create Tutor
- Assign Tutor to Branch
- Assign Tutor to Course

---

## 🔐 Test Users

### Admin
- Email: `admin@kdcschool.com`
- Password: `admin123`

### Owner
- Email: `owner@kdcschool.com`
- Password: `owner123`

---

## 📝 Notes

1. **Authentication**: ใช้ Bearer Token ใน Authorization header
2. **Auto Token**: Collection จะ auto-set `access_token` หลังจาก login
3. **Environment**: ต้องตั้งค่า environment variables ก่อนใช้งาน
4. **SSE**: Notification endpoint ใช้ Server-Sent Events (SSE)

---

## 🔄 Update Collection

เมื่อมี API endpoints ใหม่:
1. เพิ่ม request ใหม่ใน Postman
2. Export collection อีกครั้ง
3. แทนที่ไฟล์ `Tutor-School-Platform.postman_collection.json`

---

*Postman Collection for Tutor School Platform*

