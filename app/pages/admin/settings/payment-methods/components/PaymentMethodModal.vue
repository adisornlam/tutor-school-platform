<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">
          {{ method ? 'แก้ไขวิธีชำระเงิน' : 'เพิ่มวิธีชำระเงิน' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              รหัส (Code) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.code"
              type="text"
              required
              :disabled="!!method"
              pattern="[a-z0-9_]+"
              placeholder="bank_transfer"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
            >
            <p class="mt-1 text-xs text-gray-500">ใช้ตัวพิมพ์เล็ก, ตัวเลข และ _ เท่านั้น</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ประเภท <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.type"
              required
              :disabled="!!method"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
            >
              <option value="bank_transfer">โอนเงินผ่านธนาคาร</option>
              <option value="payment_gateway">Payment Gateway</option>
              <option value="other">อื่นๆ</option>
            </select>
          </div>

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
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">กำลังบันทึก...</span>
            <span v-else>บันทึก</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  method?: any | null
}

const props = withDefaults(defineProps<Props>(), {
  method: null
})

const emit = defineEmits<{
  close: []
  saved: []
}>()

const { accessToken } = useAuth()

const loading = ref(false)
const error = ref('')

const form = reactive({
  code: '',
  name: '',
  name_en: '',
  type: 'bank_transfer' as 'bank_transfer' | 'payment_gateway' | 'other',
  description: '',
  icon: '',
  is_active: true,
  is_default: false,
  display_order: 0
})

watch(() => props.method, (method) => {
  if (method) {
    form.code = method.code || ''
    form.name = method.name || ''
    form.name_en = method.name_en || ''
    form.type = method.type || 'bank_transfer'
    form.description = method.description || ''
    form.icon = method.icon || ''
    form.is_active = method.is_active !== undefined ? method.is_active : true
    form.is_default = method.is_default !== undefined ? method.is_default : false
    form.display_order = method.display_order || 0
  } else {
    form.code = ''
    form.name = ''
    form.name_en = ''
    form.type = 'bank_transfer'
    form.description = ''
    form.icon = ''
    form.is_active = true
    form.is_default = false
    form.display_order = 0
  }
  error.value = ''
}, { immediate: true })

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    if (props.method) {
      // Update payment method
      await $fetch(`/api/admin/settings/payment-methods/${props.method.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: form
      })
    } else {
      // Create payment method
      await $fetch('/api/admin/settings/payment-methods', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: form
      })
    }

    emit('saved')
    emit('close')
  } catch (err: any) {
    console.error('Error saving payment method:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  } finally {
    loading.value = false
  }
}
</script>

