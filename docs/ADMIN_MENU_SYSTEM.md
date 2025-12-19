# 📋 Admin Menu System Documentation

**วันที่สร้าง**: 2025-01-19

---

## 🎯 วัตถุประสงค์

สร้างระบบเมนู Admin ที่:
1. **เก็บข้อมูลใน Database** - ไม่ต้อง restart server เมื่อแก้ไขเมนู
2. **รองรับ 2 ชั้น** - Parent menu และ Submenu
3. **ยุบ/ขยายได้** - Collapsible menu groups
4. **Role-based** - แสดงเมนูตามสิทธิ์ของผู้ใช้

---

## 🗄️ Database Schema

### Table: `admin_menus`

```sql
CREATE TABLE admin_menus (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  name_en VARCHAR(200),
  icon VARCHAR(100),
  href VARCHAR(500),
  parent_code VARCHAR(100),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  roles TEXT, -- JSON array of allowed roles
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_parent (parent_code),
  INDEX idx_display_order (display_order),
  INDEX idx_active (is_active)
)
```

**Fields:**
- `code`: Unique identifier (e.g., 'DASHBOARD', 'USERS')
- `name`: Display name (Thai)
- `name_en`: Display name (English)
- `icon`: Icon name from Heroicons (e.g., 'HomeIcon', 'UsersIcon')
- `href`: URL path (e.g., '/admin', '/admin/users')
- `parent_code`: Reference to parent menu (NULL for root menus)
- `display_order`: Order for sorting
- `is_active`: Enable/disable menu
- `roles`: JSON array of allowed roles (e.g., '["system_admin", "owner"]')

---

## 📊 Menu Structure

### Level 1: Root Menus
1. **Dashboard** (`/admin`)
2. **จัดการผู้ใช้งาน** (Parent - มี submenu)
3. **สาขา** (`/admin/branches`)
4. **คอร์สเรียน** (`/admin/courses`)
5. **การลงทะเบียน** (`/admin/enrollments`)
6. **การชำระเงิน** (`/admin/payments`)
7. **โปรโมชั่น** (`/admin/promotions`)
8. **รายงาน** (Parent - มี submenu)
9. **ตั้งค่า** (Parent - มี submenu)

### Level 2: Submenus

#### จัดการผู้ใช้งาน
- ทั้งหมด (`/admin/users`)
- อาจารย์ (`/admin/users?role=tutor`)
- นักเรียน (`/admin/users?role=student`)
- ผู้ปกครอง (`/admin/users?role=parent`)
- Admin สาขา (`/admin/users?role=branch_admin`)

#### รายงาน
- รายงานผู้ใช้งาน (`/admin/reports/users`)
- รายงานคอร์สเรียน (`/admin/reports/courses`)
- รายงานการลงทะเบียน (`/admin/reports/enrollments`)
- รายงานการชำระเงิน (`/admin/reports/payments`)
- รายงานรายได้ (`/admin/reports/revenue`)

#### ตั้งค่า
- ตั้งค่าอีเมล์ (`/admin/settings/email`)
- ตั้งค่าระบบ (`/admin/settings/system`)
- จัดการข้อมูลหลัก (`/admin/settings/master-data`)

---

## 🔧 API Endpoints

### GET `/api/admin/menus`

**Description**: Get admin menus for current user

**Authentication**: Required (Bearer token)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "DASHBOARD",
      "name": "Dashboard",
      "name_en": "Dashboard",
      "icon": "HomeIcon",
      "href": "/admin",
      "parent_code": null,
      "display_order": 1,
      "is_active": true,
      "roles": ["system_admin", "owner", "branch_admin"],
      "children": []
    },
    {
      "id": 2,
      "code": "USERS",
      "name": "จัดการผู้ใช้งาน",
      "name_en": "User Management",
      "icon": "UsersIcon",
      "href": null,
      "parent_code": null,
      "display_order": 2,
      "is_active": true,
      "roles": ["system_admin", "owner"],
      "children": [
        {
          "id": 3,
          "code": "USERS_ALL",
          "name": "ทั้งหมด",
          "name_en": "All Users",
          "icon": "UserGroupIcon",
          "href": "/admin/users",
          "parent_code": "USERS",
          "display_order": 1,
          "is_active": true,
          "roles": ["system_admin", "owner"],
          "children": []
        }
      ]
    }
  ]
}
```

**Filtering**: Menus are automatically filtered by user roles

---

## 🎨 UI Components

### MenuIcon Component

**Location**: `app/components/MenuIcon.vue`

**Purpose**: Map icon names from database to Heroicons components

**Usage**:
```vue
<MenuIcon icon="HomeIcon" class="w-5 h-5" />
```

**Supported Icons**:
- `HomeIcon`
- `UsersIcon`
- `UserGroupIcon`
- `UserIcon`
- `UserCircleIcon`
- `ShieldCheckIcon`
- `BuildingOfficeIcon` / `BuildingIcon`
- `BookOpenIcon` / `BookIcon`
- `ClipboardDocumentCheckIcon` / `ClipboardIcon`
- `CurrencyDollarIcon` / `CurrencyIcon`
- `TagIcon`
- `ChartBarIcon` / `ChartIcon`
- `CogIcon`
- `EnvelopeIcon`
- `Cog6ToothIcon`
- `AcademicCapIcon`

---

## 🚀 Setup & Migration

### 1. Run Migration

```bash
bun run db:migrate-menus
```

This will:
- Create `admin_menus` table
- Insert all menu items
- Set up parent-child relationships

### 2. Verify

```sql
SELECT * FROM admin_menus WHERE is_active = TRUE ORDER BY display_order;
```

---

## 📝 การจัดการเมนู

### เพิ่มเมนูใหม่

```sql
INSERT INTO admin_menus (code, name, name_en, icon, href, display_order, is_active, roles)
VALUES ('NEW_MENU', 'เมนูใหม่', 'New Menu', 'TagIcon', '/admin/new-menu', 10, TRUE, '["system_admin"]');
```

### เพิ่ม Submenu

```sql
INSERT INTO admin_menus (code, name, name_en, icon, href, parent_code, display_order, is_active, roles)
VALUES ('PARENT_SUBMENU', 'Submenu', 'Submenu', 'TagIcon', '/admin/parent/submenu', 'PARENT_CODE', 1, TRUE, '["system_admin"]');
```

### แก้ไขเมนู

```sql
UPDATE admin_menus
SET name = 'ชื่อใหม่', href = '/admin/new-path', display_order = 5
WHERE code = 'MENU_CODE';
```

### ปิด/เปิดเมนู

```sql
UPDATE admin_menus SET is_active = FALSE WHERE code = 'MENU_CODE';
UPDATE admin_menus SET is_active = TRUE WHERE code = 'MENU_CODE';
```

### ลบเมนู

```sql
DELETE FROM admin_menus WHERE code = 'MENU_CODE';
-- Note: Child menus will be deleted automatically (CASCADE)
```

---

## 🎯 Features

### ✅ Implemented
- [x] Database storage
- [x] 2-level menu hierarchy
- [x] Collapsible submenus
- [x] Role-based filtering
- [x] Auto-expand active menu
- [x] Icon mapping
- [x] Loading state
- [x] Error handling

### 🔄 Future Enhancements
- [ ] Menu permissions (granular control)
- [ ] Menu badges (notification counts)
- [ ] Menu search
- [ ] Menu favorites
- [ ] Menu customization per user
- [ ] Menu analytics

---

## 🐛 Troubleshooting

### เมนูไม่แสดง
1. ตรวจสอบว่า `is_active = TRUE`
2. ตรวจสอบว่า user มี role ที่ถูกต้อง
3. ตรวจสอบว่า API `/api/admin/menus` ทำงานได้
4. ตรวจสอบ console logs

### Icon ไม่แสดง
1. ตรวจสอบว่า icon name ถูกต้อง (case-sensitive)
2. ตรวจสอบว่า icon อยู่ใน `MenuIcon.vue` mapping
3. ตรวจสอบว่า `@heroicons/vue` ติดตั้งแล้ว

### Submenu ไม่ยุบ/ขยาย
1. ตรวจสอบว่า `expandedMenus` state ทำงานถูกต้อง
2. ตรวจสอบว่า `toggleMenu` function ถูกเรียก
3. ตรวจสอบ console logs

---

*Admin Menu System Documentation - Last Updated: 2025-01-19*

