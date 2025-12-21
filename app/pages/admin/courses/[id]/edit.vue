<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <button
          @click="$router.back()"
          class="p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-3xl font-bold">แก้ไขคอร์ส</h1>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      <p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
    </div>

    <template v-else>
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ชื่อคอร์ส <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="กรุณากรอกชื่อคอร์ส"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            รหัสคอร์ส
          </label>
          <input
            v-model="form.code"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="เช่น COURSE001"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ประเภท <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.type"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">เลือกประเภท</option>
            <option value="live_online">Live Online</option>
            <option value="vod">VOD</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ราคา (บาท) <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="form.price"
            type="number"
            step="0.01"
            min="0"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="0.00"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ระยะเวลา (ชั่วโมง)
          </label>
          <input
            v-model.number="form.duration_hours"
            type="number"
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="0"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ระดับ
          </label>
          <select
            v-model="form.level"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">เลือกระดับ</option>
            <option value="beginner">เริ่มต้น</option>
            <option value="intermediate">กลาง</option>
            <option value="advanced">สูง</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            สถานะ <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.status"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="draft">ร่าง</option>
            <option value="published">เผยแพร่</option>
            <option value="archived">เก็บถาวร</option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            สาขา <span class="text-red-500">*</span>
          </label>
          <div v-if="loadingBranches" class="text-sm text-gray-500 py-2">
            กำลังโหลดรายการสาขา...
          </div>
          <div v-else-if="availableBranches.length === 0" class="text-sm text-yellow-600 py-2 bg-yellow-50 border border-yellow-200 rounded p-2">
            ⚠️ ไม่พบสาขา กรุณาสร้างสาขาก่อนแก้ไขคอร์ส
          </div>
          <div v-else class="space-y-2 border border-gray-300 rounded-lg p-3">
            <div v-for="branch in availableBranches" :key="branch.id" class="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
              <label class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  :value="branch.id"
                  v-model="form.selectedBranches"
                  @change="updateBranchSeatLimit(branch.id, form.selectedBranches.includes(branch.id))"
                  class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                >
                <div class="flex-1">
                  <span class="text-sm font-medium text-gray-700">{{ branch.name }}</span>
                  <span v-if="branch.code" class="text-xs text-gray-500 ml-1">({{ branch.code }})</span>
                </div>
              </label>
              <div v-if="form.selectedBranches.includes(branch.id)" class="mt-2 ml-6">
                <label class="block text-xs font-medium text-gray-600 mb-1">
                  จำนวนที่เปิดรับ (ที่นั่ง)
                </label>
                <input
                  type="number"
                  :value="getBranchSeatLimit(branch.id)"
                  @input="setBranchSeatLimit(branch.id, $event)"
                  min="1"
                  class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="ไม่จำกัด (เว้นว่าง)"
                >
                <p class="text-xs text-gray-500 mt-1">เว้นว่างหากไม่จำกัดจำนวนที่นั่ง</p>
              </div>
            </div>
          </div>
          <p v-if="form.selectedBranches.length === 0 && !loadingBranches && availableBranches.length > 0" class="text-xs text-red-500 mt-1">
            กรุณาเลือกอย่างน้อย 1 สาขา
          </p>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            รูปภาพปก <span class="text-red-500">*</span>
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
            <div v-else-if="form.thumbnail_url" class="space-y-3">
              <p class="text-sm text-gray-600">ตัวอย่าง (สัดส่วน 16:9):</p>
              <div class="aspect-video bg-gray-200 rounded-lg overflow-hidden max-w-2xl">
                <img
                  :src="form.thumbnail_url"
                  alt="Thumbnail preview"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                >
              </div>
              <button
                type="button"
                @click="form.thumbnail_url = ''"
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
                @click="thumbnailInput?.click()"
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
          <p v-if="submitError && (submitError.includes('รูป') || submitError.includes('สัดส่วน'))" class="mt-2 text-sm text-red-600">{{ submitError }}</p>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            คำอธิบาย
          </label>
          <RichTextEditor
            v-model="form.description"
            entity-type="courses"
            :entity-id="courseId"
            class="w-full"
          />
        </div>
      </div>

      <div v-if="submitError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {{ submitError }}
      </div>

      <div class="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          @click="$router.back()"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="submitting">กำลังบันทึก...</span>
          <span v-else>บันทึก</span>
        </button>
      </div>
    </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import RichTextEditor from '~/components/RichTextEditor.vue'

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { accessToken } = useAuth()

const courseId = computed(() => parseInt(route.params.id as string))
const loading = ref(true)
const error = ref('')
const submitting = ref(false)
const submitError = ref('')

interface Branch {
  id: number
  name: string
  code: string
  address?: string | null
  phone?: string | null
  email?: string | null
  status: string
}

const form = reactive({
  title: '',
  description: '',
  thumbnail_url: '',
  type: '' as 'live_online' | 'vod' | 'hybrid' | '',
  price: 0,
  duration_hours: null as number | null,
  level: '' as 'beginner' | 'intermediate' | 'advanced' | '',
  status: 'draft' as 'draft' | 'published' | 'archived',
  code: '',
  selectedBranches: [] as number[]
})

const uploadingThumbnail = ref(false)
const thumbnailInput = ref<HTMLInputElement | null>(null)

const availableBranches = ref<Branch[]>([])
const loadingBranches = ref(false)
const branchSeatLimits = ref<Record<number, number | null>>({})

const loadBranches = async () => {
  loadingBranches.value = true
  try {
    const response = await $fetch<{ success: boolean; data: Branch[] }>(
      `${config.public.apiBase}/admin/branches`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      }
    )
    if (response.success) {
      availableBranches.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading branches:', err)
  } finally {
    loadingBranches.value = false
  }
}

const loadCourse = async () => {
  if (!courseId.value || isNaN(courseId.value)) {
    error.value = 'รหัสคอร์สไม่ถูกต้อง'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await $fetch<{
      success: boolean
      data: {
        course: any
        branches?: Array<{
          branch_id: number
          branch_name: string
          branch_code: string
        }>
      }
    }>(`${config.public.apiBase}/admin/courses/${courseId.value}`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    if (response.success && response.data.course) {
      const course = response.data.course
      form.title = course.title || ''
      form.description = course.description || ''
      form.thumbnail_url = course.thumbnail_url || ''
      form.type = course.type || ''
      form.price = course.price || 0
      form.duration_hours = course.duration_hours || null
      form.level = course.level || ''
      form.status = course.status || 'draft'
      form.code = course.code || ''
      
      // Set selected branches
      if (response.data.branches && response.data.branches.length > 0) {
        form.selectedBranches = response.data.branches.map(b => b.branch_id)
        // Set seat limits from course data
        response.data.branches.forEach((b: any) => {
          if (b.seat_limit !== null && b.seat_limit !== undefined) {
            branchSeatLimits.value[b.branch_id] = b.seat_limit
          }
        })
      } else {
        form.selectedBranches = []
      }
    } else {
      error.value = 'ไม่พบข้อมูลคอร์ส'
    }
  } catch (err: any) {
    console.error('Error loading course:', err)
    console.error('Error details:', {
      status: err.status,
      statusCode: err.statusCode,
      data: err.data,
      message: err.message
    })
    error.value = err.data?.message || err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  // Validate branches
  if (form.selectedBranches.length === 0) {
    submitError.value = 'กรุณาเลือกอย่างน้อย 1 สาขา'
    return
  }

  submitting.value = true
  submitError.value = ''

  try {
    const body: any = {
      title: form.title,
      description: form.description || null,
      type: form.type,
      price: form.price,
      duration_hours: form.duration_hours || null,
      level: form.level || null,
      status: form.status,
      branches: form.selectedBranches.map(branchId => ({
        branch_id: branchId,
        seat_limit: branchSeatLimits.value[branchId] ?? null,
        is_available: true
      }))
    }

    if (form.code) {
      body.code = form.code
    }

    if (form.thumbnail_url) {
      body.thumbnail_url = form.thumbnail_url
    }


    await $fetch(`${config.public.apiBase}/admin/courses/${courseId.value}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body
    })

    // Redirect to course detail page
    await router.push(`/admin/courses/${courseId.value}`)
  } catch (err: any) {
    console.error('Error updating course:', err)
    submitError.value = err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  } finally {
    submitting.value = false
  }
}

// Helper functions for seat limits
const getBranchSeatLimit = (branchId: number): number | string => {
  return branchSeatLimits.value[branchId] ?? ''
}

const setBranchSeatLimit = (branchId: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.trim()
  if (value === '') {
    branchSeatLimits.value[branchId] = null
  } else {
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue > 0) {
      branchSeatLimits.value[branchId] = numValue
    }
  }
}

const updateBranchSeatLimit = (branchId: number, isSelected: boolean) => {
  if (!isSelected) {
    // Remove seat limit when branch is unselected
    delete branchSeatLimits.value[branchId]
  } else {
    // Initialize with null when branch is selected
    if (!(branchId in branchSeatLimits.value)) {
      branchSeatLimits.value[branchId] = null
    }
  }
}

const handleThumbnailUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    submitError.value = 'กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, WebP เท่านั้น)'
    return
  }
  
  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    submitError.value = 'ขนาดไฟล์ไม่ควรเกิน 2 MB (แนะนำ < 500 KB)'
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
    submitError.value = ''
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // Get course ID for organizing files
      const id = courseId.value
      
      const response = await $fetch<{ success: boolean; data: { url: string } }>(
        `${config.public.apiBase}/admin/upload?entityType=courses&fileType=thumbnail${id ? `&entityId=${id}` : ''}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          },
          body: formData
        }
      )
      
      if (response.success && response.data.url) {
        form.thumbnail_url = response.data.url
        // Show warning if aspect ratio was off
        if (aspectWarning) {
          submitError.value = aspectWarning
        }
      }
    } catch (err: any) {
      console.error('Error uploading thumbnail:', err)
      submitError.value = err.data?.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ'
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
    submitError.value = 'ไม่สามารถอ่านไฟล์รูปภาพได้'
  }
  
  img.src = imgUrl
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

onMounted(() => {
  loadBranches()
  loadCourse()
})
</script>

