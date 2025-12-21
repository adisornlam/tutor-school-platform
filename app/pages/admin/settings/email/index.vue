<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold">จัดการอีเมล</h1>
      <p class="mt-2 text-gray-600">ตั้งค่าการส่งอีเมลและจัดการเทมเพลตอีเมล</p>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-4 mb-6 border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-4 py-2 font-semibold transition-colors relative"
        :class="activeTab === tab.id 
          ? 'text-green-600 border-b-2 border-green-600' 
          : 'text-gray-600 hover:text-green-600'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div>
      <!-- SMTP Settings Tab -->
      <SMTPTab v-if="activeTab === 'smtp'" />

      <!-- Templates Tab -->
      <TemplatesTab v-if="activeTab === 'templates'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SMTPTab from './components/SMTPTab.vue'
import TemplatesTab from './components/TemplatesTab.vue'

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const activeTab = ref('smtp')

const tabs = [
  { id: 'smtp', label: 'ตั้งค่า SMTP' },
  { id: 'templates', label: 'Template' }
]
</script>

