<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">การตั้งค่าภาษา</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Default Language -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              ภาษาหลัก
            </label>
            <select
              v-model="form.default_language"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="th">ไทย (Thai)</option>
              <option value="en">English</option>
            </select>
          </div>

          <!-- Supported Languages -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              ภาษาที่รองรับ (คั่นด้วย comma)
            </label>
            <input
              v-model="form.supported_languages"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="th,en"
              required
            />
            <p class="mt-1 text-sm text-gray-500">
              ตัวอย่าง: th,en (ไทย, อังกฤษ)
            </p>
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
  default_language: 'th',
  supported_languages: 'th,en'
})

// Initialize form from settings
watch(() => props.settings, (newSettings) => {
  if (newSettings && newSettings.length > 0) {
    newSettings.forEach((setting: any) => {
      const key = setting.key as keyof typeof form
      if (key in form) {
        form[key] = setting.value || form[key]
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
    console.error('Error saving language settings:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกการตั้งค่า')
  } finally {
    saving.value = false
  }
}
</script>

