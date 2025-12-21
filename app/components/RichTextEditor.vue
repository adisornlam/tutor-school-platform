<template>
  <div class="rich-text-editor">
    <div v-if="editor" class="border border-gray-300 rounded-lg overflow-hidden">
      <!-- Toolbar -->
      <div class="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          @click="editor.chain().focus().toggleBold().run()"
          :class="[
            'p-2 rounded hover:bg-gray-200',
            editor.isActive('bold') ? 'bg-gray-300' : ''
          ]"
          title="Bold"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
          </svg>
        </button>
        
        <button
          type="button"
          @click="editor.chain().focus().toggleItalic().run()"
          :class="[
            'p-2 rounded hover:bg-gray-200',
            editor.isActive('italic') ? 'bg-gray-300' : ''
          ]"
          title="Italic"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
        
        <!-- Underline button - uncomment if Underline extension is installed -->
        <!--
        <button
          type="button"
          @click="editor.chain().focus().toggleUnderline().run()"
          :class="[
            'p-2 rounded hover:bg-gray-200',
            editor.isActive('underline') ? 'bg-gray-300' : ''
          ]"
          title="Underline"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
          </svg>
        </button>
        -->
        
        <div class="w-px h-6 bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="[
            'p-2 rounded hover:bg-gray-200',
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''
          ]"
          title="Heading 1"
        >
          H1
        </button>
        
        <button
          type="button"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="[
            'p-2 rounded hover:bg-gray-200',
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
          ]"
          title="Heading 2"
        >
          H2
        </button>
        
        <button
          type="button"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="[
            'p-2 rounded hover:bg-gray-200',
            editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''
          ]"
          title="Heading 3"
        >
          H3
        </button>
        
        <div class="w-px h-6 bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="[
            'p-2 rounded hover:bg-gray-200',
            editor.isActive('bulletList') ? 'bg-gray-300' : ''
          ]"
          title="Bullet List"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h13M8 12h13m-13 6h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        </button>
        
        <button
          type="button"
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="[
            'p-2 rounded hover:bg-gray-200',
            editor.isActive('orderedList') ? 'bg-gray-300' : ''
          ]"
          title="Numbered List"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        </button>
        
        <div class="w-px h-6 bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          @click="showImageDialog = true"
          class="p-2 rounded hover:bg-gray-200"
          title="Insert Image"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        
        <button
          type="button"
          @click="showLinkDialog = true"
          :class="[
            'p-2 rounded hover:bg-gray-200',
            editor.isActive('link') ? 'bg-gray-300' : ''
          ]"
          title="Insert Link"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
      </div>
      
      <!-- Editor Content -->
      <EditorContent :editor="editor" class="prose max-w-none min-h-[300px] p-4 focus:outline-none" />
    </div>
    
    <!-- Image Dialog -->
    <div v-if="showImageDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showImageDialog = false">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" @click.stop>
        <h3 class="text-lg font-semibold mb-4">แทรกรูปภาพ</h3>
        <div class="space-y-4">
          <!-- File Upload Option -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">อัปโหลดรูปภาพ</label>
            <input
              ref="imageFileInput"
              type="file"
              accept="image/*"
              @change="handleImageFileSelect"
              class="hidden"
            >
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer" @click="imageFileInput?.click()">
              <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p class="text-sm text-gray-600 mb-1">
                <span class="text-green-600 font-medium">คลิกเพื่อเลือกไฟล์</span> หรือลากวางไฟล์ที่นี่
              </p>
              <p class="text-xs text-gray-500">รองรับ: JPG, PNG, GIF, WebP (สูงสุด 5MB)</p>
              <div v-if="uploadingImage" class="mt-2">
                <div class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                <p class="text-xs text-gray-600 mt-1">กำลังอัปโหลด...</p>
              </div>
            </div>
          </div>
          
          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">หรือ</span>
            </div>
          </div>
          
          <!-- URL Option -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ใส่ URL รูปภาพ</label>
            <input
              v-model="imageUrl"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://example.com/image.jpg"
              @keyup.enter="insertImageFromUrl"
            >
          </div>
          
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="showImageDialog = false"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              @click="insertImageFromUrl"
              :disabled="!imageUrl || uploadingImage"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              แทรกจาก URL
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Link Dialog -->
    <div v-if="showLinkDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showLinkDialog = false">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" @click.stop>
        <h3 class="text-lg font-semibold mb-4">แทรกลิงก์</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">URL</label>
            <input
              v-model="linkUrl"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://example.com"
              @keyup.enter="insertLink"
            >
          </div>
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="showLinkDialog = false"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              @click="insertLink"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              แทรก
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
// Underline extension - not installed, commented out
// import Underline from '@tiptap/extension-underline'

const props = defineProps<{
  modelValue: string
  entityType?: string // 'courses', 'articles', 'testimonials', 'users'
  entityId?: number | null // Entity ID for organizing files
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const showImageDialog = ref(false)
const showLinkDialog = ref(false)
const imageUrl = ref('')
const linkUrl = ref('')
const uploadingImage = ref(false)
const imageFileInput = ref<HTMLInputElement | null>(null)

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3]
      }
    }),
    Image.configure({
      inline: true,
      allowBase64: true
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph']
    })
    // Note: Underline extension - uncomment if package is installed
    // Underline
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

watch(() => props.modelValue, (value) => {
  const isSame = editor.value?.getHTML() === value
  if (!isSame) {
    editor.value?.commands.setContent(value || '')
  }
})

const handleImageFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('กรุณาเลือกรูปภาพเท่านั้น')
    return
  }
  
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('ขนาดไฟล์เกิน 5MB')
    return
  }
  
  uploadingImage.value = true
  
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    // Build query string for upload API
    const queryParams = new URLSearchParams()
    if (props.entityType) {
      queryParams.append('entityType', props.entityType)
    }
    if (props.entityId) {
      queryParams.append('entityId', props.entityId.toString())
    }
    queryParams.append('fileType', 'content')
    
    const uploadUrl = `${config.public.apiBase}/admin/upload?${queryParams.toString()}`
    
    const response = await $fetch<{ success: boolean; data: { url: string } }>(
      uploadUrl,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: formData
      }
    )
    
    if (response.success && response.data.url) {
      // Insert image into editor
      editor.value?.chain().focus().setImage({ src: response.data.url }).run()
      showImageDialog.value = false
    }
  } catch (err: any) {
    console.error('Error uploading image:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ')
  } finally {
    uploadingImage.value = false
    // Reset input
    if (target) {
      target.value = ''
    }
  }
}

const insertImageFromUrl = () => {
  if (imageUrl.value) {
    editor.value?.chain().focus().setImage({ src: imageUrl.value }).run()
    imageUrl.value = ''
    showImageDialog.value = false
  }
}

const insertLink = () => {
  if (linkUrl.value) {
    editor.value?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl.value }).run()
    linkUrl.value = ''
    showLinkDialog.value = false
  }
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
.rich-text-editor .ProseMirror {
  outline: none;
  min-height: 300px;
}

.rich-text-editor .ProseMirror p {
  margin-bottom: 1rem;
}

.rich-text-editor .ProseMirror img {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
  border-radius: 0.5rem;
}

.rich-text-editor .ProseMirror h1 {
  font-size: 2em;
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.rich-text-editor .ProseMirror h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.rich-text-editor .ProseMirror h3 {
  font-size: 1.25em;
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.rich-text-editor .ProseMirror ul,
.rich-text-editor .ProseMirror ol {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.rich-text-editor .ProseMirror ul {
  list-style-type: disc;
}

.rich-text-editor .ProseMirror ol {
  list-style-type: decimal;
}

.rich-text-editor .ProseMirror a {
  color: #059669;
  text-decoration: underline;
}

.rich-text-editor .ProseMirror a:hover {
  color: #047857;
}
</style>

