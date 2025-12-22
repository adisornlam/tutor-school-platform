<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <!-- Back Button -->
            <NuxtLink
              :to="backUrl"
              class="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
              :title="backUrl === '/admin' ? 'กลับไปที่ Admin Dashboard' : 'กลับไปที่คอร์สเรียน'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span class="font-medium">กลับ</span>
            </NuxtLink>
            <NuxtLink :to="backUrl" class="text-xl font-bold text-green-600">
              KDC School
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink
              v-if="backUrl === '/my-courses'"
              to="/my-courses"
              class="text-gray-700 hover:text-green-600 font-medium"
            >
              คอร์สเรียน
            </NuxtLink>
            <NuxtLink
              v-else
              to="/admin"
              class="text-gray-700 hover:text-green-600 font-medium"
            >
              Dashboard
            </NuxtLink>
            <div class="relative">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <div class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                  {{ user?.first_name?.[0] || 'U' }}
                </div>
                <span class="hidden md:block text-gray-700">{{ user?.first_name }} {{ user?.last_name }}</span>
              </button>
              <div 
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <NuxtLink 
                  to="/profile" 
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  โปรไฟล์ของฉัน
                </NuxtLink>
                <button 
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="h-[calc(100vh-4rem)] overflow-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { getRedirectPathByRole } from '~/utils/auth'

const { user, logout, hasAnyRole } = useAuth()
const showUserMenu = ref(false)

// Get back URL based on user role
const backUrl = computed(() => {
  // Tutor and admin roles → /admin
  if (hasAnyRole(['tutor', 'system_admin', 'owner', 'admin', 'branch_admin'])) {
    return '/admin'
  }
  // Student and parent → /my-courses
  return '/my-courses'
})

const handleLogout = async () => {
  showUserMenu.value = false
  await logout()
}
</script>

