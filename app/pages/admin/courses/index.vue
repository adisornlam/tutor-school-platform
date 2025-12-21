<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">คอร์สเรียน</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>เพิ่มคอร์ส</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="ค้นหาด้วยชื่อคอร์ส, รหัสคอร์ส"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @input="debouncedSearch"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ประเภท</label>
          <select
            v-model="filters.type"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadCourses"
          >
            <option value="">ทั้งหมด</option>
            <option value="live_online">Live Online</option>
            <option value="vod">VOD</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadCourses"
          >
            <option value="">ทั้งหมด</option>
            <option value="draft">ร่าง</option>
            <option value="published">เผยแพร่</option>
            <option value="archived">เก็บถาวร</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Courses Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-else-if="courses.length === 0" class="p-8 text-center text-gray-500">
        ไม่พบคอร์สเรียน
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คอร์ส</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคา</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ระดับ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สร้าง</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="course in courses" :key="course.id" class="hover:bg-gray-50">
            <td 
              class="px-6 py-4 cursor-pointer"
              @click="router.push(`/admin/courses/${course.id}`)"
            >
              <div>
                <div class="text-sm font-medium text-green-600 hover:text-green-700 cursor-pointer">
                  {{ course.title }}
                </div>
                <div v-if="course.code" class="text-xs text-gray-500">รหัส: {{ course.code }}</div>
                <div v-if="course.description" class="text-xs text-gray-400 mt-1 line-clamp-2">
                  {{ course.description }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs font-medium rounded" :class="getTypeBadgeClass(course.type)">
                {{ getTypeName(course.type) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm font-medium text-gray-900">
                {{ formatCurrency(course.price) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="course.level" class="text-sm text-gray-600">
                {{ getLevelName(course.level) }}
              </span>
              <span v-else class="text-sm text-gray-400">-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 py-1 text-xs font-medium rounded"
                :class="getStatusBadgeClass(course.status)"
              >
                {{ getStatusName(course.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(course.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click.stop="router.push(`/admin/courses/${course.id}/edit`)"
                  class="text-green-600 hover:text-green-900"
                  title="แก้ไข"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  v-if="course.status === 'published'"
                  @click.stop="confirmUpdateStatus(course.id, 'archived', 'เก็บถาวร')"
                  class="text-yellow-600 hover:text-yellow-900"
                  title="เก็บถาวร"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </button>
                <button
                  v-else-if="course.status === 'archived'"
                  @click.stop="confirmUpdateStatus(course.id, 'published', 'เผยแพร่')"
                  class="text-green-600 hover:text-green-900"
                  title="เผยแพร่"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  v-else-if="course.status === 'draft'"
                  @click.stop="confirmUpdateStatus(course.id, 'published', 'เผยแพร่')"
                  class="text-blue-600 hover:text-blue-900"
                  title="เผยแพร่"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  @click.stop="confirmDelete(course)"
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
    <CourseModal
      v-if="showCreateModal"
      :show="showCreateModal"
      :course="null"
      @close="closeModal"
      @saved="handleCourseSaved"
    />
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
const router = useRouter()

interface Course {
  id: number
  title: string
  description?: string | null
  type: 'live_online' | 'vod' | 'hybrid'
  price: number
  duration_hours?: number | null
  level?: 'beginner' | 'intermediate' | 'advanced' | null
  status: 'draft' | 'published' | 'archived'
  code?: string | null
  created_at: string
  updated_at: string
}

const courses = ref<Course[]>([])
const loading = ref(true)
const error = ref('')
const showCreateModal = ref(false)

const filters = reactive({
  search: '',
  type: '',
  status: ''
})

// Debounce search
let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadCourses()
  }, 500)
}

const loadCourses = async () => {
  loading.value = true
  error.value = ''

  try {
    const params: any = {}
    if (filters.search) params.search = filters.search
    if (filters.type) params.type = filters.type
    if (filters.status) params.status = filters.status

    const response = await $fetch<{
      success: boolean
      data: Course[]
    }>(`${config.public.apiBase}/admin/courses`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      params
    })

    if (response.success) {
      courses.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading courses:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
}

const handleCourseSaved = async () => {
  closeModal()
  await loadCourses()
}

const confirmUpdateStatus = async (courseId: number, newStatus: string, actionName: string) => {
  const course = courses.value.find(c => c.id === courseId)
  if (!course) return
  
  const { confirm } = useConfirm()
  const confirmed = await confirm({
    title: `ยืนยัน${actionName}`,
    message: `คุณแน่ใจหรือไม่ว่าต้องการ${actionName}คอร์ส ${course.title}?`,
    confirmText: actionName,
    cancelText: 'ยกเลิก',
    type: newStatus === 'published' ? 'info' : 'warning'
  })
  
  if (!confirmed) return
  
  try {
    await $fetch(`${config.public.apiBase}/admin/courses/${courseId}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: { status: newStatus }
    })
    await loadCourses()
  } catch (err: any) {
    console.error('Error updating status:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ')
  }
}

const confirmDelete = async (course: Course) => {
  const { confirm } = useConfirm()
  const confirmed = await confirm({
    title: 'ยืนยันการลบ',
    message: `คุณแน่ใจหรือไม่ว่าต้องการลบคอร์ส ${course.title}?\nการกระทำนี้ไม่สามารถยกเลิกได้`,
    confirmText: 'ลบ',
    cancelText: 'ยกเลิก',
    type: 'danger'
  })
  
  if (!confirmed) return

  try {
    await $fetch(`${config.public.apiBase}/admin/courses/${course.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    await loadCourses()
  } catch (err: any) {
    console.error('Error deleting course:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการลบคอร์ส')
  }
}

const getTypeName = (type: string) => {
  const typeNames: Record<string, string> = {
    live_online: 'Live Online',
    vod: 'VOD',
    hybrid: 'Hybrid'
  }
  return typeNames[type] || type
}

const getTypeBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    live_online: 'bg-blue-100 text-blue-800',
    vod: 'bg-purple-100 text-purple-800',
    hybrid: 'bg-indigo-100 text-indigo-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getStatusName = (status: string) => {
  const statusNames: Record<string, string> = {
    draft: 'ร่าง',
    published: 'เผยแพร่',
    archived: 'เก็บถาวร'
  }
  return statusNames[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getLevelName = (level: string) => {
  const levelNames: Record<string, string> = {
    beginner: 'เริ่มต้น',
    intermediate: 'กลาง',
    advanced: 'สูง'
  }
  return levelNames[level] || level
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(amount)
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMM yyyy', { locale: th })
}

onMounted(() => {
  loadCourses()
})
</script>

