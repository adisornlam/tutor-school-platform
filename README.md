# Tutor School Platform - โรงเรียนกวดวิชา KDC

แพลตฟอร์มการศึกษาแบบ Full-stack สำหรับโรงเรียนกวดวิชาหลายสาขา โดยใช้ Nuxt.js 4

## 🚀 Quick Start

### Prerequisites
- Bun 1.3.1+
- MySQL 8+ (XAMPP)
- Node.js 20+ (for some tools)

### Installation

```bash
# Install dependencies
bun install

# Copy environment file
cp .env.example .env

# Edit .env with your database configuration
# DB_HOST=localhost
# DB_PORT=3307
# DB_NAME=tutordb
# DB_USER=root
# DB_PASSWORD=
```

### Database Setup

```bash
# Create database
mysql -u root -P 3307 -e "CREATE DATABASE IF NOT EXISTS tutordb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run migration (when migration script is ready)
bun run db:migrate
```

### Development

```bash
# Start development server
bun run dev

# Server will run on http://localhost:3000
```

## 📁 Project Structure

```
Tutor-School-Platform/
├── app/              # Frontend application
├── server/           # Backend API
├── shared/           # Shared code
├── locales/          # i18n translations
├── docs/             # Documentation
└── scripts/          # Utility scripts
```

## 🛠️ Tech Stack

- **Framework**: Nuxt 4
- **Package Manager**: Bun
- **Database**: MySQL 8
- **Styling**: Tailwind CSS
- **i18n**: @nuxtjs/i18n (TH/EN)
- **State**: Pinia
- **Timezone**: Asia/Bangkok

## 📚 Documentation

ดูเอกสารทั้งหมดใน [docs/](./docs/) directory

- [Course Thumbnail Specifications](./docs/COURSE_THUMBNAIL_SPECS.md) - ขนาดและรูปแบบรูปปกคอร์ส

## 🌐 Languages

- **Default**: ไทย (TH)
- **Supported**: English (EN)

## 💳 Payment Methods

- **Bank Transfer** (โอนเงิน) - Default
- **Online Payment** (ชำระออนไลน์)

## 📝 License

Private - KDC Tutor School

