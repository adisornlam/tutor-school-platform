<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold">ตั้งค่าระบบ</h1>
      <p class="mt-2 text-gray-600">จัดการการตั้งค่าระบบต่างๆ</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">กำลังโหลด...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-600 mr-2" />
        <p class="text-red-800">{{ error }}</p>
      </div>
    </div>

    <!-- Settings Content -->
    <div v-else>
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
        <!-- General Settings Tab -->
        <GeneralTab 
          v-if="activeTab === 'general'" 
          :settings="settings.general || []"
          @saved="handleSaved"
        />

        <!-- Timezone Settings Tab -->
        <TimezoneTab 
          v-if="activeTab === 'timezone'" 
          :settings="settings.timezone || []"
          @saved="handleSaved"
        />

        <!-- Maintenance Settings Tab -->
        <MaintenanceTab 
          v-if="activeTab === 'maintenance'" 
          :settings="settings.maintenance || []"
          @saved="handleSaved"
        />

        <!-- Security Settings Tab -->
        <SecurityTab 
          v-if="activeTab === 'security'" 
          :settings="settings.security || []"
          @saved="handleSaved"
        />

        <!-- File Upload Settings Tab -->
        <FileUploadTab 
          v-if="activeTab === 'file_upload'" 
          :settings="settings.file_upload || []"
          @saved="handleSaved"
        />

        <!-- Notification Settings Tab -->
        <NotificationTab 
          v-if="activeTab === 'notification'" 
          :settings="settings.notification || []"
          @saved="handleSaved"
        />

        <!-- Language Settings Tab -->
        <LanguageTab 
          v-if="activeTab === 'language'" 
          :settings="settings.language || []"
          @saved="handleSaved"
        />

        <!-- Display Settings Tab -->
        <DisplayTab 
          v-if="activeTab === 'display'" 
          :settings="settings.display || []"
          @saved="handleSaved"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import GeneralTab from './components/GeneralTab.vue'
import TimezoneTab from './components/TimezoneTab.vue'
import MaintenanceTab from './components/MaintenanceTab.vue'
import SecurityTab from './components/SecurityTab.vue'
import FileUploadTab from './components/FileUploadTab.vue'
import NotificationTab from './components/NotificationTab.vue'
import LanguageTab from './components/LanguageTab.vue'
import DisplayTab from './components/DisplayTab.vue'

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const activeTab = ref('general')
const loading = ref(true)
const error = ref<string | null>(null)
const settings = ref<Record<string, any[]>>({})

const tabs = [
  { id: 'general', label: 'ข้อมูลทั่วไป' },
  { id: 'timezone', label: 'เวลาและวันที่' },
  { id: 'maintenance', label: 'บำรุงรักษา' },
  { id: 'security', label: 'ความปลอดภัย' },
  { id: 'file_upload', label: 'การอัพโหลดไฟล์' },
  { id: 'notification', label: 'การแจ้งเตือน' },
  { id: 'language', label: 'ภาษา' },
  { id: 'display', label: 'การแสดงผล' }
]

const loadSettings = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await $fetch<{ success: boolean; data: Record<string, any[]> }>(
      '/api/admin/settings/system',
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      }
    )

    if (response.success) {
      settings.value = response.data
    } else {
      error.value = 'ไม่สามารถโหลดการตั้งค่าได้'
    }
  } catch (err: any) {
    console.error('Error loading system settings:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดการตั้งค่า'
  } finally {
    loading.value = false
  }
}

const handleSaved = () => {
  // Reload settings after save
  loadSettings()
}

onMounted(() => {
  loadSettings()
})
</script>

