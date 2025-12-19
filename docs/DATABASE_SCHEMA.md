# Database Schema Design

## Entity Relationship Diagram (Text Format)

```
┌─────────────┐
│    users    │
│─────────────│
│ id (PK)     │
│ email       │◄─────┐
│ password    │      │
│ first_name  │      │
│ last_name   │      │
│ status      │      │
└─────────────┘      │
      │              │
      │ 1            │
      │              │
      │ N            │
┌─────▼──────────────┴─────┐
│      user_roles           │
│──────────────────────────│
│ id (PK)                   │
│ user_id (FK)              │
│ role_id (FK)              │
└─────┬─────────────────────┘
      │
      │ N
      │
┌─────▼─────┐
│   roles   │
│───────────│
│ id (PK)   │
│ name      │
└───────────┘

┌─────────────┐
│  branches   │
│─────────────│
│ id (PK)     │
│ name        │◄─────┐
│ code        │      │
│ status      │      │
└─────────────┘      │
      │              │
      │ 1            │
      │              │
      │ N            │
┌─────▼──────────────┴─────┐
│    branch_admins          │
│──────────────────────────│
│ id (PK)                   │
│ branch_id (FK)            │
│ user_id (FK)              │
└───────────────────────────┘

┌─────────────┐
│   tutors    │
│─────────────│
│ id (PK)     │
│ user_id (FK)│◄───┐
│ bio         │    │
│ expertise   │    │
└─────────────┘    │
      │            │
      │ 1          │
      │            │
      │ N          │
┌─────▼────────────┴──────────────┐
│      tutor_branches             │
│─────────────────────────────────│
│ id (PK)                         │
│ tutor_id (FK)                   │
│ branch_id (FK)                  │
└─────────────────────────────────┘

┌─────────────┐
│   courses   │
│─────────────│
│ id (PK)     │◄─────┐
│ title       │      │
│ type        │      │
│ price       │      │
│ status      │      │
└─────────────┘      │
      │              │
      │ 1            │
      │              │
      │ N            │
┌─────▼──────────────┴──────────────┐
│      course_branches               │
│───────────────────────────────────│
│ id (PK)                           │
│ course_id (FK)                    │
│ branch_id (FK)                    │
│ seat_limit                        │
└───────────────────────────────────┘

┌─────────────┐
│   courses   │
│─────────────│
│ id (PK)     │◄─────┐
└─────────────┘      │
      │              │
      │ 1            │
      │              │
      │ N            │
┌─────▼──────────────┴──────────────┐
│      course_schedules              │
│───────────────────────────────────│
│ id (PK)                           │
│ course_id (FK)                    │
│ branch_id (FK)                    │
│ tutor_id (FK)                     │
│ start_datetime                    │
│ end_datetime                      │
│ session_type                      │
└───────────────────────────────────┘

┌─────────────┐
│ promotions  │
│─────────────│
│ id (PK)     │◄─────┐
│ code        │      │
│ type        │      │
│ discount    │      │
│ start_date  │      │
│ end_date    │      │
└─────────────┘      │
      │              │
      │ 1            │
      │              │
      │ N            │
┌─────▼──────────────┴──────────────┐
│    promotion_courses               │
│───────────────────────────────────│
│ id (PK)                           │
│ promotion_id (FK)                 │
│ course_id (FK)                    │
└───────────────────────────────────┘

┌─────────────┐
│ enrollments │
│─────────────│
│ id (PK)     │◄─────┐
│ student_id  │      │
│ course_id   │      │
│ branch_id   │      │
│ status      │      │
└─────────────┘      │
      │              │
      │ 1            │
      │              │
      │ N            │
┌─────▼──────────────┴──────────────┐
│    learning_rights                │
│───────────────────────────────────│
│ id (PK)                           │
│ enrollment_id (FK)                │
│ access_type                       │
│ expires_at                        │
└───────────────────────────────────┘

┌─────────────┐
│  payments   │
│─────────────│
│ id (PK)     │
│ user_id     │
│ amount      │
│ status      │
└─────────────┘
      │
      │ 1
      │
      │ N
┌─────▼──────────────┐
│  payment_items     │
│────────────────────│
│ id (PK)            │
│ payment_id (FK)    │
│ item_type         │
│ item_id           │
│ total_price       │
└────────────────────┘

┌─────────────┐
│enrollments  │
│─────────────│
│ id (PK)     │◄─────┐
└─────────────┘      │
      │              │
      │ 1            │
      │              │
      │ N            │
┌─────▼──────────────┴──────────────┐
│    learning_progress               │
│───────────────────────────────────│
│ id (PK)                           │
│ enrollment_id (FK)                │
│ session_id (FK)                   │
│ progress_percentage               │
└───────────────────────────────────┘

┌─────────────┐
│notifications│
│─────────────│
│ id (PK)     │
│ user_id     │
│ type        │
│ title       │
│ message     │
│ is_read     │
└─────────────┘
```

## Complete SQL Schema

```sql
-- ============================================
-- 1. USER & AUTHENTICATION MODULE
-- ============================================

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    email_verified_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_role (user_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE refresh_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_expires (user_id, expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. BRANCH MANAGEMENT MODULE
-- ============================================

CREATE TABLE branches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE branch_admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    branch_id INT NOT NULL,
    user_id INT NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_branch_admin (branch_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. TUTOR MANAGEMENT MODULE
-- ============================================

CREATE TABLE tutors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    bio TEXT,
    expertise JSON,
    hourly_rate DECIMAL(10, 2),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tutor_branches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tutor_id INT NOT NULL,
    branch_id INT NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tutor_branch (tutor_id, branch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tutor_courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tutor_id INT NOT NULL,
    course_id INT NOT NULL,
    branch_id INT NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tutor_course_branch (tutor_id, course_id, branch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. COURSE & CURRICULUM MODULE
-- ============================================

CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    type ENUM('live_online', 'vod', 'hybrid') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration_hours INT,
    level ENUM('beginner', 'intermediate', 'advanced'),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE course_branches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    branch_id INT NOT NULL,
    seat_limit INT,
    current_enrollments INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    UNIQUE KEY unique_course_branch (course_id, branch_id),
    INDEX idx_availability (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE course_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    branch_id INT NOT NULL,
    tutor_id INT NOT NULL,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME NOT NULL,
    session_type ENUM('live', 'vod') NOT NULL,
    meeting_link VARCHAR(500),
    video_url VARCHAR(500),
    status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled',
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE,
    INDEX idx_datetime (start_datetime),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. PROMOTION & PRICING MODULE
-- ============================================

CREATE TABLE promotions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type ENUM('percentage', 'fixed_price') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    usage_limit INT,
    used_count INT DEFAULT 0,
    is_stackable BOOLEAN DEFAULT FALSE,
    is_global BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE promotion_courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    promotion_id INT NOT NULL,
    course_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_promotion_course (promotion_id, course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE promotion_branches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    promotion_id INT NOT NULL,
    branch_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    UNIQUE KEY unique_promotion_branch (promotion_id, branch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE promotion_usage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    promotion_id INT NOT NULL,
    user_id INT NOT NULL,
    enrollment_id INT,
    payment_id INT NOT NULL,
    discount_amount DECIMAL(10, 2) NOT NULL,
    used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE SET NULL,
    FOREIGN KEY (payment_id) REFERENCES payments(id),
    INDEX idx_user (user_id),
    INDEX idx_promotion (promotion_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. ENROLLMENT & LEARNING RIGHTS MODULE
-- ============================================

CREATE TABLE enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    branch_id INT NOT NULL,
    enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'active', 'completed', 'cancelled') DEFAULT 'pending',
    payment_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
    INDEX idx_student (student_id),
    INDEX idx_course (course_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE learning_rights (
    id INT PRIMARY KEY AUTO_INCREMENT,
    enrollment_id INT NOT NULL,
    access_type ENUM('live', 'vod', 'both') NOT NULL,
    expires_at DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    INDEX idx_enrollment (enrollment_id),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. PAYMENT MODULE
-- ============================================

CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    enrollment_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'THB',
    status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255) UNIQUE,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_transaction (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payment_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    payment_id INT NOT NULL,
    item_type ENUM('course', 'enrollment') NOT NULL,
    item_id INT NOT NULL,
    description VARCHAR(500),
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. LEARNING MODULE
-- ============================================

CREATE TABLE course_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    schedule_id INT,
    title VARCHAR(300),
    session_number INT,
    content_type ENUM('live', 'vod') NOT NULL,
    video_url VARCHAR(500),
    meeting_link VARCHAR(500),
    materials JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES course_schedules(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE learning_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    enrollment_id INT NOT NULL,
    session_id INT,
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    last_accessed_at DATETIME,
    completed_at DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES course_sessions(id) ON DELETE SET NULL,
    INDEX idx_enrollment (enrollment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. NOTIFICATION MODULE
-- ============================================

CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    role_id INT,
    branch_id INT,
    type ENUM('course_reminder', 'payment_success', 'promotion', 'admin_broadcast', 'enrollment_confirmed') NOT NULL,
    title VARCHAR(300) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_unread (user_id, is_read),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notification_reads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    notification_id INT NOT NULL,
    user_id INT NOT NULL,
    read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_notification_user (notification_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('student', 'Student role'),
('tutor', 'Tutor role'),
('branch_admin', 'Branch administrator role'),
('system_admin', 'System administrator role'),
('owner', 'Owner role');
```

-- ============================================
-- 10. PARENT SYSTEM MODULE
-- ============================================

CREATE TABLE parent_students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    parent_id INT NOT NULL,
    student_id INT NOT NULL,
    relationship ENUM('father', 'mother', 'guardian', 'other') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_parent_student (parent_id, student_id),
    INDEX idx_parent (parent_id),
    INDEX idx_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 11. QUIZ SYSTEM MODULE
-- ============================================

CREATE TABLE quizzes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    session_id INT,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    time_limit INT, -- minutes
    total_points INT DEFAULT 0,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES course_sessions(id) ON DELETE SET NULL,
    INDEX idx_course (course_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE quiz_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false', 'short_answer', 'essay') NOT NULL,
    options JSON, -- For multiple choice: ["option1", "option2", ...]
    correct_answer TEXT,
    points INT DEFAULT 1,
    order_number INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_quiz (quiz_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE quiz_attempts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT NOT NULL,
    student_id INT NOT NULL,
    score DECIMAL(10, 2) DEFAULT 0,
    total_points INT DEFAULT 0,
    percentage DECIMAL(5, 2) DEFAULT 0,
    answers JSON, -- Store student answers
    started_at DATETIME,
    completed_at DATETIME,
    time_taken INT, -- seconds
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_quiz (quiz_id),
    INDEX idx_student (student_id),
    INDEX idx_completed (completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 12. ASSIGNMENT SYSTEM MODULE
-- ============================================

CREATE TABLE assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    session_id INT,
    tutor_id INT NOT NULL,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    instructions TEXT,
    due_date DATETIME NOT NULL,
    max_points INT DEFAULT 100,
    allowed_file_types VARCHAR(200), -- e.g., "pdf,doc,docx"
    max_file_size INT, -- in MB
    status ENUM('draft', 'published', 'closed') DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES course_sessions(id) ON DELETE SET NULL,
    FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE,
    INDEX idx_course (course_id),
    INDEX idx_tutor (tutor_id),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE assignment_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    file_url VARCHAR(500),
    file_name VARCHAR(300),
    file_size INT,
    submission_text TEXT,
    score INT,
    feedback TEXT,
    submitted_at DATETIME,
    graded_at DATETIME,
    status ENUM('submitted', 'graded', 'returned') DEFAULT 'submitted',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_assignment (assignment_id),
    INDEX idx_student (student_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 13. ANNOUNCEMENT SYSTEM MODULE
-- ============================================

CREATE TABLE announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    branch_id INT,
    course_id INT,
    created_by INT NOT NULL,
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    target_audience ENUM('all', 'students', 'parents', 'tutors', 'admins') DEFAULT 'all',
    is_pinned BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at DATETIME,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_branch (branch_id),
    INDEX idx_course (course_id),
    INDEX idx_status (status),
    INDEX idx_published (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 14. MATERIAL DELIVERY SYSTEM MODULE
-- ============================================

CREATE TABLE materials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    session_id INT,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    file_url VARCHAR(500),
    file_name VARCHAR(300),
    file_size INT,
    delivery_method ENUM('digital', 'kerry_express', 'both') DEFAULT 'digital',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES course_sessions(id) ON DELETE SET NULL,
    INDEX idx_course (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE material_deliveries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    material_id INT NOT NULL,
    enrollment_id INT NOT NULL,
    delivery_method ENUM('digital', 'kerry_express') NOT NULL,
    tracking_number VARCHAR(100),
    status ENUM('pending', 'preparing', 'shipped', 'delivered', 'failed') DEFAULT 'pending',
    shipping_address TEXT,
    shipped_at DATETIME,
    delivered_at DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    INDEX idx_material (material_id),
    INDEX idx_enrollment (enrollment_id),
    INDEX idx_status (status),
    INDEX idx_tracking (tracking_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('student', 'Student role'),
('tutor', 'Tutor role'),
('branch_admin', 'Branch administrator role'),
('system_admin', 'System administrator role'),
('owner', 'Owner role'),
('parent', 'Parent role');

## Indexes Summary

```sql
-- Performance indexes (already included in table definitions above)
-- Key indexes for query optimization:

-- User lookups
idx_users_email, idx_users_status

-- Enrollment queries
idx_enrollments_student, idx_enrollments_course, idx_enrollments_status

-- Payment queries
idx_payments_user, idx_payments_status, idx_payments_transaction

-- Notification queries
idx_notifications_user, idx_notifications_unread, idx_notifications_type

-- Schedule queries
idx_course_schedules_datetime, idx_course_schedules_status

-- Promotion queries
idx_promotions_code, idx_promotions_dates, idx_promotions_status

-- Parent queries
idx_parent_students_parent, idx_parent_students_student

-- Quiz queries
idx_quizzes_course, idx_quiz_attempts_student

-- Assignment queries
idx_assignments_course, idx_assignment_submissions_student

-- Material delivery queries
idx_material_deliveries_enrollment, idx_material_deliveries_tracking
```

## Notes

1. **Foreign Keys**: All foreign keys use `ON DELETE CASCADE` or `ON DELETE SET NULL` appropriately
2. **Soft Deletes**: Using `status` fields instead of hard deletes for audit trail
3. **Timestamps**: All tables use `created_at` and `updated_at` for tracking
4. **Indexes**: Strategic indexes on foreign keys and frequently queried fields
5. **Character Set**: UTF8MB4 for full Unicode support (including emojis)
6. **Transactions**: Use transactions for payment and enrollment operations

