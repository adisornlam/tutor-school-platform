<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">การตั้งค่าการแจ้งเตือน</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Notification Channels -->
        <div class="border-b border-gray-200 pb-4">
          <h3 class="text-lg font-medium mb-4">ช่องทางการแจ้งเตือน</h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  อีเมล
                </label>
                <p class="text-sm text-gray-500 mt-1">
                  เปิดใช้งานการแจ้งเตือนทางอีเมล
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="form.email_notifications_enabled"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  SMS
                </label>
                <p class="text-sm text-gray-500 mt-1">
                  เปิดใช้งานการแจ้งเตือนทาง SMS
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="form.sms_notifications_enabled"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Auto Notifications -->
        <div>
          <h3 class="text-lg font-medium mb-4">การแจ้งเตือนอัตโนมัติ</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                แจ้งเตือนก่อนคอร์สเริ่ม (นาที)
              </label>
              <input
                v-model.number="form.course_reminder_before_minutes"
                type="number"
                min="5"
                max="1440"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <p class="mt-1 text-sm text-gray-500">ส่งการแจ้งเตือนก่อนคอร์สเริ่มกี่นาที</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                แจ้งเตือนก่อนวันชำระเงิน (วัน)
              </label>
              <input
                v-model.number="form.payment_reminder_before_days"
                type="number"
                min="1"
                max="30"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <p class="mt-1 text-sm text-gray-500">ส่งการแจ้งเตือนก่อนวันชำระเงินกี่วัน</p>
            </div>
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
  email_notifications_enabled: true,
  sms_notifications_enabled: false,
  course_reminder_before_minutes: 60,
  payment_reminder_before_days: 3
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
    console.error('Error saving notification settings:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกการตั้งค่า')
  } finally {
    saving.value = false
  }
}
</script>

