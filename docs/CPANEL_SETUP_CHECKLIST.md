# ✅ Checklist: ตั้งค่า Node.js App ใน cPanel

**วันที่**: 28 ธันวาคม 2024  
**สำหรับ**: Tutor School Platform - KDC School

---

## 📋 สรุปสิ่งที่ต้องทำ

### 1. ✅ **โค้ดพร้อมแล้ว** - ไม่ต้องแก้ไขเพิ่มเติม
- ✅ Database connection config (`server/utils/db.ts`)
- ✅ Redis connection config (`server/utils/redis.ts`)
- ✅ Default values ถูกต้อง
- ✅ รองรับทั้ง Socket และ TCP connection

### 2. ⚙️ **ต้องตั้งค่าใน cPanel Node.js App**

---

## 🔧 ขั้นตอนการตั้งค่าใน cPanel

### Step 1: เข้า Node.js App ใน cPanel

1. Login เข้า **cPanel**
2. ไปที่ **"Node.js"** หรือ **"Node.js Selector"**
3. เลือก app: `kdcschool.webthdesign.com`
4. ไปที่ tab **"Environment Variables"** หรือ **"Settings"**

---

### Step 2: ตั้งค่า Environment Variables

ตั้งค่าตัวแปรต่อไปนี้ใน cPanel Node.js App:

#### 📦 **Database Configuration**

```bash
DB_HOST=192.250.235.23
DB_PORT=3306
DB_NAME=webthdsw_tutordb
DB_USER=webthdsw_tutor
DB_PASSWORD=57*0yZiKMmDyThXx
```

**หมายเหตุ:**
- ถ้าใช้ **Socket connection** (local database) → เพิ่ม `DB_SOCKET=/tmp/mysql.sock`
- ถ้าใช้ **TCP connection** (remote database) → ใช้ `DB_HOST` และ `DB_PORT` (ตั้งค่าแล้ว)

#### 🔴 **Redis Configuration**

```bash
REDIS_HOST=127.0.0.1
REDIS_PORT=46961
REDIS_PASSWORD=nd3Y4TDNrDLfCTs6iM2
REDIS_DB=0
```

#### 🔐 **JWT Configuration**

```bash
JWT_SECRET=t5sW0QA+fA8vkUS6bbtdIdLBfAcA6qtKWGNTuWswCQE=
JWT_REFRESH_SECRET=t5sW0QA+fA8vkUS6bbtdIdLBfAcA6qtKWGNTuWswCQE=
JWT_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d
```

#### 🌐 **Application Configuration**

```bash
PORT=4000
TZ=Asia/Bangkok
```

**หมายเหตุ:** `PORT` อาจถูกกำหนดโดย cPanel/Passenger อัตโนมัติ

---

### Step 3: ตรวจสอบ .htaccess (ถ้ามี)

ถ้า cPanel สร้าง `.htaccess` อัตโนมัติ ตรวจสอบว่ามี environment variables ถูกต้อง:

```apache
# DO NOT REMOVE OR MODIFY. CLOUDLINUX ENV VARS CONFIGURATION BEGIN
<IfModule Litespeed>
  SetEnv DB_HOST 192.250.235.23
  SetEnv DB_NAME webthdsw_tutordb
  SetEnv DB_PASSWORD 57*0yZiKMmDyThXx
  SetEnv DB_PORT 3306
  SetEnv DB_USER webthdsw_tutor
  SetEnv JWT_SECRET t5sW0QA+fA8vkUS6bbtdIdLBfAcA6qtKWGNTuWswCQE=
  SetEnv PORT 4000
  SetEnv TZ Asia/Bangkok
  SetEnv REDIS_HOST 127.0.0.1
  SetEnv REDIS_PORT 46961
  SetEnv REDIS_PASSWORD nd3Y4TDNrDLfCTs6iM2
  SetEnv REDIS_DB 0
</IfModule>
# DO NOT REMOVE OR MODIFY. CLOUDLINUX ENV VARS CONFIGURATION END
```

---

### Step 4: Upload และ Deploy

1. **Build project:**
   ```bash
   bun run build
   ```

2. **Upload `.output/` directory:**
   - Upload `.output/` ไปยัง server
   - Path: `/home/webthdsw/kdcschool.webthdesign.com/.output/`

3. **Restart Node.js App:**
   - ใน cPanel → Node.js App → Click **"Restart App"**

---

### Step 5: ทดสอบ Connection

1. **ทดสอบ Database:**
   - เปิด: `https://kdcschool.webthdesign.com/api/testdb`
   - ตรวจสอบว่า Database tests ผ่านทั้งหมด

2. **ทดสอบ Application:**
   - เปิด: `https://kdcschool.webthdesign.com/`
   - ตรวจสอบว่า application ทำงานปกติ

---

## 📋 Environment Variables Summary

### ต้องตั้งค่าใน cPanel:

| Variable | Value | ใช้สำหรับ |
|----------|-------|-----------|
| `DB_HOST` | `192.250.235.23` | Database host (IP address) |
| `DB_PORT` | `3306` | Database port |
| `DB_NAME` | `webthdsw_tutordb` | Database name |
| `DB_USER` | `webthdsw_tutor` | Database user |
| `DB_PASSWORD` | `57*0yZiKMmDyThXx` | Database password |
| `DB_SOCKET` | `/tmp/mysql.sock` | (Optional) Socket path |
| `REDIS_HOST` | `127.0.0.1` | Redis host |
| `REDIS_PORT` | `46961` | Redis port |
| `REDIS_PASSWORD` | `nd3Y4TDNrDLfCTs6iM2` | Redis password |
| `REDIS_DB` | `0` | Redis database number |
| `JWT_SECRET` | `t5sW0QA+fA8vkUS6bbtdIdLBfAcA6qtKWGNTuWswCQE=` | JWT secret key |
| `JWT_REFRESH_SECRET` | `t5sW0QA+fA8vkUS6bbtdIdLBfAcA6qtKWGNTuWswCQE=` | JWT refresh secret |
| `JWT_EXPIRES_IN` | `2h` | JWT expiration time |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | JWT refresh expiration |
| `PORT` | `4000` | Application port (อาจถูกกำหนดอัตโนมัติ) |
| `TZ` | `Asia/Bangkok` | Timezone |

---

## ✅ Checklist

### ก่อน Deploy:
- [ ] Build project: `bun run build`
- [ ] ตรวจสอบ `.output/` directory สร้างแล้ว
- [ ] ตรวจสอบ `index.mjs` มีขนาด ~6.87 MB

### ใน cPanel:
- [ ] ตั้งค่า `DB_HOST=192.250.235.23`
- [ ] ตั้งค่า `DB_PORT=3306`
- [ ] ตั้งค่า `DB_NAME=webthdsw_tutordb`
- [ ] ตั้งค่า `DB_USER=webthdsw_tutor`
- [ ] ตั้งค่า `DB_PASSWORD=57*0yZiKMmDyThXx`
- [ ] ตั้งค่า `REDIS_HOST=127.0.0.1`
- [ ] ตั้งค่า `REDIS_PORT=46961`
- [ ] ตั้งค่า `REDIS_PASSWORD=nd3Y4TDNrDLfCTs6iM2`
- [ ] ตั้งค่า `REDIS_DB=0`
- [ ] ตั้งค่า `JWT_SECRET=t5sW0QA+fA8vkUS6bbtdIdLBfAcA6qtKWGNTuWswCQE=`
- [ ] ตั้งค่า `JWT_REFRESH_SECRET=t5sW0QA+fA8vkUS6bbtdIdLBfAcA6qtKWGNTuWswCQE=`
- [ ] ตั้งค่า `JWT_EXPIRES_IN=2h`
- [ ] ตั้งค่า `JWT_REFRESH_EXPIRES_IN=7d`
- [ ] ตั้งค่า `PORT=4000` (ถ้าจำเป็น)
- [ ] ตั้งค่า `TZ=Asia/Bangkok`

### หลัง Deploy:
- [ ] Upload `.output/` directory
- [ ] Restart Node.js App
- [ ] ทดสอบ: `https://kdcschool.webthdesign.com/api/testdb`
- [ ] ทดสอบ: `https://kdcschool.webthdesign.com/`
- [ ] ตรวจสอบ Database connection ผ่าน
- [ ] ตรวจสอบ Redis connection ผ่าน
- [ ] ตรวจสอบ Application ทำงานปกติ

---

## 🔍 วิธีตั้งค่า Environment Variables ใน cPanel

### วิธีที่ 1: ผ่าน Node.js App Interface

1. Login เข้า cPanel
2. ไปที่ **"Node.js"** หรือ **"Node.js Selector"**
3. เลือก app: `kdcschool.webthdesign.com`
4. Click **"Environment Variables"** หรือ **"Settings"**
5. เพิ่มตัวแปรทีละตัว:
   - Click **"Add Variable"** หรือ **"+"**
   - ใส่ **Name**: `DB_HOST`
   - ใส่ **Value**: `192.250.235.23`
   - Click **"Save"** หรือ **"Add"**
6. ทำซ้ำสำหรับตัวแปรอื่นๆ

### วิธีที่ 2: ผ่าน .htaccess (ถ้าใช้ Litespeed)

ถ้า cPanel สร้าง `.htaccess` อัตโนมัติ:
- ตรวจสอบว่ามี `SetEnv` directives ถูกต้อง
- ถ้าไม่มี → เพิ่มใน `.htaccess`

---

## ⚠️ หมายเหตุสำคัญ

### 1. **Database Connection**
- ✅ ใช้ IP address: `192.250.235.23` (ยืนยันจาก Server Info)
- ✅ Port: `3306` (default MySQL port)
- ⚠️ ถ้าใช้ Socket → เพิ่ม `DB_SOCKET=/tmp/mysql.sock`

### 2. **Remote MySQL Whitelist**
- ⚠️ ถ้า database อยู่คนละ server → ต้อง whitelist IP
- ไปที่ cPanel → **"Remote MySQL"** → เพิ่ม IP ของ application server

### 3. **Redis Connection**
- ✅ ใช้ `127.0.0.1` (localhost) - ถ้า Redis อยู่ใน server เดียวกัน
- ⚠️ ถ้า Redis อยู่คนละ server → เปลี่ยน `REDIS_HOST` เป็น IP ของ Redis server

### 4. **JWT Secrets**
- ⚠️ **เปลี่ยนใน production!** - ใช้ secrets ที่ปลอดภัยกว่า
- ⚠️ **เก็บ secrets ไว้เป็นความลับ!** - ไม่ commit ลง git

### 5. **Port Configuration**
- ⚠️ `PORT` อาจถูกกำหนดโดย cPanel/Passenger อัตโนมัติ
- ⚠️ ตรวจสอบว่า port ไม่ conflict กับ services อื่น

---

## 🐛 Troubleshooting

### Database Connection Failed
- ✅ ตรวจสอบ `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`
- ✅ ตรวจสอบ Remote MySQL whitelist (ถ้า remote)
- ✅ ทดสอบ: `https://kdcschool.webthdesign.com/api/testdb`

### Redis Connection Failed
- ✅ ตรวจสอบ `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- ✅ ตรวจสอบว่า Redis service running

### Application Not Starting
- ✅ ตรวจสอบ environment variables ทั้งหมด
- ✅ ตรวจสอบ logs ใน cPanel
- ✅ ตรวจสอบ `.output/server/index.mjs` มีอยู่

---

## 📚 References

- [CPANEL_DATABASE_FIX.md](./CPANEL_DATABASE_FIX.md) - แก้ไขปัญหา Database Connection
- [SERVER_INFO_ANALYSIS.md](./SERVER_INFO_ANALYSIS.md) - วิเคราะห์ Server Information
- [DATABASE_SETUP_INFO.md](./DATABASE_SETUP_INFO.md) - ข้อมูล Database Setup

---

**สรุป**: โค้ดพร้อมแล้ว ✅ - ต้องตั้งค่า Environment Variables ใน cPanel Node.js App เท่านั้น

