# 🔌 คู่มือการตั้งค่า Socket.IO

**วันที่**: 23 ธันวาคม 2024  
**เวอร์ชัน**: 1.0.0

---

## 📋 สรุปการตั้งค่า Socket.IO

### ✅ **สิ่งที่ต้องทำ**

Socket.IO ในระบบนี้**ไม่ต้องตั้งค่าพิเศษมาก** เพราะ Nuxt 4 + Nitro รองรับ WebSocket อยู่แล้ว และระบบได้ตั้งค่าไว้แล้วส่วนใหญ่

---

## 🎯 สิ่งที่ตั้งค่าไว้แล้ว (Already Configured)

### 1. **nuxt.config.ts - WebSocket Configuration**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    experimental: {
      websocket: true  // ✅ เปิดใช้งาน WebSocket
    },
    port: 4000
  }
})
```

**หมายเหตุ**: ต้องตั้งค่า `experimental.websocket: true` เพื่อให้ Nitro รองรับ WebSocket

---

### 2. **package.json - Dependencies**

```json
{
  "dependencies": {
    "socket.io": "^4.8.1",           // ✅ Server-side
    "socket.io-client": "^4.8.1"     // ✅ Client-side
  }
}
```

**หมายเหตุ**: ติดตั้งแล้ว ไม่ต้องติดตั้งเพิ่ม

---

### 3. **server/plugins/socket.io.ts - Server Setup**

✅ **ตั้งค่าไว้แล้ว**:
- Socket.IO Server initialization
- Authentication middleware
- Connection handling
- Room joining logic (`user:`, `room:`, `course:`)

---

## ⚙️ การตั้งค่าที่ต้องทำ (Required Configuration)

### 1. **Environment Variables (.env)**

**ไม่จำเป็นต้องตั้งค่าพิเศษ** - Socket.IO ใช้ Port เดียวกับ Nuxt Server (4000)

ถ้าต้องการตั้งค่าพิเศษ สามารถเพิ่มได้:

```bash
# .env (Optional)
SOCKET_IO_PORT=4000          # ใช้ Port เดียวกับ Nuxt (default)
SOCKET_IO_CORS_ORIGIN=*      # CORS origin (default: *)
SOCKET_IO_PATH=/socket.io    # Socket.IO path (default: /socket.io)
```

---

### 2. **Client-Side Connection**

ต้องเชื่อมต่อ Socket.IO ใน Client-side:

```typescript
// app/composables/useSocket.ts หรือ useChat.ts
import { io, Socket } from 'socket.io-client'

export const useSocket = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth() // JWT token
  
  const socket = ref<Socket | null>(null)
  
  const connect = () => {
    if (socket.value?.connected) return
    
    socket.value = io(window.location.origin, {  // ใช้ domain เดียวกัน
      auth: {
        token: token.value  // ส่ง JWT token
      },
      transports: ['websocket', 'polling'],  // รองรับทั้ง WebSocket และ Polling
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })
    
    socket.value.on('connect', () => {
      console.log('✅ Socket.IO connected')
    })
    
    socket.value.on('disconnect', () => {
      console.log('❌ Socket.IO disconnected')
    })
  }
  
  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
  }
  
  return {
    socket: readonly(socket),
    connect,
    disconnect
  }
}
```

---

## 🔐 Authentication Configuration

### Server-Side (Already Configured)

```typescript
// server/plugins/socket.io.ts
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || 
                 socket.handshake.headers.authorization?.replace('Bearer ', '') ||
                 socket.handshake.query.token as string
    
    if (!token) {
      return next(new Error('Authentication token required'))
    }
    
    // Verify JWT token
    const user = await verifyToken(token)
    socket.data.user = user
    socket.data.userId = user.id
    
    next()
  } catch (error) {
    next(new Error('Authentication failed'))
  }
})
```

### Client-Side (ต้องทำ)

```typescript
// Client-side - ส่ง token ไปกับ connection
const socket = io(window.location.origin, {
  auth: {
    token: 'your-jwt-token-here'
  }
})
```

---

## 📁 File Structure

```
server/
  └── plugins/
      └── socket.io.ts          # ✅ Server-side Socket.IO setup (มีอยู่แล้ว)

app/
  └── composables/
      └── useSocket.ts          # ⚠️ Client-side Socket.IO (ต้องสร้าง)
      └── useChat.ts            # ✅ Chat composable (อาจมีอยู่แล้ว)
```

---

## 🚀 Implementation Checklist

### Server-Side (✅ Done)

- [x] Enable WebSocket in `nuxt.config.ts`
- [x] Install `socket.io` package
- [x] Create `server/plugins/socket.io.ts`
- [x] Setup authentication middleware
- [x] Setup connection handling
- [x] Setup room joining logic

### Client-Side (⚠️ May Need)

- [ ] Create `app/composables/useSocket.ts` (ถ้ายังไม่มี)
- [ ] Connect Socket.IO in component/composable
- [ ] Handle reconnection
- [ ] Handle authentication

---

## 🔍 ตรวจสอบการตั้งค่า

### 1. **ตรวจสอบ Server**

```bash
# เริ่ม dev server
bun run dev

# ตรวจสอบ Console logs
# ควรเห็น: "[Socket.IO] Server initialized"
```

### 2. **ตรวจสอบ Client Connection**

```typescript
// ใน Browser Console
const socket = io('http://localhost:4000', {
  auth: { token: 'your-token' }
})

socket.on('connect', () => {
  console.log('Connected!', socket.id)
})
```

### 3. **ตรวจสอบ Room Joining**

ดู Server logs ควรเห็น:
```
[Socket.IO] ✅ User connected: 1 (John Doe)
[Socket.IO] 👤 User 1 joined personal room: user:1
[Socket.IO] 🏠 User 1 joined room 1 (course 1, student 9, tutor 3)
```

---

## ⚠️ ปัญหาที่อาจพบและวิธีแก้ไข

### 1. **WebSocket connection failed**

**ปัญหา**: Client ไม่สามารถเชื่อมต่อได้

**วิธีแก้**:
- ตรวจสอบว่า `nitro.experimental.websocket: true` ใน `nuxt.config.ts`
- ตรวจสอบว่า Server รันอยู่
- ตรวจสอบ CORS settings (ถ้าใช้ domain ต่างกัน)

### 2. **Authentication failed**

**ปัญหา**: Connection ถูก reject

**วิธีแก้**:
- ตรวจสอบว่า JWT token ถูกส่งไป
- ตรวจสอบว่า token ยังไม่หมดอายุ
- ตรวจสอบ Server logs สำหรับ error details

### 3. **Room not joining**

**ปัญหา**: User ไม่ได้ join room ที่ต้องการ

**วิธีแก้**:
- ตรวจสอบ Database (มี chat_rooms, enrollments หรือไม่)
- ตรวจสอบ Server logs สำหรับ error
- ตรวจสอบ Room joining logic ใน `server/plugins/socket.io.ts`

### 4. **Port conflict**

**ปัญหา**: Port 4000 ถูกใช้แล้ว

**วิธีแก้**:
```bash
# เปลี่ยน port ใน nuxt.config.ts
nitro: {
  port: 4001  # หรือ port อื่น
}
```

---

## 📚 ตัวอย่างการใช้งาน

### Client-Side Example

```vue
<script setup lang="ts">
import { io } from 'socket.io-client'
import { useAuth } from '@/composables/useAuth'

const { token } = useAuth()
const socket = ref(null)

onMounted(() => {
  socket.value = io(window.location.origin, {
    auth: { token: token.value }
  })
  
  socket.value.on('connect', () => {
    console.log('Connected!')
  })
  
  socket.value.on('new_message', (message) => {
    console.log('New message:', message)
  })
})

onBeforeUnmount(() => {
  socket.value?.disconnect()
})
</script>
```

---

## 💡 Best Practices

### 1. **Connection Management**

- ✅ Connect เมื่อ component mount
- ✅ Disconnect เมื่อ component unmount
- ✅ Handle reconnection automatically

### 2. **Authentication**

- ✅ ส่ง token ผ่าน `auth.token`
- ✅ Re-authenticate เมื่อ token หมดอายุ
- ✅ Handle authentication errors

### 3. **Error Handling**

- ✅ Handle connection errors
- ✅ Handle authentication errors
- ✅ Handle room joining errors

### 4. **Performance**

- ✅ Reuse connection (don't create multiple connections)
- ✅ Disconnect when not needed
- ✅ Use room-based messaging (don't broadcast to everyone)

---

## 📊 Summary

### ✅ **สิ่งที่ตั้งค่าไว้แล้ว:**
1. WebSocket enabled ใน `nuxt.config.ts`
2. Socket.IO packages ติดตั้งแล้ว
3. Server-side setup (`server/plugins/socket.io.ts`)
4. Authentication middleware
5. Room joining logic

### ⚠️ **สิ่งที่ต้องทำ:**
1. Client-side connection (ใน composable หรือ component)
2. Send JWT token ไปกับ connection
3. Handle events (connect, disconnect, messages)

### 🎯 **สรุป:**
**Socket.IO ไม่ต้องตั้งค่าพิเศษมาก** - ระบบตั้งค่าไว้แล้วส่วนใหญ่ แค่ต้องเชื่อมต่อใน Client-side และส่ง JWT token ไป

---

*เอกสารนี้สรุปการตั้งค่า Socket.IO สำหรับ Tutor School Platform วันที่ 23 ธันวาคม 2024*

