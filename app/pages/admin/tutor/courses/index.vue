<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold">คอร์สที่ฉันสอน</h1>
        <p class="text-gray-600 mt-1">รายการคอร์สที่คุณได้รับมอบหมายให้สอน</p>
      </div>
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
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <p class="mt-4 text-lg font-medium">ไม่พบคอร์สที่คุณสอน</p>
        <p class="mt-1 text-sm">คุณยังไม่ได้รับมอบหมายให้สอนคอร์สใดๆ</p>
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
                <NuxtLink
                  :to="`/admin/courses/${course.id}`"
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

    // API will automatically filter by tutor_id when user is tutor
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

