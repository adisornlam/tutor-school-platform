# 📋 คู่มือการ Deploy บน cPanel (Node.js Hosting)

## ✅ Node.js Version Compatibility

**Node.js 20.19.4** ✅ **รองรับ Nuxt 4 ได้ดี**

- Nuxt 4 ต้องการ Node.js **18.10.0** ขึ้นไป
- Node.js 20.x เป็น LTS version ที่แนะนำสำหรับ Nuxt 4
- Node.js 20.19.4 เป็น version ที่เสถียรและปลอดภัย

---

## 🔧 การตั้งค่า cPanel Node.js Application

### 1. **Node.js Version**
```
20.19.4 ✅ (รองรับ Nuxt 4 ได้ดี)
```

### 2. **Application Mode**
```
Production ✅
```
⚠️ **สำคัญ:** ต้องเลือก **Production** ไม่ใช่ Development เพื่อให้:
- ใช้ environment variables จาก `.env`
- Build production bundle ที่ optimize แล้ว
- Security headers ทำงานถูกต้อง

### 3. **Application Root**
```
/ (root directory)
```
หรือระบุ path ที่แน่นอน เช่น:
```
/home/username/kdcschool.webthdesign.com
```

### 4. **Application URL**
```
kdcschool.webthdesign.com
```

### 5. **Application Startup File** ⚠️ **สำคัญมาก**
```
.output/server/index.mjs
```

**หมายเหตุ:** Nuxt 4 ใช้ Nitro server ซึ่งจะ build เป็นไฟล์ `.output/server/index.mjs`

---

## 📝 Environment Variables ที่ต้องตั้งค่า

เพิ่ม Environment Variables ต่อไปนี้ใน cPanel:

### Database Configuration
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tutordb
DB_USER=your_db_username
DB_PASSWORD=your_db_password
```

### JWT Configuration
```env
JWT_SECRET=your-jwt-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d
```

### Application Configuration
```env
NODE_ENV=production
API_BASE=/api
PORT=4000
```

### Domain/URL (ถ้าจำเป็น)
```env
APP_URL=https://kdcschool.webthdesign.com
```

---

## 🚀 ขั้นตอนการ Deploy

### Step 1: Build Application Locally

```bash
# Install dependencies
bun install

# Build for production
bun run build
```

⚠️ **หมายเหตุ:** หาก build มี error เกี่ยวกับ `shared/types`, ตรวจสอบ `docs/BUILD_ERROR_FIX.md`

### Step 2: Prepare Deployment Package

รันคำสั่งเพื่อสร้าง deployment package:

```bash
bun run build:deploy
```

หรือสร้าง zip file เอง:

```bash
zip -r deploy-output.zip .output/
```

### Step 3: Upload Files to Server

**วิธีที่ 1: Upload zip file (แนะนำ)**

1. อัพโหลด `deploy-output.zip` ไปยัง `/home/username/kdcschool.webthdesign.com/`
2. SSH เข้า server และ extract:
   ```bash
   cd /home/username/kdcschool.webthdesign.com/
   unzip deploy-output.zip
   ```
3. ผลลัพธ์จะมี structure ดังนี้:
   ```
   /home/username/kdcschool.webthdesign.com/
   └── .output/
       ├── public/
       ├── server/
       │   ├── index.mjs  ← Startup file
       │   ├── package.json
       │   └── node_modules/
       └── shared/
   ```

**วิธีที่ 2: Upload ทั้ง directory .output/**

อัพโหลด directory `.output/` ทั้งหมดไปยัง `/home/username/kdcschool.webthdesign.com/` ผ่าน FTP/File Manager

**ไฟล์ที่ต้องอัพโหลด:**
- `.output/` directory (ทั้ง directory)
  - `.output/public/` - Static files
  - `.output/server/` - Server files (รวม `index.mjs`)
  - `.output/shared/` - Shared types (ถูก copy อัตโนมัติ)

**ไฟล์ที่ไม่ต้องอัพโหลด:**
- `node_modules/` (root) - จะ install ใน `.output/server/` แทน
- `.nuxt/` - Build cache
- `app/`, `server/`, `shared/` (root) - ใช้เฉพาะ `.output/` version

### Step 4: Setup Node.js Application ใน cPanel

1. **เข้า cPanel Node.js Selector**
2. **Create Application**:
   - Node.js version: `20.19.4`
   - Application mode: `Production`
   - Application root: `/` (หรือ path ที่อัพโหลดไฟล์)
   - Application URL: `kdcschool.webthdesign.com`
   - Application startup file: `.output/server/index.mjs`

3. **Add Environment Variables**:
   - เพิ่มทุกตัวแปรจากข้างบน

4. **Click CREATE**

### Step 5: Install Dependencies บน Server

หลังจากสร้าง application แล้ว ให้รัน:

```bash
cd /path/to/application/.output/server
npm install --production
```

หรือถ้า cPanel รองรับ Bun:

```bash
cd /path/to/application/.output/server
bun install --production
```

### Step 6: Restart Application

คลิก "RESTART" ใน cPanel Node.js Applications

---

## 🔍 Troubleshooting

### Problem: Application ไม่ start

**ตรวจสอบ:**
1. **Startup file ถูกต้องหรือไม่?**
   - ตรวจสอบว่าไฟล์ `.output/server/index.mjs` มีอยู่จริง
   - ถ้าไม่มี อาจต้อง build ใหม่

2. **Dependencies ติดตั้งครบหรือไม่?**
   - รัน `npm install --production` ใน `.output/server/` directory

3. **Port conflict?**
   - ตรวจสอบว่า port ที่กำหนด (default 4000) ไม่ชนกับ application อื่น
   - cPanel อาจกำหนด port อัตโนมัติ

4. **Check Logs:**
   - ดู error logs ใน cPanel
   - ดู application logs

### Problem: Database connection error

**ตรวจสอบ:**
1. **Database credentials ถูกต้องหรือไม่?**
   - ตรวจสอบ `DB_HOST`, `DB_USER`, `DB_PASSWORD`
   - สำหรับ cPanel มักใช้ `localhost` สำหรับ DB_HOST

2. **Database exists?**
   - สร้าง database ผ่าน cPanel MySQL Databases
   - Import schema จาก `docs/DATABASE_SCHEMA.sql`

3. **User permissions?**
   - ตรวจสอบว่า database user มีสิทธิ์ access database

### Problem: 404 Not Found

**ตรวจสอบ:**
1. **.htaccess file** (ถ้าใช้ Apache):
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^api/?(.*)$ http://localhost:PORT/api/$1 [P,L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

2. **Base URL configuration:**
   - ตรวจสอบ `nuxt.config.ts` ว่า `base` ถูกต้อง

---

## 📋 Checklist ก่อน Deploy

- [ ] Build application (`bun run build`) สำเร็จ
- [ ] ตรวจสอบว่า `.output/` directory มีไฟล์ครบ
- [ ] ตรวจสอบว่า `.output/server/index.mjs` มีอยู่จริง
- [ ] สร้าง `.env` file บน server พร้อม environment variables ทั้งหมด
- [ ] สร้าง database และ import schema
- [ ] Run migrations (ถ้ามี)
- [ ] ตั้งค่า Node.js application ใน cPanel:
  - [ ] Node.js version: 20.19.4
  - [ ] Application mode: Production
  - [ ] Startup file: `.output/server/index.mjs`
  - [ ] Environment variables ครบถ้วน
- [ ] Install dependencies (`npm install --production` ใน `.output/server/`)
- [ ] Restart application
- [ ] ทดสอบ access ผ่าน URL

---

## 🔐 Security Considerations

1. **JWT Secrets:**
   - ใช้ secrets ที่สร้างใหม่สำหรับ production
   - อย่าใช้ secrets เดียวกับ development

2. **Database Password:**
   - ใช้ password ที่แข็งแกร่ง
   - เก็บไว้ใน environment variables เท่านั้น

3. **HTTPS:**
   - Enable SSL certificate ใน cPanel
   - ใช้ HTTPS สำหรับ production

4. **Environment Variables:**
   - อย่า commit `.env` file เข้า Git
   - ใช้ cPanel environment variables แทน

---

## 📚 References

- [Nuxt 4 Documentation](https://nuxt.com/docs/getting-started/installation)
- [Node.js 20 LTS](https://nodejs.org/en/blog/release/v20.19.4)
- [cPanel Node.js Applications](https://docs.cpanel.net/knowledge-base/web-services/guide-to-node-js-applications/)

---

*Last updated: 2025-01-20*
