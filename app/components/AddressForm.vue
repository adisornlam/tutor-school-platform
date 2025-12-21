<template>
  <div class="space-y-4" data-address-form>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          ประเภทที่อยู่
        </label>
        <select
          v-model="form.address_type"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
        >
          <option value="home">บ้าน</option>
          <option value="work">ที่ทำงาน</option>
          <option value="other">อื่นๆ</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          ชื่อผู้รับ <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.recipient_name"
          type="text"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
          placeholder="ชื่อ-นามสกุล ผู้รับเอกสาร"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          เบอร์โทรศัพท์ <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.phone"
          type="tel"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
          placeholder="080-123-4567"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        ที่อยู่บรรทัดที่ 1 <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.address_line1"
        type="text"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
        placeholder="เลขที่ บ้าน อาคาร ถนน"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        ที่อยู่บรรทัดที่ 2
      </label>
      <input
        v-model="form.address_line2"
        type="text"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
        placeholder="หมู่ ซอย แขวง/ตำบล (ถ้ามี)"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          แขวง/ตำบล
        </label>
        <input
          v-model="form.subdistrict"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          เขต/อำเภอ
        </label>
        <input
          v-model="form.district"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          จังหวัด <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.province"
          type="text"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          รหัสไปรษณีย์ <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.postal_code"
          type="text"
          required
          maxlength="5"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
          placeholder="10110"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          ประเทศ
        </label>
        <input
          v-model="form.country"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
          placeholder="Thailand"
        />
      </div>
    </div>

    <div class="flex items-center">
      <input
        v-model="form.is_default"
        type="checkbox"
        id="is_default"
        class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
      />
      <label for="is_default" class="ml-2 text-sm text-gray-700">
        ตั้งเป็นที่อยู่หลัก
      </label>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Address {
  id?: number
  user_id?: number
  address_type?: 'home' | 'work' | 'other'
  recipient_name?: string
  phone?: string
  address_line1?: string
  address_line2?: string
  subdistrict?: string
  district?: string
  province?: string
  postal_code?: string
  country?: string
  is_default?: boolean
}

interface Props {
  address?: Address | null
}

const props = withDefaults(defineProps<Props>(), {
  address: null
})

const emit = defineEmits<{
  update: [address: Address]
}>()

const form = reactive<Address>({
  address_type: 'home',
  recipient_name: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  subdistrict: '',
  district: '',
  province: '',
  postal_code: '',
  country: 'Thailand',
  is_default: false
})

const error = ref('')

// Initialize form when address prop changes
watch(() => props.address, (address) => {
  if (address) {
    Object.assign(form, {
      address_type: address.address_type || 'home',
      recipient_name: address.recipient_name || '',
      phone: address.phone || '',
      address_line1: address.address_line1 || '',
      address_line2: address.address_line2 || '',
      subdistrict: address.subdistrict || '',
      district: address.district || '',
      province: address.province || '',
      postal_code: address.postal_code || '',
      country: address.country || 'Thailand',
      is_default: address.is_default || false
    })
  } else {
    // Reset form
    Object.assign(form, {
      address_type: 'home',
      recipient_name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      subdistrict: '',
      district: '',
      province: '',
      postal_code: '',
      country: 'Thailand',
      is_default: false
    })
  }
  error.value = ''
}, { immediate: true })

// Emit updates
watch(form, (newForm) => {
  emit('update', { ...newForm })
}, { deep: true })

defineExpose({
  validate: () => {
    if (!form.recipient_name || !form.phone || !form.address_line1 || !form.province || !form.postal_code) {
      error.value = 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน'
      return false
    }
    error.value = ''
    return true
  },
  getData: () => ({ ...form })
})
</script>

