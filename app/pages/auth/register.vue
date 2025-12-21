<template>
  <div class="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
    <div class="max-w-md w-full mx-4">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-center mb-2">สมัครสมาชิก</h1>
        <p class="text-center text-gray-600 text-sm mb-8">
          สมัครเพื่อเริ่มเรียนและเข้าถึงคอร์สเรียนทั้งหมด
        </p>

        <!-- Email & Social Login Buttons -->
        <div v-if="!showEmailForm" class="space-y-3 mb-6">
          <button
            @click="showEmailForm = true"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>สมัครด้วยอีเมล์</span>
          </button>

          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">หรือ</span>
            </div>
          </div>

          <button
            @click="handleSocialLogin('google')"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>สมัครด้วย Google</span>
          </button>

          <button
            @click="handleSocialLogin('facebook')"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>สมัครด้วย Facebook</span>
          </button>

          <button
            @click="handleSocialLogin('line')"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#00C300] text-white rounded-lg font-semibold hover:bg-[#00B300] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.086.766.062 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            <span>สมัครด้วย LINE</span>
          </button>
        </div>

        <!-- Email Registration Form -->
        <div v-if="showEmailForm">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xl font-semibold">สมัครด้วยอีเมล์</h2>
            <button
              @click="showEmailForm = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700 mb-1">
                ชื่อ <span class="text-red-500">*</span>
              </label>
              <input
                id="first_name"
                v-model="form.first_name"
                type="text"
                required
                class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400"
                placeholder="ชื่อ"
              >
            </div>

            <div>
              <label for="last_name" class="block text-sm font-medium text-gray-700 mb-1">
                นามสกุล <span class="text-red-500">*</span>
              </label>
              <input
                id="last_name"
                v-model="form.last_name"
                type="text"
                required
                class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400"
                placeholder="นามสกุล"
              >
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              อีเมล <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400"
              placeholder="example@email.com"
            >
            <p class="mt-1 text-xs text-gray-500">ใช้เป็น username และสำหรับการเข้าสู่ระบบ</p>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
              เบอร์โทรศัพท์
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400"
              placeholder="081-234-5678"
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่าน <span class="text-red-500">*</span>
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400"
              placeholder="••••••••"
            >
            <p class="mt-1 text-xs text-gray-500">อย่างน้อย 6 ตัวอักษร</p>
          </div>

          <div>
            <label for="confirm_password" class="block text-sm font-medium text-gray-700 mb-1">
              ยืนยันรหัสผ่าน <span class="text-red-500">*</span>
            </label>
            <input
              id="confirm_password"
              v-model="form.confirm_password"
              type="password"
              required
              class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400"
              placeholder="••••••••"
            >
          </div>

          <div>
            <label class="flex items-start cursor-pointer">
              <input
                v-model="form.role"
                type="radio"
                value="student"
                class="mt-1 mr-2 w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <span class="text-sm text-gray-700">
                <strong>นักเรียน</strong> - ต้องการสมัครเรียน
              </span>
            </label>
          </div>

          <div>
            <label class="flex items-start cursor-pointer">
              <input
                v-model="form.role"
                type="radio"
                value="parent"
                class="mt-1 mr-2 w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <span class="text-sm text-gray-700">
                <strong>ผู้ปกครอง</strong> - สมัครให้บุตรหลาน (ต้องชำระเงิน)
              </span>
            </label>
          </div>

          <div class="flex items-start">
            <input
              id="terms"
              v-model="form.accept_terms"
              type="checkbox"
              required
              class="mt-1 mr-2 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label for="terms" class="text-sm text-gray-600">
              ฉันยอมรับ <NuxtLink to="/terms" class="text-green-600 hover:text-green-700">ข้อกำหนดการใช้งาน</NuxtLink> และ <NuxtLink to="/privacy" class="text-green-600 hover:text-green-700">นโยบายความเป็นส่วนตัว</NuxtLink>
            </label>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading || !form.accept_terms"
            class="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">กำลังสมัครสมาชิก...</span>
            <span v-else>สมัครสมาชิก</span>
          </button>
        </form>
        </div>

        <div v-if="!showEmailForm" class="mt-6 text-center">
          <p class="text-gray-600">
            มีบัญชีอยู่แล้ว? 
            <NuxtLink :to="loginLink" class="text-green-600 hover:text-green-700 font-semibold">
              เข้าสู่ระบบ
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

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { login: loginComposable } = useAuth()

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  confirm_password: '',
  role: 'parent' as 'student' | 'parent',
  accept_terms: false
})

const loading = ref(false)
const error = ref('')
const showEmailForm = ref(false)

const loginLink = computed(() => {
  const redirect = route.query.redirect as string
  return redirect ? `/auth/login?redirect=${encodeURIComponent(redirect)}` : '/auth/login'
})

const handleSocialLogin = async (provider: 'google' | 'facebook' | 'line') => {
  loading.value = true
  error.value = ''

  try {
    // Redirect to OAuth provider
    const redirectUri = `${window.location.origin}/auth/callback/${provider}`
    const redirect = route.query.redirect as string
    const state = redirect ? encodeURIComponent(redirect) : ''
    
    const authUrl = await $fetch<string>(`${config.public.apiBase}/auth/oauth/${provider}/url`, {
      method: 'POST',
      body: {
        redirect_uri: redirectUri,
        state
      }
    })

    if (authUrl) {
      window.location.href = authUrl
    }
  } catch (err: any) {
    console.error('Error initiating social login:', err)
    error.value = err.data?.message || `ไม่สามารถเชื่อมต่อกับ ${provider} ได้ กรุณาลองอีกครั้ง`
    loading.value = false
  }
}

const handleRegister = async () => {
  // Validation
  if (form.password !== form.confirm_password) {
    error.value = 'รหัสผ่านไม่ตรงกัน'
    return
  }

  if (form.password.length < 6) {
    error.value = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await $fetch<{
      success: boolean
      data: {
        user: any
        accessToken: string
      }
    }>(`${config.public.apiBase}/auth/register`, {
      method: 'POST',
      body: {
        username: form.email,
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone || undefined,
        role: form.role
      }
    })

    if (response.success) {
      // Auto login after registration
      await loginComposable(form.email, form.password)
      
      // Wait a bit for state to update
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const redirect = route.query.redirect as string
      if (redirect) {
        await navigateTo(redirect)
      } else {
        // Redirect based on role
        const redirectPath = getRedirectPathByRole(response.data.user, redirect)
        await navigateTo(redirectPath)
      }
    }
  } catch (err: any) {
    console.error('Registration error:', err)
    
    let errorMessage = 'เกิดข้อผิดพลาดในการสมัครสมาชิก'
    if (err.data?.message) {
      errorMessage = err.data.message
    } else if (err.message) {
      errorMessage = err.message
    }
    
    error.value = errorMessage
  } finally {
    loading.value = false
  }
}
</script>

