import type { NitroApp } from "nitropack"
import { Server as Engine } from "engine.io"
import { Server } from "socket.io"
import { defineEventHandler } from "h3"
import { verifyAccessToken } from '#server/utils/jwt'
import { getUserWithRoles } from '#server/services/auth.service'
import { getUserChatRooms, verifyRoomAccess, markMessagesAsRead, getTutorCourses, getStudentCourses } from '#server/services/chat.service'
import { getUserRoles } from '#server/services/auth.service'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine()
  const io = new Server()

  io.bind(engine)

  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || 
                   socket.handshake.headers.authorization?.replace('Bearer ', '') ||
                   socket.handshake.query.token as string
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'))
      }

      const payload = verifyAccessToken(token as string)
      const user = await getUserWithRoles(payload.userId)
      
      if (!user) {
        return next(new Error('Authentication error: User not found'))
      }

      socket.data.user = user
      socket.data.userId = user.id
      next()
    } catch (error) {
      console.error('[Socket.IO] Authentication error:', error)
      next(new Error('Authentication error: Invalid token'))
    }
  })

  io.on("connection", async (socket) => {
    const user = socket.data.user
    const userId = user.id
    
    console.log(`[Socket.IO] ✅ User connected: ${userId} (${user.first_name} ${user.last_name})`)
    console.log(`[Socket.IO] 🔌 Socket ID: ${socket.id}`)

    // Join user's personal room (for notifications)
    socket.join(`user:${userId}`)
    console.log(`[Socket.IO] 👤 User ${userId} joined personal room: user:${userId}`)

    // Join chat rooms that user is part of
    try {
      const rooms = await getUserChatRooms(userId)
      for (const room of rooms) {
        socket.join(`room:${room.id}`)
        console.log(`[Socket.IO] 🏠 User ${userId} joined room ${room.id} (course ${room.course_id}, student ${room.student_id}, tutor ${room.tutor_id})`)
      }
      console.log(`[Socket.IO] ✅ User ${userId} joined ${rooms.length} chat room(s)`)
      
      // Join course rooms based on user role
      const userRoles = await getUserRoles(userId)
      const isTutor = userRoles.includes('tutor')
      const isStudent = userRoles.includes('student')
      
      if (isTutor) {
        // Join course rooms that tutor teaches
        try {
          const tutorCourses = await getTutorCourses(userId)
          for (const courseId of tutorCourses) {
            socket.join(`course:${courseId}`)
            console.log(`[Socket.IO] 📚 Tutor ${userId} joined course room: course:${courseId}`)
          }
          console.log(`[Socket.IO] ✅ Tutor ${userId} joined ${tutorCourses.length} course room(s)`)
        } catch (error) {
          console.error(`[Socket.IO] Error loading tutor courses for user ${userId}:`, error)
        }
      }
      
      if (isStudent) {
        // Join course rooms that student is enrolled in
        try {
          const studentCourses = await getStudentCourses(userId)
          for (const courseId of studentCourses) {
            socket.join(`course:${courseId}`)
            console.log(`[Socket.IO] 📚 Student ${userId} joined course room: course:${courseId}`)
          }
          console.log(`[Socket.IO] ✅ Student ${userId} joined ${studentCourses.length} course room(s)`)
        } catch (error) {
          console.error(`[Socket.IO] Error loading student courses for user ${userId}:`, error)
        }
      }
      
      // Log all rooms this user is in
      const socketRooms = Array.from(socket.rooms)
      console.log(`[Socket.IO] 📋 User ${userId} is in ${socketRooms.length} room(s):`, socketRooms)
    } catch (error) {
      console.error(`[Socket.IO] Error loading rooms for user ${userId}:`, error)
    }

    // Handle joining a specific room
    socket.on('join_room', async (data: { roomId: number }) => {
      try {
        console.log(`[Socket.IO] 📥 join_room event received from user ${userId} for room ${data.roomId}`)
        
        const hasAccess = await verifyRoomAccess(userId, data.roomId)
        if (hasAccess) {
          socket.join(`room:${data.roomId}`)
          
          // Verify join was successful
          const socketRooms = Array.from(socket.rooms)
          const isInRoom = socketRooms.includes(`room:${data.roomId}`)
          
          console.log(`[Socket.IO] ✅ User ${userId} joined room ${data.roomId}`, {
            socketId: socket.id,
            isInRoom,
            allRooms: socketRooms
          })
          
          socket.emit('room_joined', { roomId: data.roomId })
        } else {
          console.warn(`[Socket.IO] ❌ Access denied: User ${userId} cannot join room ${data.roomId}`)
          socket.emit('error', { message: 'Access denied to this room' })
        }
      } catch (error) {
        console.error(`[Socket.IO] ❌ Error joining room ${data.roomId} for user ${userId}:`, error)
        socket.emit('error', { message: 'Failed to join room' })
      }
    })

    // Handle leaving a room
    socket.on('leave_room', (data: { roomId: number }) => {
      socket.leave(`room:${data.roomId}`)
      socket.emit('room_left', { roomId: data.roomId })
      console.log(`[Socket.IO] User ${userId} left room ${data.roomId}`)
    })

    // Handle typing indicator
    socket.on('typing', (data: { roomId: number }) => {
      socket.to(`room:${data.roomId}`).emit('user_typing', {
        userId,
        userName: `${user.first_name} ${user.last_name}`,
        roomId: data.roomId
      })
    })

    // Handle stop typing
    socket.on('stop_typing', (data: { roomId: number }) => {
      socket.to(`room:${data.roomId}`).emit('stop_typing', {
        userId,
        roomId: data.roomId
      })
    })

    // Handle read receipt
    socket.on('mark_read', async (data: { roomId: number; messageId?: number }) => {
      try {
        await markMessagesAsRead(data.roomId, userId, data.messageId)
        io.to(`room:${data.roomId}`).emit('messages_read', {
          roomId: data.roomId,
          userId
        })
      } catch (error) {
        console.error(`[Socket.IO] Error marking messages as read:`, error)
      }
    })

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] ⚠️  User disconnected: ${userId}, reason: ${reason}`)
    })

    socket.on('error', (error: any) => {
      // Ignore ECONNRESET errors (normal when client disconnects)
      if (error.code !== 'ECONNRESET' && error.message !== 'read ECONNRESET') {
        console.error(`[Socket.IO] Socket error for user ${userId}:`, error)
      }
    })

    // Handle connection errors gracefully
    socket.on('disconnecting', (reason) => {
      console.log(`[Socket.IO] User ${userId} disconnecting, reason: ${reason}`)
    })
  })

  // Store io instance for use in API routes
  ;(nitroApp as any).io = io

  // Hook the Socket.IO server to Nitro router
  nitroApp.router.use("/socket.io/", defineEventHandler({
    handler(event) {
      try {
        engine.handleRequest(event.node.req, event.node.res)
        event._handled = true
      } catch (error: any) {
        // Ignore ECONNRESET errors (normal when client disconnects)
        if (error.code !== 'ECONNRESET' && error.message !== 'read ECONNRESET') {
          console.error('[Socket.IO] Error handling request:', error)
        }
      }
    },
    websocket: {
      open(peer) {
        try {
          // @ts-expect-error private method and property
          engine.prepare(peer._internal.nodeReq)
          // @ts-expect-error private method and property
          engine.onWebSocket(peer._internal.nodeReq, peer._internal.nodeReq.socket, peer.websocket)
        } catch (error: any) {
          // Ignore ECONNRESET errors
          if (error.code !== 'ECONNRESET' && error.message !== 'read ECONNRESET') {
            console.error('[Socket.IO] Error opening WebSocket:', error)
          }
        }
      },
      close(peer) {
        // Handle WebSocket close gracefully
        // This is normal when client disconnects
      },
      error(peer, error) {
        // Ignore ECONNRESET errors
        if (error.code !== 'ECONNRESET' && error.message !== 'read ECONNRESET') {
          console.error('[Socket.IO] WebSocket error:', error)
        }
      }
    }
  }))

  console.log('[Socket.IO] ✅ Plugin initialized and ready')
})
