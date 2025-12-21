<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[10001] flex items-center justify-center p-4"
        @click.self="handleClose"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="handleClose"></div>

        <!-- Modal -->
        <div
          class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-10"
          @click.stop
        >
          <!-- Icon -->
          <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-yellow-100">
            <ExclamationTriangleIcon class="w-6 h-6 text-yellow-600" />
          </div>

          <!-- Title -->
          <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">
            เซสชันหมดอายุ
          </h3>

          <!-- Message -->
          <p class="text-sm text-gray-600 text-center mb-6 whitespace-pre-line">
            {{ message }}
          </p>

          <!-- Buttons -->
          <div class="flex gap-3">
            <button
              @click="handleClose"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ปิด
            </button>
            <button
              @click="handleLogin"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

interface Props {
  isOpen: boolean
  message: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  login: []
}>()

const handleClose = () => {
  emit('close')
}

const handleLogin = () => {
  emit('login')
}
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

