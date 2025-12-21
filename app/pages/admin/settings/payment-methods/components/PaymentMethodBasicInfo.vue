<template>
  <div class="space-y-6">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ชื่อ (ภาษาไทย) <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ชื่อ (ภาษาอังกฤษ)
          </label>
          <input
            v-model="form.name_en"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            คำอธิบาย
          </label>
          <textarea
            v-model="form.description"
            rows="2"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Icon URL
          </label>
          <input
            v-model="form.icon"
            type="url"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ลำดับการแสดงผล
          </label>
          <input
            v-model.number="form.display_order"
            type="number"
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>

        <div class="md:col-span-2 flex items-center space-x-4">
          <label class="flex items-center">
            <input
              v-model="form.is_active"
              type="checkbox"
              class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            >
            <span class="ml-2 text-sm text-gray-700">เปิดใช้งาน</span>
          </label>

          <label class="flex items-center">
            <input
              v-model="form.is_default"
              type="checkbox"
              class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            >
            <span class="ml-2 text-sm text-gray-700">ตั้งเป็นค่าเริ่มต้น</span>
          </label>
        </div>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <div class="flex justify-end space-x-3 pt-4">
        <button
          type="submit"
          :disabled="saving"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="saving">กำลังบันทึก...</span>
          <span v-else>บันทึก</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
interface Props {
  method: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  saved: []
}>()

const { accessToken } = useAuth()

const saving = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  name_en: '',
  description: '',
  icon: '',
  is_active: true,
  is_default: false,
  display_order: 0
})

watch(() => props.method, (method) => {
  if (method) {
    form.name = method.name || ''
    form.name_en = method.name_en || ''
    form.description = method.description || ''
    form.icon = method.icon || ''
    form.is_active = method.is_active !== undefined ? method.is_active : true
    form.is_default = method.is_default !== undefined ? method.is_default : false
    form.display_order = method.display_order || 0
  }
  error.value = ''
}, { immediate: true })

const handleSubmit = async () => {
  saving.value = true
  error.value = ''

  try {
    await $fetch(`/api/admin/settings/payment-methods/${props.method.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: form
    })

    emit('saved')
  } catch (err: any) {
    console.error('Error saving payment method:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  } finally {
    saving.value = false
  }
}
</script>

