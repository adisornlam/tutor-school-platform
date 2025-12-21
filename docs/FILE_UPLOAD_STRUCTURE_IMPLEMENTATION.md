# 📁 การปรับปรุงโครงสร้างการจัดเก็บไฟล์อัพโหลด

## ✅ สิ่งที่ทำเสร็จแล้ว

### 1. ปรับ API Endpoint (`/api/admin/upload`)

**Query Parameters:**
- `entityType` (required): `'courses'`, `'articles'`, `'testimonials'`, `'users'`
- `entityId` (optional): ID ของ entity (required สำหรับ thumbnail, featured, avatar)
- `fileType` (optional, default: `'content'`): `'thumbnail'`, `'featured'`, `'avatar'`, `'content'`

**โครงสร้างใหม่:**
```
public/uploads/
├── courses/
│   ├── {courseId}/
│   │   ├── thumbnail.{ext}        # รูปปกคอร์ส
│   │   ├── content-{timestamp}.{ext}  # รูปในรายละเอียด
│   │   └── ...
│   └── _unmapped/                 # ไฟล์ที่ไม่สามารถ map ได้
├── articles/
│   ├── {articleId}/
│   │   ├── featured.{ext}         # รูปปกบทความ
│   │   └── content-{timestamp}.{ext}
│   └── ...
└── testimonials/
    ├── {testimonialId}/
    │   └── avatar.{ext}           # รูป Avatar
    └── ...
```

### 2. Update Components

**RichTextEditor:**
- เพิ่ม props: `entityType`, `entityId`
- ส่ง query parameters เมื่ออัพโหลดรูป content

**CourseModal:**
- ส่ง `entityType=courses`, `fileType=thumbnail`, `entityId` (ถ้ามี)
- ส่ง `entityType` และ `entityId` ให้ RichTextEditor

**ArticleModal:**
- ส่ง `entityType=articles`, `fileType=featured`, `entityId` (ถ้ามี)
- ส่ง `entityType` และ `entityId` ให้ RichTextEditor

**TestimonialModal:**
- ส่ง `entityType=testimonials`, `fileType=avatar`, `entityId` (ถ้ามี)

**Course Edit Page (`/admin/courses/[id]/edit`):**
- ส่ง `entityType=courses`, `fileType=thumbnail`, `entityId` เมื่ออัพโหลด thumbnail
- ส่ง `entityType` และ `entityId` ให้ RichTextEditor

### 3. Migration Script

**Script:** `scripts/migrate-file-structure.ts`

**ฟังก์ชัน:**
- อ่านไฟล์ทั้งหมดจาก `public/uploads/courses/`
- Map ไฟล์กับ course ID จาก database (ใช้ `thumbnail_url`)
- ย้ายไฟล์ไปยังโครงสร้างใหม่: `courses/{courseId}/`
- ไฟล์ที่ไม่สามารถ map ได้จะถูกย้ายไป `courses/_unmapped/`
- อัพเดต `thumbnail_url` ใน database ให้ชี้ไปยัง path ใหม่

**วิธีรัน:**
```bash
bun run migrate:file-structure
```

---

## 🎯 ข้อดีของโครงสร้างใหม่

1. **Performance**: แยกไฟล์ตาม entity ID → ลดจำนวนไฟล์ในแต่ละโฟลเดอร์
2. **การจัดการ**: ง่ายต่อการลบ/ย้าย/สำรองข้อมูล
3. **การจัดระเบียบ**: รูปภาพทั้งหมดของ entity อยู่ที่เดียวกัน
4. **Scalability**: รองรับการเติบโตในอนาคต

---

## 📝 การใช้งาน

### การอัพโหลด Thumbnail (Course)
```typescript
// เมื่อสร้างใหม่ (ไม่มี entityId)
const url = `/admin/upload?entityType=courses&fileType=thumbnail`

// เมื่อแก้ไข (มี entityId)
const url = `/admin/upload?entityType=courses&fileType=thumbnail&entityId=1`
```

### การอัพโหลด Content Image (RichTextEditor)
```vue
<RichTextEditor
  v-model="form.description"
  entity-type="courses"
  :entity-id="courseId"
/>
```

---

## ⚠️ หมายเหตุ

1. **Backward Compatibility**: ไฟล์เก่ายังใช้ได้ (ผ่าน migration script)
2. **Content Images เมื่อสร้างใหม่**: ถ้ายังไม่มี entityId จะถูกเก็บใน `uploads/{entityType}/` และสามารถย้ายได้ภายหลัง
3. **File Naming**:
   - `thumbnail.{ext}` - จะ overwrite ถ้ามี
   - `featured.{ext}` - จะ overwrite ถ้ามี
   - `avatar.{ext}` - จะ overwrite ถ้ามี
   - `content-{timestamp}.{ext}` - ไม่ซ้ำกัน

---

## 🚀 ขั้นตอนต่อไป

1. รัน migration script เพื่อย้ายไฟล์เก่า
2. ทดสอบการอัพโหลดไฟล์ในรูปแบบใหม่
3. ตรวจสอบว่าไฟล์ทั้งหมดถูกจัดเก็บอย่างถูกต้อง

