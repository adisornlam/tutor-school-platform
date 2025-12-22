<template>
  <div class="border-t p-4">
    <!-- File Preview (if uploading) -->
    <div v-if="previewFile" class="mb-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
      <div class="flex items-center space-x-3 flex-1 min-w-0">
        <img
          v-if="previewFile.type.startsWith('image/')"
          :src="previewFileUrl"
          alt="Preview"
          class="w-16 h-16 object-cover rounded"
        >
        <svg v-else class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ previewFile.name }}
          </p>
          <p class="text-xs text-gray-500">
            {{ formatFileSize(previewFile.size) }}
          </p>
        </div>
      </div>
      <button
        @click="clearPreview"
        class="ml-2 text-red-600 hover:text-red-700"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Input Area -->
    <div class="flex items-end space-x-2">
      <!-- File Upload Button -->
      <button
        @click="fileInput?.click()"
        class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        :disabled="uploading || sending"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      </button>

      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept="image/*,application/pdf,.doc,.docx,.xls,.xls,.txt"
        @change="handleFileSelect"
      >

      <!-- Text Input -->
      <div class="flex-1 relative">
        <textarea
          ref="textarea"
          v-model="messageText"
          :placeholder="placeholder"
          :disabled="uploading || sending"
          @keydown.enter.exact.prevent="handleSend"
          @keydown.shift.enter.exact.prevent="messageText += '\n'"
          @input="handleTyping"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          rows="1"
          style="max-height: 120px;"
        ></textarea>
      </div>

      <!-- Send Button -->
      <button
        @click="handleSend"
        :disabled="!canSend || uploading || sending"
        class="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg v-if="sending" class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  roomId: number
  placeholder?: string
  uploading?: boolean
  sending?: boolean
}>()

const emit = defineEmits<{
  'send-message': [data: { content: string; fileUrl?: string; fileName?: string; fileSize?: number; fileType?: string; messageType: 'text' | 'image' | 'file' }]
  'typing': []
}>()

const messageText = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const textarea = ref<HTMLTextAreaElement | null>(null)
const previewFile = ref<File | null>(null)
const previewFileUrl = ref<string>('')
const error = ref('')
const typingTimer = ref<NodeJS.Timeout | null>(null)
const lastSentMessage = ref<string>('')
const lastSentTime = ref<number>(0)

const canSend = computed(() => {
  return (messageText.value.trim().length > 0 || previewFile.value !== null) && !props.uploading && !props.sending
})

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  // Validate file size
  const maxSize = file.type.startsWith('image/') ? 5 * 1024 * 1024 : 10 * 1024 * 1024
  if (file.size > maxSize) {
    error.value = `ไฟล์ขนาดเกิน ${maxSize / (1024 * 1024)}MB`
    return
  }

  previewFile.value = file

  // Create preview URL for images
  if (file.type.startsWith('image/')) {
    previewFileUrl.value = URL.createObjectURL(file)
  }

  error.value = ''
}

const clearPreview = () => {
  if (previewFileUrl.value) {
    URL.revokeObjectURL(previewFileUrl.value)
  }
  previewFile.value = null
  previewFileUrl.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleTyping = () => {
  emit('typing')
  
  // Clear existing timer
  if (typingTimer.value) {
    clearTimeout(typingTimer.value)
  }

  // Auto-resize textarea
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = Math.min(textarea.value.scrollHeight, 120) + 'px'
  }
}

const handleSend = async () => {
  if (!canSend.value) return
  
  // Prevent duplicate sends within 1 second
  const now = Date.now()
  const messageToSend = messageText.value.trim() || (previewFile.value ? previewFile.value.name : '')
  if (lastSentMessage.value === messageToSend && (now - lastSentTime.value) < 1000) {
    console.log('[ChatInput] ⚠️ Duplicate send prevented')
    return
  }

  error.value = ''

  try {
    const messageType: 'text' | 'image' | 'file' = previewFile.value
      ? (previewFile.value.type.startsWith('image/') ? 'image' : 'file')
      : 'text'

    let fileUrl: string | undefined
    let fileName: string | undefined
    let fileSize: number | undefined
    let fileType: string | undefined

    // Upload file if exists
    if (previewFile.value) {
      const { uploadFile } = useChat()
      const uploadResult = await uploadFile(
        props.roomId,
        previewFile.value,
        messageType === 'image' ? 'image' : 'file'
      )
      fileUrl = uploadResult.url
      fileName = previewFile.value.name
      fileSize = uploadResult.size
      fileType = uploadResult.type
    }

    // Send message
    const contentToSend = messageText.value.trim() || (previewFile.value ? previewFile.value.name : '')
    emit('send-message', {
      content: contentToSend,
      fileUrl,
      fileName,
      fileSize,
      fileType,
      messageType
    })

    // Track last sent message to prevent duplicates
    lastSentMessage.value = contentToSend
    lastSentTime.value = Date.now()

    // Clear input
    messageText.value = ''
    clearPreview()
    
    // Reset textarea height
    if (textarea.value) {
      textarea.value.style.height = 'auto'
    }
  } catch (err: any) {
    error.value = err.message || 'เกิดข้อผิดพลาดในการส่งข้อความ'
    console.error('[ChatInput] Error sending message:', err)
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Cleanup
onUnmounted(() => {
  if (previewFileUrl.value) {
    URL.revokeObjectURL(previewFileUrl.value)
  }
  if (typingTimer.value) {
    clearTimeout(typingTimer.value)
  }
})
</script>

