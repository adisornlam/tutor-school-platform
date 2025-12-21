<template>
    <div class="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
      <div class="max-w-md w-full mx-4">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h1 class="text-3xl font-bold text-center mb-8">เข้าสู่ระบบ</h1>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                ชื่อผู้ใช้งาน
              </label>
              <input
                id="username"
                v-model="form.username"
                type="text"
                required
                class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400"
                placeholder="username หรือ email"
              >
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400"
                placeholder="••••••••"
              >
            </div>

            <div class="flex items-center justify-between">
              <label class="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 bg-white checked:bg-green-600 checked:border-green-600"
                >
                <span class="ml-2 text-sm text-gray-600">จดจำฉัน</span>
              </label>
              <NuxtLink to="/auth/forgot-password" class="text-sm text-green-600 hover:text-green-700">
                ลืมรหัสผ่าน?
              </NuxtLink>
            </div>

            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {{ error }}
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">กำลังเข้าสู่ระบบ...</span>
              <span v-else>เข้าสู่ระบบ</span>
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-gray-600">
              ยังไม่มีบัญชี? 
              <NuxtLink to="/auth/register" class="text-green-600 hover:text-green-700 font-semibold">
                สมัครสมาชิก
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { getRedirectPathByRole } from '~/utils/auth'

definePageMeta({
  middleware: 'guest',
  layout: 'homepage'
})

const { login, user } = useAuth()
const route = useRoute()
const router = useRouter()

const form = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    console.log('[Login] Attempting login with username:', form.username)
    const response = await login(form.username, form.password)
    console.log('[Login] Login response:', response)
    
    if (response.success) {
      // Wait a bit for state to update
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const redirect = route.query.redirect as string
      console.log('[Login] Redirect query param:', redirect)
      
      // If redirect param exists, use it directly
      if (redirect) {
        console.log('[Login] Redirecting to requested path:', redirect)
        await navigateTo(redirect)
        return
      }
      
      // Otherwise, use role-based redirect
      const loggedInUser = response.data.user
      const userForRedirect = user.value || loggedInUser
      const redirectPath = getRedirectPathByRole(userForRedirect, redirect)
      console.log('[Login] Redirecting to role-based path:', redirectPath)
      await navigateTo(redirectPath)
    }
  } catch (err: any) {
    console.error('[Login] Error:', err)
    console.error('[Login] Error data:', err.data)
    console.error('[Login] Error message:', err.message)
    
    // Handle different error formats
    let errorMessage = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
    
    if (err.data?.message) {
      errorMessage = err.data.message
    } else if (err.data?.error?.message) {
      errorMessage = err.data.error.message
    } else if (err.message) {
      errorMessage = err.message
    } else if (typeof err.data === 'string') {
      errorMessage = err.data
    }
    
    error.value = errorMessage
  } finally {
    loading.value = false
  }
}
</script>

