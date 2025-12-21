# Redis Setup Guide สำหรับ Local Development

## การติดตั้ง Redis บน macOS

### วิธีที่ 1: ใช้ Script อัตโนมัติ (แนะนำ)

```bash
./scripts/setup-redis.sh
```

Script นี้จะ:
- ✅ ตรวจสอบว่า Redis ติดตั้งอยู่หรือยัง
- ✅ ติดตั้ง Redis ผ่าน Homebrew (ถ้ายังไม่ได้ติดตั้ง)
- ✅ เริ่มต้น Redis server
- ✅ แสดงข้อมูลและคำสั่งที่เป็นประโยชน์

### วิธีที่ 2: ติดตั้งด้วยตนเอง

```bash
# ติดตั้ง Redis
brew install redis

# เริ่มต้น Redis (รันใน background)
brew services start redis

# หรือรัน Redis ในโหมด foreground (สำหรับ debug)
redis-server
```

## การตรวจสอบว่า Redis ทำงานหรือไม่

```bash
# ตรวจสอบว่า Redis ทำงาน
redis-cli ping
# ควรตอบกลับ: PONG

# ตรวจสอบสถานะ service
brew services list | grep redis

# เข้าสู่ Redis CLI
redis-cli
```

## Environment Variables

ตรวจสอบว่าไฟล์ `.env` ของคุณมีค่าเหล่านี้:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

**หมายเหตุ:** Redis บน localhost โดยปกติจะไม่ใช้ password (`REDIS_PASSWORD` ว่างเปล่า)

## คำสั่งที่เป็นประโยชน์

```bash
# เริ่มต้น Redis
brew services start redis

# หยุด Redis
brew services stop redis

# Restart Redis
brew services restart redis

# ดู logs
tail -f /opt/homebrew/var/log/redis.log
# หรือ
tail -f /usr/local/var/log/redis.log  # สำหรับ Intel Mac

# ลบข้อมูลใน Redis (ระวัง!)
redis-cli FLUSHALL
```

## การแก้ไขปัญหา

### Redis ไม่สามารถเชื่อมต่อได้

1. ตรวจสอบว่า Redis ทำงาน:
   ```bash
   redis-cli ping
   ```

2. ตรวจสอบ port:
   ```bash
   lsof -i :6379
   ```

3. Restart Redis:
   ```bash
   brew services restart redis
   ```

### Error: "Connection refused"

- ตรวจสอบว่า Redis service ทำงานอยู่:
  ```bash
  brew services list
  ```
- เริ่มต้น Redis:
  ```bash
  brew services start redis
  ```

## การปิด Redis เมื่อไม่ใช้งาน

```bash
# หยุด Redis service
brew services stop redis
```

หรือถ้าต้องการให้ Redis รันตลอดเวลา (แนะนำสำหรับ development):
- ใช้ `brew services start redis` ซึ่งจะทำให้ Redis เริ่มต้นอัตโนมัติเมื่อ boot

## ข้อมูลเพิ่มเติม

- Redis Documentation: https://redis.io/documentation
- Homebrew Services: https://github.com/Homebrew/homebrew-services

