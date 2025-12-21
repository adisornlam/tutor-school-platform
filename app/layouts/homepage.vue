<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-2">
            <span class="text-2xl font-bold text-green-600">KDC School</span>
          </NuxtLink>

          <!-- Navigation -->
          <div class="hidden md:flex items-center space-x-6">
            <NuxtLink 
              to="/courses" 
              class="text-gray-700 hover:text-green-600 transition-colors"
            >
              คอร์สเรียนทั้งหมด
            </NuxtLink>
            <NuxtLink 
              to="/courses?level=elementary" 
              class="text-gray-700 hover:text-green-600 transition-colors"
            >
              ประถมศึกษา
            </NuxtLink>
            <NuxtLink 
              to="/courses?level=secondary" 
              class="text-gray-700 hover:text-green-600 transition-colors"
            >
              มัธยมศึกษา
            </NuxtLink>
            <NuxtLink 
              to="/about" 
              class="text-gray-700 hover:text-green-600 transition-colors"
            >
              เกี่ยวกับเรา
            </NuxtLink>
          </div>

          <!-- Right Side -->
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <div class="hidden md:block relative">
              <input
                type="text"
                placeholder="ค้นหาคอร์สเรียน"
                class="pl-10 pr-4 py-2 w-64 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400"
              >
              <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- User Menu -->
            <template v-if="isAuthenticated">
              <NuxtLink 
                to="/my-courses" 
                class="text-gray-700 hover:text-green-600 transition-colors"
              >
                คอร์สเรียนของฉัน
              </NuxtLink>
              <button class="relative p-2 text-gray-700 hover:text-green-600">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div class="relative">
                <button 
                  @click="showUserMenu = !showUserMenu"
                  class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                    {{ user?.first_name?.[0] || 'U' }}
                  </div>
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
                    โปรไฟล์
                  </NuxtLink>
                  <button 
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <NuxtLink 
                to="/auth/login" 
                class="px-4 py-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                เข้าสู่ระบบ
              </NuxtLink>
              <NuxtLink 
                to="/auth/register" 
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                สมัครสมาชิก
              </NuxtLink>
            </template>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12 mt-20">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4">KDC School</h3>
            <p class="text-gray-400">
              เรียนออนไลน์ได้ทุกที่ ทุกเวลา
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">เกี่ยวกับเรา</h4>
            <ul class="space-y-2 text-gray-400">
              <li><NuxtLink to="/about" class="hover:text-white">เกี่ยวกับเรา</NuxtLink></li>
              <li><NuxtLink to="/contact" class="hover:text-white">ติดต่อเรา</NuxtLink></li>
              <li><NuxtLink to="/careers" class="hover:text-white">ร่วมงานกับเรา</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">ช่วยเหลือ</h4>
            <ul class="space-y-2 text-gray-400">
              <li><NuxtLink to="/help" class="hover:text-white">คำถามที่พบบ่อย</NuxtLink></li>
              <li><NuxtLink to="/support" class="hover:text-white">ติดต่อฝ่ายสนับสนุน</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">ติดตามเรา</h4>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white">Facebook</a>
              <a href="#" class="text-gray-400 hover:text-white">Line</a>
              <a href="#" class="text-gray-400 hover:text-white">YouTube</a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 KDC School. สงวนลิขสิทธิ์</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, user, logout } = useAuth()
const showUserMenu = ref(false)

const handleLogout = async () => {
  showUserMenu.value = false
  await logout()
}

// Close menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
      showUserMenu.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

