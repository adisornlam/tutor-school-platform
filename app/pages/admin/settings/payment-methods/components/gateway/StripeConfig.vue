<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold mb-4">การตั้งค่า Stripe</h3>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Gateway Name
          </label>
          <input
            v-model="form.gateway_name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Publishable Key (API Key) <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.api_key"
            type="text"
            required
            placeholder="pk_test_..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Secret Key (API Secret) <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.api_secret"
            type="password"
            required
            placeholder="sk_test_..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
          >
          <p v-if="gatewayConfig?.api_secret" class="mt-1 text-xs text-gray-500">
            ปัจจุบัน: {{ gatewayConfig.api_secret }} (กรอกเฉพาะเมื่อต้องการเปลี่ยน)
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Webhook Secret
          </label>
          <input
            v-model="form.webhook_secret"
            type="password"
            placeholder="whsec_..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
          >
          <p v-if="gatewayConfig?.webhook_secret" class="mt-1 text-xs text-gray-500">
            ปัจจุบัน: {{ gatewayConfig.webhook_secret }} (กรอกเฉพาะเมื่อต้องการเปลี่ยน)
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <label class="flex items-center">
          <input
            v-model="form.is_test_mode"
            type="checkbox"
            class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          >
          <span class="ml-2 text-sm text-gray-700">Test Mode (ใช้คีย์ทดสอบ)</span>
        </label>

        <label class="flex items-center">
          <input
            v-model="form.is_active"
            type="checkbox"
            class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          >
          <span class="ml-2 text-sm text-gray-700">เปิดใช้งาน</span>
        </label>
      </div>

      <div v-if="saveError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {{ saveError }}
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
  gatewayConfig: any | null
  paymentMethodId: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  saved: []
}>()

const { accessToken } = useAuth()

const saving = ref(false)
const saveError = ref('')

const form = reactive({
  gateway_code: 'stripe',
  gateway_name: 'Stripe',
  api_key: '',
  api_secret: '',
  webhook_secret: '',
  is_test_mode: true,
  is_active: false
})

watch(() => props.gatewayConfig, (config) => {
  if (config) {
    form.gateway_code = config.gateway_code || 'stripe'
    form.gateway_name = config.gateway_name || 'Stripe'
    form.api_key = config.api_key || ''
    // Don't populate api_secret/webhook_secret (they're masked)
    form.is_test_mode = config.is_test_mode !== undefined ? config.is_test_mode : true
    form.is_active = config.is_active !== undefined ? config.is_active : false
  } else {
    form.gateway_code = 'stripe'
    form.gateway_name = 'Stripe'
    form.api_key = ''
    form.api_secret = ''
    form.webhook_secret = ''
    form.is_test_mode = true
    form.is_active = false
  }
  saveError.value = ''
}, { immediate: true })

const handleSubmit = async () => {
  saving.value = true
  saveError.value = ''

  try {
    await $fetch(`/api/admin/settings/payment-methods/${props.paymentMethodId}/gateway`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: form
    })

    emit('saved')
  } catch (err: any) {
    console.error('Error saving Stripe config:', err)
    saveError.value = err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  } finally {
    saving.value = false
  }
}
</script>

