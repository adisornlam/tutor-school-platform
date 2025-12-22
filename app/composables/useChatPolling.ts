import type { ChatMessage } from '#shared/types/chat.types'

/**
 * Polling fallback for chat messages when SSE is not available
 */
export const useChatPolling = () => {
  const config = useRuntimeConfig()
  const { accessToken } = useAuth()
  const pollingInterval = ref<NodeJS.Timeout | null>(null)
  const isPolling = ref(false)
  const lastMessageIds = ref<Map<number, number>>(new Map()) // roomId -> last message id

  const startPolling = (roomId: number, onNewMessages: (messages: ChatMessage[]) => void) => {
    if (isPolling.value) {
      console.log('[Chat Polling] Already polling')
      return
    }

    isPolling.value = true
    console.log(`[Chat Polling] 🔄 Starting polling for room ${roomId}`)

    const poll = async () => {
      try {
        const lastId = lastMessageIds.value.get(roomId) || 0
        
        // Fetch messages since last ID
        const response = await $fetch<{ success: boolean; data: ChatMessage[] }>(
          `${config.public.apiBase}/chat/rooms/${roomId}/messages?since=${lastId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken.value}`
            }
          }
        )

        if (response.success && response.data.length > 0) {
          // Update last message ID
          const latestId = Math.max(...response.data.map(m => m.id as number))
          lastMessageIds.value.set(roomId, latestId)
          
          console.log(`[Chat Polling] 📨 Found ${response.data.length} new messages`)
          onNewMessages(response.data)
        }
      } catch (error) {
        console.error('[Chat Polling] Error polling messages:', error)
      }
    }

    // Poll immediately, then every 2 seconds
    poll()
    pollingInterval.value = setInterval(poll, 2000)
  }

  const stopPolling = () => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value)
      pollingInterval.value = null
      isPolling.value = false
      console.log('[Chat Polling] ⏹️  Stopped polling')
    }
  }

  const updateLastMessageId = (roomId: number, messageId: number) => {
    const current = lastMessageIds.value.get(roomId) || 0
    if (messageId > current) {
      lastMessageIds.value.set(roomId, messageId)
    }
  }

  return {
    isPolling: readonly(isPolling),
    startPolling,
    stopPolling,
    updateLastMessageId
  }
}

