import { Server as SocketIOServer } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { getRedisClient, getRedisSubscriber } from '#server/utils/redis'
import { verifyAccessToken } from '#server/utils/jwt'
import { getUserWithRoles } from '#server/services/auth.service'
import { getUserChatRooms, verifyRoomAccess, saveMessage, markMessagesAsRead, getChatRoom } from '#server/services/chat.service'

declare module 'nitropack' {
  interface NitroApp {
    io?: SocketIOServer
  }
}

// Prevent duplicate initialization (HMR/Dev)
declare global {
  var io: SocketIOServer | undefined
}

export default defineNitroPlugin(async (nitroApp) => {
  console.log('[Socket.IO] 🔄 Plugin loaded, initializing Socket.IO...')
  
  // Check if already initialized (HMR protection)
  if (globalThis.io) {
    console.log('[Socket.IO] ✅ Already initialized, reusing instance')
    nitroApp.io = globalThis.io
    return
  }
  
  // Function to initialize Socket.IO
  const initializeSocketIO = async (): Promise<boolean> => {
    // Wait a bit for server to be ready
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Try to get server instance
    let server = null
    
    // Method 1: Try server first (best practice for Nitro)
    if ((nitroApp.h3App as any)?.server) {
      server = (nitroApp.h3App as any).server
      console.log('[Socket.IO] ✅ Found server from h3App.server')
    }
    // Method 2: Try nodeServer (fallback for Nitro 3)
    else if (nitroApp.h3App?.nodeServer) {
      server = nitroApp.h3App.nodeServer
      console.log('[Socket.IO] ✅ Found nodeServer from h3App.nodeServer')
    }
    // Method 3: Try websocket server
    else if (nitroApp.h3App?.websocket) {
      server = nitroApp.h3App.websocket
      console.log('[Socket.IO] ✅ Found websocket server')
    }
    // Method 4: Try nitroApp.server
    else if ((nitroApp as any)?.server) {
      server = (nitroApp as any).server
      console.log('[Socket.IO] ✅ Found server from nitroApp.server')
    }
    // Method 5: Try global
    else if ((globalThis as any)?.__nitroApp?.h3App?.nodeServer) {
      server = (globalThis as any).__nitroApp.h3App.nodeServer
      console.log('[Socket.IO] ✅ Found server from global __nitroApp')
    }
    
    if (!server) {
      console.error('[Socket.IO] ❌ No server instance found')
      console.error('[Socket.IO] Debug info:', {
        hasH3App: !!nitroApp.h3App,
        h3AppKeys: nitroApp.h3App ? Object.keys(nitroApp.h3App) : [],
        nitroAppKeys: Object.keys(nitroApp),
        hasGlobal: !!(globalThis as any).__nitroApp
      })
      return false
    }
    
    console.log('[Socket.IO] ✅ Server instance found, creating Socket.IO server...')
    console.log('[Socket.IO] Server type:', server.constructor?.name)
    
    try {
      const io = new SocketIOServer(server, {
        cors: {
          origin: process.env.NUXT_PUBLIC_SITE_URL || process.env.NODE_ENV === 'production' 
            ? false 
            : ["http://localhost:4000", "http://127.0.0.1:4000"],
          credentials: true,
          methods: ['GET', 'POST']
        },
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        allowEIO3: true,
        // Increase timeout values to prevent premature disconnections
        pingTimeout: 60000, // 60 seconds (default is 20s)
        pingInterval: 30000, // 30 seconds (default is 25s)
        connectTimeout: 45000 // 45 seconds for initial connection
      })
      
      console.log('[Socket.IO] ✅ Socket.IO server created')
      console.log('[Socket.IO] Server path: /socket.io')
      console.log('[Socket.IO] CORS origin:', process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:4000')

      // Setup Redis adapter for scaling (if Redis is available)
      try {
        const pubClient = getRedisClient()
        const subClient = getRedisSubscriber()
        
        io.adapter(createAdapter(pubClient, subClient))
        console.log('[Socket.IO] ✅ Redis adapter initialized')
      } catch (error: any) {
        console.warn('[Socket.IO] ⚠️  Redis adapter not available, using in-memory adapter:', error?.message || error)
        // Continue without Redis adapter - will work for single instance
      }

      // Authentication middleware for Socket.IO
      io.use(async (socket, next) => {
        try {
          const token = socket.handshake.auth.token || 
                        socket.handshake.headers.authorization?.replace('Bearer ', '')
          
          console.log('[Socket.IO] 🔐 Authentication attempt:', {
            hasAuthToken: !!socket.handshake.auth.token,
            hasHeaderAuth: !!socket.handshake.headers.authorization,
            tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
            origin: socket.handshake.headers.origin
          })
          
          if (!token) {
            console.error('[Socket.IO] ❌ No token provided')
            return next(new Error('Authentication error: No token provided'))
          }

          const payload = verifyAccessToken(token)
          console.log('[Socket.IO] ✅ Token verified, userId:', payload.userId)
          
          const user = await getUserWithRoles(payload.userId)
          
          if (!user) {
            console.error('[Socket.IO] ❌ User not found for userId:', payload.userId)
            return next(new Error('Authentication error: User not found'))
          }

          console.log('[Socket.IO] ✅ User authenticated:', user.id, user.roles.join(', '))
          socket.data.user = user
          next()
        } catch (error: any) {
          console.error('[Socket.IO] ❌ Authentication error:', error.message)
          console.error('[Socket.IO] Error stack:', error.stack)
          next(new Error('Authentication error: Invalid token'))
        }
      })

      io.on('connection', async (socket) => {
        const user = socket.data.user
        console.log(`[Socket.IO] ✅ User connected: ${user.id} (${user.roles.join(', ')})`)
        console.log(`[Socket.IO] Socket ID: ${socket.id}`)

        // Ping/Pong test event (best practice for connection testing)
        socket.on('ping', () => {
          socket.emit('pong')
          console.log(`[Socket.IO] 📡 Ping received from ${user.id}, sending pong`)
        })

        // Join user's personal room (for notifications)
        socket.join(`user:${user.id}`)

        // Load and join user's chat rooms
        try {
          const rooms = await getUserChatRooms(user.id)
          rooms.forEach(room => {
            socket.join(`room:${room.id}`)
          })
          console.log(`[Socket.IO] User ${user.id} joined ${rooms.length} rooms`)
        } catch (error) {
          console.error(`[Socket.IO] Error loading rooms for user ${user.id}:`, error)
        }

        // Handle joining a specific room
        socket.on('join_room', async (data: { roomId: number }) => {
          try {
            const hasAccess = await verifyRoomAccess(user.id, data.roomId)
            if (hasAccess) {
              socket.join(`room:${data.roomId}`)
              socket.emit('room_joined', { roomId: data.roomId })
            } else {
              socket.emit('error', { message: 'Access denied to this room' })
            }
          } catch (error: any) {
            socket.emit('error', { message: error.message || 'Failed to join room' })
          }
        })

        // Handle leaving a room
        socket.on('leave_room', (data: { roomId: number }) => {
          socket.leave(`room:${data.roomId}`)
          socket.emit('room_left', { roomId: data.roomId })
        })

        // Handle sending a message
        socket.on('send_message', async (data: {
          roomId: number
          content: string
          messageType?: 'text' | 'image' | 'file'
          fileUrl?: string
          fileName?: string
          fileSize?: number
          fileType?: string
        }) => {
          try {
            console.log(`[Socket.IO] 📤 Received send_message from user ${user.id}:`, {
              roomId: data.roomId,
              content: data.content?.substring(0, 50),
              messageType: data.messageType
            })

            // Verify access
            const hasAccess = await verifyRoomAccess(user.id, data.roomId)
            if (!hasAccess) {
              console.error(`[Socket.IO] ❌ Access denied for user ${user.id} to room ${data.roomId}`)
              socket.emit('error', { message: 'Access denied' })
              return
            }

            // Save message to database
            const message = await saveMessage({
              room_id: data.roomId,
              sender_id: user.id,
              content: data.content,
              message_type: data.messageType || 'text',
              file_url: data.fileUrl,
              file_name: data.fileName,
              file_size: data.fileSize,
              file_type: data.fileType
            })

            console.log(`[Socket.IO] ✅ Message saved to database with ID: ${message.id}`)

            // Emit to all users in the room (including sender for confirmation)
            io.to(`room:${data.roomId}`).emit('new_message', message)
            console.log(`[Socket.IO] 📤 Emitted new_message to room ${data.roomId}`)

            // Send notification to recipient if they're not in the room
            try {
              const currentRoom = await getChatRoom(data.roomId)
              if (currentRoom) {
                const recipientId = currentRoom.student_id === user.id ? currentRoom.tutor_id : currentRoom.student_id
                socket.to(`user:${recipientId}`).emit('new_message_notification', {
                  roomId: data.roomId,
                  message
                })
              }
            } catch (error) {
              console.error('[Socket.IO] Error sending notification:', error)
            }
          } catch (error: any) {
            console.error('[Socket.IO] ❌ Error sending message:', error.message || error)
            console.error('[Socket.IO] Error stack:', error.stack)
            socket.emit('error', { message: error.message || 'Failed to send message' })
          }
        })

        // Handle typing indicator
        socket.on('typing', (data: { roomId: number }) => {
          socket.to(`room:${data.roomId}`).emit('user_typing', {
            userId: user.id,
            userName: `${user.first_name} ${user.last_name}`
          })
        })

        // Handle stop typing
        socket.on('stop_typing', (data: { roomId: number }) => {
          socket.to(`room:${data.roomId}`).emit('user_stopped_typing', {
            userId: user.id
          })
        })

        // Handle read receipt
        socket.on('mark_read', async (data: { roomId: number; messageId?: number }) => {
          try {
            const hasAccess = await verifyRoomAccess(user.id, data.roomId)
            if (!hasAccess) {
              socket.emit('error', { message: 'Access denied' })
              return
            }

            await markMessagesAsRead(data.roomId, user.id, data.messageId)
            io.to(`room:${data.roomId}`).emit('messages_read', {
              roomId: data.roomId,
              userId: user.id
            })
          } catch (error: any) {
            socket.emit('error', { message: error.message || 'Failed to mark as read' })
          }
        })

        socket.on('disconnect', () => {
          console.log(`[Socket.IO] User disconnected: ${user.id}`)
        })
      })

      // Store io instance for use in API routes (best practice)
      nitroApp.io = io
      globalThis.io = io // Prevent duplicate initialization on HMR
      
      console.log('[Socket.IO] ✅ Socket.IO server fully initialized and ready')
      console.log('[Socket.IO] Socket.IO endpoint: /socket.io')
      console.log('[Socket.IO] Server listening on:', server.address())
      
      return true
    } catch (error: any) {
      console.error('[Socket.IO] ❌ Error initializing Socket.IO:', error.message)
      console.error('[Socket.IO] Error stack:', error.stack)
      return false
    }
  }
  
  // Try to initialize immediately
  let initialized = await initializeSocketIO()
  
  // If not initialized, try again after ready hook
  if (!initialized) {
    console.log('[Socket.IO] ⚠️  Initial initialization failed, trying with ready hook...')
    nitroApp.hooks.hook('ready', async () => {
      console.log('[Socket.IO] 🚀 Server ready hook triggered, retrying Socket.IO initialization...')
      await initializeSocketIO()
    })
  }
})
