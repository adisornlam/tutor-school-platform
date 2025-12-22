import type { ChatMessage, ChatRoom } from '#shared/types/chat.types'

export const useChatSSE = () => {
  const config = useRuntimeConfig()
  const { accessToken, user } = useAuth()
  const eventSource = ref<EventSource | null>(null)
  const connected = ref(false)
  const subscribedRooms = ref<Set<number>>(new Set())

  const connect = () => {
    // Only connect in browser environment
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') {
      console.warn('[Chat SSE] EventSource not available (server-side or unsupported browser)')
      return
    }

    // Check if already connected or connecting
    if (eventSource.value) {
      const state = eventSource.value.readyState
      if (state === EventSource.OPEN) {
        console.log('[Chat SSE] Already connected')
        return
      }
      if (state === EventSource.CONNECTING) {
        console.log('[Chat SSE] Connection in progress, waiting...')
        return
      }
      // If CLOSED, close and cleanup before reconnecting
      if (state === EventSource.CLOSED) {
        eventSource.value.close()
        eventSource.value = null
        listenersAttached = false
      }
    }

    if (!accessToken.value) {
      console.warn('[Chat SSE] No access token, cannot connect')
      return
    }

    // EventSource doesn't support custom headers, so we pass token as query param
    const url = `${config.public.apiBase}/chat/events?token=${encodeURIComponent(accessToken.value)}`
    console.log('[Chat SSE] 🔌 Connecting to:', url.replace(accessToken.value, '***'))

    try {
      eventSource.value = new EventSource(url)
    } catch (error) {
      console.error('[Chat SSE] Failed to create EventSource:', error)
      return
    }

    eventSource.value.onopen = () => {
      connected.value = true
      console.log('[Chat SSE] ✅ Connected to server')
      // Attach event listeners when connection is established
      attachEventListeners()
    }

    eventSource.value.onerror = (error) => {
      const currentState = eventSource.value?.readyState
      connected.value = false
      
      // If connection is closed (readyState === 2), don't try to reconnect
      if (currentState === EventSource.CLOSED) {
        console.log('[Chat SSE] Connection closed, not reconnecting')
        eventSource.value = null
        listenersAttached = false
        return
      }
      
      // If connection is connecting (readyState === 0), wait a bit
      if (currentState === EventSource.CONNECTING) {
        console.warn('[Chat SSE] Connection still connecting, waiting...')
        return
      }
      
      console.error('[Chat SSE] ❌ Connection error, readyState:', currentState)
      // EventSource will auto-reconnect if readyState === 1 (OPEN)
    }
  }

  const disconnect = () => {
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
      connected.value = false
      subscribedRooms.value.clear()
      listenersAttached = false // Reset flag on disconnect
      console.log('[Chat SSE] ⚠️  Disconnected from server')
    }
  }

  const subscribeToRoom = async (roomId: number) => {
    if (subscribedRooms.value.has(roomId)) {
      console.log(`[Chat SSE] Already subscribed to room ${roomId}`)
      return
    }
    
    subscribedRooms.value.add(roomId)
    console.log(`[Chat SSE] Subscribing to room ${roomId}`)
    
    // Send request to server to subscribe to room
    if (!accessToken.value) {
      console.warn('[Chat SSE] No access token, cannot subscribe to room')
      return
    }

    try {
      await $fetch(`${config.public.apiBase}/chat/events/subscribe`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: { roomId }
      })
      console.log(`[Chat SSE] ✅ Successfully subscribed to room ${roomId}`)
    } catch (error) {
      console.error(`[Chat SSE] ❌ Error subscribing to room ${roomId}:`, error)
      // Remove from local state if subscription failed
      subscribedRooms.value.delete(roomId)
    }
  }

  const unsubscribeFromRoom = (roomId: number) => {
    subscribedRooms.value.delete(roomId)
    console.log(`[Chat SSE] Unsubscribed from room ${roomId}`)
  }

  // Store callbacks for event listeners
  let onNewMessageCallback: ((message: ChatMessage) => void) | null = null
  let onTypingCallback: ((data: { userId: number; userName: string; roomId: number }) => void) | null = null
  let onStopTypingCallback: ((data: { userId: number; roomId: number }) => void) | null = null
  let onMessagesReadCallback: ((data: { roomId: number; userId: number }) => void) | null = null
  let onRoomSubscribedCallback: ((data: { roomId: number }) => void) | null = null

  // Track if listeners are attached to prevent duplicates
  let listenersAttached = false

  // Internal function to attach listeners to eventSource
  const attachEventListeners = () => {
    if (!eventSource.value || listenersAttached) return
    
    listenersAttached = true

    // New message event
    eventSource.value.addEventListener('new_message', (e: MessageEvent) => {
      try {
        const message = JSON.parse(e.data) as ChatMessage
        console.log('[Chat SSE] 📨 New message received:', {
          id: message.id,
          roomId: message.room_id,
          senderId: message.sender_id,
          content: message.content?.substring(0, 50)
        })
        onNewMessageCallback?.(message)
      } catch (error) {
        console.error('[Chat SSE] Error parsing new_message:', error)
      }
    })

    // Typing event
    eventSource.value.addEventListener('typing', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data)
        onTypingCallback?.(data)
      } catch (error) {
        console.error('[Chat SSE] Error parsing typing:', error)
      }
    })

    // Stop typing event
    eventSource.value.addEventListener('stop_typing', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data)
        onStopTypingCallback?.(data)
      } catch (error) {
        console.error('[Chat SSE] Error parsing stop_typing:', error)
      }
    })

    // Messages read event
    eventSource.value.addEventListener('messages_read', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data)
        onMessagesReadCallback?.(data)
      } catch (error) {
        console.error('[Chat SSE] Error parsing messages_read:', error)
      }
    })

    // Room subscribed event
    eventSource.value.addEventListener('room_subscribed', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data)
        onRoomSubscribedCallback?.(data)
      } catch (error) {
        console.error('[Chat SSE] Error parsing room_subscribed:', error)
      }
    })

    // Heartbeat event (for connection monitoring)
    eventSource.value.addEventListener('heartbeat', (e: MessageEvent) => {
      // Connection is alive
      connected.value = true
    })

    // Connected event
    eventSource.value.addEventListener('connected', (e: MessageEvent) => {
      console.log('[Chat SSE] ✅ Connection confirmed')
      connected.value = true
    })
  }

  // Setup event listeners (stores callbacks and attaches if eventSource exists)
  const setupEventListeners = (
    onNewMessage: (message: ChatMessage) => void,
    onTyping: (data: { userId: number; userName: string; roomId: number }) => void,
    onStopTyping: (data: { userId: number; roomId: number }) => void,
    onMessagesRead: (data: { roomId: number; userId: number }) => void,
    onRoomSubscribed: (data: { roomId: number }) => void
  ) => {
    // Store callbacks
    onNewMessageCallback = onNewMessage
    onTypingCallback = onTyping
    onStopTypingCallback = onStopTyping
    onMessagesReadCallback = onMessagesRead
    onRoomSubscribedCallback = onRoomSubscribed

    // Attach listeners if eventSource already exists
    if (eventSource.value) {
      attachEventListeners()
    }

  }

  // Note: Connection should be managed by the component that uses this composable
  // Don't auto-connect here to avoid multiple connections

  return {
    eventSource: readonly(eventSource),
    connected: readonly(connected),
    connect,
    disconnect,
    subscribeToRoom,
    unsubscribeFromRoom,
    setupEventListeners
  }
}

