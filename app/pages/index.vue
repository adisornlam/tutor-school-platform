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

    <!-- Categories Section -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-8">หมวดหมู่คอร์สเรียน</h2>
        <div class="grid md:grid-cols-4 gap-6">
          <NuxtLink 
            v-for="category in categories" 
            :key="category.id"
            :to="`/courses?category=${category.slug}`"
            class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center"
          >
            <div class="text-4xl mb-4">{{ category.icon }}</div>
            <h3 class="font-semibold text-lg mb-2">{{ category.name }}</h3>
            <p class="text-gray-600 text-sm">{{ category.count }} คอร์ส</p>
          </NuxtLink>
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
        <div class="grid md:grid-cols-3 gap-6">
          <CourseCard 
            v-for="course in featuredCourses" 
            :key="course.id"
            :course="course"
          />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">ทำไมต้องเลือก KDC School?</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6 bg-white rounded-lg shadow">
            <div class="text-5xl mb-4">🎥</div>
            <h3 class="text-xl font-semibold mb-2">Live Online Class</h3>
            <p class="text-gray-600">เรียนสดกับอาจารย์ผ่านระบบออนไลน์ พร้อมถามตอบแบบ Real-time</p>
          </div>
          <div class="text-center p-6 bg-white rounded-lg shadow">
            <div class="text-5xl mb-4">📹</div>
            <h3 class="text-xl font-semibold mb-2">Video on Demand</h3>
            <p class="text-gray-600">เรียนซ้ำกี่รอบก็ได้ตลอดชีพ ดูได้ทุกที่ทุกเวลา</p>
          </div>
          <div class="text-center p-6 bg-white rounded-lg shadow">
            <div class="text-5xl mb-4">📚</div>
            <h3 class="text-xl font-semibold mb-2">เอกสารประกอบ</h3>
            <p class="text-gray-600">ส่งเอกสารประกอบการเรียนถึงบ้านผ่าน Kerry Express</p>
          </div>
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

const categories = [
  { id: 1, name: 'คณิตศาสตร์', icon: '📐', slug: 'mathematics', count: 45 },
  { id: 2, name: 'วิทยาศาสตร์', icon: '🔬', slug: 'science', count: 32 },
  { id: 3, name: 'ภาษาไทย', icon: '📖', slug: 'thai', count: 28 },
  { id: 4, name: 'ภาษาอังกฤษ', icon: '🌐', slug: 'english', count: 38 }
]

const featuredCourses = [
  {
    id: 1,
    title: 'คณิตศาสตร์ ม.1',
    description: 'หลักสูตรคณิตศาสตร์ระดับมัธยมศึกษาปีที่ 1',
    price: 5000,
    originalPrice: 6000,
    rating: 4.8,
    students: 1250,
    thumbnail: '/images/course-1.jpg'
  },
  {
    id: 2,
    title: 'ฟิสิกส์ ม.4',
    description: 'เตรียมความพร้อมสำหรับการสอบเข้ามหาวิทยาลัย',
    price: 5500,
    originalPrice: 6500,
    rating: 4.9,
    students: 980,
    thumbnail: '/images/course-2.jpg'
  },
  {
    id: 3,
    title: 'ภาษาอังกฤษ TOEIC',
    description: 'เตรียมสอบ TOEIC ด้วยเทคนิคพิเศษ',
    price: 4500,
    originalPrice: 5500,
    rating: 4.7,
    students: 2100,
    thumbnail: '/images/course-3.jpg'
  }
]
</script>
