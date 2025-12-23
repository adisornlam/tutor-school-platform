<template>
  <div class="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
    <div class="max-w-md w-full mx-4">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-center mb-2">ลืมรหัสผ่าน</h1>
        <p class="text-gray-600 text-center mb-8">
          กรุณากรอกชื่อผู้ใช้งานหรืออีเมล์ของคุณ เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้คุณ
        </p>

        <form @submit.prevent="handleForgotPassword" class="space-y-6">
          <div>
            <label for="identifier" class="block text-sm font-medium text-gray-700 mb-2">
              ชื่อผู้ใช้งาน หรือ อีเมล์
            </label>
            <input
              id="identifier"
              v-model="form.identifier"
              type="text"
              required
              class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400"
              placeholder="username หรือ email"
            >
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>

          <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {{ success }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <span v-if="loading">กำลังส่ง...</span>
            <span v-else>ส่งลิงก์รีเซ็ตรหัสผ่าน</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <NuxtLink 
            to="/auth/login" 
            class="text-sm text-green-600 hover:text-green-700"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const form = ref({
  identifier: ''
})

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const handleForgotPassword = async () => {
  loading.value = true
  error.value = null
  success.value = null

  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: {
        identifier: form.value.identifier
      }
    })
    
    success.value = 'เรามีส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมล์ของคุณแล้ว กรุณาตรวจสอบอีเมล์'
    form.value.identifier = ''
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
  } finally {
    loading.value = false
  }
}
</script>

