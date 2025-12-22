# 🔧 แก้ไขปัญหา Port ชนกัน (Multiple Cursor Windows)

## 📋 ปัญหา

เมื่อเปิด Cursor 2 windows (2 โปรเจคพร้อมกัน) จะเจอ:
1. **Vite HMR WebSocket port ชนกัน**: `ERROR  WebSocket server error: Port 24678 is already in use`
2. **Socket.IO server not found**: `ERROR  [Socket.IO] ❌ h3App.server not found`

---

## ✅ การแก้ไข

### 1️⃣ แก้ Vite HMR Port ชนกัน

**ไฟล์**: `nuxt.config.ts`

**เพิ่ม Vite config**:
```typescript
vite: {
  server: {
    hmr: {
      // ใช้ random port หรือกำหนด port ผ่าน environment variable
      // PORT_VITE_HMR สามารถกำหนดใน .env (เช่น PORT_VITE_HMR=24679)
      port: parseInt(process.env.PORT_VITE_HMR || '0') || undefined, // 0 หรือ undefined = random port
      clientPort: parseInt(process.env.PORT_VITE_HMR || '0') || undefined,
    }
  }
}
```

**วิธีใช้**:
- **วิธีที่ 1**: ไม่ต้องตั้งค่าใดๆ → Vite จะใช้ random port อัตโนมัติ
- **วิธีที่ 2**: กำหนด port ใน `.env`:
  ```bash
  PORT_VITE_HMR=24679  # โปรเจคแรก
  PORT_VITE_HMR=24680  # โปรเจคที่สอง
  ```

---

### 2️⃣ แก้ Socket.IO h3App.server not found

**ไฟล์**: `server/plugins/socket.io.ts`

**ปัญหา**: Plugin ถูกเรียกก่อนที่ server จะพร้อม

**วิธีแก้**: ใช้ ready hook เป็น fallback ถ้า server ยังไม่พร้อม

```typescript
export default defineNitroPlugin((nitroApp) => {
  // Check if already initialized (HMR protection)
  if (globalThis.io) {
    nitroApp.io = globalThis.io
    return
  }

  // Function to initialize Socket.IO
  const initializeSocketIO = () => {
    const httpServer = nitroApp.h3App?.server
    if (!httpServer) {
      console.warn('[Socket.IO] ⚠️  h3App.server not found yet, will retry on ready hook')
      return false
    }
    
    // ... create Socket.IO server ...
    return true
  }

  // Try to initialize immediately
  const initialized = initializeSocketIO()
  
  // If not initialized (server not ready), wait for ready hook
  if (!initialized) {
    nitroApp.hooks.hook('ready', () => {
      console.log('[Socket.IO] 🚀 Server ready, initializing Socket.IO...')
      initializeSocketIO()
    })
  }
})
```

---

## 🎯 ผลลัพธ์

### ก่อนแก้ไข:
```
ERROR  WebSocket server error: Port 24678 is already in use
ERROR  [Socket.IO] ❌ h3App.server not found
```

### หลังแก้ไข:
- **โปรเจคแรก**: Vite HMR ใช้ random port (เช่น 54231)
- **โปรเจคที่สอง**: Vite HMR ใช้ random port อีกตัว (เช่น 54232)
- **Socket.IO**: Initialize ได้ถูกต้อง (รอ server ready ถ้าจำเป็น)

---

## 📝 หมายเหตุ

### Vite HMR Port
- **Default**: Vite จะพยายามใช้ port 24678 ก่อน
- **Random port**: ถ้า port ชน จะลอง random port อัตโนมัติ
- **Custom port**: กำหนดผ่าน `PORT_VITE_HMR` environment variable

### Socket.IO Initialization
- **ปกติ**: Initialize ทันทีถ้า server พร้อม (ไม่มี delay)
- **Fallback**: ใช้ ready hook ถ้า server ยังไม่พร้อม
- **ไม่ retry ซ้ำ**: ใช้ ready hook เป็น fallback เท่านั้น (ไม่ใช่ retry loop)

---

## 🔍 วิธีตรวจสอบ

### 1. ตรวจสอบ Vite HMR Port
ดูใน console log:
```
✔ Vite server built in 29ms
ℹ Vite server warmed up in 1ms
ℹ Local:   http://localhost:4000/
ℹ Network: use --host to expose
ℹ Vite HMR running on port 54231  ← ดูตรงนี้
```

### 2. ตรวจสอบ Socket.IO
ดูใน console log:
```
[Socket.IO] ✅ Found h3App.server, initializing Socket.IO...
[Socket.IO] ✅ Socket.IO server created
[Socket.IO] ✅ Socket.IO server fully initialized and ready
```

หรือถ้า server ยังไม่พร้อม:
```
[Socket.IO] ⚠️  h3App.server not found yet, will retry on ready hook
[Socket.IO] 🚀 Server ready, initializing Socket.IO...
```

---

## 💡 Tips

### ถ้ายังเจอ port ชน:
1. **Restart server** ทั้งสองโปรเจค
2. **Kill process** ที่ใช้ port 24678:
   ```bash
   lsof -ti:24678 | xargs kill -9
   ```
3. **กำหนด port เฉพาะ** ใน `.env` ของแต่ละโปรเจค

### ถ้ายังเจอ h3App.server not found:
1. **ตรวจสอบ Nuxt version** - ต้องเป็น Nuxt 4
2. **ตรวจสอบ logs** - ดูว่า server พร้อมหรือยัง
3. **Restart server** - บางครั้งช่วยได้

---

*Fix applied for multiple Cursor windows port conflict*

