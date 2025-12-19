# 🔧 i18n Fix Documentation

## ⚠️ ปัญหา

Error: `The requested module does not provide an export named 'getActiveHead'`

**สาเหตุ**: 
- `@nuxtjs/i18n` version 8.5.6 ใช้ `unhead` v1.8.8
- Nuxt 4 ใช้ `unhead` v2.0.19
- `@nuxtjs/i18n` ใช้ `getActiveHead` ซึ่งไม่มีใน unhead v2

---

## ✅ วิธีแก้ไข

### 1. ปิด @nuxtjs/i18n ชั่วคราว

```typescript
// nuxt.config.ts
modules: [
  '@nuxtjs/tailwindcss',
  '@pinia/nuxt',
  // '@nuxtjs/i18n', // Temporarily disabled
  '@vueuse/nuxt'
]
```

### 2. เพิ่ม Dummy i18n Config ใน runtimeConfig

แม้ว่า `@nuxtjs/i18n` จะถูกปิด แต่ plugin files ยังอยู่ใน `node_modules` และอาจพยายามเข้าถึง `$config.public.i18n`

```typescript
// nuxt.config.ts
runtimeConfig: {
  public: {
    apiBase: process.env.API_BASE || '/api',
    appName: 'KDC Tutor School',
    appVersion: '1.0.0',
    // Dummy i18n config to prevent errors from @nuxtjs/i18n plugins
    i18n: {
      configLocales: [],
      defaultLocale: 'th',
      strategy: 'prefix_except_default',
      differentDomains: false,
      multiDomainLocales: [],
      skipSettingLocaleOnNavigate: false,
      rootRedirect: null,
      routesNameSeparator: '___',
      defaultLocaleRouteNameSuffix: 'default',
      defaultDirection: 'ltr',
      experimental: {
        switchLocalePathLinkSSR: false
      }
    }
  }
}
```

### 3. สร้าง Custom i18n Composable

สร้าง `app/composables/useI18n.ts` ที่ใช้ translations แบบ embedded เพื่อหลีกเลี่ยงปัญหา SSR

### 4. อัปเดตไฟล์ที่ใช้ i18n

- เปลี่ยนจาก `$t()` เป็น `t()` ใน template
- ใช้ `const { t } = useI18n()` ใน script

---

## 📝 ไฟล์ที่แก้ไข

1. **nuxt.config.ts**: ปิด `@nuxtjs/i18n` module
2. **app/composables/useI18n.ts**: สร้าง custom i18n composable
3. **app/plugins/i18n.client.ts**: Client-side plugin สำหรับ i18n
4. **app/app.vue**: ใช้ `onMounted` สำหรับ client-side only
5. **app/layouts/default.vue**: เปลี่ยนจาก `$t()` เป็น `t()`
6. **app/error.vue**: เปลี่ยนจาก `$t()` เป็น `t()`

---

## 🔄 ถ้าต้องการใช้ @nuxtjs/i18n

เมื่อ `@nuxtjs/i18n` รองรับ Nuxt 4 แล้ว:

1. **อัปเดต @nuxtjs/i18n**:
   ```bash
   bun add @nuxtjs/i18n@latest
   ```

2. **เปิด module ใน nuxt.config.ts**:
   ```typescript
   modules: [
     '@nuxtjs/i18n',
     // ...
   ]
   ```

3. **ลบ custom composable**:
   - ลบ `app/composables/useI18n.ts`
   - ลบ `app/plugins/i18n.client.ts`
   - เปลี่ยนกลับเป็น `$t()` ใน templates

---

## 📌 หมายเหตุ

- Custom i18n solution นี้เป็น temporary workaround
- ใช้ translations แบบ embedded เพื่อหลีกเลี่ยงปัญหา SSR
- รองรับ TH/EN 2 ภาษา
- ใช้ `useState` สำหรับ locale persistence

---

*i18n Fix Documentation*

