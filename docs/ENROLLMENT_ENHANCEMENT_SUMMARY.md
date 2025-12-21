# สรุปการวิเคราะห์ระบบการลงทะเบียน

## ✅ สรุปสิ่งที่ต้องเพิ่ม

### 1. Database (ตารางใหม่ + แก้ไข)
- ✅ ตาราง `user_addresses` - เก็บที่อยู่ผู้เรียนสำหรับส่งเอกสาร
- ✅ เพิ่ม `enrollment_type` (onsite/online) ใน `enrollments`
- ✅ เพิ่ม `shipping_address_id` ใน `enrollments`
- ✅ เพิ่ม `onsite_price`, `online_price` ใน `courses`

### 2. Frontend Components
- ✅ SearchableSelect Component - สำหรับค้นหานักเรียน
- ✅ AddressForm Component - Form เพิ่ม/แก้ไขที่อยู่
- ✅ AddressSelect Component - เลือกที่อยู่
- ✅ แก้ไข EnrollmentModal - เปลี่ยน student select เป็น searchable

### 3. Pages
- ✅ หน้า Course Detail - เพิ่มปุ่ม "สมัครเรียนออนไลน์"
- ✅ หน้า Enrollment Edit/Detail - แสดง enrollment_type และ shipping address

### 4. API
- ✅ User Addresses API (CRUD)
- ✅ Student Search API
- ✅ Update Enrollment API

---

ดูรายละเอียดเต็มได้ที่: `docs/ENROLLMENT_ENHANCEMENT_ANALYSIS.md`

