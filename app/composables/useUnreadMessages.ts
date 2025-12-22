import type { ChatRoom } from '#shared/types/chat.types'

/**
 * Composable to track unread message count across all chat rooms
 */
export const useUnreadMessages = () => {
  const config = useRuntimeConfig()
  const { accessToken, user } = useAuth()
  const unreadCount = ref(0)
  const loading = ref(false)

  /**
   * Calculate total unread messages from rooms
   */
  const calculateUnreadCount = (rooms: ChatRoom[]): number => {
    return rooms.reduce((total, room) => {
      return total + (room.unread_count || 0)
    }, 0)
  }

  /**
   * Fetch unread count from API
   */
  const fetchUnreadCount = async () => {
    if (!accessToken.value || !user.value) {
      unreadCount.value = 0
      return
    }

    loading.value = true
    try {
      const response = await $fetch<{ success: boolean; data: ChatRoom[] }>(
        `${config.public.apiBase}/chat/rooms`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        }
      )

      if (response.success) {
        unreadCount.value = calculateUnreadCount(response.data)
      }
    } catch (error) {
      console.error('[UnreadMessages] Error fetching unread count:', error)
      unreadCount.value = 0
    } finally {
      loading.value = false
    }
  }

  /**
   * Update unread count from rooms data
   */
  const updateUnreadCount = (rooms: ChatRoom[]) => {
    unreadCount.value = calculateUnreadCount(rooms)
  }

  /**
   * Reset unread count (when all messages are read)
   */
  const resetUnreadCount = () => {
    unreadCount.value = 0
  }

  // Auto-fetch when user is available
  watch([accessToken, user], ([token, currentUser]) => {
    if (token && currentUser) {
      fetchUnreadCount()
    } else {
      unreadCount.value = 0
    }
  }, { immediate: true })

  return {
    unreadCount: readonly(unreadCount),
    loading: readonly(loading),
    fetchUnreadCount,
    updateUnreadCount,
    resetUnreadCount
  }
}

