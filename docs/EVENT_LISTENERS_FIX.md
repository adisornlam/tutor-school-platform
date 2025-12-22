# 🔧 Event Listeners Fix - แก้ปัญหา Event Listeners ไม่ถูก Attach

## 🎯 ปัญหา

จาก logs:
- Server emit ไปยัง room 1 สำเร็จ
- User 9 อยู่ใน room 1: **true**
- Message จะถูกส่งไปยัง 11 sockets
- **แต่ไม่เห็น logs ฝั่ง client ของ User 9**

**สาเหตุที่เป็นไปได้:**
- Event listeners ไม่ถูก attach
- Socket ยังไม่พร้อมเมื่อ `setupChatEventListeners()` ถูกเรียก
- หรือ listeners ถูก attach แต่ไม่ทำงาน

---

## ✅ การแก้ไข

### 1. **เพิ่ม Retry Logic ใน `setupChatEventListeners`**
```typescript
if (!socket.value) {
  console.warn('[Chat] ⚠️ Socket not available, cannot setup event listeners')
  console.warn('[Chat] ⚠️ Will retry when socket is available...')
  // Retry when socket is available
  const checkSocket = setInterval(() => {
    if (socket.value) {
      console.log('[Chat] ✅ Socket available now, setting up event listeners...')
      clearInterval(checkSocket)
      setupChatEventListeners()
    }
  }, 500)
  setTimeout(() => clearInterval(checkSocket), 10000)
  return
}
```

### 2. **เพิ่ม Logging ใน `setupChatEventListeners`**
```typescript
console.log('[Chat] ✅ Setting up Socket.IO event listeners, socket ID:', socket.value.id)
```

### 3. **ป้องกัน Duplicate Listeners**
```typescript
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
  }
}
```

### 4. **รอ Socket ใน `onMounted`**
```typescript
// Wait for socket to be available
let socketAttempts = 0
while (!socket.value && socketAttempts < 20) {
  await new Promise(resolve => setTimeout(resolve, 100))
  socketAttempts++
}

if (socket.value) {
  console.log('[Chat Page] ✅ Socket available, setting up event listeners, socket ID:', socket.value.id)
  setupChatEventListeners()
} else {
  console.warn('[Chat Page] ⚠️ Socket not available after waiting, will retry in setupChatEventListeners')
  setupChatEventListeners() // Will retry internally
}
```

---

## 📋 Expected Logs

### **เมื่อ Setup สำเร็จ:**
```
[Chat Page] 🚀 Mounting chat page, setting up Socket.IO...
[Chat Page] 🔌 Connecting Socket.IO...
[Chat Socket] ✅ Connected to server, socket ID: xxx
[Chat Page] ✅ Socket.IO already connected
[Chat Page] 👂 Setting up event listeners...
[Chat Page] ✅ Socket available, setting up event listeners, socket ID: xxx
[Chat] ✅ Setting up Socket.IO event listeners, socket ID: xxx
[Chat Socket] 👂 Listening to event: new_message
[Chat Socket] 👂 Listening to event: user_typing
[Chat Socket] 👂 Listening to event: stop_typing
[Chat Socket] 👂 Listening to event: messages_read
[Chat Socket] 👂 Listening to event: room_joined
[Chat Socket] 👂 Listening to event: room_left
[Chat Socket] 👂 Listening to event: error
```

### **เมื่อรับข้อความ:**
```
[Chat] 📨 Socket.IO event: new_message received: {id: 52, ...}
[Chat] ✅ Message added from Socket.IO: {messageId: 52, ...}
[Chat] 🔄 sortedMessages computed: {roomId: 1, count: X, ...}
[Chat] 📏 Message count changed: {oldLength: X, newLength: X+1, ...}
```

---

## 🧪 การทดสอบ

### **Step 1: ตรวจสอบ Event Listeners**
1. เปิด Browser Console
2. ตรวจสอบว่าเห็น logs:
   - `[Chat Socket] 👂 Listening to event: new_message`
   - `[Chat] ✅ Setting up Socket.IO event listeners`

### **Step 2: ตรวจสอบ Message Receiving**
1. ส่งข้อความจาก User อื่น
2. ตรวจสอบว่าเห็น logs:
   - `[Chat] 📨 Socket.IO event: new_message received`
   - `[Chat] ✅ Message added from Socket.IO`

### **Step 3: ตรวจสอบ UI Update**
1. ตรวจสอบว่า UI แสดงข้อความใหม่
2. ตรวจสอบว่า `sortedMessages` computed property trigger

---

## 🚀 Next Steps

1. ✅ เพิ่ม retry logic
2. ✅ เพิ่ม logging
3. ✅ ป้องกัน duplicate listeners
4. ⏳ ทดสอบการรับข้อความ
5. ⏳ ตรวจสอบว่า UI อัปเดต

