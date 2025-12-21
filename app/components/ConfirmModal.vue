<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[10000] flex items-center justify-center p-4"
        @click.self="handleCancel"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="handleCancel"></div>

        <!-- Modal -->
        <div
          class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-10"
          @click.stop
        >
          <!-- Icon -->
          <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full"
            :class="iconBgClass">
            <component
              :is="iconComponent"
              class="w-6 h-6"
              :class="iconClass"
            />
          </div>

          <!-- Title -->
          <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">
            {{ title }}
          </h3>

          <!-- Message -->
          <p class="text-sm text-gray-600 text-center mb-6 whitespace-pre-line">
            {{ message }}
          </p>

          <!-- Input (if needed) -->
          <div v-if="showInput" class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ inputLabel }}
            </label>
            <input
              v-model="inputValue"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              :placeholder="inputPlaceholder"
              @keyup.enter="handleConfirm"
            />
          </div>

          <!-- Buttons -->
          <div class="flex gap-3">
            <button
              @click="handleCancel"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              class="flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
              :class="confirmButtonClass"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { 
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'
import type { ConfirmOptions } from '~/composables/useConfirm'

const props = withDefaults(defineProps<{
  isOpen: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  showInput?: boolean
  inputLabel?: string
  inputPlaceholder?: string
}>(), {
  title: 'ยืนยันการดำเนินการ',
  confirmText: 'ยืนยัน',
  cancelText: 'ยกเลิก',
  type: 'info',
  showInput: false,
  inputLabel: '',
  inputPlaceholder: ''
})

const emit = defineEmits<{
  confirm: [value?: string]
  cancel: []
}>()

const inputValue = ref('')

const iconComponent = computed(() => {
  const icons = {
    danger: ExclamationCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  }
  return icons[props.type]
})

const iconBgClass = computed(() => {
  const classes = {
    danger: 'bg-red-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100'
  }
  return classes[props.type]
})

const iconClass = computed(() => {
  const classes = {
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  }
  return classes[props.type]
})

const confirmButtonClass = computed(() => {
  const classes = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  }
  return classes[props.type]
})

const handleConfirm = () => {
  if (props.showInput) {
    emit('confirm', inputValue.value)
  } else {
    emit('confirm')
  }
  inputValue.value = ''
}

const handleCancel = () => {
  emit('cancel')
  inputValue.value = ''
}

watch(() => props.isOpen, (newVal) => {
  if (newVal && props.showInput) {
    inputValue.value = ''
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>

