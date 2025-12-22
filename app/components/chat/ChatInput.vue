<template>
  <div class="border-t p-4 bg-white relative">
    <!-- Reply Preview -->
    <div
      v-if="replyingTo"
      class="mb-3 p-3 bg-gray-50 rounded-lg border-l-4 border-l-green-600 flex items-start justify-between"
    >
      <div class="flex-1 min-w-0">
        <div class="text-xs text-gray-500 mb-1">
          ตอบกลับ {{ replyingTo.sender?.first_name }} {{ replyingTo.sender?.last_name }}
        </div>
        <div class="text-sm text-gray-700 truncate">
          {{ replyingTo.content || (replyingTo.file_name || 'ไฟล์') }}
        </div>
      </div>
      <button
        @click="$emit('cancel-reply')"
        class="ml-2 text-gray-500 hover:text-gray-700 flex-shrink-0"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

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
    <div class="flex items-center space-x-2">
      <!-- Emoji Picker Button -->
      <div class="relative" ref="emojiPickerContainer">
        <button
          @click.stop="showEmojiPicker = !showEmojiPicker"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors self-center"
          :disabled="uploading || sending"
          title="เพิ่ม emoji"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        
        <!-- Emoji Picker -->
        <Transition name="fade">
          <div
            v-if="showEmojiPicker"
            class="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-xl p-3 w-64 h-64 overflow-y-auto z-[100]"
            @click.stop
          >
            <div class="grid grid-cols-8 gap-1">
              <button
                v-for="emoji in commonEmojis"
                :key="emoji"
                @click="insertEmoji(emoji)"
                class="p-2 hover:bg-gray-100 rounded text-lg transition-colors"
                type="button"
              >
                {{ emoji }}
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- File Upload Button -->
      <button
        @click="fileInput?.click()"
        class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors self-center"
        :disabled="uploading || sending"
        title="แนบไฟล์"
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
          @keydown.enter.exact.prevent="handleSendAndFocus"
          @keydown.shift.enter.exact.prevent="messageText += '\n'"
          @input="handleTyping"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          rows="1"
          style="max-height: 120px; min-height: 40px;"
        ></textarea>
      </div>

      <!-- Send Button -->
      <button
        @click="handleSend"
        @mousedown.prevent
        :disabled="!canSend || uploading || sending"
        class="h-[44px] w-[44px] flex items-center justify-center bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
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
  replyingTo?: ChatMessage | null
}>()

const emit = defineEmits<{
  'send-message': [data: { content: string; fileUrl?: string; fileName?: string; fileSize?: number; fileType?: string; messageType: 'text' | 'image' | 'file'; replyToId?: number | null }]
  'typing': []
  'cancel-reply': []
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
const showEmojiPicker = ref(false)
const emojiPickerContainer = ref<HTMLDivElement | null>(null)

// Common emojis
const commonEmojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
  '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
  '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
  '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨',
  '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
  '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕',
  '🤢', '🤮', '🤧', '🥵', '🥶', '😶‍🌫️', '😵', '😵‍💫',
  '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟',
  '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦',
  '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖',
  '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡',
  '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡',
  '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸',
  '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👋',
  '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️',
  '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕',
  '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜',
  '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪',
  '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠',
  '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄',
  '💋', '🩸', '❤️', '🧡', '💛', '💚', '💙', '💜',
  '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓',
  '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️',
  '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐',
  '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎',
  '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑',
  '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺',
  '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴',
  '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️',
  '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯',
  '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵',
  '🚭', '❗', '❓', '❕', '❔', '‼️', '⁉️', '🔅',
  '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️',
  '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠',
  'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🈳',
  '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼',
  '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤',
  '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓',
  '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣',
  '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '▶️', '⏸️',
  '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫',
  '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️',
  '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️',
  '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵',
  '🎶', '➕', '➖', '➗', '✖️', '💲', '💱', '™️',
  '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛',
  '🔜', '🔝', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡',
  '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻',
  '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️',
  '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩',
  '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉',
  '🔊', '🔔', '🔕', '📣', '📢', '💬', '💭', '🗯️',
  '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄', '🕐',
  '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘',
  '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠',
  '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧'
]

const insertEmoji = (emoji: string) => {
  if (textarea.value) {
    const start = textarea.value.selectionStart
    const end = textarea.value.selectionEnd
    const text = messageText.value
    messageText.value = text.substring(0, start) + emoji + text.substring(end)
    
    // Set cursor position after emoji
    nextTick(() => {
      if (textarea.value) {
        textarea.value.selectionStart = textarea.value.selectionEnd = start + emoji.length
        textarea.value.focus()
      }
    })
  }
  showEmojiPicker.value = false
}

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

const handleSendAndFocus = async () => {
  await handleSend()
  // Focus will be handled inside handleSend
}

const handleSend = async () => {
  console.log('[ChatInput] 🎯 handleSend called:', {
    canSend: canSend.value,
    messageText: messageText.value,
    hasFile: !!previewFile.value,
    roomId: props.roomId
  })
  
  if (!canSend.value) {
    console.log('[ChatInput] ⚠️ Cannot send (canSend is false)')
    // Still focus back even if can't send
    setTimeout(() => {
      if (textarea.value) {
        textarea.value.focus()
      }
    }, 0)
    return
  }
  
  // Prevent duplicate sends within 1 second
  const now = Date.now()
  const messageToSend = messageText.value.trim() || (previewFile.value ? previewFile.value.name : '')
  if (lastSentMessage.value === messageToSend && (now - lastSentTime.value) < 1000) {
    console.log('[ChatInput] ⚠️ Duplicate send prevented')
    // Still focus back even if duplicate
    setTimeout(() => {
      if (textarea.value) {
        textarea.value.focus()
      }
    }, 0)
    return
  }

  error.value = ''
  console.log('[ChatInput] ✅ Proceeding with send...')

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
    console.log('[ChatInput] 📤 Emitting send-message event:', {
      content: contentToSend,
      fileUrl,
      fileName,
      fileSize,
      fileType,
      messageType,
      roomId: props.roomId
    })
    
    emit('send-message', {
      content: contentToSend,
      fileUrl,
      fileName,
      fileSize,
      fileType,
      messageType,
      replyToId: props.replyingTo?.id || null
    })
    
    // Clear reply after sending
    if (props.replyingTo) {
      emit('cancel-reply')
    }
    
    console.log('[ChatInput] ✅ send-message event emitted')

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
    
    // Focus back to textarea after sending
    // Use setTimeout to ensure focus happens after DOM updates
    setTimeout(() => {
      if (textarea.value) {
        textarea.value.focus()
        console.log('[ChatInput] ✅ Focused back to textarea')
      }
    }, 0)
  } catch (err: any) {
    error.value = err.message || 'เกิดข้อผิดพลาดในการส่งข้อความ'
    console.error('[ChatInput] Error sending message:', err)
    
    // Focus back to textarea even on error
    setTimeout(() => {
      if (textarea.value) {
        textarea.value.focus()
        console.log('[ChatInput] ✅ Focused back to textarea (error case)')
      }
    }, 0)
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Close emoji picker when clicking outside
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element
    if (showEmojiPicker.value && emojiPickerContainer.value && !emojiPickerContainer.value.contains(target)) {
      showEmojiPicker.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})

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

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

