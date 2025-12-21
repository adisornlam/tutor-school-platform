# 💬 Chat System Implementation Guide

## ✅ สิ่งที่ทำเสร็จแล้ว

### 1. Database Schema
- ✅ Migration script: `docs/migrations/add_chat_system_tables.sql`
- ✅ Migration command: `bun run db:migrate-chat-system`
- ✅ Tables: `chat_rooms`, `chat_messages`, `chat_room_participants`

### 2. Dependencies
- ✅ เพิ่มใน `package.json`: `socket.io`, `socket.io-client`, `ioredis`, `@socket.io/redis-adapter`
- ⚠️ **ต้องรัน**: `bun install` เพื่อติดตั้ง dependencies

### 3. Redis Configuration
- ✅ `server/utils/redis.ts` - Redis client utilities
- ✅ Config ใน `nuxt.config.ts`: `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB`
- ✅ รองรับ Redis adapter สำหรับ Socket.io scaling

### 4. Socket.io Server
- ✅ `server/plugins/socket.io.ts` - Socket.io server plugin
- ✅ Authentication middleware
- ✅ Redis adapter support
- ✅ Event handlers: `join_room`, `leave_room`, `send_message`, `typing`, `mark_read`

### 5. Chat Service
- ✅ `server/services/chat.service.ts` - Business logic
- ✅ Functions: `getUserChatRooms`, `getChatRoom`, `createChatRoom`, `saveMessage`, `getChatMessages`, `markMessagesAsRead`, `verifyRoomAccess`, `getAllChatRooms`

### 6. API Endpoints

#### User Endpoints:
- ✅ `GET /api/chat/rooms` - ดูห้องแชททั้งหมดของผู้ใช้
- ✅ `POST /api/chat/rooms` - สร้างห้องแชทใหม่ (Student only)
- ✅ `GET /api/chat/rooms/:roomId` - ดูรายละเอียดห้องแชท
- ✅ `GET /api/chat/rooms/:roomId/messages` - ดูข้อความในห้อง (pagination)
- ✅ `POST /api/chat/upload` - อัพโหลดไฟล์สำหรับแชท

#### Admin Endpoints:
- ✅ `GET /api/admin/chat/rooms` - Admin: ดูห้องแชททั้งหมด (pagination, filters)
- ✅ `GET /api/admin/chat/rooms/:roomId` - Admin: ดูรายละเอียดห้อง

### 7. Types
- ✅ `shared/types/chat.types.ts` - TypeScript interfaces

---

## 🔧 Configuration

### Environment Variables (.env)

```env
# Redis Configuration (for Socket.io scaling)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

**Note**: ถ้าไม่มี Redis หรือยังไม่ได้ setup จะใช้ in-memory adapter (ทำงานได้สำหรับ single instance)

---

## 🚀 ขั้นตอนการ Setup

### 1. Install Dependencies
```bash
bun install
```

### 2. Run Database Migration
```bash
bun run db:migrate-chat-system
```

### 3. Configure Redis (Optional but Recommended)
- ถ้าใช้ cPanel hosting ที่มี Redis:
  - ตั้งค่า `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` ใน `.env`
  - Socket.io จะใช้ Redis adapter อัตโนมัติ
- ถ้าไม่มี Redis:
  - ระบบจะใช้ in-memory adapter
  - ทำงานได้แต่ไม่สามารถ scale หลาย instances ได้

### 4. Test Socket.io Connection
- Start dev server: `bun run dev`
- Check console: ควรเห็น `[Socket.IO] Server initialized`
- Check Redis connection: ควรเห็น `[Socket.IO] Redis adapter initialized` (ถ้ามี Redis)

---

## 📝 สิ่งที่ยังต้องทำ (TODO)

### 1. Client-Side Composable
- [ ] `app/composables/useChat.ts` - Composable สำหรับจัดการ Socket.io connection

### 2. UI Components
- [ ] `app/components/chat/ChatRoomList.vue` - รายการห้องแชท
- [ ] `app/components/chat/ChatWindow.vue` - หน้าต่างแชทหลัก
- [ ] `app/components/chat/ChatMessage.vue` - Component สำหรับแสดงข้อความ
- [ ] `app/components/chat/ChatInput.vue` - Input สำหรับพิมพ์และแนบไฟล์
- [ ] `app/components/chat/FileUpload.vue` - Component สำหรับอัพโหลดไฟล์

### 3. Pages
- [ ] `app/pages/chat/index.vue` - หน้าหลักสำหรับแชท (Student/Tutor)
- [ ] `app/pages/chat/[roomId].vue` - หน้าแชทรายห้อง
- [ ] `app/pages/admin/chat/index.vue` - Admin: ดูแชททั้งหมด
- [ ] `app/pages/admin/chat/[roomId].vue` - Admin: ดูรายละเอียดแชท

### 4. Menu Integration
- [ ] เพิ่มเมนู "แชท" ใน admin sidebar
- [ ] เพิ่มเมนู "แชท" สำหรับ Student/Tutor

---

## 🔐 Access Control

### Student
- ✅ สร้างห้องแชทกับอาจารย์ได้ (เฉพาะคอร์สที่ลงทะเบียนแล้ว)
- ✅ ส่ง/รับข้อความในห้องแชทของตัวเอง
- ❌ ไม่สามารถดูแชทของคนอื่น

### Tutor
- ✅ ตอบข้อความในห้องแชทที่นักเรียนสร้างไว้
- ✅ ดูห้องแชททั้งหมดที่เกี่ยวข้องกับตัวเอง
- ❌ ไม่สามารถสร้างห้องแชทใหม่ (รอให้นักเรียนสร้างก่อน)

### Admin (system_admin, owner, admin)
- ✅ ดูแชททั้งหมดได้
- ✅ ดูรายละเอียดข้อความทั้งหมด

---

## 📁 File Storage

โครงสร้างการเก็บไฟล์:
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

- Images: Max 5MB (JPEG, PNG, GIF, WebP)
- Files: Max 10MB (PDF, DOC, DOCX, XLS, XLSX, TXT)

---

## 🎯 Socket.io Events

### Client → Server:
- `join_room` - เข้าร่วมห้องแชท
- `leave_room` - ออกจากห้องแชท
- `send_message` - ส่งข้อความ
- `typing` - กำลังพิมพ์
- `stop_typing` - หยุดพิมพ์
- `mark_read` - ทำเครื่องหมายว่าอ่านแล้ว

### Server → Client:
- `room_joined` - เข้าร่วมห้องสำเร็จ
- `room_left` - ออกจากห้องสำเร็จ
- `new_message` - ข้อความใหม่
- `new_message_notification` - แจ้งเตือนข้อความใหม่ (เมื่อไม่ได้อยู่ในห้อง)
- `user_typing` - ผู้ใช้กำลังพิมพ์
- `user_stopped_typing` - ผู้ใช้หยุดพิมพ์
- `messages_read` - ข้อความถูกอ่าน
- `error` - เกิดข้อผิดพลาด

---

## 🐛 Troubleshooting

### Socket.io ไม่ทำงาน
1. ตรวจสอบว่า `experimental.websocket: true` ใน `nuxt.config.ts`
2. ตรวจสอบ console สำหรับ error messages
3. ตรวจสอบว่า dependencies ติดตั้งแล้ว (`bun install`)

### Redis Connection Failed
- ระบบจะ fallback ไปใช้ in-memory adapter อัตโนมัติ
- ทำงานได้แต่ไม่สามารถ scale ได้
- ตรวจสอบ Redis configuration ใน `.env`

### Database Errors
- รัน migration: `bun run db:migrate-chat-system`
- ตรวจสอบว่า tables ถูกสร้างแล้ว

---

## 📚 References

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [Socket.io Redis Adapter](https://socket.io/docs/v4/redis-adapter/)
- [Nuxt 4 WebSocket Support](https://nitro.unjs.io/guide/websocket)

