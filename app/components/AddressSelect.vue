<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      <slot name="label">ที่อยู่จัดส่ง <span class="text-red-500">*</span></slot>
    </label>
    <div class="relative">
      <select
        :value="modelValue"
        @change="handleChange"
        :disabled="disabled || loading"
        :required="required"
        data-address-select
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-gray-900"
      >
        <option value="">{{ loading ? 'กำลังโหลด...' : placeholder }}</option>
        <option
          v-for="address in addresses"
          :key="address.id"
          :value="address.id"
        >
          {{ formatAddress(address) }}
        </option>
      </select>
      <button
        v-if="showAddButton"
        type="button"
        @click="$emit('add-new')"
        class="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700"
        title="เพิ่มที่อยู่ใหม่"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
    <p v-if="hint" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
interface Address {
  id: number
  address_type: 'home' | 'work' | 'other'
  recipient_name: string
  phone: string
  address_line1: string
  address_line2?: string
  subdistrict?: string
  district?: string
  province: string
  postal_code: string
  country?: string
  is_default: boolean
}

interface Props {
  modelValue: number | null
  userId: number
  loading?: boolean
  disabled?: boolean
  required?: boolean
  placeholder?: string
  hint?: string
  showAddButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  required: true,
  placeholder: 'เลือกที่อยู่',
  hint: '',
  showAddButton: true
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  'add-new': []
}>()

const addresses = ref<Address[]>([])
const config = useRuntimeConfig()
const { accessToken } = useAuth()

const loadAddresses = async () => {
  if (!props.userId) {
    addresses.value = []
    return
  }

  try {
    const response = await $fetch<{ success: boolean; data: Address[] }>(
      `${config.public.apiBase}/admin/users/${props.userId}/addresses`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      }
    )
    if (response.success) {
      addresses.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading addresses:', err)
    addresses.value = []
  }
}

const formatAddress = (address: Address) => {
  const parts = []
  if (address.recipient_name) parts.push(address.recipient_name)
  if (address.address_line1) parts.push(address.address_line1)
  if (address.district) parts.push(`อ.${address.district}`)
  if (address.province) parts.push(`จ.${address.province}`)
  if (address.postal_code) parts.push(address.postal_code)
  
  const addressStr = parts.join(' ')
  const typeLabel = address.address_type === 'home' ? 'บ้าน' : address.address_type === 'work' ? 'ที่ทำงาน' : 'อื่นๆ'
  const defaultLabel = address.is_default ? ' (หลัก)' : ''
  
  return `${addressStr} [${typeLabel}${defaultLabel}]`
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value ? parseInt(target.value) : null
  emit('update:modelValue', value)
}

watch(() => props.userId, (newUserId) => {
  if (newUserId) {
    loadAddresses()
  } else {
    addresses.value = []
  }
}, { immediate: true })

const reloadAddresses = async () => {
  await loadAddresses()
}

defineExpose({
  loadAddresses,
  reloadAddresses,
  addresses: computed(() => addresses.value)
})
</script>

