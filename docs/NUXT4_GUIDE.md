# 📚 Nuxt 4 Guide for Tutor School Platform

## 📋 Overview

เอกสารนี้สรุป Nuxt 4 features และ best practices ที่ใช้ในโปรเจค Tutor School Platform

**References:**
- [Nuxt 4 Configuration](https://nuxt.com/docs/4.x/getting-started/configuration)
- [Nuxt 4 Views](https://nuxt.com/docs/4.x/getting-started/views)
- [Nuxt 4 Assets](https://nuxt.com/docs/4.x/getting-started/assets)
- [Nuxt 4 Styling](https://nuxt.com/docs/4.x/getting-started/styling)
- [Nuxt 4 Routing](https://nuxt.com/docs/4.x/getting-started/routing)
- [Nuxt 4 Data Fetching](https://nuxt.com/docs/4.x/getting-started/data-fetching)
- [Nuxt 4 State Management](https://nuxt.com/docs/4.x/getting-started/state-management)
- [Nuxt 4 Error Handling](https://nuxt.com/docs/4.x/getting-started/error-handling)
- [Nuxt 4 Server](https://nuxt.com/docs/4.x/getting-started/server)

---

## 🏗️ Project Structure (Nuxt 4)

```
Tutor-School-Platform/
├── app/                    # Main application directory
│   ├── assets/            # Assets processed by Vite
│   │   └── css/
│   │       └── main.css
│   ├── components/        # Auto-imported components
│   ├── composables/      # Auto-imported composables
│   ├── layouts/           # Layout components
│   ├── middleware/        # Route middleware
│   ├── pages/             # File-based routing
│   ├── plugins/           # Plugins
│   ├── utils/             # Utility functions
│   ├── app.config.ts      # App configuration
│   └── app.vue            # Root component
├── server/                 # Server-side code
│   ├── api/               # API routes
│   ├── services/          # Business logic
│   └── utils/             # Server utilities
├── shared/                 # Shared code (app + server)
│   └── types/             # TypeScript types
└── nuxt.config.ts         # Nuxt configuration
```

---

## ⚙️ Configuration

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@vueuse/nuxt'
  ],
  
  // CSS
  css: ['~/assets/css/main.css'],
  
  // Runtime Config (Environment Variables)
  runtimeConfig: {
    // Private (server-only)
    dbHost: process.env.DB_HOST || 'localhost',
    jwtSecret: process.env.JWT_SECRET,
    
    // Public (exposed to client)
    public: {
      apiBase: process.env.API_BASE || '/api',
      appName: 'KDC Tutor School'
    }
  },
  
  // Nitro Configuration
  nitro: {
    port: 4000,
    experimental: {
      websocket: true
    }
  }
})
```

### app.config.ts

```typescript
export default defineAppConfig({
  title: 'KDC Tutor School',
  theme: {
    primary: '#10b981',
    secondary: '#2563eb'
  }
})
```

**Key Differences:**
- `runtimeConfig`: For environment variables, tokens (can be overridden)
- `app.config`: For build-time config, theme, public settings (reactive, HMR)

---

## 🎨 Views & Components

### app.vue (Root Component)

```vue
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

### Layouts

**Default Layout** (`app/layouts/default.vue`):
```vue
<template>
  <div>
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>
```

**Custom Layouts**:
- `homepage.vue` - สำหรับหน้าแรก
- `student.vue` - สำหรับนักเรียน/ผู้ปกครอง
- `admin.vue` - สำหรับ admin dashboard

**Usage in Pages:**
```vue
<script setup>
definePageMeta({
  layout: 'admin'
})
</script>
```

### Components

**Auto-import**: Components ใน `app/components/` จะถูก auto-import

**Naming Convention:**
- `CourseCard.vue` → `<CourseCard />`
- `app/components/courses/CourseList.vue` → `<CoursesCourseList />`

---

## 🎯 Routing

### File-based Routing

```
app/pages/
├── index.vue              → /
├── courses/
│   ├── index.vue         → /courses
│   └── [id].vue          → /courses/:id
├── auth/
│   ├── login.vue         → /auth/login
│   └── register.vue      → /auth/register
└── admin/
    ├── index.vue         → /admin
    └── branches/
        └── index.vue     → /admin/branches
```

### Route Metadata

```vue
<script setup>
definePageMeta({
  middleware: 'auth',      // Route middleware
  layout: 'admin',         // Custom layout
  title: 'Dashboard'        // Page title
})
</script>
```

### Navigation

```vue
<template>
  <NuxtLink to="/courses">Courses</NuxtLink>
  <NuxtLink :to="{ name: 'courses-id', params: { id: 1 } }">
    Course 1
  </NuxtLink>
</template>
```

---

## 📦 Assets

### Static Assets

**Location**: `public/` directory
- Accessible at root: `/logo.png` → `public/logo.png`
- Not processed by Vite

### Processed Assets

**Location**: `app/assets/`
- Processed by Vite
- Optimized and hashed
- Use `~/assets/` alias

**CSS**:
```typescript
// nuxt.config.ts
css: ['~/assets/css/main.css']
```

**Images**:
```vue
<template>
  <img src="~/assets/images/logo.png" alt="Logo" />
</template>
```

---

## 🎨 Styling

### Tailwind CSS

**Configuration**: `@nuxtjs/tailwindcss` module

**Usage**:
```vue
<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h1 class="text-2xl font-bold text-gray-900">Title</h1>
  </div>
</template>
```

**Custom CSS**:
```css
/* app/assets/css/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary-green: #10b981;
}
```

---

## 🔄 Data Fetching

### useFetch

```vue
<script setup>
const { data, error, pending } = await useFetch('/api/courses')
</script>
```

### $fetch

```typescript
const response = await $fetch('/api/courses', {
  method: 'POST',
  body: { name: 'Course 1' }
})
```

### useAsyncData

```vue
<script setup>
const { data, error, pending } = await useAsyncData('courses', () => 
  $fetch('/api/courses')
)
</script>
```

**Best Practices:**
- Use `useFetch` for pages (automatic caching, SSR)
- Use `$fetch` for API calls in composables/services
- Use `useAsyncData` for custom data fetching logic

---

## 🗄️ State Management

### Pinia (Recommended)

**Store** (`app/stores/courses.ts`):
```typescript
export const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: [],
    loading: false
  }),
  actions: {
    async fetchCourses() {
      this.loading = true
      this.courses = await $fetch('/api/courses')
      this.loading = false
    }
  }
})
```

**Usage**:
```vue
<script setup>
const coursesStore = useCoursesStore()
await coursesStore.fetchCourses()
</script>
```

### useState (Composables)

```typescript
// app/composables/useAuth.ts
export const useAuth = () => {
  const user = useState<UserWithRoles | null>('auth.user', () => null)
  return { user }
}
```

---

## ⚠️ Error Handling

### Error Page

**`app/error.vue`**:
```vue
<template>
  <div>
    <h1>Error {{ error.statusCode }}</h1>
    <p>{{ error.message }}</p>
    <button @click="handleError">Go Home</button>
  </div>
</template>

<script setup>
const props = defineProps<{
  error: { statusCode: number; message: string }
}>()

const handleError = () => clearError({ redirect: '/' })
</script>
```

### Throwing Errors

```typescript
// Server API
throw createError({
  statusCode: 404,
  message: 'Course not found'
})

// Client
throw createError({
  statusCode: 403,
  message: 'Access denied'
})
```

---

## 🖥️ Server

### API Routes

**`server/api/courses/index.get.ts`**:
```typescript
export default defineEventHandler(async (event) => {
  const courses = await getCourses()
  return {
    success: true,
    data: courses
  }
})
```

**`server/api/courses/[id].get.ts`**:
```typescript
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const course = await getCourseById(Number(id))
  return { success: true, data: course }
})
```

### Server Utilities

**`server/utils/db.ts`**:
```typescript
import mysql from 'mysql2/promise'

export async function query<T>(sql: string, params?: any[]): Promise<T[]> {
  // Database query logic
}
```

### Middleware

**`server/middleware/auth.ts`**:
```typescript
export default defineEventHandler((event) => {
  // Server middleware logic
})
```

---

## 🔄 Transitions

### Page Transitions

```vue
<!-- app/app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
```

### Layout Transitions

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.layout-enter-active,
.layout-leave-active {
  transition: opacity 0.3s;
}
</style>
```

---

## 📝 Best Practices

### 1. Directory Structure
- ✅ ใช้ `app/` directory สำหรับ client-side code
- ✅ ใช้ `server/` directory สำหรับ server-side code
- ✅ ใช้ `shared/` directory สำหรับ code ที่ใช้ร่วมกัน

### 2. TypeScript
- ✅ ใช้ TypeScript สำหรับ type safety
- ✅ ใช้ `~/` alias สำหรับ imports
- ✅ ใช้ `definePageMeta` สำหรับ page metadata

### 3. Components
- ✅ Auto-import components (ไม่ต้อง import)
- ✅ ใช้ PascalCase สำหรับ component names
- ✅ ใช้ composables สำหรับ reusable logic

### 4. Data Fetching
- ✅ ใช้ `useFetch` สำหรับ pages (SSR support)
- ✅ ใช้ `$fetch` สำหรับ API calls
- ✅ Handle loading และ error states

### 5. State Management
- ✅ ใช้ Pinia สำหรับ global state
- ✅ ใช้ `useState` สำหรับ simple state
- ✅ ใช้ composables สำหรับ business logic

### 6. Error Handling
- ✅ สร้าง custom error page
- ✅ Handle errors gracefully
- ✅ Provide user-friendly error messages

### 7. Performance
- ✅ ใช้ lazy loading สำหรับ components
- ✅ Optimize images
- ✅ Use caching strategies

---

## 🔗 Useful Links

- [Nuxt 4 Documentation](https://nuxt.com/docs/4.x)
- [Nuxt 4 API Reference](https://nuxt.com/docs/4.x/api)
- [Nuxt 4 Modules](https://nuxt.com/modules)
- [Vue 3 Documentation](https://vuejs.org/)

---

*Nuxt 4 Guide for Tutor School Platform - Updated: 2024*

