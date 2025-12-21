# 📊 Dashboard Role-Based Analysis

## 🎯 ภาพรวม

Dashboard ควรแสดงข้อมูลที่แตกต่างกันตาม role ของผู้ใช้งาน โดยเน้นที่ข้อมูลที่เกี่ยวข้องและมีประโยชน์ต่อการทำงานของแต่ละ role

---

## 👥 Roles และความต้องการ

### 1. **system_admin** (ผู้ดูแลระบบ)
**อำนาจ**: จัดการระบบทั้งหมด

**ควรเห็น**:
- 📊 **ภาพรวมระบบทั้งหมด** (ทุกสาขา)
- 👥 จำนวนผู้ใช้ทั้งหมด (แยกตาม role)
- 📚 จำนวนคอร์สทั้งหมด
- 💰 รายได้รวมทั้งหมด (ทุกสาขา)
- 📈 กราฟรายได้รายเดือน/รายปี
- 🎓 จำนวนการลงทะเบียนทั้งหมด
- ⚠️ การแจ้งเตือนระบบ (system alerts)
- 🔔 กิจกรรมล่าสุด (recent activities)
- 📋 รายงานสรุป (summary reports)

**Feature Cards**:
- Total Users (แยก role)
- Total Courses
- Total Enrollments
- Total Revenue
- Active Branches
- System Health

---

### 2. **owner** (เจ้าของ)
**อำนาจ**: ดูภาพรวมและวิเคราะห์

**ควรเห็น**:
- 📊 **ภาพรวมธุรกิจทั้งหมด** (ทุกสาขา)
- 💰 รายได้รวมทั้งหมด
- 📈 กราฟรายได้รายเดือน/รายปี
- 📊 การเปรียบเทียบสาขา (branch comparison)
- 🎓 จำนวนการลงทะเบียนทั้งหมด
- 👥 จำนวนนักเรียนทั้งหมด
- 📚 จำนวนคอร์สทั้งหมด
- 📉 คอร์สที่ขายดีที่สุด (top courses)
- 📊 การวิเคราะห์เทรนด์
- 💡 คำแนะนำธุรกิจ (business insights)

**Feature Cards**:
- Total Revenue (with trends)
- Total Students
- Total Enrollments
- Top Performing Courses
- Branch Performance Comparison
- Growth Metrics

---

### 3. **admin** (Admin กลาง)
**อำนาจ**: จัดการได้ทั้ง 2 สาขา (แต่ไม่จัดการระบบ)

**ควรเห็น**:
- 📊 **ภาพรวมทั้ง 2 สาขา**
- 👥 จำนวนนักเรียนทั้งหมด (ทั้ง 2 สาขา)
- 📚 จำนวนคอร์สทั้งหมด
- 💰 รายได้รวม (ทั้ง 2 สาขา)
- 🎓 จำนวนการลงทะเบียนล่าสุด
- 📋 รายการงานที่ต้องทำ (pending tasks)
- 🔔 การแจ้งเตือนที่เกี่ยวข้อง
- 📈 สถิติการลงทะเบียนรายเดือน
- 💳 การชำระเงินที่รอการอนุมัติ

**Feature Cards**:
- Total Students (both branches)
- Total Courses
- Total Enrollments
- Total Revenue (both branches)
- Pending Payments
- Recent Enrollments

---

### 4. **branch_admin** (ผู้ดูแลสาขา)
**อำนาจ**: จัดการสาขาเดียว

**ควรเห็น**:
- 📊 **ภาพรวมสาขา**
- 👥 จำนวนนักเรียนในสาขา
- 📚 จำนวนคอร์สในสาขา
- 💰 รายได้สาขา
- 🎓 จำนวนการลงทะเบียนล่าสุด (สาขา)
- 📋 รายการงานที่ต้องทำ (สาขา)
- 🔔 การแจ้งเตือนที่เกี่ยวข้อง
- 📈 สถิติการลงทะเบียนรายเดือน (สาขา)
- 💳 การชำระเงินที่รอการอนุมัติ (สาขา)
- 👨‍🏫 อาจารย์ในสาขา

**Feature Cards**:
- Branch Students
- Branch Courses
- Branch Enrollments
- Branch Revenue
- Pending Payments
- Active Tutors

---

### 5. **tutor** (อาจารย์)
**อำนาจ**: ดูและจัดการข้อมูลการสอน

**ควรเห็น**:
- 📚 **คอร์สที่สอน**
- 👥 จำนวนนักเรียนที่สอน
- 📋 ตารางสอนล่าสุด
- ✅ การบ้านที่ต้องตรวจ
- 📊 สถิติการสอน (จำนวนชั่วโมง, จำนวนนักเรียน)
- 📈 คะแนนเฉลี่ยของนักเรียน
- 🔔 การแจ้งเตือนจากนักเรียน
- 💬 ข้อความ/คำถามล่าสุด
- 📝 รายการงานที่ต้องทำ

**Feature Cards**:
- My Courses
- My Students
- Pending Assignments
- Today's Schedule
- Teaching Hours
- Student Performance

---

### 6. **parent** (ผู้ปกครอง)
**อำนาจ**: ดูข้อมูลของบุตรหลาน

**ควรเห็น**:
- 👨‍🎓 **บุตรหลานที่ดูแล**
- 📚 คอร์สที่เรียนอยู่
- 📊 ความคืบหน้าการเรียน (progress)
- ✅ การบ้านที่ต้องส่ง
- 📈 คะแนน/ผลการเรียน
- 📅 ตารางเรียน
- 💰 สถานะการชำระเงิน
- 🔔 การแจ้งเตือน

**Feature Cards**:
- My Children
- Active Courses
- Study Progress
- Pending Assignments
- Payment Status
- Upcoming Classes

---

### 7. **student** (นักเรียน)
**อำนาจ**: ดูข้อมูลการเรียนของตัวเอง

**ควรเห็น**:
- 📚 **คอร์สที่เรียนอยู่**
- 📊 ความคืบหน้าการเรียน (progress)
- ✅ การบ้านที่ต้องส่ง
- 📈 คะแนน/ผลการเรียน
- 📅 ตารางเรียน
- 🎯 เป้าหมายการเรียน
- 💰 สถานะการชำระเงิน
- 🔔 การแจ้งเตือน

**Feature Cards**:
- My Courses
- Study Progress
- Pending Assignments
- My Grades
- Upcoming Classes
- Payment Status

---

## 📋 สรุป Dashboard Structure

### Dashboard Sections (Common)

1. **Header/Welcome Section**
   - ชื่อผู้ใช้
   - Role badge
   - วัน/เวลาปัจจุบัน

2. **Stats Cards** (4-6 cards)
   - Key metrics
   - Icons
   - Trend indicators (if applicable)

3. **Charts/Graphs** (if applicable)
   - Revenue trends
   - Enrollment trends
   - Performance metrics

4. **Recent Activities/Tasks**
   - List of recent items
   - Quick actions

5. **Notifications/Alerts**
   - Important notifications
   - System alerts

---

## 🔧 Technical Implementation

### 1. API Endpoints Structure

```
GET /api/admin/dashboard
  - Query params: role-based filtering
  - Returns: dashboard data based on user role
```

### 2. Components Structure

```
app/pages/admin/index.vue (Admin Dashboard)
  ├── DashboardHeader.vue
  ├── DashboardStats.vue (role-based stats)
  ├── DashboardCharts.vue (if applicable)
  ├── RecentActivities.vue
  └── NotificationsPanel.vue

app/pages/tutor/index.vue (Tutor Dashboard)
app/pages/student/index.vue (Student Dashboard)
app/pages/parent/index.vue (Parent Dashboard)
```

### 3. Data Fetching Logic

- Fetch dashboard data based on user role
- Filter data by branch (for branch_admin)
- Aggregate data (for system_admin, owner, admin)

---

## 📊 Dashboard Data Requirements

### System Admin / Owner
- Total users (by role)
- Total courses
- Total enrollments
- Total revenue
- Active branches
- Recent enrollments (all branches)
- Recent payments (all branches)
- System health metrics

### Admin (กลาง)
- Total students (both branches)
- Total courses
- Total enrollments (both branches)
- Total revenue (both branches)
- Recent enrollments (both branches)
- Pending payments (both branches)

### Branch Admin
- Branch students
- Branch courses
- Branch enrollments
- Branch revenue
- Recent enrollments (branch)
- Pending payments (branch)
- Active tutors (branch)

### Tutor
- My courses count
- My students count
- Pending assignments count
- Today's schedule
- Teaching hours (this month)
- Student performance metrics

### Parent / Student
- Active courses
- Study progress
- Pending assignments
- Grades/Performance
- Upcoming classes
- Payment status

---

## 🎨 UI/UX Considerations

1. **Role-based Color Coding**
   - system_admin: Red/Purple
   - owner: Gold
   - admin: Blue
   - branch_admin: Green
   - tutor: Orange
   - parent/student: Light blue

2. **Responsive Design**
   - Mobile-friendly
   - Grid layout for stats cards
   - Charts responsive

3. **Loading States**
   - Skeleton loaders
   - Progressive loading

4. **Empty States**
   - Friendly messages
   - Action buttons

---

*Last updated: 2025-01-20*

