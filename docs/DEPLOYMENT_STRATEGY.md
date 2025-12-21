# Deployment Strategy สำหรับ Tutor School Platform

## 📋 สถานการณ์

- **Demo/Staging**: `kdcschool.webthdesign.com` - สำหรับทดสอบและ demo ให้ลูกค้า
- **Production**: Domain ที่ลูกค้าให้มา (อาจจะใหม่หรือมีอยู่แล้ว) - เมื่อระบบเสร็จสมบูรณ์
- **Development**: `localhost:4000` - สำหรับ development

---

## 🏗️ Multi-Environment Strategy

### Environment Structure

```
┌─────────────────────────────────────────────────────────┐
│  Development (Local)                                     │
│  - URL: http://localhost:4000                           │
│  - Database: Local MySQL (tutordb_dev)                  │
│  - Purpose: Development & Testing                       │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Staging/Demo (webthdesign.com)                         │
│  - URL: https://kdcschool.webthdesign.com               │
│  - Database: Staging Database (tutordb_staging)         │
│  - Purpose: Demo ให้ลูกค้า, QA, Testing                 │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Production (ลูกค้า Domain)                             │
│  - URL: https://domain-that-customer-provides.com       │
│  - Database: Production Database (tutordb_prod)         │
│  - Purpose: Live System                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Environment Configuration

### 1. Environment Variables Structure

#### `.env.development` (Local)
```bash
# Development Environment
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3307
DB_NAME=tutordb_dev
DB_USER=root
DB_PASSWORD=

# JWT
JWT_SECRET=dev-secret-key-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production
JWT_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d

# API
API_BASE=/api

# Domain
APP_URL=http://localhost:4000
```

#### `.env.staging` (Demo/Staging)
```bash
# Staging Environment
NODE_ENV=staging

# Database (Hosting Database)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tutordb_staging
DB_USER=staging_user
DB_PASSWORD=staging_password_here

# JWT (Generate new secrets for staging)
JWT_SECRET=staging-secret-key-change-before-production
JWT_REFRESH_SECRET=staging-refresh-secret-key-change-before-production
JWT_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d

# API
API_BASE=/api

# Domain
APP_URL=https://kdcschool.webthdesign.com
```

#### `.env.production` (Production - ลูกค้า Domain)
```bash
# Production Environment
NODE_ENV=production

# Database (Production Database)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tutordb_prod
DB_USER=prod_user
DB_PASSWORD=prod_secure_password_here

# JWT (Generate STRONG secrets for production!)
JWT_SECRET=production-secret-key-very-strong-random-string-here
JWT_REFRESH_SECRET=production-refresh-secret-key-very-strong-random-string-here
JWT_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d

# API
API_BASE=/api

# Domain (Update when customer provides domain)
APP_URL=https://domain-that-customer-provides.com
```

---

## 🗄️ Database Strategy

### Separate Databases per Environment

**สำคัญมาก**: ใช้ฐานข้อมูลแยกสำหรับแต่ละ environment!

```
Development:  tutordb_dev      (Local)
Staging:      tutordb_staging  (Hosting - kdcschool.webthdesign.com)
Production:   tutordb_prod     (Hosting - customer domain)
```

### การสร้าง Database ใน Hosting

#### สำหรับ Staging (kdcschool.webthdesign.com)
```sql
CREATE DATABASE tutordb_staging CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'staging_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON tutordb_staging.* TO 'staging_user'@'localhost';
FLUSH PRIVILEGES;
```

#### สำหรับ Production (Customer Domain)
```sql
CREATE DATABASE tutordb_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'prod_user'@'localhost' IDENTIFIED BY 'very_secure_password';
GRANT ALL PRIVILEGES ON tutordb_prod.* TO 'prod_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 🚀 Deployment Workflow

### Phase 1: Setup Staging Environment (kdcschool.webthdesign.com)

#### 1.1 Setup Domain & DNS
```bash
# ใน DNS ของ webthdesign.com
Type: A Record หรือ CNAME
Name: kdcschool
Value: IP address ของ hosting หรือ @
```

#### 1.2 Setup SSL Certificate
- ใช้ Let's Encrypt (ฟรี) หรือ SSL ที่ hosting ให้มา
- สำหรับ subdomain: อาจต้องใช้ Wildcard SSL หรือ SSL แยก

#### 1.3 Setup Environment Variables
- สร้าง `.env.staging` ใน hosting
- หรือตั้งค่าผ่าน hosting control panel

#### 1.4 Database Setup
```bash
# SSH เข้า hosting
# สร้าง database และ user
mysql -u root -p

# รัน migration
bun run db:migrate
# หรือ
npm run db:migrate
```

#### 1.5 Deploy Application
```bash
# Build สำหรับ staging
npm run build

# Start application (ผ่าน PM2 หรือ hosting service)
pm2 start .output/server/index.mjs --name "kdcschool-staging"
```

---

### Phase 2: Demo & Testing (kdcschool.webthdesign.com)

#### 2.1 Demo Data Setup
```bash
# Import demo data (ถ้ามี)
bun run db:seed-courses-sample
bun run db:seed-test-users
```

#### 2.2 Testing Checklist
- [ ] User registration
- [ ] Login/Logout
- [ ] Course listing
- [ ] Enrollment process
- [ ] Payment flow
- [ ] Admin functions
- [ ] Mobile responsiveness
- [ ] Email notifications

#### 2.3 Customer Feedback
- เก็บ feedback จากลูกค้า
- แก้ไขตาม feedback
- Update staging environment

---

### Phase 3: Production Deployment (Customer Domain)

#### 3.1 Domain Setup
```bash
# เมื่อลูกค้าให้ domain มา
# Update DNS records
# Setup SSL certificate
```

#### 3.2 Database Migration จาก Staging → Production

**⚠️ สำคัญ: ไม่ควร copy data จาก staging ไป production โดยตรง!**

**แนะนำ:**
1. **สร้าง Production Database ใหม่** (clean database)
2. **Run migrations** เพื่อสร้าง schema
3. **Import เฉพาะ Master Data** (roles, grade levels, subjects, etc.)
4. **ไม่ต้อง import User Data, Courses, Enrollments** - ให้เป็นข้อมูลใหม่

**Exception**: หากลูกค้ามีข้อมูลเดิมที่ต้องการ migrate:
```bash
# Export specific data จาก staging
mysqldump -u staging_user -p tutordb_staging \
  --tables courses enrollments users \
  > staging_data.sql

# Review และ clean data
# Import ไปยัง production (ระวัง!)
mysql -u prod_user -p tutordb_prod < staging_data.sql
```

#### 3.3 Application Deployment
```bash
# Build สำหรับ production
NODE_ENV=production npm run build

# Deploy ไปยัง production server
# Update environment variables
# Start application
```

#### 3.4 Final Testing
- [ ] All features working
- [ ] SSL certificate valid
- [ ] Email sending working
- [ ] Payment gateway (if applicable)
- [ ] Backup system working

---

## 📝 Configuration Files

### 1. Update `nuxt.config.ts` for Multi-Environment

```typescript
export default defineNuxtConfig({
  // ... existing config
  
  runtimeConfig: {
    // Private (server-only)
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: parseInt(process.env.DB_PORT || '3307'),
    dbName: process.env.DB_NAME || 'tutordb',
    dbUser: process.env.DB_USER || 'root',
    dbPassword: process.env.DB_PASSWORD || '',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    
    // Public (exposed to client)
    public: {
      apiBase: process.env.API_BASE || '/api',
      appName: 'KDC Tutor School',
      appVersion: '1.0.0',
      appUrl: process.env.APP_URL || 'http://localhost:4000',
      environment: process.env.NODE_ENV || 'development'
    }
  }
})
```

### 2. Create `.env.example` Template

```bash
# Copy this file to .env.development, .env.staging, or .env.production
# and update the values accordingly

NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3307
DB_NAME=tutordb
DB_USER=root
DB_PASSWORD=

# JWT Configuration
# Generate strong random strings for production!
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d

# API Configuration
API_BASE=/api

# Application URL
APP_URL=http://localhost:4000
```

---

## 🔐 Security Best Practices

### 1. JWT Secrets

**⚠️ สำคัญมาก**: ใช้ secrets ที่แตกต่างกันในแต่ละ environment!

```bash
# Generate strong random strings
# Development: ใช้ secrets อ่อนได้ (ไม่สำคัญ)
# Staging: ใช้ secrets แข็งปานกลาง
# Production: ใช้ secrets แข็งมาก! (ไม่ควร leak ออกมา)

# วิธี generate random secret:
openssl rand -base64 32
# หรือ
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Database Passwords

- ใช้ passwords ที่แข็งแรงใน staging และ production
- ไม่ควรใช้ password เดียวกัน
- ไม่ควร commit passwords ลง git!

### 3. Environment Variables

- ใช้ `.env` files สำหรับ local development
- ใช้ hosting control panel สำหรับ staging/production
- **Never commit** `.env` files to git!

---

## 🔄 Migration Checklist: Staging → Production

### Pre-Migration
- [ ] ทดสอบทุก features ใน staging
- [ ] ลูกค้า approve ระบบแล้ว
- [ ] มี domain จากลูกค้าแล้ว
- [ ] Setup DNS และ SSL สำหรับ domain ใหม่
- [ ] สร้าง production database
- [ ] Generate production JWT secrets
- [ ] Backup staging database (เผื่อต้องการ rollback)

### Migration Steps
- [ ] Run migrations บน production database
- [ ] Import master data (ถ้ามี)
- [ ] Setup environment variables บน production
- [ ] Deploy application ไปยัง production
- [ ] Test production environment
- [ ] Setup backup system
- [ ] Setup monitoring (optional)

### Post-Migration
- [ ] Verify all features working
- [ ] Test email sending
- [ ] Test payment flow (if applicable)
- [ ] Inform customer about go-live
- [ ] Document production credentials (securely!)
- [ ] Setup maintenance plan

---

## 📊 Monitoring & Maintenance

### Staging Environment
- **Purpose**: Demo, QA, Testing
- **Data**: อาจลบและ reset ได้ (demo data)
- **Uptime**: ไม่จำเป็นต้อง 100% (สามารถ maintenance ได้)

### Production Environment
- **Purpose**: Live System
- **Data**: ข้อมูลจริงของลูกค้า - สำคัญมาก!
- **Uptime**: ควรมี uptime สูง (99%+)
- **Backup**: สำรองข้อมูลทุกวัน (หรือมากกว่านั้น)
- **Monitoring**: ควรมี monitoring และ alerting

---

## 💡 Tips & Best Practices

### 1. **Use Different Database Names**
```
tutordb_dev      (development)
tutordb_staging  (staging/demo)
tutordb_prod     (production)
```

### 2. **Separate User Accounts**
- สร้าง database user แยกสำหรับแต่ละ environment
- ไม่ควรใช้ root user ใน production!

### 3. **Version Control**
- Tag versions เมื่อ deploy
- ใช้ Git tags เพื่อ track deployments
```bash
git tag -a v1.0.0-staging -m "Staging deployment"
git tag -a v1.0.0-production -m "Production deployment"
```

### 4. **Documentation**
- เก็บ credentials อย่างปลอดภัย (ใช้ password manager)
- Document deployment steps
- Document rollback procedures

### 5. **Testing Strategy**
- Test ใน staging ก่อน deploy ไป production
- ให้ลูกค้า test และ approve ใน staging
- มี test checklist สำหรับแต่ละ deployment

---

## ✅ Summary

### Current Setup
- **Development**: `localhost:4000` (local)
- **Staging/Demo**: `kdcschool.webthdesign.com` (สำหรับ demo)
- **Production**: Customer domain (เมื่อเสร็จสมบูรณ์)

### Key Points
1. ✅ ใช้ database แยกสำหรับแต่ละ environment
2. ✅ ใช้ JWT secrets ที่แตกต่างกัน
3. ✅ ใช้ environment variables สำหรับ configuration
4. ✅ Test thoroughly ใน staging ก่อน production
5. ✅ Backup production database อย่างสม่ำเสมอ

---

**Last Updated**: 2025-01-XX

