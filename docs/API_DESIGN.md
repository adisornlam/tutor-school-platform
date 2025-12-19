# API Design & Implementation Plan

## API Endpoints Overview

### Base URL Structure
```
/api/{module}/{resource}/{action}
```

### Response Format
```typescript
// Success Response
{
  success: true,
  data: T,
  message?: string
}

// Error Response
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

---

## 1. Authentication Module

### POST /api/auth/register
**Description**: Register new user

**Request Body**:
```json
{
  "email": "student@example.com",
  "password": "securePassword123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "0812345678"
}
```

**Response**: `{ user, accessToken, refreshToken }`

**Validation**:
- Email format
- Password strength (min 8 chars)
- Email uniqueness

---

### POST /api/auth/login
**Description**: User login

**Request Body**:
```json
{
  "email": "student@example.com",
  "password": "securePassword123"
}
```

**Response**: `{ user, accessToken, refreshToken }`

---

### POST /api/auth/refresh
**Description**: Refresh access token

**Request Body**:
```json
{
  "refreshToken": "refresh_token_string"
}
```

**Response**: `{ accessToken, refreshToken }`

**Security**: Token rotation on refresh

---

### POST /api/auth/logout
**Description**: Logout user (invalidate refresh token)

**Headers**: `Authorization: Bearer {accessToken}`

**Response**: `{ message: "Logged out successfully" }`

---

### GET /api/auth/me
**Description**: Get current user profile

**Headers**: `Authorization: Bearer {accessToken}`

**Response**: `{ user, roles }`

---

### PUT /api/auth/profile
**Description**: Update user profile

**Headers**: `Authorization: Bearer {accessToken}`

**Request Body**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "0812345678",
  "avatar_url": "https://..."
}
```

---

### PUT /api/auth/password
**Description**: Change password

**Headers**: `Authorization: Bearer {accessToken}`

**Request Body**:
```json
{
  "current_password": "oldPassword",
  "new_password": "newSecurePassword"
}
```

---

## 2. Branch Management Module

### GET /api/branches
**Description**: List all branches (filtered by role)

**Query Params**:
- `status`: active|inactive
- `page`: number
- `limit`: number

**Access**: All authenticated users

**Response**: `{ branches: [], total: number, page: number }`

---

### GET /api/branches/:id
**Description**: Get branch details

**Access**: All authenticated users

**Response**: `{ branch, admins: [] }`

---

### POST /api/branches
**Description**: Create new branch

**Headers**: `Authorization: Bearer {accessToken}`

**Access**: System Admin, Owner only

**Request Body**:
```json
{
  "name": "สาขาเซ็นทรัลเวิลด์",
  "code": "CW001",
  "address": "999/9 Rama I Rd",
  "phone": "021234567",
  "email": "cw@school.com"
}
```

---

### PUT /api/branches/:id
**Description**: Update branch

**Access**: Branch Admin (own branch), System Admin, Owner

**Request Body**: Same as POST

---

### DELETE /api/branches/:id
**Description**: Deactivate branch (soft delete)

**Access**: Owner only

---

### GET /api/branches/:id/admins
**Description**: Get branch administrators

**Access**: Branch Admin (own branch), System Admin, Owner

---

### POST /api/branches/:id/admins
**Description**: Assign admin to branch

**Access**: Owner only

**Request Body**:
```json
{
  "user_id": 123
}
```

---

## 3. Tutor Management Module

### GET /api/tutors
**Description**: List tutors

**Query Params**:
- `branch_id`: filter by branch
- `status`: active|inactive
- `page`, `limit`

**Response**: `{ tutors: [], total: number }`

---

### GET /api/tutors/:id
**Description**: Get tutor details

**Response**: `{ tutor, user, branches: [], courses: [] }`

---

### POST /api/tutors
**Description**: Create tutor profile

**Access**: Admin, Owner only

**Request Body**:
```json
{
  "user_id": 123,
  "bio": "Experienced math tutor",
  "expertise": ["Mathematics", "Physics"],
  "hourly_rate": 500.00
}
```

---

### PUT /api/tutors/:id
**Description**: Update tutor profile

**Access**: Tutor (own profile), Admin, Owner

---

### GET /api/tutors/:id/branches
**Description**: Get tutor's assigned branches

---

### POST /api/tutors/:id/branches
**Description**: Assign tutor to branch

**Access**: Admin, Owner only

**Request Body**:
```json
{
  "branch_id": 1
}
```

---

### GET /api/tutors/:id/courses
**Description**: Get tutor's assigned courses

**Query Params**: `branch_id` (optional)

---

### POST /api/tutors/:id/courses
**Description**: Assign tutor to course

**Access**: Admin, Owner only

**Request Body**:
```json
{
  "course_id": 5,
  "branch_id": 1
}
```

---

## 4. Course Management Module

### GET /api/courses
**Description**: List courses

**Query Params**:
- `branch_id`: filter by branch
- `type`: live_online|vod|hybrid
- `status`: draft|published|archived
- `level`: beginner|intermediate|advanced
- `page`, `limit`

**Response**: `{ courses: [], total: number }`

---

### GET /api/courses/:id
**Description**: Get course details

**Response**: `{ course, branches: [], schedules: [], tutors: [] }`

---

### POST /api/courses
**Description**: Create course

**Access**: Admin, Owner only

**Request Body**:
```json
{
  "title": "คณิตศาสตร์ ม.4",
  "description": "หลักสูตรคณิตศาสตร์ระดับมัธยมศึกษาปีที่ 4",
  "type": "hybrid",
  "price": 5000.00,
  "duration_hours": 40,
  "level": "intermediate"
}
```

---

### PUT /api/courses/:id
**Description**: Update course

**Access**: Admin, Owner only

---

### DELETE /api/courses/:id
**Description**: Archive course (soft delete)

**Access**: Admin, Owner only

---

### GET /api/courses/:id/schedules
**Description**: Get course schedules

**Query Params**:
- `branch_id`: filter by branch
- `start_date`: filter from date
- `end_date`: filter to date

---

### POST /api/courses/:id/schedules
**Description**: Create course schedule

**Access**: Admin, Owner only

**Request Body**:
```json
{
  "branch_id": 1,
  "tutor_id": 5,
  "start_datetime": "2024-02-01T10:00:00Z",
  "end_datetime": "2024-02-01T12:00:00Z",
  "session_type": "live",
  "meeting_link": "https://zoom.us/j/..."
}
```

---

### GET /api/courses/:id/branches
**Description**: Get branches offering this course

---

## 5. Enrollment Module

### GET /api/enrollments
**Description**: List enrollments

**Access**:
- Student: own enrollments
- Admin: branch enrollments
- Owner: all enrollments

**Query Params**:
- `student_id`: filter by student
- `course_id`: filter by course
- `branch_id`: filter by branch
- `status`: pending|active|completed|cancelled

---

### GET /api/enrollments/:id
**Description**: Get enrollment details

**Response**: `{ enrollment, student, course, branch, payment, learning_rights }`

---

### POST /api/enrollments
**Description**: Create enrollment

**Access**: Student (own), Admin

**Request Body**:
```json
{
  "course_id": 5,
  "branch_id": 1,
  "promotion_code": "SUMMER2024" // optional
}
```

**Business Logic**:
1. Check seat availability
2. Validate promotion (if provided)
3. Calculate final price
4. Create enrollment (status: pending)
5. Create payment record
6. Return enrollment + payment

---

### PUT /api/enrollments/:id/status
**Description**: Update enrollment status

**Access**: Admin, Owner only

**Request Body**:
```json
{
  "status": "active"
}
```

**Business Logic**:
- If status → "active": Create learning_rights
- If status → "cancelled": Refund payment (if applicable)

---

### GET /api/enrollments/:id/learning-rights
**Description**: Get learning rights for enrollment

---

## 6. Payment Module

### GET /api/payments
**Description**: List payments

**Access**:
- Student: own payments
- Admin: branch payments
- Owner: all payments

**Query Params**:
- `user_id`: filter by user
- `status`: pending|paid|failed|refunded
- `start_date`, `end_date`

---

### GET /api/payments/:id
**Description**: Get payment details

**Response**: `{ payment, items: [], enrollment }`

---

### POST /api/payments
**Description**: Create payment (usually created with enrollment)

**Request Body**:
```json
{
  "enrollment_id": 10,
  "payment_method": "credit_card",
  "promotion_code": "SUMMER2024" // optional
}
```

---

### POST /api/payments/:id/verify
**Description**: Verify payment (webhook from payment gateway)

**Access**: Payment Gateway only (HMAC verification)

**Request Body**:
```json
{
  "transaction_id": "txn_123456",
  "status": "paid",
  "amount": 4500.00,
  "signature": "hmac_signature"
}
```

**Business Logic**:
1. Verify HMAC signature
2. Update payment status
3. If paid: Activate enrollment + learning rights
4. Send notification

---

### GET /api/payments/:id/invoice
**Description**: Get invoice PDF/download

**Response**: PDF file or invoice data

---

## 7. Promotion Module

### GET /api/promotions
**Description**: List active promotions

**Query Params**:
- `branch_id`: filter by branch
- `course_id`: filter by course
- `code`: filter by code

**Response**: `{ promotions: [] }`

---

### GET /api/promotions/:id
**Description**: Get promotion details

---

### POST /api/promotions
**Description**: Create promotion

**Access**: Admin, Owner only

**Request Body**:
```json
{
  "code": "SUMMER2024",
  "name": "Summer Promotion 2024",
  "description": "20% off all courses",
  "type": "percentage",
  "discount_value": 20.00,
  "start_date": "2024-06-01T00:00:00Z",
  "end_date": "2024-08-31T23:59:59Z",
  "usage_limit": 100,
  "is_stackable": false,
  "is_global": true,
  "course_ids": [1, 2, 3], // optional
  "branch_ids": [1, 2] // optional
}
```

---

### PUT /api/promotions/:id
**Description**: Update promotion

**Access**: Admin, Owner only

---

### POST /api/promotions/validate
**Description**: Validate promotion code

**Request Body**:
```json
{
  "code": "SUMMER2024",
  "course_id": 5,
  "branch_id": 1,
  "user_id": 123
}
```

**Response**:
```json
{
  "valid": true,
  "discount_amount": 1000.00,
  "final_amount": 4000.00
}
```

**Validation Rules**:
- Check expiration
- Check usage limit
- Check scope (global/branch/course)
- Check stackability
- Check user eligibility

---

## 8. Learning Module

### GET /api/learning/my-courses
**Description**: Get student's enrolled courses

**Access**: Student only

**Response**: `{ enrollments: [] }`

---

### GET /api/learning/courses/:id/sessions
**Description**: Get course sessions

**Access**: Student (enrolled), Tutor (assigned), Admin

**Query Params**:
- `type`: live|vod

---

### GET /api/learning/sessions/:id
**Description**: Get session details

**Response**: `{ session, course, schedule, materials: [] }`

---

### POST /api/learning/sessions/:id/access
**Description**: Request access to session (validate rights)

**Access**: Student (enrolled)

**Response**:
```json
{
  "authorized": true,
  "access_token": "temporary_token",
  "meeting_link": "https://...",
  "video_url": "https://..."
}
```

**Validation**:
- Check enrollment status
- Check learning rights
- Check expiration
- Check session type (live/vod)

---

### POST /api/learning/progress
**Description**: Update learning progress

**Access**: Student (own progress)

**Request Body**:
```json
{
  "enrollment_id": 10,
  "session_id": 25,
  "progress_percentage": 75.5
}
```

---

### GET /api/learning/progress/:enrollment_id
**Description**: Get learning progress

**Response**: `{ progress: [], overall_percentage: number }`

---

## 9. Notification Module (SSE)

### GET /api/sse/notifications
**Description**: Server-Sent Events stream for real-time notifications

**Headers**: `Authorization: Bearer {accessToken}`

**Response**: SSE stream

**Event Format**:
```
event: notification
data: {"id": 1, "type": "course_reminder", "title": "...", "message": "..."}

event: heartbeat
data: {"timestamp": "2024-01-01T00:00:00Z"}
```

**Implementation**:
- Connection timeout: 30 seconds
- Heartbeat every 10 seconds
- Auto-reconnect on client side
- Filter by user role and branch

---

### GET /api/notifications
**Description**: Get notification history

**Query Params**:
- `type`: filter by type
- `is_read`: true|false
- `page`, `limit`

**Response**: `{ notifications: [], total: number }`

---

### PUT /api/notifications/:id/read
**Description**: Mark notification as read

---

### PUT /api/notifications/read-all
**Description**: Mark all notifications as read

---

## 10. Admin Dashboard Module

### GET /api/admin/stats
**Description**: Get dashboard statistics

**Access**: Admin, Owner

**Query Params**: `branch_id` (optional, for branch admin)

**Response**:
```json
{
  "total_students": 150,
  "total_tutors": 20,
  "total_courses": 30,
  "active_enrollments": 200,
  "pending_payments": 15,
  "revenue_this_month": 500000.00
}
```

---

### GET /api/admin/revenue
**Description**: Get revenue analytics

**Query Params**:
- `branch_id`: filter by branch
- `start_date`, `end_date`
- `group_by`: day|week|month

**Response**: `{ revenue: [], total: number }`

---

### GET /api/admin/users
**Description**: Get user management data

**Access**: System Admin, Owner

**Query Params**:
- `role`: filter by role
- `status`: active|inactive|suspended
- `branch_id`: filter by branch

---

### GET /api/admin/tutor-performance
**Description**: Get tutor performance metrics

**Query Params**: `branch_id`, `tutor_id`

**Response**:
```json
{
  "tutors": [
    {
      "tutor_id": 1,
      "name": "John Doe",
      "total_students": 50,
      "average_rating": 4.5,
      "completion_rate": 85.5
    }
  ]
}
```

---

## Middleware Chain

```
Request
  ↓
CORS Middleware
  ↓
Body Parser
  ↓
Auth Middleware (if required)
  ↓
Role Middleware (if required)
  ↓
Validation Middleware
  ↓
Rate Limiting (if required)
  ↓
Route Handler
  ↓
Error Handler
  ↓
Response
```

---

## Error Codes

```typescript
enum ErrorCode {
  // Authentication
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  AUTH_INVALID = 'AUTH_INVALID',
  AUTH_EXPIRED = 'AUTH_EXPIRED',
  AUTH_INSUFFICIENT_PERMISSIONS = 'AUTH_INSUFFICIENT_PERMISSIONS',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Resources
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  
  // Business Logic
  SEAT_LIMIT_EXCEEDED = 'SEAT_LIMIT_EXCEEDED',
  PROMOTION_INVALID = 'PROMOTION_INVALID',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  ENROLLMENT_INVALID = 'ENROLLMENT_INVALID',
  
  // Server
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR'
}
```

---

## Rate Limiting

```typescript
// Per endpoint
{
  '/api/auth/login': '5 requests per 15 minutes',
  '/api/auth/register': '3 requests per hour',
  '/api/payments': '10 requests per minute',
  '/api/*': '100 requests per minute'
}
```

---

## Security Considerations

1. **JWT Tokens**: Short-lived access tokens, long-lived refresh tokens
2. **Password Hashing**: bcrypt with salt rounds 12
3. **SQL Injection**: Parameterized queries only
4. **XSS**: Input sanitization, output encoding
5. **CSRF**: Token-based protection
6. **Rate Limiting**: Per IP and per user
7. **HTTPS**: Required in production
8. **Webhook Security**: HMAC signature verification

---

*This API design follows RESTful principles with clear separation of concerns*

