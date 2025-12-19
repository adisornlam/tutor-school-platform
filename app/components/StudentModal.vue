<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">
          {{ student ? 'แก้ไขผู้เรียน' : 'เพิ่มผู้เรียน' }}
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
              Username <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.username"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              :disabled="!!student"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              v-model="form.email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ชื่อ <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.first_name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              นามสกุล <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.last_name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              รหัสผ่าน <span class="text-red-500">*</span>
              <span v-if="student" class="text-xs text-gray-500">(เว้นว่างไว้ถ้าไม่ต้องการเปลี่ยน)</span>
            </label>
            <input
              v-model="form.password"
              type="password"
              :required="!student"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
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
interface Student {
  id: number
  username: string
  email: string | null
  first_name: string
  last_name: string
  phone?: string | null
  status: string
  parents: Array<{ id: number; name: string; relationship: string }>
}

interface Props {
  show: boolean
  student?: Student | null
}

const props = withDefaults(defineProps<Props>(), {
  student: null
})

const emit = defineEmits<{
  close: []
  saved: []
}>()

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const form = reactive({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  phone: ''
})

const loading = ref(false)
const error = ref('')

// Initialize form when student prop changes
watch(() => props.student, (student) => {
  if (student) {
    form.username = student.username
    form.email = student.email || ''
    form.first_name = student.first_name
    form.last_name = student.last_name
    form.phone = student.phone || ''
    form.password = ''
  } else {
    // Reset form for new student
    form.username = ''
    form.email = ''
    form.first_name = ''
    form.last_name = ''
    form.password = ''
    form.phone = ''
  }
  error.value = ''
}, { immediate: true })

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const body: any = {
      username: form.username,
      email: form.email || null,
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone || null,
      roles: ['student'] // Always assign student role
    }

    if (props.student) {
      // Update student
      if (form.password) {
        body.password = form.password
      }
      await $fetch(`${config.public.apiBase}/admin/users/${props.student.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body
      })
    } else {
      // Create student
      if (!form.password) {
        error.value = 'กรุณากรอกรหัสผ่าน'
        loading.value = false
        return
      }
      body.password = form.password
      await $fetch(`${config.public.apiBase}/admin/users`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body
      })
    }

    emit('saved')
  } catch (err: any) {
    console.error('Error saving student:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  } finally {
    loading.value = false
  }
}
</script>

