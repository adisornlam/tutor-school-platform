<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">การตั้งค่าการแสดงผล</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Items Per Page -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              จำนวนรายการต่อหน้า
            </label>
            <select
              v-model.number="form.items_per_page"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>

          <!-- Theme Mode -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Theme Mode
            </label>
            <select
              v-model="form.theme_mode"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (ตามระบบ)</option>
            </select>
          </div>

          <!-- Primary Color -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Primary Color (Hex)
            </label>
            <div class="flex items-center gap-2">
              <input
                v-model="form.primary_color"
                type="color"
                class="w-16 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                v-model="form.primary_color"
                type="text"
                pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
                placeholder="#10b981"
              />
            </div>
          </div>

          <!-- Secondary Color -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Secondary Color (Hex)
            </label>
            <div class="flex items-center gap-2">
              <input
                v-model="form.secondary_color"
                type="color"
                class="w-16 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                v-model="form.secondary_color"
                type="text"
                pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
                placeholder="#2563eb"
              />
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
  items_per_page: 20,
  theme_mode: 'light',
  primary_color: '#10b981',
  secondary_color: '#2563eb'
})

// Initialize form from settings
watch(() => props.settings, (newSettings) => {
  if (newSettings && newSettings.length > 0) {
    newSettings.forEach((setting: any) => {
      const key = setting.key as keyof typeof form
      if (key in form) {
        if (typeof form[key] === 'number') {
          form[key] = Number(setting.value) || form[key]
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
    console.error('Error saving display settings:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกการตั้งค่า')
  } finally {
    saving.value = false
  }
}
</script>

