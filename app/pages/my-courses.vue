<template>
    <div>
      <h1 class="text-3xl font-bold mb-6">คอร์สเรียนของฉัน</h1>

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
          จำนวน: <span class="font-semibold">{{ filteredCourses.length }}</span> คอร์ส
        </div>
        <div class="flex items-center gap-4">
          <select 
            v-model="selectedType"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">ทุกประเภทการเรียน</option>
            <option value="live">Live Online</option>
            <option value="vod">Video on Demand</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <select 
            v-model="sortBy"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="newest">วันที่ลงเรียนใหม่-เก่า</option>
            <option value="oldest">วันที่ลงเรียนเก่า-ใหม่</option>
            <option value="progress">ความคืบหน้า</option>
          </select>
        </div>
      </div>

      <!-- Course List -->
      <div class="space-y-4">
        <div
          v-for="enrollment in filteredCourses"
          :key="enrollment.id"
          class="bg-white rounded-lg shadow p-6 flex gap-6"
        >
          <!-- Course Thumbnail -->
          <div class="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
            <img 
              v-if="enrollment.course.thumbnail"
              :src="enrollment.course.thumbnail"
              :alt="enrollment.course.title"
              class="w-full h-full object-cover"
            >
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Course Info -->
          <div class="flex-1">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm text-gray-500">คอร์สออนไลน์</span>
                  <span class="text-gray-300">•</span>
                  <span class="text-sm text-gray-500">เรียนซ้ำกี่รอบก็ได้ตลอดชีพ</span>
                </div>
                <h3 class="text-xl font-semibold mb-2">{{ enrollment.course.title }}</h3>
                <p v-if="enrollment.course.description" class="text-gray-600 text-sm mb-4">
                  {{ enrollment.course.description }}
                </p>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mb-4">
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
                ลงทะเบียนเมื่อ: {{ formatDate(enrollment.enrolledAt) }}
              </div>
              <NuxtLink
                :to="`/learning/courses/${enrollment.course.id}`"
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                กลับไปเรียนต่อ
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredCourses.length === 0" class="text-center py-12">
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
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'student'
})

const activeTab = ref('all')
const selectedType = ref('all')
const sortBy = ref('newest')

const tabs = [
  { id: 'all', label: 'การเรียนทั้งหมด' },
  { id: 'in-progress', label: 'กำลังเรียน' },
  { id: 'completed', label: 'เรียนจบแล้ว' }
]

// Mock data - จะแทนที่ด้วย API call
const enrollments = ref([
  {
    id: 1,
    course: {
      id: 1,
      title: 'อาชีพเสริม สร้างเงินแสนออนไลน์ อย่างยั่งยืนด้วย Affiliate Marketing',
      description: 'เรียนรู้เทคนิคการทำ Affiliate Marketing แบบมืออาชีพ',
      thumbnail: null
    },
    progress: 25,
    enrolledAt: new Date('2024-12-01'),
    status: 'active'
  },
  {
    id: 2,
    course: {
      id: 2,
      title: 'เตรียมพื้นฐาน ES2015 และ Node.js ก่อนจะไปลุย React',
      description: 'เรียนรู้พื้นฐาน JavaScript ES2015 และ Node.js',
      thumbnail: null
    },
    progress: 0,
    enrolledAt: new Date('2024-12-15'),
    status: 'active'
  }
])

const filteredCourses = computed(() => {
  let courses = enrollments.value

  // Filter by tab
  if (activeTab.value === 'in-progress') {
    courses = courses.filter(c => c.progress > 0 && c.progress < 100)
  } else if (activeTab.value === 'completed') {
    courses = courses.filter(c => c.progress === 100)
  }

  // Filter by type
  if (selectedType.value !== 'all') {
    // TODO: Filter by course type
  }

  // Sort
  if (sortBy.value === 'newest') {
    courses = [...courses].sort((a, b) => b.enrolledAt.getTime() - a.enrolledAt.getTime())
  } else if (sortBy.value === 'oldest') {
    courses = [...courses].sort((a, b) => a.enrolledAt.getTime() - b.enrolledAt.getTime())
  } else if (sortBy.value === 'progress') {
    courses = [...courses].sort((a, b) => b.progress - a.progress)
  }

  return courses
})

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Fetch enrollments from API
onMounted(async () => {
  try {
    const config = useRuntimeConfig()
    const { data } = await useFetch(`${config.public.apiBase}/learning/my-courses`, {
      headers: {
        Authorization: `Bearer ${useCookie('access_token').value}`
      }
    })
    // TODO: Update enrollments with API data
  } catch (error) {
    console.error('Failed to fetch enrollments:', error)
  }
})
</script>

