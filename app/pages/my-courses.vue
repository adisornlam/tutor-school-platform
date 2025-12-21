<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">คอร์สเรียนของฉัน</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      <p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      {{ error }}
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Tabs -->
      <div class="flex items-center gap-4 mb-6 border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 font-semibold transition-colors relative"
          :class="activeTab === tab.id 
            ? 'text-green-600 border-b-2 border-green-600' 
            : 'text-gray-600 hover:text-green-600'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Filter and Sort -->
      <div class="flex items-center justify-between mb-6">
        <div class="text-gray-600">
          จำนวน: <span class="font-semibold">{{ filteredEnrollments.length }}</span> คอร์ส
        </div>
        <div class="flex items-center gap-4">
          <select 
            v-model="selectedEnrollmentType"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">ทุกประเภทการเรียน</option>
            <option value="onsite">เรียนที่สาขา</option>
            <option value="online">เรียนออนไลน์</option>
          </select>
          <select 
            v-model="sortBy"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="newest">วันที่ลงเรียนใหม่-เก่า</option>
            <option value="oldest">วันที่ลงเรียนเก่า-ใหม่</option>
            <option value="title">ชื่อคอร์ส (ก-ฮ)</option>
          </select>
        </div>
      </div>

      <!-- Course List -->
      <div class="space-y-4">
        <div
          v-for="enrollment in filteredEnrollments"
          :key="enrollment.id"
          class="bg-white rounded-lg shadow p-6 flex gap-6 hover:shadow-md transition-shadow"
        >
          <!-- Course Thumbnail -->
          <div class="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
            <img 
              v-if="enrollment.course.thumbnail_url"
              :src="enrollment.course.thumbnail_url"
              :alt="enrollment.course.title"
              class="w-full h-full object-cover"
            >
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>

          <!-- Course Info -->
          <div class="flex-1">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span 
                    class="px-2 py-1 text-xs font-semibold rounded"
                    :class="enrollment.enrollmentType === 'online' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'"
                  >
                    {{ enrollment.enrollmentType === 'online' ? 'เรียนออนไลน์' : 'เรียนที่สาขา' }}
                  </span>
                  <span v-if="enrollment.branch" class="text-sm text-gray-500">
                    {{ enrollment.branch.name }}
                  </span>
                  <span v-if="enrollment.course.code" class="text-xs text-gray-400">
                    {{ enrollment.course.code }}
                  </span>
                </div>
                <h3 class="text-xl font-semibold mb-2">{{ enrollment.course.title }}</h3>
                <p v-if="enrollment.course.description" class="text-gray-600 text-sm mb-4 line-clamp-2">
                  {{ enrollment.course.description }}
                </p>
              </div>
            </div>

            <!-- Progress Bar (Placeholder - will be implemented with learning progress) -->
            <div v-if="false" class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600">ความคืบหน้า</span>
                <span class="text-sm font-semibold text-green-600">
                  {{ enrollment.progress }}%
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-green-600 h-2 rounded-full transition-all"
                  :style="{ width: `${enrollment.progress}%` }"
                ></div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-500">
                ลงทะเบียนเมื่อ: {{ formatDate(enrollment.enrollmentDate) }}
                <span v-if="enrollment.student && isParent" class="ml-2">
                  ({{ enrollment.student.firstName }} {{ enrollment.student.lastName }})
                </span>
              </div>
              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/courses/${enrollment.course.id}`"
                  class="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  ดูรายละเอียด
                </NuxtLink>
                <NuxtLink
                  v-if="enrollment.enrollmentType === 'online'"
                  :to="`/learning/courses/${enrollment.course.id}`"
                  class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  เริ่มเรียน
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredEnrollments.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 class="mt-2 text-sm font-semibold text-gray-900">ยังไม่มีคอร์สเรียน</h3>
          <p class="mt-1 text-sm text-gray-500">เริ่มต้นเรียนกับเราได้เลย</p>
          <div class="mt-6">
            <NuxtLink
              to="/courses"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              ดูคอร์สเรียนทั้งหมด
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

definePageMeta({
  middleware: 'auth',
  layout: 'student'
})

const config = useRuntimeConfig()
const { accessToken, user } = useAuth()

interface Enrollment {
  id: number
  enrollmentDate: string
  status: string
  enrollmentType: 'onsite' | 'online'
  course: {
    id: number
    title: string
    code?: string | null
    description?: string | null
    thumbnail_url?: string | null
    type?: string | null
    level?: string | null
    price?: number | null
    onsite_price?: number | null
    online_price?: number | null
  }
  branch: {
    id: number
    name: string
    code?: string | null
  } | null
  student: {
    id: number
    firstName: string
    lastName: string
    username: string
  }
  progress: number
}

const activeTab = ref('all')
const selectedEnrollmentType = ref('all')
const sortBy = ref('newest')
const enrollments = ref<Enrollment[]>([])
const loading = ref(true)
const error = ref('')

const isParent = computed(() => {
  return user.value?.roles?.includes('parent')
})

const tabs = [
  { id: 'all', label: 'การเรียนทั้งหมด' },
  { id: 'active', label: 'กำลังเรียน' },
  { id: 'completed', label: 'เรียนจบแล้ว' }
]

const filteredEnrollments = computed(() => {
  let filtered = [...enrollments.value]

  // Filter by tab
  if (activeTab.value === 'active') {
    filtered = filtered.filter(e => e.status === 'active')
  } else if (activeTab.value === 'completed') {
    filtered = filtered.filter(e => e.status === 'completed')
  }

  // Filter by enrollment type
  if (selectedEnrollmentType.value !== 'all') {
    filtered = filtered.filter(e => e.enrollmentType === selectedEnrollmentType.value)
  }

  // Sort
  if (sortBy.value === 'newest') {
    filtered.sort((a, b) => new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime())
  } else if (sortBy.value === 'oldest') {
    filtered.sort((a, b) => new Date(a.enrollmentDate).getTime() - new Date(b.enrollmentDate).getTime())
  } else if (sortBy.value === 'title') {
    filtered.sort((a, b) => a.course.title.localeCompare(b.course.title, 'th'))
  }

  return filtered
})

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: th })
  } catch {
    return dateString
  }
}

const loadEnrollments = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await $fetch<{ success: boolean; data: Enrollment[] }>(
      `${config.public.apiBase}/learning/my-courses`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      }
    )

    if (response.success) {
      enrollments.value = response.data
    } else {
      error.value = 'ไม่สามารถโหลดข้อมูลได้'
    }
  } catch (err: any) {
    console.error('[My Courses] Error loading enrollments:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEnrollments()
})
</script>
