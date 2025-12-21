<template>
  <div class="space-y-6">
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      <p class="mt-2 text-gray-600">กำลังโหลด...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else>
      <!-- Stripe Configuration -->
      <StripeConfig
        v-if="gatewayCode === 'stripe'"
        :gateway-config="gatewayConfig"
        :payment-method-id="paymentMethodId"
        @saved="handleSaved"
      />

      <!-- Ksher Configuration -->
      <KsherConfig
        v-else-if="gatewayCode === 'ksher'"
        :gateway-config="gatewayConfig"
        :payment-method-id="paymentMethodId"
        @saved="handleSaved"
      />

      <!-- Generic Gateway Configuration -->
      <GenericGatewayConfig
        v-else
        :gateway-config="gatewayConfig"
        :payment-method-id="paymentMethodId"
        :gateway-code="gatewayCode"
        @saved="handleSaved"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import StripeConfig from './gateway/StripeConfig.vue'
import KsherConfig from './gateway/KsherConfig.vue'
import GenericGatewayConfig from './gateway/GenericGatewayConfig.vue'

interface Props {
  paymentMethodId: number
  gatewayCode: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  saved: []
}>()

const { accessToken } = useAuth()

const loading = ref(false)
const error = ref<string | null>(null)
const gatewayConfig = ref<any>(null)

const loadGatewayConfig = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await $fetch<{ success: boolean; data: any }>(
      `/api/admin/settings/payment-methods/${props.paymentMethodId}/gateway`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      }
    )

    if (response.success) {
      gatewayConfig.value = response.data
    } else {
      error.value = 'ไม่สามารถโหลดการตั้งค่า Gateway ได้'
    }
  } catch (err: any) {
    console.error('Error loading gateway config:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดการตั้งค่า Gateway'
  } finally {
    loading.value = false
  }
}

const handleSaved = () => {
  loadGatewayConfig()
  emit('saved')
}

onMounted(() => {
  loadGatewayConfig()
})
</script>

