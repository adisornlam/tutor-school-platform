# 🎯 Course Rooms Implementation

## ✅ สิ่งที่ทำ

### 1. **เพิ่ม Functions ใน `server/services/chat.service.ts`**

#### `getTutorCourses(userId: number)`
- ดึง courses ที่ tutor สอน
- Query จาก `tutor_courses` table
- Return array ของ `course_id`

#### `getStudentCourses(userId: number)`
- ดึง courses ที่ student ลงทะเบียน
- Query จาก `enrollments` table
- Return array ของ `course_id`

---

### 2. **ปรับ Socket.IO Plugin (`server/plugins/socket.io.ts`)**

#### เมื่อ User Connect:
```typescript
// 1. Join personal room
socket.join(`user:${userId}`)

// 2. Join chat rooms (1-to-1)
const rooms = await getUserChatRooms(userId)
rooms.forEach(room => {
  socket.join(`room:${room.id}`)
})

// 3. Join course rooms (based on role)
if (isTutor) {
  const tutorCourses = await getTutorCourses(userId)
  tutorCourses.forEach(courseId => {
    socket.join(`course:${courseId}`)
  })
}

if (isStudent) {
  const studentCourses = await getStudentCourses(userId)
  studentCourses.forEach(courseId => {
    socket.join(`course:${courseId}`)
  })
}
```

---

### 3. **ปรับ Message Sending (`server/api/chat/rooms/[roomId]/messages.post.ts`)**

#### เมื่อส่งข้อความ:
```typescript
// 1. ส่งไปยัง room (1-to-1)
io.to(`room:${roomId}`).emit('new_message', message)

// 2. ส่งไปยัง course room (ถ้า recipient ไม่ได้อยู่ใน room)
if (courseId && recipientNotInRoom) {
  io.to(`course:${courseId}`).emit('course_message_notification', {
    roomId,
    message,
    recipientId
  })
}

// 3. ส่งไปยัง user room (personal notification)
io.to(`user:${recipientId}`).emit('new_message_notification', {
  roomId,
  message
})
```

---

## 📋 Room Structure

### Pattern 1: `room:{roomId}` (1-to-1 Chat)
- **Purpose**: Chat ระหว่าง student ↔ tutor
- **Members**: student + tutor
- **Example**: `room:1`

### Pattern 2: `course:{courseId}` (Broadcast)
- **Purpose**: Broadcast notifications
- **Members**: ทุก students + tutors ใน course
- **Example**: `course:1`

### Pattern 3: `user:{userId}` (Personal)
- **Purpose**: Personal notifications
- **Members**: user คนเดียว
- **Example**: `user:9`

---

## 🔍 Logging

### Server Logs:
```
[Socket.IO] ✅ User connected: 3 (Tutor Name)
[Socket.IO] 👤 User 3 joined personal room: user:3
[Socket.IO] 🏠 User 3 joined room 1 (course 1, student 9, tutor 3)
[Socket.IO] ✅ User 3 joined 1 chat room(s)
[Socket.IO] 📚 Tutor 3 joined course room: course:1
[Socket.IO] ✅ Tutor 3 joined 1 course room(s)
[Socket.IO] 📋 User 3 is in 3 room(s): ['socket_id', 'user:3', 'room:1', 'course:1']
```

### API Logs:
```
[API] 🔍 Room 1 has 2 connected socket(s)
[API] 👥 Users in room 1: [...]
[API] 🎯 Recipient 9 in room 1: true
[API] ✅ Emitted 'new_message' to room 1
[API] 📚 Course 1 has 2 connected socket(s)
[API] 📢 Sent course notification to course:1
```

---

## 🧪 การทดสอบ

### Test Case 1: ครู Login
1. Login เป็น tutor
2. ตรวจสอบ logs:
   - ✅ Join `user:{tutorId}`
   - ✅ Join `room:{roomId}` (ทุก rooms ที่ tutor เป็นส่วนหนึ่ง)
   - ✅ Join `course:{courseId}` (ทุก courses ที่ tutor สอน)

### Test Case 2: นักเรียน Login
1. Login เป็น student
2. ตรวจสอบ logs:
   - ✅ Join `user:{studentId}`
   - ✅ Join `room:{roomId}` (ทุก rooms ที่ student เป็นส่วนหนึ่ง)
   - ✅ Join `course:{courseId}` (ทุก courses ที่ student ลงทะเบียน)

### Test Case 3: ส่งข้อความ
1. ครูส่งข้อความไปยังนักเรียน
2. ตรวจสอบ logs:
   - ✅ Message ถูกส่งไปยัง `room:{roomId}`
   - ✅ Message ถูกส่งไปยัง `user:{recipientId}` (ถ้า recipient ไม่ได้อยู่ใน room)
   - ✅ Notification ถูกส่งไปยัง `course:{courseId}` (ถ้า recipient ไม่ได้อยู่ใน room)

---

## 🚀 Next Steps

1. ✅ Implement course rooms
2. ✅ Add logging
3. ⏳ Test with real users
4. ⏳ Monitor logs for issues
5. ⏳ Optimize if needed

