<template>
  <NuxtLink 
    :to="`/courses/${course.id}`"
    class="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
  >
    <div class="aspect-video bg-gray-200 relative">
      <img 
        v-if="course.thumbnail || course.thumbnail_url" 
        :src="course.thumbnail || course.thumbnail_url" 
        :alt="course.title"
        class="w-full h-full object-cover"
      >
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>
      <div v-if="course.type" class="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
        {{ course.type }}
      </div>
    </div>
    <div class="p-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-sm text-gray-500">คอร์สออนไลน์</span>
        <span class="text-gray-300">•</span>
        <span class="text-sm text-gray-500">เรียนซ้ำกี่รอบก็ได้ตลอดชีพ</span>
      </div>
      <h3 class="font-semibold text-lg mb-2 line-clamp-2">{{ course.title }}</h3>
      <p v-if="course.description" class="text-gray-600 text-sm mb-4 line-clamp-2">
        {{ course.description }}
      </p>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div v-if="course.rating" class="flex items-center gap-1">
            <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="text-sm font-semibold">{{ course.rating }}</span>
          </div>
          <div v-if="course.students" class="text-sm text-gray-500">
            {{ course.students.toLocaleString() }} คน
          </div>
        </div>
        <div class="text-right">
          <div v-if="course.originalPrice" class="text-sm text-gray-400 line-through">
            ฿{{ course.originalPrice.toLocaleString() }}
          </div>
          <div class="text-lg font-bold text-green-600">
            ฿{{ course.price.toLocaleString() }}
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Course {
  id: number
  title: string
  description?: string
  price: number
  originalPrice?: number
  rating?: number
  students?: number
  thumbnail?: string
  thumbnail_url?: string
  type?: string
}

defineProps<{
  course: Course
}>()
</script>

