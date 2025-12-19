<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">นักเรียน</h1>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="ค้นหาด้วย username, email, ชื่อ"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @input="debouncedSearch"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadStudents"
          >
            <option value="">ทั้งหมด</option>
            <option value="active">ใช้งาน</option>
            <option value="inactive">ปิดใช้งาน</option>
            <option value="suspended">ระงับ</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Students Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-else-if="students.length === 0" class="p-8 text-center text-gray-500">
        ไม่พบนักเรียน
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">นักเรียน</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้ปกครอง</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สร้าง</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="student in students" :key="student.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <div class="text-sm font-medium text-gray-900">
                  {{ student.first_name }} {{ student.last_name }}
                </div>
                <div class="text-sm text-gray-500">{{ student.username }}</div>
                <div v-if="student.email" class="text-xs text-gray-400">{{ student.email }}</div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div v-if="student.parents && student.parents.length > 0" class="space-y-1">
                <div
                  v-for="parent in student.parents"
                  :key="parent.id"
                  class="text-sm"
                >
                  <span class="font-medium text-gray-900">{{ parent.name }}</span>
                  <span class="text-gray-500 ml-2">({{ getRelationshipName(parent.relationship) }})</span>
                </div>
              </div>
              <div v-else class="text-sm text-gray-400">ไม่มีผู้ปกครอง</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 py-1 text-xs font-medium rounded"
                :class="getStatusBadgeClass(student.status)"
              >
                {{ getStatusDisplayName(student.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(student.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <NuxtLink
                  :to="`/admin/tutor/students/${student.id}`"
                  class="text-blue-600 hover:text-blue-900"
                  title="ดูรายละเอียด"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </NuxtLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
        <div class="text-sm text-gray-700">
          แสดง {{ (pagination.page - 1) * pagination.limit + 1 }} ถึง 
          {{ Math.min(pagination.page * pagination.limit, pagination.total) }} 
          จาก {{ pagination.total }} รายการ
        </div>
        <div class="flex space-x-2">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            ก่อนหน้า
          </button>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page >= pagination.totalPages"
            class="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>

    <!-- Student Detail Modal -->
    <div
      v-if="selectedStudent"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="selectedStudent = null"
    >
      <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">รายละเอียดนักเรียน</h2>
          <button
            @click="selectedStudent = null"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="loadingDetail" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p class="mt-2 text-gray-600">กำลังโหลด...</p>
        </div>

        <div v-else-if="studentDetail" class="space-y-6">
          <!-- Student Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-4">ข้อมูลนักเรียน</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-500">ชื่อ-นามสกุล</label>
                <p class="text-gray-900">{{ studentDetail.student.first_name }} {{ studentDetail.student.last_name }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Username</label>
                <p class="text-gray-900">{{ studentDetail.student.username }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Email</label>
                <p class="text-gray-900">{{ studentDetail.student.email || '-' }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</label>
                <p class="text-gray-900">{{ studentDetail.student.phone || '-' }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">สถานะ</label>
                <span
                  class="px-2 py-1 text-xs font-medium rounded"
                  :class="getStatusBadgeClass(studentDetail.student.status)"
                >
                  {{ getStatusDisplayName(studentDetail.student.status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Parents Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-4">ผู้ปกครอง</h3>
            <div v-if="studentDetail.parents && studentDetail.parents.length > 0" class="space-y-3">
              <div
                v-for="parent in studentDetail.parents"
                :key="parent.id"
                class="bg-white rounded-lg p-4 border border-gray-200"
              >
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm font-medium text-gray-500">ชื่อ-นามสกุล</label>
                    <p class="text-gray-900">{{ parent.first_name }} {{ parent.last_name }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500">ความสัมพันธ์</label>
                    <p class="text-gray-900">{{ getRelationshipName(parent.relationship) }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500">Email</label>
                    <p class="text-gray-900">{{ parent.email || '-' }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</label>
                    <p class="text-gray-900">{{ parent.phone || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-500 text-center py-4">
              ไม่มีข้อมูลผู้ปกครอง
            </div>
          </div>

          <!-- Enrollments -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-4">คอร์สที่ลงทะเบียน</h3>
            <div v-if="studentDetail.enrollments && studentDetail.enrollments.length > 0" class="space-y-2">
              <div
                v-for="enrollment in studentDetail.enrollments"
                :key="enrollment.id"
                class="bg-white rounded-lg p-3 border border-gray-200"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900">{{ enrollment.course.title }}</p>
                    <p class="text-sm text-gray-500">{{ enrollment.branch.name }} - {{ enrollment.course.code }}</p>
                  </div>
                  <div class="text-right">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded"
                      :class="enrollment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    >
                      {{ enrollment.status === 'active' ? 'ใช้งาน' : enrollment.status }}
                    </span>
                    <p class="text-xs text-gray-500 mt-1">{{ formatDate(enrollment.enrolled_at) }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-500 text-center py-4">
              ยังไม่ได้ลงทะเบียนคอร์สใดๆ
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button
            @click="selectedStudent = null"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const config = useRuntimeConfig()
const { accessToken } = useAuth()

interface Parent {
  id: number
  name: string
  relationship: string
}

interface Student {
  id: number
  username: string
  email: string | null
  first_name: string
  last_name: string
  phone?: string | null
  status: string
  parents: Parent[]
  created_at: string
  updated_at: string
}

interface StudentDetail {
  student: any
  parents: Array<{
    id: number
    username: string
    email: string | null
    first_name: string
    last_name: string
    phone?: string | null
    status: string
    relationship: string
  }>
  enrollments: Array<{
    id: number
    course: {
      id: number
      title: string
      code: string
    }
    branch: {
      id: number
      name: string
      code: string
    }
    status: string
    enrolled_at: string
  }>
}

const students = ref<Student[]>([])
const loading = ref(false)
const error = ref('')
const selectedStudent = ref<number | null>(null)
const studentDetail = ref<StudentDetail | null>(null)
const loadingDetail = ref(false)

const filters = reactive({
  search: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})

// Debounce search
let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.page = 1
    loadStudents()
  }, 500)
}

const loadStudents = async () => {
  loading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString()
    })

    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)

    // Use the same API endpoint - it will filter by tutor role automatically
    const response = await $fetch<{
      success: boolean
      data: Student[]
      pagination: typeof pagination
    }>(`${config.public.apiBase}/admin/students?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    if (response.success) {
      students.value = response.data
      Object.assign(pagination, response.pagination)
    }
  } catch (err: any) {
    console.error('Error loading students:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const viewStudent = async (studentId: number) => {
  selectedStudent.value = studentId
  loadingDetail.value = true
  studentDetail.value = null

  try {
    // Use the same API endpoint - it will check tutor permissions automatically
    const response = await $fetch<{
      success: boolean
      data: StudentDetail
    }>(`${config.public.apiBase}/admin/students/${studentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    if (response.success) {
      studentDetail.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading student detail:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
  } finally {
    loadingDetail.value = false
  }
}

const changePage = (page: number) => {
  pagination.page = page
  loadStudents()
}

const getStatusDisplayName = (status: string) => {
  const statusNames: Record<string, string> = {
    active: 'ใช้งาน',
    inactive: 'ปิดใช้งาน',
    suspended: 'ระงับ'
  }
  return statusNames[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getRelationshipName = (relationship: string) => {
  const relationshipNames: Record<string, string> = {
    father: 'บิดา',
    mother: 'มารดา',
    guardian: 'ผู้ปกครอง'
  }
  return relationshipNames[relationship] || relationship
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMM yyyy', { locale: th })
}

onMounted(() => {
  loadStudents()
})
</script>

