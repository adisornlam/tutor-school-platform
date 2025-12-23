<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">บทความ</h1>
        <p class="text-gray-600">บทความและข่าวสารที่น่าสนใจจาก KDC Tutor School</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p class="mt-4 text-gray-600">กำลังโหลดบทความ...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ error }}
      </div>

      <!-- Articles Grid -->
      <div v-else-if="articles.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="article in articles"
          :key="article.id"
          class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
          @click="navigateToArticle(article.slug)"
        >
          <!-- Article Image/Icon -->
          <div class="aspect-video bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <div class="text-6xl">{{ article.icon || '📝' }}</div>
          </div>

          <!-- Article Content -->
          <div class="p-6">
            <div class="flex items-center space-x-2 mb-3">
              <span v-if="article.category" class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {{ article.category }}
              </span>
              <span class="text-gray-500 text-xs">
                {{ formatDate(article.published_at || article.created_at) }}
              </span>
            </div>

            <h2 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {{ article.title }}
            </h2>

            <p v-if="article.excerpt" class="text-gray-600 text-sm mb-4 line-clamp-3">
              {{ article.excerpt }}
            </p>

            <div class="flex items-center justify-between">
              <span class="text-green-600 text-sm font-medium hover:text-green-700">
                อ่านต่อ →
              </span>
              <span class="text-gray-400 text-xs">
                {{ article.view_count }} views
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-sm p-12 text-center">
        <div class="text-6xl mb-4">📝</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">ยังไม่มีบทความ</h2>
        <p class="text-gray-600">กำลังเตรียมบทความที่น่าสนใจให้คุณ</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

definePageMeta({
  layout: 'homepage'
})

interface Article {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  category: string | null
  icon: string | null
  featured_image_url: string | null
  is_featured: boolean
  view_count: number
  published_at: Date | null
  created_at: Date
  updated_at: Date
  author_name: string | null
}

const config = useRuntimeConfig()

const articles = ref<Article[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const formatDate = (date: Date | string | null) => {
  if (!date) return ''
  return format(new Date(date), 'dd MMMM yyyy', { locale: th })
}

const navigateToArticle = (slug: string) => {
  navigateTo(`/articles/${slug}`)
}

const loadArticles = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await $fetch<{
      success: boolean
      data: Article[]
    }>(`${config.public.apiBase}/articles`)

    if (response.success) {
      articles.value = response.data
    } else {
      error.value = 'ไม่สามารถโหลดบทความได้'
    }
  } catch (err: any) {
    console.error('Error loading articles:', err)
    error.value = err.data?.message || err.message || 'ไม่สามารถโหลดบทความได้'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadArticles()
})

useHead({
  title: () => 'บทความ - KDC Tutor School',
  meta: [
    {
      name: 'description',
      content: () => 'บทความและข่าวสารที่น่าสนใจจาก KDC Tutor School'
    }
  ]
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

