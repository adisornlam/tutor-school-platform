<template>
  <div class="min-h-screen bg-gray-50">
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

    <!-- Course Content -->
    <div v-else-if="courseDetail" class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Course Thumbnail -->
          <div v-if="courseDetail.course.thumbnail_url" class="bg-white rounded-lg shadow overflow-hidden">
            <img
              :src="courseDetail.course.thumbnail_url"
              :alt="courseDetail.course.title"
              class="w-full h-auto"
              style="max-height: 500px; object-fit: cover;"
            >
          </div>

          <!-- Course Info -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="mb-4">
              <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {{ getTypeName(courseDetail.course.type) }}
              </span>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-4">
              {{ courseDetail.course.title }}
            </h1>
            <div v-if="courseDetail.course.description" class="prose max-w-none mb-6" v-html="courseDetail.course.description"></div>

            <!-- Course Details -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
              <div>
                <p class="text-sm text-gray-500 mb-1">ระยะเวลา</p>
                <p class="font-semibold">
                  {{ courseDetail.course.duration_hours ? `${courseDetail.course.duration_hours} ชั่วโมง` : '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">ระดับ</p>
                <p class="font-semibold">
                  {{ courseDetail.course.level ? getLevelName(courseDetail.course.level) : '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">ประเภท</p>
                <p class="font-semibold">{{ getTypeName(courseDetail.course.type) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">รหัสคอร์ส</p>
                <p class="font-semibold">{{ courseDetail.course.code || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Branches (if any) -->
          <div v-if="courseDetail.branches && courseDetail.branches.length > 0" class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">สาขาที่เปิดสอน</h2>
            <div class="space-y-3">
              <div
                v-for="branch in courseDetail.branches"
                :key="branch.branch_id"
                class="border border-gray-200 rounded-lg p-4"
              >
                <h3 class="font-medium text-lg mb-2">{{ branch.branch_name }}</h3>
                <div class="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>จำนวนที่นั่ง: <span class="font-medium">{{ branch.seat_limit ? branch.seat_limit.toLocaleString() : 'ไม่จำกัด' }}</span></div>
                  <div>ผู้ลงทะเบียนแล้ว: <span class="font-medium">{{ branch.current_enrollments || 0 }}</span></div>
                  <div v-if="branch.available_seats !== null">
                    ที่นั่งว่าง: <span class="font-medium text-green-600">{{ branch.available_seats }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar - Pricing & Enroll -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-lg sticky top-4 p-6">
            <div class="mb-6">
              <div v-if="courseDetail.course.onsite_price && courseDetail.course.onsite_price !== courseDetail.course.online_price" class="mb-2">
                <p class="text-sm text-gray-500">เรียนสด (Onsite)</p>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-bold text-gray-900">
                    ฿{{ courseDetail.course.onsite_price.toLocaleString() }}
                  </span>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">เรียนออนไลน์ (Online)</p>
                <div class="flex items-baseline gap-2">
                  <span v-if="courseDetail.course.online_price < courseDetail.course.price" class="text-sm text-gray-400 line-through">
                    ฿{{ courseDetail.course.price.toLocaleString() }}
                  </span>
                  <span class="text-3xl font-bold text-green-600">
                    ฿{{ courseDetail.course.online_price.toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Enroll Buttons -->
            <div class="space-y-3">
              <button
                @click="handleEnrollOnline"
                class="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                สมัครเรียนออนไลน์
              </button>
              
              <button
                v-if="courseDetail.branches && courseDetail.branches.length > 0"
                @click="handleEnrollOnsite"
                class="w-full px-6 py-3 bg-white border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                สมัครเรียนสดที่สาขา
              </button>
            </div>

            <!-- Features -->
            <div class="mt-6 pt-6 border-t space-y-3">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p class="font-medium text-sm">เรียนซ้ำกี่รอบก็ได้</p>
                  <p class="text-xs text-gray-500">ดูวิดีโอย้อนหลังได้ตลอดชีพ</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p class="font-medium text-sm">ส่งเอกสารฟรีถึงบ้าน</p>
                  <p class="text-xs text-gray-500">สำหรับผู้ที่สมัครเรียนออนไลน์</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p class="font-medium text-sm">สอบถามอาจารย์ได้ตลอดเวลา</p>
                  <p class="text-xs text-gray-500">ผ่านระบบถาม-ตอบในคอร์ส</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enrollment Modal -->
    <EnrollmentModal
      v-if="showEnrollmentModal"
      :show="showEnrollmentModal"
      :enrollment="null"
      :prefill-course-id="courseId"
      :prefill-enrollment-type="enrollmentType"
      @close="showEnrollmentModal = false"
      @saved="handleEnrollmentSaved"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'homepage'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { user, accessToken } = useAuth()

const courseId = computed(() => parseInt(route.params.id as string))
const loading = ref(true)
const error = ref('')
const courseDetail = ref<any>(null)
const showEnrollmentModal = ref(false)
const enrollmentType = ref<'onsite' | 'online'>('online')

const loadCourseDetail = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await $fetch<{
      success: boolean
      data: any
    }>(`${config.public.apiBase}/courses/${courseId.value}`)

    if (response.success) {
      courseDetail.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading course detail:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลคอร์ส'
  } finally {
    loading.value = false
  }
}

const handleEnrollOnline = () => {
  if (!user.value) {
    // Redirect to register with return URL for enrollment
    router.push(`/auth/register?redirect=/courses/${courseId.value}&enroll=online`)
    return
  }

  enrollmentType.value = 'online'
  showEnrollmentModal.value = true
}

const handleEnrollOnsite = () => {
  if (!user.value) {
    // Redirect to register with return URL for enrollment
    router.push(`/auth/register?redirect=/courses/${courseId.value}&enroll=onsite`)
    return
  }

  enrollmentType.value = 'onsite'
  showEnrollmentModal.value = true
}

const handleEnrollmentSaved = () => {
  showEnrollmentModal.value = false
  // Redirect to my courses or show success message
  router.push('/my-courses')
}

const getTypeName = (type: string) => {
  const typeNames: Record<string, string> = {
    live_online: 'Live Online',
    vod: 'VOD',
    hybrid: 'Hybrid'
  }
  return typeNames[type] || type
}

const getLevelName = (level: string) => {
  const levelNames: Record<string, string> = {
    beginner: 'เริ่มต้น',
    intermediate: 'กลาง',
    advanced: 'สูง'
  }
  return levelNames[level] || level
}

// Check if should auto-open enrollment modal after registration
onMounted(async () => {
  await loadCourseDetail()
  
  // Check if coming from registration with enroll param
  const enrollType = route.query.enroll as string
  if (user.value && enrollType && (enrollType === 'online' || enrollType === 'onsite')) {
    // Wait a bit for user state to fully load
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 300))
    
    enrollmentType.value = enrollType as 'onsite' | 'online'
    showEnrollmentModal.value = true
    
    // Clean up URL
    router.replace(`/courses/${courseId.value}`)
  }
})
</script>

