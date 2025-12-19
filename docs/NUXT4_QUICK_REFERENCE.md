# 🚀 Nuxt 4 Quick Reference

Quick reference guide สำหรับ Nuxt 4 features ที่ใช้ในโปรเจคนี้

---

## 📚 Official Documentation

- [Configuration](https://nuxt.com/docs/4.x/getting-started/configuration)
- [Views](https://nuxt.com/docs/4.x/getting-started/views)
- [Assets](https://nuxt.com/docs/4.x/getting-started/assets)
- [Styling](https://nuxt.com/docs/4.x/getting-started/styling)
- [Routing](https://nuxt.com/docs/4.x/getting-started/routing)
- [Transitions](https://nuxt.com/docs/4.x/getting-started/transitions)
- [Data Fetching](https://nuxt.com/docs/4.x/getting-started/data-fetching)
- [State Management](https://nuxt.com/docs/4.x/getting-started/state-management)
- [Error Handling](https://nuxt.com/docs/4.x/getting-started/error-handling)
- [Server](https://nuxt.com/docs/4.x/getting-started/server)
- [Layers](https://nuxt.com/docs/4.x/getting-started/layers)

---

## ⚡ Common Patterns

### Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    private: { apiSecret: '123' },
    public: { apiBase: '/api' }
  }
})
```

### Pages

```vue
<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})
</script>
```

### Components

```vue
<!-- Auto-imported from app/components/ -->
<template>
  <CourseCard :course="course" />
</template>
```

### Data Fetching

```vue
<script setup>
const { data, error, pending } = await useFetch('/api/courses')
</script>
```

### State Management

```typescript
// Pinia Store
const store = useCoursesStore()
await store.fetchCourses()

// useState
const user = useState('auth.user', () => null)
```

### Server API

```typescript
// server/api/courses/index.get.ts
export default defineEventHandler(async (event) => {
  return { success: true, data: [] }
})
```

---

## 🎯 Project-Specific

### Authentication

```typescript
const { user, login, logout } = useAuth()
const redirectPath = getRedirectPathByRole(user.value)
```

### Routing

- `/` - Homepage (SkillLane style)
- `/auth/login` - Login (all roles)
- `/my-courses` - Student/Parent dashboard
- `/admin` - Admin dashboard
- `/admin/branches` - Branch admin dashboard

### Layouts

- `homepage` - Public pages
- `student` - Student/Parent pages
- `admin` - Admin pages

---

*Quick Reference - Updated: 2024*

