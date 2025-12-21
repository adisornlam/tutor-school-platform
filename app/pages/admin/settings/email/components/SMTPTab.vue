<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-2">ตั้งค่า SMTP</h2>
      <p class="text-gray-600">กำหนดค่าการส่งอีเมลผ่าน SMTP Server</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- SMTP Host -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            SMTP Host <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.host"
            type="text"
            required
            placeholder="smtp.gmail.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>

        <!-- SMTP Port -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            SMTP Port <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="form.port"
            type="number"
            required
            min="1"
            max="65535"
            placeholder="587"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>

        <!-- Username -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Username <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.username"
            type="text"
            required
            placeholder="your-email@gmail.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Password <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>

        <!-- From Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            จากอีเมล (From Email) <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.from_email"
            type="email"
            required
            placeholder="noreply@example.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>

        <!-- From Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            จากชื่อ (From Name) <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.from_name"
            type="text"
            required
            placeholder="Tutor School"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>
      </div>

      <!-- Options -->
      <div class="space-y-4">
        <div class="flex items-center">
          <input
            v-model="form.secure"
            type="checkbox"
            id="secure"
            class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          >
          <label for="secure" class="ml-2 text-sm font-medium text-gray-700">
            ใช้ SSL/TLS (Secure)
          </label>
        </div>

        <div class="flex items-center">
          <input
            v-model="form.enabled"
            type="checkbox"
            id="enabled"
            class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          >
          <label for="enabled" class="ml-2 text-sm font-medium text-gray-700">
            เปิดใช้งานการส่งอีเมล
          </label>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <!-- Success Message -->
      <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
        {{ success }}
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">กำลังบันทึก...</span>
          <span v-else>บันทึกการตั้งค่า</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { accessToken } = useAuth()

interface SMTPSettings {
  host: string
  port: number
  secure: boolean
  username: string
  password: string
  from_email: string
  from_name: string
  enabled: boolean
}

const form = reactive<SMTPSettings>({
  host: '',
  port: 587,
  secure: false,
  username: '',
  password: '',
  from_email: '',
  from_name: '',
  enabled: false
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const loadSMTPSettings = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await $fetch<{
      success: boolean
      data: SMTPSettings
    }>(`${config.public.apiBase}/admin/settings/email/smtp`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    if (response.success) {
      form.host = response.data.host
      form.port = response.data.port
      form.secure = response.data.secure
      form.username = response.data.username
      form.from_email = response.data.from_email
      form.from_name = response.data.from_name
      form.enabled = response.data.enabled
      // Don't pre-fill password for security
    }
  } catch (err: any) {
    console.error('Error loading SMTP settings:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    await $fetch(`${config.public.apiBase}/admin/settings/email/smtp`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: form
    })

    success.value = 'บันทึกการตั้งค่า SMTP เรียบร้อยแล้ว'
  } catch (err: any) {
    console.error('Error saving SMTP settings:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSMTPSettings()
})
</script>

