import { u as useAuth, c as useRuntimeConfig } from './server.mjs';
import { ref, watch, readonly } from 'vue';

const useUnreadMessages = () => {
  const config = useRuntimeConfig();
  const { accessToken, user } = useAuth();
  const unreadCount = ref(0);
  const loading = ref(false);
  const calculateUnreadCount = (rooms) => {
    return rooms.reduce((total, room) => {
      return total + (room.unread_count || 0);
    }, 0);
  };
  const fetchUnreadCount = async () => {
    if (!accessToken.value || !user.value) {
      unreadCount.value = 0;
      return;
    }
    loading.value = true;
    try {
      const response = await $fetch(
        `${config.public.apiBase}/chat/rooms`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        }
      );
      if (response.success) {
        unreadCount.value = calculateUnreadCount(response.data);
      }
    } catch (error) {
      console.error("[UnreadMessages] Error fetching unread count:", error);
      unreadCount.value = 0;
    } finally {
      loading.value = false;
    }
  };
  const updateUnreadCount = (rooms) => {
    unreadCount.value = calculateUnreadCount(rooms);
  };
  const resetUnreadCount = () => {
    unreadCount.value = 0;
  };
  watch([accessToken, user], ([token, currentUser]) => {
    if (token && currentUser) {
      fetchUnreadCount();
    } else {
      unreadCount.value = 0;
    }
  }, { immediate: true });
  return {
    unreadCount: readonly(unreadCount),
    loading: readonly(loading),
    fetchUnreadCount,
    updateUnreadCount,
    resetUnreadCount
  };
};

export { useUnreadMessages as u };
//# sourceMappingURL=useUnreadMessages-hQ6KJWBd.mjs.map
