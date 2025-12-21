<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">จัดการบทความ</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>เพิ่มบทความ</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="ค้นหาด้วยหัวข้อ, เนื้อหา"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @input="debouncedSearch"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
          <input
            v-model="filters.category"
            type="text"
            placeholder="กรองตามหมวดหมู่"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @input="loadArticles"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadArticles"
          >
            <option value="">ทั้งหมด</option>
            <option value="draft">ร่าง</option>
            <option value="published">เผยแพร่</option>
            <option value="archived">เก็บถาวร</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Articles Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-else-if="articles.length === 0" class="p-8 text-center text-gray-500">
        ไม่พบบทความ
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หัวข้อ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หมวดหมู่</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หน้าแรก</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="article in articles" :key="article.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <div v-if="article.icon" class="text-2xl">{{ article.icon }}</div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ article.title }}</div>
                  <div v-if="article.excerpt" class="text-xs text-gray-500 mt-1 line-clamp-1">
                    {{ article.excerpt }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ article.category || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 py-1 text-xs font-medium rounded"
                :class="{
                  'bg-yellow-100 text-yellow-800': article.status === 'draft',
                  'bg-green-100 text-green-800': article.status === 'published',
                  'bg-gray-100 text-gray-800': article.status === 'archived'
                }"
              >
                {{ getStatusName(article.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="article.is_featured" class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                แสดง
              </span>
              <span v-else class="text-gray-400">-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click.stop="editArticle(article)"
                  class="text-blue-600 hover:text-blue-900"
                  title="แก้ไข"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click.stop="confirmDelete(article)"
                  class="text-red-600 hover:text-red-900"
                  title="ลบ"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal -->
    <ArticleModal
      :show="showCreateModal || editingArticle !== null"
      :article="editingArticle"
      @close="closeModal"
      @saved="handleArticleSaved"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

interface Article {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  content: string
  category?: string | null
  icon?: string | null
  featured_image_url?: string | null
  status: string
  is_featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const articles = ref<Article[]>([])
const loading = ref(false)
const error = ref('')
const showCreateModal = ref(false)
const editingArticle = ref<Article | null>(null)

const filters = reactive({
  search: '',
  category: '',
  status: ''
})

// Debounce search
let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadArticles()
  }, 500)
}

const loadArticles = async () => {
  loading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.category) params.append('category', filters.category)
    if (filters.status) params.append('status', filters.status)

    const response = await $fetch<{
      success: boolean
      data: Article[]
    }>(`${config.public.apiBase}/admin/articles?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    if (response.success) {
      articles.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading articles:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const getStatusName = (status: string) => {
  const statusNames: Record<string, string> = {
    draft: 'ร่าง',
    published: 'เผยแพร่',
    archived: 'เก็บถาวร'
  }
  return statusNames[status] || status
}

const editArticle = (article: Article) => {
  editingArticle.value = { ...article }
  showCreateModal.value = false
}

const closeModal = () => {
  showCreateModal.value = false
  editingArticle.value = null
}

const handleArticleSaved = () => {
  closeModal()
  loadArticles()
}

const { confirm } = useConfirm()
const confirmDelete = async (article: Article) => {
  const confirmed = await confirm({
    title: 'ยืนยันการลบ',
    message: `คุณแน่ใจหรือไม่ว่าต้องการลบบทความ "${article.title}"?\nการกระทำนี้ไม่สามารถยกเลิกได้`,
    confirmText: 'ลบ',
    cancelText: 'ยกเลิก',
    type: 'danger'
  })
  
  if (!confirmed) return

  try {
    await $fetch(`${config.public.apiBase}/admin/articles/${article.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    await loadArticles()
  } catch (err: any) {
    console.error('Error deleting article:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการลบบทความ')
  }
}

onMounted(() => {
  loadArticles()
})
</script>

