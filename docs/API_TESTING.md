# 🧪 API Testing Guide

## 🔐 Login API Testing

### Endpoint
```
POST /api/auth/login
```

### Request Body
```json
{
  "email": "admin@kdcschool.com",
  "password": "admin123"
}
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "admin@kdcschool.com",
      "first_name": "System",
      "last_name": "Administrator",
      "roles": ["system_admin"]
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Response (401)
```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID",
    "message": "Invalid email or password"
  }
}
```

---

## 🚀 วิธีทดสอบ

### 1. ใช้ Test Script (แนะนำ)
```bash
# เริ่ม server ก่อน
bun run dev

# ใน terminal อื่น รัน test
bun run test:login
```

### 2. ใช้ cURL
```bash
# Admin Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kdcschool.com",
    "password": "admin123"
  }'

# Owner Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@kdcschool.com",
    "password": "owner123"
  }'

# Invalid Credentials
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@email.com",
    "password": "wrong"
  }'
```

### 3. ใช้ Browser/Postman
1. URL: `http://localhost:4000/api/auth/login`
2. Method: `POST`
3. Headers: `Content-Type: application/json`
4. Body:
```json
{
  "email": "admin@kdcschool.com",
  "password": "admin123"
}
```

---

## 📋 Test Cases

### ✅ Success Cases
- Admin login with correct credentials
- Owner login with correct credentials

### ❌ Failure Cases
- Invalid email
- Invalid password
- Missing email
- Missing password

---

## 🔑 Test Users

### Admin
- Email: `admin@kdcschool.com`
- Password: `admin123`

### Owner
- Email: `owner@kdcschool.com`
- Password: `owner123`

---

## 📝 Notes

- Access token expires in 15 minutes
- Refresh token expires in 7 days
- Tokens are also set as HTTP-only cookies
- Server must be running on port 4000

---

*API Testing Guide for Tutor School Platform*

