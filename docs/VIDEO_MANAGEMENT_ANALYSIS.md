# 🎥 วิเคราะห์ระบบจัดการวิดีโอสอน (Video Management System)

**วันที่**: 23 ธันวาคม 2024  
**วัตถุประสงค์**: วิเคราะห์การให้ครูทำคลิปสอนแล้วนำมาแปะในระบบ พร้อมควบคุมสิทธิ์และป้องกันการคัดลอก

---

## 📋 ความต้องการ

### 1. **แหล่งวิดีโอ**
- ✅ ครูทำคลิปสอนใน YouTube หรือแพลตฟอร์มอื่น
- ✅ นำลิงก์/Embed มาแปะในระบบ
- ✅ ไม่ต้องอัปโหลดวิดีโอเอง (ประหยัด Storage)

### 2. **การควบคุมสิทธิ์**
- ✅ กำหนดสิทธิ์การมองเห็น (เฉพาะผู้ที่ลงทะเบียน)
- ✅ ห้าม Copy (ไม่ให้คัดลอกลิงก์หรือ Embed Code)
- ✅ ห้าม Download (ไม่ให้ดาวน์โหลดวิดีโอ)

### 3. **การจัดการเนื้อหา**
- ✅ แบ่งวิดีโอเป็นตอนๆ (Shorts/Lessons) เหมือน SkillLane
- ✅ จัดระเบียบเป็นบทเรียน (Chapters/Modules)
- ✅ รองรับวิดีโอหลายตอนในคอร์สเดียว

---

## ✅ วิเคราะห์ความเป็นไปได้

### **1. สามารถทำได้หรือไม่?**

**คำตอบ: ✅ ทำได้ แต่มีข้อจำกัดบางอย่าง**

#### ✅ **จุดเด่น:**
1. **YouTube Embed API** รองรับการควบคุมหลายอย่าง:
   - `controls=0` - ซ่อนปุ่มควบคุม
   - `modestbranding=1` - ลดโลโก้ YouTube
   - `rel=0` - ไม่แสดงวิดีโอที่เกี่ยวข้อง
   - `iv_load_policy=3` - ซ่อนคำอธิบายวิดีโอ
   - `cc_load_policy=0` - ไม่แสดงคำบรรยายอัตโนมัติ

2. **Privacy Settings:**
   - YouTube Unlisted: เห็นได้เฉพาะคนที่มีลิงก์
   - YouTube Private: เห็นได้เฉพาะคนที่ได้รับเชิญ

3. **ระบบ Access Control:**
   - ระบบ `learning_rights` ที่มีอยู่แล้วรองรับการควบคุมการเข้าถึง
   - สามารถตรวจสอบ Enrollment ก่อนแสดงวิดีโอ

#### ⚠️ **ข้อจำกัด:**
1. **การป้องกัน Copy/Download ไม่สมบูรณ์ 100%:**
   - ยังสามารถดู Source Code ของหน้าเว็บได้
   - ยังสามารถใช้ Browser Extensions ดาวน์โหลดได้
   - YouTube ไม่มี API ที่ป้องกันการ Download อย่างสมบูรณ์

2. **YouTube มีข้อจำกัด:**
   - วิดีโอต้องเป็น Public, Unlisted, หรือ Private
   - ถ้าเป็น Private ต้องเพิ่ม YouTube Channel เข้า Whitelist
   - ถ้าเป็น Public อาจมีคนอื่นเห็นได้

3. **แพลตฟอร์มอื่นๆ:**
   - **Vimeo**: รองรับ Password Protection และ Domain Restriction ดีกว่า
   - **Wistia**: มีระบบ Security ที่แข็งแกร่งกว่า แต่ราคาแพง
   - **VdoCipher**: เป็น Platform สำหรับป้องกันวิดีโอโดยเฉพาะ แต่มีค่าใช้จ่าย

---

## 🎯 แนวทางที่แนะนำ

### **แนวทางที่ 1: YouTube Embed (แนะนำสำหรับเริ่มต้น)**

#### **ข้อดี:**
- ✅ ฟรี ไม่มีค่าใช้จ่าย
- ✅ ไม่ใช้ Storage ตัวเอง
- ✅ คุณภาพวิดีโอดี (รองรับ 4K)
- ✅ CDN ของ YouTube เร็วและเสถียร

#### **ข้อเสีย:**
- ⚠️ ป้องกัน Copy/Download ไม่สมบูรณ์ 100%
- ⚠️ มีโฆษณา (ถ้า Channel ไม่ได้เป็น Partner)
- ⚠️ ต้องใช้ YouTube Channel ของโรงเรียน

#### **วิธีการทำ:**
1. **ตั้งค่า YouTube Video:**
   - Upload เป็น **Unlisted** (ไม่แสดงใน Channel แต่เข้าถึงได้ผ่านลิงก์)
   - หรือใช้ **Private** + เพิ่ม Channel ของระบบเข้า Whitelist

2. **Embed Code:**
   ```html
   <iframe 
     src="https://www.youtube.com/embed/VIDEO_ID?autoplay=0&controls=1&modestbranding=1&rel=0&iv_load_policy=3&cc_load_policy=0&playsinline=1"
     frameborder="0" 
     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
     allowfullscreen
     style="width: 100%; height: 500px;"
   ></iframe>
   ```

3. **ระบบ Access Control:**
   - ตรวจสอบ Enrollment ก่อนแสดง Embed Code
   - ใช้ Token หรือ Signed URL (ถ้าใช้ YouTube API)
   - ซ่อน Embed Code ใน Frontend (Generate ใน Backend)

---

### **แนวทางที่ 2: Vimeo (แนะนำสำหรับระบบที่ต้องการความปลอดภัยสูง)**

#### **ข้อดี:**
- ✅ มี Password Protection
- ✅ มี Domain Restriction (จำกัดเฉพาะ Domain ของเรา)
- ✅ ไม่มีโฆษณา
- ✅ คุณภาพวิดีโอดี
- ✅ มี Analytics ที่ละเอียด

#### **ข้อเสีย:**
- ⚠️ ต้องเสียค่าบริการ (ฟรี 500MB/สัปดาห์, จ่าย 9-75 USD/เดือน)
- ⚠️ ต้อง Upload วิดีโอเอง (ใช้ Storage ของ Vimeo)

#### **วิธีการทำ:**
1. **ตั้งค่า Vimeo Video:**
   - Upload วิดีโอไปยัง Vimeo
   - ตั้งค่า Privacy เป็น "Only people with the private link"
   - เปิด Domain Restriction (จำกัดเฉพาะ Domain ของเรา)
   - ปิด Download (Disable Downloads)

2. **Embed Code:**
   ```html
   <iframe 
     src="https://player.vimeo.com/video/VIDEO_ID?badge=0&autopause=0&player_id=0&app_id=58479"
     frameborder="0" 
     allow="autoplay; fullscreen; picture-in-picture"
     allowfullscreen
     style="width: 100%; height: 500px;"
   ></iframe>
   ```

---

### **แนวทางที่ 3: VdoCipher (แนะนำสำหรับระบบที่ต้องการความปลอดภัยสูงสุด)**

#### **ข้อดี:**
- ✅ ป้องกันการ Download/D screen capture ได้ดีที่สุด
- ✅ มี DRM (Digital Rights Management)
- ✅ มี Watermark แบบ Dynamic (แสดง User ID)
- ✅ มี Screen Recording Detection
- ✅ มีระบบ Analytics ที่ละเอียด

#### **ข้อเสีย:**
- ⚠️ ราคาแพง (เริ่มต้น $99/เดือน สำหรับ 10,000 views)
- ⚠️ ต้อง Upload วิดีโอเอง

---

## 📊 เปรียบเทียบกับ SkillLane

### **SkillLane ใช้วิธีไหน?**

จากการวิเคราะห์ UI ของ SkillLane:

1. **Video Player:**
   - ใช้ Custom Video Player (อาจเป็น Video.js หรือ Plyr)
   - มีระบบควบคุมการเข้าถึง (ต้อง Login และ Enroll ก่อน)
   - มี Progress Tracking (ดูวิดีโอไปแล้วเท่าไหร่)

2. **การป้องกัน:**
   - ซ่อน Video URL จริง (ใช้ Signed URL หรือ Token)
   - ป้องกัน Right-click
   - ป้องกัน Keyboard Shortcuts (เช่น F12, Ctrl+U)
   - ใช้ DRM หรือ Video Encryption

3. **โครงสร้างบทเรียน:**
   - แบ่งเป็น Chapters/Modules
   - แต่ละ Module มี Lessons หลายตอน
   - แต่ละ Lesson เป็นวิดีโอสั้นๆ (10-30 นาที)
   - มีระบบ Preview (ดูตัวอย่างฟรี)

---

## 🏗️ โครงสร้าง Database ที่ต้องเพิ่ม

### **1. ตาราง `course_sessions` (มีอยู่แล้ว แต่ต้องปรับปรุง)**

```sql
CREATE TABLE course_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    chapter_id INT, -- เพิ่ม: บทที่ (Chapter/Module)
    schedule_id INT,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    session_number INT, -- ลำดับตอนในบท
    content_type ENUM('live', 'vod', 'video') NOT NULL, -- เพิ่ม 'video'
    
    -- Video Source
    video_source ENUM('youtube', 'vimeo', 'vdocipher', 'self_hosted') DEFAULT 'youtube',
    video_id VARCHAR(255), -- YouTube Video ID หรือ Vimeo Video ID
    video_url VARCHAR(500), -- Full URL (Backup)
    video_embed_code TEXT, -- Embed Code (ถ้าต้องการ Custom)
    
    -- Video Settings
    is_preview BOOLEAN DEFAULT FALSE, -- ดูตัวอย่างฟรี
    duration_seconds INT, -- ระยะเวลาวิดีโอ (วินาที)
    thumbnail_url VARCHAR(500), -- รูปปกวิดีโอ
    
    -- Security Settings
    allow_download BOOLEAN DEFAULT FALSE,
    require_enrollment BOOLEAN DEFAULT TRUE,
    
    -- Materials (มีอยู่แล้ว)
    materials JSON,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES course_schedules(id) ON DELETE SET NULL,
    INDEX idx_course (course_id),
    INDEX idx_chapter (chapter_id),
    INDEX idx_session_number (session_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### **2. ตาราง `course_chapters` (เพิ่มใหม่)**

```sql
CREATE TABLE course_chapters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    chapter_number INT NOT NULL, -- ลำดับบท
    title VARCHAR(300) NOT NULL,
    description TEXT,
    is_preview BOOLEAN DEFAULT FALSE, -- บทนี้มี Preview หรือไม่
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_course_chapter (course_id, chapter_number),
    INDEX idx_course (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### **3. ตาราง `video_access_logs` (เพิ่มใหม่ - สำหรับติดตามการเข้าถึง)**

```sql
CREATE TABLE video_access_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT NOT NULL,
    user_id INT NOT NULL,
    enrollment_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES course_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE SET NULL,
    INDEX idx_session (session_id),
    INDEX idx_user (user_id),
    INDEX idx_accessed_at (accessed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 🔐 ระบบความปลอดภัยที่แนะนำ

### **1. Backend Access Control**

```typescript
// server/api/learning/sessions/[id]/video-url.get.ts
export default defineEventHandler(async (event) => {
  const sessionId = parseInt(getRouterParam(event, 'id') || '0')
  const user = await requireAuth(event)
  
  // 1. ตรวจสอบ Enrollment
  const enrollment = await checkEnrollment(user.id, sessionId)
  if (!enrollment) {
    throw createError({
      statusCode: 403,
      message: 'You must enroll in this course first'
    })
  }
  
  // 2. ตรวจสอบ Learning Rights
  const hasAccess = await checkLearningRights(enrollment.id, sessionId)
  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: 'Your access has expired'
    })
  }
  
  // 3. ดึงข้อมูล Session
  const session = await getCourseSession(sessionId)
  
  // 4. Generate Signed URL หรือ Embed Code (ถ้าต้องการ)
  const videoUrl = await generateSecureVideoUrl(session, user.id)
  
  // 5. Log การเข้าถึง
  await logVideoAccess(sessionId, user.id, enrollment.id, event)
  
  return {
    videoUrl,
    embedCode: generateEmbedCode(session),
    duration: session.duration_seconds,
    allowDownload: session.allow_download
  }
})
```

### **2. Frontend Video Player Component**

```vue
<template>
  <div class="video-player-container" @contextmenu.prevent @selectstart.prevent>
    <!-- YouTube Embed -->
    <iframe
      v-if="session.video_source === 'youtube'"
      :src="embedUrl"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="w-full h-[500px] md:h-[600px]"
      @load="onVideoLoad"
    />
    
    <!-- Vimeo Embed -->
    <iframe
      v-else-if="session.video_source === 'vimeo'"
      :src="embedUrl"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
      class="w-full h-[500px] md:h-[600px]"
      @load="onVideoLoad"
    />
  </div>
</template>

<script setup lang="ts">
// ป้องกัน Right-click, F12, Ctrl+U, etc.
onMounted(() => {
  // Disable right-click
  document.addEventListener('contextmenu', (e) => e.preventDefault())
  
  // Disable F12, Ctrl+Shift+I, Ctrl+U
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u')) {
      e.preventDefault()
    }
  })
  
  // Disable text selection
  document.addEventListener('selectstart', (e) => e.preventDefault())
})
</script>
```

**หมายเหตุ**: การป้องกันเหล่านี้ไม่สมบูรณ์ 100% เพราะผู้ใช้สามารถปิด JavaScript หรือใช้ Browser Extensions ได้ แต่จะช่วยป้องกันผู้ใช้ทั่วไปได้

---

## 📱 UI/UX ที่แนะนำ (เหมือน SkillLane)

### **1. หน้าคอร์สเรียน (Course Detail Page)**

```
┌─────────────────────────────────────────────────────────┐
│  [Breadcrumb: หน้าหลัก > คณิตศาสตร์ ม.1]              │
│                                                          │
│  📺 คอร์สออนไลน์                                         │
│  ════════════════════════════════════════════════════   │
│  คณิตศาสตร์ ม.1 - เรียนออนไลน์                         │
│  ⭐⭐⭐⭐⭐ 4.7 (18 รีวิว)                               │
│                                                          │
│  ┌────────────────────────┬──────────────────────────┐ │
│  │                        │                          │ │
│  │   [Video Player]       │  [กลับไปเรียนต่อ] (ปุ่มใหญ่) │ │
│  │                        │  ❤️ Share 🔗             │ │
│  │                        │                          │ │
│  └────────────────────────┴──────────────────────────┘ │
│                                                          │
│  [รายละเอียด] [เนื้อหา] [ผู้สอน] [รีวิว] [ห้องสนทนา]    │
│  ════════════════════════════════════════════════════   │
│                                                          │
│  📚 เนื้อหา                                              │
│                                                          │
│  ▼ บทที่ 1: พื้นฐานคณิตศาสตร์                          │
│    ▶ ตอนที่ 1: บทนำคอร์ส (22:30) [ดูตัวอย่างฟรี]      │
│    ▶ ตอนที่ 2: เลขยกกำลัง (12:06)                      │
│    ▶ ตอนที่ 3: สมการเส้นตรง (08:33)                    │
│                                                          │
│  ▼ บทที่ 2: พีชคณิต                                    │
│    ▶ ตอนที่ 1: พหุนาม (15:13)                          │
│    ▶ ตอนที่ 2: การแยกตัวประกอบ (09:41)                 │
│                                                          │
│  👨‍🏫 ผู้สอน                                              │
│  [รูปอาจารย์] อาจารย์สมชาย ใจดี                        │
│  ⭐ 4.8 คะแนนเฉลี่ย | 23 รีวิว | 4 คอร์ส               │
│  [ไปที่หน้าผู้สอน]                                       │
└─────────────────────────────────────────────────────────┘
```

### **2. Video Player Features**

- ✅ Progress Bar (แสดงความคืบหน้า)
- ✅ Play/Pause, Volume, Fullscreen
- ✅ Playback Speed (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
- ✅ Auto-play next video
- ✅ Keyboard shortcuts (Space = Play/Pause, Arrow = Seek)
- ✅ Progress Tracking (บันทึกว่าดูไปแล้วกี่%)

---

## 🎯 แผนการ Implementation

### **Phase 1: Basic Video Embed (1-2 สัปดาห์)**

1. ✅ เพิ่มตาราง `course_chapters`
2. ✅ ปรับปรุงตาราง `course_sessions` (เพิ่ม video_source, video_id)
3. ✅ สร้าง API endpoints:
   - `GET /api/admin/courses/:id/chapters` - ดึงบทเรียน
   - `POST /api/admin/courses/:id/chapters` - สร้างบทเรียน
   - `GET /api/learning/courses/:id/sessions` - ดึงวิดีโอทั้งหมด (ตรวจสอบสิทธิ์)
   - `GET /api/learning/sessions/:id/video-url` - ดึง Video URL (ตรวจสอบสิทธิ์)
4. ✅ สร้าง UI สำหรับ Admin จัดการบทเรียนและวิดีโอ
5. ✅ สร้าง Video Player Component (รองรับ YouTube, Vimeo)

### **Phase 2: Security & Access Control (1 สัปดาห์)**

1. ✅ ระบบตรวจสอบ Enrollment
2. ✅ ระบบตรวจสอบ Learning Rights
3. ✅ Video Access Logging
4. ✅ Frontend Security (Disable Right-click, F12, etc.)

### **Phase 3: Advanced Features (2-3 สัปดาห์)**

1. ✅ Progress Tracking
2. ✅ Auto-play next video
3. ✅ Preview Videos (ดูตัวอย่างฟรี)
4. ✅ Video Quality Selection
5. ✅ Subtitle/CC Support

---

## 💡 คำแนะนำ

### **1. สำหรับเริ่มต้น:**

**แนะนำใช้ YouTube Embed** เพราะ:
- ✅ ฟรี
- ✅ ไม่ใช้ Storage
- ✅ เริ่มต้นได้เร็ว
- ✅ คุณภาพดี

**วิธีการ:**
- Upload วิดีโอเป็น **Unlisted**
- ใช้ Embed API พร้อม Privacy Settings
- ควบคุมการเข้าถึงผ่าน Backend

### **2. สำหรับระบบที่ต้องการความปลอดภัยสูง:**

**แนะนำใช้ Vimeo** เพราะ:
- ✅ มี Password Protection
- ✅ มี Domain Restriction
- ✅ ไม่มีโฆษณา
- ✅ ราคาไม่แพงมาก (เริ่มต้น $9/เดือน)

### **3. สำหรับระบบที่ต้องการความปลอดภัยสูงสุด:**

**แนะนำใช้ VdoCipher** เพราะ:
- ✅ ป้องกันการ Download ได้ดีที่สุด
- ✅ มี DRM
- ✅ มี Watermark แบบ Dynamic

**แต่**: ต้องพิจารณาค่าใช้จ่ายด้วย ($99/เดือน)

---

## ⚠️ ข้อควรระวัง

### **1. การป้องกันไม่สมบูรณ์ 100%**

- ผู้ใช้สามารถใช้ Browser Extensions ดาวน์โหลดได้
- ผู้ใช้สามารถใช้ Screen Recording Software บันทึกได้
- ผู้ใช้สามารถดู Source Code ของหน้าเว็บได้

**วิธีแก้ไข**: 
- ใช้ Legal Protection (Terms of Service, Copyright Notice)
- ใช้ Watermark แบบ Dynamic (แสดง User ID)
- ใช้ DRM (Digital Rights Management) สำหรับวิดีโอที่สำคัญ

### **2. Performance**

- YouTube/Vimeo ใช้ CDN เอง → ไม่ต้องกังวลเรื่อง Performance
- แต่ถ้าใช้ Self-hosted → ต้องใช้ CDN (CloudFront, Cloudflare)

### **3. Cost**

- YouTube: ฟรี
- Vimeo: $9-75/เดือน (ขึ้นอยู่กับจำนวนวิดีโอและ Bandwidth)
- VdoCipher: $99+/เดือน (ขึ้นอยู่กับจำนวน Views)

---

## ✅ สรุป

### **ทำได้หรือไม่?**
**✅ ทำได้** - ระบบปัจจุบันรองรับอยู่แล้ว และสามารถขยายได้

### **เหมาะสมกับระบบหรือไม่?**
**✅ เหมาะสม** - เพราะ:
- ✅ สอดคล้องกับความต้องการ VOD ที่มีอยู่แล้ว
- ✅ ลดต้นทุน Storage
- ✅ เริ่มต้นได้เร็ว
- ✅ รองรับการขยายในอนาคต

### **แนะนำเริ่มต้นอย่างไร?**

1. **Phase 1**: ใช้ YouTube Embed + Backend Access Control
2. **Phase 2**: เพิ่ม Security Features (Frontend Protection, Logging)
3. **Phase 3**: พิจารณาเปลี่ยนไปใช้ Vimeo หรือ VdoCipher ถ้าต้องการความปลอดภัยสูงขึ้น

---

*เอกสารนี้สรุปการวิเคราะห์ระบบจัดการวิดีโอสอน วันที่ 23 ธันวาคม 2024*

