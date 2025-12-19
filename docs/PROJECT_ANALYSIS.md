# วิเคราะห์ระบบ: Multi-Branch Tutor School Platform

## 📋 สรุปภาพรวมโปรเจกต์

### วัตถุประสงค์หลัก
สร้างแพลตฟอร์มการศึกษาแบบ Full-stack สำหรับโรงเรียนกวดวิชาหลายสาขา โดยรองรับ:
- การลงทะเบียนและจัดการนักเรียน
- การจัดการหลักสูตรและอาจารย์
- ระบบชำระเงินออนไลน์
- การเข้าถึงเนื้อหาการเรียนรู้ (Live & VOD)
- ระบบโปรโมชั่นและส่วนลด
- การแจ้งเตือนแบบ Real-time

### Tech Stack
- **Frontend + Backend**: Nuxt.js 4 (Full-stack mode)
- **Database**: MySQL 8
- **Authentication**: JWT + Refresh Token
- **Real-time**: Server-Sent Events (SSE)
- **Future**: Payment Gateway, Video Streaming Integration

---

## 🏗️ สถาปัตยกรรมระบบ (Architecture)

### 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Nuxt.js 4 Application                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Frontend   │  │  API Routes  │  │   Services   │  │
│  │  (Pages/     │  │  (server/    │  │  (Business   │  │
│  │   Components)│  │   api/)      │  │   Logic)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                          │                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │         SSE Endpoint (/api/sse/notifications)    │  │
│  └──────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────┘
                            │
                    ┌───────▼───────┐
                    │   MySQL 8     │
                    │   Database    │
                    └───────────────┘
```

### 2. Layer Separation

1. **Presentation Layer** (Pages/Components)
   - Vue 3 Composition API
   - Server-side rendering (SSR)
   - Client-side interactivity

2. **API Layer** (server/api/)
   - RESTful endpoints
   - Request validation
   - Authentication middleware

3. **Service Layer** (server/services/)
   - Business logic
   - Data transformation
   - External API integration

4. **Data Access Layer** (server/utils/db/)
   - Database queries
   - Transaction management
   - Query builders

---

## 🗄️ Database Schema Design

### Core Tables Overview

#### 1. User & Authentication Module

```sql
users
├── id (PK)
├── email (unique)
├── password_hash
├── first_name
├── last_name
├── phone
├── avatar_url
├── status (active/inactive/suspended)
├── email_verified_at
├── created_at
└── updated_at

roles
├── id (PK)
├── name (student/tutor/branch_admin/system_admin/owner)
├── description
└── created_at

user_roles
├── id (PK)
├── user_id (FK → users)
├── role_id (FK → roles)
└── created_at

refresh_tokens
├── id (PK)
├── user_id (FK → users)
├── token (unique)
├── expires_at
└── created_at
```

#### 2. Branch Management Module

```sql
branches
├── id (PK)
├── name
├── code (unique)
├── address
├── phone
├── email
├── status (active/inactive)
├── created_at
└── updated_at

branch_admins
├── id (PK)
├── branch_id (FK → branches)
├── user_id (FK → users)
└── assigned_at
```

#### 3. Tutor Management Module

```sql
tutors
├── id (PK)
├── user_id (FK → users, unique)
├── bio
├── expertise (JSON array)
├── hourly_rate
├── status (active/inactive)
└── created_at

tutor_branches
├── id (PK)
├── tutor_id (FK → tutors)
├── branch_id (FK → branches)
└── assigned_at

tutor_courses
├── id (PK)
├── tutor_id (FK → tutors)
├── course_id (FK → courses)
├── branch_id (FK → branches)
└── assigned_at
```

#### 4. Course & Curriculum Module

```sql
courses
├── id (PK)
├── title
├── description
├── type (live_online/vod/hybrid)
├── price
├── duration_hours
├── level (beginner/intermediate/advanced)
├── status (draft/published/archived)
├── created_by (FK → users)
└── created_at

course_branches
├── id (PK)
├── course_id (FK → courses)
├── branch_id (FK → branches)
├── seat_limit
├── current_enrollments
└── is_available

course_schedules
├── id (PK)
├── course_id (FK → courses)
├── branch_id (FK → branches)
├── tutor_id (FK → tutors)
├── start_datetime
├── end_datetime
├── session_type (live/vod)
├── meeting_link (for live)
├── video_url (for vod)
└── status (scheduled/ongoing/completed/cancelled)
```

#### 5. Promotion & Pricing Module

```sql
promotions
├── id (PK)
├── code (unique, nullable)
├── name
├── description
├── type (percentage/fixed_price)
├── discount_value
├── start_date
├── end_date
├── usage_limit (nullable)
├── used_count
├── is_stackable (boolean)
├── is_global (boolean)
├── status (active/inactive)
└── created_at

promotion_courses
├── id (PK)
├── promotion_id (FK → promotions)
├── course_id (FK → courses)
└── created_at

promotion_branches
├── id (PK)
├── promotion_id (FK → promotions)
├── branch_id (FK → branches)
└── created_at

promotion_usage
├── id (PK)
├── promotion_id (FK → promotions)
├── user_id (FK → users)
├── enrollment_id (FK → enrollments, nullable)
├── payment_id (FK → payments)
├── discount_amount
└── used_at
```

#### 6. Enrollment & Learning Rights Module

```sql
enrollments
├── id (PK)
├── student_id (FK → users)
├── course_id (FK → courses)
├── branch_id (FK → branches)
├── enrollment_date
├── status (pending/active/completed/cancelled)
├── payment_id (FK → payments, nullable)
└── created_at

learning_rights
├── id (PK)
├── enrollment_id (FK → enrollments)
├── access_type (live/vod/both)
├── expires_at (nullable)
├── is_active
└── created_at
```

#### 7. Payment Module

```sql
payments
├── id (PK)
├── user_id (FK → users)
├── enrollment_id (FK → enrollments, nullable)
├── amount
├── discount_amount
├── final_amount
├── currency (default: THB)
├── status (pending/paid/failed/refunded)
├── payment_method
├── transaction_id (unique, nullable)
├── invoice_number (unique)
├── paid_at (nullable)
└── created_at

payment_items
├── id (PK)
├── payment_id (FK → payments)
├── item_type (course/enrollment)
├── item_id
├── description
├── quantity
├── unit_price
└── total_price
```

#### 8. Learning Module

```sql
learning_progress
├── id (PK)
├── enrollment_id (FK → enrollments)
├── session_id (FK → course_sessions, nullable)
├── progress_percentage
├── last_accessed_at
├── completed_at (nullable)
└── updated_at

course_sessions
├── id (PK)
├── course_id (FK → courses)
├── schedule_id (FK → course_schedules)
├── title
├── session_number
├── content_type (live/vod)
├── video_url (nullable)
├── meeting_link (nullable)
├── materials (JSON array)
└── created_at
```

#### 9. Notification Module

```sql
notifications
├── id (PK)
├── user_id (FK → users, nullable for broadcast)
├── role_id (FK → roles, nullable for user-specific)
├── branch_id (FK → branches, nullable)
├── type (course_reminder/payment_success/promotion/admin_broadcast)
├── title
├── message
├── data (JSON, nullable)
├── is_read
├── read_at (nullable)
└── created_at

notification_reads
├── id (PK)
├── notification_id (FK → notifications)
├── user_id (FK → users)
└── read_at
```

### Indexes Strategy

```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX idx_course_schedules_datetime ON course_schedules(start_datetime);
```

---

## 🔌 API Endpoints Structure

### Authentication Module
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me
PUT    /api/auth/profile
PUT    /api/auth/password
```

### Branch Management
```
GET    /api/branches
GET    /api/branches/:id
POST   /api/branches (admin/owner only)
PUT    /api/branches/:id (admin/owner only)
DELETE /api/branches/:id (owner only)
GET    /api/branches/:id/admins
POST   /api/branches/:id/admins (owner only)
```

### Tutor Management
```
GET    /api/tutors
GET    /api/tutors/:id
POST   /api/tutors (admin/owner only)
PUT    /api/tutors/:id
GET    /api/tutors/:id/branches
POST   /api/tutors/:id/branches (admin/owner only)
GET    /api/tutors/:id/courses
POST   /api/tutors/:id/courses (admin/owner only)
```

### Course Management
```
GET    /api/courses
GET    /api/courses/:id
POST   /api/courses (admin/owner only)
PUT    /api/courses/:id (admin/owner only)
DELETE /api/courses/:id (admin/owner only)
GET    /api/courses/:id/schedules
POST   /api/courses/:id/schedules (admin/owner only)
GET    /api/courses/:id/branches
```

### Enrollment
```
GET    /api/enrollments (student: own, admin: branch)
GET    /api/enrollments/:id
POST   /api/enrollments
PUT    /api/enrollments/:id/status (admin only)
GET    /api/enrollments/:id/learning-rights
```

### Payment
```
GET    /api/payments (student: own, admin: branch)
GET    /api/payments/:id
POST   /api/payments
POST   /api/payments/:id/verify (webhook)
GET    /api/payments/:id/invoice
```

### Promotion
```
GET    /api/promotions
GET    /api/promotions/:id
POST   /api/promotions (admin/owner only)
PUT    /api/promotions/:id (admin/owner only)
POST   /api/promotions/validate (check code)
```

### Learning
```
GET    /api/learning/my-courses
GET    /api/learning/courses/:id/sessions
GET    /api/learning/sessions/:id
POST   /api/learning/sessions/:id/access
POST   /api/learning/progress
GET    /api/learning/progress/:enrollment_id
```

### Notifications (SSE)
```
GET    /api/sse/notifications (SSE stream)
GET    /api/notifications
PUT    /api/notifications/:id/read
PUT    /api/notifications/read-all
```

### Admin Dashboard
```
GET    /api/admin/stats (branch/system/owner)
GET    /api/admin/revenue
GET    /api/admin/users
GET    /api/admin/tutor-performance
```

---

## 📁 Project Structure

```
Tutor-School-Platform/
├── .nuxt/                    # Nuxt build output
├── .output/                  # Production build
├── assets/                   # Static assets
├── components/              # Vue components
│   ├── common/             # Reusable components
│   ├── auth/               # Auth components
│   ├── courses/            # Course components
│   └── admin/              # Admin components
├── composables/            # Vue composables
│   ├── useAuth.ts
│   ├── useNotifications.ts
│   └── useSSE.ts
├── layouts/                # Layout components
│   ├── default.vue
│   ├── admin.vue
│   └── student.vue
├── middleware/             # Route middleware
│   ├── auth.ts
│   └── role.ts
├── pages/                  # Pages (auto-routing)
│   ├── index.vue
│   ├── auth/
│   ├── courses/
│   ├── enrollments/
│   └── admin/
├── public/                 # Public static files
├── server/                 # Server-side code
│   ├── api/               # API routes
│   │   ├── auth/
│   │   ├── courses/
│   │   ├── enrollments/
│   │   ├── payments/
│   │   ├── promotions/
│   │   ├── learning/
│   │   ├── sse/
│   │   └── admin/
│   ├── services/          # Business logic
│   │   ├── auth.service.ts
│   │   ├── course.service.ts
│   │   ├── enrollment.service.ts
│   │   ├── payment.service.ts
│   │   ├── promotion.service.ts
│   │   └── notification.service.ts
│   ├── utils/             # Utilities
│   │   ├── db.ts          # Database connection
│   │   ├── jwt.ts         # JWT helpers
│   │   ├── validation.ts  # Validation helpers
│   │   └── permissions.ts # RBAC helpers
│   └── middleware/        # Server middleware
│       ├── auth.middleware.ts
│       └── role.middleware.ts
├── types/                  # TypeScript types
│   ├── user.types.ts
│   ├── course.types.ts
│   ├── enrollment.types.ts
│   └── payment.types.ts
├── .env                    # Environment variables
├── .env.example
├── nuxt.config.ts          # Nuxt configuration
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔐 Security & Authentication Design

### JWT Strategy
- **Access Token**: Short-lived (15 minutes)
- **Refresh Token**: Long-lived (7 days), stored in database
- **Token Rotation**: New refresh token on each refresh

### RBAC Implementation
```typescript
// Permission-based system
interface Permission {
  resource: string;  // 'courses', 'enrollments', etc.
  action: string;   // 'create', 'read', 'update', 'delete'
  scope: string;    // 'own', 'branch', 'all'
}

// Role-Permission mapping
roles_permissions table:
├── role_id
├── permission_id
└── scope
```

### Middleware Chain
```
Request → Auth Middleware → Role Middleware → Route Handler
```

---

## 🔔 SSE Notification System

### Architecture
```
Client                    Server
  │                         │
  │─── GET /api/sse/notifications ──>│
  │<── SSE Stream ─────────│
  │                         │
  │                         │ (Event occurs)
  │                         │─── Create notification ──> DB
  │<── Event: notification ─│
  │                         │
```

### Event Types
- `course_reminder`: 24h before class
- `payment_success`: Payment confirmed
- `promotion_announcement`: New promotion
- `admin_broadcast`: System-wide message
- `enrollment_confirmed`: Enrollment successful

### Implementation Notes
- One SSE connection per authenticated user
- Connection timeout: 30 seconds (auto-reconnect)
- Event filtering by user role and branch
- Fallback to polling if SSE unavailable

---

## 💡 Key Design Decisions

### 1. Multi-Branch Architecture
- **Decision**: Branch as first-class entity
- **Rationale**: Tutors, courses, and promotions can be branch-specific
- **Impact**: All queries need branch context

### 2. Tutor-Branch-Course Relationship
- **Decision**: Many-to-many relationships
- **Rationale**: Tutors can teach multiple courses in multiple branches
- **Implementation**: Junction tables (`tutor_branches`, `tutor_courses`)

### 3. Promotion System
- **Decision**: Flexible promotion rules with stackability flag
- **Rationale**: Business needs vary (global vs branch-specific)
- **Implementation**: Separate tables for promotion scope

### 4. Learning Rights
- **Decision**: Separate `learning_rights` from `enrollments`
- **Rationale**: Allows expiration, access type control
- **Impact**: Additional validation on learning access

### 5. Soft Deletes
- **Decision**: Use `status` fields instead of hard deletes
- **Rationale**: Audit trail, data recovery
- **Tables**: `users`, `branches`, `courses`, `promotions`

---

## ⚠️ Potential Challenges & Solutions

### 1. Concurrent Enrollment
- **Challenge**: Race condition when checking seat limits
- **Solution**: Database transactions with row-level locking

### 2. SSE Connection Management
- **Challenge**: Multiple tabs, connection drops
- **Solution**: Connection pooling, heartbeat mechanism

### 3. Payment Webhook Security
- **Challenge**: Verify webhook authenticity
- **Solution**: HMAC signature validation

### 4. Complex Promotion Rules
- **Challenge**: Stackable promotions, usage limits
- **Solution**: Service layer with rule engine

### 5. Multi-Branch Data Isolation
- **Challenge**: Branch admins should only see their branch data
- **Solution**: Middleware-based data filtering

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup (Nuxt.js 4, MySQL connection)
- [ ] Database schema creation
- [ ] Authentication system (JWT + Refresh Token)
- [ ] RBAC foundation
- [ ] Basic user management

### Phase 2: Core Modules (Week 3-4)
- [ ] Branch management
- [ ] Tutor management
- [ ] Course management
- [ ] Enrollment system

### Phase 3: Business Logic (Week 5-6)
- [ ] Promotion system
- [ ] Payment integration
- [ ] Learning rights management
- [ ] Learning progress tracking

### Phase 4: Real-time & Admin (Week 7-8)
- [ ] SSE notification system
- [ ] Admin dashboard
- [ ] Reporting & analytics
- [ ] Owner dashboard

### Phase 5: Polish & Testing (Week 9-10)
- [ ] Error handling
- [ ] Input validation
- [ ] Security audit
- [ ] Performance optimization
- [ ] Documentation

---

## 📊 Database Relationships Summary

```
users ──┬── user_roles ── roles
        ├── tutors
        ├── enrollments
        ├── payments
        └── notifications

branches ──┬── branch_admins ── users
           ├── tutor_branches ── tutors
           ├── course_branches ── courses
           ├── enrollments
           └── promotion_branches ── promotions

courses ──┬── course_branches ── branches
          ├── course_schedules
          ├── tutor_courses
          ├── enrollments
          └── promotion_courses ── promotions

enrollments ──┬── learning_rights
              ├── payments
              └── learning_progress
```

---

## ✅ Next Steps

1. **Review this analysis** - Confirm architecture decisions
2. **Database schema refinement** - Adjust based on specific requirements
3. **API endpoint finalization** - Add/remove endpoints as needed
4. **Start implementation** - Begin with Phase 1

---

## 📝 Notes

- All timestamps use UTC
- Currency default: THB (Thai Baht)
- Date format: ISO 8601
- API responses: JSON format
- Error responses: Consistent error format
- Logging: Structured logging for debugging

---

*Document created: 2024*
*Last updated: 2024*

