-- ============================================
-- ADD REPLY AND PIN FEATURES TO CHAT MESSAGES
-- ============================================

-- Add reply_to_id column to chat_messages (if not exists)
SET @dbname = DATABASE();
SET @tablename = 'chat_messages';
SET @columnname = 'reply_to_id';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT NULL AFTER file_type')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add is_pinned column to chat_messages (if not exists)
SET @columnname = 'is_pinned';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' BOOLEAN DEFAULT FALSE AFTER reply_to_id')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add foreign key (if not exists)
SET @fkname = 'chat_messages_ibfk_reply';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (CONSTRAINT_NAME = @fkname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD CONSTRAINT ', @fkname, ' FOREIGN KEY (reply_to_id) REFERENCES chat_messages(id) ON DELETE SET NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add indexes (if not exists)
CREATE INDEX IF NOT EXISTS idx_reply_to ON chat_messages(reply_to_id);
CREATE INDEX IF NOT EXISTS idx_is_pinned ON chat_messages(is_pinned);

