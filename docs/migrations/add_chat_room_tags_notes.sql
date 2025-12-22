-- ============================================
-- CHAT ROOM TAGS AND NOTES TABLES
-- ============================================

-- Table: chat_room_tags (แท็กสำหรับห้องแชท)
CREATE TABLE IF NOT EXISTS chat_room_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT NOT NULL,
    tag_name VARCHAR(100) NOT NULL,
    color VARCHAR(20) DEFAULT '#3B82F6', -- สีของ tag (default: blue)
    created_by INT NOT NULL, -- ใครสร้าง tag นี้
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_room (room_id),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: chat_room_notes (โน้ตสำหรับห้องแชท)
CREATE TABLE IF NOT EXISTS chat_room_notes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT NOT NULL,
    content TEXT NOT NULL,
    created_by INT NOT NULL, -- ใครสร้าง note นี้
    updated_by INT NULL, -- ใครแก้ไข note นี้ล่าสุด
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_room (room_id),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

