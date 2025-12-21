<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-12 max-w-4xl">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลดบทความ...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ error }}
      </div>

      <!-- Article Content -->
      <article v-else-if="article" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="aspect-video bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
          <div class="text-6xl">{{ article.icon || '📝' }}</div>
        </div>

        <!-- Article Meta -->
        <div class="p-8 border-b">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-4">
              <span v-if="article.category" class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {{ article.category }}
              </span>
              <span class="text-gray-500 text-sm">
                {{ formatDate(article.published_at || article.created_at) }}
              </span>
            </div>
            <div v-if="article.author_name" class="text-sm text-gray-600">
              โดย {{ article.author_name }}
            </div>
          </div>

          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            {{ article.title }}
          </h1>

          <p v-if="article.excerpt" class="text-xl text-gray-600 leading-relaxed">
            {{ article.excerpt }}
          </p>
        </div>

        <!-- Article Body -->
        <div class="p-8 prose prose-lg max-w-none">
          <div v-html="article.content"></div>
        </div>

        <!-- Footer -->
        <div class="p-8 bg-gray-50 border-t">
          <div class="flex items-center justify-between">
            <NuxtLink
              to="/"
              class="text-green-600 hover:text-green-700 font-semibold flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              กลับหน้าหลัก
            </NuxtLink>
            <div class="text-sm text-gray-500">
              อ่าน {{ article.view_count }} ครั้ง
            </div>
          </div>
        </div>
      </article>
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

const route = useRoute()
const config = useRuntimeConfig()

const article = ref<Article | null>(null)
const loading = ref(true)
const error = ref('')

const loadArticle = async () => {
  loading.value = true
  error.value = ''

  try {
    const slug = route.params.slug as string
    const response = await $fetch<{
      success: boolean
      data: Article
    }>(`${config.public.apiBase}/articles/${slug}`)

    if (response.success) {
      article.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading article:', err)
    if (err.statusCode === 404) {
      error.value = 'ไม่พบบทความที่ต้องการ'
    } else {
      error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดบทความ'
    }
  } finally {
    loading.value = false
  }
}

const formatDate = (date: Date | string | null) => {
  if (!date) return ''
  try {
    const d = new Date(date)
    const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  } catch {
    return ''
  }
}

onMounted(() => {
  loadArticle()
})

useHead({
  title: computed(() => article.value ? article.value.title : 'บทความ')
})
</script>

<style scoped>
:deep(.prose h2) {
  @apply text-2xl font-bold mt-8 mb-4 text-gray-900;
}

:deep(.prose h3) {
  @apply text-xl font-semibold mt-6 mb-3 text-gray-800;
}

:deep(.prose p) {
  @apply mb-4 text-gray-700 leading-relaxed;
}

:deep(.prose ul) {
  @apply list-disc list-inside mb-4 space-y-2;
}

:deep(.prose ol) {
  @apply list-decimal list-inside mb-4 space-y-2;
}

:deep(.prose li) {
  @apply text-gray-700;
}

:deep(.prose strong) {
  @apply font-semibold text-gray-900;
}
</style>

