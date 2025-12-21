-- ============================================
-- ADD ADMIN ROLE (Admin กลาง)
-- ============================================

-- Insert the new 'admin' role into the roles table
-- This role is between 'owner' and 'branch_admin' in priority
INSERT INTO roles (name, description, created_at)
VALUES (
  'admin',
  'Admin กลาง - สามารถจัดการได้ทั้ง 2 สาขา',
  NOW()
)
ON DUPLICATE KEY UPDATE
  description = 'Admin กลาง - สามารถจัดการได้ทั้ง 2 สาขา';

