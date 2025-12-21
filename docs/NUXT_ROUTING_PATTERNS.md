# Nuxt Routing Patterns - Best Practices

## 📋 หลักการออกแบบโครงสร้าง Route สำหรับ Dynamic Parameters

### ❌ โครงสร้างที่ผิด (ทำให้เกิด Route Conflict)

เมื่อต้องการมี detail page (`[id].vue`) และ child routes (เช่น `edit.vue`) พร้อมกัน **ไม่ควรใช้โครงสร้างนี้:**

```
app/pages/admin/courses/
  ├── [id].vue          ❌ จะ conflict กับ [id]/edit.vue
  └── [id]/
      └── edit.vue
```

**ปัญหาที่เกิดขึ้น:**
- Nuxt จะไม่สามารถ match route `/admin/courses/:id/edit` ได้
- Route `/admin/courses/:id` อาจจะ match ก่อน ทำให้ edit page ไม่ทำงาน
- เกิด 404 error เมื่อพยายามเข้า `/admin/courses/:id/edit`

---

### ✅ โครงสร้างที่ถูกต้อง (Recommended Pattern)

**ให้ใช้โครงสร้างนี้แทน:**

```
app/pages/admin/courses/
  └── [id]/
      ├── index.vue     ✅ → /admin/courses/:id (Detail page)
      └── edit.vue      ✅ → /admin/courses/:id/edit (Edit page)
```

**หรือถ้ามีหลาย child routes:**

```
app/pages/admin/courses/
  └── [id]/
      ├── index.vue     ✅ → /admin/courses/:id
      ├── edit.vue      ✅ → /admin/courses/:id/edit
      └── settings.vue  ✅ → /admin/courses/:id/settings
```

---

## 🎯 หลักการสำคัญ

### 1. **Dynamic Parameter Routes ต้องอยู่ใน Directory**

เมื่อ route มี dynamic parameter (`[id]`) และต้องการมี child routes:
- ✅ **ใช้:** `[id]/index.vue` สำหรับ detail page
- ❌ **ไม่ใช้:** `[id].vue` เมื่อมี child routes

### 2. **Child Routes อยู่ข้างใน Directory เดียวกัน**

Child routes (เช่น `edit.vue`, `settings.vue`) ต้องอยู่ใน directory เดียวกับ `index.vue`:
```
[id]/
  ├── index.vue    (parent route)
  └── edit.vue     (child route)
```

### 3. **Route Matching Priority**

Nuxt จะ match routes ตามลำดับความเฉพาะเจาะจง:
1. Static routes (เช่น `edit.vue` ใน `[id]/`) → `/admin/courses/:id/edit`
2. Dynamic routes with index (เช่น `[id]/index.vue`) → `/admin/courses/:id`

---

## 📝 ตัวอย่างการใช้งาน

### ตัวอย่างที่ 1: Courses Management

```
app/pages/admin/courses/
  ├── index.vue              → /admin/courses (List page)
  └── [id]/
      ├── index.vue          → /admin/courses/:id (Detail page)
      └── edit.vue           → /admin/courses/:id/edit (Edit page)
```

### ตัวอย่างที่ 2: Students Management

```
app/pages/admin/students/
  ├── index.vue              → /admin/students (List page)
  └── [id]/
      ├── index.vue          → /admin/students/:id (Detail page)
      └── edit.vue           → /admin/students/:id/edit (Edit page)
```

### ตัวอย่างที่ 3: Enrollments with Multiple Child Routes

```
app/pages/admin/enrollments/
  ├── index.vue              → /admin/enrollments (List page)
  └── [id]/
      ├── index.vue          → /admin/enrollments/:id (Detail page)
      ├── edit.vue           → /admin/enrollments/:id/edit
      ├── payments.vue       → /admin/enrollments/:id/payments
      └── history.vue        → /admin/enrollments/:id/history
```

### ตัวอย่างที่ 4: Nested Dynamic Routes

```
app/pages/admin/courses/
  └── [courseId]/
      └── sessions/
          ├── index.vue      → /admin/courses/:courseId/sessions (List)
          └── [sessionId]/
              ├── index.vue  → /admin/courses/:courseId/sessions/:sessionId
              └── edit.vue   → /admin/courses/:courseId/sessions/:sessionId/edit
```

---

## 🔧 การแก้ไข Route ที่มีปัญหาอยู่แล้ว

### ขั้นตอนการย้าย Route

1. **สร้าง directory สำหรับ dynamic parameter:**
   ```bash
   mkdir -p app/pages/admin/courses/[id]
   ```

2. **ย้าย detail page เป็น index.vue:**
   ```bash
   mv app/pages/admin/courses/[id].vue app/pages/admin/courses/[id]/index.vue
   ```

3. **ตรวจสอบว่า child routes อยู่ใน directory ที่ถูกต้อง:**
   ```bash
   # ตรวจสอบ structure
   ls -la app/pages/admin/courses/[id]/
   # ควรเห็น:
   # - index.vue
   # - edit.vue (ถ้ามี)
   ```

4. **Restart Nuxt Dev Server:**
   - Nuxt จะ rebuild routes ใหม่
   - ตรวจสอบว่า routes ถูก register ถูกต้อง

---

## ⚠️ สิ่งที่ต้องระวัง

### 1. **ไม่ใช้ `validate` เพื่อบังคับ route matching**

❌ **ไม่ควรใช้:**
```typescript
// app/pages/admin/courses/[id].vue
definePageMeta({
  validate: async (route) => {
    return !route.path.endsWith('/edit')  // ❌ ใช้โครงสร้างที่ถูกต้องแทน
  }
})
```

✅ **ให้แก้โครงสร้างไฟล์แทน:**
```
[id]/
  ├── index.vue  (ไม่มี validate)
  └── edit.vue
```

### 2. **ไม่ใช้ `alias` เพื่อแก้ปัญหา route conflict**

❌ **ไม่ควรใช้:**
```typescript
// app/pages/admin/courses/[id]/edit.vue
definePageMeta({
  alias: '/admin/courses/:id/edit'  // ❌ ใช้โครงสร้างที่ถูกต้องแทน
})
```

✅ **โครงสร้างไฟล์ที่ถูกต้องจะทำงานได้เอง**

### 3. **ตรวจสอบ Navigation Links**

หลังจากเปลี่ยนโครงสร้าง ตรวจสอบว่า navigation links ยังถูกต้อง:
```vue
<!-- ✅ ถูกต้อง -->
<NuxtLink :to="`/admin/courses/${id}`">Detail</NuxtLink>
<NuxtLink :to="`/admin/courses/${id}/edit`">Edit</NuxtLink>

<!-- ❌ ผิด (ถ้าใช้ [id].vue แทน [id]/index.vue) -->
<NuxtLink :to="`/admin/courses/${id}`">Detail</NuxtLink>
```

---

## 🎓 สรุปกฎทอง (Golden Rules)

1. ✅ **เมื่อมี Dynamic Parameter + Child Routes → ใช้ `[param]/index.vue`**
2. ✅ **Child Routes อยู่ข้างใน directory เดียวกับ index.vue**
3. ✅ **ใช้โครงสร้างไฟล์แก้ปัญหา ไม่ใช่ validate หรือ alias**
4. ✅ **Restart dev server หลังจากเปลี่ยนโครงสร้าง**

---

## 📚 References

- Nuxt 4 Routing Documentation
- File-based Routing Patterns
- Dynamic Route Matching

---

**อัพเดท:** 2024-12-20  
**สร้างจาก:** การแก้ปัญหา route conflict ใน courses และ students management pages

