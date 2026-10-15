-- ============================================================================
-- Madani Community Center - MySQL Database Schema
-- Version: 2.0 (Security Hardened & UK GDPR Aligned)
-- Designed for: Apache / PHP 8.1+ / MySQL 8.0+ / MariaDB 10.4+ / IONOS Hosting
-- ============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;

-- 1. ADMINISTRATORS TABLE
-- Stores administrative user accounts with password hashes and rate limit tracking.
CREATE TABLE IF NOT EXISTS `administrators` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `role` ENUM('superadmin', 'manager', 'coordinator') NOT NULL DEFAULT 'coordinator',
  `totp_secret` VARCHAR(64) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `failed_login_attempts` INT UNSIGNED NOT NULL DEFAULT 0,
  `lockout_until` DATETIME DEFAULT NULL,
  `last_login_at` DATETIME DEFAULT NULL,
  `last_login_ip` VARCHAR(45) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_admin_email` (`email`),
  INDEX `idx_admin_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. FACILITIES TABLE
-- Stores community center rooms, event halls, capacities, and hourly pricing.
CREATE TABLE IF NOT EXISTS `facilities` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `category` VARCHAR(50) NOT NULL,
  `capacity` INT UNSIGNED NOT NULL,
  `hourly_rate` DECIMAL(8, 2) NOT NULL,
  `weekend_rate` DECIMAL(8, 2) NOT NULL,
  `deposit_required` DECIMAL(8, 2) NOT NULL DEFAULT 50.00,
  `description` TEXT NOT NULL,
  `features_json` TEXT DEFAULT NULL,
  `equipment_json` TEXT DEFAULT NULL,
  `dimensions` VARCHAR(50) DEFAULT NULL,
  `placeholder_key` VARCHAR(50) DEFAULT 'venue-hall',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_facility_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. CUSTOMERS TABLE
-- Stores customer contact information separately for data minimisation and GDPR indexing.
CREATE TABLE IF NOT EXISTS `customers` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `organisation` VARCHAR(150) DEFAULT NULL,
  `is_anonymized` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_cust_email` (`email`),
  INDEX `idx_cust_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BOOKINGS TABLE
-- Stores all public requests, times, status lifecycle, and financial calculations.
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `reference` VARCHAR(25) NOT NULL UNIQUE,
  `facility_id` VARCHAR(50) NOT NULL,
  `customer_id` INT UNSIGNED NOT NULL,
  `event_type` VARCHAR(100) NOT NULL,
  `attendees` INT UNSIGNED NOT NULL,
  `booking_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `finish_time` TIME NOT NULL,
  `duration_hours` DECIMAL(4, 2) NOT NULL,
  `hourly_rate` DECIMAL(8, 2) NOT NULL,
  `total_cost` DECIMAL(10, 2) NOT NULL,
  `needs_kitchen` TINYINT(1) NOT NULL DEFAULT 0,
  `layout_preference` VARCHAR(100) DEFAULT NULL,
  `additional_requirements` TEXT DEFAULT NULL,
  `status` ENUM('pending', 'confirmed', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending',
  `rejection_reason` TEXT DEFAULT NULL,
  `internal_notes` TEXT DEFAULT NULL,
  `terms_accepted` TINYINT(1) NOT NULL DEFAULT 0,
  `privacy_accepted` TINYINT(1) NOT NULL DEFAULT 0,
  `ip_address` VARCHAR(45) NOT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_booking_facility` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_booking_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `idx_bkg_date` (`booking_date`),
  INDEX `idx_bkg_status` (`status`),
  INDEX `idx_bkg_facility_date` (`facility_id`, `booking_date`),
  INDEX `idx_bkg_reference` (`reference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BLOCKED DATES TABLE
-- Allows administrators to blackout specific facilities or whole building for holidays or maintenance.
CREATE TABLE IF NOT EXISTS `blocked_dates` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `facility_id` VARCHAR(50) NOT NULL DEFAULT 'all', -- 'all' or specific facility
  `blocked_date` DATE NOT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `created_by` VARCHAR(100) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_blocked_date` (`blocked_date`),
  INDEX `idx_blocked_facility` (`facility_id`, `blocked_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. AUDIT LOGS TABLE
-- Immutable security log recording all state changes, administrative actions, and logins.
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `admin_user` VARCHAR(100) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `target_type` VARCHAR(50) NOT NULL,
  `target_id` VARCHAR(100) DEFAULT NULL,
  `details` TEXT NOT NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_audit_created` (`created_at`),
  INDEX `idx_audit_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. LOGIN RATE LIMITS TABLE
-- Protects against brute-force password guessing attacks without easy permanent lockouts.
CREATE TABLE IF NOT EXISTS `rate_limits` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `ip_address` VARCHAR(45) NOT NULL,
  `action_key` VARCHAR(50) NOT NULL,
  `attempt_count` INT UNSIGNED NOT NULL DEFAULT 1,
  `last_attempt_at` DATETIME NOT NULL,
  `blocked_until` DATETIME DEFAULT NULL,
  UNIQUE KEY `uk_ip_action` (`ip_address`, `action_key`),
  INDEX `idx_rate_blocked` (`blocked_until`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. PASSWORD RESETS TABLE
-- Stores single-use, cryptographically secure password reset tokens.
CREATE TABLE IF NOT EXISTS `password_resets` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT UNSIGNED NOT NULL,
  `token_hash` VARCHAR(64) NOT NULL UNIQUE,
  `expires_at` DATETIME NOT NULL,
  `used_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pwd_admin` FOREIGN KEY (`admin_id`) REFERENCES `administrators` (`id`) ON DELETE CASCADE,
  INDEX `idx_reset_token` (`token_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET foreign_key_checks = 1;

-- ============================================================================
-- SEED DATA
-- Default Facilities & Administrator Account
-- Default password: 'MadaniAdmin2026!' (Hashed with PHP PASSWORD_BCRYPT)
-- ============================================================================

INSERT INTO `administrators` (`username`, `email`, `password_hash`, `full_name`, `role`, `is_active`)
VALUES (
  'admin',
  'admin@madanicenter.org.uk',
  '$2y$12$vHyyd.jLbxk3ww63PW2W..62i15AaRUyWfl3Q1.Kch8nE00jadpei',
  'Madani Facility Coordinator',
  'superadmin',
  1
) ON DUPLICATE KEY UPDATE `password_hash` = VALUES(`password_hash`);

INSERT INTO `facilities` (`id`, `name`, `slug`, `category`, `capacity`, `hourly_rate`, `weekend_rate`, `deposit_required`, `description`, `features_json`, `equipment_json`, `dimensions`, `placeholder_key`)
VALUES
(
  'fac-main-hall',
  'Main Community & Event Hall',
  'main-hall',
  'Large Assembly & Functions',
  250,
  45.00,
  55.00,
  150.00,
  'Our primary assembly space offers high ceilings, clean timber-finish flooring, and flexible seating arrangements. Perfect for community conferences, seminars, youth rallies, and family gatherings.',
  '["High ceilings with natural perimeter daylight", "Step-free ground floor entrance and wide double doors", "Direct access to reception foyer", "Climate control & ventilation"]',
  '["PA Sound system with 2 wireless microphones", "HD ceiling projector & motorized 120 inch screen", "200 upholstered chairs & 25 tables", "Stage riser setup", "High-speed Wi-Fi"]',
  '18m x 12m (216 sqm)',
  'venue-hall'
),
(
  'fac-meeting-suite',
  'Meeting & Training Suite',
  'meeting-suite',
  'Small to Medium Meetings',
  35,
  25.00,
  30.00,
  50.00,
  'A focused, quiet acoustic environment designed for trustee board meetings, committee discussions, staff training sessions, and small group seminars.',
  '["Acoustic sound-dampened privacy walls", "Natural daylight with blackout blinds", "Beverage preparation counter", "Executive boardroom layout"]',
  '["65 inch 4K Smart TV display with HDMI share", "Conference speakerphone for hybrid Zoom", "Dry-wipe whiteboard & flipcharts", "Ergonomic meeting chairs"]',
  '8m x 5m (40 sqm)',
  'building-facilities'
),
(
  'fac-classrooms',
  'Modular Classroom Spaces',
  'classrooms',
  'Teaching & Study Circles',
  28,
  20.00,
  25.00,
  40.00,
  'Well-appointed educational rooms equipped with standard pupil desks and presentation boards. Ideal for supplementary evening education, adult Arabic classes, and GCSE revision.',
  '["Quiet educational wing", "Natural daylight & bright LED reading lights", "Multiple laptop electrical points", "Teacher presentation desk"]',
  '["Standard single/double desks & chairs", "Large whiteboard & dry-wipe markers", "Wall projection area", "Educational Wi-Fi"]',
  '7m x 6m (42 sqm)',
  'darul-madinah-classroom'
),
(
  'fac-youth-lounge',
  'Youth & Community Activity Lounge',
  'youth-lounge',
  'Social & Recreational',
  50,
  30.00,
  35.00,
  60.00,
  'A vibrant, multi-purpose space with resilient flooring suited to youth social meetups, table tennis, mentoring circles, sisters morning teas, and wellbeing workshops.',
  '["Durable non-slip vinyl sports flooring", "Modular soft seating & breakout zones", "Tea & refreshment counter", "Step-free ground level access"]',
  '["Table tennis tables & recreational games", "Bluetooth audio speaker", "Folding tables & light stackable chairs", "High-speed Wi-Fi"]',
  '12m x 8m (96 sqm)',
  'youth-activity'
) ON DUPLICATE KEY UPDATE `id` = `id`;

-- Sample Blocked Date
INSERT INTO `blocked_dates` (`facility_id`, `blocked_date`, `reason`, `created_by`)
VALUES ('all', '2026-12-25', 'Center Closed - Winter Bank Holiday', 'System Admin')
ON DUPLICATE KEY UPDATE `id` = `id`;
