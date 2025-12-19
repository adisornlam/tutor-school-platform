<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">ผู้เรียน</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>เพิ่มผู้เรียน</span>
      </button>
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
        ไม่พบผู้เรียน
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้เรียน</th>
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
                  :to="`/admin/students/${student.id}`"
                  class="text-blue-600 hover:text-blue-900"
                  title="ดูรายละเอียด"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </NuxtLink>
                <button
                  @click="editStudent(student)"
                  class="text-blue-600 hover:text-blue-900"
                  title="แก้ไข"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  v-if="student.status === 'active'"
                  @click="updateStatus(student.id, 'inactive')"
                  class="text-yellow-600 hover:text-yellow-900"
                  title="ปิดใช้งาน"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </button>
                <button
                  v-else
                  @click="updateStatus(student.id, 'active')"
                  class="text-green-600 hover:text-green-900"
                  title="เปิดใช้งาน"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(student)"
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


    <!-- Create/Edit Modal -->
    <StudentModal
      v-if="showCreateModal || editingStudent"
      :show="showCreateModal || !!editingStudent"
      :student="editingStudent"
      @close="closeModal"
      @saved="handleStudentSaved"
    />

    <!-- Delete Confirmation Modal -->
    <div
      v-if="studentToDelete"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="studentToDelete = null"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-600 mb-6">
          คุณแน่ใจหรือไม่ว่าต้องการลบผู้เรียน 
          <strong>{{ studentToDelete.first_name }} {{ studentToDelete.last_name }}</strong>?
          <br>
          <span class="text-sm text-red-600">การกระทำนี้ไม่สามารถยกเลิกได้</span>
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="studentToDelete = null"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            ยกเลิก
          </button>
          <button
            @click="deleteStudent"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            ลบ
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
const showCreateModal = ref(false)
const editingStudent = ref<Student | null>(null)
const studentToDelete = ref<Student | null>(null)

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


const changePage = (page: number) => {
  pagination.page = page
  loadStudents()
}

const editStudent = (student: Student) => {
  editingStudent.value = { ...student }
  showCreateModal.value = false
}

const closeModal = () => {
  showCreateModal.value = false
  editingStudent.value = null
}

const handleStudentSaved = () => {
  closeModal()
  loadStudents()
}

const updateStatus = async (studentId: number, status: string) => {
  try {
    await $fetch(`${config.public.apiBase}/admin/users/${studentId}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: { status }
    })
    await loadStudents()
  } catch (err: any) {
    console.error('Error updating status:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ')
  }
}

const confirmDelete = (student: Student) => {
  studentToDelete.value = student
}

const deleteStudent = async () => {
  if (!studentToDelete.value) return

  try {
    await $fetch(`${config.public.apiBase}/admin/users/${studentToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    studentToDelete.value = null
    await loadStudents()
  } catch (err: any) {
    console.error('Error deleting student:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการลบผู้เรียน')
  }
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

