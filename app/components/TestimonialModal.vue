<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">
          {{ testimonial ? 'แก้ไขรีวิว' : 'เพิ่มรีวิว' }}
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
          <!-- ชื่อ - แถวเดียวยาว -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ชื่อ <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <!-- บทบาท/ตำแหน่ง - แถวเดียวกันกับ คะแนน -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              บทบาท/ตำแหน่ง <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.role"
              type="text"
              required
              placeholder="เช่น ผู้ปกครองของน้องน้ำ, นักเรียนชั้น ม.3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              คะแนน <span class="text-red-500">*</span>
            </label>
            <select
              v-model.number="form.rating"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option :value="1">1 ดาว</option>
              <option :value="2">2 ดาว</option>
              <option :value="3">3 ดาว</option>
              <option :value="4">4 ดาว</option>
              <option :value="5">5 ดาว</option>
            </select>
          </div>

          <!-- สถานะ - แถวเดียวกันกับ ลำดับการแสดง -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              สถานะ
            </label>
            <select
              v-model="form.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="pending">รออนุมัติ</option>
              <option value="approved">อนุมัติแล้ว</option>
              <option value="rejected">ปฏิเสธ</option>
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

          <!-- รูปภาพ (Avatar) - แถวเดียวยาว -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              รูปภาพ (Avatar)
            </label>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <p class="text-sm font-semibold text-blue-900 mb-1">📐 ขนาดที่แนะนำ:</p>
              <ul class="text-xs text-blue-800 space-y-1 list-disc list-inside">
                <li><strong>ขนาด:</strong> 400 x 400 pixels</li>
                <li><strong>สัดส่วน:</strong> 1:1 (สี่เหลี่ยมจัตุรัส)</li>
                <li><strong>รูปแบบ:</strong> JPG, PNG, WebP</li>
                <li><strong>ขนาดไฟล์:</strong> ไม่เกิน 1 MB</li>
              </ul>
            </div>
            <div class="space-y-3">
              <div v-if="uploadingAvatar" class="text-sm text-gray-600 py-2">
                กำลังอัปโหลด...
              </div>
              <div v-else-if="form.avatar_url" class="space-y-3">
                <p class="text-sm text-gray-600">ตัวอย่าง:</p>
                <div class="w-32 h-32 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
                  <img
                    :src="form.avatar_url"
                    alt="Avatar preview"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  >
                </div>
                <button
                  type="button"
                  @click="form.avatar_url = ''"
                  class="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                >
                  ลบรูปภาพ
                </button>
              </div>
              <div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  @change="handleAvatarUpload"
                  class="hidden"
                >
                <button
                  type="button"
                  @click="() => avatarInput?.click()"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  อัปโหลดรูปภาพ Avatar
                </button>
                <p class="text-xs text-gray-500 mt-2 text-center">รองรับไฟล์: JPG, PNG, WebP (สูงสุด 1 MB)</p>
              </div>
            </div>
            <p v-if="uploadError" class="mt-2 text-sm text-red-600">{{ uploadError }}</p>
          </div>

          <!-- รีวิว - สุดท้าย -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              รีวิว <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.comment"
              rows="5"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>
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
interface Testimonial {
  id: number
  name: string
  role: string
  comment: string
  rating: number
  avatar_url?: string | null
  status: string
  display_order: number
}

const props = defineProps<{
  show: boolean
  testimonial?: Testimonial | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const loading = ref(false)
const uploadingAvatar = ref(false)
const avatarInput = ref<HTMLInputElement | null>(null)
const uploadError = ref('')

const form = reactive({
  name: '',
  role: '',
  comment: '',
  rating: 5,
  avatar_url: '',
  status: 'pending' as 'pending' | 'approved' | 'rejected',
  display_order: 0
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.testimonial) {
      form.name = props.testimonial.name || ''
      form.role = props.testimonial.role || ''
      form.comment = props.testimonial.comment || ''
      form.rating = props.testimonial.rating || 5
      form.avatar_url = props.testimonial.avatar_url || ''
      form.status = props.testimonial.status as 'pending' | 'approved' | 'rejected'
      form.display_order = props.testimonial.display_order || 0
    } else {
      resetForm()
    }
  }
})

const resetForm = () => {
  form.name = ''
  form.role = ''
  form.comment = ''
  form.rating = 5
  form.avatar_url = ''
  form.status = 'pending'
  form.display_order = 0
  uploadError.value = ''
}

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    uploadError.value = 'กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, WebP เท่านั้น)'
    return
  }
  
  // Validate file size (max 1MB for avatar)
  if (file.size > 1 * 1024 * 1024) {
    uploadError.value = 'ขนาดไฟล์ไม่ควรเกิน 1 MB'
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
    const recommendedRatio = 1 // 1:1 square
    const ratioTolerance = 0.1 // Allow 10% tolerance
    
    // Check aspect ratio (1:1 = 1.0)
    let aspectWarning = ''
    if (Math.abs(aspectRatio - recommendedRatio) > ratioTolerance) {
      aspectWarning = `สัดส่วนภาพไม่เหมาะสม (ปัจจุบัน ${width}x${height}) แนะนำ 400x400 pixels (1:1)`
      console.warn(`Image aspect ratio: ${aspectRatio.toFixed(2)}, recommended: ${recommendedRatio.toFixed(2)}`)
    }
    
    // Continue with upload even if aspect ratio is off (warning only)
    uploadingAvatar.value = true
    uploadError.value = ''
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // Get testimonial ID if editing
      const testimonialId = props.testimonial?.id
      
      const response = await $fetch<{ success: boolean; data: { url: string } }>(
        `${config.public.apiBase}/admin/upload?entityType=testimonials&fileType=avatar${testimonialId ? `&entityId=${testimonialId}` : ''}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          },
          body: formData
        }
      )
      
      if (response.success && response.data.url) {
        form.avatar_url = response.data.url
        // Show warning if aspect ratio was off
        if (aspectWarning) {
          uploadError.value = aspectWarning
        }
      }
    } catch (err: any) {
      console.error('Error uploading avatar:', err)
      uploadError.value = err.data?.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ'
    } finally {
      uploadingAvatar.value = false
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
    if (props.testimonial) {
      await $fetch(`${config.public.apiBase}/admin/testimonials/${props.testimonial.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: form
      })
    } else {
      await $fetch(`${config.public.apiBase}/admin/testimonials`, {
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
    console.error('Error saving testimonial:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกรีวิว')
  } finally {
    loading.value = false
  }
}
</script>

