-- MySQL dump 10.13  Distrib 9.5.0, for macos26.0 (arm64)
--
-- Host: localhost    Database: tutordb
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '11a2c40e-a52d-11f0-82fb-1566c197afa9:1-635';

--
-- Table structure for table `admin_menus`
--

DROP TABLE IF EXISTS `admin_menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_menus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_en` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `href` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `roles` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_parent` (`parent_code`),
  KEY `idx_display_order` (`display_order`),
  KEY `idx_active` (`is_active`),
  CONSTRAINT `fk_admin_menus_parent` FOREIGN KEY (`parent_code`) REFERENCES `admin_menus` (`code`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=479 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_menus`
--

LOCK TABLES `admin_menus` WRITE;
/*!40000 ALTER TABLE `admin_menus` DISABLE KEYS */;
INSERT INTO `admin_menus` VALUES (1,'DASHBOARD','Dashboard','Dashboard','HomeIcon','/admin',NULL,1,1,'[\"system_admin\",\"owner\",\"admin\",\"branch_admin\",\"tutor\"]','2025-12-19 15:23:47','2025-12-21 23:18:27'),(2,'USERS','จัดการผู้ใช้งาน','User Management','UsersIcon',NULL,NULL,2,0,'[\"system_admin\",\"owner\",\"admin\"]','2025-12-19 15:23:47','2025-12-21 08:46:46'),(3,'BRANCHES','สาขา','Branches','BuildingOfficeIcon','/admin/branches',NULL,3,0,'[\"system_admin\",\"owner\",\"admin\"]','2025-12-19 15:23:47','2025-12-21 08:46:46'),(4,'COURSES','คอร์สเรียน','Courses','BookOpenIcon','/admin/courses',NULL,3,1,'[\"system_admin\",\"owner\",\"admin\",\"branch_admin\"]','2025-12-19 15:23:47','2025-12-21 23:18:27'),(5,'ENROLLMENTS','การลงทะเบียน','Enrollments','ClipboardDocumentCheckIcon','/admin/enrollments',NULL,4,1,'[\"system_admin\",\"owner\",\"admin\",\"branch_admin\"]','2025-12-19 15:23:47','2025-12-21 23:18:27'),(6,'PAYMENTS','การชำระเงิน','Payments','CurrencyDollarIcon','/admin/payments',NULL,7,1,'[\"system_admin\",\"owner\",\"admin\",\"branch_admin\"]','2025-12-19 15:23:47','2025-12-22 00:29:00'),(7,'PROMOTIONS','โปรโมชั่น','Promotions','TagIcon','/admin/promotions',NULL,8,1,'[\"system_admin\",\"owner\",\"admin\",\"branch_admin\"]','2025-12-19 15:23:47','2025-12-22 00:29:00'),(8,'REPORTS','รายงาน','Reports','ChartBarIcon',NULL,NULL,9,1,'[\"system_admin\",\"owner\",\"admin\",\"branch_admin\"]','2025-12-19 15:23:47','2025-12-22 00:29:00'),(9,'SETTINGS','ตั้งค่า','Settings','CogIcon',NULL,NULL,10,1,'[\"system_admin\",\"owner\"]','2025-12-19 15:23:47','2025-12-22 00:29:00'),(10,'USERS_ALL','ทั้งหมด','All Users','UserGroupIcon','/admin/users','USERS',1,0,'[\"system_admin\",\"owner\",\"admin\"]','2025-12-19 15:23:47','2025-12-21 08:46:46'),(11,'USERS_TUTORS','อาจารย์','Tutors','AcademicCapIcon','/admin/users?role=tutor','USERS',2,0,'[\"system_admin\",\"owner\",\"admin\"]','2025-12-19 15:23:47','2025-12-21 08:46:46'),(12,'USERS_STUDENTS','นักเรียน','Students','UserIcon','/admin/users?role=student','USERS',3,0,'[\"system_admin\",\"owner\",\"admin\"]','2025-12-19 15:23:47','2025-12-21 08:46:46'),(13,'USERS_PARENTS','ผู้ปกครอง','Parents','UserCircleIcon','/admin/users?role=parent','USERS',4,0,'[\"system_admin\",\"owner\",\"admin\"]','2025-12-19 15:23:47','2025-12-21 08:46:46'),(14,'USERS_BRANCH_ADMINS','Admin สาขา','Branch Admins','ShieldCheckIcon','/admin/users?role=branch_admin','USERS',5,0,'[\"system_admin\",\"owner\",\"admin\"]','2025-12-19 15:23:47','2025-12-21 08:46:46'),(15,'REPORTS_USERS','รายงานผู้ใช้งาน','User Reports','UserGroupIcon','/admin/reports/users','REPORTS',1,1,'[\"system_admin\",\"owner\"]','2025-12-19 15:23:47','2025-12-21 23:18:27'),(16,'REPORTS_COURSES','รายงานคอร์สเรียน','Course Reports','BookOpenIcon','/admin/reports/courses','REPORTS',2,1,'[\"system_admin\",\"owner\",\"admin\",\"branch_admin\"]','2025-12-19 15:23:47','2025-12-21 23:18:27'),(17,'REPORTS_ENROLLMENTS','รายงานการลงทะเบียน','Enrollment Reports','ClipboardDocumentCheckIcon','/admin/reports/enrollments','REPORTS',3,1,'[\"system_admin\",\"owner\",\"admin\",\"branch_admin\"]','2025-12-19 15:23:47','2025-12-21 23:18:27'),(18,'REPORTS_PAYMENTS','รายงานการชำระเงิน','Payment Reports','CurrencyDollarIcon','/admin/reports/payments','REPORTS',4,1,'[\"system_admin\",\"owner\",\"admin\",\"branch_admin\"]','2025-12-19 15:23:47','2025-12-21 23:18:27'),(19,'REPORTS_REVENUE','รายงานรายได้','Revenue Reports','ChartBarIcon','/admin/reports/revenue','REPORTS',5,1,'[\"system_admin\",\"owner\",\"admin\",\"branch_admin\"]','2025-12-19 15:23:47','2025-12-21 23:18:27'),(20,'SETTINGS_EMAIL','ตั้งค่าอีเมล์','Email Settings','EnvelopeIcon','/admin/settings/email','SETTINGS',1,1,'[\"system_admin\",\"owner\"]','2025-12-19 15:23:47','2025-12-21 23:18:27'),(21,'SETTINGS_SYSTEM','ตั้งค่าระบบ','System Settings','Cog6ToothIcon','/admin/settings/system','SETTINGS',2,1,'[\"system_admin\",\"owner\"]','2025-12-19 15:23:47','2025-12-21 23:18:27'),(22,'SETTINGS_MASTER_DATA','จัดการข้อมูลหลัก','Master Data','DatabaseIcon','/admin/settings/master-data','SETTINGS',3,0,'[\"system_admin\",\"owner\",\"admin\"]','2025-12-19 15:23:47','2025-12-21 08:46:46'),(44,'SETTINGS_BRANCHES','สาขา','Branches','BuildingOfficeIcon','/admin/settings/branches','SETTINGS',3,1,'[\"system_admin\",\"owner\"]','2025-12-19 15:29:04','2025-12-21 23:18:27'),(87,'SETTINGS_GRADE_LEVELS','ระดับชั้น','Grade Levels','AcademicCapIcon','/admin/settings/grade-levels','SETTINGS',4,1,'[\"system_admin\",\"owner\"]','2025-12-19 15:40:34','2025-12-21 23:18:27'),(88,'SETTINGS_SUBJECTS','วิชา','Subjects','BookOpenIcon','/admin/settings/subjects','SETTINGS',5,1,'[\"system_admin\",\"owner\"]','2025-12-19 15:40:34','2025-12-21 23:18:27'),(89,'SETTINGS_INCLUSIONS','สิ่งที่ได้รับ','Inclusions','TagIcon','/admin/settings/inclusions','SETTINGS',6,1,'[\"system_admin\",\"owner\"]','2025-12-19 15:40:34','2025-12-21 23:18:27'),(90,'SETTINGS_ROLES','บทบาทผู้ใช้','User Roles','ShieldCheckIcon','/admin/settings/roles','SETTINGS',7,1,'[\"system_admin\",\"owner\"]','2025-12-19 15:40:34','2025-12-21 23:18:27'),(91,'SETTINGS_PAYMENT_METHODS','วิธีการชำระเงิน','Payment Methods','CurrencyDollarIcon','/admin/settings/payment-methods','SETTINGS',8,1,'[\"system_admin\",\"owner\"]','2025-12-19 15:40:34','2025-12-21 23:18:27'),(100,'TUTOR_SCHEDULE','ตารางสอน','Teaching Schedule','CalendarIcon','/admin/tutor/schedule',NULL,10,1,'[\"tutor\"]','2025-12-19 15:59:13','2025-12-19 15:59:13'),(101,'TUTOR_COURSES','คอร์สของฉัน','My Courses','BookOpenIcon','/admin/tutor/courses',NULL,11,1,'[\"tutor\"]','2025-12-19 15:59:13','2025-12-19 15:59:13'),(102,'TUTOR_STUDENTS','นักเรียน','Students','UserGroupIcon','/admin/tutor/students',NULL,12,1,'[\"tutor\"]','2025-12-19 15:59:13','2025-12-19 15:59:13'),(103,'TUTOR_ASSIGNMENTS','การบ้าน','Assignments','ClipboardDocumentCheckIcon','/admin/tutor/assignments',NULL,13,1,'[\"tutor\"]','2025-12-19 15:59:13','2025-12-19 15:59:13'),(104,'TUTOR_ANNOUNCEMENTS','ประกาศ','Announcements','MegaphoneIcon','/admin/tutor/announcements',NULL,14,1,'[\"tutor\"]','2025-12-19 15:59:13','2025-12-19 15:59:13'),(105,'TUTOR_REPORTS','รายงาน','Reports','ChartBarIcon',NULL,NULL,15,1,'[\"tutor\"]','2025-12-19 15:59:13','2025-12-19 15:59:13'),(124,'TUTOR_REPORTS_PROGRESS','รายงานความคืบหน้า','Progress Reports','ChartBarIcon','/admin/tutor/reports/progress','TUTOR_REPORTS',1,1,'[\"tutor\"]','2025-12-19 15:59:13','2025-12-19 15:59:13'),(125,'TUTOR_REPORTS_GRADES','รายงานคะแนน','Grade Reports','AcademicCapIcon','/admin/tutor/reports/grades','TUTOR_REPORTS',2,1,'[\"tutor\"]','2025-12-19 15:59:13','2025-12-19 15:59:13'),(126,'TUTOR_REPORTS_ASSIGNMENTS','รายงานการบ้าน','Assignment Reports','ClipboardDocumentCheckIcon','/admin/tutor/reports/assignments','TUTOR_REPORTS',3,1,'[\"tutor\"]','2025-12-19 15:59:13','2025-12-19 15:59:13'),(127,'TUTOR_REPORTS_STATISTICS','สถิติการสอน','Teaching Statistics','ChartBarIcon','/admin/tutor/reports/statistics','TUTOR_REPORTS',4,1,'[\"tutor\"]','2025-12-19 15:59:13','2025-12-19 15:59:13'),(129,'STUDENTS','ผู้เรียน','Students','UserIcon','/admin/students',NULL,2,1,'[\"system_admin\",\"owner\",\"admin\",\"branch_admin\"]','2025-12-19 16:24:55','2025-12-21 23:18:27'),(155,'SETTINGS_USERS','จัดการผู้ใช้งาน','User Management','UsersIcon','/admin/settings/users','SETTINGS',9,1,'[\"system_admin\",\"owner\"]','2025-12-19 16:24:55','2025-12-21 23:18:27'),(196,'CONTENT','จัดการเนื้อหา','Content Management','DocumentTextIcon',NULL,NULL,6,1,'[\"system_admin\",\"owner\",\"admin\"]','2025-12-21 23:15:18','2025-12-22 00:29:00'),(207,'CONTENT_ARTICLES','บทความ','Articles','NewspaperIcon','/admin/content/articles','CONTENT',1,1,'[\"system_admin\",\"owner\",\"admin\"]','2025-12-21 23:15:18','2025-12-21 23:15:18'),(208,'CONTENT_TESTIMONIALS','รีวิว','Testimonials','ChatBubbleLeftRightIcon','/admin/content/testimonials','CONTENT',2,1,'[\"system_admin\",\"owner\",\"admin\"]','2025-12-21 23:15:18','2025-12-21 23:15:18'),(266,'CHAT','แชท','Chat','ChatBubbleLeftRightIcon','/chat',NULL,5,1,'[\"system_admin\",\"owner\",\"admin\",\"tutor\"]','2025-12-22 00:29:00','2025-12-22 01:03:59');
/*!40000 ALTER TABLE `admin_menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `branch_id` int DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `created_by` int NOT NULL,
  `title` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` enum('low','normal','high','urgent') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'normal',
  `target_audience` enum('all','students','parents','tutors','admins') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'all',
  `is_pinned` tinyint(1) DEFAULT '0',
  `status` enum('draft','published','archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `published_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_branch` (`branch_id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_status` (`status`),
  KEY `idx_published` (`published_at`),
  CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `announcements_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `announcements_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `featured_image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author_id` int DEFAULT NULL,
  `status` enum('draft','published','archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `is_featured` tinyint(1) DEFAULT '0',
  `view_count` int DEFAULT '0',
  `display_order` int DEFAULT '0',
  `published_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_slug` (`slug`(191)),
  KEY `idx_status` (`status`),
  KEY `idx_category` (`category`),
  KEY `idx_featured` (`is_featured`),
  KEY `idx_display_order` (`display_order`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES (1,'10 เทคนิคเตรียมสอบให้ได้คะแนนดี','10-techniques-prepare-exam-good-score','เรียนรู้เทคนิคการเตรียมสอบที่มีประสิทธิภาพ จากประสบการณ์ของติวเตอร์มืออาชีพ เพื่อให้ได้คะแนนตามที่ตั้งเป้าหมายไว้','<h2>เทคนิคการเตรียมสอบให้ได้คะแนนดี</h2>\n<p>การเตรียมสอบอย่างมีประสิทธิภาพเป็นสิ่งสำคัญที่ช่วยให้นักเรียนสามารถทำคะแนนได้ตามที่ตั้งเป้าหมายไว้ วันนี้เรามีเทคนิคดีๆ มาแนะนำค่ะ</p>\n\n<h3>1. วางแผนการเรียนล่วงหน้า</h3>\n<p>เริ่มต้นด้วยการวางแผนการเรียนล่วงหน้าโดยกำหนดตารางเวลาการอ่านหนังสือและทำแบบฝึกหัดให้เหมาะสมกับแต่ละวิชา</p>\n\n<h3>2. สรุปเนื้อหาด้วยตัวเอง</h3>\n<p>การสรุปเนื้อหาด้วยตัวเองจะช่วยให้เข้าใจและจำได้ดีกว่าการอ่านเฉยๆ ลองเขียนสรุปด้วยลายมือหรือสร้าง Mind Map</p>\n\n<h3>3. ทำแบบฝึกหัดอย่างสม่ำเสมอ</h3>\n<p>การทำแบบฝึกหัดอย่างสม่ำเสมอจะช่วยให้คุ้นเคยกับรูปแบบข้อสอบและเพิ่มความมั่นใจในการทำข้อสอบจริง</p>\n\n<h3>4. ทบทวนอย่างต่อเนื่อง</h3>\n<p>อย่าลืมทบทวนเนื้อหาอย่างต่อเนื่อง การทบทวนจะช่วยให้จำได้นานขึ้นและไม่ลืมเนื้อหาที่เรียนไปแล้ว</p>\n\n<h3>5. พักผ่อนให้เพียงพอ</h3>\n<p>การพักผ่อนให้เพียงพอเป็นสิ่งสำคัญเพราะจะช่วยให้สมองสดใสและพร้อมรับความรู้ใหม่ๆ</p>\n\n<h3>6. เรียนแบบกลุ่ม</h3>\n<p>การเรียนแบบกลุ่มจะช่วยให้สามารถแลกเปลี่ยนความรู้และช่วยกันแก้ปัญหาได้ดีกว่าเรียนคนเดียว</p>\n\n<h3>7. ตั้งเป้าหมายที่ชัดเจน</h3>\n<p>การตั้งเป้าหมายที่ชัดเจนจะช่วยให้มีแรงบันดาลใจและมุ่งมั่นในการเรียนมากขึ้น</p>\n\n<h3>8. ใช้เทคนิคการจำ</h3>\n<p>ลองใช้เทคนิคการจำต่างๆ เช่น การเชื่อมโยงคำ การใช้ตัวย่อ หรือการสร้างเรื่องราว</p>\n\n<h3>9. หาแหล่งเรียนรู้เพิ่มเติม</h3>\n<p>หาแหล่งเรียนรู้เพิ่มเติมนอกเหนือจากหนังสือเรียน เช่น วิดีโอ YouTube, คอร์สออนไลน์, หรือติวเตอร์</p>\n\n<h3>10. สร้างแรงจูงใจในตัวเอง</h3>\n<p>สร้างแรงจูงใจในตัวเองโดยการนึกถึงเป้าหมายที่ตั้งไว้และผลประโยชน์ที่จะได้รับจากการสอบได้คะแนนดี</p>\n\n<p>เทคนิคเหล่านี้จะช่วยให้คุณเตรียมสอบได้อย่างมีประสิทธิภาพและทำคะแนนได้ตามที่ตั้งเป้าหมายไว้ค่ะ</p>','เทคนิคการเรียน','?',NULL,1,'published',1,1,1,'2025-12-21 23:27:19','2025-12-21 23:27:19','2025-12-21 23:30:46'),(2,'วิธีเลือกคอร์สเรียนที่เหมาะสมกับตัวเอง','how-to-choose-suitable-course','แนะนำแนวทางในการเลือกคอร์สเรียนให้เหมาะกับพื้นฐานและเป้าหมายของแต่ละคน เพื่อให้ได้ประโยชน์สูงสุดจากการเรียน','<h2>วิธีเลือกคอร์สเรียนที่เหมาะสมกับตัวเอง</h2>\n<p>การเลือกคอร์สเรียนที่เหมาะสมเป็นสิ่งสำคัญที่จะช่วยให้การเรียนมีประสิทธิภาพและบรรลุเป้าหมายที่ตั้งไว้</p>\n\n<h3>1. ประเมินพื้นฐานของตัวเอง</h3>\n<p>เริ่มต้นด้วยการประเมินพื้นฐานความรู้ของตัวเองว่าอยู่ในระดับใด เช่น ระดับเริ่มต้น ระดับกลาง หรือระดับสูง</p>\n\n<h3>2. กำหนดเป้าหมายการเรียน</h3>\n<p>กำหนดเป้าหมายที่ชัดเจนว่าต้องการเรียนเพื่ออะไร เช่น เพื่อเตรียมสอบเข้า, เพื่อเพิ่มเกรด, หรือเพื่อเรียนรู้เพิ่มเติม</p>\n\n<h3>3. ศึกษาเนื้อหาคอร์ส</h3>\n<p>ศึกษาเนื้อหาคอร์สให้ละเอียดว่าครอบคลุมอะไรบ้าง และตรงกับสิ่งที่ต้องการเรียนหรือไม่</p>\n\n<h3>4. ตรวจสอบคุณสมบัติของอาจารย์</h3>\n<p>ตรวจสอบคุณสมบัติและประสบการณ์ของอาจารย์ที่สอนคอร์สนั้นๆ เพื่อให้มั่นใจว่าจะได้รับความรู้ที่ดี</p>\n\n<h3>5. ดูรีวิวและความคิดเห็น</h3>\n<p>อ่านรีวิวและความคิดเห็นจากผู้ที่เคยเรียนคอร์สนั้นๆ เพื่อเป็นข้อมูลประกอบการตัดสินใจ</p>\n\n<h3>6. พิจารณารูปแบบการเรียน</h3>\n<p>พิจารณาว่ารูปแบบการเรียนเหมาะสมกับตัวเองหรือไม่ เช่น เรียนสด, เรียนออนไลน์, หรือเรียนแบบผสม</p>\n\n<h3>7. ตรวจสอบค่าใช้จ่าย</h3>\n<p>ตรวจสอบค่าใช้จ่ายและเปรียบเทียบกับงบประมาณที่มี เพื่อให้เลือกคอร์สที่เหมาะสมกับสถานะทางการเงิน</p>\n\n<p>การเลือกคอร์สเรียนที่เหมาะสมจะช่วยให้การเรียนมีประสิทธิภาพและบรรลุเป้าหมายที่ตั้งไว้ค่ะ</p>','เคล็ดลับ','?',NULL,1,'published',1,0,2,'2025-12-21 23:27:19','2025-12-21 23:27:19','2025-12-21 23:27:19'),(3,'บริหารเวลาให้มีประสิทธิภาพ สำหรับนักเรียน','time-management-for-students','เคล็ดลับการแบ่งเวลาเรียนและทำกิจกรรม ให้สมดุลและไม่เครียดเกินไป เพื่อให้การเรียนและการใช้ชีวิตเป็นไปอย่างราบรื่น','<h2>บริหารเวลาให้มีประสิทธิภาพ สำหรับนักเรียน</h2>\n<p>การบริหารเวลาเป็นทักษะสำคัญที่ช่วยให้นักเรียนสามารถจัดการกับงานต่างๆ ได้อย่างมีประสิทธิภาพและไม่เครียดเกินไป</p>\n\n<h3>1. สร้างตารางเวลาประจำวัน</h3>\n<p>เริ่มต้นด้วยการสร้างตารางเวลาประจำวันที่กำหนดเวลาเรียน, ทำการบ้าน, และพักผ่อนให้ชัดเจน</p>\n\n<h3>2. จัดลำดับความสำคัญ</h3>\n<p>จัดลำดับความสำคัญของงานต่างๆ โดยทำงานที่สำคัญและเร่งด่วนก่อน</p>\n\n<h3>3. ใช้เทคนิค Pomodoro</h3>\n<p>ใช้เทคนิค Pomodoro โดยทำงาน 25 นาที แล้วพัก 5 นาที จะช่วยให้โฟกัสได้ดีขึ้น</p>\n\n<h3>4. หลีกเลี่ยงการรบกวน</h3>\n<p>หลีกเลี่ยงการรบกวนจากโซเชียลมีเดียหรือสิ่งอื่นๆ ในขณะที่กำลังเรียนหรือทำงาน</p>\n\n<h3>5. หาเวลาพักผ่อน</h3>\n<p>หาเวลาพักผ่อนและทำกิจกรรมที่ชอบ เช่น ออกกำลังกาย, ฟังเพลง, หรืออ่านหนังสือ</p>\n\n<h3>6. อย่าลืมนอนหลับให้เพียงพอ</h3>\n<p>การนอนหลับให้เพียงพอ (7-9 ชั่วโมง) จะช่วยให้สมองสดใสและพร้อมรับความรู้ใหม่ๆ</p>\n\n<h3>7. รีวิวและปรับปรุง</h3>\n<p>รีวิวและปรับปรุงตารางเวลาอย่างสม่ำเสมอ เพื่อให้เหมาะสมกับการเปลี่ยนแปลงที่เกิดขึ้น</p>\n\n<p>การบริหารเวลาอย่างมีประสิทธิภาพจะช่วยให้การเรียนและการใช้ชีวิตเป็นไปอย่างราบรื่นและไม่เครียดเกินไปค่ะ</p>','การจัดการเวลา','⏰',NULL,1,'published',1,0,3,'2025-12-21 23:27:19','2025-12-21 23:27:19','2025-12-21 23:27:19');
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignment_submissions`
--

DROP TABLE IF EXISTS `assignment_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment_submissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `assignment_id` int NOT NULL,
  `student_id` int NOT NULL,
  `file_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_name` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` int DEFAULT NULL,
  `submission_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `score` int DEFAULT NULL,
  `feedback` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `submitted_at` datetime DEFAULT NULL,
  `graded_at` datetime DEFAULT NULL,
  `status` enum('submitted','graded','returned') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'submitted',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_assignment` (`assignment_id`),
  KEY `idx_student` (`student_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `assignment_submissions_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `assignment_submissions_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment_submissions`
--

LOCK TABLES `assignment_submissions` WRITE;
/*!40000 ALTER TABLE `assignment_submissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignment_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `session_id` int DEFAULT NULL,
  `tutor_id` int NOT NULL,
  `title` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `instructions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `due_date` datetime NOT NULL,
  `max_points` int DEFAULT '100',
  `allowed_file_types` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `max_file_size` int DEFAULT NULL,
  `status` enum('draft','published','closed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_tutor` (`tutor_id`),
  KEY `idx_due_date` (`due_date`),
  CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `assignments_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `course_sessions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `assignments_ibfk_3` FOREIGN KEY (`tutor_id`) REFERENCES `tutors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bank_accounts`
--

DROP TABLE IF EXISTS `bank_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bank_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `payment_method_id` int NOT NULL,
  `bank_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_type` enum('savings','current') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'savings',
  `branch_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qr_code_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_default` tinyint(1) DEFAULT '0',
  `display_order` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payment_method` (`payment_method_id`),
  KEY `idx_is_active` (`is_active`),
  CONSTRAINT `bank_accounts_ibfk_1` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bank_accounts`
--

LOCK TABLES `bank_accounts` WRITE;
/*!40000 ALTER TABLE `bank_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `bank_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branch_admins`
--

DROP TABLE IF EXISTS `branch_admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch_admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `branch_id` int NOT NULL,
  `user_id` int NOT NULL,
  `assigned_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_branch_admin` (`branch_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `branch_admins_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `branch_admins_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch_admins`
--

LOCK TABLES `branch_admins` WRITE;
/*!40000 ALTER TABLE `branch_admins` DISABLE KEYS */;
INSERT INTO `branch_admins` VALUES (1,1,12,'2025-12-19 15:50:04'),(2,2,13,'2025-12-19 15:50:04');
/*!40000 ALTER TABLE `branch_admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES (1,'แฟชั่นไอส์แลนด์','FASHION_ISLAND','แฟชั่นไอส์แลนด์ กรุงเทพมหานคร','02-123-4567','fashionisland@kdcschool.com','active','2025-12-19 14:12:42','2025-12-19 14:12:42'),(2,'สระบุรี','SARABURI','สระบุรี','036-123-4567','saraburi@kdcschool.com','active','2025-12-19 14:12:42','2025-12-19 14:12:42');
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_messages`
--

DROP TABLE IF EXISTS `chat_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `message_type` enum('text','image','file','system') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'text',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `file_name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` int DEFAULT NULL,
  `file_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reply_to_id` int DEFAULT NULL,
  `is_pinned` tinyint(1) DEFAULT '0',
  `file_url` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `read_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_room` (`room_id`),
  KEY `idx_sender` (`sender_id`),
  KEY `idx_created` (`created_at`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_room_created` (`room_id`,`created_at`),
  KEY `idx_reply_to` (`reply_to_id`),
  KEY `idx_is_pinned` (`is_pinned`),
  CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_messages_ibfk_reply` FOREIGN KEY (`reply_to_id`) REFERENCES `chat_messages` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_messages`
--

LOCK TABLES `chat_messages` WRITE;
/*!40000 ALTER TABLE `chat_messages` DISABLE KEYS */;
INSERT INTO `chat_messages` VALUES (1,1,9,'text','ทดสอบ',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 10:53:57','2025-12-22 09:54:11'),(2,1,9,'text','กกกกก',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 10:53:57','2025-12-22 09:57:07'),(3,1,9,'text','สวัสดีค่ะ',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 10:53:57','2025-12-22 10:52:11'),(4,1,3,'text','สวัสดีครับน้องสมชาย',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 10:56:23','2025-12-22 10:54:11'),(5,1,9,'text','อาจารย์มีการบ้านอะไรบ้างครับ',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 11:11:12','2025-12-22 10:56:37'),(6,1,9,'text','วันก่อนผมไม่ได้มาครับ',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 13:15:16','2025-12-22 11:11:54'),(7,1,9,'text','test',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 13:15:16','2025-12-22 12:47:04'),(8,1,9,'text','test2',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 13:15:16','2025-12-22 12:48:55'),(9,1,9,'text','test3',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 13:15:16','2025-12-22 12:51:23'),(10,1,9,'text','test4',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 13:15:16','2025-12-22 12:53:40'),(11,1,9,'text','test5',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 13:15:16','2025-12-22 13:08:18'),(12,1,9,'text','test6',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 13:15:16','2025-12-22 13:09:18'),(13,1,9,'text','test7',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 13:15:16','2025-12-22 13:13:21'),(14,1,9,'text','ข้อความไม่ซ้ำแล้ว',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 13:15:16','2025-12-22 13:13:31'),(15,1,9,'text','เช็คข้อความ',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 13:15:16','2025-12-22 13:13:46'),(16,1,3,'text','ตอบกลับแล้วนะ',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 13:17:18','2025-12-22 13:15:24'),(17,1,3,'text','T1',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 13:28:08','2025-12-22 13:17:30'),(18,1,9,'text','S1',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 20:35:35','2025-12-22 13:28:41'),(19,1,9,'text','S2',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 21:13:47','2025-12-22 21:13:36'),(20,1,3,'text','T2',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 21:16:26','2025-12-22 21:13:47'),(21,1,9,'text','S3',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 21:18:43','2025-12-22 21:16:34'),(22,1,9,'text','S4',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 21:31:25','2025-12-22 21:18:53'),(23,1,3,'text','S5',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 21:51:37','2025-12-22 21:31:34'),(24,1,3,'text','S6',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 21:54:30','2025-12-22 21:52:09'),(25,1,3,'text','T3',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 21:55:00','2025-12-22 21:54:43'),(26,1,9,'text','S7',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 22:00:15','2025-12-22 21:55:00'),(27,1,3,'text','T4',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 22:05:53','2025-12-22 22:00:31'),(28,1,3,'text','T5',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 22:07:12','2025-12-22 22:06:21'),(29,1,3,'text','T5',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 22:07:12','2025-12-22 22:06:46'),(30,1,3,'text','T6',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 22:13:22','2025-12-22 22:07:23'),(31,1,9,'text','S8',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 22:35:02','2025-12-22 22:13:35'),(32,1,9,'text','S9',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 22:35:02','2025-12-22 22:30:38'),(33,1,3,'text','T7',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 22:38:40','2025-12-22 22:35:07'),(34,1,3,'text','T8',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 22:42:33','2025-12-22 22:38:50'),(35,1,3,'text','T9',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 22:42:33','2025-12-22 22:39:56'),(36,1,3,'text','d',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 22:42:33','2025-12-22 22:39:59'),(37,1,3,'text','ss',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 22:42:33','2025-12-22 22:40:03'),(38,1,3,'text','กก',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 22:50:33','2025-12-22 22:42:44'),(39,1,3,'text','หห',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 22:50:33','2025-12-22 22:42:48'),(40,1,9,'text','S10',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 22:50:57','2025-12-22 22:50:44'),(41,1,3,'text','dd',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 22:55:59','2025-12-22 22:50:57'),(42,1,3,'text','DD',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 22:55:59','2025-12-22 22:51:08'),(43,1,3,'text','SS',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 22:55:59','2025-12-22 22:51:10'),(44,1,3,'text','DD',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 23:09:35','2025-12-22 22:56:09'),(45,1,3,'text','ss',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 23:09:35','2025-12-22 22:56:13'),(46,1,3,'text','abc',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 23:09:35','2025-12-22 23:09:27'),(47,1,9,'text','efc',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 23:17:34','2025-12-22 23:09:41'),(48,1,3,'text','ดดด',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 23:23:00','2025-12-22 23:17:42'),(49,1,3,'text','xxx',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 23:26:47','2025-12-22 23:23:10'),(50,1,3,'text','yyy',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 23:35:52','2025-12-22 23:26:56'),(51,1,3,'text','eeee',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 23:38:07','2025-12-22 23:36:12'),(52,1,3,'text','KKK',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 23:44:05','2025-12-22 23:38:16'),(53,1,3,'text','moo',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 23:44:38','2025-12-22 23:44:24'),(54,1,9,'text','ใช้งานได้แล้ว',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 23:46:03','2025-12-22 23:44:38'),(55,1,9,'text','ดีใจมาก',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-22 23:46:03','2025-12-22 23:46:00'),(56,1,3,'text','เย้ๆ',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-23 00:01:26','2025-12-22 23:46:03'),(57,1,3,'text','มีการบ้านนะ',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-23 00:01:26','2025-12-22 23:59:33'),(58,1,3,'text','เด๋วคุณครูจะส่งให้',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-23 00:01:26','2025-12-23 00:01:04'),(59,1,3,'text','โอเครไหม',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-23 00:01:26','2025-12-23 00:01:17'),(60,1,9,'text','Ok',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-23 00:03:05','2025-12-23 00:01:53'),(61,1,9,'text','ทดด',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-23 00:05:18','2025-12-23 00:03:27'),(62,1,9,'text','สวดยอด',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-23 00:05:18','2025-12-23 00:03:29'),(63,1,3,'text','นา',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-23 00:05:55','2025-12-23 00:05:27'),(64,1,3,'text','แจ่มมากครับ',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-23 00:05:55','2025-12-23 00:05:33'),(65,1,9,'text','ส่งวันไหนครับครุ',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-23 00:08:52','2025-12-23 00:08:45'),(66,1,3,'text','ส่งพรุ่งนี้ครับนักเรียน',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-23 00:15:47','2025-12-23 00:09:01'),(67,1,9,'text','ขอบคุณครับ',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-23 00:17:32','2025-12-23 00:15:57'),(68,1,9,'text','😀 สวดยอดครับ',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-23 00:46:31','2025-12-23 00:36:35'),(69,1,9,'image','น่ากินไหมครับ','1a956c46450e1847584fd382f605b0a6_XL.jpg',122467,'image/jpeg',NULL,0,'/uploads/chat/1/images/1766425543588-mu1n4gb1xe.jpg',1,'2025-12-23 00:46:31','2025-12-23 00:45:43'),(70,1,3,'text','น่ากินมาก',NULL,NULL,NULL,NULL,0,NULL,1,'2025-12-23 00:55:33','2025-12-23 00:46:56'),(71,1,9,'text','ส่งวันนี้ไง',NULL,NULL,NULL,66,0,NULL,0,NULL,'2025-12-23 00:59:01'),(72,1,9,'text','ทำการบ้านยัง',NULL,NULL,NULL,57,0,NULL,0,NULL,'2025-12-23 01:02:31');
/*!40000 ALTER TABLE `chat_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_room_notes`
--

DROP TABLE IF EXISTS `chat_room_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_room_notes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` int NOT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `updated_by` (`updated_by`),
  KEY `idx_room` (`room_id`),
  KEY `idx_created_by` (`created_by`),
  CONSTRAINT `chat_room_notes_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_room_notes_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_room_notes_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_room_notes`
--

LOCK TABLES `chat_room_notes` WRITE;
/*!40000 ALTER TABLE `chat_room_notes` DISABLE KEYS */;
INSERT INTO `chat_room_notes` VALUES (1,1,'ต้องทำการบ้านส่งพรุ่งนี้',9,NULL,'2025-12-23 01:07:50','2025-12-23 01:07:50');
/*!40000 ALTER TABLE `chat_room_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_room_participants`
--

DROP TABLE IF EXISTS `chat_room_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_room_participants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `user_id` int NOT NULL,
  `role` enum('student','tutor','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `joined_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_read_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_room_user` (`room_id`,`user_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_room` (`room_id`),
  CONSTRAINT `chat_room_participants_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_room_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_room_participants`
--

LOCK TABLES `chat_room_participants` WRITE;
/*!40000 ALTER TABLE `chat_room_participants` DISABLE KEYS */;
INSERT INTO `chat_room_participants` VALUES (1,1,9,'student','2025-12-22 00:54:34','2025-12-23 01:07:33'),(2,1,3,'tutor','2025-12-22 00:54:34','2025-12-23 00:46:56');
/*!40000 ALTER TABLE `chat_room_participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_room_tags`
--

DROP TABLE IF EXISTS `chat_room_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_room_tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `tag_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '#3B82F6',
  `created_by` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_room` (`room_id`),
  KEY `idx_created_by` (`created_by`),
  CONSTRAINT `chat_room_tags_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_room_tags_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_room_tags`
--

LOCK TABLES `chat_room_tags` WRITE;
/*!40000 ALTER TABLE `chat_room_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_room_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_rooms`
--

DROP TABLE IF EXISTS `chat_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `student_id` int NOT NULL,
  `tutor_id` int NOT NULL,
  `status` enum('active','archived','closed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `last_message_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_tutor_course` (`student_id`,`tutor_id`,`course_id`),
  KEY `idx_student` (`student_id`),
  KEY `idx_tutor` (`tutor_id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_status` (`status`),
  KEY `idx_last_message` (`last_message_at`),
  CONSTRAINT `chat_rooms_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_rooms_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_rooms_ibfk_3` FOREIGN KEY (`tutor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_rooms`
--

LOCK TABLES `chat_rooms` WRITE;
/*!40000 ALTER TABLE `chat_rooms` DISABLE KEYS */;
INSERT INTO `chat_rooms` VALUES (1,1,9,3,'active','2025-12-23 01:02:31','2025-12-22 00:54:34','2025-12-23 01:02:31');
/*!40000 ALTER TABLE `chat_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_branches`
--

DROP TABLE IF EXISTS `course_branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_branches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `seat_limit` int DEFAULT NULL,
  `current_enrollments` int DEFAULT '0',
  `is_available` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_course_branch` (`course_id`,`branch_id`),
  KEY `branch_id` (`branch_id`),
  KEY `idx_availability` (`is_available`),
  CONSTRAINT `course_branches_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `course_branches_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_branches`
--

LOCK TABLES `course_branches` WRITE;
/*!40000 ALTER TABLE `course_branches` DISABLE KEYS */;
INSERT INTO `course_branches` VALUES (1,1,1,50,1,1),(2,2,1,50,1,1),(3,3,1,50,1,1),(4,4,1,50,1,1),(5,5,1,50,0,1),(6,6,1,50,0,1),(7,7,2,50,1,1),(8,8,2,50,1,1),(9,9,2,50,0,1),(10,10,2,50,0,1);
/*!40000 ALTER TABLE `course_branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_grade_levels`
--

DROP TABLE IF EXISTS `course_grade_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_grade_levels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `grade_level_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_course_grade` (`course_id`,`grade_level_id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_grade` (`grade_level_id`),
  CONSTRAINT `course_grade_levels_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `course_grade_levels_ibfk_2` FOREIGN KEY (`grade_level_id`) REFERENCES `grade_levels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_grade_levels`
--

LOCK TABLES `course_grade_levels` WRITE;
/*!40000 ALTER TABLE `course_grade_levels` DISABLE KEYS */;
INSERT INTO `course_grade_levels` VALUES (1,1,6,'2025-12-19 14:14:09'),(2,1,7,'2025-12-19 14:14:09'),(3,2,6,'2025-12-19 14:14:09'),(4,2,7,'2025-12-19 14:14:09'),(5,3,6,'2025-12-19 14:14:09'),(6,3,7,'2025-12-19 14:14:09'),(7,4,6,'2025-12-19 14:14:09'),(8,4,7,'2025-12-19 14:14:09'),(9,5,5,'2025-12-19 14:14:09'),(10,5,6,'2025-12-19 14:14:09'),(11,6,9,'2025-12-19 14:14:09'),(12,6,10,'2025-12-19 14:14:09'),(13,7,6,'2025-12-19 14:21:51'),(14,7,7,'2025-12-19 14:21:51'),(15,8,6,'2025-12-19 14:21:51'),(16,8,7,'2025-12-19 14:21:51'),(17,9,5,'2025-12-19 14:21:51'),(18,9,6,'2025-12-19 14:21:51'),(19,10,9,'2025-12-19 14:21:51'),(20,10,10,'2025-12-19 14:21:51');
/*!40000 ALTER TABLE `course_grade_levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_inclusions`
--

DROP TABLE IF EXISTS `course_inclusions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_inclusions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `inclusion_id` int NOT NULL,
  `enrollment_type` enum('onsite','online','both') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'both',
  `quantity` int DEFAULT '1',
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_inclusion` (`inclusion_id`),
  KEY `idx_enrollment_type` (`enrollment_type`),
  CONSTRAINT `course_inclusions_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `course_inclusions_ibfk_2` FOREIGN KEY (`inclusion_id`) REFERENCES `inclusions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_inclusions`
--

LOCK TABLES `course_inclusions` WRITE;
/*!40000 ALTER TABLE `course_inclusions` DISABLE KEYS */;
INSERT INTO `course_inclusions` VALUES (1,1,1,'onsite',5,NULL,'2025-12-19 14:14:09'),(2,1,2,'onsite',1,NULL,'2025-12-19 14:14:09'),(3,1,3,'onsite',1,NULL,'2025-12-19 14:14:09'),(4,1,1,'online',5,NULL,'2025-12-19 14:14:09'),(5,1,3,'online',1,NULL,'2025-12-19 14:14:09'),(6,1,4,'online',1,NULL,'2025-12-19 14:14:09'),(7,2,1,'onsite',5,NULL,'2025-12-19 14:14:09'),(8,2,2,'onsite',1,NULL,'2025-12-19 14:14:09'),(9,2,3,'onsite',1,NULL,'2025-12-19 14:14:09'),(10,2,1,'online',5,NULL,'2025-12-19 14:14:09'),(11,2,3,'online',1,NULL,'2025-12-19 14:14:09'),(12,2,4,'online',1,NULL,'2025-12-19 14:14:09'),(13,3,1,'onsite',5,NULL,'2025-12-19 14:14:09'),(14,3,2,'onsite',1,NULL,'2025-12-19 14:14:09'),(15,3,3,'onsite',1,NULL,'2025-12-19 14:14:09'),(16,3,1,'online',5,NULL,'2025-12-19 14:14:09'),(17,3,3,'online',1,NULL,'2025-12-19 14:14:09'),(18,3,4,'online',1,NULL,'2025-12-19 14:14:09'),(19,4,1,'onsite',5,NULL,'2025-12-19 14:14:09'),(20,4,2,'onsite',1,NULL,'2025-12-19 14:14:09'),(21,4,3,'onsite',1,NULL,'2025-12-19 14:14:09'),(22,4,1,'online',5,NULL,'2025-12-19 14:14:09'),(23,4,3,'online',1,NULL,'2025-12-19 14:14:09'),(24,4,4,'online',1,NULL,'2025-12-19 14:14:09'),(25,5,1,'onsite',5,NULL,'2025-12-19 14:14:09'),(26,5,2,'onsite',1,NULL,'2025-12-19 14:14:09'),(27,5,1,'online',5,NULL,'2025-12-19 14:14:09'),(28,5,4,'online',1,NULL,'2025-12-19 14:14:09'),(29,6,1,'onsite',5,NULL,'2025-12-19 14:14:09'),(30,6,2,'onsite',1,NULL,'2025-12-19 14:14:09'),(31,6,3,'onsite',1,NULL,'2025-12-19 14:14:09'),(32,6,1,'online',5,NULL,'2025-12-19 14:14:09'),(33,6,3,'online',1,NULL,'2025-12-19 14:14:09'),(34,6,4,'online',1,NULL,'2025-12-19 14:14:09'),(35,7,1,'onsite',3,NULL,'2025-12-19 14:21:51'),(36,7,2,'onsite',1,NULL,'2025-12-19 14:21:51'),(37,7,3,'onsite',1,NULL,'2025-12-19 14:21:51'),(38,7,1,'online',3,NULL,'2025-12-19 14:21:51'),(39,7,3,'online',1,NULL,'2025-12-19 14:21:51'),(40,7,4,'online',1,NULL,'2025-12-19 14:21:51'),(41,8,1,'onsite',5,NULL,'2025-12-19 14:21:51'),(42,8,2,'onsite',1,NULL,'2025-12-19 14:21:51'),(43,8,3,'onsite',1,NULL,'2025-12-19 14:21:51'),(44,8,1,'online',5,NULL,'2025-12-19 14:21:51'),(45,8,3,'online',1,NULL,'2025-12-19 14:21:51'),(46,8,4,'online',1,NULL,'2025-12-19 14:21:51'),(47,9,1,'onsite',2,NULL,'2025-12-19 14:21:51'),(48,9,2,'onsite',1,NULL,'2025-12-19 14:21:51'),(49,9,3,'onsite',1,NULL,'2025-12-19 14:21:51'),(50,9,1,'online',2,NULL,'2025-12-19 14:21:51'),(51,9,3,'online',1,NULL,'2025-12-19 14:21:51'),(52,9,4,'online',1,NULL,'2025-12-19 14:21:51'),(53,10,1,'onsite',5,NULL,'2025-12-19 14:21:51'),(54,10,2,'onsite',1,NULL,'2025-12-19 14:21:51'),(55,10,3,'onsite',1,NULL,'2025-12-19 14:21:51'),(56,10,1,'online',5,NULL,'2025-12-19 14:21:51'),(57,10,3,'online',1,NULL,'2025-12-19 14:21:51'),(58,10,4,'online',1,NULL,'2025-12-19 14:21:51');
/*!40000 ALTER TABLE `course_inclusions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_round_schedules`
--

DROP TABLE IF EXISTS `course_round_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_round_schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `round_id` int NOT NULL,
  `session_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `session_number` int DEFAULT NULL,
  `status` enum('scheduled','completed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'scheduled',
  PRIMARY KEY (`id`),
  KEY `idx_round_date` (`round_id`,`session_date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `course_round_schedules_ibfk_1` FOREIGN KEY (`round_id`) REFERENCES `course_rounds` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_round_schedules`
--

LOCK TABLES `course_round_schedules` WRITE;
/*!40000 ALTER TABLE `course_round_schedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_round_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_rounds`
--

DROP TABLE IF EXISTS `course_rounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_rounds` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `round_number` int NOT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `schedule_days` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `onsite_price` decimal(10,2) DEFAULT NULL,
  `online_price` decimal(10,2) DEFAULT NULL,
  `seat_limit` int DEFAULT NULL,
  `current_enrollments` int DEFAULT '0',
  `status` enum('upcoming','ongoing','completed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'upcoming',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_course_round` (`course_id`,`round_number`),
  KEY `idx_course` (`course_id`),
  KEY `idx_dates` (`start_date`,`end_date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `course_rounds_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_rounds`
--

LOCK TABLES `course_rounds` WRITE;
/*!40000 ALTER TABLE `course_rounds` DISABLE KEYS */;
INSERT INTO `course_rounds` VALUES (1,1,1,'รอบ 1',NULL,'2026-02-21','2026-03-22','เสาร์','08:30:00','16:15:00',5500.00,4000.00,50,0,'upcoming','2025-12-19 14:14:09','2025-12-19 14:14:09'),(2,1,2,'รอบ 2',NULL,'2026-03-16','2026-03-27','จันทร์-พุธ-ศุกร์','08:30:00','16:15:00',5500.00,4000.00,50,0,'upcoming','2025-12-19 14:14:09','2025-12-19 14:14:09'),(3,2,1,'รอบ 1',NULL,'2026-02-02','2026-02-13','จันทร์-พุธ-ศุกร์','17:30:00','20:30:00',2800.00,2200.00,50,0,'upcoming','2025-12-19 14:14:09','2025-12-19 14:14:09'),(4,2,2,'รอบ 2',NULL,'2026-02-14','2026-02-15','เสาร์และอาทิตย์','08:30:00','17:30:00',2800.00,2200.00,50,0,'upcoming','2025-12-19 14:14:09','2025-12-19 14:14:09'),(5,3,2,'รอบ 2',NULL,'2026-02-14','2026-02-15','เสาร์และอาทิตย์','08:30:00','17:30:00',3000.00,2400.00,50,0,'upcoming','2025-12-19 14:14:09','2025-12-19 14:14:09'),(6,4,1,'รอบ 1',NULL,'2026-03-03','2026-03-26','อังคารและพฤหัสบดี','17:30:00','20:30:00',3300.00,2800.00,50,0,'upcoming','2025-12-19 14:14:09','2025-12-19 14:14:09'),(7,5,1,'รอบ 1',NULL,'2026-03-07','2026-04-04','เสาร์','08:30:00','15:15:00',5900.00,4500.00,50,0,'upcoming','2025-12-19 14:14:09','2025-12-19 14:14:09'),(8,6,1,'รอบ 1',NULL,'2026-03-14','2026-03-28','เสาร์และอาทิตย์','08:30:00','15:15:00',4500.00,4000.00,50,0,'upcoming','2025-12-19 14:14:09','2025-12-19 14:14:09'),(9,7,1,'รอบวันธรรมดา',NULL,'2026-02-02','2026-02-13','จันทร์-พุธ-ศุกร์','17:00:00','20:00:00',2800.00,2200.00,50,0,'upcoming','2025-12-19 14:21:51','2025-12-19 14:21:51'),(10,7,2,'รอบวันเสาร์-อาทิตย์',NULL,'2026-02-14','2026-02-15','เสาร์และอาทิตย์','08:30:00','17:30:00',2800.00,2200.00,50,0,'upcoming','2025-12-19 14:21:51','2025-12-19 14:21:51'),(11,8,1,'รอบ 1',NULL,'2026-02-21','2026-03-22','เสาร์','08:30:00','16:15:00',5200.00,4000.00,50,0,'upcoming','2025-12-19 14:21:51','2025-12-19 14:21:51'),(12,9,1,'รอบ 1',NULL,'2026-03-07','2026-04-04','เสาร์','08:30:00','15:15:00',5500.00,4500.00,50,0,'upcoming','2025-12-19 14:21:51','2025-12-19 14:21:51'),(13,10,1,'รอบ 1',NULL,'2026-03-14','2026-03-28','เสาร์และอาทิตย์','08:30:00','15:15:00',4500.00,4000.00,50,0,'upcoming','2025-12-19 14:21:51','2025-12-19 14:21:51');
/*!40000 ALTER TABLE `course_rounds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_schedules`
--

DROP TABLE IF EXISTS `course_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `tutor_id` int NOT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL,
  `session_type` enum('live','vod') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meeting_link` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('scheduled','ongoing','completed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'scheduled',
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  KEY `branch_id` (`branch_id`),
  KEY `tutor_id` (`tutor_id`),
  KEY `idx_datetime` (`start_datetime`),
  KEY `idx_status` (`status`),
  CONSTRAINT `course_schedules_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `course_schedules_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `course_schedules_ibfk_3` FOREIGN KEY (`tutor_id`) REFERENCES `tutors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_schedules`
--

LOCK TABLES `course_schedules` WRITE;
/*!40000 ALTER TABLE `course_schedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_sessions`
--

DROP TABLE IF EXISTS `course_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `schedule_id` int DEFAULT NULL,
  `title` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_number` int DEFAULT NULL,
  `content_type` enum('live','vod') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `video_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meeting_link` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `materials` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  KEY `schedule_id` (`schedule_id`),
  CONSTRAINT `course_sessions_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `course_sessions_ibfk_2` FOREIGN KEY (`schedule_id`) REFERENCES `course_schedules` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_sessions`
--

LOCK TABLES `course_sessions` WRITE;
/*!40000 ALTER TABLE `course_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_subjects`
--

DROP TABLE IF EXISTS `course_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `subject_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_course_subject` (`course_id`,`subject_id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_subject` (`subject_id`),
  CONSTRAINT `course_subjects_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `course_subjects_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_subjects`
--

LOCK TABLES `course_subjects` WRITE;
/*!40000 ALTER TABLE `course_subjects` DISABLE KEYS */;
INSERT INTO `course_subjects` VALUES (1,1,1,'2025-12-19 14:14:09'),(2,1,2,'2025-12-19 14:14:09'),(3,1,3,'2025-12-19 14:14:09'),(4,1,4,'2025-12-19 14:14:09'),(5,1,5,'2025-12-19 14:14:09'),(6,2,1,'2025-12-19 14:14:09'),(7,2,2,'2025-12-19 14:14:09'),(8,2,3,'2025-12-19 14:14:09'),(9,3,1,'2025-12-19 14:14:09'),(10,3,2,'2025-12-19 14:14:09'),(11,3,3,'2025-12-19 14:14:09'),(12,4,1,'2025-12-19 14:14:09'),(13,4,2,'2025-12-19 14:14:09'),(14,4,3,'2025-12-19 14:14:09'),(15,4,4,'2025-12-19 14:14:09'),(16,4,5,'2025-12-19 14:14:09'),(17,5,1,'2025-12-19 14:14:09'),(18,5,2,'2025-12-19 14:14:09'),(19,6,1,'2025-12-19 14:14:09'),(20,6,2,'2025-12-19 14:14:09'),(21,6,3,'2025-12-19 14:14:09'),(22,6,4,'2025-12-19 14:14:09'),(23,6,5,'2025-12-19 14:14:09'),(24,7,1,'2025-12-19 14:21:51'),(25,7,2,'2025-12-19 14:21:51'),(26,7,3,'2025-12-19 14:21:51'),(27,8,1,'2025-12-19 14:21:51'),(28,8,2,'2025-12-19 14:21:51'),(29,8,3,'2025-12-19 14:21:51'),(30,8,4,'2025-12-19 14:21:51'),(31,8,5,'2025-12-19 14:21:51'),(32,9,1,'2025-12-19 14:21:51'),(33,9,2,'2025-12-19 14:21:51'),(34,10,1,'2025-12-19 14:21:51'),(35,10,2,'2025-12-19 14:21:51'),(36,10,3,'2025-12-19 14:21:51'),(37,10,4,'2025-12-19 14:21:51'),(38,10,5,'2025-12-19 14:21:51');
/*!40000 ALTER TABLE `course_subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `objectives` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `prerequisites` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `target_audience` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `short_description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnail_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('live_online','vod','hybrid') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `average_rating` decimal(3,2) DEFAULT '0.00',
  `review_count` int DEFAULT '0',
  `onsite_price` decimal(10,2) DEFAULT NULL,
  `online_price` decimal(10,2) DEFAULT NULL,
  `duration_hours` int DEFAULT NULL,
  `level` enum('beginner','intermediate','advanced') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `grade_from` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `grade_to` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `course_category` enum('regular','entrance_exam','special','intensive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'regular',
  `class_type` enum('regular','gifted','iep','ep','special','foundation') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'regular',
  `set_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_sets` int DEFAULT NULL,
  `target_school` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `academic_year` int DEFAULT NULL,
  `exam_date` datetime DEFAULT NULL,
  `semester` enum('1','2','summer','all') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'all',
  `status` enum('draft','published','archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `created_by` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `created_by` (`created_by`),
  KEY `idx_status` (`status`),
  KEY `idx_type` (`type`),
  KEY `idx_class_type` (`class_type`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'ENT-P6-M1-REG-2569','คอร์สโค้งสุดท้าย ป.6 สอบเข้า ม.1 ห้องปกติ-ทั่วไป ชุด 5/5','คอร์สโค้งสุดท้ายสำหรับนักเรียนชั้น ป.6 ที่ต้องการสอบเข้า ม.1 ห้องปกติ-ทั่วไป\n        ครอบคลุมเนื้อหาทั้ง 5 วิชาหลัก:\n        - คณิตศาสตร์\n        - วิทยาศาสตร์\n        - ภาษาอังกฤษ\n        - ภาษาไทย\n        - สังคมศึกษา\n        \n        พร้อมเทคนิคการทำข้อสอบและแนวข้อสอบจริง\n        เรียนได้ทั้งแบบ Onsite และ Online',NULL,NULL,NULL,'เตรียมสอบเข้า ม.1 สำหรับนักเรียนชั้น ป.6 ห้องปกติ-ทั่วไป','/uploads/courses/1/thumbnail.png','hybrid',5500.00,0.00,0,5500.00,4000.00,42,'intermediate',NULL,NULL,'entrance_exam','regular','5/5',5,NULL,2569,'2026-03-28 00:00:00','all','published',1,'2025-12-19 14:14:09','2025-12-21 23:56:36'),(2,'ENT-P6-M1-GIFTED-2569','คอร์สโค้งสุดท้าย ป.6 สอบเข้า ม.1 ห้องพิเศษ GIFTED-IEP-EP','คอร์สโค้งสุดท้ายสำหรับนักเรียนชั้น ป.6 ที่ต้องการสอบเข้า ม.1 ห้องพิเศษ GIFTED-IEP-EP\n        ครอบคลุมเนื้อหาทั้ง 3 วิชาหลัก:\n        - คณิตศาสตร์\n        - วิทยาศาสตร์\n        - ภาษาอังกฤษ\n        \n        พร้อมเทคนิคการทำข้อสอบและแนวข้อสอบจริง\n        เรียนได้ทั้งแบบ Onsite และ Online',NULL,NULL,NULL,'เตรียมสอบเข้า ม.1 ห้องพิเศษ GIFTED-IEP-EP สำหรับนักเรียนชั้น ป.6',NULL,'hybrid',2800.00,0.00,0,2800.00,2200.00,16,'advanced',NULL,NULL,'entrance_exam','gifted',NULL,NULL,NULL,2569,'2026-02-21 00:00:00','all','published',1,'2025-12-19 14:14:09','2025-12-19 14:14:09'),(3,'ENT-P6-M1-EP-2569','คอร์สโค้งสุดท้าย ป.6 สอบเข้า ม.1 ห้องพิเศษ EP (ภาคอังกฤษ)','คอร์สโค้งสุดท้ายสำหรับนักเรียนชั้น ป.6 ที่ต้องการสอบเข้า ม.1 ห้องพิเศษ EP (English Program)\n        ครอบคลุมเนื้อหาทั้ง 3 วิชาหลัก:\n        - คณิตศาสตร์\n        - วิทยาศาสตร์\n        - ภาษาอังกฤษ\n        \n        พร้อมเทคนิคการทำข้อสอบและแนวข้อสอบจริง\n        เรียนได้ทั้งแบบ Onsite และ Online',NULL,NULL,NULL,'เตรียมสอบเข้า ม.1 ห้องพิเศษ EP สำหรับนักเรียนชั้น ป.6',NULL,'hybrid',3000.00,0.00,0,3000.00,2400.00,16,'advanced',NULL,NULL,'entrance_exam','ep',NULL,NULL,NULL,2569,'2026-02-21 00:00:00','all','published',1,'2025-12-19 14:14:09','2025-12-19 14:14:09'),(4,'ENT-HORWANG-SET6-2569','ข้อสอบจริง รร.หอวัง ชุดที่ 6','ตะลุยโจทย์ข้อสอบจริง รร.หอวัง ชุดที่ 6\n        ครอบคลุมเนื้อหาทั้ง 5 วิชาหลัก:\n        - คณิตศาสตร์\n        - วิทยาศาสตร์\n        - ภาษาอังกฤษ\n        - ภาษาไทย\n        - สังคมศึกษา\n        \n        พร้อมเทคนิคการทำข้อสอบและแนวข้อสอบจริง\n        เรียนได้ทั้งแบบ Onsite และ Online',NULL,NULL,NULL,'ตะลุยโจทย์ข้อสอบจริง รร.หอวัง ชุดที่ 6',NULL,'hybrid',3300.00,0.00,0,3300.00,2800.00,24,'intermediate',NULL,NULL,'entrance_exam','special','6',NULL,'รร.หอวัง',2569,'2026-03-28 00:00:00','all','published',1,'2025-12-19 14:14:09','2025-12-19 14:14:09'),(5,'FOUNDATION-P5-P6-2569','คอร์สปูพื้นฐาน ป.5 ขึ้น ป.6','คอร์สปูพื้นฐานสำหรับนักเรียนชั้น ป.5 ที่จะขึ้น ป.6\n        ครอบคลุมเนื้อหาทั้ง 2 วิชาหลัก:\n        - คณิตศาสตร์\n        - วิทยาศาสตร์\n        \n        เพื่อเตรียมความพร้อมก่อนขึ้นชั้น ป.6\n        เรียนได้ทั้งแบบ Onsite และ Online',NULL,NULL,NULL,'ปูพื้นฐานสำหรับนักเรียนชั้น ป.5 ที่จะขึ้น ป.6',NULL,'hybrid',5900.00,0.00,0,5900.00,4500.00,30,'beginner',NULL,NULL,'regular','foundation',NULL,NULL,NULL,2569,NULL,'all','published',1,'2025-12-19 14:14:09','2025-12-19 14:14:09'),(6,'ENT-M3-M4-OBEC-2569','ม.3 ตะลุยโจทย์สอบเข้า ม.4 ห้องปกติ รร.สพฐ','ตะลุยโจทย์สอบเข้า ม.4 ห้องปกติ รร.สพฐ สำหรับนักเรียนชั้น ม.3\n        ครอบคลุมเนื้อหาทั้ง 5 วิชาหลัก:\n        - คณิตศาสตร์\n        - วิทยาศาสตร์\n        - ภาษาอังกฤษ\n        - ภาษาไทย\n        - สังคมศึกษา\n        \n        พร้อมเทคนิคการทำข้อสอบและแนวข้อสอบจริง\n        เรียนได้ทั้งแบบ Onsite และ Online',NULL,NULL,NULL,'ตะลุยโจทย์สอบเข้า ม.4 ห้องปกติ รร.สพฐ สำหรับนักเรียนชั้น ม.3',NULL,'hybrid',4500.00,0.00,0,4500.00,4000.00,30,'intermediate',NULL,NULL,'entrance_exam','regular',NULL,NULL,'รร.สพฐ',2569,NULL,'all','published',1,'2025-12-19 14:14:09','2025-12-19 14:14:09'),(7,'ENT-P6-M1-GIFTED-SARABURI-2569','คอร์สโค้งสุดท้าย ป.6 สอบเข้า ม.1 ห้องพิเศษ GIFTED/SMP EP SMTE','คอร์สโค้งสุดท้ายสำหรับนักเรียนชั้น ป.6 ที่ต้องการสอบเข้า ม.1 ห้องพิเศษ GIFTED/SMP EP SMTE\n        ครอบคลุมเนื้อหาทั้ง 3 วิชาหลัก:\n        - คณิตศาสตร์\n        - วิทยาศาสตร์\n        - ภาษาอังกฤษ\n        \n        พร้อมเทคนิคการทำข้อสอบและแนวข้อสอบจริง\n        เรียนได้ทั้งแบบ Onsite และ Online',NULL,NULL,NULL,'เตรียมสอบเข้า ม.1 ห้องพิเศษ GIFTED/SMP EP SMTE สำหรับนักเรียนชั้น ป.6','/uploads/courses/7/thumbnail.png','hybrid',2800.00,0.00,0,2800.00,2200.00,16,'advanced',NULL,NULL,'entrance_exam','gifted',NULL,NULL,NULL,2569,'2026-02-21 00:00:00','all','published',1,'2025-12-19 14:21:51','2025-12-21 23:56:36'),(8,'ENT-P6-M1-REG-SARABURI-2569','คอร์สโค้งสุดท้าย ป.6 สอบเข้า ม.1 ห้องปกติ/ทั่วไป','คอร์สโค้งสุดท้ายสำหรับนักเรียนชั้น ป.6 ที่ต้องการสอบเข้า ม.1 ห้องปกติ/ทั่วไป\n        ครอบคลุมเนื้อหาทั้ง 5 วิชาหลัก:\n        - คณิตศาสตร์\n        - วิทยาศาสตร์\n        - ภาษาอังกฤษ\n        - ภาษาไทย\n        - สังคมศึกษา\n        \n        พร้อมเทคนิคการทำข้อสอบและแนวข้อสอบจริง\n        เรียนได้ทั้งแบบ Onsite และ Online',NULL,NULL,NULL,'เตรียมสอบเข้า ม.1 ห้องปกติ/ทั่วไป สำหรับนักเรียนชั้น ป.6',NULL,'hybrid',5200.00,0.00,0,5200.00,4000.00,42,'intermediate',NULL,NULL,'entrance_exam','regular',NULL,NULL,NULL,2569,'2026-03-28 00:00:00','all','published',1,'2025-12-19 14:21:51','2025-12-19 14:21:51'),(9,'FOUNDATION-P5-P6-SARABURI-2569','คอร์สปูพื้นฐาน ป.5 ขึ้น ป.6 คณิต-วิทย์','คอร์สปูพื้นฐานสำหรับนักเรียนชั้น ป.5 ที่จะขึ้น ป.6\n        ครอบคลุมเนื้อหาทั้ง 2 วิชาหลัก:\n        - คณิตศาสตร์\n        - วิทยาศาสตร์\n        \n        เนื้อหาคณิต-วิทย์ ป.4 เทอม 1-2 / ป.5 เทอม 1-2\n        เพื่อเตรียมความพร้อมก่อนขึ้นชั้น ป.6\n        เรียนได้ทั้งแบบ Onsite และ Online',NULL,NULL,NULL,'ปูพื้นฐานสำหรับนักเรียนชั้น ป.5 ที่จะขึ้น ป.6',NULL,'hybrid',5500.00,0.00,0,5500.00,4500.00,30,'beginner',NULL,NULL,'regular','foundation',NULL,NULL,NULL,2569,NULL,'all','published',1,'2025-12-19 14:21:51','2025-12-19 14:21:51'),(10,'ENT-M3-M4-OBEC-SARABURI-2569','ม.3 ตะลุยโจทย์สอบเข้า ม.4 ห้องปกติ รร.สพฐ','ตะลุยโจทย์สอบเข้า ม.4 ห้องปกติ รร.สพฐ สำหรับนักเรียนชั้น ม.3\n        ครอบคลุมเนื้อหาทั้ง 5 วิชาหลัก:\n        - คณิตศาสตร์\n        - วิทยาศาสตร์\n        - ภาษาอังกฤษ\n        - ภาษาไทย\n        - สังคมศึกษา\n        \n        พร้อมเทคนิคการทำข้อสอบและแนวข้อสอบจริง\n        เรียนได้ทั้งแบบ Onsite และ Online',NULL,NULL,NULL,'ตะลุยโจทย์สอบเข้า ม.4 ห้องปกติ รร.สพฐ สำหรับนักเรียนชั้น ม.3',NULL,'hybrid',4500.00,0.00,0,4500.00,4000.00,30,'intermediate',NULL,NULL,'entrance_exam','regular',NULL,NULL,'รร.สพฐ',2569,'2026-03-29 00:00:00','all','published',1,'2025-12-19 14:21:51','2025-12-19 14:21:51');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `enrollment_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','active','completed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `branch_id` (`branch_id`),
  KEY `idx_student` (`student_id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_3` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` VALUES (1,9,1,1,'2025-12-19 14:56:30','active',1,'2025-12-19 14:56:30','2025-12-19 14:56:30'),(2,9,2,1,'2025-12-19 14:56:30','active',2,'2025-12-19 14:56:30','2025-12-19 14:56:30'),(3,10,3,1,'2025-12-19 14:56:30','active',3,'2025-12-19 14:56:30','2025-12-19 14:56:30'),(4,10,4,1,'2025-12-19 14:56:30','active',4,'2025-12-19 14:56:30','2025-12-19 14:56:30'),(5,11,7,2,'2025-12-19 14:56:30','active',5,'2025-12-19 14:56:30','2025-12-19 14:56:30'),(6,11,8,2,'2025-12-19 14:56:30','active',6,'2025-12-19 14:56:30','2025-12-19 14:56:30');
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grade_levels`
--

DROP TABLE IF EXISTS `grade_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grade_levels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `level_type` enum('elementary','secondary') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `grade_number` int NOT NULL,
  `display_order` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`),
  KEY `idx_type_grade` (`level_type`,`grade_number`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade_levels`
--

LOCK TABLES `grade_levels` WRITE;
/*!40000 ALTER TABLE `grade_levels` DISABLE KEYS */;
INSERT INTO `grade_levels` VALUES (1,'P1','ประถมศึกษาปีที่ 1','elementary',1,1,'2025-12-19 14:11:49'),(2,'P2','ประถมศึกษาปีที่ 2','elementary',2,2,'2025-12-19 14:11:49'),(3,'P3','ประถมศึกษาปีที่ 3','elementary',3,3,'2025-12-19 14:11:49'),(4,'P4','ประถมศึกษาปีที่ 4','elementary',4,4,'2025-12-19 14:11:49'),(5,'P5','ประถมศึกษาปีที่ 5','elementary',5,5,'2025-12-19 14:11:49'),(6,'P6','ประถมศึกษาปีที่ 6','elementary',6,6,'2025-12-19 14:11:49'),(7,'M1','มัธยมศึกษาปีที่ 1','secondary',1,7,'2025-12-19 14:11:49'),(8,'M2','มัธยมศึกษาปีที่ 2','secondary',2,8,'2025-12-19 14:11:49'),(9,'M3','มัธยมศึกษาปีที่ 3','secondary',3,9,'2025-12-19 14:11:49'),(10,'M4','มัธยมศึกษาปีที่ 4','secondary',4,10,'2025-12-19 14:11:49'),(11,'M5','มัธยมศึกษาปีที่ 5','secondary',5,11,'2025-12-19 14:11:49'),(12,'M6','มัธยมศึกษาปีที่ 6','secondary',6,12,'2025-12-19 14:11:49');
/*!40000 ALTER TABLE `grade_levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inclusions`
--

DROP TABLE IF EXISTS `inclusions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inclusions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `icon` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inclusions`
--

LOCK TABLES `inclusions` WRITE;
/*!40000 ALTER TABLE `inclusions` DISABLE KEYS */;
INSERT INTO `inclusions` VALUES (1,'TEXTBOOK','ตำรา','ตำราหรือเอกสารประกอบการเรียน',NULL,'2025-12-19 14:11:49'),(2,'BAG','กระเป๋า','กระเป๋าใส่หนังสือ',NULL,'2025-12-19 14:11:49'),(3,'VIDEO_REPLAY','วิดีโอย้อนหลัง','วิดีโอย้อนหลังสำหรับทบทวน',NULL,'2025-12-19 14:11:49'),(4,'FREE_DELIVERY','ส่งตำราฟรีถึงบ้าน','บริการส่งตำราฟรีถึงบ้าน',NULL,'2025-12-19 14:11:49'),(5,'MATERIALS','เอกสารประกอบ','เอกสารประกอบการเรียน',NULL,'2025-12-19 14:11:49');
/*!40000 ALTER TABLE `inclusions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `learning_progress`
--

DROP TABLE IF EXISTS `learning_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learning_progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enrollment_id` int NOT NULL,
  `session_id` int DEFAULT NULL,
  `progress_percentage` decimal(5,2) DEFAULT '0.00',
  `last_accessed_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  KEY `idx_enrollment` (`enrollment_id`),
  CONSTRAINT `learning_progress_ibfk_1` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `learning_progress_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `course_sessions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learning_progress`
--

LOCK TABLES `learning_progress` WRITE;
/*!40000 ALTER TABLE `learning_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `learning_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `learning_rights`
--

DROP TABLE IF EXISTS `learning_rights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learning_rights` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enrollment_id` int NOT NULL,
  `access_type` enum('live','vod','both') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_enrollment` (`enrollment_id`),
  KEY `idx_active` (`is_active`),
  CONSTRAINT `learning_rights_ibfk_1` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learning_rights`
--

LOCK TABLES `learning_rights` WRITE;
/*!40000 ALTER TABLE `learning_rights` DISABLE KEYS */;
INSERT INTO `learning_rights` VALUES (1,1,'live',NULL,1,'2025-12-19 14:56:30'),(2,2,'both',NULL,1,'2025-12-19 14:56:30'),(3,3,'live',NULL,1,'2025-12-19 14:56:30'),(4,4,'both',NULL,1,'2025-12-19 14:56:30'),(5,5,'live',NULL,1,'2025-12-19 14:56:30'),(6,6,'both',NULL,1,'2025-12-19 14:56:30');
/*!40000 ALTER TABLE `learning_rights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_deliveries`
--

DROP TABLE IF EXISTS `material_deliveries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_deliveries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `material_id` int NOT NULL,
  `enrollment_id` int NOT NULL,
  `delivery_method` enum('digital','kerry_express') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tracking_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','preparing','shipped','delivered','failed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `shipping_address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `shipped_at` datetime DEFAULT NULL,
  `delivered_at` datetime DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_material` (`material_id`),
  KEY `idx_enrollment` (`enrollment_id`),
  KEY `idx_status` (`status`),
  KEY `idx_tracking` (`tracking_number`),
  CONSTRAINT `material_deliveries_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE,
  CONSTRAINT `material_deliveries_ibfk_2` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_deliveries`
--

LOCK TABLES `material_deliveries` WRITE;
/*!40000 ALTER TABLE `material_deliveries` DISABLE KEYS */;
/*!40000 ALTER TABLE `material_deliveries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `session_id` int DEFAULT NULL,
  `title` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `file_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_name` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` int DEFAULT NULL,
  `delivery_method` enum('digital','kerry_express','both') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'digital',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  KEY `idx_course` (`course_id`),
  CONSTRAINT `materials_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `materials_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `course_sessions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_reads`
--

DROP TABLE IF EXISTS `notification_reads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_reads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `notification_id` int NOT NULL,
  `user_id` int NOT NULL,
  `read_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_notification_user` (`notification_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notification_reads_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notification_reads_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_reads`
--

LOCK TABLES `notification_reads` WRITE;
/*!40000 ALTER TABLE `notification_reads` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification_reads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `type` enum('course_reminder','payment_success','promotion','admin_broadcast','enrollment_confirmed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_read` tinyint(1) DEFAULT '0',
  `read_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  KEY `branch_id` (`branch_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_unread` (`user_id`,`is_read`),
  KEY `idx_type` (`type`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent_students`
--

DROP TABLE IF EXISTS `parent_students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent_students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int NOT NULL,
  `student_id` int NOT NULL,
  `relationship` enum('father','mother','guardian','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_parent_student` (`parent_id`,`student_id`),
  KEY `idx_parent` (`parent_id`),
  KEY `idx_student` (`student_id`),
  CONSTRAINT `parent_students_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `parent_students_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_students`
--

LOCK TABLES `parent_students` WRITE;
/*!40000 ALTER TABLE `parent_students` DISABLE KEYS */;
INSERT INTO `parent_students` VALUES (1,6,9,'father','2025-12-19 14:56:30'),(2,7,10,'mother','2025-12-19 14:56:30'),(3,8,11,'father','2025-12-19 14:56:30');
/*!40000 ALTER TABLE `parent_students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_gateways`
--

DROP TABLE IF EXISTS `payment_gateways`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_gateways` (
  `id` int NOT NULL AUTO_INCREMENT,
  `payment_method_id` int NOT NULL,
  `gateway_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gateway_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `api_key` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `api_secret` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `merchant_id` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `webhook_secret` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endpoint_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_test_mode` tinyint(1) DEFAULT '1',
  `is_active` tinyint(1) DEFAULT '1',
  `config` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_method_gateway` (`payment_method_id`,`gateway_code`),
  KEY `idx_payment_method` (`payment_method_id`),
  KEY `idx_gateway_code` (`gateway_code`),
  KEY `idx_is_active` (`is_active`),
  CONSTRAINT `payment_gateways_ibfk_1` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_gateways`
--

LOCK TABLES `payment_gateways` WRITE;
/*!40000 ALTER TABLE `payment_gateways` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_gateways` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_items`
--

DROP TABLE IF EXISTS `payment_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `payment_id` int NOT NULL,
  `item_type` enum('course','enrollment') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_id` int NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `payment_id` (`payment_id`),
  CONSTRAINT `payment_items_ibfk_1` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_items`
--

LOCK TABLES `payment_items` WRITE;
/*!40000 ALTER TABLE `payment_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_en` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('bank_transfer','payment_gateway','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `icon` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_default` tinyint(1) DEFAULT '0',
  `display_order` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`),
  KEY `idx_type` (`type`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES (1,'bank_transfer','โอนเงินผ่านธนาคาร','Bank Transfer','bank_transfer','ชำระเงินโดยการโอนเงินผ่านธนาคาร',NULL,1,1,1,'2025-12-21 11:25:36','2025-12-21 11:25:36'),(2,'stripe','ชำระด้วยบัตรเครดิต (Stripe)','Credit Card (Stripe)','payment_gateway','ชำระเงินด้วยบัตรเครดิตผ่าน Stripe',NULL,0,0,2,'2025-12-21 11:25:36','2025-12-21 11:25:36'),(3,'ksher','ชำระผ่าน Ksher','Ksher Payment','payment_gateway','ชำระเงินผ่าน Ksher Thailand',NULL,0,0,3,'2025-12-21 11:25:36','2025-12-21 11:25:36');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `enrollment_id` int DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT '0.00',
  `final_amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'THB',
  `status` enum('pending','paid','failed','refunded') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_method` enum('bank_transfer','online') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'bank_transfer',
  `transaction_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `paid_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_invoice` (`invoice_number`),
  UNIQUE KEY `idx_transaction` (`transaction_id`(191)),
  KEY `enrollment_id` (`enrollment_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_payment_method` (`payment_method`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,9,1,5500.00,0.00,5500.00,'THB','paid','bank_transfer',NULL,'INV-1766130990474-p1kx8rr90','2025-12-19 14:56:30','2025-12-19 14:56:30','2025-12-19 17:10:46'),(2,9,2,2200.00,0.00,2200.00,'THB','paid','bank_transfer',NULL,'INV-1766130990485-xhj7zc3kq','2025-12-19 14:56:30','2025-12-19 14:56:30','2025-12-19 17:10:46'),(3,10,3,3000.00,0.00,3000.00,'THB','paid','bank_transfer',NULL,'INV-1766130990487-cggjm2cev','2025-12-19 14:56:30','2025-12-19 14:56:30','2025-12-19 17:10:46'),(4,10,4,2800.00,0.00,2800.00,'THB','paid','bank_transfer',NULL,'INV-1766130990488-i6yno6htx','2025-12-19 14:56:30','2025-12-19 14:56:30','2025-12-19 17:10:46'),(5,11,5,2800.00,0.00,2800.00,'THB','paid','bank_transfer',NULL,'INV-1766130990490-qt4lkok94','2025-12-19 14:56:30','2025-12-19 14:56:30','2025-12-19 17:10:46'),(6,11,6,4000.00,0.00,4000.00,'THB','paid','bank_transfer',NULL,'INV-1766130990491-hc6s1l6gm','2025-12-19 14:56:30','2025-12-19 14:56:30','2025-12-19 17:10:46');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion_branches`
--

DROP TABLE IF EXISTS `promotion_branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_branches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `promotion_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_promotion_branch` (`promotion_id`,`branch_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `promotion_branches_ibfk_1` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promotion_branches_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_branches`
--

LOCK TABLES `promotion_branches` WRITE;
/*!40000 ALTER TABLE `promotion_branches` DISABLE KEYS */;
/*!40000 ALTER TABLE `promotion_branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion_courses`
--

DROP TABLE IF EXISTS `promotion_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `promotion_id` int NOT NULL,
  `course_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_promotion_course` (`promotion_id`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `promotion_courses_ibfk_1` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promotion_courses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_courses`
--

LOCK TABLES `promotion_courses` WRITE;
/*!40000 ALTER TABLE `promotion_courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `promotion_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion_usage`
--

DROP TABLE IF EXISTS `promotion_usage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_usage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `promotion_id` int NOT NULL,
  `user_id` int NOT NULL,
  `enrollment_id` int DEFAULT NULL,
  `payment_id` int NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `used_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `enrollment_id` (`enrollment_id`),
  KEY `payment_id` (`payment_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_promotion` (`promotion_id`),
  CONSTRAINT `promotion_usage_ibfk_1` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`),
  CONSTRAINT `promotion_usage_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `promotion_usage_ibfk_3` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `promotion_usage_ibfk_4` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_usage`
--

LOCK TABLES `promotion_usage` WRITE;
/*!40000 ALTER TABLE `promotion_usage` DISABLE KEYS */;
/*!40000 ALTER TABLE `promotion_usage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type` enum('percentage','fixed_price') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `usage_limit` int DEFAULT NULL,
  `used_count` int DEFAULT '0',
  `is_stackable` tinyint(1) DEFAULT '0',
  `is_global` tinyint(1) DEFAULT '0',
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`),
  KEY `idx_dates` (`start_date`,`end_date`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_attempts`
--

DROP TABLE IF EXISTS `quiz_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_attempts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quiz_id` int NOT NULL,
  `student_id` int NOT NULL,
  `score` decimal(10,2) DEFAULT '0.00',
  `total_points` int DEFAULT '0',
  `percentage` decimal(5,2) DEFAULT '0.00',
  `answers` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `started_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `time_taken` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_quiz` (`quiz_id`),
  KEY `idx_student` (`student_id`),
  KEY `idx_completed` (`completed_at`),
  CONSTRAINT `quiz_attempts_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quiz_attempts_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_attempts`
--

LOCK TABLES `quiz_attempts` WRITE;
/*!40000 ALTER TABLE `quiz_attempts` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_questions`
--

DROP TABLE IF EXISTS `quiz_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quiz_id` int NOT NULL,
  `question_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `question_type` enum('multiple_choice','true_false','short_answer','essay') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `correct_answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `points` int DEFAULT '1',
  `order_number` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_quiz` (`quiz_id`),
  CONSTRAINT `quiz_questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_questions`
--

LOCK TABLES `quiz_questions` WRITE;
/*!40000 ALTER TABLE `quiz_questions` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quizzes`
--

DROP TABLE IF EXISTS `quizzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quizzes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `session_id` int DEFAULT NULL,
  `title` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `time_limit` int DEFAULT NULL,
  `total_points` int DEFAULT '0',
  `status` enum('draft','published','archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quizzes_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `course_sessions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizzes`
--

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;
/*!40000 ALTER TABLE `quizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_token` (`token`(191)),
  KEY `idx_user_expires` (`user_id`,`expires_at`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjExODg0NSwiZXhwIjoxNzY2NzIzNjQ1fQ.wq8B_HIn3auCaHLS6UGX29Yxw-17qP_FFuzVigQZiwo','2025-12-26 11:34:05','2025-12-19 11:34:05'),(2,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjExODk5MywiZXhwIjoxNzY2NzIzNzkzfQ.rFF2fqsgX9QmNsgl2BaSZcYwaokYCxrqPgjwPomGv0g','2025-12-26 11:36:33','2025-12-19 11:36:33'),(3,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NjExOTAwMSwiZXhwIjoxNzY2NzIzODAxfQ.LDkl8QvF2yKr2gTtHpsvMrk01255pjmDcs_RpM6G5-U','2025-12-26 11:36:41','2025-12-19 11:36:41'),(4,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjEyNDcyOCwiZXhwIjoxNzY2NzI5NTI4fQ.3P0IkyM1K2zc2A0kRooxoFPY22G8wLuFOalayb5ZWuQ','2025-12-26 13:12:08','2025-12-19 13:12:08'),(5,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjEyNTQ2NywiZXhwIjoxNzY2NzMwMjY3fQ.fjrxHCROURWs_uIwjXeMBAM8Cae1Kr52QLjaIOI4s-k','2025-12-26 13:24:27','2025-12-19 13:24:27'),(6,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjEzMTI3MiwiZXhwIjoxNzY2NzM2MDcyfQ.6y60E48G33QJmfoz37IMOiQTaEANsjjF7NLIPbQhupM','2025-12-26 15:01:12','2025-12-19 15:01:12'),(7,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjEzMjMxOSwiZXhwIjoxNzY2NzM3MTE5fQ.WevlN2RNDsgpxqfVCFrnlbH9qIyDg19qrIxAp1Pi1BA','2025-12-26 15:18:39','2025-12-19 15:18:39'),(8,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjEzMjQyMiwiZXhwIjoxNzY2NzM3MjIyfQ.oasRj-wXbHZ2zfxR5SQ_28-maWP9FljcDEkDAyDhqP0','2025-12-26 15:20:22','2025-12-19 15:20:22'),(9,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjEzMjY1MywiZXhwIjoxNzY2NzM3NDUzfQ.5XTKGUntsPRQYHuXSm9e0Yfrq5VhkeSjyM1cZu52FEI','2025-12-26 15:24:13','2025-12-19 15:24:13'),(10,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjEzMzAzMiwiZXhwIjoxNzY2NzM3ODMyfQ.86a5f8fM4O15v5vo-uvXWwdwaq1FFFkIaL3v-Ys7Kdg','2025-12-26 15:30:32','2025-12-19 15:30:32'),(11,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NjEzMzg1OSwiZXhwIjoxNzY2NzM4NjU5fQ.UpOId-C4_4tQ0EFzAO8x2WzcSOucwt5TVZdNjYdgBFg','2025-12-26 15:44:19','2025-12-19 15:44:19'),(12,12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJpYXQiOjE3NjYxMzQyMjcsImV4cCI6MTc2NjczOTAyN30.qZJcJbK60sHqbfV-a7l8aspfOEaHiyi1YUgDimldwTo','2025-12-26 15:50:27','2025-12-19 15:50:27'),(13,12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJpYXQiOjE3NjYxMzQ0NjEsImV4cCI6MTc2NjczOTI2MX0.l_lEB3ig5p3f-ZbsrsjKK5M_3JvZClM0hFBbq9nOTGM','2025-12-26 15:54:21','2025-12-19 15:54:21'),(14,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjEzNDUzOSwiZXhwIjoxNzY2NzM5MzM5fQ.ydCACYEPJUrwl77nL5y-5GcmEUIrIkNEmZ1i_K1QWsc','2025-12-26 15:55:39','2025-12-19 15:55:39'),(15,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjEzNDkyMiwiZXhwIjoxNzY2NzM5NzIyfQ.WFUwx8FQPfNizLdZNcaUCcYbVIirnjHQhrpR0grUad8','2025-12-26 16:02:02','2025-12-19 16:02:02'),(16,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjEzNDkzNywiZXhwIjoxNzY2NzM5NzM3fQ.IvvLcAh-lgT77Voy9QlNhNaJAtUUfY0Yegh4thL5neE','2025-12-26 16:02:17','2025-12-19 16:02:17'),(17,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjEzNDk5NSwiZXhwIjoxNzY2NzM5Nzk1fQ.WBbxUxgVnxBmCX5XmQ7xPfsF8K9Y6s_kuepQ_xgJXJU','2025-12-26 16:03:15','2025-12-19 16:03:15'),(18,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjEzNTAyNSwiZXhwIjoxNzY2NzM5ODI1fQ.-OV5oZp7fcOcTUGFDInLnlOF4vqYaekWpDWcuxFtwHM','2025-12-26 16:03:45','2025-12-19 16:03:45'),(19,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjEzNTA5OSwiZXhwIjoxNzY2NzM5ODk5fQ.iBKIx2CRhC2OAqNUHfnpKC8JZm5Qt5pkjQucaltxgnU','2025-12-26 16:04:59','2025-12-19 16:04:59'),(20,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjEzNTE5NywiZXhwIjoxNzY2NzM5OTk3fQ.v7yl6XXxDBYpKihLlND6f_LXb3PG4SIC--idYrtkcvE','2025-12-26 16:06:37','2025-12-19 16:06:37'),(21,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjEzNTIwNywiZXhwIjoxNzY2NzQwMDA3fQ.ObInHyniGRqJI4BnA45_xkdRFdcA94q4jwIiiZGewVk','2025-12-26 16:06:47','2025-12-19 16:06:47'),(22,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc2NjEzNTI0OSwiZXhwIjoxNzY2NzQwMDQ5fQ.EPOi6s03wxe2b3k1mK4tQjwt-e2rygGrvNKijMJLYaY','2025-12-26 16:07:29','2025-12-19 16:07:29'),(23,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjEzNTMwOSwiZXhwIjoxNzY2NzQwMTA5fQ.T1ohEW38KUa_jRRUHMst2onrF8G2sspWbrlKuqvHLKA','2025-12-26 16:08:29','2025-12-19 16:08:29'),(24,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjEzNTM3NCwiZXhwIjoxNzY2NzQwMTc0fQ.1anX28pd4Rr6ScFwEyk6TzGuhf1sLKcgru16BvHRDtM','2025-12-26 16:09:34','2025-12-19 16:09:34'),(25,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjEzNjMxNiwiZXhwIjoxNzY2NzQxMTE2fQ.61Xa9hoSas541R_-cBvNW3Csoaa3oc98bFGgY03RRdg','2025-12-26 16:25:16','2025-12-19 16:25:16'),(26,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjEzNzcxNSwiZXhwIjoxNzY2NzQyNTE1fQ.0o1WrIqIeLHwV0bNusi7LQ-Nddd6a6VlSDBKcoTXlTA','2025-12-26 16:48:35','2025-12-19 16:48:35'),(27,12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJpYXQiOjE3NjYxMzc4MDksImV4cCI6MTc2Njc0MjYwOX0.Bjp5ul24JdN_5OyYX_nY0PfBIQRDrOWorIJTBrkZCcA','2025-12-26 16:50:09','2025-12-19 16:50:09'),(28,12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJpYXQiOjE3NjYxMzc5NDQsImV4cCI6MTc2Njc0Mjc0NH0.F420rjaeBwbSwBpdoZQg5Pw66XvaQQ4YXbO0Lc10CRQ','2025-12-26 16:52:24','2025-12-19 16:52:24'),(29,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjEzNzk2NywiZXhwIjoxNzY2NzQyNzY3fQ.5ukAymcmOat_qqMKANyjhVxbpJ-t_oTOa6aRhV11THg','2025-12-26 16:52:47','2025-12-19 16:52:47'),(30,12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJpYXQiOjE3NjYxMzg4NTIsImV4cCI6MTc2Njc0MzY1Mn0.T6uc9m7__Yh43i08_kua9-61V_Sl2cdcqYtVIYJxqe8','2025-12-26 17:07:32','2025-12-19 17:07:32'),(31,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2NjE0MDExMCwiZXhwIjoxNzY2NzQ0OTEwfQ.9yd8DG16KHVjYumVdGYbNuM-04nZf1cX9dPSxkYWN4Q','2025-12-26 17:28:30','2025-12-19 17:28:30'),(32,12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJpYXQiOjE3NjYxNDEzODMsImV4cCI6MTc2Njc0NjE4M30.-sjmk-2Ewd1xFWtOdP5PEn_U0_s5Atr6Hsz9lb-vBuA','2025-12-26 17:49:43','2025-12-19 17:49:43'),(33,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjIwODA0MSwiZXhwIjoxNzY2ODEyODQxfQ.IE8Cr2Ez_X39sA_PmHi6b1DnHDBqCY8PXukoJdzzI_A','2025-12-27 12:20:41','2025-12-20 12:20:41'),(34,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjIwODk5MywiZXhwIjoxNzY2ODEzNzkzfQ.VPWO9dzKNjNz2x_90fbOGpfM4Ob17LrhT4qtT4TbTCg','2025-12-27 12:36:33','2025-12-20 12:36:33'),(35,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjIxMDMwMCwiZXhwIjoxNzY2ODE1MTAwfQ.chRyv70dNJufWAF69TNFu-Xi0Q7Wun8H0d9nr9dExVU','2025-12-27 12:58:20','2025-12-20 12:58:20'),(36,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjIxMTMxMCwiZXhwIjoxNzY2ODE2MTEwfQ.MWecXwsVAl9hhW7XkW91JKrwvaUt6TvFT31pzFIilJQ','2025-12-27 13:15:10','2025-12-20 13:15:10'),(37,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjIxMjcwOCwiZXhwIjoxNzY2ODE3NTA4fQ.LWhzzbDcGXBjy06wXBrKt4EX4PW9pDqLMopi9_UAmiA','2025-12-27 13:38:28','2025-12-20 13:38:28'),(38,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjIxMzI2NSwiZXhwIjoxNzY2ODE4MDY1fQ.IELGIDC-_HCxDbuGAaWlVKg8quuwCCdFmHVDi2c9W98','2025-12-27 13:47:45','2025-12-20 13:47:45'),(39,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjIxMzc2OCwiZXhwIjoxNzY2ODE4NTY4fQ.fSSIMCIdn746lOGLFHsNOIB3YCaxA1PZYSpnGi2fiHo','2025-12-27 13:56:08','2025-12-20 13:56:08'),(40,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjIzMzI1MiwiZXhwIjoxNzY2ODM4MDUyfQ.K8fU7cOI4eFsuQGbVtohhb9i53_NUUG-sBY3OgBXpMk','2025-12-27 19:20:52','2025-12-20 19:20:52'),(41,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjIzMzQ3OCwiZXhwIjoxNzY2ODM4Mjc4fQ.UWJ_PB5knd2Vqfo8CIngWXeT93D3VcrT2Zz_9rdItBg','2025-12-27 19:24:38','2025-12-20 19:24:38'),(42,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjIzMzgyOCwiZXhwIjoxNzY2ODM4NjI4fQ.PEARJd46QiyPOuKtkieitWZikY24_EPIiA-GmUpYYh0','2025-12-27 19:30:28','2025-12-20 19:30:28'),(43,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjIzNDg3MCwiZXhwIjoxNzY2ODM5NjcwfQ.dP4qQk5AXyqGwPGoQZDCpCAsHUCBteV98SaVeI2nXiQ','2025-12-27 19:47:50','2025-12-20 19:47:50'),(44,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjIzNTkwNSwiZXhwIjoxNzY2ODQwNzA1fQ.-dhoOZ4AFmOmpfL6V9lB9j7vVDx6TwRVOaSchgURU4I','2025-12-27 20:05:05','2025-12-20 20:05:05'),(45,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjIzNzI2NCwiZXhwIjoxNzY2ODQyMDY0fQ.VKNRj-Ss_oBdIcfCqDXQylng4qKnaYSNKMSwjEwdAJc','2025-12-27 20:27:44','2025-12-20 20:27:44'),(46,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjIzODM4MywiZXhwIjoxNzY2ODQzMTgzfQ.U2_lM_5GU1l1Lvxu0wZeAu2lzcu9YLckDIOwVofbyB0','2025-12-27 20:46:23','2025-12-20 20:46:23'),(47,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjI0MDkzOSwiZXhwIjoxNzY2ODQ1NzM5fQ.CJrVwV1AfajbRLE50Y57YC5pBGRSmEOdUE6GHJ7_uaY','2025-12-27 21:28:59','2025-12-20 21:28:59'),(48,14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE3NjYyODE0NTksImV4cCI6MTc2Njg4NjI1OX0.9wkuFSqAybduFBdhG5Gh2_NXmCI7_8IrK1ImQFr31mU','2025-12-28 08:44:19','2025-12-21 08:44:19'),(49,14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE3NjYyODI4NTgsImV4cCI6MTc2Njg4NzY1OH0.N1W3jAhv6M5f7fbEN6ORSvaYyqCgCpS1wB0NzEjC4Ko','2025-12-28 09:07:38','2025-12-21 09:07:38'),(50,14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE3NjYyODUwNDMsImV4cCI6MTc2Njg4OTg0M30.gqOX-XyM88ydtEXlnVoy4xlpIH8BPXlhMcmS55awa9s','2025-12-28 09:44:03','2025-12-21 09:44:03'),(51,12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJpYXQiOjE3NjYyODU1ODEsImV4cCI6MTc2Njg5MDM4MX0.PrzMDjvX4MjGvYGK5kvay62HgPTFPkyRdEW1YpTdcjw','2025-12-28 09:53:01','2025-12-21 09:53:01'),(52,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjI4NTYwNywiZXhwIjoxNzY2ODkwNDA3fQ.sfpaeFrGJtmIJ4BAXfLX66socmr3X6q_cMPHc_PhIDw','2025-12-28 09:53:27','2025-12-21 09:53:27'),(53,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjI4NzQwNiwiZXhwIjoxNzY2ODkyMjA2fQ.JIC_cKabd0k_yHNqzHm5fjwH5rROAMzUA_I_b7yeEQw','2025-12-28 10:23:26','2025-12-21 10:23:26'),(54,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjI4ODM4OSwiZXhwIjoxNzY2ODkzMTg5fQ.9JCOMUXSkuItZrX_ZqgiTy5QVv_mbax-krqsU4xwZz4','2025-12-28 10:39:49','2025-12-21 10:39:49'),(55,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjI5MDAyNCwiZXhwIjoxNzY2ODk0ODI0fQ.1hGe_y4Ds4ldzlk45tCO1x-6Sy5F9JVID4HmjHHVKhM','2025-12-28 11:07:04','2025-12-21 11:07:04'),(56,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjI5NjUzMywiZXhwIjoxNzY2OTAxMzMzfQ._oL-eWbYe7vlWIdBscE34RJ-mL_oLf27UlXo9DPQYkk','2025-12-28 12:55:33','2025-12-21 12:55:33'),(57,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjMyNDc3MywiZXhwIjoxNzY2OTI5NTczfQ.659v2n3V_AEVK7WtO7I2xbaCsyxGSf5UoYSONJIqZOg','2025-12-28 20:46:13','2025-12-21 20:46:13'),(58,14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE3NjYzMjUyMjcsImV4cCI6MTc2NjkzMDAyN30.9ImhVG_8RvuTdNFFqlidsJFUKP0aB6EbXB3eKBuZYX8','2025-12-28 20:53:47','2025-12-21 20:53:47'),(59,14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE3NjYzMjUyNDgsImV4cCI6MTc2NjkzMDA0OH0.6uMtYThnPS_pOVqVehh6ELS8-6WobpMc45vFnR2MFf8','2025-12-28 20:54:08','2025-12-21 20:54:08'),(60,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjMyNjE2OCwiZXhwIjoxNzY2OTMwOTY4fQ.vgYyXvImOOFZ5C1RzPeDkET7RObykjddmVCY0qwN800','2025-12-28 21:09:28','2025-12-21 21:09:28'),(61,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjMyNjc5NywiZXhwIjoxNzY2OTMxNTk3fQ.8T7x4hfJHGVVzcy9eazgQzoQ_-_NdLZdQ6Yv-xgqfIY','2025-12-28 21:19:57','2025-12-21 21:19:57'),(62,14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE3NjYzMzA0MDYsImV4cCI6MTc2NjkzNTIwNn0.B-0fMVKjoBgPJPtoT8ERD7XAk8nkDJXOOp3dC0pWIAY','2025-12-28 22:20:06','2025-12-21 22:20:06'),(63,14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE3NjYzMzE1ODQsImV4cCI6MTc2NjkzNjM4NH0.dnG4iWs9CNQWW4fXbdxEs8BCbRQ_KqAs4LJ0D9Snz68','2025-12-28 22:39:44','2025-12-21 22:39:44'),(64,14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE3NjYzMzM3NjQsImV4cCI6MTc2NjkzODU2NH0.UNVAmXdTb9xmor98rsjSwxSNsTcx1O-c6OZgjmS2bIo','2025-12-28 23:16:04','2025-12-21 23:16:04'),(65,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NjMzNDAyMSwiZXhwIjoxNzY2OTM4ODIxfQ.7jiuMGemfk1MaSz8ceZFd0eqqxsKIMNZWiAAPnoSgEI','2025-12-28 23:20:21','2025-12-21 23:20:21'),(66,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjMzNDIyOCwiZXhwIjoxNzY2OTM5MDI4fQ.1WSjdnNsGbtHqEe5VZ_0NL8_-zLWfgKMlpNFL3FNhQA','2025-12-28 23:23:48','2025-12-21 23:23:48'),(67,14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE3NjYzMzQyNTQsImV4cCI6MTc2NjkzOTA1NH0.5HvSDTI7H9vNmeTdnE0arSzEvv6slAK_7aVOxvwgUq8','2025-12-28 23:24:14','2025-12-21 23:24:14'),(68,14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE3NjYzMzU5MjksImV4cCI6MTc2Njk0MDcyOX0.2zCk2gumCdT9hNeaEBZHpEWfYa4v4nM43XhxV1OMnL8','2025-12-28 23:52:09','2025-12-21 23:52:09'),(69,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjMzODgxOSwiZXhwIjoxNzY2OTQzNjE5fQ.dRAymQk7iPCQJK_G6HSWucIGr-7dS4dqkNxMcEutDlU','2025-12-29 00:40:19','2025-12-22 00:40:19'),(70,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjM0MDA2NywiZXhwIjoxNzY2OTQ0ODY3fQ.oxx1YB4STBF5Puw4aZTZCqtA7OvA-bRTwJJ22gtNEjI','2025-12-29 01:01:07','2025-12-22 01:01:07'),(71,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjM0MDM4OCwiZXhwIjoxNzY2OTQ1MTg4fQ.sozRtTr9oDl0LWZpjYx1TJyzv8rXIVvZuEC2luYNZE4','2025-12-29 01:06:28','2025-12-22 01:06:28'),(72,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjM0MTAwMiwiZXhwIjoxNzY2OTQ1ODAyfQ.s3LtWIHYMeJkbumEeA4EZpY5Y4cCwdMMyp2gnbaQb1k','2025-12-29 01:16:42','2025-12-22 01:16:42'),(73,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjM0MTY5NCwiZXhwIjoxNzY2OTQ2NDk0fQ.jSwntHtWXL6F6d83i0pERML88ZngKT6raQnyOtvAfD8','2025-12-29 01:28:14','2025-12-22 01:28:14'),(74,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjM3MTEwNywiZXhwIjoxNzY2OTc1OTA3fQ.NZt41sM12z1EqzWiILREmCaAq7Y_2Lfx4eIPoDbu2Lk','2025-12-29 09:38:27','2025-12-22 09:38:27'),(75,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjM3MTQ2MCwiZXhwIjoxNzY2OTc2MjYwfQ.x6BV2lmzz-e0hnKX3tRY4vUO8Fi4FeefSHWy5uWAjkM','2025-12-29 09:44:20','2025-12-22 09:44:20'),(76,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjM3NDYzNiwiZXhwIjoxNzY2OTc5NDM2fQ.4Kowy4AIFsC4NOQ_r7S6QEduxV3aUxalynvM3Rc2Jdo','2025-12-29 10:37:16','2025-12-22 10:37:16'),(77,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjM3NDc1OCwiZXhwIjoxNzY2OTc5NTU4fQ.C2-Ggnht_TTRNeEjJ2hEexSXLKVItVqDcuVVQzHYCEs','2025-12-29 10:39:18','2025-12-22 10:39:18'),(78,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjM3NTU3OSwiZXhwIjoxNzY2OTgwMzc5fQ.IzqOD7QMwmy2-bIOBv-D3k20tgPd2wQoxD3w-30d6ls','2025-12-29 10:52:59','2025-12-22 10:52:59'),(79,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjM3NTc4MCwiZXhwIjoxNzY2OTgwNTgwfQ.akn9pHRRPtOQcGPkNT0vuTJy_Ux_bhKrlltvy72QtCo','2025-12-29 10:56:20','2025-12-22 10:56:20'),(80,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjM3NjY2OSwiZXhwIjoxNzY2OTgxNDY5fQ.m6Wc5TdtwXMM1RbQnidBP4q4osgEIp_7RFiz8YA5ZJQ','2025-12-29 11:11:09','2025-12-22 11:11:09'),(81,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjM3NjcwNCwiZXhwIjoxNzY2OTgxNTA0fQ.2LPOW8thqzi2XO6LwheiA9ft3tZvBMLtieC6NtqTKZ8','2025-12-29 11:11:44','2025-12-22 11:11:44'),(82,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjM4MjM3MSwiZXhwIjoxNzY2OTg3MTcxfQ.0vNMhlHSGug0TVsygaUVC9Ge29_LFlGN9mIESNYR3GU','2025-12-29 12:46:11','2025-12-22 12:46:11'),(83,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjM4MjQwNSwiZXhwIjoxNzY2OTg3MjA1fQ.sRC6hSWEiYiFDrkLQ-NrMOvjkV86MrFM_yRYrXS2g6M','2025-12-29 12:46:45','2025-12-22 12:46:45'),(84,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjM4MzYzNCwiZXhwIjoxNzY2OTg4NDM0fQ.4_Ez2OxXOVPhYDDqRSlaxpRQEm_tiSZDXV8OpS5azJM','2025-12-29 13:07:14','2025-12-22 13:07:14'),(85,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjM4MzY5MCwiZXhwIjoxNzY2OTg4NDkwfQ.1dyEb_2_RSYZ42dsBVwR61nhkPrSFegIaZqknYF55PY','2025-12-29 13:08:10','2025-12-22 13:08:10'),(86,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjM4NDg1MCwiZXhwIjoxNzY2OTg5NjUwfQ.UN_NZPgmTVrTtkA8naucg9Xw1Wrw__jTHbTIu8ZfNEc','2025-12-29 13:27:30','2025-12-22 13:27:30'),(87,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjM4NDg4NiwiZXhwIjoxNzY2OTg5Njg2fQ.zfFDO-Lri9IlJaHGL8gcY4YftGU_yeDZICvtJbiMIV0','2025-12-29 13:28:06','2025-12-22 13:28:06'),(88,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjQxMDUxMywiZXhwIjoxNzY3MDE1MzEzfQ.tjgAgEqUdUJUsPrRR6qiZdtoiR6hjKgJGhX9LUUoxVI','2025-12-29 20:35:14','2025-12-22 20:35:13'),(89,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjQxMjc1NiwiZXhwIjoxNzY3MDE3NTU2fQ.EhAJBlVpWmV5DHraqi8WA3GZrsFEKYCgkS3BVZqfvZk','2025-12-29 21:12:37','2025-12-22 21:12:36'),(90,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjQxMjc4MywiZXhwIjoxNzY3MDE3NTgzfQ.zVY296hjdu9SJQ_0r3NETJNbQ7cPwWe8aGDQroSxy2g','2025-12-29 21:13:04','2025-12-22 21:13:03'),(91,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjQxMjc4OCwiZXhwIjoxNzY3MDE3NTg4fQ.oEFY4SpXEL4rq_G54--XTjr8Qe7LA555PuW6MX1tKas','2025-12-29 21:13:08','2025-12-22 21:13:08'),(92,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjQxMjc5NCwiZXhwIjoxNzY3MDE3NTk0fQ.bqc2XlQfNL6jcATwV_ctGy4lDWagjr44lZYcJmgUxWE','2025-12-29 21:13:15','2025-12-22 21:13:14'),(93,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjQxMzg3OCwiZXhwIjoxNzY3MDE4Njc4fQ.zp09vWyJlW1ZHq7Kb4lPo4ZCb6Vm_5oikBzOJVBQ2So','2025-12-29 21:31:18','2025-12-22 21:31:18'),(94,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjQxNTA5NSwiZXhwIjoxNzY3MDE5ODk1fQ.LM6qGmPrmIrQJeOkr7oyDk0XOAoQPCu2CFBlagpTeEo','2025-12-29 21:51:36','2025-12-22 21:51:35'),(95,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjQxNTExNSwiZXhwIjoxNzY3MDE5OTE1fQ.BUmimxYLS22ojf54AlWR-XIrzpNgo945oIJYbxlD6PY','2025-12-29 21:51:56','2025-12-22 21:51:55'),(96,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjQxNTk3NCwiZXhwIjoxNzY3MDIwNzc0fQ.xSnANfWP6Wn67nNhdHnWeCglBDcFEIXC-smIZ2bdw14','2025-12-29 22:06:14','2025-12-22 22:06:14'),(97,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjQxNjAyOSwiZXhwIjoxNzY3MDIwODI5fQ.qOJ0tUxTdeQte1uTyEuATOJVqWEOC1UsKPFgSanB0bI','2025-12-29 22:07:10','2025-12-22 22:07:09'),(98,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjQxNzQyMSwiZXhwIjoxNzY3MDIyMjIxfQ.vFJHqg1FoiogMwrNs2j5MVp-PSgvHxoS7AqxnTQYdB4','2025-12-29 22:30:21','2025-12-22 22:30:21'),(99,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjQxNzQzMCwiZXhwIjoxNzY3MDIyMjMwfQ.PiP3LnFFEN5cnq3Dog0MM330pl011_mFW9pb3hz1eRQ','2025-12-29 22:30:30','2025-12-22 22:30:30'),(100,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjQxNzQ3OSwiZXhwIjoxNzY3MDIyMjc5fQ.177QAkxh-kUsO5iTdS49TtDxjOfJHTjqrlJXDyy09Jk','2025-12-29 22:31:19','2025-12-22 22:31:19'),(101,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjQxNzY5OSwiZXhwIjoxNzY3MDIyNDk5fQ.F00x_eIK-Fot49JUNcqtyfGleSi37nfeXuDZ0vIg1Xo','2025-12-29 22:34:59','2025-12-22 22:34:59'),(102,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjQxNzk2NSwiZXhwIjoxNzY3MDIyNzY1fQ.E9z5XVuCsNMztZX5uHCQ8c4h-ZexYynTVDtkpBB2EmY','2025-12-29 22:39:26','2025-12-22 22:39:25'),(103,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjQxODYyOSwiZXhwIjoxNzY3MDIzNDI5fQ.6EeeMaqkCzlTb2a-9aUyWcXVNyuF6ECXDDlbFKjtDho','2025-12-29 22:50:30','2025-12-22 22:50:29'),(104,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjQxODk1NSwiZXhwIjoxNzY3MDIzNzU1fQ.XBqLQPzZ7b0vD4BO4M53G8lBGiilz4usGAE4gYtowTk','2025-12-29 22:55:55','2025-12-22 22:55:55'),(105,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjQxOTcxOSwiZXhwIjoxNzY3MDI0NTE5fQ.M18ni7IO4_NeoTSPjWs_MgnvDQH8OsArjpoJpZwUqQM','2025-12-29 23:08:40','2025-12-22 23:08:39'),(106,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjQxOTczNCwiZXhwIjoxNzY3MDI0NTM0fQ.7XaKXaMFxTvrdrlKNX5xAnqOqpsTe5_DWP0gAS5wulA','2025-12-29 23:08:54','2025-12-22 23:08:54'),(107,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjQyMDc5MSwiZXhwIjoxNzY3MDI1NTkxfQ.UUzHak3qBBGwN_XRuXb4DGeNDxO5bTxl0ut2DnfgKw4','2025-12-29 23:26:31','2025-12-22 23:26:31'),(108,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjQyMDgwNCwiZXhwIjoxNzY3MDI1NjA0fQ.NWxZXwdVHP9J5wgoJNrEw5ZtJXh7Oxy-5qEsWqlSEZo','2025-12-29 23:26:44','2025-12-22 23:26:44'),(109,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjQyMTc2MCwiZXhwIjoxNzY3MDI2NTYwfQ.78UeJGdp0VkxaUQ2lnxv4pVJaXrGIRp1UUeXfHrlCrk','2025-12-29 23:42:40','2025-12-22 23:42:40'),(110,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjQyMTc2NywiZXhwIjoxNzY3MDI2NTY3fQ.NU1dxECxFXp4jcPOZ0MXoJ2Lo08Vw5lIBELXZMRz1zo','2025-12-29 23:42:48','2025-12-22 23:42:47'),(111,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjQyMjc0NywiZXhwIjoxNzY3MDI3NTQ3fQ.yOCb0FtZbn5ePbA9G7nNrogizpXV-TZAnvahW8r6Xlg','2025-12-29 23:59:08','2025-12-22 23:59:07'),(112,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjQyMjc2MiwiZXhwIjoxNzY3MDI3NTYyfQ.1geijBd2cEZtUXAcOQFfMZU3sLvnf4OVPCtJLKR1jN4','2025-12-29 23:59:23','2025-12-22 23:59:22'),(113,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjQyMzY2MCwiZXhwIjoxNzY3MDI4NDYwfQ.QPl3tPmWKs4VKhSqCYAQCMFMHEuvKi8hlXssheUUYrQ','2025-12-30 00:14:20','2025-12-23 00:14:20'),(114,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjQyMzc0NCwiZXhwIjoxNzY3MDI4NTQ0fQ.va4NRzBCAWwhUSQgqWO4Ge8hXXe61xYzUDuvtzchJic','2025-12-30 00:15:44','2025-12-23 00:15:44'),(115,10,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJpYXQiOjE3NjY0MjM5MjcsImV4cCI6MTc2NzAyODcyN30.TLXoLd_fn2cSfnjdf9pKClVP_hnrwHr89-qjfRPVGwg','2025-12-30 00:18:48','2025-12-23 00:18:47'),(116,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjQyNDkwMywiZXhwIjoxNzY3MDI5NzAzfQ.y0T1X_ZKEXC62ooN-owB4GrgYFnyF27UALI90FPCfBA','2025-12-30 00:35:04','2025-12-23 00:35:03'),(117,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc2NjQyNTU4NCwiZXhwIjoxNzY3MDMwMzg0fQ.MQlbrtQr8rtkT-vXU2HqW9bXwB4AYhKPnv7-g4x8dac','2025-12-30 00:46:25','2025-12-23 00:46:24'),(118,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc2NjQyNjEyNSwiZXhwIjoxNzY3MDMwOTI1fQ.mJWdns5xp73r1NfQUAwzud94hScEAGIYq8gYzaK0j9s','2025-12-30 00:55:26','2025-12-23 00:55:25');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'student','Student role','2025-12-19 11:03:06'),(2,'tutor','Tutor role','2025-12-19 11:03:06'),(3,'parent','Parent role','2025-12-19 11:03:06'),(4,'branch_admin','Branch administrator role','2025-12-19 11:03:06'),(5,'system_admin','System administrator role','2025-12-19 11:03:06'),(6,'owner','Owner role','2025-12-19 11:03:06'),(7,'admin','Admin กลาง - สามารถจัดการได้ทั้ง 2 สาขา','2025-12-21 08:41:08');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `short_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `icon` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,'MATH','คณิตศาสตร์','คณิต',NULL,NULL,'2025-12-19 14:11:49'),(2,'SCIENCE','วิทยาศาสตร์','วิทย์',NULL,NULL,'2025-12-19 14:11:49'),(3,'ENGLISH','ภาษาอังกฤษ','อังกฤษ',NULL,NULL,'2025-12-19 14:11:49'),(4,'THAI','ภาษาไทย','ไทย',NULL,NULL,'2025-12-19 14:11:49'),(5,'SOCIAL','สังคมศึกษา','สังคม',NULL,NULL,'2025-12-19 14:11:49'),(6,'PHYSICS','ฟิสิกส์','ฟิสิกส์',NULL,NULL,'2025-12-19 14:11:49'),(7,'CHEMISTRY','เคมี','เคมี',NULL,NULL,'2025-12-19 14:11:49'),(8,'BIOLOGY','ชีววิทยา','ชีวะ',NULL,NULL,'2025-12-19 14:11:49');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_settings`
--

DROP TABLE IF EXISTS `system_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type` enum('string','number','boolean','json') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'string',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_public` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`),
  KEY `idx_key` (`key`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_settings`
--

LOCK TABLES `system_settings` WRITE;
/*!40000 ALTER TABLE `system_settings` DISABLE KEYS */;
INSERT INTO `system_settings` VALUES (1,'app_name','KDC Tutor School','string','general','ชื่อแอปพลิเคชัน',1,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(2,'app_version','1.0.0','string','general','เวอร์ชัน',1,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(3,'logo_url','','string','general','URL โลโก้',1,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(4,'favicon_url','','string','general','URL Favicon',1,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(5,'contact_email','','string','general','อีเมลติดต่อ',1,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(6,'contact_phone','','string','general','เบอร์โทรศัพท์ติดต่อ',1,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(7,'address','','string','general','ที่อยู่',1,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(8,'timezone','Asia/Bangkok','string','timezone','Timezone',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(9,'date_format','DD/MM/YYYY','string','timezone','รูปแบบวันที่',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(10,'time_format','24-hour','string','timezone','รูปแบบเวลา (24-hour หรือ 12-hour)',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(11,'maintenance_mode','false','boolean','maintenance','เปิด/ปิด Maintenance Mode',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(12,'maintenance_message','ระบบกำลังบำรุงรักษา กรุณาลองใหม่อีกครั้งในภายหลัง','string','maintenance','ข้อความ Maintenance',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(13,'maintenance_allowed_ips','[]','json','maintenance','IP ที่สามารถเข้าถึงได้ระหว่าง Maintenance (JSON array)',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(14,'session_timeout','120','number','security','Session timeout (นาที)',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(15,'password_min_length','8','number','security','ความยาวรหัสผ่านขั้นต่ำ',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(16,'password_require_special','false','boolean','security','รหัสผ่านต้องมีตัวอักษรพิเศษ',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(17,'password_require_uppercase','false','boolean','security','รหัสผ่านต้องมีตัวพิมพ์ใหญ่',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(18,'password_require_lowercase','false','boolean','security','รหัสผ่านต้องมีตัวพิมพ์เล็ก',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(19,'password_require_number','false','boolean','security','รหัสผ่านต้องมีตัวเลข',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(20,'login_attempts_limit','5','number','security','จำนวนครั้งที่พยายาม login ได้',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(21,'login_lockout_duration','15','number','security','ระยะเวลาที่ถูก lock (นาที)',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(22,'two_factor_auth_enabled','false','boolean','security','เปิดใช้งาน 2FA สำหรับ admin',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(23,'max_file_size','10','number','file_upload','ขนาดไฟล์สูงสุด (MB)',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(24,'allowed_file_types','jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx','string','file_upload','ประเภทไฟล์ที่อนุญาต (คั่นด้วย comma)',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(25,'storage_type','local','string','file_upload','ประเภท storage (local, s3, etc.)',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(26,'email_notifications_enabled','true','boolean','notification','เปิดใช้งานการแจ้งเตือนทางอีเมล',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(27,'sms_notifications_enabled','false','boolean','notification','เปิดใช้งานการแจ้งเตือนทาง SMS',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(28,'course_reminder_before_minutes','60','number','notification','แจ้งเตือนก่อนคอร์สเริ่ม (นาที)',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(29,'payment_reminder_before_days','3','number','notification','แจ้งเตือนก่อนวันชำระเงิน (วัน)',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(30,'default_language','th','string','language','ภาษาหลัก',1,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(31,'supported_languages','th,en','string','language','ภาษาที่รองรับ (คั่นด้วย comma)',1,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(32,'items_per_page','20','number','display','จำนวนรายการต่อหน้า',0,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(33,'theme_mode','light','string','display','Theme mode (light, dark, auto)',1,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(34,'primary_color','#10b981','string','display','Primary color (hex)',1,'2025-12-21 10:59:39','2025-12-21 10:59:39'),(35,'secondary_color','#2563eb','string','display','Secondary color (hex)',1,'2025-12-21 10:59:39','2025-12-21 10:59:39');
/*!40000 ALTER TABLE `system_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testimonials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int NOT NULL,
  `avatar_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `display_order` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_rating` (`rating`),
  KEY `idx_display_order` (`display_order`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` VALUES (1,'คุณสมใจ','ผู้ปกครองของน้องน้ำ','ลูกเรียนแล้วเข้าใจมากขึ้น ผลการเรียนดีขึ้นมาก คุณครูสอนดีมาก มีเทคนิคที่ทำให้เด็กเข้าใจง่าย ลูกชอบเรียนที่นี่มาก',5,NULL,'approved',1,'2025-12-21 23:27:19','2025-12-21 23:27:19'),(2,'คุณวราภรณ์','ผู้ปกครองของน้องเจมส์','ระบบเรียนออนไลน์สะดวกมาก ลูกสามารถเรียนได้ทุกที่ และเรียนซ้ำได้ตลอด ช่วยประหยัดเวลาเดินทาง และลูกสามารถเรียนได้ทุกเวลา',5,NULL,'approved',2,'2025-12-21 23:27:19','2025-12-21 23:27:19'),(3,'น้องน้ำ','นักเรียนชั้น ม.3','คุณครูสอนสนุก เข้าใจง่าย และมีแบบฝึกหัดให้ทำเยอะมาก เรียนแล้วไม่เครียด และได้ความรู้เต็มที่ ชอบวิธีการสอนของอาจารย์มากๆ',5,NULL,'approved',3,'2025-12-21 23:27:19','2025-12-21 23:27:19');
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tutor_branches`
--

DROP TABLE IF EXISTS `tutor_branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tutor_branches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tutor_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `assigned_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_tutor_branch` (`tutor_id`,`branch_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `tutor_branches_ibfk_1` FOREIGN KEY (`tutor_id`) REFERENCES `tutors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tutor_branches_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tutor_branches`
--

LOCK TABLES `tutor_branches` WRITE;
/*!40000 ALTER TABLE `tutor_branches` DISABLE KEYS */;
INSERT INTO `tutor_branches` VALUES (1,1,1,'2025-12-19 14:56:30'),(2,2,1,'2025-12-19 14:56:30'),(3,3,2,'2025-12-19 14:56:30');
/*!40000 ALTER TABLE `tutor_branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tutor_courses`
--

DROP TABLE IF EXISTS `tutor_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tutor_courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tutor_id` int NOT NULL,
  `course_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `assigned_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_tutor_course_branch` (`tutor_id`,`course_id`,`branch_id`),
  KEY `course_id` (`course_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `tutor_courses_ibfk_1` FOREIGN KEY (`tutor_id`) REFERENCES `tutors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tutor_courses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tutor_courses_ibfk_3` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tutor_courses`
--

LOCK TABLES `tutor_courses` WRITE;
/*!40000 ALTER TABLE `tutor_courses` DISABLE KEYS */;
INSERT INTO `tutor_courses` VALUES (1,1,1,1,'2025-12-19 14:56:30'),(2,1,2,1,'2025-12-19 14:56:30'),(3,2,3,1,'2025-12-19 14:56:30'),(4,2,4,1,'2025-12-19 14:56:30'),(5,3,7,2,'2025-12-19 14:56:30'),(6,3,8,2,'2025-12-19 14:56:30');
/*!40000 ALTER TABLE `tutor_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tutors`
--

DROP TABLE IF EXISTS `tutors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tutors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `expertise` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `tutors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tutors`
--

LOCK TABLES `tutors` WRITE;
/*!40000 ALTER TABLE `tutors` DISABLE KEYS */;
INSERT INTO `tutors` VALUES (1,3,'อาจารย์ผู้เชี่ยวชาญด้านคณิตศาสตร์และวิทยาศาสตร์','คณิตศาสตร์, วิทยาศาสตร์',NULL,'active','2025-12-19 14:56:30','2025-12-19 14:56:30'),(2,4,'อาจารย์ผู้เชี่ยวชาญด้านภาษาอังกฤษและภาษาไทย','ภาษาอังกฤษ, ภาษาไทย',NULL,'active','2025-12-19 14:56:30','2025-12-19 14:56:30'),(3,5,'อาจารย์ผู้เชี่ยวชาญด้านคณิตศาสตร์และวิทยาศาสตร์ (สระบุรี)','คณิตศาสตร์, วิทยาศาสตร์, ภาษาอังกฤษ',NULL,'active','2025-12-19 14:56:30','2025-12-19 14:56:30');
/*!40000 ALTER TABLE `tutors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_role` (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,1,5,'2025-12-19 11:05:59'),(2,2,6,'2025-12-19 11:06:28'),(3,3,2,'2025-12-19 14:56:28'),(4,4,2,'2025-12-19 14:56:28'),(5,5,2,'2025-12-19 14:56:29'),(6,6,3,'2025-12-19 14:56:29'),(7,7,3,'2025-12-19 14:56:29'),(8,8,3,'2025-12-19 14:56:29'),(9,9,1,'2025-12-19 14:56:30'),(10,10,1,'2025-12-19 14:56:30'),(11,11,1,'2025-12-19 14:56:30'),(12,12,4,'2025-12-19 15:50:04'),(13,13,4,'2025-12-19 15:50:04'),(14,14,7,'2025-12-21 08:43:26');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive','suspended') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `email_verified_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_username` (`username`),
  UNIQUE KEY `idx_email` (`email`(191)),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@kdcschool.com','admin','$2a$12$V.lk1MxjUVbTE62PpVJYaeRRs9UJ6MbJvL7t/yOr/zCK4EVo586fe','System','Administrator','0812345678',NULL,'active','2025-12-19 11:05:59','2025-12-19 11:05:59','2025-12-19 14:56:02'),(2,'owner@kdcschool.com','owner','$2a$12$AQygIX/oyEM/J/HGSacYruOLfOJbP1kf3VMI1L1GTKm1MdrAa3.ke','Owner','KDC School','0812345679',NULL,'active','2025-12-19 11:06:28','2025-12-19 11:06:28','2025-12-19 14:56:02'),(3,'tutor1@kdcschool.com','tutor1','$2a$12$21VfIrEMOfIqIGUBdjmxUO1QYfq9i0mu2ZVApjidPYvlE1TsfS6ge','อาจารย์','สมชาย ใจดี','0812345678',NULL,'active',NULL,'2025-12-19 14:56:28','2025-12-19 14:56:28'),(4,'tutor2@kdcschool.com','tutor2','$2a$12$Q4mSupcU.Y1ujkKWwOpzSO66W7Y9t19e3dn8HMErcTWOYgMirj3du','อาจารย์','สมหญิง รักสอน','0812345679',NULL,'active',NULL,'2025-12-19 14:56:28','2025-12-19 14:56:28'),(5,'tutor3@kdcschool.com','tutor3','$2a$12$El3d7SfHbGdflSo.dfFlZOxJdqkBQFuKXyu2MaKkGuG1FLggz0m6i','อาจารย์','วิชัย เก่งสอน','0812345680',NULL,'active',NULL,'2025-12-19 14:56:29','2025-12-19 14:56:29'),(6,'parent1@example.com','parent1','$2a$12$sNK/G/B8s.M36qJmHDzRJ.ZHsV2pSf/b0jEzN0v87uCuANHpv9bim','คุณพ่อ','สมชาย ใจดี','0823456789',NULL,'active',NULL,'2025-12-19 14:56:29','2025-12-19 14:56:29'),(7,'parent2@example.com','parent2','$2a$12$/WDy/21IMo3YNlvBoJ77oOXnl5fjoEcSLli7wHkArnHq2fnNq2j9G','คุณแม่','สมหญิง รักเรียน','0823456790',NULL,'active',NULL,'2025-12-19 14:56:29','2025-12-19 14:56:29'),(8,'parent3@example.com','parent3','$2a$12$sNDkd6MQ2AXkzZ3/V83D.OFyZGETnqBWj2JOpbNHDDZhGNqcoJOYe','คุณพ่อ','วิชัย เก่งเรียน','0823456791',NULL,'active',NULL,'2025-12-19 14:56:29','2025-12-19 14:56:29'),(9,NULL,'student1_parent1','$2a$12$Jt6LP0bwinZu3Z1953lxyOypd3/CqxfvNRRhaP4rFaUJJVVwJl28y','เด็กชาย','สมชาย ใจดี',NULL,NULL,'active',NULL,'2025-12-19 14:56:30','2025-12-20 12:58:35'),(10,NULL,'student2_parent2','$2a$12$APCA0WK0YE2bZ7aRBUqDsOAl/cm88TVSRWKncJU73I.GY3W5FxhlW','เด็กหญิง','สมหญิง รักเรียน',NULL,NULL,'active',NULL,'2025-12-19 14:56:30','2025-12-19 14:56:30'),(11,NULL,'student3_parent3','$2a$12$NkbbWcWbs7lsn/ZZSwlh3.MdAn1U9mcBXWPYhhoO17pbKjI2FVY7q','เด็กชาย','วิชัย เก่งเรียน',NULL,NULL,'active',NULL,'2025-12-19 14:56:30','2025-12-19 14:56:30'),(12,'branch_admin_fashion@kdcschool.com','branch_admin_fashion','$2a$12$ipNIgFKbjOC8K6azQWKgs.vESQnQXke71XC33x1zNoTRLqvw7XPfu','Branch','Admin Fashion',NULL,NULL,'active',NULL,'2025-12-19 15:50:04','2025-12-19 15:50:04'),(13,'branch_admin_saraburi@kdcschool.com','branch_admin_saraburi','$2a$12$da8PKOtxQ8MzTJa/turG5eglI93jChAZRGxxRrHUiphu7XRdexOk6','Branch','Admin Saraburi',NULL,NULL,'active',NULL,'2025-12-19 15:50:04','2025-12-19 15:50:04'),(14,'admincenter@kdcschool.com','admincenter','$2a$12$Eb5EYN22KI8H1UKPjtAr/eoiuofSWw2IH3VCRksIf6bh4B5eE4DcS','Admin','กลาง','0812345680',NULL,'active','2025-12-21 08:43:26','2025-12-21 08:43:26','2025-12-21 08:43:26');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-23  1:13:10
