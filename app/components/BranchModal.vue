<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">
          {{ branch ? 'แก้ไขสาขา' : 'เพิ่มสาขา' }}
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
              ชื่อสาขา <span class="text-red-500">*</span>
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
              รหัสสาขา <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.code"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ที่อยู่
            </label>
            <textarea
              v-model="form.address"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เบอร์โทรศัพท์
            </label>
            <input
              v-model="form.phone"
              type="tel"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              อีเมล
            </label>
            <input
              v-model="form.email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              สถานะ
            </label>
            <select
              v-model="form.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="active">ใช้งาน</option>
              <option value="inactive">ปิดใช้งาน</option>
            </select>
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
interface Branch {
  id: number
  name: string
  code: string
  address?: string | null
  phone?: string | null
  email?: string | null
  status: 'active' | 'inactive'
}

interface Props {
  show: boolean
  branch?: Branch | null
}

const props = withDefaults(defineProps<Props>(), {
  branch: null
})

const emit = defineEmits<{
  close: []
  saved: []
}>()

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const form = reactive({
  name: '',
  code: '',
  address: '',
  phone: '',
  email: '',
  status: 'active' as 'active' | 'inactive'
})

const loading = ref(false)
const error = ref('')

// Initialize form when branch prop changes
watch(() => props.branch, (branch) => {
  if (branch) {
    form.name = branch.name
    form.code = branch.code
    form.address = branch.address || ''
    form.phone = branch.phone || ''
    form.email = branch.email || ''
    form.status = branch.status
  } else {
    // Reset form for new branch
    form.name = ''
    form.code = ''
    form.address = ''
    form.phone = ''
    form.email = ''
    form.status = 'active'
  }
  error.value = ''
}, { immediate: true })

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const body: any = {
      name: form.name,
      code: form.code,
      address: form.address || null,
      phone: form.phone || null,
      email: form.email || null,
      status: form.status
    }

    if (props.branch) {
      // Update branch
      await $fetch(`${config.public.apiBase}/admin/settings/branches/${props.branch.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body
      })
    } else {
      // Create branch
      await $fetch(`${config.public.apiBase}/admin/settings/branches`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body
      })
    }

    emit('saved')
    emit('close')
  } catch (err: any) {
    console.error('Error saving branch:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  } finally {
    loading.value = false
  }
}
</script>

