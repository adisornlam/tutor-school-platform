-- ============================================
-- Migration: Add Course Images Support
-- Date: 2024-12-20
-- Description: เพิ่มการรองรับภาพปกและ gallery สำหรับคอร์ส
-- ============================================

-- 1. Add thumbnail_url to courses table
ALTER TABLE courses
  ADD COLUMN thumbnail_url VARCHAR(500) NULL AFTER description;

-- 2. Create course_images table for gallery
CREATE TABLE IF NOT EXISTS course_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('thumbnail', 'cover', 'gallery') DEFAULT 'gallery',
    display_order INT DEFAULT 0,
    alt_text VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course_type (course_id, image_type),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

