<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">การลงทะเบียน</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>ลงทะเบียนใหม่</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="ค้นหาด้วยชื่อนักเรียน, ชื่อคอร์ส"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @input="debouncedSearch"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadEnrollments"
          >
            <option value="">ทั้งหมด</option>
            <option value="pending">รอการยืนยัน</option>
            <option value="active">กำลังเรียน</option>
            <option value="completed">เรียนจบ</option>
            <option value="cancelled">ยกเลิก</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">คอร์ส</label>
          <select
            v-model="filters.course_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadEnrollments"
          >
            <option value="">ทั้งหมด</option>
            <option v-for="course in availableCourses" :key="course.id" :value="course.id">
              {{ course.title }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">สาขา</label>
          <select
            v-model="filters.branch_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadEnrollments"
          >
            <option value="">ทั้งหมด</option>
            <option v-for="branch in availableBranches" :key="branch.id" :value="branch.id">
              {{ branch.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Enrollments Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-else-if="enrollments.length === 0" class="p-8 text-center text-gray-500">
        ไม่พบการลงทะเบียน
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">นักเรียน</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คอร์ส</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สาขา/ที่อยู่</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่ลงทะเบียน</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="enrollment in enrollments" :key="enrollment.id" class="hover:bg-gray-50">
            <td 
              class="px-6 py-4 cursor-pointer"
              @click="router.push(`/admin/enrollments/${enrollment.id}`)"
            >
              <div>
                <div class="text-sm font-medium text-green-600 hover:text-green-700 cursor-pointer">
                  {{ enrollment.student_first_name }} {{ enrollment.student_last_name }}
                </div>
                <div class="text-xs text-gray-500">@{{ enrollment.student_username }}</div>
                <div v-if="enrollment.student_email" class="text-xs text-gray-400">{{ enrollment.student_email }}</div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div>
                <div class="text-sm font-medium text-gray-900">{{ enrollment.course_title }}</div>
                <div v-if="enrollment.course_code" class="text-xs text-gray-500">รหัส: {{ enrollment.course_code }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs font-medium rounded" :class="enrollment.enrollment_type === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'">
                {{ enrollment.enrollment_type === 'online' ? 'ออนไลน์' : 'เรียนสด' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="enrollment.enrollment_type === 'onsite'" class="text-sm text-gray-900">
                <div>{{ enrollment.branch_name || '-' }}</div>
                <div v-if="enrollment.branch_code" class="text-xs text-gray-500">{{ enrollment.branch_code }}</div>
              </div>
              <div v-else class="text-sm text-gray-500 italic">
                เรียนออนไลน์
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 py-1 text-xs font-medium rounded"
                :class="getStatusBadgeClass(enrollment.status)"
              >
                {{ getStatusName(enrollment.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(enrollment.enrollment_date || enrollment.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click.stop="router.push(`/admin/enrollments/${enrollment.id}/edit`)"
                  class="text-green-600 hover:text-green-900"
                  title="แก้ไข"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  v-if="enrollment.status === 'pending'"
                  @click.stop="confirmUpdateStatus(enrollment.id, 'active', 'ยืนยันการลงทะเบียน')"
                  class="text-green-600 hover:text-green-900"
                  title="ยืนยัน"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  v-else-if="enrollment.status === 'active'"
                  @click.stop="confirmUpdateStatus(enrollment.id, 'completed', 'ปิดการเรียน')"
                  class="text-blue-600 hover:text-blue-900"
                  title="ปิดการเรียน"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  @click.stop="confirmDelete(enrollment)"
                  class="text-red-600 hover:text-red-900"
                  title="ลบ"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Modal -->
    <EnrollmentModal
      v-if="showCreateModal"
      :show="showCreateModal"
      :enrollment="null"
      @close="closeModal"
      @saved="handleEnrollmentSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import EnrollmentModal from '~/components/EnrollmentModal.vue'

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const config = useRuntimeConfig()
const { accessToken } = useAuth()
const router = useRouter()

interface Enrollment {
  id: number
  student_id: number
  course_id: number
  branch_id: number
  enrollment_type?: 'onsite' | 'online'
  shipping_address_id?: number | null
  enrollment_date: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  payment_id?: number | null
  created_at: string
  updated_at: string
  student_username: string
  student_first_name: string
  student_last_name: string
  student_email?: string
  course_title: string
  course_code?: string
  branch_name?: string
  branch_code?: string
}

interface Course {
  id: number
  title: string
}

interface Branch {
  id: number
  name: string
}

const enrollments = ref<Enrollment[]>([])
const availableCourses = ref<Course[]>([])
const availableBranches = ref<Branch[]>([])
const loading = ref(true)
const error = ref('')
const showCreateModal = ref(false)

const filters = reactive({
  search: '',
  status: '',
  course_id: '',
  branch_id: ''
})

// Debounce search
let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadEnrollments()
  }, 500)
}

const loadCourses = async () => {
  try {
    const response = await $fetch<{
      success: boolean
      data: Course[]
    }>(`${config.public.apiBase}/admin/courses`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      params: { status: 'published' }
    })
    if (response.success) {
      availableCourses.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading courses:', err)
  }
}

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
      availableBranches.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading branches:', err)
  }
}

const loadEnrollments = async () => {
  loading.value = true
  error.value = ''

  try {
    const params: any = {}
    if (filters.search) params.search = filters.search
    if (filters.status) params.status = filters.status
    if (filters.course_id) params.course_id = filters.course_id
    if (filters.branch_id) params.branch_id = filters.branch_id

    const response = await $fetch<{
      success: boolean
      data: Enrollment[]
    }>(`${config.public.apiBase}/admin/enrollments`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      params
    })

    if (response.success) {
      enrollments.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading enrollments:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
}

const handleEnrollmentSaved = async () => {
  closeModal()
  await loadEnrollments()
}

const confirmUpdateStatus = async (enrollmentId: number, newStatus: string, actionName: string) => {
  const enrollment = enrollments.value.find(e => e.id === enrollmentId)
  if (!enrollment) return
  
  const { confirm } = useConfirm()
  const confirmed = await confirm({
    title: `ยืนยัน${actionName}`,
    message: `คุณแน่ใจหรือไม่ว่าต้องการ${actionName}?`,
    confirmText: actionName,
    cancelText: 'ยกเลิก',
    type: newStatus === 'active' ? 'info' : 'warning'
  })
  
  if (!confirmed) return
  
  try {
    await $fetch(`${config.public.apiBase}/admin/enrollments/${enrollmentId}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: { status: newStatus }
    })
    await loadEnrollments()
  } catch (err: any) {
    console.error('Error updating status:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ')
  }
}

const confirmDelete = async (enrollment: Enrollment) => {
  const { confirm } = useConfirm()
  const confirmed = await confirm({
    title: 'ยืนยันการลบ',
    message: `คุณแน่ใจหรือไม่ว่าต้องการลบการลงทะเบียนนี้?\nการกระทำนี้ไม่สามารถยกเลิกได้`,
    confirmText: 'ลบ',
    cancelText: 'ยกเลิก',
    type: 'danger'
  })
  
  if (!confirmed) return

  try {
    await $fetch(`${config.public.apiBase}/admin/enrollments/${enrollment.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    await loadEnrollments()
  } catch (err: any) {
    console.error('Error deleting enrollment:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการลบการลงทะเบียน')
  }
}

const getStatusName = (status: string) => {
  const statusNames: Record<string, string> = {
    pending: 'รอการยืนยัน',
    active: 'กำลังเรียน',
    completed: 'เรียนจบ',
    cancelled: 'ยกเลิก'
  }
  return statusNames[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMM yyyy', { locale: th })
}

onMounted(() => {
  loadCourses()
  loadBranches()
  loadEnrollments()
})
</script>

