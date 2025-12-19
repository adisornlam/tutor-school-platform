# 👥 Test Users สำหรับทดสอบระบบ

## 🔐 Admin Users

### System Administrator
- **Email**: `admin@kdcschool.com`
- **Password**: `admin123`
- **Role**: `system_admin`
- **Permissions**: จัดการระบบทั้งหมด, จัดการทุกสาขา, จัดการผู้ใช้ทั้งหมด

### Owner
- **Email**: `owner@kdcschool.com`
- **Password**: `owner123`
- **Role**: `owner`
- **Permissions**: เข้าถึงทุกอย่าง, ดู Dashboard ภาพรวม, วิเคราะห์รายได้

---

## 📝 วิธีใช้งาน

### 1. Login ผ่าน API
```bash
# Login as Admin
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kdcschool.com",
    "password": "admin123"
  }'

# Login as Owner
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@kdcschool.com",
    "password": "owner123"
  }'
```

### 2. Login ผ่าน Frontend
1. เปิดเบราว์เซอร์ไปที่: http://localhost:4000
2. ไปที่หน้า Login: http://localhost:4000/auth/login
3. ใช้ credentials ด้านบน

---

## ⚠️ ข้อควรระวัง

1. **เปลี่ยน Password**: ควรเปลี่ยน password หลังจาก login ครั้งแรก
2. **Production**: ห้ามใช้ credentials เหล่านี้ใน production
3. **Security**: Passwords เหล่านี้เป็น default passwords สำหรับ development เท่านั้น

---

## 🔧 สร้าง Test Users เพิ่มเติม

### สร้าง Admin
```bash
bun run db:create-admin
```

### สร้าง Owner
```bash
bun run db:create-owner
```

---

## 📋 User Roles

ระบบรองรับ 6 roles:
1. **student** - นักเรียน
2. **tutor** - อาจารย์
3. **parent** - ผู้ปกครอง
4. **branch_admin** - ผู้ดูแลสาขา
5. **system_admin** - ผู้ดูแลระบบ (admin@kdcschool.com)
6. **owner** - เจ้าของ (owner@kdcschool.com)

---

*Test users created for development purposes only*

