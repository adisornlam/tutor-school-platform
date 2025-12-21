-- ============================================
-- CONTENT MANAGEMENT TABLES
-- ============================================

-- Articles Table (บทความ/เทคนิคดีๆ)
CREATE TABLE IF NOT EXISTS articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category VARCHAR(100),
    icon VARCHAR(50),
    featured_image_url VARCHAR(500),
    author_id INT,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    display_order INT DEFAULT 0,
    published_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_featured (is_featured),
    INDEX idx_display_order (display_order),
    UNIQUE KEY unique_slug (slug(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Testimonials Table (รีวิวจากผู้ปกครอง/นักเรียน)
CREATE TABLE IF NOT EXISTS testimonials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    comment TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    avatar_url VARCHAR(500),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_rating (rating),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

