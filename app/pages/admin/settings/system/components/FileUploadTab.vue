<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">การตั้งค่าการอัพโหลดไฟล์</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Max File Size -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              ขนาดไฟล์สูงสุด (MB)
            </label>
            <input
              v-model.number="form.max_file_size"
              type="number"
              min="1"
              max="100"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <!-- Storage Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              ประเภท Storage
            </label>
            <select
              v-model="form.storage_type"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="local">Local Storage</option>
              <option value="s3">Amazon S3</option>
            </select>
          </div>
        </div>

        <!-- Allowed File Types -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ประเภทไฟล์ที่อนุญาต (คั่นด้วย comma)
          </label>
          <input
            v-model="form.allowed_file_types"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="jpg,jpeg,png,gif,pdf,doc,docx"
            required
          />
          <p class="mt-1 text-sm text-gray-500">
            ตัวอย่าง: jpg, jpeg, png, gif, pdf, doc, docx, xls, xlsx
          </p>
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
  max_file_size: 10,
  allowed_file_types: 'jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx',
  storage_type: 'local'
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
    console.error('Error saving file upload settings:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกการตั้งค่า')
  } finally {
    saving.value = false
  }
}
</script>

