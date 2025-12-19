# 📊 Test Data Analysis & Design

**วันที่วิเคราะห์**: 2025-01-19

---

## 🎯 วัตถุประสงค์

สร้างข้อมูลทดสอบเพื่อ:
1. ทดสอบระบบผู้สอน (Tutors)
2. ทดสอบระบบนักเรียนและผู้ปกครอง (Students/Parents)
3. ทดสอบระบบการลงทะเบียนเรียน (Enrollments)
4. ทดสอบการแสดงผลในแต่ละหน้า

---

## 1. 📚 ระบบผู้สอน (Tutors)

### Schema Structure:
```sql
users (user_id) → tutors (tutor_id) → tutor_branches → tutor_courses
```

### ข้อมูลที่ต้องสร้าง:
- **2 ผู้สอน** สำหรับสาขาแฟชั่นไอส์แลนด์
- แต่ละคนสอน **2 คอร์ส**

### Design:
```
Tutor 1:
  - User: tutor1@kdcschool.com
  - Name: อาจารย์สมชาย ใจดี
  - Branch: แฟชั่นไอส์แลนด์
  - Courses: 
    * คอร์สโค้งสุดท้าย ป.6 สอบเข้า ม.1 ห้องปกติ-ทั่วไป
    * คณิตศาสตร์ ม.1

Tutor 2:
  - User: tutor2@kdcschool.com
  - Name: อาจารย์สมหญิง รักสอน
  - Branch: แฟชั่นไอส์แลนด์
  - Courses:
    * ภาษาอังกฤษ TOEIC
    * ฟิสิกส์ ม.4
```

---

## 2. 👨‍👩‍👧‍👦 ระบบนักเรียนและผู้ปกครอง (Students/Parents)

### ⚠️ ปัญหาที่ต้องวิเคราะห์:

**Option 1: User เดียว + Role Switching (ที่ผู้ใช้เสนอ)**
```
- ใช้ email ของผู้ปกครอง
- Login แล้วให้เลือก role (Parent หรือ Student)
- ระบบจะแสดงข้อมูลตาม role ที่เลือก
```

**ข้อดี:**
- ✅ ไม่ต้องจำ user หลายตัว
- ✅ ง่ายต่อการจัดการ
- ✅ UX ดี (ไม่ต้อง login หลายครั้ง)

**ข้อเสีย:**
- ❌ Schema ปัจจุบันใช้ `parent_students` table ที่ต้องการ `parent_id` และ `student_id` แยกกัน
- ❌ `enrollments` ใช้ `student_id` โดยตรง
- ❌ อาจซับซ้อนในการจัดการ session/state
- ❌ Security concerns (ต้องระวังการสลับ role)

**Option 2: User แยกกัน แต่ใช้ Email เดียวกัน (แนะนำ)**
```
Parent User:
  - Email: parent1@example.com
  - Role: parent
  - Name: คุณพ่อสมชาย ใจดี

Student User:
  - Email: parent1@example.com (same email)
  - Role: student
  - Name: เด็กชายสมชาย ใจดี (ลูก)
  
Relation:
  - parent_students table: parent_id → student_id
```

**ข้อดี:**
- ✅ รองรับ schema ปัจจุบันได้ดี
- ✅ `enrollments.student_id` ชัดเจน
- ✅ `parent_students` table ใช้งานได้ตามปกติ
- ✅ Security ดีกว่า (แยก user account)
- ✅ Login: ใช้ email เดียว แต่เลือก role (Parent/Student)

**ข้อเสีย:**
- ⚠️ ต้องสร้าง user 2 ตัว (แต่ใช้ email เดียว)

### 🎯 แนะนำ: **Option 2** (User แยกกัน แต่ใช้ Email เดียว)

**เหตุผล:**
1. Schema ปัจจุบันออกแบบมาให้รองรับ user แยกกัน
2. `enrollments` table ใช้ `student_id` โดยตรง
3. `parent_students` table ต้องการ `parent_id` และ `student_id` แยกกัน
4. Security: แยก user account ชัดเจน
5. Login: ใช้ email เดียว แต่ระบบจะแสดง user ทั้ง 2 (Parent และ Student) ให้เลือก

**Implementation:**
```typescript
// Login Flow:
1. User login ด้วย email: parent1@example.com
2. System query users WHERE email = 'parent1@example.com'
3. ถ้ามีหลาย user (Parent + Student) → แสดงหน้าเลือก role
4. ถ้ามี user เดียว → login ตรงๆ
5. เก็บ selected_role ใน session/cookie
```

---

## 3. 📝 ระบบการลงทะเบียนเรียน (Enrollments)

### Schema Structure:
```sql
enrollments:
  - student_id (FK → users)
  - course_id (FK → courses)
  - branch_id (FK → branches)
  - status (pending/active/completed/cancelled)
  - payment_id (FK → payments)
```

### ข้อมูลที่ต้องสร้าง:
- **2 นักเรียน** (แต่ละคนมีผู้ปกครอง)
- แต่ละคนลงทะเบียนเรียน **2 คอร์ส**
- เรียนคนละสาขา (เพื่อทดสอบการแยกข้อมูล)

### Design:
```
Student 1 (ลูกของ Parent 1):
  - Email: parent1@example.com (student role)
  - Name: เด็กชายสมชาย ใจดี
  - Enrollments:
    * คอร์สโค้งสุดท้าย ป.6 สอบเข้า ม.1 ห้องปกติ-ทั่วไป (สาขาแฟชั่นไอส์แลนด์)
    * คณิตศาสตร์ ม.1 (สาขาแฟชั่นไอส์แลนด์)

Student 2 (ลูกของ Parent 2):
  - Email: parent2@example.com (student role)
  - Name: เด็กหญิงสมหญิง รักเรียน
  - Enrollments:
    * ภาษาอังกฤษ TOEIC (สาขาแฟชั่นไอส์แลนด์)
    * ฟิสิกส์ ม.4 (สาขาแฟชั่นไอส์แลนด์)
```

---

## 4. 📋 สรุปข้อมูลที่ต้องสร้าง

### Users (6 users):
1. **Tutor 1**: tutor1@kdcschool.com (role: tutor)
2. **Tutor 2**: tutor2@kdcschool.com (role: tutor)
3. **Parent 1**: parent1@example.com (role: parent)
4. **Student 1**: parent1@example.com (role: student) - same email as Parent 1
5. **Parent 2**: parent2@example.com (role: parent)
6. **Student 2**: parent2@example.com (role: student) - same email as Parent 2

### Tutors (2 tutors):
1. Tutor 1 → สาขาแฟชั่นไอส์แลนด์ → 2 คอร์ส
2. Tutor 2 → สาขาแฟชั่นไอส์แลนด์ → 2 คอร์ส

### Parent-Student Relations (2 relations):
1. Parent 1 → Student 1
2. Parent 2 → Student 2

### Enrollments (4 enrollments):
1. Student 1 → Course 1 (สาขาแฟชั่นไอส์แลนด์)
2. Student 1 → Course 2 (สาขาแฟชั่นไอส์แลนด์)
3. Student 2 → Course 3 (สาขาแฟชั่นไอส์แลนด์)
4. Student 2 → Course 4 (สาขาแฟชั่นไอส์แลนด์)

### Payments (4 payments):
- แต่ละ enrollment ต้องมี payment (status: paid)

---

## 5. 🔐 Login Flow Design

### Scenario 1: Login ด้วย Email ที่มีทั้ง Parent และ Student
```
1. User login: parent1@example.com / password
2. System query: SELECT * FROM users WHERE email = 'parent1@example.com'
3. Result: 2 users (Parent + Student)
4. Show role selection page:
   ┌─────────────────────────┐
   │ เลือกบัญชีที่ต้องการเข้า │
   ├─────────────────────────┤
   │ 👤 คุณพ่อสมชาย ใจดี      │
   │    (Parent)              │
   ├─────────────────────────┤
   │ 🎓 เด็กชายสมชาย ใจดี      │
   │    (Student)             │
   └─────────────────────────┘
5. User เลือก role → Login ด้วย user_id ที่เลือก
6. Store selected_user_id ใน session
```

### Scenario 2: Login ด้วย Email ที่มี User เดียว
```
1. User login: tutor1@kdcschool.com / password
2. System query: SELECT * FROM users WHERE email = 'tutor1@kdcschool.com'
3. Result: 1 user (Tutor)
4. Login ตรงๆ ไม่ต้องเลือก role
```

---

## 6. 📊 ข้อมูลสำหรับทดสอบแต่ละหน้า

### หน้า Admin Dashboard:
- ✅ ดู Tutors: 2 คน
- ✅ ดู Students: 2 คน
- ✅ ดู Enrollments: 4 enrollments
- ✅ ดู Courses: 10 courses (6 แฟชั่นไอส์แลนด์ + 4 สระบุรี)

### หน้า Student Dashboard:
- ✅ ดูคอร์สเรียนของฉัน: 2 คอร์ส
- ✅ ดูความคืบหน้า
- ✅ ดูการชำระเงิน

### หน้า Parent Dashboard:
- ✅ ดูคอร์สเรียนของลูก: 2 คอร์ส
- ✅ ดูความคืบหน้าของลูก
- ✅ ดูการชำระเงิน

### หน้า Tutor Dashboard:
- ✅ ดูคอร์สที่สอน: 2 คอร์ส
- ✅ ดูนักเรียนในแต่ละคอร์ส

---

## 7. ✅ สรุป

### ข้อเสนอแนะ:
1. **ใช้ User แยกกัน** แต่ใช้ **Email เดียวกัน** สำหรับ Parent และ Student
2. **Login Flow**: ถ้า email มีหลาย user → แสดงหน้าเลือก role
3. **Schema**: รองรับ schema ปัจจุบันได้ดี
4. **Security**: แยก user account ชัดเจน

### ข้อมูลที่ต้องสร้าง:
- ✅ 6 Users (2 Tutors + 2 Parents + 2 Students)
- ✅ 2 Tutors (แต่ละคนสอน 2 คอร์ส)
- ✅ 2 Parent-Student Relations
- ✅ 4 Enrollments (แต่ละ student ลง 2 คอร์ส)
- ✅ 4 Payments (แต่ละ enrollment มี payment)

---

*อัปเดตล่าสุด: 2025-01-19*

