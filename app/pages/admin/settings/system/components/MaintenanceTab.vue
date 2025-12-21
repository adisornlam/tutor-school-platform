<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">การตั้งค่า Maintenance Mode</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Maintenance Mode Toggle -->
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              เปิดใช้งาน Maintenance Mode
            </label>
            <p class="text-sm text-gray-500 mt-1">
              เมื่อเปิดใช้งาน ผู้ใช้ทั่วไปจะเห็นหน้า Maintenance แทนหน้าเว็บปกติ
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="form.maintenance_mode"
              type="checkbox"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        <!-- Maintenance Message -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ข้อความ Maintenance
          </label>
          <textarea
            v-model="form.maintenance_message"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="ระบบกำลังบำรุงรักษา กรุณาลองใหม่อีกครั้งในภายหลัง"
          ></textarea>
        </div>

        <!-- Allowed IPs -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            IP ที่สามารถเข้าถึงได้ระหว่าง Maintenance (คั่นด้วย comma)
          </label>
          <input
            v-model="allowedIPsString"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="127.0.0.1, 192.168.1.1"
          />
          <p class="mt-1 text-sm text-gray-500">
            IP ที่ระบุจะสามารถเข้าถึงระบบได้ปกติแม้จะเปิด Maintenance Mode
          </p>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end pt-4">
          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <span v-if="saving" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            บันทึก
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  settings: any[]
}>()

const emit = defineEmits<{
  saved: []
}>()

const { accessToken } = useAuth()

const saving = ref(false)

const form = reactive({
  maintenance_mode: false,
  maintenance_message: '',
  maintenance_allowed_ips: [] as string[]
})

const allowedIPsString = computed({
  get: () => form.maintenance_allowed_ips.join(', '),
  set: (value: string) => {
    form.maintenance_allowed_ips = value
      .split(',')
      .map(ip => ip.trim())
      .filter(ip => ip.length > 0)
  }
})

// Initialize form from settings
watch(() => props.settings, (newSettings) => {
  if (newSettings && newSettings.length > 0) {
    newSettings.forEach((setting: any) => {
      if (setting.key === 'maintenance_mode') {
        form.maintenance_mode = setting.value || false
      } else if (setting.key === 'maintenance_message') {
        form.maintenance_message = setting.value || ''
      } else if (setting.key === 'maintenance_allowed_ips') {
        form.maintenance_allowed_ips = Array.isArray(setting.value) 
          ? setting.value 
          : []
      }
    })
  }
}, { immediate: true })

const handleSubmit = async () => {
  try {
    saving.value = true

    const settingsToUpdate = [
      {
        key: 'maintenance_mode',
        value: form.maintenance_mode
      },
      {
        key: 'maintenance_message',
        value: form.maintenance_message
      },
      {
        key: 'maintenance_allowed_ips',
        value: form.maintenance_allowed_ips
      }
    ]

    await $fetch('/api/admin/settings/system', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: {
        settings: settingsToUpdate
      }
    })

    emit('saved')
  } catch (err: any) {
    console.error('Error saving maintenance settings:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกการตั้งค่า')
  } finally {
    saving.value = false
  }
}
</script>

