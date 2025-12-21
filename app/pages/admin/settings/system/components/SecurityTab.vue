<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">การตั้งค่าความปลอดภัย</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Session Settings -->
        <div class="border-b border-gray-200 pb-4">
          <h3 class="text-lg font-medium mb-4">Session Settings</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Session Timeout (นาที)
              </label>
              <input
                v-model.number="form.session_timeout"
                type="number"
                min="5"
                max="480"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <p class="mt-1 text-sm text-gray-500">ระยะเวลาหมดอายุของ session</p>
            </div>
          </div>
        </div>

        <!-- Password Policy -->
        <div class="border-b border-gray-200 pb-4">
          <h3 class="text-lg font-medium mb-4">Password Policy</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ความยาวรหัสผ่านขั้นต่ำ
              </label>
              <input
                v-model.number="form.password_min_length"
                type="number"
                min="6"
                max="32"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div class="mt-4 space-y-2">
            <label class="flex items-center">
              <input
                v-model="form.password_require_uppercase"
                type="checkbox"
                class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span class="ml-2 text-sm text-gray-700">ต้องมีตัวพิมพ์ใหญ่</span>
            </label>

            <label class="flex items-center">
              <input
                v-model="form.password_require_lowercase"
                type="checkbox"
                class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span class="ml-2 text-sm text-gray-700">ต้องมีตัวพิมพ์เล็ก</span>
            </label>

            <label class="flex items-center">
              <input
                v-model="form.password_require_number"
                type="checkbox"
                class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span class="ml-2 text-sm text-gray-700">ต้องมีตัวเลข</span>
            </label>

            <label class="flex items-center">
              <input
                v-model="form.password_require_special"
                type="checkbox"
                class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span class="ml-2 text-sm text-gray-700">ต้องมีตัวอักษรพิเศษ (!@#$%^&*)</span>
            </label>
          </div>
        </div>

        <!-- Login Security -->
        <div class="border-b border-gray-200 pb-4">
          <h3 class="text-lg font-medium mb-4">Login Security</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                จำนวนครั้งที่พยายาม login ได้
              </label>
              <input
                v-model.number="form.login_attempts_limit"
                type="number"
                min="3"
                max="10"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ระยะเวลาที่ถูก lock (นาที)
              </label>
              <input
                v-model.number="form.login_lockout_duration"
                type="number"
                min="5"
                max="60"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
        </div>

        <!-- Two-Factor Authentication -->
        <div>
          <h3 class="text-lg font-medium mb-4">Two-Factor Authentication</h3>
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                เปิดใช้งาน 2FA สำหรับ admin
              </label>
              <p class="text-sm text-gray-500 mt-1">
                ต้องใช้การยืนยันตัวตน 2 ขั้นตอนสำหรับ admin
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="form.two_factor_auth_enabled"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
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
  session_timeout: 120,
  password_min_length: 8,
  password_require_uppercase: false,
  password_require_lowercase: false,
  password_require_number: false,
  password_require_special: false,
  login_attempts_limit: 5,
  login_lockout_duration: 15,
  two_factor_auth_enabled: false
})

// Initialize form from settings
watch(() => props.settings, (newSettings) => {
  if (newSettings && newSettings.length > 0) {
    newSettings.forEach((setting: any) => {
      const key = setting.key as keyof typeof form
      if (key in form) {
        if (typeof form[key] === 'number') {
          form[key] = Number(setting.value) || form[key]
        } else if (typeof form[key] === 'boolean') {
          form[key] = setting.value || false
        } else {
          form[key] = setting.value || form[key]
        }
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
    console.error('Error saving security settings:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกการตั้งค่า')
  } finally {
    saving.value = false
  }
}
</script>

