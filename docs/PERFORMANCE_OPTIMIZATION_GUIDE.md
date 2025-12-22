# 🚀 Performance Optimization Guide - แชท 100 คนพร้อมกัน

## ⚠️ สรุปปัญหา

**Current Status:** ⚠️ **ไม่รองรับ 100 คนพร้อมกัน**

**Bottleneck หลัก:**
1. 🔴 **Database Connection Pool:** `connectionLimit: 10` → ต้องรองรับ 100 requests
2. 🟡 **Multiple Queries per Message:** 2-3 queries per message
3. 🟡 **Socket.IO fetchSockets():** Overhead เมื่อมี sockets มาก

---

## ✅ Quick Fixes (ทำได้ทันที)

### 1. **เพิ่ม Database Connection Pool** 🔴 **Priority: Critical**

**File:** `server/utils/db.ts`

```typescript
// ❌ ปัจจุบัน
connectionLimit: 10

// ✅ แก้ไขเป็น
connectionLimit: 50, // หรือมากกว่า
```

**ผลลัพธ์:**
- ✅ รองรับ concurrent requests เพิ่มขึ้น 5 เท่า
- ✅ ลด connection timeout errors

---

### 2. **ลด fetchSockets() Calls** 🟡 **Priority: High**

**File:** `server/api/chat/rooms/[roomId]/messages.post.ts`

```typescript
// ❌ ปัจจุบัน - fetch sockets ทุกครั้ง
const roomSockets = await io.in(`room:${roomId}`).fetchSockets()
console.log(`[API] 🔍 Room ${roomId} has ${roomSockets.length} connected socket(s)`)

// ✅ แก้ไข - emit โดยตรง (ไม่ต้อง fetch)
// ลบ fetchSockets() ถ้าไม่จำเป็นต้อง log
io.to(`room:${roomId}`).emit('new_message', message)
```

**ผลลัพธ์:**
- ✅ ลด CPU overhead
- ✅ ลด latency

---

### 3. **Cache Room Info** 🟡 **Priority: Medium**

**File:** `server/api/chat/rooms/[roomId]/messages.post.ts`

```typescript
// เพิ่ม simple cache
const roomCache = new Map<number, { room: ChatRoom, expires: number }>()

// ใน messages.post.ts
const getCachedRoom = async (roomId: number) => {
  const cached = roomCache.get(roomId)
  if (cached && cached.expires > Date.now()) {
    return cached.room
  }
  
  const room = await getChatRoom(roomId)
  roomCache.set(roomId, {
    room,
    expires: Date.now() + 60000 // Cache 1 นาที
  })
  return room
}
```

**ผลลัพธ์:**
- ✅ ลด database queries
- ✅ ลด latency

---

## 🔧 Advanced Optimizations

### 1. **Message Queue (Redis/Bull)** 🟡 **Priority: Medium**

**Install:**
```bash
npm install bull ioredis
```

**Setup:**
```typescript
// server/utils/queue.ts
import Queue from 'bull'
import Redis from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379')
})

export const messageQueue = new Queue('messages', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  }
})

// Worker
messageQueue.process('send', 10, async (job) => {
  const { roomId, message, userId } = job.data
  
  // Save to database
  const savedMessage = await saveMessage(message)
  
  // Emit via Socket.IO
  const io = (useNitroApp() as any).io
  if (io) {
    io.to(`room:${roomId}`).emit('new_message', savedMessage)
  }
  
  return savedMessage
})
```

**Usage:**
```typescript
// ใน messages.post.ts
await messageQueue.add('send', {
  roomId,
  message: {
    room_id: roomId,
    sender_id: auth.userId,
    // ...
  },
  userId: auth.userId
})

// Return immediately
return { success: true, queued: true }
```

**ผลลัพธ์:**
- ✅ API response ทันที
- ✅ Database writes เป็น background
- ✅ Better error handling

---

### 2. **Batch Database Operations** 🟡 **Priority: Medium**

**File:** `server/services/chat.service.ts`

```typescript
// เพิ่ม batch insert function
export async function batchSaveMessages(
  messages: Array<{
    room_id: number
    sender_id: number
    content: string | null
    message_type: 'text' | 'image' | 'file' | 'system'
    // ...
  }>
): Promise<ChatMessage[]> {
  if (messages.length === 0) return []
  
  // Build batch INSERT
  const values = messages.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, FALSE)').join(', ')
  const params = messages.flatMap(m => [
    m.room_id,
    m.sender_id,
    m.message_type,
    m.content,
    m.file_url || null,
    m.file_name || null,
    m.file_size || null,
    m.file_type || null
  ])
  
  await execute(
    `INSERT INTO chat_messages 
     (room_id, sender_id, message_type, content, file_url, file_name, file_size, file_type, is_read)
     VALUES ${values}`,
    params
  )
  
  // Return saved messages
  // ...
}
```

**ผลลัพธ์:**
- ✅ ลด database round trips
- ✅ เพิ่ม throughput

---

### 3. **Socket.IO Redis Adapter** 🟢 **Priority: Low**

**Install:**
```bash
npm install @socket.io/redis-adapter
```

**Setup:**
```typescript
// server/plugins/socket.io.ts
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'

const pubClient = createClient({ url: 'redis://localhost:6379' })
const subClient = pubClient.duplicate()

await Promise.all([pubClient.connect(), subClient.connect()])

io.adapter(createAdapter(pubClient, subClient))
```

**ผลลัพธ์:**
- ✅ รองรับ multiple server instances
- ✅ Load balancing

---

## 📊 Performance Comparison

### **Before Optimization:**
```
100 concurrent messages:
- Connection pool: 10 → 90 requests wait
- Database writes: 10-50 seconds
- Socket.IO emits: 100-500ms
- Total: 10-50 seconds ⚠️
```

### **After Quick Fixes:**
```
100 concurrent messages:
- Connection pool: 50 → 50 requests wait
- Database writes: 2-10 seconds
- Socket.IO emits: 50-200ms
- Total: 2-10 seconds 🟡
```

### **After Advanced Optimizations:**
```
100 concurrent messages:
- Message queue: Immediate response
- Database writes: Background (1-3 seconds)
- Socket.IO emits: 50-200ms
- Total: <1 second ✅
```

---

## 🎯 Implementation Priority

### **Phase 1: Quick Fixes (1-2 hours)**
1. ✅ เพิ่ม connection pool เป็น 50
2. ✅ ลด fetchSockets() calls
3. ✅ เพิ่ม room cache

**Expected improvement:** 50-70% faster

### **Phase 2: Message Queue (4-8 hours)**
1. ✅ Setup Redis
2. ✅ Setup Bull queue
3. ✅ Migrate message sending to queue

**Expected improvement:** 80-90% faster

### **Phase 3: Advanced (1-2 days)**
1. ✅ Batch operations
2. ✅ Redis adapter
3. ✅ Load balancing

**Expected improvement:** 95%+ faster

---

## 🧪 Testing

### **Load Test Script:**
```typescript
// scripts/load-test-chat.ts
import axios from 'axios'

const API_URL = 'http://localhost:4000/api'
const TOKEN = 'your-test-token'
const ROOM_ID = 1

async function sendMessage(userId: number) {
  try {
    const start = Date.now()
    await axios.post(
      `${API_URL}/chat/rooms/${ROOM_ID}/messages`,
      {
        content: `Test message from user ${userId}`,
        message_type: 'text'
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    )
    const duration = Date.now() - start
    console.log(`User ${userId}: ${duration}ms`)
    return duration
  } catch (error) {
    console.error(`User ${userId} failed:`, error.message)
    return -1
  }
}

async function loadTest() {
  const users = 100
  const promises = Array.from({ length: users }, (_, i) => sendMessage(i + 1))
  const results = await Promise.all(promises)
  
  const successful = results.filter(r => r > 0)
  const avgTime = successful.reduce((a, b) => a + b, 0) / successful.length
  const maxTime = Math.max(...successful)
  const minTime = Math.min(...successful)
  
  console.log(`\nResults:`)
  console.log(`Total: ${users}`)
  console.log(`Successful: ${successful.length}`)
  console.log(`Failed: ${users - successful.length}`)
  console.log(`Avg time: ${avgTime.toFixed(2)}ms`)
  console.log(`Max time: ${maxTime}ms`)
  console.log(`Min time: ${minTime}ms`)
}

loadTest()
```

---

## 📈 Monitoring

### **Key Metrics:**
- Database connection pool usage
- Socket.IO connection count
- Message queue length
- Response times (p50, p95, p99)
- Error rates

### **Tools:**
- PM2 monitoring
- New Relic / Datadog
- Custom metrics endpoint

---

## ✅ Conclusion

**Current:** ⚠️ **ไม่รองรับ 100 คนพร้อมกัน** (connection pool 10)

**After Quick Fixes:** 🟡 **รองรับได้บางส่วน** (connection pool 50)

**After Full Optimization:** ✅ **รองรับได้เต็มที่** (message queue + optimizations)

