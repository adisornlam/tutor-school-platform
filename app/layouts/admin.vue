<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <NuxtLink to="/admin" class="flex items-center space-x-2">
            <span class="text-xl font-bold text-green-600">KDC Admin</span>
          </NuxtLink>
          <button
            @click="sidebarOpen = false"
            class="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-4 scrollbar-light">
          <div class="px-3 space-y-1">
            <template v-for="menu in menus" :key="menu.code">
              <!-- Parent Menu (with children) -->
              <div v-if="menu.children && menu.children.length > 0">
                <button
                  @click="toggleMenu(menu.code)"
                  class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  :class="isMenuActive(menu) 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-700 hover:bg-gray-100'"
                >
                  <div class="flex items-center space-x-3">
                    <MenuIcon v-if="menu.icon" :icon="menu.icon" class="w-5 h-5" />
                    <span>{{ menu.name }}</span>
                  </div>
                  <svg
                    class="w-4 h-4 transition-transform"
                    :class="{ 'rotate-90': expandedMenus[menu.code] }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <!-- Submenu -->
                <div
                  v-show="expandedMenus[menu.code]"
                  class="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-2"
                >
                  <NuxtLink
                    v-for="child in menu.children"
                    :key="child.code"
                    :to="child.href || '#'"
                    class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    :class="isActive(child.href || '') 
                      ? 'bg-green-50 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100'"
                  >
                    <MenuIcon v-if="child.icon" :icon="child.icon" class="w-4 h-4" />
                    <span>{{ child.name }}</span>
                  </NuxtLink>
                </div>
              </div>
              
              <!-- Single Menu (no children) -->
              <NuxtLink
                v-else
                :to="menu.href || '#'"
                class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="isActive(menu.href || '') 
                  ? 'bg-green-50 text-green-700' 
                  : 'text-gray-700 hover:bg-gray-100'"
              >
                <MenuIcon v-if="menu.icon" :icon="menu.icon" class="w-5 h-5" />
                <span>{{ menu.name }}</span>
              </NuxtLink>
            </template>
            
            <!-- Loading State -->
            <div v-if="loadingMenus" class="px-3 py-2 text-sm text-gray-500">
              กำลังโหลดเมนู...
            </div>
            
            <!-- Error State -->
            <div v-if="menuError" class="px-3 py-2 text-sm text-red-500">
              {{ menuError }}
            </div>
          </div>
        </nav>

        <!-- User Menu -->
        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center space-x-3">
            <div class="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
              {{ user?.first_name?.[0] || 'A' }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ user?.first_name }} {{ user?.last_name }}
              </p>
              <p class="text-xs text-gray-500 truncate">
                {{ user?.email }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    ></div>

    <!-- Main Content -->
    <div class="lg:pl-64">
      <!-- Top Header -->
      <header class="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div class="flex items-center justify-between h-16 px-4">
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div class="flex-1 flex items-center justify-end space-x-4">
            <!-- Search -->
            <div class="hidden md:block relative">
              <input
                type="text"
                placeholder="ค้นหา..."
                class="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
              <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Notifications -->
            <button class="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <!-- User Menu -->
            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <div class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                  {{ user?.first_name?.[0] || 'A' }}
                </div>
              </button>
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <NuxtLink
                  to="/admin/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  โปรไฟล์
                </NuxtLink>
                <NuxtLink
                  to="/"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  กลับไปหน้าแรก
                </NuxtLink>
                <hr class="my-2 border-gray-200">
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 py-6 mt-auto">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-center">
            <p class="text-sm text-gray-600">
              &copy; 2024 KDC Tutor School. สงวนลิขสิทธิ์
            </p>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AdminMenu {
  id: number
  code: string
  name: string
  name_en: string | null
  icon: string | null
  href: string | null
  parent_code: string | null
  display_order: number
  is_active: boolean
  roles: string[] | null
  children?: AdminMenu[]
}

const { user, logout } = useAuth()
const route = useRoute()
const config = useRuntimeConfig()
const sidebarOpen = ref(false)
const showUserMenu = ref(false)
const menus = ref<AdminMenu[]>([])
const loadingMenus = ref(true)
const menuError = ref<string | null>(null)
const expandedMenus = ref<Record<string, boolean>>({})

// Fetch menus from API
const fetchMenus = async () => {
  loadingMenus.value = true
  menuError.value = null
  
  try {
    // Try to get token from cookie or from auth composable
    const tokenCookie = useCookie('access_token')
    const { accessToken } = useAuth()
    
    // Use token from composable if cookie is not available
    const token = tokenCookie.value || accessToken.value
    
    console.log('[Admin Layout] Fetching menus...')
    console.log('[Admin Layout] Token from cookie:', !!tokenCookie.value)
    console.log('[Admin Layout] Token from composable:', !!accessToken.value)
    console.log('[Admin Layout] Final token:', !!token)
    console.log('[Admin Layout] API Base:', config.public.apiBase)
    
    if (!token) {
      // Try to fetch user first to get token
      const { fetchUser } = useAuth()
      await fetchUser()
      
      // Try again after fetching user
      const tokenAfterFetch = tokenCookie.value || accessToken.value
      if (!tokenAfterFetch) {
        throw new Error('No access token. Please login again.')
      }
      
      // Use the token after fetch
      const response = await $fetch<{
        success: boolean
        data: AdminMenu[]
      }>(`${config.public.apiBase}/admin/menus`, {
        headers: {
          Authorization: `Bearer ${tokenAfterFetch}`
        }
      })
      
      if (response.success) {
        menus.value = response.data
        console.log('[Admin Layout] Menus loaded:', menus.value.length)
        console.log('[Admin Layout] Menu codes:', menus.value.map(m => m.code))
        
        // Auto-expand menu if current route matches a child menu
        menus.value.forEach(menu => {
          if (menu.children && menu.children.length > 0) {
            const hasActiveChild = menu.children.some(child => 
              child.href && isActive(child.href)
            )
            if (hasActiveChild) {
              expandedMenus.value[menu.code] = true
            }
          }
        })
      }
      return
    }
    
    const response = await $fetch<{
      success: boolean
      data: AdminMenu[]
    }>(`${config.public.apiBase}/admin/menus`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    console.log('[Admin Layout] Menu response:', response)
    
    if (response.success) {
      menus.value = response.data
      console.log('[Admin Layout] Menus loaded:', menus.value.length)
      console.log('[Admin Layout] Menu codes:', menus.value.map(m => m.code))
      
      // Auto-expand menu if current route matches a child menu
      menus.value.forEach(menu => {
        if (menu.children && menu.children.length > 0) {
          const hasActiveChild = menu.children.some(child => 
            child.href && isActive(child.href)
          )
          if (hasActiveChild) {
            expandedMenus.value[menu.code] = true
          }
        }
      })
    } else {
      console.warn('[Admin Layout] Response not successful:', response)
    }
  } catch (error: any) {
    console.error('[Admin Layout] Failed to fetch menus:', error)
    console.error('[Admin Layout] Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      data: error.data,
      response: error.response
    })
    
    // More specific error messages
    if (error.statusCode === 401) {
      menuError.value = 'กรุณาเข้าสู่ระบบใหม่'
    } else if (error.statusCode === 403) {
      menuError.value = 'ไม่มีสิทธิ์เข้าถึงเมนู'
    } else if (error.data?.message) {
      menuError.value = error.data.message
    } else {
      menuError.value = 'ไม่สามารถโหลดเมนูได้ - ' + (error.message || 'Unknown error')
    }
  } finally {
    loadingMenus.value = false
  }
}

const toggleMenu = (menuCode: string) => {
  expandedMenus.value[menuCode] = !expandedMenus.value[menuCode]
}

const isActive = (href: string) => {
  if (!href || href === '#') return false
  if (href === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(href)
}

const isMenuActive = (menu: AdminMenu) => {
  // Check if menu itself is active
  if (menu.href && isActive(menu.href)) {
    return true
  }
  // Check if any child is active
  if (menu.children && menu.children.length > 0) {
    return menu.children.some(child => child.href && isActive(child.href))
  }
  return false
}

const handleLogout = async () => {
  showUserMenu.value = false
  await logout()
}

// Close menus when clicking outside
onMounted(() => {
  fetchMenus()
  
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

