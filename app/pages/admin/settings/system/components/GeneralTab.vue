<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">ข้อมูลทั่วไป</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- App Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              ชื่อแอปพลิเคชัน
            </label>
            <input
              v-model="form.app_name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <!-- App Version -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              เวอร์ชัน
            </label>
            <input
              v-model="form.app_version"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <!-- Logo URL -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              URL โลโก้
            </label>
            <input
              v-model="form.logo_url"
              type="url"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <!-- Favicon URL -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              URL Favicon
            </label>
            <input
              v-model="form.favicon_url"
              type="url"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <!-- Contact Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              อีเมลติดต่อ
            </label>
            <input
              v-model="form.contact_email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <!-- Contact Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              เบอร์โทรศัพท์ติดต่อ
            </label>
            <input
              v-model="form.contact_phone"
              type="tel"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <!-- Address -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ที่อยู่
          </label>
          <textarea
            v-model="form.address"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end pt-4">
          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <span v-if="saving" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            บันทึก
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  settings: any[]
}>()

const emit = defineEmits<{
  saved: []
}>()

const { accessToken } = useAuth()

const saving = ref(false)

const form = reactive({
  app_name: '',
  app_version: '',
  logo_url: '',
  favicon_url: '',
  contact_email: '',
  contact_phone: '',
  address: ''
})

// Initialize form from settings
watch(() => props.settings, (newSettings) => {
  if (newSettings && newSettings.length > 0) {
    newSettings.forEach((setting: any) => {
      const key = setting.key as keyof typeof form
      if (key in form) {
        form[key] = setting.value || ''
      }
    })
  }
}, { immediate: true })

const handleSubmit = async () => {
  try {
    saving.value = true

    const settingsToUpdate = Object.keys(form).map(key => ({
      key,
      value: form[key as keyof typeof form]
    }))

    await $fetch('/api/admin/settings/system', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: {
        settings: settingsToUpdate
      }
    })

    emit('saved')
  } catch (err: any) {
    console.error('Error saving general settings:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกการตั้งค่า')
  } finally {
    saving.value = false
  }
}
</script>

