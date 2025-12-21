# 💬 การวิเคราะห์ความเป็นไปได้ของระบบแชท (Chat System)

## 📋 ภาพรวม Requirements

1. **แชทระหว่างผู้เรียน (Student) กับอาจารย์ผู้สอน (Tutor)**
2. **รองรับการแนบไฟล์และรูปภาพ**
3. **Admin Center ขึ้นไปสามารถดูแชททั้งหมดได้**
4. **ใช้ Socket.io สำหรับ real-time messaging**
5. **เข้ากับ Nuxt 4**

---

## ✅ ความเป็นไปได้ (Feasibility)

### 🟢 **เป็นไปได้สูง (Highly Feasible)**

ระบบแชทสามารถทำได้ด้วย Socket.io ใน Nuxt 4 เพราะ:

1. **Nuxt 4 รองรับ WebSocket**
   - มี `experimental.websocket: true` ใน `nuxt.config.ts` อยู่แล้ว
   - Nitro server engine รองรับ WebSocket natively

2. **มี Infrastructure พร้อมแล้ว**
   - ✅ Authentication system (JWT, `useAuth` composable)
   - ✅ Authorization system (Role-based: Student, Tutor, Admin)
   - ✅ Database connection (`server/utils/db.ts`)
   - ✅ File upload system (`server/api/admin/upload.post.ts`)
   - ✅ User management system

3. **Socket.io Compatible**
   - Socket.io ทำงานได้ดีกับ Node.js/Nitro server
   - รองรับ authentication middleware
   - รองรับ rooms/channels สำหรับแยกห้องแชท

---

## 🏗️ สถาปัตยกรรมระบบ (Architecture)

### 1. **Database Schema**

```sql
-- Table: chat_rooms (ห้องแชท)
CREATE TABLE chat_rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,              -- เกี่ยวข้องกับคอร์สไหน
    student_id INT NOT NULL,             -- นักเรียนคนไหน
    tutor_id INT NOT NULL,               -- อาจารย์คนไหน
    status ENUM('active', 'archived', 'closed') DEFAULT 'active',
    last_message_at DATETIME,            -- ข้อความล่าสุดเมื่อไหร่ (สำหรับ sorting)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_tutor_course (student_id, tutor_id, course_id),
    INDEX idx_student (student_id),
    INDEX idx_tutor (tutor_id),
    INDEX idx_course (course_id),
    INDEX idx_status (status),
    INDEX idx_last_message (last_message_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: chat_messages (ข้อความ)
CREATE TABLE chat_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT NOT NULL,                -- ห้องแชทไหน
    sender_id INT NOT NULL,              -- ใครส่ง
    message_type ENUM('text', 'image', 'file', 'system') DEFAULT 'text',
    content TEXT,                        -- ข้อความ/URL
    file_name VARCHAR(500),              -- ชื่อไฟล์ (ถ้าแนบไฟล์)
    file_size INT,                       -- ขนาดไฟล์ (bytes)
    file_type VARCHAR(100),              -- ประเภทไฟล์ (MIME type)
    file_url VARCHAR(1000),              -- URL ของไฟล์
    is_read BOOLEAN DEFAULT FALSE,       -- อ่านแล้วหรือยัง
    read_at DATETIME,                    -- อ่านเมื่อไหร่
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_room (room_id),
    INDEX idx_sender (sender_id),
    INDEX idx_created (created_at),
    INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: chat_room_participants (ผู้เข้าร่วมห้องแชท - สำหรับ future expansion)
CREATE TABLE chat_room_participants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('student', 'tutor', 'admin') NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_read_at DATETIME,               -- อ่านข้อความล่าสุดเมื่อไหร่
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_room_user (room_id, user_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. **File Storage Structure**

```
public/uploads/
├── chat/
│   ├── {roomId}/
│   │   ├── images/
│   │   │   ├── {timestamp}-{random}.{ext}
│   │   │   └── ...
│   │   └── files/
│   │       ├── {timestamp}-{random}.{ext}
│   │       └── ...
│   └── ...
```

---

## 🔧 Technical Implementation

### 1. **Socket.io Server Setup**

**File: `server/plugins/socket.io.ts`** (Nitro Plugin)

```typescript
import { Server as SocketIOServer } from 'socket.io'
import type { H3Event } from 'h3'
import { verifyAccessToken } from '../utils/jwt'
import { getUserWithRoles } from '../services/auth.service'

export default defineNitroPlugin((nitroApp) => {
  // Initialize Socket.IO server
  const io = new SocketIOServer(nitroApp.h3App.websocket || nitroApp.h3App.server, {
    cors: {
      origin: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:4000",
      credentials: true
    },
    path: '/socket.io'
  })

  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '')
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'))
      }

      const payload = verifyAccessToken(token)
      const user = await getUserWithRoles(payload.userId)
      
      if (!user) {
        return next(new Error('Authentication error: User not found'))
      }

      socket.data.user = user
      next()
    } catch (error) {
      next(new Error('Authentication error: Invalid token'))
    }
  })

  io.on('connection', async (socket) => {
    const user = socket.data.user
    console.log(`[Socket.IO] User connected: ${user.id} (${user.roles.join(', ')})`)

    // Join user's personal room (for notifications)
    socket.join(`user:${user.id}`)

    // Join chat rooms that user is part of
    // Load user's chat rooms from database
    const rooms = await getUserChatRooms(user.id)
    rooms.forEach(room => {
      socket.join(`room:${room.id}`)
    })

    // Handle joining a specific room
    socket.on('join_room', async (data: { roomId: number }) => {
      // Verify user has access to this room
      const hasAccess = await verifyRoomAccess(user.id, data.roomId)
      if (hasAccess) {
        socket.join(`room:${data.roomId}`)
        socket.emit('room_joined', { roomId: data.roomId })
      } else {
        socket.emit('error', { message: 'Access denied to this room' })
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
        // Verify access
        const hasAccess = await verifyRoomAccess(user.id, data.roomId)
        if (!hasAccess) {
          socket.emit('error', { message: 'Access denied' })
          return
        }

        // Save message to database
        const message = await saveMessage({
          roomId: data.roomId,
          senderId: user.id,
          content: data.content,
          messageType: data.messageType || 'text',
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          fileSize: data.fileSize,
          fileType: data.fileType
        })

        // Update room's last_message_at
        await updateRoomLastMessage(data.roomId)

        // Emit to all users in the room (except sender)
        io.to(`room:${data.roomId}`).emit('new_message', message)

        // Send notification to recipient if they're not in the room
        const room = await getChatRoom(data.roomId)
        const recipientId = room.student_id === user.id ? room.tutor_id : room.student_id
        io.to(`user:${recipientId}`).emit('new_message_notification', {
          roomId: data.roomId,
          message
        })
      } catch (error: any) {
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

    // Handle read receipt
    socket.on('mark_read', async (data: { roomId: number, messageId?: number }) => {
      await markMessagesAsRead(data.roomId, user.id, data.messageId)
      io.to(`room:${data.roomId}`).emit('messages_read', {
        roomId: data.roomId,
        userId: user.id
      })
    })

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] User disconnected: ${user.id}`)
    })
  })

  // Store io instance for use in API routes
  nitroApp.io = io
})
```

### 2. **Client-Side Socket.io Composable**

**File: `app/composables/useChat.ts`**

```typescript
import { io, Socket } from 'socket.io-client'
import type { ChatRoom, ChatMessage } from '#shared/types/chat.types'

export const useChat = () => {
  const config = useRuntimeConfig()
  const { accessToken } = useAuth()
  const socket = ref<Socket | null>(null)
  const connected = ref(false)
  const rooms = ref<ChatRoom[]>([])
  const activeRoom = ref<ChatRoom | null>(null)
  const messages = ref<Map<number, ChatMessage[]>>(new Map())

  const connect = () => {
    if (socket.value?.connected) return

    socket.value = io(config.public.apiBase.replace('/api', ''), {
      auth: {
        token: accessToken.value
      },
      path: '/socket.io',
      transports: ['websocket', 'polling']
    })

    socket.value.on('connect', () => {
      connected.value = true
      console.log('[Chat] Connected to server')
    })

    socket.value.on('disconnect', () => {
      connected.value = false
      console.log('[Chat] Disconnected from server')
    })

    socket.value.on('new_message', (message: ChatMessage) => {
      const roomMessages = messages.value.get(message.room_id) || []
      roomMessages.push(message)
      messages.value.set(message.room_id, roomMessages)
    })

    socket.value.on('user_typing', (data: { userId: number, userName: string }) => {
      // Handle typing indicator
    })

    socket.value.on('error', (error: { message: string }) => {
      console.error('[Chat] Error:', error.message)
    })
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      connected.value = false
    }
  }

  const joinRoom = (roomId: number) => {
    if (socket.value && connected.value) {
      socket.value.emit('join_room', { roomId })
    }
  }

  const sendMessage = (data: {
    roomId: number
    content: string
    messageType?: 'text' | 'image' | 'file'
    fileUrl?: string
    fileName?: string
    fileSize?: number
    fileType?: string
  }) => {
    if (socket.value && connected.value) {
      socket.value.emit('send_message', data)
    }
  }

  const markAsRead = (roomId: number, messageId?: number) => {
    if (socket.value && connected.value) {
      socket.value.emit('mark_read', { roomId, messageId })
    }
  }

  const typing = (roomId: number) => {
    if (socket.value && connected.value) {
      socket.value.emit('typing', { roomId })
    }
  }

  return {
    socket: readonly(socket),
    connected: readonly(connected),
    rooms: readonly(rooms),
    activeRoom: readonly(activeRoom),
    messages: readonly(messages),
    connect,
    disconnect,
    joinRoom,
    sendMessage,
    markAsRead,
    typing
  }
}
```

### 3. **API Endpoints**

```
GET    /api/chat/rooms                    # ดูห้องแชททั้งหมดของผู้ใช้
GET    /api/chat/rooms/:roomId            # ดูรายละเอียดห้องแชท
POST   /api/chat/rooms                    # สร้างห้องแชทใหม่
GET    /api/chat/rooms/:roomId/messages   # ดูข้อความในห้อง
GET    /api/admin/chat/rooms              # Admin: ดูห้องแชททั้งหมด
GET    /api/admin/chat/rooms/:roomId      # Admin: ดูรายละเอียดห้อง
POST   /api/chat/upload                   # อัพโหลดไฟล์สำหรับแชท
```

---

## 🔐 Authentication & Authorization

### **Access Control Rules:**

1. **Student (ผู้เรียน)**
   - ✅ สามารถสร้างห้องแชทกับอาจารย์ที่สอนคอร์สที่ตัวเองลงทะเบียนแล้ว
   - ✅ สามารถส่ง/รับข้อความในห้องแชทของตัวเอง
   - ❌ ไม่สามารถดูแชทของคนอื่น

2. **Tutor (อาจารย์)**
   - ✅ สามารถตอบข้อความในห้องแชทที่นักเรียนสร้างไว้
   - ✅ สามารถดูห้องแชททั้งหมดที่เกี่ยวข้องกับตัวเอง
   - ❌ ไม่สามารถสร้างห้องแชทใหม่ (รอให้นักเรียนสร้างก่อน)

3. **Admin Center ขึ้นไป** (`system_admin`, `owner`, `admin`)
   - ✅ สามารถดูแชททั้งหมดได้
   - ✅ สามารถดูรายละเอียดข้อความทั้งหมด
   - ✅ อาจจะต้องมี audit log

---

## 📁 File Upload for Chat

### **โครงสร้าง:**
```
public/uploads/chat/
├── {roomId}/
│   ├── images/
│   │   ├── {timestamp}-{random}.{ext}
│   │   └── ...
│   └── files/
│       ├── {timestamp}-{random}.{ext}
│       └── ...
```

### **API Endpoint:**
- `POST /api/chat/upload`
  - Parameters: `roomId`, `fileType` (image/file)
  - Returns: `fileUrl`, `fileName`, `fileSize`, `fileType`

---

## 🎨 UI Components Needed

1. **ChatRoomList.vue** - รายการห้องแชท
2. **ChatWindow.vue** - หน้าต่างแชทหลัก
3. **ChatMessage.vue** - Component สำหรับแสดงข้อความ
4. **ChatInput.vue** - Input สำหรับพิมพ์และแนบไฟล์
5. **FileUpload.vue** - Component สำหรับอัพโหลดไฟล์
6. **AdminChatView.vue** - Admin view สำหรับดูแชททั้งหมด

---

## ⚠️ Challenges & Considerations

### 1. **Scalability**
- ถ้ามีผู้ใช้เยอะ ต้องพิจารณาใช้ Redis adapter สำหรับ Socket.io
- Database indexing สำคัญ (room_id, sender_id, created_at)

### 2. **Security**
- ✅ Authentication ผ่าน JWT token
- ✅ Authorization check ก่อน join room
- ✅ File upload validation (type, size)
- ✅ Rate limiting สำหรับการส่งข้อความ

### 3. **Performance**
- Pagination สำหรับข้อความ (load 20-50 ข้อความต่อครั้ง)
- Lazy loading สำหรับรูปภาพ
- Caching สำหรับห้องแชทที่เปิดบ่อย

### 4. **Real-time Sync**
- Handle connection loss (reconnect automatically)
- Show delivery status (sent, delivered, read)
- Handle duplicate messages (idempotency)

---

## 📦 Dependencies Needed

```json
{
  "socket.io": "^4.7.0",
  "socket.io-client": "^4.7.0"
}
```

---

## ✅ สรุป

**ความเป็นไปได้: 🟢 เป็นไปได้สูง (Highly Feasible)**

ระบบแชทสามารถทำได้เพราะ:
1. ✅ Nuxt 4 รองรับ WebSocket
2. ✅ มี Infrastructure พร้อมแล้ว (Auth, DB, File Upload)
3. ✅ Socket.io compatible กับ Nitro server
4. ✅ Requirements ชัดเจน (Student-Tutor chat, File upload, Admin view)

**Recommended Approach:**
1. สร้าง branch `features/chat-system` จาก `dev`
2. สร้าง database migration scripts
3. Setup Socket.io server plugin
4. สร้าง API endpoints
5. สร้าง UI components
6. ทดสอบ real-time messaging

**Estimated Time:**
- Database & API: 2-3 days
- Socket.io Integration: 1-2 days
- UI Components: 3-4 days
- Testing & Bug Fixes: 1-2 days
- **Total: ~7-11 days**

