<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div v-if="loading" class="space-y-4">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p class="text-gray-600">กำลังเข้าสู่ระบบ...</p>
      </div>
      <div v-else-if="error" class="space-y-4">
        <div class="text-red-600 text-xl">เกิดข้อผิดพลาด</div>
        <p class="text-gray-600">{{ error }}</p>
        <NuxtLink to="/auth/login" class="text-green-600 hover:text-green-700">
          กลับไปหน้าเข้าสู่ระบบ
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'homepage'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { login: loginComposable, user } = useAuth()
const { getRedirectPathByRole } = await import('~/utils/auth')

const provider = route.params.provider as string
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const code = route.query.code as string
    const state = route.query.state as string

    if (!code) {
      throw new Error('Authorization code not found')
    }

    // Exchange code for token and user info
    const response = await $fetch<{
      success: boolean
      data: {
        user: any
        accessToken: string
      }
    }>(`${config.public.apiBase}/auth/oauth/${provider}/callback`, {
      method: 'POST',
      body: {
        code,
        redirect_uri: `${window.location.origin}/auth/callback/${provider}`
      }
    })

    if (response.success) {
      // Update auth state
      user.value = response.data.user
      const tokenCookie = useCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 2 * 60 * 60 // 2 hours
      })
      tokenCookie.value = response.data.accessToken

      // Wait a bit for state to update
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Redirect
      const redirectPath = state ? decodeURIComponent(state) : null
      if (redirectPath) {
        await navigateTo(redirectPath)
      } else {
        const redirectPathByRole = getRedirectPathByRole(response.data.user, null)
        await navigateTo(redirectPathByRole)
      }
    }
  } catch (err: any) {
    console.error('OAuth callback error:', err)
    error.value = err.data?.message || err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
    loading.value = false
  }
})
</script>

