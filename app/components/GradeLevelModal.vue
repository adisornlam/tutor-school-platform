<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">
          {{ gradeLevel ? 'แก้ไขระดับชั้น' : 'เพิ่มระดับชั้น' }}
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
              รหัส <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.code"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ชื่อ <span class="text-red-500">*</span>
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
              ประเภท <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.level_type"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="elementary">ประถมศึกษา</option>
              <option value="secondary">มัธยมศึกษา</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ระดับชั้น <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.grade_number"
              type="number"
              min="1"
              max="6"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ลำดับการแสดง
            </label>
            <input
              v-model.number="form.display_order"
              type="number"
              min="0"
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
interface GradeLevel {
  id: number
  code: string
  name: string
  level_type: 'elementary' | 'secondary'
  grade_number: number
  display_order: number
}

interface Props {
  show: boolean
  gradeLevel?: GradeLevel | null
}

const props = withDefaults(defineProps<Props>(), {
  gradeLevel: null
})

const emit = defineEmits<{
  close: []
  saved: []
}>()

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const form = reactive({
  code: '',
  name: '',
  level_type: 'elementary' as 'elementary' | 'secondary',
  grade_number: 1,
  display_order: 0
})

const loading = ref(false)
const error = ref('')

watch(() => props.gradeLevel, (gradeLevel) => {
  if (gradeLevel) {
    form.code = gradeLevel.code
    form.name = gradeLevel.name
    form.level_type = gradeLevel.level_type
    form.grade_number = gradeLevel.grade_number
    form.display_order = gradeLevel.display_order
  } else {
    form.code = ''
    form.name = ''
    form.level_type = 'elementary'
    form.grade_number = 1
    form.display_order = 0
  }
  error.value = ''
}, { immediate: true })

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const body: any = {
      code: form.code,
      name: form.name,
      level_type: form.level_type,
      grade_number: form.grade_number,
      display_order: form.display_order
    }

    if (props.gradeLevel) {
      await $fetch(`${config.public.apiBase}/admin/settings/grade-levels/${props.gradeLevel.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body
      })
    } else {
      await $fetch(`${config.public.apiBase}/admin/settings/grade-levels`, {
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
    console.error('Error saving grade level:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  } finally {
    loading.value = false
  }
}
</script>

