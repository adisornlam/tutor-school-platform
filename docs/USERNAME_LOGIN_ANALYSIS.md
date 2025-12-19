# 🔐 Username-Based Login System Analysis

**วันที่วิเคราะห์**: 2025-01-19  
**แนวทาง**: Login ด้วย username (unique), Email optional

---

## 🎯 ข้อเสนอแนะจากผู้ใช้

### Design:
```
1. Login ด้วย username (ไม่ซ้ำ, unique)
2. Email มีหรือไม่มีก็ได้ (optional)
3. ผู้ปกครอง: ควรมี email (เพื่อรับแจ้งเตือน)
4. นักเรียน: ไม่จำเป็นต้องมี email (แจ้งเตือนส่งไปหาผู้ปกครอง)
```

---

## 📊 Schema Changes Required

### 1. เพิ่ม `username` Field:
```sql
ALTER TABLE users 
  ADD COLUMN username VARCHAR(100) UNIQUE NOT NULL AFTER email,
  ADD INDEX idx_username (username);

-- แก้ email ให้เป็น optional
ALTER TABLE users 
  MODIFY COLUMN email VARCHAR(255) NULL;
  
-- ลบ unique constraint จาก email (เพราะอาจเป็น NULL)
ALTER TABLE users 
  DROP INDEX idx_email;
  
-- เพิ่ม unique constraint ใหม่ (แต่รองรับ NULL)
ALTER TABLE users 
  ADD UNIQUE KEY idx_email (email(191));
```

### 2. Updated Schema:
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NULL,              -- ⭐ Changed: NULL allowed
    username VARCHAR(100) UNIQUE NOT NULL, -- ⭐ NEW: Required, unique
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    email_verified_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY idx_username (username),
    UNIQUE KEY idx_email (email(191)),     -- ⭐ NULL allowed
    INDEX idx_status (status)
)
```

---

## 🔐 Login Flow Design

### Login API Update:
```typescript
// server/api/auth/login.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody<{ username: string, password: string }>()
  
  // Login ด้วย username หรือ email
  const user = await db.query(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [body.username, body.username]
  )
  
  // ... verify password ...
})
```

### User Creation:
```typescript
// Parent
{
  username: 'parent1',
  email: 'parent1@example.com',  // ✅ มี email
  password_hash: '...',
  first_name: 'คุณพ่อ',
  last_name: 'สมชาย',
  // role: 'parent'
}

// Student 1
{
  username: 'student1_parent1',
  email: null,  // ⚠️ ไม่มี email (แจ้งเตือนส่งไปหาผู้ปกครอง)
  password_hash: '...',
  first_name: 'เด็กชาย',
  last_name: 'สมชาย',
  // role: 'student'
}

// Student 2
{
  username: 'student2_parent1',
  email: null,  // ⚠️ ไม่มี email
  password_hash: '...',
  first_name: 'เด็กหญิง',
  last_name: 'สมหญิง',
  // role: 'student'
}
```

---

## 📧 Notification System Design

### Logic:
```typescript
// เมื่อต้องส่ง notification ไปหานักเรียน
async function sendNotificationToStudent(studentId: number, notification: Notification) {
  const student = await getUserById(studentId)
  
  // ถ้านักเรียนมี email → ส่งไปหานักเรียน
  if (student.email) {
    await sendEmail(student.email, notification)
  } else {
    // ถ้าไม่มี email → ส่งไปหาผู้ปกครอง
    const parents = await getParentsByStudentId(studentId)
    for (const parent of parents) {
      if (parent.email) {
        await sendEmail(parent.email, notification)
      }
    }
  }
  
  // บันทึกในระบบ (นักเรียนเห็นใน dashboard)
  await createNotification(studentId, notification)
}
```

---

## ✅ ข้อดีของแนวทางนี้

1. ✅ **Username Unique** - ไม่ซ้ำ, ง่ายต่อการ login
2. ✅ **Email Optional** - Flexible, ไม่บังคับ
3. ✅ **Parent มี Email** - รับแจ้งเตือนได้
4. ✅ **Student ไม่ต้องมี Email** - ลดความซับซ้อน
5. ✅ **Notification Logic** - ส่งไปหาผู้ปกครองอัตโนมัติ

---

## ⚠️ ข้อควรระวัง

1. ⚠️ **Schema Migration** - ต้องเพิ่ม username field และแก้ email
2. ⚠️ **Login API** - ต้องรองรับทั้ง username และ email
3. ⚠️ **Registration** - ต้องสร้าง username (อาจ auto-generate)
4. ⚠️ **Email Validation** - ต้อง validate เฉพาะเมื่อมี email

---

## 📋 Username Generation Strategy

### Option 1: Manual (ผู้ใช้กรอก)
```
Parent: parent1
Student: student1_parent1
```

### Option 2: Auto-generate
```
Parent: parent1 (manual)
Student: auto-generate จาก parent username + student number
  - parent1_student1
  - parent1_student2
```

### Option 3: Hybrid
```
Parent: parent1 (manual)
Student: 
  - ถ้า parent กรอก → ใช้ที่กรอก
  - ถ้าไม่กรอก → auto-generate
```

---

## 🎯 สรุปและคำแนะนำ

### ✅ แนวทางนี้ดีมาก!

**เหตุผล:**
1. Username unique → ไม่ซ้ำ, ง่ายต่อการ login
2. Email optional → Flexible
3. Parent มี email → รับแจ้งเตือนได้
4. Student ไม่ต้องมี email → ลดความซับซ้อน
5. Notification logic → ส่งไปหาผู้ปกครองอัตโนมัติ

### 📝 Implementation Steps:

1. **Schema Migration:**
   - เพิ่ม `username VARCHAR(100) UNIQUE NOT NULL`
   - แก้ `email` ให้เป็น `NULL`

2. **Login API:**
   - รองรับทั้ง username และ email
   - Query: `WHERE username = ? OR email = ?`

3. **Registration:**
   - Parent: ต้องกรอก username และ email
   - Student: ต้องกรอก username (email optional)

4. **Notification:**
   - ถ้า student มี email → ส่งไปหานักเรียน
   - ถ้าไม่มี → ส่งไปหาผู้ปกครอง

---

## 📊 ข้อมูลทดสอบ

### Users (7 users):
1. **Tutor 1**: username='tutor1', email='tutor1@kdcschool.com' (Fashion Island)
2. **Tutor 2**: username='tutor2', email='tutor2@kdcschool.com' (Fashion Island)
3. **Tutor 3**: username='tutor3', email='tutor3@kdcschool.com' (Saraburi) ⭐ NEW
4. **Parent 1**: username='parent1', email='parent1@example.com'
5. **Student 1**: username='student1_parent1', email=NULL (ลูกของ Parent 1)
6. **Parent 2**: username='parent2', email='parent2@example.com'
7. **Student 2**: username='student2_parent2', email=NULL (ลูกของ Parent 2)

### Tutors (3 tutors):
- Tutor 1 → Fashion Island → 2 courses
- Tutor 2 → Fashion Island → 2 courses
- Tutor 3 → Saraburi → 2 courses (จาก 4 คอร์สที่มี) ⭐ NEW

---

*อัปเดตล่าสุด: 2025-01-19*

