# 🔧 Unhead Error Fix

## ⚠️ ปัญหา

Error: `The requested module does not provide an export named 'getActiveHead'`

**สาเหตุ**: 
- `@nuxt/ui` ยังติดตั้งอยู่ใน `node_modules` แม้จะปิดใน `nuxt.config.ts` แล้ว
- `@nuxtjs/i18n` ใช้ `unhead` และอาจมี version mismatch

---

## ✅ วิธีแก้ไข

### 1. ลบ @nuxt/ui จาก dependencies (แนะนำ)

```bash
bun remove @nuxt/ui
```

หรือแก้ไข `package.json`:
```json
{
  "dependencies": {
    // "@nuxt/ui": "^2.18.2", // Temporarily disabled
    "@nuxtjs/i18n": "^8.0.0",
    ...
  }
}
```

### 2. ลบ node_modules และ reinstall

```bash
rm -rf node_modules bun.lock
bun install
```

### 3. ลบ cache

```bash
rm -rf .nuxt .output node_modules/.vite node_modules/.cache
```

### 4. Restart dev server

```bash
bun run dev
```

---

## 🔍 ตรวจสอบ

### ตรวจสอบว่า @nuxt/ui ถูกลบแล้ว

```bash
grep -r "@nuxt/ui" node_modules/.package-lock.json 2>/dev/null | head -5
```

### ตรวจสอบ unhead version

```bash
cat node_modules/@nuxtjs/i18n/package.json | grep unhead
```

---

## 📝 หมายเหตุ

- `@nuxt/ui` ถูกปิดชั่วคราวเพราะยังไม่ fully compatible กับ Nuxt 4
- ใช้ Tailwind CSS โดยตรงแทน (ซึ่งทำงานได้ดีอยู่แล้ว)
- เมื่อ `@nuxt/ui` รองรับ Nuxt 4 แล้ว สามารถติดตั้งกลับมาได้

---

## 🔄 ถ้ายังมีปัญหา

1. **ตรวจสอบ unhead version ใน @nuxtjs/i18n**:
   ```bash
   cat node_modules/@nuxtjs/i18n/package.json | grep -A 2 unhead
   ```

2. **อัปเดต @nuxtjs/i18n**:
   ```bash
   bun add @nuxtjs/i18n@latest
   ```

3. **เพิ่ม unhead config ใน nuxt.config.ts** (ทำแล้ว):
   ```typescript
   export default defineNuxtConfig({
     unhead: {
       compatibility: {
         // Enable compatibility mode for modules using unhead v1
       }
     }
   })
   ```

4. **อัปเดต @nuxtjs/i18n** (ถ้ายังมีปัญหา):
   ```bash
   bun add @nuxtjs/i18n@latest
   ```
   
   หรือรอให้ `@nuxtjs/i18n` อัปเดตให้รองรับ unhead v2

---

*Unhead Error Fix Documentation*

