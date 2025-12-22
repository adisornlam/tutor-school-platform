import { io, Socket } from 'socket.io-client'
import type { ChatMessage } from '#shared/types/chat.types'

export const useChatSocket = () => {
  const config = useRuntimeConfig()
  const { accessToken, user } = useAuth()
  const socket = ref<Socket | null>(null)
  const connected = ref(false)

  const connect = () => {
    // Only connect in browser environment
    if (typeof window === 'undefined') {
      console.warn('[Chat Socket] Cannot connect in server-side')
      return
    }

    // Check if already connected
    if (socket.value?.connected) {
      console.log('[Chat Socket] Already connected')
      return
    }

    if (!accessToken.value) {
      console.warn('[Chat Socket] No access token, cannot connect')
      return
    }

    // Get base URL (remove /api if present)
    const baseUrl = config.public.apiBase.replace('/api', '') || window.location.origin
    const socketUrl = baseUrl.startsWith('http') ? baseUrl : `${window.location.protocol}//${window.location.host}${baseUrl}`
    
    console.log('[Chat Socket] 🔌 Connecting to:', socketUrl.replace(accessToken.value, '***'))

    try {
      socket.value = io(socketUrl, {
        auth: {
          token: accessToken.value
        },
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      })
    } catch (error) {
      console.error('[Chat Socket] Failed to create socket:', error)
      return
    }

    socket.value.on('connect', () => {
      connected.value = true
      console.log('[Chat Socket] ✅ Connected to server, socket ID:', socket.value?.id)
    })

    socket.value.on('disconnect', () => {
      connected.value = false
      console.log('[Chat Socket] ⚠️  Disconnected from server')
    })

    socket.value.on('connect_error', (error) => {
      console.error('[Chat Socket] ❌ Connection error:', error)
      connected.value = false
    })

    socket.value.on('error', (error: { message: string }) => {
      console.error('[Chat Socket] ❌ Socket error:', error.message)
    })
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      connected.value = false
      console.log('[Chat Socket] ⚠️  Disconnected')
    }
  }

  const joinRoom = (roomId: number) => {
    if (socket.value && connected.value) {
      console.log(`[Chat Socket] 📥 Emitting join_room for room ${roomId}`, {
        socketId: socket.value.id,
        connected: connected.value
      })
      socket.value.emit('join_room', { roomId })
      
      // Listen for confirmation
      socket.value.once('room_joined', (data: { roomId: number }) => {
        console.log(`[Chat Socket] ✅ Successfully joined room ${data.roomId}`)
      })
      
      socket.value.once('error', (error: { message: string }) => {
        console.error(`[Chat Socket] ❌ Error joining room ${roomId}:`, error.message)
      })
    } else {
      console.warn('[Chat Socket] ⚠️  Cannot join room: not connected', {
        hasSocket: !!socket.value,
        connected: connected.value,
        roomId
      })
    }
  }

  const leaveRoom = (roomId: number) => {
    if (socket.value && connected.value) {
      socket.value.emit('leave_room', { roomId })
      console.log(`[Chat Socket] 📤 Leaving room ${roomId}`)
    }
  }

  const on = (event: string, callback: (...args: any[]) => void) => {
    if (socket.value) {
      // Check if listener already exists to avoid duplicates
      const hasListener = socket.value.hasListeners(event)
      if (hasListener) {
        console.log(`[Chat Socket] ⚠️ Event ${event} already has listeners, removing old ones first`)
        socket.value.off(event)
      }
      socket.value.on(event, callback)
      console.log(`[Chat Socket] 👂 Listening to event: ${event}`, {
        socketId: socket.value.id,
        connected: socket.value.connected
      })
    } else {
      console.warn(`[Chat Socket] ⚠️ Cannot listen to ${event}: socket not available`)
    }
  }

  const off = (event: string, callback?: (...args: any[]) => void) => {
    if (socket.value) {
      socket.value.off(event, callback)
    }
  }

  const emit = (event: string, data: any) => {
    if (socket.value && connected.value) {
      socket.value.emit(event, data)
    } else {
      console.warn(`[Chat Socket] Cannot emit ${event}: not connected`)
    }
  }

  return {
    socket: readonly(socket),
    connected: readonly(connected),
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    on,
    off,
    emit
  }
}

