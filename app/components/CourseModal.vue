<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">
          {{ course ? 'แก้ไขคอร์ส' : 'เพิ่มคอร์ส' }}
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
            <div v-else-if="branchError" class="text-sm text-red-500 py-2 bg-red-50 border border-red-200 rounded p-2">
              {{ branchError }}
            </div>
            <div v-else-if="availableBranches.length === 0" class="text-sm text-yellow-600 py-2 bg-yellow-50 border border-yellow-200 rounded p-2">
              ⚠️ ไม่พบสาขา กรุณาสร้างสาขาก่อนสร้างคอร์ส
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
            รูปภาพปก
          </label>
          <div class="space-y-2">
            <div v-if="uploadingThumbnail" class="text-sm text-gray-600 py-2">
              กำลังอัปโหลด...
            </div>
            <div v-else-if="form.thumbnail_url" class="flex items-start space-x-4">
              <img
                :src="form.thumbnail_url"
                alt="Thumbnail preview"
                class="w-32 h-32 object-cover rounded-lg border border-gray-300"
                @error="handleImageError"
              >
              <div class="flex-1">
                <button
                  type="button"
                  @click="form.thumbnail_url = ''"
                  class="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                >
                  ลบรูปภาพ
                </button>
              </div>
            </div>
            <div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                ref="thumbnailInput"
                type="file"
                accept="image/*"
                @change="handleThumbnailUpload"
                class="hidden"
              >
              <button
                type="button"
                @click="$refs.thumbnailInput?.click()"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                อัปโหลดรูปภาพปก
              </button>
              <p class="text-xs text-gray-500 mt-2 text-center">รองรับไฟล์: JPG, PNG, GIF, WebP (สูงสุด 5MB)</p>
            </div>
          </div>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            คำอธิบาย
          </label>
          <RichTextEditor
            v-model="form.description"
            class="w-full"
          />
        </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">กำลังบันทึก...</span>
            <span v-else>บันทึก</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import RichTextEditor from './RichTextEditor.vue'
interface Course {
  id: number
  title: string
  description?: string | null
  type: 'live_online' | 'vod' | 'hybrid'
  price: number
  duration_hours?: number | null
  level?: 'beginner' | 'intermediate' | 'advanced' | null
  status: 'draft' | 'published' | 'archived'
  code?: string | null
  branches?: Array<{
    branch_id: number
    branch_name: string
    branch_code: string
  }>
}

interface Branch {
  id: number
  name: string
  code: string
  address?: string | null
  phone?: string | null
  email?: string | null
  status: string
}

interface Props {
  show: boolean
  course?: Course | null
}

const props = withDefaults(defineProps<Props>(), {
  course: null
})

const emit = defineEmits<{
  close: []
  saved: []
}>()

const config = useRuntimeConfig()
const { accessToken } = useAuth()

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

const loading = ref(false)
const loadingBranches = ref(false)
const error = ref('')
const branchError = ref('')
const availableBranches = ref<Branch[]>([])
const branchSeatLimits = ref<Record<number, number | null>>({})
const uploadingThumbnail = ref(false)
const thumbnailInput = ref<HTMLInputElement | null>(null)

// Load available branches
const loadBranches = async () => {
  loadingBranches.value = true
  branchError.value = ''
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
      availableBranches.value = response.data || []
      console.log('[CourseModal] Loaded branches:', availableBranches.value.length)
      if (availableBranches.value.length === 0) {
        branchError.value = 'ไม่พบสาขาในระบบ กรุณาสร้างสาขาก่อนสร้างคอร์ส'
      }
    } else {
      branchError.value = 'ไม่สามารถโหลดรายการสาขาได้'
    }
  } catch (err: any) {
    console.error('[CourseModal] Error loading branches:', err)
    branchError.value = err.data?.message || err.message || 'เกิดข้อผิดพลาดในการโหลดรายการสาขา'
  } finally {
    loadingBranches.value = false
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
  if (!file.type.startsWith('image/')) {
    error.value = 'กรุณาเลือกรูปภาพเท่านั้น'
    return
  }
  
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'ขนาดไฟล์เกิน 5MB'
    return
  }
  
  uploadingThumbnail.value = true
  error.value = ''
  
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await $fetch<{ success: boolean; data: { url: string } }>(
      `${config.public.apiBase}/admin/upload`,
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
    }
  } catch (err: any) {
    console.error('Error uploading thumbnail:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ'
  } finally {
    uploadingThumbnail.value = false
    // Reset input
    if (target) {
      target.value = ''
    }
  }
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

// Initialize form when course prop changes
watch(() => props.course, (course) => {
  if (course) {
    form.title = course.title
    form.description = course.description || ''
    form.type = course.type
    form.price = course.price
    form.duration_hours = course.duration_hours || null
    form.level = course.level || ''
    form.status = course.status
    form.code = course.code || ''
    form.thumbnail_url = course.thumbnail_url || ''
    // Set selected branches from course data
    if (course.branches && course.branches.length > 0) {
      form.selectedBranches = course.branches.map(b => b.branch_id)
      // Set seat limits from course data
      course.branches.forEach((b: any) => {
        if (b.seat_limit !== null && b.seat_limit !== undefined) {
          branchSeatLimits.value[b.branch_id] = b.seat_limit
        }
      })
    } else {
      form.selectedBranches = []
    }
  } else {
    // Reset form for new course
    form.title = ''
    form.description = ''
    form.type = ''
    form.price = 0
    form.duration_hours = null
    form.level = ''
    form.status = 'draft'
    form.code = ''
    form.thumbnail_url = ''
    form.selectedBranches = []
    branchSeatLimits.value = {}
  }
  error.value = ''
  branchError.value = ''
}, { immediate: true })

// Load branches when modal opens
watch(() => props.show, (show) => {
  if (show) {
    loadBranches()
    // Reset branch seat limits for new course
    if (!props.course) {
      branchSeatLimits.value = {}
    }
  }
}, { immediate: true })

// Also load branches on mount
onMounted(() => {
  if (props.show) {
    loadBranches()
  }
})

const handleSubmit = async () => {
  // Validate branches
  if (form.selectedBranches.length === 0) {
    error.value = 'กรุณาเลือกอย่างน้อย 1 สาขา'
    return
  }

  loading.value = true
  error.value = ''

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

    if (props.course) {
      // Update course
      await $fetch(`${config.public.apiBase}/admin/courses/${props.course.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body
      })
    } else {
      // Create course
      await $fetch(`${config.public.apiBase}/admin/courses`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body
      })
    }

    emit('saved')
  } catch (err: any) {
    console.error('Error saving course:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  } finally {
    loading.value = false
  }
}
</script>

