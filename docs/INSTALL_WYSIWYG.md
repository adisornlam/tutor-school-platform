# ติดตั้ง WYSIWYG Editor (TipTap)

## คำสั่งที่ต้องรัน:

```bash
bun add @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-text-align @tiptap/extension-underline
```

หรือใช้ npm:

```bash
npm install @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-text-align @tiptap/extension-underline
```

**หมายเหตุ**: ถ้า `@tiptap/extension-underline` ไม่มี ให้ติดตั้ง `@tiptap/extension-underline` หรือใช้วิธีอื่นในการเพิ่ม underline (อาจจะต้องสร้าง extension เอง)

## สิ่งที่ทำแล้ว:

1. ✅ สร้าง API endpoint `/api/admin/upload` สำหรับอัปโหลดรูปภาพ
2. ✅ สร้าง RichTextEditor component (`app/components/RichTextEditor.vue`)
3. ✅ แก้ไข CourseModal.vue - เพิ่ม file upload, ตัด gallery, ใช้ WYSIWYG
4. ⏳ กำลังแก้ไข Edit Page
5. ⏳ กำลังแก้ไข Detail Page
6. ⏳ กำลังแก้ไข API endpoints

## หลังจากติดตั้ง packages แล้ว:

1. Restart dev server
2. ทดสอบการอัปโหลดรูปภาพปก
3. ทดสอบ WYSIWYG editor ในคำอธิบาย

