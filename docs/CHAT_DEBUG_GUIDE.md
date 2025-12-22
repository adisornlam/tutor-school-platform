# 🔍 Chat Debug Guide - ตรวจสอบปัญหา "T7" ไม่ขึ้น

## 📋 สรุปปัญหา
ข้อความ "T7" ไม่แสดงทั้งฝั่งผู้ส่งและผู้รับ

## 🔧 Logging ที่เพิ่มเข้าไป

### 1. **Client-side Logging**

#### `ChatInput.vue`
- `[ChatInput] 🎯 handleSend called` - เมื่อกดส่งข้อความ
- `[ChatInput] ⚠️ Cannot send (canSend is false)` - ถ้าไม่สามารถส่งได้
- `[ChatInput] ✅ Proceeding with send...` - เมื่อเริ่มส่ง
- `[ChatInput] 📤 Emitting send-message event` - เมื่อ emit event
- `[ChatInput] ✅ send-message event emitted` - เมื่อ emit สำเร็จ

#### `chat/index.vue`
- `[Chat Page] 🎯 handleSendMessage called` - เมื่อรับ event จาก ChatInput
- `[Chat Page] ❌ No active room` - ถ้าไม่มี active room
- `[Chat Page] ⚠️ Already sending a message` - ถ้ากำลังส่งอยู่
- `[Chat Page] ✅ Sending state set to true` - เมื่อตั้งค่า sending state
- `[Chat Page] 📤 Calling sendMessage composable` - เมื่อเรียก sendMessage
- `[Chat Page] ✅ sendMessage completed successfully` - เมื่อส่งสำเร็จ
- `[Chat Page] ❌ Error in handleSendMessage` - เมื่อเกิด error
- `[Chat Page] 🔄 Sending state reset to false` - เมื่อ reset sending state

#### `useChat.ts`
- `[Chat] 🚀 sendMessage called` - เมื่อเริ่มส่งข้อความ
- `[Chat] ✅ Message marked as sending` - เมื่อ mark message เป็น sending
- `[Chat] ⚠️ Message already being sent` - ถ้าข้อความกำลังส่งอยู่
- `[Chat] 📤 Sending message via REST API` - เมื่อส่ง REST API
- `[Chat] 📥 REST API response received` - เมื่อรับ response
- `[Chat] ✅ Replaced optimistic message` - เมื่อแทนที่ optimistic message
- `[Chat] ❌ Error sending message via REST API` - เมื่อเกิด error

### 2. **Server-side Logging**

#### `messages.post.ts`
- `[API] 📨 POST /chat/rooms/[roomId]/messages called` - เมื่อรับ request
- `[API] ❌ Invalid room ID` - ถ้า room ID ไม่ถูกต้อง
- `[API] ❌ Message content or file is required` - ถ้าไม่มี content
- `[API] 💾 Saving message to database...` - เมื่อบันทึก database
- `[API] ✅ Message saved to database` - เมื่อบันทึกสำเร็จ
- `[API] 🔍 Room X has Y connected socket(s)` - จำนวน sockets ใน room
- `[API] 👥 Users in room X` - รายชื่อ users ใน room
- `[API] ✅ Emitted 'new_message' to room X` - เมื่อ emit Socket.IO สำเร็จ
- `[API] ❌ Error emitting to room X` - เมื่อ emit ผิดพลาด

## 🔍 วิธีตรวจสอบปัญหา

### Step 1: เปิด Browser Console
1. เปิดหน้า chat (`http://localhost:4000/chat`)
2. เปิด Browser DevTools (F12)
3. ไปที่ tab "Console"
4. กรอง logs ด้วยคำว่า `[ChatInput]`, `[Chat Page]`, `[Chat]`

### Step 2: เปิด Terminal (Server Logs)
1. ดู terminal ที่รัน `npm run dev` หรือ `bun run dev`
2. กรอง logs ด้วยคำว่า `[API]`, `[Socket.IO]`

### Step 3: ส่งข้อความ "T7"
1. พิมพ์ "T7" ในช่องข้อความ
2. กด Enter หรือกดปุ่มส่ง
3. ตรวจสอบ logs ทั้งฝั่ง client และ server

## 🎯 Flow การส่งข้อความ (Expected)

```
1. [ChatInput] 🎯 handleSend called
   ↓
2. [ChatInput] ✅ Proceeding with send...
   ↓
3. [ChatInput] 📤 Emitting send-message event
   ↓
4. [Chat Page] 🎯 handleSendMessage called
   ↓
5. [Chat Page] 📤 Calling sendMessage composable
   ↓
6. [Chat] 🚀 sendMessage called
   ↓
7. [Chat] 📤 Sending message via REST API
   ↓
8. [API] 📨 POST /chat/rooms/[roomId]/messages called
   ↓
9. [API] 💾 Saving message to database...
   ↓
10. [API] ✅ Message saved to database
   ↓
11. [API] ✅ Emitted 'new_message' to room X
   ↓
12. [Chat] 📥 REST API response received
   ↓
13. [Chat] ✅ Replaced optimistic message
   ↓
14. [Chat Page] ✅ sendMessage completed successfully
```

## 🐛 สาเหตุที่เป็นไปได้

### 1. **ไม่เห็น log `[ChatInput] 🎯 handleSend called`**
**สาเหตุ:**
- `canSend` เป็น `false`
- ปุ่มส่งถูก disable
- มี error ใน `handleSend`

**วิธีแก้:**
- ตรวจสอบว่า `messageText` มีค่าหรือไม่
- ตรวจสอบว่า `uploading` หรือ `sending` เป็น `true` หรือไม่
- ตรวจสอบว่า `activeRoom` มีค่าหรือไม่

### 2. **เห็น log `[ChatInput]` แต่ไม่เห็น `[Chat Page]`**
**สาเหตุ:**
- Event ไม่ถูก emit
- Event listener ไม่ทำงาน
- Component ไม่ได้ mount

**วิธีแก้:**
- ตรวจสอบว่า `@send-message` handler ถูก bind หรือไม่
- ตรวจสอบว่า `ChatWindow` component render หรือไม่

### 3. **เห็น log `[Chat Page]` แต่ไม่เห็น `[Chat] 🚀 sendMessage called`**
**สาเหตุ:**
- `sendMessage` composable ไม่ถูกเรียก
- มี error ก่อนเรียก `sendMessage`
- `activeRoom` เป็น `null`

**วิธีแก้:**
- ตรวจสอบว่า `activeRoom.value` มีค่าหรือไม่
- ตรวจสอบว่า `sending.value` เป็น `false` หรือไม่

### 4. **เห็น log `[Chat] 📤 Sending message via REST API` แต่ไม่เห็น `[API] 📨 POST`**
**สาเหตุ:**
- Network error
- API endpoint ไม่ถูกต้อง
- Authentication token หมดอายุ

**วิธีแก้:**
- ตรวจสอบ Network tab ใน Browser DevTools
- ตรวจสอบว่า API endpoint ถูกต้อง
- ตรวจสอบว่า access token ยัง valid หรือไม่

### 5. **เห็น log `[API] ✅ Message saved` แต่ไม่เห็น Socket.IO emit**
**สาเหตุ:**
- Socket.IO ไม่ได้ connect
- ไม่มี users ใน room
- Socket.IO emit error

**วิธีแก้:**
- ตรวจสอบว่า Socket.IO connected หรือไม่
- ตรวจสอบว่า users join room หรือไม่
- ตรวจสอบ Socket.IO logs

### 6. **เห็น log `[API] ✅ Emitted 'new_message'` แต่ไม่เห็นข้อความใน UI**
**สาเหตุ:**
- Client ไม่ได้ listen event
- Message ถูก filter ออก (เช่น own message)
- Vue reactivity ไม่ทำงาน

**วิธีแก้:**
- ตรวจสอบว่า `setupChatEventListeners` ถูกเรียกหรือไม่
- ตรวจสอบว่า `socketOn('new_message')` ทำงานหรือไม่
- ตรวจสอบว่า message ถูก filter ออกหรือไม่

## 📝 Checklist การ Debug

- [ ] Browser Console แสดง logs จาก `[ChatInput]`
- [ ] Browser Console แสดง logs จาก `[Chat Page]`
- [ ] Browser Console แสดง logs จาก `[Chat]`
- [ ] Terminal แสดง logs จาก `[API]`
- [ ] Terminal แสดง logs จาก `[Socket.IO]`
- [ ] Network tab แสดง POST request ไปที่ `/api/chat/rooms/[roomId]/messages`
- [ ] Network tab แสดง response status 200
- [ ] Socket.IO connection status เป็น "connected"
- [ ] Users join room สำเร็จ

## 🚀 Next Steps

1. **Login เข้าระบบ** (ถ้ายังไม่ได้ login)
2. **เปิดหน้า chat** (`http://localhost:4000/chat`)
3. **เปิด Browser Console** (F12)
4. **เปิด Terminal** (ดู server logs)
5. **ส่งข้อความ "T7"**
6. **ตรวจสอบ logs** ตาม flow ข้างต้น
7. **ระบุจุดที่ log หยุด** เพื่อหาสาเหตุ

