<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">
          {{ event ? 'แก้ไข Event' : 'สร้าง Event' }}
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
            ชื่อ Event <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="เช่น ประชุมทีม, วันหยุดส่วนตัว"
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
              v-if="!form.is_all_day"
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
              v-if="!form.is_all_day"
              v-model="form.endTime"
              type="time"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-2"
              @change="updateEndDateTime"
            >
          </div>
        </div>

        <!-- All Day -->
        <div>
          <label class="flex items-center space-x-2">
            <input
              v-model="form.is_all_day"
              type="checkbox"
              class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              @change="handleAllDayChange"
            >
            <span class="text-sm font-medium text-gray-700">ทั้งวัน</span>
          </label>
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

        <!-- Event Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ประเภท Event
          </label>
          <select
            v-model="form.event_type"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="personal">ส่วนตัว</option>
            <option value="meeting">ประชุม</option>
            <option value="holiday" :disabled="!canCreateHoliday">วันหยุด</option>
            <option value="announcement" :disabled="!canCreateAnnouncement">ประกาศ</option>
            <option value="other">อื่นๆ</option>
          </select>
        </div>

        <!-- Color -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            สี Event
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
            <option :value="2880">2 วันก่อน</option>
          </select>
        </div>

        <!-- Share Event -->
        <div class="border-t pt-4">
          <label class="flex items-center space-x-2 mb-4">
            <input
              v-model="form.is_shared"
              type="checkbox"
              class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            >
            <span class="text-sm font-medium text-gray-700">แชร์ Event</span>
          </label>

          <!-- Share Options -->
          <div v-if="form.is_shared" class="space-y-3 pl-6 border-l-2 border-gray-200">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                แชร์ให้
              </label>
              <div class="space-y-2">
                <!-- Public -->
                <label class="flex items-center space-x-2">
                  <input
                    v-model="form.shared_scope"
                    type="radio"
                    value="public"
                    class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  >
                  <span class="text-sm text-gray-700">ทุกคน (Public)</span>
                </label>

                <!-- Admins -->
                <label v-if="canShareToAdmins" class="flex items-center space-x-2">
                  <input
                    v-model="form.shared_scope"
                    type="radio"
                    value="admins"
                    class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  >
                  <span class="text-sm text-gray-700">ผู้ดูแลระบบ (Admins)</span>
                </label>

                <!-- Branch Admins -->
                <label v-if="canShareToBranchAdmins" class="flex items-center space-x-2">
                  <input
                    v-model="form.shared_scope"
                    type="radio"
                    value="branch_admins"
                    class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  >
                  <span class="text-sm text-gray-700">ผู้ดูแลสาขา (Branch Admins)</span>
                </label>
                <div v-if="form.shared_scope === 'branch_admins' && availableBranches.length > 0" class="ml-6 mt-2">
                  <select
                    v-model="form.shared_branch_id"
                    class="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option :value="null">ทุกสาขา</option>
                    <option v-for="branch in availableBranches" :key="branch.id" :value="branch.id">
                      {{ branch.name }}
                    </option>
                  </select>
                </div>

                <!-- Tutors -->
                <label v-if="canShareToTutors" class="flex items-center space-x-2">
                  <input
                    v-model="form.shared_scope"
                    type="radio"
                    value="tutors"
                    class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  >
                  <span class="text-sm text-gray-700">ครูทุกคน (Tutors)</span>
                </label>
                <div v-if="form.shared_scope === 'tutors' && availableBranches.length > 0" class="ml-6 mt-2">
                  <select
                    v-model="form.shared_branch_id"
                    class="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option :value="null">ทุกสาขา</option>
                    <option v-for="branch in availableBranches" :key="branch.id" :value="branch.id">
                      {{ branch.name }}
                    </option>
                  </select>
                </div>

                <!-- Students -->
                <label v-if="canShareToStudents" class="flex items-center space-x-2">
                  <input
                    v-model="form.shared_scope"
                    type="radio"
                    value="students"
                    class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  >
                  <span class="text-sm text-gray-700">นักเรียนทุกคน (Students)</span>
                </label>

                <!-- Branch Students -->
                <label v-if="canShareToBranchStudents" class="flex items-center space-x-2">
                  <input
                    v-model="form.shared_scope"
                    type="radio"
                    value="branch_students"
                    class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  >
                  <span class="text-sm text-gray-700">นักเรียนในสาขา (Branch Students)</span>
                </label>
                <div v-if="form.shared_scope === 'branch_students' && availableBranches.length > 0" class="ml-6 mt-2">
                  <select
                    v-model="form.shared_branch_id"
                    required
                    class="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">เลือกสาขา</option>
                    <option v-for="branch in availableBranches" :key="branch.id" :value="branch.id">
                      {{ branch.name }}
                    </option>
                  </select>
                </div>

                <!-- Parents -->
                <label v-if="canShareToParents" class="flex items-center space-x-2">
                  <input
                    v-model="form.shared_scope"
                    type="radio"
                    value="parents"
                    class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  >
                  <span class="text-sm text-gray-700">ผู้ปกครองทุกคน (Parents)</span>
                </label>

                <!-- Branch Parents -->
                <label v-if="canShareToBranchParents" class="flex items-center space-x-2">
                  <input
                    v-model="form.shared_scope"
                    type="radio"
                    value="branch_parents"
                    class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  >
                  <span class="text-sm text-gray-700">ผู้ปกครองในสาขา (Branch Parents)</span>
                </label>
                <div v-if="form.shared_scope === 'branch_parents' && availableBranches.length > 0" class="ml-6 mt-2">
                  <select
                    v-model="form.shared_branch_id"
                    required
                    class="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">เลือกสาขา</option>
                    <option v-for="branch in availableBranches" :key="branch.id" :value="branch.id">
                      {{ branch.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
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
import { UserRole } from '#shared/types/user.types'

interface Event {
  id: number
  user_id: number
  title: string
  description?: string | null
  start_datetime: string
  end_datetime: string
  location?: string | null
  color: string
  is_all_day: boolean
  reminder_minutes?: number | null
  is_shared: boolean
  shared_scope: string
  shared_branch_id?: number | null
  event_type: string
}

interface Branch {
  id: number
  name: string
  code?: string
}

interface Props {
  show: boolean
  event?: Event | null
  initialDate?: Date | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  saved: [event: Event]
}>()

const config = useRuntimeConfig()
const { accessToken, user } = useAuth()

const saving = ref(false)
const availableBranches = ref<Branch[]>([])

const form = reactive({
  title: '',
  description: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  is_all_day: false,
  location: '',
  event_type: 'personal',
  color: '#3B82F6',
  reminder_minutes: null as number | null,
  is_shared: false,
  shared_scope: 'public',
  shared_branch_id: null as number | null
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

// Computed properties for permissions
const userRoles = computed(() => user.value?.roles || [])
const isSystemAdmin = computed(() => userRoles.value.includes(UserRole.SYSTEM_ADMIN) || userRoles.value.includes(UserRole.OWNER))
const isAdmin = computed(() => userRoles.value.includes(UserRole.ADMIN))
const isBranchAdmin = computed(() => userRoles.value.includes(UserRole.BRANCH_ADMIN))
const isTutor = computed(() => userRoles.value.includes(UserRole.TUTOR))
const isStudent = computed(() => userRoles.value.includes(UserRole.STUDENT))
const isParent = computed(() => userRoles.value.includes(UserRole.PARENT))

const canCreateHoliday = computed(() => isSystemAdmin.value || isAdmin.value || isBranchAdmin.value)
const canCreateAnnouncement = computed(() => isSystemAdmin.value || isAdmin.value || isBranchAdmin.value)

const canShareToAdmins = computed(() => isSystemAdmin.value || isAdmin.value)
const canShareToBranchAdmins = computed(() => isSystemAdmin.value || isAdmin.value || isBranchAdmin.value)
const canShareToTutors = computed(() => isSystemAdmin.value || isAdmin.value || isBranchAdmin.value || isTutor.value)
const canShareToStudents = computed(() => isSystemAdmin.value || isAdmin.value || isBranchAdmin.value || isTutor.value || isStudent.value)
const canShareToBranchStudents = computed(() => isSystemAdmin.value || isAdmin.value || isBranchAdmin.value || isTutor.value)
const canShareToParents = computed(() => isSystemAdmin.value || isAdmin.value || isBranchAdmin.value || isTutor.value || isParent.value)
const canShareToBranchParents = computed(() => isSystemAdmin.value || isAdmin.value || isBranchAdmin.value || isTutor.value)

// Load branches for branch selection
const loadBranches = async () => {
  try {
    const response = await $fetch<{
      success: boolean
      data: Branch[]
    }>(`${config.public.apiBase}/admin/branches`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    if (response.success) {
      availableBranches.value = response.data.filter(b => b.code !== null) // Only active branches
    }
  } catch (error) {
    console.error('Error loading branches:', error)
  }
}

// Initialize form from event
const initializeForm = () => {
  if (props.event) {
    const startDate = new Date(props.event.start_datetime)
    const endDate = new Date(props.event.end_datetime)
    
    form.title = props.event.title
    form.description = props.event.description || ''
    form.startDate = formatDateInput(startDate)
    form.startTime = formatTimeInput(startDate)
    form.endDate = formatDateInput(endDate)
    form.endTime = formatTimeInput(endDate)
    form.is_all_day = props.event.is_all_day
    form.location = props.event.location || ''
    form.event_type = props.event.event_type
    form.color = props.event.color
    form.reminder_minutes = props.event.reminder_minutes
    form.is_shared = props.event.is_shared
    form.shared_scope = props.event.shared_scope
    form.shared_branch_id = props.event.shared_branch_id
  } else {
    // Use initialDate if provided, otherwise use current time
    const baseDate = props.initialDate || new Date()
    form.startDate = formatDateInput(baseDate)
    form.startTime = formatTimeInput(baseDate)
    form.endDate = formatDateInput(baseDate)
    form.endTime = formatTimeInput(new Date(baseDate.getTime() + 60 * 60 * 1000)) // 1 hour later
    form.is_all_day = false
    form.is_shared = false
    form.shared_scope = 'public'
    form.shared_branch_id = null
  }
}

const formatDateInput = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

const formatTimeInput = (date: Date): string => {
  return date.toTimeString().slice(0, 5)
}

const updateStartDateTime = () => {
  // Validate that start is before end
  if (form.startDate && form.endDate) {
    if (form.startDate > form.endDate) {
      form.endDate = form.startDate
    }
    if (form.startDate === form.endDate && form.startTime && form.endTime && form.startTime > form.endTime) {
      form.endTime = form.startTime
    }
  }
}

const updateEndDateTime = () => {
  // Validate that end is after start
  if (form.startDate && form.endDate && form.startDate > form.endDate) {
    form.endDate = form.startDate
  }
}

const handleAllDayChange = () => {
  if (form.is_all_day) {
    form.startTime = '00:00'
    form.endTime = '23:59'
  }
}

const handleSubmit = async () => {
  saving.value = true

  try {
    // Build datetime strings
    const startDateTime = form.is_all_day
      ? `${form.startDate}T00:00:00`
      : `${form.startDate}T${form.startTime}:00`
    const endDateTime = form.is_all_day
      ? `${form.endDate}T23:59:59`
      : `${form.endDate}T${form.endTime}:00`

    const payload = {
      title: form.title,
      description: form.description || null,
      start_datetime: startDateTime,
      end_datetime: endDateTime,
      location: form.location || null,
      color: form.color,
      is_all_day: form.is_all_day,
      reminder_minutes: form.reminder_minutes,
      is_shared: form.is_shared,
      shared_scope: form.is_shared ? form.shared_scope : 'private',
      shared_branch_id: form.is_shared && form.shared_scope.includes('branch') ? form.shared_branch_id : null,
      event_type: form.event_type
    }

    let response
    if (props.event) {
      // Update
      response = await $fetch<{
        success: boolean
        data: Event
      }>(`${config.public.apiBase}/calendar/events/${props.event.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: payload
      })
    } else {
      // Create
      response = await $fetch<{
        success: boolean
        data: Event
      }>(`${config.public.apiBase}/calendar/events`, {
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
    console.error('Error saving event:', error)
    alert(error.data?.message || 'เกิดข้อผิดพลาดในการบันทึก Event')
  } finally {
    saving.value = false
  }
}

// Watch for show prop changes
watch(() => props.show, (newVal) => {
  if (newVal) {
    initializeForm()
    if (canShareToBranchAdmins.value || canShareToTutors.value || canShareToBranchStudents.value || canShareToBranchParents.value) {
      loadBranches()
    }
  }
})

// Initialize on mount if show is true
onMounted(() => {
  if (props.show) {
    initializeForm()
    if (canShareToBranchAdmins.value || canShareToTutors.value || canShareToBranchStudents.value || canShareToBranchParents.value) {
      loadBranches()
    }
  }
})
</script>

