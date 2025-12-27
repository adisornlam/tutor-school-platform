# 🔐 คู่มือตั้งค่า SSH ใน cPanel

**วันที่**: 23 ธันวาคม 2024  
**วัตถุประสงค์**: ตั้งค่า SSH เพื่อเข้า server และแก้ไขปัญหา database connection

---

## 📋 สรุปการตั้งค่า SSH

มี **2 วิธี** ในการตั้งค่า SSH:
1. **SSH Key (Public/Private Key)** - ปลอดภัยกว่า ⭐ แนะนำ
2. **Password Authentication** - ง่ายกว่า แต่ปลอดภัยน้อยกว่า

---

## 🔑 วิธีที่ 1: ใช้ SSH Key (แนะนำ)

### ขั้นตอนที่ 1: สร้าง SSH Key (ถ้ายังไม่มี)

เปิด Terminal (Mac/Linux) หรือ Git Bash (Windows):

```bash
# สร้าง SSH Key ใหม่
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# จะถาม:
# 1. File location (กด Enter เพื่อใช้ default: ~/.ssh/id_rsa)
# 2. Passphrase (ใส่ password หรือกด Enter เพื่อข้าม)
# 3. Confirm passphrase (ยืนยัน password หรือกด Enter)

# ดู Public Key
cat ~/.ssh/id_rsa.pub

# ดู Private Key (ระวัง! อย่าแชร์ให้ใคร)
cat ~/.ssh/id_rsa
```

### ขั้นตอนที่ 2: Import SSH Key ใน cPanel

1. **เข้า cPanel** → **SSH Access**
2. คลิก **"Import SSH Key"** หรือ **"Manage SSH Keys"**
3. กรอกข้อมูล:
   - **Key Name**: ตั้งชื่อให้เข้าใจง่าย เช่น `my-mac` หรือ `my-laptop`
   - **Public Key**: วางเนื้อหา Public Key (จาก `~/.ssh/id_rsa.pub`)
     ```
     ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC... your-email@example.com
     ```
   - **Private Key**: (Optional) ถ้าต้องการเก็บ Private Key ใน cPanel
   - **Passphrase**: (ถ้ามี) Password ที่ตั้งไว้ตอนสร้าง Key
4. คลิก **"Import"**

### ขั้นตอนที่ 3: Authorize Key (สำคัญ!)

หลังจาก Import แล้ว:
1. กลับไปที่ **"Manage SSH Keys"**
2. หา Key ที่ Import ไป
3. คลิก **"Manage"** หรือ **"Authorize"**
4. คลิก **"Authorize"** เพื่อเปิดใช้งาน Key นี้

### ขั้นตอนที่ 4: ทดสอบ SSH Connection

```bash
# SSH เข้า server
ssh webthdsw@kdcschool.webthdesign.com

# หรือใช้ IP
ssh webthdsw@192.250.235.23

# ถ้าใช้ custom port (ถ้ามี)
ssh -p 2222 webthdsw@kdcschool.webthdesign.com
```

---

## 🔒 วิธีที่ 2: ใช้ Password Authentication

### ขั้นตอนที่ 1: เปิดใช้งาน SSH ใน cPanel

1. **เข้า cPanel** → **SSH Access**
2. ดูที่ **"Access"** section
3. ตรวจสอบว่า **"SSH Access"** เปิดอยู่หรือไม่
4. ถ้ายังไม่เปิด → คลิก **"Enable"** หรือ **"Manage SSH Access"**

### ขั้นตอนที่ 2: ตั้งค่า SSH Access

ถ้าไม่มี SSH Access:
1. **cPanel** → **SSH Access** → **"Manage SSH Access"**
2. เลือก **"Enable Shell Access"**
3. ตั้งค่า:
   - **Shell**: `/bin/bash` หรือ `/bin/sh`
   - **SSH Port**: มักเป็น `2222` หรือ `22` (ตรวจสอบใน **"Server Information"**)
4. บันทึกการตั้งค่า

### ขั้นตอนที่ 3: ทดสอบ SSH Connection

```bash
# SSH เข้า server ด้วย password
ssh webthdsw@kdcschool.webthdesign.com

# จะถาม password → ใส่ cPanel password
```

---

## 🔍 ตรวจสอบ SSH Port และ Host

### วิธีที่ 1: ดูใน cPanel

1. **cPanel** → **Server Information** (หรือ **"General Information"**)
2. ดูที่:
   - **SSH Port**: มักเป็น `2222` หรือ `22`
   - **Hostname**: มักเป็น `kdcschool.webthdesign.com` หรือ IP

### วิธีที่ 2: ดูใน SSH Access

1. **cPanel** → **SSH Access**
2. ดูที่ **"Access"** section
3. จะแสดง SSH Port และ Connection info

---

## ⚠️ สิ่งที่ต้องทราบ

### 1. **SSH Port**
- cPanel/shared hosting มักใช้ port `2222` แทน `22`
- ตรวจสอบใน **"Server Information"** หรือ **"SSH Access"**

### 2. **Username**
- Username มักเป็น cPanel username
- จากภาพของคุณ: `webthdsw`

### 3. **Hostname**
- อาจเป็น domain: `kdcschool.webthdesign.com`
- หรือ IP: `192.250.235.23`

### 4. **Shell Access**
- บาง hosting อาจต้องขอเปิดใช้งานจาก support
- หรืออาจถูกปิดอยู่โดย default

---

## 🧪 ทดสอบ Connection

### Test SSH Connection

```bash
# วิธีที่ 1: ใช้ domain
ssh -v webthdsw@kdcschool.webthdesign.com -p 2222

# วิธีที่ 2: ใช้ IP
ssh -v webthdsw@192.250.235.23 -p 2222

# วิธีที่ 3: ตรวจสอบ port ก่อน
nc -zv kdcschool.webthdesign.com 2222
```

### ถ้า Connection สำเร็จ

คุณจะเห็น:
```
Welcome to cPanel & WHM
Last login: ...
[webthdsw@server ~]$
```

---

## 🔧 หลังจาก SSH เข้าได้

### ตรวจสอบ MySQL Socket Path

```bash
# ตรวจสอบ socket path
php -i | grep mysql.default_socket

# หรือ
php -r "echo ini_get('mysqli.default_socket');"

# หรือดูใน php.ini
php --ini
```

### ตรวจสอบ MySQL Connection

```bash
# ทดสอบ connection
mysql -u webthdsw_tutor -p'57*0yZiKMmDyThXx' -h localhost webthdsw_tutordb

# หรือใช้ socket
mysql -u webthdsw_tutor -p'57*0yZiKMmDyThXx' --socket=/tmp/mysql.sock webthdsw_tutordb
```

### ตรวจสอบ Environment Variables

```bash
# ดู environment variables (ถ้า Node.js app กำลังรัน)
cd ~/kdcschool.webthdesign.com
cat .env  # ถ้ามี

# หรือดูใน Node.js process
ps aux | grep node
```

---

## 📝 Checklist

### SSH Key Method
- [ ] สร้าง SSH Key (`ssh-keygen`)
- [ ] Copy Public Key (`cat ~/.ssh/id_rsa.pub`)
- [ ] Import Public Key ใน cPanel
- [ ] Authorize Key
- [ ] ทดสอบ SSH connection

### Password Method
- [ ] เปิด SSH Access ใน cPanel
- [ ] ตรวจสอบ SSH Port
- [ ] ทดสอบ SSH connection ด้วย password

---

## 🆘 Troubleshooting

### ปัญหา 1: Connection Refused

```bash
# ตรวจสอบ port
ssh -v webthdsw@kdcschool.webthdesign.com -p 2222

# ถ้าไม่ได้ ให้ลอง port อื่น
ssh -v webthdsw@kdcschool.webthdesign.com -p 22
```

**วิธีแก้**: ตรวจสอบ SSH Port ใน cPanel → Server Information

### ปัญหา 2: Permission Denied

```bash
# ตรวจสอบ key permissions
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

**วิธีแก้**: 
- ตรวจสอบว่า Key ถูก Authorize แล้วหรือยัง
- หรือลองใช้ Password authentication

### ปัญหา 3: Shell Access Disabled

**วิธีแก้**: 
- ติดต่อ hosting support เพื่อขอเปิด Shell Access
- หรือใช้ cPanel File Manager แทน

---

## 💡 หมายเหตุสำคัญ

**⚠️ ฉัน (AI Assistant) ไม่สามารถ SSH เข้า server ได้จริงๆ**

เนื่องจาก:
1. ฉันไม่มีสิทธิ์เข้าถึง SSH credentials
2. ฉันไม่มีความสามารถในการ SSH เข้า server
3. Security reasons - ไม่ควรแชร์ SSH credentials

**แต่ฉันสามารถช่วย:**
- ✅ อธิบายวิธีการตั้งค่า SSH
- ✅ แนะนำคำสั่งที่ต้องรัน
- ✅ วิเคราะห์ผลลัพธ์ที่คุณส่งมาให้
- ✅ แก้ไข code และอธิบายสิ่งที่ต้องทำ

---

## 📚 คำสั่งที่มีประโยชน์

### หลังจาก SSH เข้าได้

```bash
# ดู current directory
pwd

# ดูไฟล์และโฟลเดอร์
ls -la

# เข้า project directory
cd kdcschool.webthdesign.com

# ดู environment variables
env | grep DB_

# ดู MySQL socket path
php -r "echo ini_get('mysqli.default_socket');"

# ทดสอบ MySQL connection
mysql -u webthdsw_tutor -p'57*0yZiKMmDyThXx' -h localhost webthdsw_tutordb -e "SELECT 1"

# ดู Node.js processes
ps aux | grep node

# ดู logs
tail -f stderr.log
tail -f stdout.log

# ดู Node.js version
node --version

# ดู npm/bun version
npm --version
bun --version
```

---

*เอกสารนี้สรุปการตั้งค่า SSH ใน cPanel สำหรับแก้ไขปัญหา Database Connection วันที่ 23 ธันวาคม 2024*

