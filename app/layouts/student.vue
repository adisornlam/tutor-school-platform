<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <NuxtLink to="/" class="text-xl font-bold text-green-600">
            KDC School
          </NuxtLink>
          <div class="flex items-center space-x-4">
            <button class="relative p-2 text-gray-700 hover:text-green-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
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
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
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

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
        <nav class="p-4">
          <div class="mb-6">
            <h2 class="text-sm font-semibold text-gray-500 uppercase mb-2">ข้อมูลการเรียน</h2>
            <ul class="space-y-1">
              <li>
                <NuxtLink 
                  to="/my-courses" 
                  class="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors"
                  :class="$route.path === '/my-courses' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>คอร์สเรียนของฉัน</span>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink 
                  to="/chat" 
                  class="flex items-center justify-between px-3 py-2 rounded-lg transition-colors"
                  :class="$route.path.startsWith('/chat') ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
                >
                  <div class="flex items-center space-x-3">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>แชท</span>
                  </div>
                  <!-- Unread badge -->
                  <span
                    v-if="unreadCount > 0"
                    class="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-red-500 rounded-full"
                  >
                    {{ unreadCount > 99 ? '99+' : unreadCount }}
                  </span>
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 class="text-sm font-semibold text-gray-500 uppercase mb-2">ข้อมูลโปรไฟล์</h2>
            <ul class="space-y-1">
              <li>
                <NuxtLink 
                  to="/profile" 
                  class="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors"
                  :class="$route.path === '/profile' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>โปรไฟล์ของฉัน</span>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink 
                  to="/payment-history" 
                  class="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors"
                  :class="$route.path === '/payment-history' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>ประวัติการชำระเงิน</span>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const { unreadCount, fetchUnreadCount } = useUnreadMessages()
const showUserMenu = ref(false)

const handleLogout = async () => {
  showUserMenu.value = false
  await logout()
}

// Fetch unread count on mount and refresh periodically
onMounted(() => {
  fetchUnreadCount()
  
  // Refresh unread count every 10 seconds
  const unreadInterval = setInterval(() => {
    fetchUnreadCount()
  }, 10000)
  
  onUnmounted(() => {
    clearInterval(unreadInterval)
  })
})
</script>

