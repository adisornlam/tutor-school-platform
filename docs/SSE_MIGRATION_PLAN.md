# 📋 แผนการเปลี่ยนจาก Socket.IO ไปใช้ SSE (Server-Sent Events)

## 🎯 เป้าหมาย
เปลี่ยนจาก Socket.IO ไปใช้ SSE สำหรับ real-time chat updates

---

## 📊 วิเคราะห์การใช้งาน Socket.IO ปัจจุบัน

### 1. Server-side
- **ไฟล์**: `server/plugins/socket.io.ts`
  - Initialize Socket.IO server
  - Authentication middleware
  - Event handlers: `connection`, `join_room`, `leave_room`, `send_message`, `typing`, `mark_read`
  - Redis adapter สำหรับ scaling

### 2. Client-side
- **ไฟล์**: `app/composables/useChat.ts`
  - Socket.IO client connection
  - Event listeners: `connect`, `disconnect`, `new_message`, `typing`, `messages_read`
  - Auto-reconnect logic
  - Fallback to REST API

### 3. API Routes ที่ใช้ Socket.IO
- **ไฟล์**: `server/api/chat/rooms/[roomId]/messages.post.ts`
  - Emit `new_message` event หลังจากบันทึกข้อความ
- **ไฟล์**: `server/api/notify.post.ts`
  - Example API route สำหรับ emit events

### 4. Routes
- `server/routes/socket.io.ts` - Socket.IO route handler
- `server/routes/websocket.ts` - WebSocket route handler

---

## 🏗️ SSE Architecture Design

### ข้อดีของ SSE
- ✅ ง่ายกว่า Socket.IO (ไม่ต้อง install package เพิ่ม)
- ✅ ใช้ HTTP standard (ไม่ต้อง WebSocket upgrade)
- ✅ Auto-reconnect built-in
- ✅ ทำงานได้ดีกับ Nuxt 4 / H3
- ✅ One-way communication (server → client) เพียงพอสำหรับ chat notifications

### ข้อจำกัด
- ❌ One-way only (server → client)
- ❌ ต้องใช้ REST API สำหรับส่งข้อความ (ซึ่งทำอยู่แล้ว)

### Architecture
```
Client                    Server
  │                         │
  │─── GET /api/chat/events ──>│ (SSE connection)
  │<── SSE Stream ─────────│
  │                         │
  │─── POST /api/chat/rooms/[id]/messages ──>│ (Send message)
  │<── 200 OK ──────────────│
  │                         │
  │                         │ (Save to DB)
  │                         │─── Emit SSE event ──>│
  │<── event: new_message ──│
  │                         │
```

---

## 📝 Implementation Plan

### Phase 1: สร้าง SSE Infrastructure
1. สร้าง SSE endpoint: `server/api/chat/events.get.ts`
2. สร้าง SSE event emitter utility: `server/utils/sse.ts`
3. สร้าง SSE client composable: `app/composables/useChatSSE.ts`

### Phase 2: อัปเดต Chat System
4. อัปเดต `useChat.ts` ให้ใช้ SSE แทน Socket.IO
5. อัปเดต API routes ให้ emit SSE events แทน Socket.IO
6. ลบ Socket.IO code ทั้งหมด

### Phase 3: Cleanup
7. ลบ Socket.IO files
8. Uninstall Socket.IO packages
9. ลบ Socket.IO documentation

---

## 🔧 SSE Implementation Details

### Server-side SSE Endpoint
```typescript
// server/api/chat/events.get.ts
export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  // Set SSE headers
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'X-Accel-Buffering', 'no') // Disable nginx buffering
  
  // Send initial connection event
  await sendSSE(event, 'connected', { userId: auth.userId })
  
  // Subscribe to user's chat events
  // ... event subscription logic
  
  // Keep connection alive with heartbeat
  const heartbeat = setInterval(() => {
    sendSSE(event, 'heartbeat', { timestamp: Date.now() })
  }, 30000) // Every 30 seconds
  
  // Cleanup on disconnect
  event.node.req.on('close', () => {
    clearInterval(heartbeat)
    // Unsubscribe from events
  })
})
```

### SSE Event Emitter Utility
```typescript
// server/utils/sse.ts
// Store active SSE connections
const connections = new Map<number, H3Event[]>()

export function subscribeUser(userId: number, event: H3Event) {
  if (!connections.has(userId)) {
    connections.set(userId, [])
  }
  connections.get(userId)!.push(event)
}

export function unsubscribeUser(userId: number, event: H3Event) {
  const userConnections = connections.get(userId)
  if (userConnections) {
    const index = userConnections.indexOf(event)
    if (index > -1) {
      userConnections.splice(index, 1)
    }
  }
}

export async function emitToUser(userId: number, event: string, data: any) {
  const userConnections = connections.get(userId)
  if (userConnections) {
    for (const connection of userConnections) {
      await sendSSE(connection, event, data)
    }
  }
}

export async function emitToRoom(roomId: number, event: string, data: any) {
  // Get all users in room and emit to them
  // ...
}
```

### Client-side SSE Composable
```typescript
// app/composables/useChatSSE.ts
export const useChatSSE = () => {
  const eventSource = ref<EventSource | null>(null)
  const connected = ref(false)
  
  const connect = () => {
    if (eventSource.value) {
      eventSource.value.close()
    }
    
    const { accessToken } = useAuth()
    const config = useRuntimeConfig()
    
    const url = `${config.public.apiBase}/chat/events?token=${accessToken.value}`
    eventSource.value = new EventSource(url)
    
    eventSource.value.onopen = () => {
      connected.value = true
      console.log('[Chat SSE] ✅ Connected')
    }
    
    eventSource.value.onerror = () => {
      connected.value = false
      console.error('[Chat SSE] ❌ Connection error')
      // Auto-reconnect handled by EventSource
    }
    
    // Listen for events
    eventSource.value.addEventListener('new_message', (e) => {
      const message = JSON.parse(e.data)
      // Handle new message
    })
    
    eventSource.value.addEventListener('typing', (e) => {
      const data = JSON.parse(e.data)
      // Handle typing indicator
    })
  }
  
  const disconnect = () => {
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
      connected.value = false
    }
  }
  
  return { connect, disconnect, connected }
}
```

---

## 📋 Files to Delete

1. `server/plugins/socket.io.ts`
2. `server/routes/socket.io.ts`
3. `server/routes/websocket.ts`
4. `server/api/notify.post.ts` (หรืออัปเดตให้ใช้ SSE)
5. Socket.IO documentation files:
   - `docs/SOCKET_IO_*.md`

---

## 📦 Packages to Remove

```json
{
  "socket.io": "^4.7.0",
  "socket.io-client": "^4.7.0",
  "@socket.io/redis-adapter": "^8.2.1"
}
```

---

## ✅ Benefits

1. **ง่ายกว่า**: ไม่ต้องจัดการ WebSocket upgrade, connection state
2. **เบากว่า**: ไม่ต้อง install Socket.IO packages
3. **เสถียรกว่า**: ใช้ HTTP standard, auto-reconnect built-in
4. **เหมาะกับ Chat**: One-way communication เพียงพอสำหรับ notifications

---

*Migration plan created: 2025-01-21*

