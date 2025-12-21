<template>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-green-500 to-green-700 text-white py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-5xl font-bold mb-6">
            เรียนออนไลน์ได้ทุกที่ ทุกเวลา
          </h1>
          <p class="text-xl mb-8 text-green-100">
            คอร์สเรียนคุณภาพสูงจากอาจารย์ผู้เชี่ยวชาญ พร้อมระบบ Live และ VOD
          </p>
          <div class="flex gap-4 justify-center">
            <NuxtLink 
              to="/courses" 
              class="px-8 py-4 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              ดูคอร์สเรียนทั้งหมด
            </NuxtLink>
            <NuxtLink 
              to="/auth/register" 
              class="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              เริ่มเรียนฟรี
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Value Proposition / Benefits Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">ทำไมต้องเลือก KDC School?</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6 bg-gray-50 rounded-lg">
            <div class="text-5xl mb-4">🎥</div>
            <h3 class="text-xl font-semibold mb-2">Live Online Class</h3>
            <p class="text-gray-600">เรียนสดกับอาจารย์ผ่านระบบออนไลน์ พร้อมถามตอบแบบ Real-time</p>
          </div>
          <div class="text-center p-6 bg-gray-50 rounded-lg">
            <div class="text-5xl mb-4">📹</div>
            <h3 class="text-xl font-semibold mb-2">Video on Demand</h3>
            <p class="text-gray-600">เรียนซ้ำกี่รอบก็ได้ตลอดชีพ ดูได้ทุกที่ทุกเวลา</p>
          </div>
          <div class="text-center p-6 bg-gray-50 rounded-lg">
            <div class="text-5xl mb-4">📚</div>
            <h3 class="text-xl font-semibold mb-2">เอกสารประกอบ</h3>
            <p class="text-gray-600">ส่งเอกสารประกอบการเรียนถึงบ้านผ่าน Kerry Express</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Courses -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold">คอร์สเรียนยอดนิยม</h2>
          <NuxtLink 
            to="/courses" 
            class="text-green-600 hover:text-green-700 font-semibold"
          >
            ดูทั้งหมด →
          </NuxtLink>
        </div>
        <!-- Loading State -->
        <div v-if="loadingFeaturedCourses" class="grid md:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="bg-white rounded-lg shadow animate-pulse">
            <div class="aspect-video bg-gray-200"></div>
            <div class="p-4 space-y-3">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        <!-- Courses Grid -->
        <div v-else-if="featuredCourses.length > 0" class="grid md:grid-cols-3 gap-6">
          <CourseCard 
            v-for="course in featuredCourses" 
            :key="course.id"
            :course="course"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8 text-gray-500">
          กำลังโหลดคอร์สยอดนิยม...
        </div>
      </div>
    </section>

    <!-- Statistics / Achievements Section -->
    <section class="py-16 bg-gradient-to-br from-green-600 to-green-700 text-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">ความสำเร็จของเรา</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold mb-2">{{ stats.yearsOfExperience }}+</div>
            <div class="text-green-100 text-sm md:text-base">ปีแห่งประสบการณ์</div>
          </div>
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold mb-2">{{ stats.totalStudents.toLocaleString() }}+</div>
            <div class="text-green-100 text-sm md:text-base">นักเรียนทั้งหมด</div>
          </div>
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold mb-2">{{ stats.totalCourses }}+</div>
            <div class="text-green-100 text-sm md:text-base">คอร์สเรียน</div>
          </div>
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold mb-2">{{ stats.successRate }}%</div>
            <div class="text-green-100 text-sm md:text-base">อัตราความสำเร็จ</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">เสียงตอบรับจากผู้ปกครอง</h2>
        <!-- Loading State -->
        <div v-if="loadingTestimonials" class="grid md:grid-cols-3 gap-8">
          <div v-for="i in 3" :key="i" class="bg-gray-50 rounded-lg p-6 shadow-sm animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        <!-- Testimonials Grid -->
        <div v-else-if="testimonials.length > 0" class="grid md:grid-cols-3 gap-8">
          <div
            v-for="testimonial in testimonials"
            :key="testimonial.id"
            class="bg-gray-50 rounded-lg p-6 shadow-sm"
          >
            <div class="flex items-center gap-1 mb-4">
              <svg
                v-for="i in 5"
                :key="i"
                class="w-5 h-5"
                :class="i <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p class="text-gray-700 mb-4 italic">"{{ testimonial.comment }}"</p>
            <div>
              <div class="font-semibold text-gray-900">{{ testimonial.name }}</div>
              <div class="text-sm text-gray-600">{{ testimonial.role }}</div>
            </div>
          </div>
        </div>
        <!-- Empty State -->
        <div v-else class="text-center py-8 text-gray-500">
          ยังไม่มีรีวิว
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-8">หมวดหมู่คอร์สเรียน</h2>
        <p class="text-center text-gray-600 mb-8">เลือกเรียนตามวิชาที่คุณสนใจ</p>
        <div class="grid md:grid-cols-4 gap-6">
          <NuxtLink 
            v-for="category in categories" 
            :key="category.id"
            :to="`/courses?category=${category.slug}`"
            class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center group"
          >
            <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">{{ category.icon }}</div>
            <h3 class="font-semibold text-lg mb-2">{{ category.name }}</h3>
            <p class="text-gray-600 text-sm">{{ category.count }} คอร์ส</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Tips & Articles Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold">เทคนิคดีๆ และบทความ</h2>
          <NuxtLink
            to="/articles"
            class="text-green-600 hover:text-green-700 font-semibold"
          >
            ดูทั้งหมด →
          </NuxtLink>
        </div>
        <!-- Loading State -->
        <div v-if="loadingArticles" class="grid md:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="bg-white rounded-lg shadow animate-pulse">
            <div class="aspect-video bg-gray-200"></div>
            <div class="p-6 space-y-3">
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
        <!-- Articles Grid -->
        <div v-else-if="featuredArticles.length > 0" class="grid md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="article in featuredArticles"
            :key="article.id"
            :to="`/articles/${article.slug}`"
            class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden cursor-pointer block"
          >
            <div class="aspect-video bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <div class="text-4xl">{{ article.icon || '📝' }}</div>
            </div>
            <div class="p-6">
              <div class="text-sm text-gray-500 mb-2">{{ article.category || 'บทความ' }}</div>
              <h3 class="text-lg font-semibold mb-2 line-clamp-2">{{ article.title }}</h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ article.excerpt || '' }}</p>
              <div class="text-sm text-green-600 font-semibold">อ่านต่อ →</div>
            </div>
          </NuxtLink>
        </div>
        <!-- Empty State -->
        <div v-else class="text-center py-8 text-gray-500">
          ยังไม่มีบทความ
        </div>
      </div>
    </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'homepage'
})

useHead({
  title: 'KDC School - เรียนออนไลน์ได้ทุกที่ ทุกเวลา'
})

const config = useRuntimeConfig()

const categories = [
  { id: 1, name: 'คณิตศาสตร์', icon: '📐', slug: 'mathematics', count: 0 },
  { id: 2, name: 'วิทยาศาสตร์', icon: '🔬', slug: 'science', count: 0 },
  { id: 3, name: 'ภาษาไทย', icon: '📖', slug: 'thai', count: 0 },
  { id: 4, name: 'ภาษาอังกฤษ', icon: '🌐', slug: 'english', count: 0 }
]

interface Course {
  id: number
  title: string
  description?: string
  type: string
  price: number
  thumbnail_url?: string | null
  enrollment_count: number
}

const featuredCourses = ref<Array<{
  id: number
  title: string
  description?: string
  price: number
  thumbnail?: string
  type?: string
  students?: number
}>>([])
const loadingFeaturedCourses = ref(false)

// Load featured courses from API
const loadFeaturedCourses = async () => {
  loadingFeaturedCourses.value = true
  try {
    const response = await $fetch<{
      success: boolean
      data: Course[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>(`${config.public.apiBase}/courses?limit=3&sort_by=popular`)

    if (response.success) {
      // Format courses for CourseCard component
      featuredCourses.value = response.data.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        price: course.price,
        thumbnail: course.thumbnail_url || undefined,
        type: getTypeName(course.type),
        students: course.enrollment_count
      }))
    }
  } catch (err: any) {
    console.error('Error loading featured courses:', err)
    // Keep empty array on error
    featuredCourses.value = []
  } finally {
    loadingFeaturedCourses.value = false
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

// Statistics
const stats = ref({
  yearsOfExperience: 10,
  totalStudents: 5000,
  totalCourses: 50,
  successRate: 95
})

// Testimonials
interface Testimonial {
  id: number
  name: string
  role: string
  comment: string
  rating: number
  avatar_url?: string | null
}

const testimonials = ref<Testimonial[]>([])
const loadingTestimonials = ref(false)

// Featured Articles / Tips
interface Article {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  category?: string | null
  icon?: string | null
}

const featuredArticles = ref<Article[]>([])
const loadingArticles = ref(false)

// Load testimonials from API
const loadTestimonials = async () => {
  loadingTestimonials.value = true
  try {
    const response = await $fetch<{
      success: boolean
      data: Testimonial[]
    }>(`${config.public.apiBase}/testimonials?limit=3`)

    if (response.success) {
      testimonials.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading testimonials:', err)
    testimonials.value = []
  } finally {
    loadingTestimonials.value = false
  }
}

// Load featured articles from API
const loadFeaturedArticles = async () => {
  loadingArticles.value = true
  try {
    const response = await $fetch<{
      success: boolean
      data: Article[]
    }>(`${config.public.apiBase}/articles?limit=3&featured=true`)

    if (response.success) {
      featuredArticles.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading articles:', err)
    featuredArticles.value = []
  } finally {
    loadingArticles.value = false
  }
}

// Load featured courses on mount
onMounted(() => {
  loadFeaturedCourses()
  loadTestimonials()
  loadFeaturedArticles()
  // TODO: Load stats from API
})
</script>
