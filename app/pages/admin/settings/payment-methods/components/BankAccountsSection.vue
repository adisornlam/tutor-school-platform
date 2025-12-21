<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">บัญชีธนาคาร</h3>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
      >
        เพิ่มบัญชีธนาคาร
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      <p class="mt-2 text-gray-600">กำลังโหลด...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else-if="accounts.length === 0" class="text-center py-8 text-gray-500">
      ยังไม่มีบัญชีธนาคาร
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="account in accounts"
        :key="account.id"
        class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        :class="{ 'border-green-500 bg-green-50': account.is_default }"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <h4 class="font-semibold text-lg">{{ account.bank_name }}</h4>
              <span
                v-if="account.is_default"
                class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded"
              >
                ค่าเริ่มต้น
              </span>
            </div>
            <div class="text-sm text-gray-600 space-y-1">
              <p><span class="font-medium">ชื่อบัญชี:</span> {{ account.account_name }}</p>
              <p><span class="font-medium">เลขบัญชี:</span> {{ account.account_number }}</p>
              <p v-if="account.branch_name"><span class="font-medium">สาขา:</span> {{ account.branch_name }}</p>
              <p>
                <span class="font-medium">ประเภท:</span>
                {{ account.account_type === 'savings' ? 'ออมทรัพย์' : 'กระแสรายวัน' }}
              </p>
            </div>
            <div v-if="account.qr_code_url" class="mt-3">
              <img :src="account.qr_code_url" alt="QR Code" class="w-32 h-32 object-contain border border-gray-200 rounded">
            </div>
          </div>
          <div class="flex flex-col gap-2 ml-4">
            <button
              @click="editAccount(account)"
              class="text-blue-600 hover:text-blue-900"
              title="แก้ไข"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              v-if="!account.is_default"
              @click="handleDelete(account)"
              class="text-red-600 hover:text-red-900"
              title="ลบ"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bank Account Modal -->
    <BankAccountModal
      :show="showCreateModal || !!editingAccount"
      :account="editingAccount"
      :payment-method-id="paymentMethodId"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup lang="ts">
import BankAccountModal from './BankAccountModal.vue'
import { useConfirm } from '~/composables/useConfirm'

interface Props {
  paymentMethodId: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  saved: []
}>()

const { accessToken } = useAuth()
const { confirm } = useConfirm()

const loading = ref(false)
const error = ref<string | null>(null)
const accounts = ref<any[]>([])
const showCreateModal = ref(false)
const editingAccount = ref<any>(null)

const loadAccounts = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await $fetch<{ success: boolean; data: any[] }>(
      `/api/admin/settings/payment-methods/${props.paymentMethodId}/bank-accounts`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      }
    )

    if (response.success) {
      accounts.value = response.data
    } else {
      error.value = 'ไม่สามารถโหลดบัญชีธนาคารได้'
    }
  } catch (err: any) {
    console.error('Error loading bank accounts:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดบัญชีธนาคาร'
  } finally {
    loading.value = false
  }
}

const editAccount = (account: any) => {
  editingAccount.value = account
}

const handleDelete = async (account: any) => {
  const confirmed = await confirm({
    title: 'ลบบัญชีธนาคาร',
    message: `คุณต้องการลบบัญชี "${account.bank_name} - ${account.account_number}" หรือไม่?`,
    confirmText: 'ลบ',
    cancelText: 'ยกเลิก',
    variant: 'danger'
  })

  if (!confirmed) return

  try {
    await $fetch(
      `/api/admin/settings/payment-methods/${props.paymentMethodId}/bank-accounts/${account.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      }
    )

    await loadAccounts()
    emit('saved')
  } catch (err: any) {
    console.error('Error deleting bank account:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการลบ')
  }
}

const closeModal = () => {
  editingAccount.value = null
  showCreateModal.value = false
}

const handleSaved = () => {
  closeModal()
  loadAccounts()
  emit('saved')
}

onMounted(() => {
  loadAccounts()
})
</script>

