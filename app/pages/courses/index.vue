<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-green-500 to-green-700 text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold mb-4">คอร์สเรียนทั้งหมด</h1>
        <p class="text-lg text-green-100">เลือกคอร์สที่เหมาะสมกับคุณ</p>
      </div>
    </section>

    <!-- Filters and Search -->
    <section class="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="ค้นหาคอร์ส..."
                class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                @input="handleSearch"
              >
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Type Filter -->
          <select
            v-model="selectedType"
            @change="() => { pagination.page = 1; loadCourses(); }"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">ทุกประเภท</option>
            <option value="live_online">Live Online</option>
            <option value="vod">Video on Demand</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <!-- Level Filter -->
          <select
            v-model="selectedLevel"
            @change="() => { pagination.page = 1; loadCourses(); }"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">ทุกระดับ</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <!-- Branch Filter -->
          <select
            v-model="selectedBranch"
            @change="() => { pagination.page = 1; loadCourses(); }"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            :disabled="loadingBranches"
          >
            <option value="">ทุกสาขา</option>
            <option
              v-for="branch in branches"
              :key="branch.id"
              :value="branch.id.toString()"
            >
              {{ branch.name }}
            </option>
          </select>

          <!-- Sort -->
          <select
            v-model="sortBy"
            @change="() => { pagination.page = 1; loadCourses(); }"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="newest">ใหม่ล่าสุด</option>
            <option value="popular">ยอดนิยม</option>
            <option value="price_asc">ราคา: ต่ำ-สูง</option>
            <option value="price_desc">ราคา: สูง-ต่ำ</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-12">
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
        {{ error }}
      </div>
    </div>

    <!-- Courses Grid -->
    <section v-else class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <p class="text-gray-600">
          พบ <span class="font-semibold text-gray-900">{{ pagination.total }}</span> คอร์ส
        </p>
      </div>

      <!-- Empty State -->
      <div v-if="courses.length === 0" class="text-center py-16">
        <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">ไม่พบคอร์สเรียน</h3>
        <p class="text-gray-600">ลองเปลี่ยนเงื่อนไขการค้นหาหรือตัวกรอง</p>
      </div>

      <!-- Courses Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CourseCard
          v-for="course in courses"
          :key="course.id"
          :course="formatCourseForCard(course)"
        />
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="mt-8 bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 rounded-lg shadow-sm">
        <div class="text-sm text-gray-700">
          แสดง {{ (pagination.page - 1) * pagination.limit + 1 }} ถึง 
          {{ Math.min(pagination.page * pagination.limit, pagination.total) }} 
          จาก {{ pagination.total }} รายการ
        </div>
        <div class="flex space-x-2">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            ก่อนหน้า
          </button>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page >= pagination.totalPages"
            class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'homepage'
})

useHead({
  title: 'คอร์สเรียนทั้งหมด - KDC School'
})

const config = useRuntimeConfig()
const route = useRoute()

interface Course {
  id: number
  title: string
  description?: string
  type: string
  price: number
  onsite_price?: number | null
  online_price?: number | null
  duration_hours?: number | null
  level?: string | null
  code?: string | null
  thumbnail_url?: string | null
  enrollment_count: number
  created_at: string
  updated_at: string
}

const courses = ref<Course[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Pagination
const pagination = reactive({
  page: 1,
  limit: 15,
  total: 0,
  totalPages: 0
})

// Filters
const searchQuery = ref('')
const selectedType = ref('')
const selectedLevel = ref('')
const selectedBranch = ref('')
const sortBy = ref('newest')

// Branches
interface Branch {
  id: number
  name: string
  code: string
  address?: string | null
  phone?: string | null
  email?: string | null
  status: string
}

const branches = ref<Branch[]>([])
const loadingBranches = ref(false)

// Debounce search
let searchTimeout: NodeJS.Timeout | null = null
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    pagination.page = 1 // Reset to first page on search
    loadCourses()
  }, 500)
}

// Load branches from API
const loadBranches = async () => {
  loadingBranches.value = true
  try {
    const response = await $fetch<{
      success: boolean
      data: Branch[]
    }>(`${config.public.apiBase}/branches`)

    if (response.success) {
      branches.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading branches:', err)
  } finally {
    loadingBranches.value = false
  }
}

// Load courses from API
const loadCourses = async () => {
  loading.value = true
  error.value = null

  try {
    const queryParams: Record<string, string> = {
      page: pagination.page.toString(),
      limit: pagination.limit.toString()
    }
    
    if (searchQuery.value) {
      queryParams.search = searchQuery.value
    }
    if (selectedType.value) {
      queryParams.type = selectedType.value
    }
    if (selectedLevel.value) {
      queryParams.level = selectedLevel.value
    }
    if (selectedBranch.value) {
      queryParams.branch_id = selectedBranch.value
    }
    if (sortBy.value) {
      queryParams.sort_by = sortBy.value
    }

    // Get branch_id from query if exists (from category link)
    if (route.query.category) {
      // TODO: Map category to branch_id if needed
    }
    if (route.query.branch_id) {
      queryParams.branch_id = route.query.branch_id as string
      selectedBranch.value = route.query.branch_id as string
    }

    const queryString = new URLSearchParams(queryParams).toString()
    const url = `${config.public.apiBase}/courses?${queryString}`

    const response = await $fetch<{
      success: boolean
      data: Course[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>(url)

    if (response.success) {
      courses.value = response.data
      Object.assign(pagination, response.pagination)
    } else {
      error.value = 'ไม่สามารถโหลดข้อมูลคอร์สได้'
    }
  } catch (err: any) {
    console.error('Error loading courses:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลคอร์ส'
  } finally {
    loading.value = false
  }
}

// Change page
const changePage = (page: number) => {
  pagination.page = page
  loadCourses()
  // Scroll to top of courses section
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Format course for CourseCard component
const formatCourseForCard = (course: Course) => {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    price: course.price,
    thumbnail: course.thumbnail_url || undefined,
    type: getTypeName(course.type),
    students: course.enrollment_count,
    rating: undefined, // TODO: Add rating if available
    originalPrice: undefined // TODO: Add original price if available
  }
}

// Get type display name
const getTypeName = (type: string) => {
  const typeNames: Record<string, string> = {
    live_online: 'Live Online',
    vod: 'Video on Demand',
    hybrid: 'Hybrid'
  }
  return typeNames[type] || type
}

// Initialize filters from query params
onMounted(async () => {
  // Load branches first
  await loadBranches()

  // Initialize filters from query params
  if (route.query.search) {
    searchQuery.value = route.query.search as string
  }
  if (route.query.type) {
    selectedType.value = route.query.type as string
  }
  if (route.query.level) {
    selectedLevel.value = route.query.level as string
  }
  if (route.query.branch_id) {
    selectedBranch.value = route.query.branch_id as string
  }
  if (route.query.sort_by) {
    sortBy.value = route.query.sort_by as string
  }

  loadCourses()
})
</script>

