# โครงสร้างโปรเจกต์ Nuxt 4 สำหรับ Tutor School Platform

> **อัปเดตล่าสุด**: ตาม [Nuxt 4 Documentation](https://nuxt.com/docs/4.x)

## 📁 โครงสร้าง Directory ตาม Nuxt 4

ตามเอกสาร [Nuxt 4 Directory Structure](https://nuxt.com/docs/4.x/directory-structure) โครงสร้างที่ถูกต้องคือ:

```
Tutor-School-Platform/
├── .nuxt/                    # Nuxt build output (auto-generated)
├── .output/                   # Production build output
├── .env                       # Environment variables
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── .nuxtignore                # Nuxt ignore rules
├── .nuxtrc                    # Nuxt configuration (alternative syntax)
├── nuxt.config.ts             # Main Nuxt configuration
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript configuration
│
├── app/                       # ⭐ Main application directory
│   ├── assets/               # Assets processed by build tool (Vite)
│   │   ├── css/
│   │   │   ├── main.css
│   │   │   └── variables.css
│   │   ├── images/
│   │   └── fonts/
│   │
│   ├── components/           # Vue components
│   │   ├── common/          # Reusable components
│   │   │   ├── Button.vue
│   │   │   ├── Card.vue
│   │   │   ├── Input.vue
│   │   │   ├── Modal.vue
│   │   │   └── Loading.vue
│   │   ├── auth/            # Authentication components
│   │   │   ├── LoginForm.vue
│   │   │   └── RegisterForm.vue
│   │   ├── courses/         # Course-related components
│   │   │   ├── CourseCard.vue
│   │   │   ├── CourseFilter.vue
│   │   │   └── CourseDetail.vue
│   │   ├── learning/        # Learning components
│   │   │   ├── VideoPlayer.vue
│   │   │   └── ProgressBar.vue
│   │   └── admin/           # Admin components
│   │       ├── Dashboard.vue
│   │       └── UserManagement.vue
│   │
│   ├── composables/         # Vue composables
│   │   ├── useAuth.ts       # Authentication composable
│   │   ├── useNotifications.ts
│   │   ├── useSSE.ts        # SSE connection
│   │   ├── useCourses.ts
│   │   └── useEnrollments.ts
│   │
│   ├── layouts/             # Layout components
│   │   ├── default.vue     # Default layout
│   │   ├── auth.vue         # Auth pages layout
│   │   ├── student.vue      # Student dashboard layout
│   │   ├── tutor.vue        # Tutor dashboard layout
│   │   └── admin.vue        # Admin dashboard layout
│   │
│   ├── middleware/          # Route middleware
│   │   ├── auth.ts          # Authentication check
│   │   ├── role.ts          # Role-based access
│   │   └── guest.ts         # Guest only (redirect if logged in)
│   │
│   ├── pages/               # File-based routing
│   │   ├── index.vue        # Homepage (/)
│   │   ├── about.vue         # About page (/about)
│   │   │
│   │   ├── auth/            # Authentication pages
│   │   │   ├── login.vue     # /auth/login
│   │   │   ├── register.vue # /auth/register
│   │   │   └── forgot-password.vue
│   │   │
│   │   ├── courses/         # Course pages
│   │   │   ├── index.vue    # /courses (listing)
│   │   │   └── [id].vue     # /courses/:id (detail)
│   │   │
│   │   ├── enrollments/     # Enrollment pages
│   │   │   ├── index.vue    # /enrollments
│   │   │   └── [id].vue     # /enrollments/:id
│   │   │
│   │   ├── learning/        # Learning pages
│   │   │   ├── my-courses.vue
│   │   │   └── courses/
│   │   │       └── [id]/
│   │   │           └── sessions/
│   │   │               └── [sessionId].vue
│   │   │
│   │   ├── payments/        # Payment pages
│   │   │   ├── index.vue
│   │   │   └── [id].vue
│   │   │
│   │   ├── dashboard/       # Dashboard pages
│   │   │   ├── index.vue    # /dashboard (role-based redirect)
│   │   │   ├── student.vue  # /dashboard/student
│   │   │   ├── tutor.vue    # /dashboard/tutor
│   │   │   ├── parent.vue   # /dashboard/parent
│   │   │   └── admin.vue    # /dashboard/admin
│   │   │
│   │   └── admin/           # Admin pages
│   │       ├── users.vue
│   │       ├── courses.vue
│   │       ├── branches.vue
│   │       ├── tutors.vue
│   │       ├── enrollments.vue
│   │       ├── payments.vue
│   │       └── promotions.vue
│   │
│   ├── plugins/             # Vue plugins
│   │   ├── vue-toastification.client.ts
│   │   └── vee-validate.client.ts
│   │
│   ├── utils/               # Utility functions (shared)
│   │   ├── formatters.ts   # Date, currency formatters
│   │   ├── validators.ts    # Validation helpers
│   │   └── constants.ts    # Constants
│   │
│   ├── app.vue              # Root component
│   ├── app.config.ts        # Reactive app configuration
│   └── error.vue            # Error page
│
├── server/                  # ⭐ Server-side code (Nitro)
│   ├── api/                # API routes
│   │   ├── auth/
│   │   │   ├── login.post.ts
│   │   │   ├── register.post.ts
│   │   │   ├── refresh.post.ts
│   │   │   ├── logout.post.ts
│   │   │   └── me.get.ts
│   │   │
│   │   ├── courses/
│   │   │   ├── index.get.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id]/
│   │   │       └── schedules.post.ts
│   │   │
│   │   ├── enrollments/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   └── [id].get.ts
│   │   │
│   │   ├── payments/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   └── [id]/
│   │   │       └── verify.post.ts
│   │   │
│   │   ├── promotions/
│   │   │   ├── index.get.ts
│   │   │   ├── validate.post.ts
│   │   │   └── [id].get.ts
│   │   │
│   │   ├── learning/
│   │   │   ├── my-courses.get.ts
│   │   │   ├── courses/
│   │   │   │   └── [id]/
│   │   │   │       └── sessions.get.ts
│   │   │   └── sessions/
│   │   │       └── [id]/
│   │   │           └── access.post.ts
│   │   │
│   │   ├── sse/
│   │   │   └── notifications.get.ts  # SSE endpoint
│   │   │
│   │   └── admin/
│   │       ├── stats.get.ts
│   │       ├── revenue.get.ts
│   │       └── users.get.ts
│   │
│   ├── routes/              # Server routes (e.g., sitemap.xml)
│   │   └── sitemap.xml.ts
│   │
│   ├── middleware/          # Server middleware
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   └── cors.middleware.ts
│   │
│   ├── plugins/             # Server plugins
│   │   ├── db.ts            # Database connection
│   │   └── jwt.ts           # JWT utilities
│   │
│   ├── services/            # Business logic services
│   │   ├── auth.service.ts
│   │   ├── course.service.ts
│   │   ├── enrollment.service.ts
│   │   ├── payment.service.ts
│   │   ├── promotion.service.ts
│   │   ├── notification.service.ts
│   │   └── learning.service.ts
│   │
│   └── utils/               # Server utilities
│       ├── db.ts            # Database helpers
│       ├── validation.ts    # Validation helpers
│       ├── permissions.ts   # RBAC helpers
│       └── errors.ts       # Error handling
│
├── shared/                  # ⭐ Shared code (app + server)
│   ├── types/              # TypeScript types
│   │   ├── user.types.ts
│   │   ├── course.types.ts
│   │   ├── enrollment.types.ts
│   │   ├── payment.types.ts
│   │   └── api.types.ts
│   │
│   ├── constants/          # Shared constants
│   │   ├── roles.ts
│   │   └── status.ts
│   │
│   └── schemas/            # Validation schemas (Zod/Yup)
│       ├── auth.schema.ts
│       └── course.schema.ts
│
├── public/                  # Public static files
│   ├── favicon.ico
│   ├── robots.txt
│   └── images/
│       └── logo.png
│
├── content/                 # Content directory (Nuxt Content module)
│   └── (optional, for CMS)
│
└── modules/                 # Local Nuxt modules
    └── (optional, for custom modules)
```

---

## 🔑 ความแตกต่างสำคัญของ Nuxt 4

### 1. App Directory Structure
- **Nuxt 3**: Components, pages, composables อยู่ที่ root level
- **Nuxt 4**: ทุกอย่างอยู่ใน `app/` directory

### 2. Server Directory
- **เหมือนเดิม**: `server/` ยังคงใช้สำหรับ server-side code
- **API Routes**: ยังคงอยู่ใน `server/api/`
- **Server Middleware**: อยู่ใน `server/middleware/`

### 3. Shared Directory (ใหม่)
- **ใช้สำหรับ**: Code ที่ใช้ร่วมกันระหว่าง app และ server
- **ตัวอย่าง**: Types, Constants, Schemas

### 4. App Configuration
- **app.config.ts**: Reactive configuration (แทน runtime config)
- **app.vue**: Root component (ยังคงเหมือนเดิม)

---

## 📝 ไฟล์สำคัญ

### nuxt.config.ts
```typescript
export default defineNuxtConfig({
  // Nuxt 4 configuration
  compatibilityDate: '2024-04-03',
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],
  
  // CSS
  css: ['~/app/assets/css/main.css'],
  
  // Runtime config
  runtimeConfig: {
    // Private (server-only)
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    jwtSecret: process.env.JWT_SECRET,
    
    // Public (exposed to client)
    public: {
      apiBase: process.env.API_BASE || '/api'
    }
  },
  
  // Nitro configuration
  nitro: {
    experimental: {
      websocket: true
    }
  }
})
```

### app/app.config.ts
```typescript
export default defineAppConfig({
  // Reactive app configuration
  name: 'KDC Tutor School',
  version: '1.0.0',
  theme: {
    primary: '#2563eb',
    secondary: '#10b981'
  }
})
```

### app/app.vue
```vue
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

---

## 🎯 การใช้งาน Directory ต่างๆ

### app/components/
- Auto-import components
- ใช้ `<ComponentName />` โดยไม่ต้อง import

### app/composables/
- Auto-import composables
- ใช้ `useAuth()` โดยไม่ต้อง import

### app/utils/
- ต้อง import เอง: `import { formatDate } from '~/app/utils/formatters'`

### server/api/
- File-based routing
- `server/api/courses/index.get.ts` → `GET /api/courses`
- `server/api/courses/[id].get.ts` → `GET /api/courses/:id`

### shared/types/
- ใช้ได้ทั้ง app และ server
- Import: `import type { User } from '~/shared/types/user.types'`

---

## 🔄 Migration จาก Nuxt 3

หากมีโค้ด Nuxt 3 อยู่แล้ว:

1. **ย้ายไฟล์ไปใน `app/`**:
   - `components/` → `app/components/`
   - `pages/` → `app/pages/`
   - `composables/` → `app/composables/`
   - `layouts/` → `app/layouts/`
   - `middleware/` → `app/middleware/`

2. **ย้าย types ไป `shared/types/`**:
   - `types/` → `shared/types/`

3. **อัปเดต imports**:
   - `~/components/` → `~/app/components/` (หรือใช้ auto-import)
   - `~/types/` → `~/shared/types/`

---

## ✅ Checklist สำหรับโครงสร้าง

- [x] สร้าง `app/` directory
- [x] ย้าย components ไป `app/components/`
- [x] ย้าย pages ไป `app/pages/`
- [x] ย้าย composables ไป `app/composables/`
- [x] ย้าย layouts ไป `app/layouts/`
- [x] ย้าย middleware ไป `app/middleware/`
- [x] สร้าง `shared/` directory
- [x] ย้าย types ไป `shared/types/`
- [x] อัปเดต `nuxt.config.ts`
- [x] สร้าง `app/app.config.ts`
- [x] สร้าง `app/app.vue`

---

*อ้างอิง: [Nuxt 4 Directory Structure](https://nuxt.com/docs/4.x/directory-structure)*

