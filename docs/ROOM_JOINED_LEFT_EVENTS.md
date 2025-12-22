# 📡 Socket.IO Room Events: `room_joined` และ `room_left`

## 🔍 คำอธิบาย

### `room_joined` Event
- **Purpose**: Server ส่ง event นี้กลับมาเมื่อ client join room สำเร็จ
- **เมื่อไหร่**: หลังจาก client emit `join_room` และ server verify access แล้ว
- **Data**: `{ roomId: number }`
- **ใช้ทำอะไร**: 
  - Confirm ว่า join สำเร็จ
  - Load messages เมื่อ join สำเร็จ
  - Update UI state

### `room_left` Event
- **Purpose**: Server ส่ง event นี้กลับมาเมื่อ client leave room สำเร็จ
- **เมื่อไหร่**: หลังจาก client emit `leave_room`
- **Data**: `{ roomId: number }`
- **ใช้ทำอะไร**:
  - Confirm ว่า leave สำเร็จ
  - Clean up local state

---

## 🔄 Flow

### Join Room Flow:
```
1. Client: socket.emit('join_room', { roomId: 1 })
2. Server: verifyRoomAccess(userId, roomId)
3. Server: socket.join(`room:${roomId}`)
4. Server: socket.emit('room_joined', { roomId: 1 })  ← ส่งกลับมา
5. Client: socket.on('room_joined', (data) => { ... })
```

### Leave Room Flow:
```
1. Client: socket.emit('leave_room', { roomId: 1 })
2. Server: socket.leave(`room:${roomId}`)
3. Server: socket.emit('room_left', { roomId: 1 })  ← ส่งกลับมา
4. Client: socket.on('room_left', (data) => { ... })
```

---

## 💡 วิธีใช้

### ใน `useChatSocket.ts`:
```typescript
socket.value.once('room_joined', (data: { roomId: number }) => {
  console.log(`✅ Successfully joined room ${data.roomId}`)
})
```

### ใน `useChat.ts`:
```typescript
socketOn('room_joined', (data: { roomId: number }) => {
  console.log(`✅ Room ${data.roomId} joined successfully`)
  
  // Load messages when room is joined
  if (activeRoom.value?.id === data.roomId) {
    loadMessages(data.roomId, 50, 0)
  }
})
```

---

## ⚠️ ปัญหาที่พบ

### ปัญหา: `connected: false` เมื่อ `setActiveRoom` ถูกเรียก
- **สาเหตุ**: Socket.IO ยังไม่ได้ connect เมื่อเลือก room
- **แก้ไข**: 
  - รอให้ Socket.IO connect ก่อน
  - หรือ join room เมื่อ connect แล้ว

### ปัญหา: ไม่ได้ใช้ `room_joined` event
- **สาเหตุ**: ใช้ `socket.once()` ใน `joinRoom()` แต่ไม่ได้ใช้ประโยชน์
- **แก้ไข**: ใช้ `socketOn()` ใน `setupChatEventListeners()` แทน

---

## ✅ Best Practices

1. **Always listen to `room_joined`**: เพื่อ confirm ว่า join สำเร็จ
2. **Load messages on `room_joined`**: เพื่อให้มี messages พร้อมเมื่อเปิด room
3. **Handle connection delay**: รอให้ Socket.IO connect ก่อน join room
4. **Clean up on `room_left`**: ลบ messages หรือ reset state เมื่อ leave room

