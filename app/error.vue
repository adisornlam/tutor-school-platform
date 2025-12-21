<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="text-center max-w-md mx-4">
      <h1 class="text-6xl font-bold mb-4 text-gray-800">{{ error.statusCode }}</h1>
      <h2 class="text-2xl font-semibold mb-2 text-gray-700">{{ getErrorTitle() }}</h2>
      <p class="text-gray-600 mb-8">{{ getErrorMessage() }}</p>
      <div class="flex gap-3 justify-center">
        <button 
          @click="goBack"
          class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          กลับ
        </button>
        <button 
          @click="goHome"
          class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          กลับหน้าหลัก
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
    data?: any
  }
}>()

const route = useRoute()
const router = useRouter()

const getErrorTitle = () => {
  const titles: Record<number, string> = {
    404: 'ไม่พบหน้า',
    403: 'ไม่มีสิทธิ์เข้าถึง',
    401: 'ต้องเข้าสู่ระบบ',
    500: 'เกิดข้อผิดพลาด'
  }
  return titles[props.error.statusCode] || 'เกิดข้อผิดพลาด'
}

const getErrorMessage = () => {
  // Get message from various sources
  const message = props.error.message || 
                  props.error.statusMessage || 
                  props.error.data?.message ||
                  'เกิดข้อผิดพลาดในการโหลดหน้า'
  
  // Clean up any URL encoding issues
  return message.replace(/\/admin\/cour\s+e/g, '/admin/courses')
}

const goBack = () => {
  if (process.client && window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const goHome = () => {
  clearError({ redirect: '/' })
}
</script>

