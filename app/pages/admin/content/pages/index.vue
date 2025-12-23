<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">จัดการหน้าเว็บไซต์</h1>
      <NuxtLink
        to="/admin/content/pages/new"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>เพิ่มหน้าใหม่</span>
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="ค้นหาด้วยชื่อ, slug"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @input="debouncedSearch"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadPages"
          >
            <option value="">ทั้งหมด</option>
            <option value="active">ใช้งาน</option>
            <option value="inactive">ไม่ใช้งาน</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Pages Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-else-if="pages.length === 0" class="p-8 text-center text-gray-500">
        ไม่พบหน้าเว็บไซต์
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อัปเดตล่าสุด</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="page in pages" :key="page.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">{{ page.title }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-600 font-mono">/{{ page.slug }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 py-1 text-xs font-medium rounded"
                :class="{
                  'bg-green-100 text-green-800': page.is_active,
                  'bg-gray-100 text-gray-800': !page.is_active
                }"
              >
                {{ page.is_active ? 'ใช้งาน' : 'ไม่ใช้งาน' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ page.display_order }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-600">{{ formatDate(page.updated_at) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <a
                  :href="`/${page.slug}`"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-900"
                  title="ดูหน้าเว็บไซต์"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <NuxtLink
                  :to="`/admin/content/pages/${page.id}/edit`"
                  class="text-blue-600 hover:text-blue-900"
                  title="แก้ไข"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </NuxtLink>
                <button
                  @click.stop="confirmDelete(page)"
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
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

interface ContentPage {
  id: number
  slug: string
  title: string
  content: string | null
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  is_active: boolean
  display_order: number
  created_by: number
  created_at: string
  updated_at: string
}

const pages = ref<ContentPage[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const filters = ref({
  search: '',
  status: ''
})

// Debounce search
let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    loadPages()
  }, 500)
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: th })
}

const loadPages = async () => {
  loading.value = true
  error.value = null

  try {
    const params = new URLSearchParams()
    if (filters.value.search) {
      params.append('search', filters.value.search)
    }
    if (filters.value.status) {
      params.append('status', filters.value.status)
    }

    const response = await $fetch<{ success: boolean; data: ContentPage[] }>(
      `/api/admin/content-pages${params.toString() ? '?' + params.toString() : ''}`
    )

    if (response.success) {
      pages.value = response.data.filter(page => {
        if (filters.value.status === 'active' && !page.is_active) return false
        if (filters.value.status === 'inactive' && page.is_active) return false
        return true
      })
    }
  } catch (err: any) {
    console.error('Error loading pages:', err)
    error.value = err.data?.message || err.message || 'ไม่สามารถโหลดข้อมูลได้'
  } finally {
    loading.value = false
  }
}

const confirmDelete = async (page: ContentPage) => {
  if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบหน้า "${page.title}"?`)) {
    return
  }

  try {
    await $fetch(`/api/admin/content-pages/${page.id}`, {
      method: 'DELETE'
    })

    await loadPages()
  } catch (err: any) {
    alert(err.data?.message || err.message || 'ไม่สามารถลบได้')
  }
}

onMounted(() => {
  loadPages()
})
</script>

