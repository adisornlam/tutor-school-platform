<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">
          {{ account ? 'แก้ไขบัญชีธนาคาร' : 'เพิ่มบัญชีธนาคาร' }}
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
              ชื่อธนาคาร <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.bank_name"
              type="text"
              required
              placeholder="ธนาคารกรุงเทพ"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ชื่อบัญชี <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.account_name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เลขบัญชี <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.account_number"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ประเภทบัญชี
            </label>
            <select
              v-model="form.account_type"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="savings">ออมทรัพย์</option>
              <option value="current">กระแสรายวัน</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              สาขา
            </label>
            <input
              v-model="form.branch_name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              QR Code URL
            </label>
            <input
              v-model="form.qr_code_url"
              type="url"
              placeholder="https://example.com/qr-code.png"
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
  account?: any | null
  paymentMethodId: number
}

const props = withDefaults(defineProps<Props>(), {
  account: null
})

const emit = defineEmits<{
  close: []
  saved: []
}>()

const { accessToken } = useAuth()

const loading = ref(false)
const error = ref('')

const form = reactive({
  bank_name: '',
  account_name: '',
  account_number: '',
  account_type: 'savings' as 'savings' | 'current',
  branch_name: '',
  qr_code_url: '',
  is_active: true,
  is_default: false,
  display_order: 0
})

watch(() => props.account, (account) => {
  if (account) {
    form.bank_name = account.bank_name || ''
    form.account_name = account.account_name || ''
    form.account_number = account.account_number || ''
    form.account_type = account.account_type || 'savings'
    form.branch_name = account.branch_name || ''
    form.qr_code_url = account.qr_code_url || ''
    form.is_active = account.is_active !== undefined ? account.is_active : true
    form.is_default = account.is_default !== undefined ? account.is_default : false
    form.display_order = account.display_order || 0
  } else {
    form.bank_name = ''
    form.account_name = ''
    form.account_number = ''
    form.account_type = 'savings'
    form.branch_name = ''
    form.qr_code_url = ''
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
    if (props.account) {
      // Update bank account
      await $fetch(
        `/api/admin/settings/payment-methods/${props.paymentMethodId}/bank-accounts/${props.account.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          },
          body: form
        }
      )
    } else {
      // Create bank account
      await $fetch(
        `/api/admin/settings/payment-methods/${props.paymentMethodId}/bank-accounts`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          },
          body: form
        }
      )
    }

    emit('saved')
    emit('close')
  } catch (err: any) {
    console.error('Error saving bank account:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  } finally {
    loading.value = false
  }
}
</script>

