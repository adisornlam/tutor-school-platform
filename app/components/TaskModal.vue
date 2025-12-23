<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">
          {{ task ? 'แก้ไขงาน' : 'สร้างงาน' }}
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
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ชื่องาน <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="เช่น จัดทำรายงาน, ตรวจสอบงานนักเรียน"
          >
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            คำอธิบาย
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="รายละเอียดเพิ่มเติม"
          ></textarea>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              วันที่เริ่มต้น
            </label>
            <input
              v-model="form.start_date"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              วันครบกำหนด
            </label>
            <input
              v-model="form.due_date"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>
        </div>

        <!-- Priority and Status -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ลำดับความสำคัญ
            </label>
            <select
              v-model="form.priority"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="low">ต่ำ</option>
              <option value="medium">ปานกลาง</option>
              <option value="high">สูง</option>
              <option value="urgent">ด่วน</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              สถานะ
            </label>
            <select
              v-model="form.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="not_started">ยังไม่เริ่ม</option>
              <option value="in_progress">กำลังทำ</option>
              <option value="completed">เสร็จสิ้น</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
          </div>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            หมวดหมู่
          </label>
          <input
            v-model="form.category"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="เช่น การบ้าน, รายงาน, อื่นๆ"
          >
        </div>

        <!-- Color -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            สีงาน
          </label>
          <div class="flex items-center space-x-2">
            <button
              v-for="colorOption in colorOptions"
              :key="colorOption.value"
              type="button"
              @click="form.color = colorOption.value"
              class="w-10 h-10 rounded-lg border-2 transition-all"
              :class="[
                form.color === colorOption.value ? 'border-gray-800 scale-110' : 'border-gray-300',
                `bg-${colorOption.class}`
              ]"
              :style="{ backgroundColor: colorOption.value }"
            >
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
          >
            ยกเลิก
          </button>
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
  </div>
</template>

<script setup lang="ts">
interface Task {
  id: number
  user_id: number
  title: string
  description?: string | null
  due_date?: string | null
  start_date?: string | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
  color: string
  category?: string | null
  is_shared: boolean
  shared_scope: string
  shared_branch_id?: number | null
  completed_at?: string | null
}

interface Props {
  show: boolean
  task?: Task | null
  initialDate?: Date | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  saved: [task: Task]
}>()

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const saving = ref(false)

const form = reactive({
  title: '',
  description: '',
  start_date: '',
  due_date: '',
  priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  status: 'not_started' as 'not_started' | 'in_progress' | 'completed' | 'cancelled',
  color: '#10B981',
  category: ''
})

// Color options
const colorOptions = [
  { value: '#10B981', class: 'green-500', label: 'เขียว' },
  { value: '#3B82F6', class: 'blue-500', label: 'ฟ้า' },
  { value: '#F59E0B', class: 'yellow-500', label: 'เหลือง' },
  { value: '#EF4444', class: 'red-500', label: 'แดง' },
  { value: '#8B5CF6', class: 'purple-500', label: 'ม่วง' },
  { value: '#EC4899', class: 'pink-500', label: 'ชมพู' }
]

const formatDateInput = (date: Date | string | null): string => {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

const initializeForm = () => {
  if (props.task) {
    form.title = props.task.title
    form.description = props.task.description || ''
    form.start_date = formatDateInput(props.task.start_date)
    form.due_date = formatDateInput(props.task.due_date)
    form.priority = props.task.priority
    form.status = props.task.status
    form.color = props.task.color
    form.category = props.task.category || ''
  } else {
    form.title = ''
    form.description = ''
    // Use initialDate if provided, otherwise empty
    if (props.initialDate) {
      form.start_date = formatDateInput(props.initialDate)
      form.due_date = formatDateInput(props.initialDate)
    } else {
      form.start_date = ''
      form.due_date = ''
    }
    form.priority = 'medium'
    form.status = 'not_started'
    form.color = '#10B981'
    form.category = ''
  }
}

const handleSubmit = async () => {
  saving.value = true

  try {
    const payload = {
      title: form.title,
      description: form.description || null,
      due_date: form.due_date || null,
      start_date: form.start_date || null,
      priority: form.priority,
      status: form.status,
      color: form.color,
      category: form.category || null
    }

    let response
    if (props.task) {
      response = await $fetch<{
        success: boolean
        data: Task
      }>(`${config.public.apiBase}/calendar/tasks/${props.task.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: payload
      })
    } else {
      response = await $fetch<{
        success: boolean
        data: Task
      }>(`${config.public.apiBase}/calendar/tasks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: payload
      })
    }

    if (response.success) {
      emit('saved', response.data)
      emit('close')
    }
  } catch (error: any) {
    console.error('Error saving task:', error)
    alert(error.data?.message || 'เกิดข้อผิดพลาดในการบันทึกงาน')
  } finally {
    saving.value = false
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    initializeForm()
  }
})

onMounted(() => {
  if (props.show) {
    initializeForm()
  }
})
</script>

