<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 py-12 max-w-4xl">
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p class="mt-4 text-gray-600">กำลังโหลด...</p>
      </div>
      
      <div v-else-if="page" class="bg-white rounded-lg shadow-sm p-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-6">{{ page.title }}</h1>
        <div 
          class="prose prose-lg max-w-none"
          v-html="page.content"
        ></div>
      </div>
      
      <div v-else-if="error" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">เกิดข้อผิดพลาด</h1>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <NuxtLink 
          to="/" 
          class="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          กลับหน้าหลัก
        </NuxtLink>
      </div>
      
      <div v-else class="bg-white rounded-lg shadow-sm p-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">ไม่พบหน้า</h1>
        <p class="text-gray-600 mb-6">ขออภัย ไม่พบหน้าที่คุณกำลังค้นหา</p>
        <NuxtLink 
          to="/" 
          class="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          กลับหน้าหลัก
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ContentPage {
  id: number
  slug: string
  title: string
  content: string | null
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

const page = ref<ContentPage | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

useHead({
  title: () => page.value?.meta_title || page.value?.title || 'งาน/โอกาสการทำงาน',
  meta: [
    {
      name: 'description',
      content: () => page.value?.meta_description || 'งาน/โอกาสการทำงาน - KDC Tutor School'
    },
    {
      name: 'keywords',
      content: () => page.value?.meta_keywords || ''
    }
  ]
})

onMounted(async () => {
  try {
    const response = await $fetch<{ success: boolean; data: ContentPage }>('/api/content-pages/careers')
    if (response && response.success && response.data) {
      page.value = response.data
    } else {
      error.value = 'ไม่พบข้อมูลหน้าเว็บไซต์'
    }
  } catch (err: any) {
    console.error('Error fetching careers page:', err)
    error.value = err.data?.message || err.message || 'ไม่สามารถโหลดหน้าได้'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.prose {
  color: #374151;
  line-height: 1.75;
}

.prose h1 {
  font-size: 2.25em;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 0.8888889em;
}

.prose h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin-top: 2em;
  margin-bottom: 1em;
}

.prose p {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

.prose a {
  color: #059669;
  text-decoration: underline;
}

.prose a:hover {
  color: #047857;
}

.prose strong {
  font-weight: 600;
}

.prose ul, .prose ol {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  padding-left: 1.625em;
}

.prose li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>

