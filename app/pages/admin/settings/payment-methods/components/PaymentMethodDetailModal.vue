<template>
  <div
    v-if="show && method"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">จัดการ: {{ method.name }}</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex items-center gap-4 mb-6 border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 font-semibold transition-colors relative"
          :class="activeTab === tab.id 
            ? 'text-green-600 border-b-2 border-green-600' 
            : 'text-gray-600 hover:text-green-600'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div>
        <!-- Basic Info Tab -->
        <PaymentMethodBasicInfo
          v-if="activeTab === 'basic'"
          :method="method"
          @saved="handleSaved"
        />

        <!-- Bank Accounts Tab (only for bank_transfer) -->
        <BankAccountsSection
          v-if="activeTab === 'bank_accounts' && method.type === 'bank_transfer'"
          :payment-method-id="method.id"
          @saved="handleSaved"
        />

        <!-- Gateway Configuration Tab (only for payment_gateway) -->
        <GatewayConfigSection
          v-if="activeTab === 'gateway' && method.type === 'payment_gateway'"
          :payment-method-id="method.id"
          :gateway-code="method.code"
          @saved="handleSaved"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PaymentMethodBasicInfo from './PaymentMethodBasicInfo.vue'
import BankAccountsSection from './BankAccountsSection.vue'
import GatewayConfigSection from './GatewayConfigSection.vue'

interface Props {
  show: boolean
  method: any | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const activeTab = ref('basic')

const tabs = computed(() => {
  const baseTabs = [
    { id: 'basic', label: 'ข้อมูลพื้นฐาน' }
  ]

  if (props.method?.type === 'bank_transfer') {
    baseTabs.push({ id: 'bank_accounts', label: 'บัญชีธนาคาร' })
  } else if (props.method?.type === 'payment_gateway') {
    baseTabs.push({ id: 'gateway', label: 'ตั้งค่า Gateway' })
  }

  return baseTabs
})

const handleSaved = () => {
  emit('saved')
}
</script>

