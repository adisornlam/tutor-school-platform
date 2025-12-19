# 🔐 Authentication Flow & Login System

## 📋 ภาพรวม

ระบบใช้ **หน้า Login เดียว** สำหรับทุก role และจะ redirect ไปยัง dashboard ที่เหมาะสมตาม role หลังจาก login สำเร็จ

---

## 🔑 Login URLs

### 1. หน้า Login หลัก (สำหรับทุกคน)
**URL**: `http://localhost:4000/auth/login`

- ✅ **นักเรียน** (Student)
- ✅ **ผู้ปกครอง** (Parent)
- ✅ **อาจารย์** (Tutor)
- ✅ **ผู้ดูแลสาขา** (Branch Admin)
- ✅ **ผู้ดูแลระบบ** (System Admin)
- ✅ **เจ้าของ** (Owner)

### 2. Admin Login (Redirect)
**URL**: `http://localhost:4000/admin/login`

- Redirect ไปยัง `/auth/login?redirect=/admin`
- ใช้หน้า login เดียวกัน แต่จะ redirect ไป admin dashboard หลัง login

---

## 🔄 Redirect Logic

หลังจาก login สำเร็จ ระบบจะ redirect ตาม role:

| Role | Redirect Path | Description |
|------|---------------|-------------|
| `system_admin` | `/admin` | Admin Dashboard |
| `owner` | `/admin` | Admin Dashboard |
| `branch_admin` | `/admin/branches` | Branch Admin Dashboard |
| `tutor` | `/tutor/dashboard` | Tutor Dashboard (ถ้ามี) |
| `student` | `/my-courses` | My Courses Page |
| `parent` | `/my-courses` | My Courses Page |

---

## 🎯 การใช้งาน

### สำหรับนักเรียน/ผู้ปกครอง
1. ไปที่: `http://localhost:4000/`
2. คลิก "เข้าสู่ระบบ"
3. Login ที่: `http://localhost:4000/auth/login`
4. หลัง login → redirect ไป `/my-courses`

### สำหรับ Admin/Owner/Branch Admin
1. ไปที่: `http://localhost:4000/admin/login` (optional)
   - หรือไปที่: `http://localhost:4000/auth/login` โดยตรง
2. Login ด้วย credentials
3. หลัง login → redirect ไป `/admin` หรือ `/admin/branches` ตาม role

---

## 🔒 Middleware Protection

### Guest Middleware (`guest.ts`)
- ใช้สำหรับหน้า login/register
- ถ้า login แล้ว → redirect ไป dashboard ตาม role
- ถ้ายังไม่ login → แสดงหน้า login

### Auth Middleware (`auth.ts`)
- ใช้สำหรับหน้าที่ต้อง login
- ถ้ายังไม่ login → redirect ไป `/auth/login?redirect={current_path}`
- หลัง login → redirect กลับไปหน้าที่ต้องการ

### Admin Middleware (`admin.ts`)
- ใช้สำหรับ admin pages
- ตรวจสอบ role: `system_admin`, `owner`, `branch_admin`
- ถ้าไม่มี role → 403 Forbidden

---

## 📝 Code Structure

### Utility Function
```typescript
// app/utils/auth.ts
export function getRedirectPathByRole(
  user: UserWithRoles | null, 
  redirect?: string | null
): string
```

### Login Flow
1. User submit login form
2. Call `login()` from `useAuth()`
3. Get user data from response
4. Call `getRedirectPathByRole()` to determine redirect path
5. Navigate to redirect path

---

## 🧪 Test Users

### System Admin
- Email: `admin@kdcschool.com`
- Password: `admin123`
- Redirect: `/admin`

### Owner
- Email: `owner@kdcschool.com`
- Password: `owner123`
- Redirect: `/admin`

### Student (ต้อง register ก่อน)
- Email: `student@example.com`
- Password: `password123`
- Redirect: `/my-courses`

---

## 💡 Best Practices

1. **Single Login Page**: ใช้หน้า login เดียวสำหรับทุก role
2. **Role-based Redirect**: Redirect ตาม role หลัง login
3. **Query Parameter**: รองรับ `?redirect=` เพื่อกลับไปหน้าที่ต้องการ
4. **Middleware Protection**: ใช้ middleware เพื่อป้องกัน unauthorized access

---

## 🔄 Flow Diagram

```
User → /auth/login
  ↓
Enter credentials
  ↓
Login API call
  ↓
Success? → Get user role
  ↓
getRedirectPathByRole()
  ↓
Redirect:
  - system_admin/owner → /admin
  - branch_admin → /admin/branches
  - student/parent → /my-courses
```

---

*Authentication Flow Documentation for Tutor School Platform*

