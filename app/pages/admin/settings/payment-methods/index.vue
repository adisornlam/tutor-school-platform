<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold">จัดการวิธีการชำระเงิน</h1>
        <p class="mt-2 text-gray-600">เพิ่ม แก้ไข และจัดการวิธีการชำระเงิน</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>เพิ่มวิธีชำระเงิน</span>
      </button>
    </div>

    <!-- Payment Methods Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-else-if="paymentMethods.length === 0" class="p-8 text-center text-gray-500">
        ไม่พบวิธีชำระเงิน
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัส</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ค่าเริ่มต้น</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="method in paymentMethods" :key="method.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ method.code }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ method.name }}</div>
              <div v-if="method.description" class="text-sm text-gray-500">{{ method.description }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs font-medium rounded"
                :class="{
                  'bg-blue-100 text-blue-800': method.type === 'bank_transfer',
                  'bg-purple-100 text-purple-800': method.type === 'payment_gateway',
                  'bg-gray-100 text-gray-800': method.type === 'other'
                }"
              >
                {{ getTypeName(method.type) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 py-1 text-xs font-medium rounded"
                :class="method.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
              >
                {{ method.is_active ? 'ใช้งาน' : 'ปิดใช้งาน' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="method.is_default" class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                ค่าเริ่มต้น
              </span>
              <span v-else class="text-gray-400">-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click="openDetailModal(method)"
                  class="text-green-600 hover:text-green-900"
                  title="รายละเอียด/จัดการ"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  @click="toggleStatus(method)"
                  class="text-blue-600 hover:text-blue-900"
                  :title="method.is_active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'"
                >
                  <svg v-if="method.is_active" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  v-if="!method.is_default"
                  @click="handleDelete(method)"
                  class="text-red-600 hover:text-red-900"
                  title="ลบ"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Payment Method Modal (Create/Edit) -->
    <PaymentMethodModal
      :show="showCreateModal"
      :method="editingMethod"
      @close="closeModal"
      @saved="handleSaved"
    />

    <!-- Payment Method Detail Modal -->
    <PaymentMethodDetailModal
      :show="showDetailModal"
      :method="selectedMethod"
      @close="closeDetailModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import PaymentMethodModal from './components/PaymentMethodModal.vue'
import PaymentMethodDetailModal from './components/PaymentMethodDetailModal.vue'
import { useConfirm } from '~/composables/useConfirm'

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const { accessToken } = useAuth()
const { confirm } = useConfirm()

const loading = ref(false)
const error = ref<string | null>(null)
const paymentMethods = ref<any[]>([])
const showCreateModal = ref(false)
const showDetailModal = ref(false)
const editingMethod = ref<any>(null)
const selectedMethod = ref<any>(null)

const loadPaymentMethods = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await $fetch<{ success: boolean; data: any[] }>(
      '/api/admin/settings/payment-methods',
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      }
    )

    if (response.success) {
      paymentMethods.value = response.data
    } else {
      error.value = 'ไม่สามารถโหลดวิธีการชำระเงินได้'
    }
  } catch (err: any) {
    console.error('Error loading payment methods:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดวิธีการชำระเงิน'
  } finally {
    loading.value = false
  }
}

const toggleStatus = async (method: any) => {
  const action = method.is_active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'
  const confirmed = await confirm({
    title: `${action}วิธีชำระเงิน`,
    message: `คุณต้องการ${action} "${method.name}" หรือไม่?`,
    confirmText: action,
    cancelText: 'ยกเลิก'
  })

  if (!confirmed) return

  try {
    await $fetch(`/api/admin/settings/payment-methods/${method.id}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: {
        is_active: !method.is_active
      }
    })

    await loadPaymentMethods()
  } catch (err: any) {
    console.error('Error toggling status:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ')
  }
}

const handleDelete = async (method: any) => {
  const confirmed = await confirm({
    title: 'ลบวิธีชำระเงิน',
    message: `คุณต้องการลบ "${method.name}" หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`,
    confirmText: 'ลบ',
    cancelText: 'ยกเลิก',
    variant: 'danger'
  })

  if (!confirmed) return

  try {
    await $fetch(`/api/admin/settings/payment-methods/${method.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    await loadPaymentMethods()
  } catch (err: any) {
    console.error('Error deleting payment method:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการลบ')
  }
}

const openDetailModal = (method: any) => {
  selectedMethod.value = method
  showDetailModal.value = true
}

const closeDetailModal = () => {
  selectedMethod.value = null
  showDetailModal.value = false
}

const closeModal = () => {
  editingMethod.value = null
  showCreateModal.value = false
}

const handleSaved = () => {
  closeModal()
  closeDetailModal()
  loadPaymentMethods()
}

const getTypeName = (type: string) => {
  const types: Record<string, string> = {
    bank_transfer: 'โอนเงินผ่านธนาคาร',
    payment_gateway: 'Payment Gateway',
    other: 'อื่นๆ'
  }
  return types[type] || type
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm')
}

onMounted(() => {
  loadPaymentMethods()
})
</script>

