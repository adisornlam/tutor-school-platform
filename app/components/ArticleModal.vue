<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">
          {{ article ? 'แก้ไขบทความ' : 'เพิ่มบทความ' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              หัวข้อ <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              หมวดหมู่
            </label>
            <input
              v-model="form.category"
              type="text"
              placeholder="เช่น เทคนิคการเรียน, เคล็ดลับ"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Icon (Emoji)
            </label>
            <input
              v-model="form.icon"
              type="text"
              placeholder="เช่น 📝, 📚"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              สถานะ
            </label>
            <select
              v-model="form.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="draft">ร่าง</option>
              <option value="published">เผยแพร่</option>
              <option value="archived">เก็บถาวร</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ลำดับการแสดง
            </label>
            <input
              v-model.number="form.display_order"
              type="number"
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div class="flex items-center">
            <input
              v-model="form.is_featured"
              type="checkbox"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            >
            <label class="ml-2 block text-sm text-gray-700">
              แสดงในหน้าแรก
            </label>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            คำอธิบายสั้นๆ (Excerpt)
          </label>
          <textarea
            v-model="form.excerpt"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          ></textarea>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            รูปภาพปก
          </label>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
            <p class="text-sm font-semibold text-blue-900 mb-2">📐 ขนาดที่แนะนำ:</p>
            <ul class="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li><strong>ขนาด:</strong> 1280 x 720 pixels</li>
              <li><strong>สัดส่วน:</strong> 16:9 (แนวนอน)</li>
              <li><strong>รูปแบบ:</strong> JPG, PNG, WebP</li>
              <li><strong>ขนาดไฟล์:</strong> ไม่เกิน 2 MB (แนะนำ < 500 KB)</li>
            </ul>
          </div>
          <div class="space-y-3">
            <div v-if="uploadingThumbnail" class="text-sm text-gray-600 py-2">
              กำลังอัปโหลด...
            </div>
            <div v-else-if="form.featured_image_url" class="space-y-3">
              <p class="text-sm text-gray-600">ตัวอย่าง (สัดส่วน 16:9):</p>
              <div class="aspect-video bg-gray-200 rounded-lg overflow-hidden max-w-2xl">
                <img
                  :src="form.featured_image_url"
                  alt="Featured image preview"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                >
              </div>
              <button
                type="button"
                @click="form.featured_image_url = ''"
                class="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
              >
                ลบรูปภาพ
              </button>
            </div>
            <div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                ref="thumbnailInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                @change="handleThumbnailUpload"
                class="hidden"
              >
              <button
                type="button"
                @click="() => thumbnailInput?.click()"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                อัปโหลดรูปภาพปก
              </button>
              <p class="text-xs text-gray-500 mt-2 text-center">รองรับไฟล์: JPG, PNG, WebP (สูงสุด 2 MB)</p>
            </div>
          </div>
          <p v-if="uploadError" class="mt-2 text-sm text-red-600">{{ uploadError }}</p>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            เนื้อหา <span class="text-red-500">*</span>
          </label>
          <RichTextEditor
            v-model="form.content"
            entity-type="articles"
            :entity-id="props.article?.id"
            class="w-full"
          />
        </div>

        <div class="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'กำลังบันทึก...' : 'บันทึก' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import RichTextEditor from './RichTextEditor.vue'

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
}

const props = defineProps<{
  show: boolean
  article?: Article | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const loading = ref(false)
const uploadingThumbnail = ref(false)
const thumbnailInput = ref<HTMLInputElement | null>(null)
const uploadError = ref('')

const form = reactive({
  title: '',
  excerpt: '',
  content: '',
  category: '',
  icon: '',
  featured_image_url: '',
  status: 'draft' as 'draft' | 'published' | 'archived',
  is_featured: false,
  display_order: 0
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.article) {
      form.title = props.article.title || ''
      form.excerpt = props.article.excerpt || ''
      form.content = props.article.content || ''
      form.category = props.article.category || ''
      form.icon = props.article.icon || ''
      form.featured_image_url = props.article.featured_image_url || ''
      form.status = props.article.status as 'draft' | 'published' | 'archived'
      form.is_featured = props.article.is_featured || false
      form.display_order = props.article.display_order || 0
    } else {
      resetForm()
    }
  }
})

const resetForm = () => {
  form.title = ''
  form.excerpt = ''
  form.content = ''
  form.category = ''
  form.icon = ''
  form.featured_image_url = ''
  form.status = 'draft'
  form.is_featured = false
  form.display_order = 0
  uploadError.value = ''
}

const handleThumbnailUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    uploadError.value = 'กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, WebP เท่านั้น)'
    return
  }
  
  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    uploadError.value = 'ขนาดไฟล์ไม่ควรเกิน 2 MB (แนะนำ < 500 KB)'
    return
  }
  
  // Validate image dimensions
  const img = new Image()
  const imgUrl = URL.createObjectURL(file)
  
  img.onload = async () => {
    URL.revokeObjectURL(imgUrl)
    
    const width = img.width
    const height = img.height
    const aspectRatio = width / height
    const recommendedRatio = 16 / 9
    const ratioTolerance = 0.1 // Allow 10% tolerance
    
    // Check aspect ratio (16:9 = 1.777...)
    let aspectWarning = ''
    if (Math.abs(aspectRatio - recommendedRatio) > ratioTolerance) {
      aspectWarning = `สัดส่วนภาพไม่เหมาะสม (ปัจจุบัน ${width}x${height}) แนะนำ 1280x720 pixels (16:9)`
      console.warn(`Image aspect ratio: ${aspectRatio.toFixed(2)}, recommended: ${recommendedRatio.toFixed(2)}`)
    }
    
    // Continue with upload even if aspect ratio is off (warning only)
    uploadingThumbnail.value = true
    uploadError.value = ''
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // Get article ID if editing
      const articleId = props.article?.id
      
      const response = await $fetch<{ success: boolean; data: { url: string } }>(
        `${config.public.apiBase}/admin/upload?entityType=articles&fileType=featured${articleId ? `&entityId=${articleId}` : ''}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          },
          body: formData
        }
      )
      
      if (response.success && response.data.url) {
        form.featured_image_url = response.data.url
        // Show warning if aspect ratio was off
        if (aspectWarning) {
          uploadError.value = aspectWarning
        }
      }
    } catch (err: any) {
      console.error('Error uploading thumbnail:', err)
      uploadError.value = err.data?.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ'
    } finally {
      uploadingThumbnail.value = false
      // Reset input
      if (target) {
        target.value = ''
      }
    }
  }
  
  img.onerror = () => {
    URL.revokeObjectURL(imgUrl)
    uploadError.value = 'ไม่สามารถอ่านไฟล์รูปภาพได้'
  }
  
  img.src = imgUrl
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (props.article) {
      await $fetch(`${config.public.apiBase}/admin/articles/${props.article.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: form
      })
    } else {
      await $fetch(`${config.public.apiBase}/admin/articles`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: form
      })
    }
    emit('saved')
    emit('close')
  } catch (err: any) {
    console.error('Error saving article:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกบทความ')
  } finally {
    loading.value = false
  }
}
</script>

