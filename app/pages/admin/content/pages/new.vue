<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <NuxtLink
          to="/admin/content/pages"
          class="p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>
        <h1 class="text-3xl font-bold">เพิ่มหน้าเว็บไซต์ใหม่</h1>
      </div>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      {{ error }}
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Slug -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Slug <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.slug"
            type="text"
            required
            placeholder="about, contact, help"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
          >
          <p class="mt-1 text-sm text-gray-500">URL path สำหรับหน้าเว็บไซต์ (เช่น: /about, /contact)</p>
        </div>

        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ชื่อหน้า <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="เกี่ยวกับเรา"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>

        <!-- Status & Display Order -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            สถานะ
          </label>
          <select
            v-model="form.is_active"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option :value="true">ใช้งาน</option>
            <option :value="false">ไม่ใช้งาน</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ลำดับการแสดงผล
          </label>
          <input
            v-model.number="form.display_order"
            type="number"
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>
      </div>

      <!-- Content (Rich Text Editor) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          เนื้อหา
        </label>
        <RichTextEditor
          v-model="form.content"
          entity-type="content-pages"
          :entity-id="null"
          class="w-full"
        />
      </div>

      <!-- Meta Tags -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Meta Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Meta Title
          </label>
          <input
            v-model="form.meta_title"
            type="text"
            placeholder="หน้าเว็บไซต์ - KDC Tutor School"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
          <p class="mt-1 text-sm text-gray-500">ใช้สำหรับ SEO (ถ้าไม่กรอกจะใช้ชื่อหน้า)</p>
        </div>

        <!-- Meta Keywords -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Meta Keywords
          </label>
          <input
            v-model="form.meta_keywords"
            type="text"
            placeholder="keyword1, keyword2, keyword3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>
      </div>

      <!-- Meta Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Meta Description
        </label>
        <textarea
          v-model="form.meta_description"
          rows="3"
          placeholder="คำอธิบายสั้นๆ สำหรับ SEO"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        ></textarea>
      </div>

      <!-- Error Message -->
      <div v-if="submitError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ submitError }}
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-4 pt-4 border-t">
        <NuxtLink
          to="/admin/content/pages"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ยกเลิก
        </NuxtLink>
        <button
          type="submit"
          :disabled="saving"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="saving">กำลังบันทึก...</span>
          <span v-else>บันทึก</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import RichTextEditor from '~/components/RichTextEditor.vue'

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const router = useRouter()
const error = ref<string | null>(null)
const saving = ref(false)
const submitError = ref<string | null>(null)

const form = ref({
  slug: '',
  title: '',
  content: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  is_active: true,
  display_order: 0
})

const handleSubmit = async () => {
  saving.value = true
  submitError.value = null

  try {
    await $fetch('/api/admin/content-pages', {
      method: 'POST',
      body: {
        slug: form.value.slug,
        title: form.value.title,
        content: form.value.content || null,
        meta_title: form.value.meta_title || null,
        meta_description: form.value.meta_description || null,
        meta_keywords: form.value.meta_keywords || null,
        is_active: form.value.is_active,
        display_order: form.value.display_order
      }
    })

    // Redirect to list page
    router.push('/admin/content/pages')
  } catch (err: any) {
    console.error('Error saving page:', err)
    submitError.value = err.data?.message || err.message || 'ไม่สามารถบันทึกได้'
  } finally {
    saving.value = false
  }
}
</script>

