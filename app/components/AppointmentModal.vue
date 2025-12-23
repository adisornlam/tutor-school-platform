<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">
          {{ appointment ? 'แก้ไขการนัดหมาย' : 'สร้างการนัดหมาย' }}
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
            หัวข้อ <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="เช่น นัดหมายนักเรียน, ประชุมทีม"
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

        <!-- Date & Time -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เริ่มต้น <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.startDate"
              type="date"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              @change="updateStartDateTime"
            >
            <input
              v-model="form.startTime"
              type="time"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-2"
              @change="updateStartDateTime"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              สิ้นสุด <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.endDate"
              type="date"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              @change="updateEndDateTime"
            >
            <input
              v-model="form.endTime"
              type="time"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-2"
              @change="updateEndDateTime"
            >
          </div>
        </div>

        <!-- Appointment Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ประเภทการนัดหมาย
          </label>
          <select
            v-model="form.appointment_type"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="student">นัดหมายนักเรียน</option>
            <option value="meeting">ประชุม</option>
            <option value="parent">นัดหมายผู้ปกครอง</option>
            <option value="staff">นัดหมายเจ้าหน้าที่</option>
            <option value="other">อื่นๆ</option>
          </select>
        </div>

        <!-- Location -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            สถานที่
          </label>
          <input
            v-model="form.location"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="เช่น ห้องประชุม, Zoom Meeting"
          >
        </div>

        <!-- Meeting Link -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ลิงก์ประชุม
          </label>
          <input
            v-model="form.meeting_link"
            type="url"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="https://zoom.us/j/..."
          >
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            สถานะ
          </label>
          <select
            v-model="form.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="scheduled">จองแล้ว</option>
            <option value="confirmed">ยืนยันแล้ว</option>
            <option value="cancelled">ยกเลิก</option>
            <option value="completed">เสร็จสิ้น</option>
          </select>
        </div>

        <!-- Color -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            สีการนัดหมาย
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

        <!-- Reminder -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            แจ้งเตือน
          </label>
          <select
            v-model="form.reminder_minutes"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option :value="null">ไม่แจ้งเตือน</option>
            <option :value="15">15 นาทีก่อน</option>
            <option :value="30">30 นาทีก่อน</option>
            <option :value="60">1 ชั่วโมงก่อน</option>
            <option :value="1440">1 วันก่อน</option>
          </select>
        </div>

        <!-- Participants (Simplified - will be enhanced later) -->
        <div class="border-t pt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ผู้เข้าร่วม (User IDs - คั่นด้วย comma)
          </label>
          <input
            v-model="form.participant_user_ids_input"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="เช่น 1,2,3 (User IDs)"
            @blur="parseParticipantIds"
          >
          <p class="text-xs text-gray-500 mt-1">กรุณาระบุ User IDs คั่นด้วย comma (จะพัฒนาระบบค้นหาผู้ใช้ในอนาคต)</p>
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
interface AppointmentParticipant {
  user_id: number
  participant_type: 'student' | 'parent' | 'tutor' | 'admin' | 'other'
  status: 'pending' | 'accepted' | 'declined' | 'maybe'
  user?: {
    id: number
    first_name: string
    last_name: string
    email?: string
  }
}

interface Appointment {
  id: number
  user_id: number
  title: string
  description?: string | null
  start_datetime: string
  end_datetime: string
  appointment_type: 'student' | 'meeting' | 'parent' | 'staff' | 'other'
  location?: string | null
  meeting_link?: string | null
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed'
  color: string
  reminder_minutes?: number | null
  participants?: AppointmentParticipant[]
}

interface Props {
  show: boolean
  appointment?: Appointment | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  saved: [appointment: Appointment]
}>()

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const saving = ref(false)

const form = reactive({
  title: '',
  description: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  appointment_type: 'student' as 'student' | 'meeting' | 'parent' | 'staff' | 'other',
  location: '',
  meeting_link: '',
  status: 'scheduled' as 'scheduled' | 'confirmed' | 'cancelled' | 'completed',
  color: '#3B82F6',
  reminder_minutes: null as number | null,
  participant_user_ids_input: '',
  participant_user_ids: [] as number[]
})

// Color options
const colorOptions = [
  { value: '#3B82F6', class: 'blue-500', label: 'ฟ้า' },
  { value: '#10B981', class: 'green-500', label: 'เขียว' },
  { value: '#F59E0B', class: 'yellow-500', label: 'เหลือง' },
  { value: '#EF4444', class: 'red-500', label: 'แดง' },
  { value: '#8B5CF6', class: 'purple-500', label: 'ม่วง' },
  { value: '#EC4899', class: 'pink-500', label: 'ชมพู' }
]

const formatDateInput = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

const formatTimeInput = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toTimeString().slice(0, 5)
}

const parseParticipantIds = () => {
  if (!form.participant_user_ids_input) {
    form.participant_user_ids = []
    return
  }
  
  form.participant_user_ids = form.participant_user_ids_input
    .split(',')
    .map(id => parseInt(id.trim()))
    .filter(id => !isNaN(id) && id > 0)
}

const updateStartDateTime = () => {
  if (form.startDate && form.endDate && form.startDate > form.endDate) {
    form.endDate = form.startDate
  }
  if (form.startDate === form.endDate && form.startTime && form.endTime && form.startTime > form.endTime) {
    form.endTime = form.startTime
  }
}

const updateEndDateTime = () => {
  if (form.startDate && form.endDate && form.startDate > form.endDate) {
    form.endDate = form.startDate
  }
}

const initializeForm = () => {
  if (props.appointment) {
    const startDate = new Date(props.appointment.start_datetime)
    const endDate = new Date(props.appointment.end_datetime)
    
    form.title = props.appointment.title
    form.description = props.appointment.description || ''
    form.startDate = formatDateInput(startDate)
    form.startTime = formatTimeInput(startDate)
    form.endDate = formatDateInput(endDate)
    form.endTime = formatTimeInput(endDate)
    form.appointment_type = props.appointment.appointment_type
    form.location = props.appointment.location || ''
    form.meeting_link = props.appointment.meeting_link || ''
    form.status = props.appointment.status
    form.color = props.appointment.color
    form.reminder_minutes = props.appointment.reminder_minutes
    form.participant_user_ids = props.appointment.participants?.map(p => p.user_id) || []
    form.participant_user_ids_input = form.participant_user_ids.join(',')
  } else {
    // Use initialDate if provided, otherwise use current time
    const baseDate = props.initialDate || new Date()
    form.startDate = formatDateInput(baseDate)
    form.startTime = formatTimeInput(baseDate)
    form.endDate = formatDateInput(baseDate)
    form.endTime = formatTimeInput(new Date(baseDate.getTime() + 60 * 60 * 1000))
    form.appointment_type = 'student'
    form.status = 'scheduled'
    form.participant_user_ids = []
    form.participant_user_ids_input = ''
  }
}

const handleSubmit = async () => {
  saving.value = true

  try {
    parseParticipantIds()

    const startDateTime = `${form.startDate}T${form.startTime}:00`
    const endDateTime = `${form.endDate}T${form.endTime}:00`

    const payload = {
      title: form.title,
      description: form.description || null,
      start_datetime: startDateTime,
      end_datetime: endDateTime,
      appointment_type: form.appointment_type,
      location: form.location || null,
      meeting_link: form.meeting_link || null,
      status: form.status,
      color: form.color,
      reminder_minutes: form.reminder_minutes,
      participant_user_ids: form.participant_user_ids
    }

    let response
    if (props.appointment) {
      response = await $fetch<{
        success: boolean
        data: Appointment
      }>(`${config.public.apiBase}/calendar/appointments/${props.appointment.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: payload
      })
    } else {
      response = await $fetch<{
        success: boolean
        data: Appointment
      }>(`${config.public.apiBase}/calendar/appointments`, {
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
    console.error('Error saving appointment:', error)
    alert(error.data?.message || 'เกิดข้อผิดพลาดในการบันทึกการนัดหมาย')
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

