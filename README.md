# Madani Community Center - Setup, Testing & Deployment Guide

This project contains the complete booking platform for **Madani Community Center (Sheffield)**. It includes both:
1. **The PHP & MySQL Web Application + Admin Portal** (located in `php-app/`, production-ready for XAMPP and IONOS hosting).
2. **The Modern React / TypeScript SPA** (in `src/`, with live Vite development).

---

## 📋 Table of Contents
1. [Part 1: Local Setup & Testing with XAMPP (Localhost)](#part-1-local-setup--testing-with-xampp-localhost)
2. [Part 2: Default Administrator Credentials](#part-2-default-administrator-credentials)
3. [Part 3: Testing Phase Checklist](#part-3-testing-phase-checklist)
4. [Part 4: Step-by-Step Migration to IONOS Web Hosting](#part-4-step-by-step-migration-to-ionos-web-hosting)
5. [Part 5: Troubleshooting Common Issues](#part-5-troubleshooting-common-issues)

---

## Part 1: Local Setup & Testing with XAMPP (Localhost)

### Step 1: Prepare XAMPP
1. Download and install [XAMPP](https://www.apachefriends.org/) (PHP 8.1 or higher recommended).
2. Open the **XAMPP Control Panel**.
3. Click **Start** for both **Apache** and **MySQL**.
   - Ensure both modules turn green with assigned port numbers (Apache: `80` or `8080`, MySQL: `3306`).

### Step 2: Place the Files in `htdocs`
You can run the application either with `php-app` as a clean root or under an `mcm` folder.

**Recommended Setup (`http://localhost/mcm/`):**
1. Navigate to your XAMPP web root directory:
   - **Windows:** `C:\xampp\htdocs\`
   - **macOS:** `/Applications/XAMPP/xamppfiles/htdocs/`
   - **Linux:** `/opt/lampp/htdocs/`
2. Create a folder named `mcm` inside `htdocs`:
   ```text
   C:\xampp\htdocs\mcm\
   ```
3. Copy all files from **`php-app/`** directly into `C:\xampp\htdocs\mcm\`.
   Your folder will look like:
   ```text
   C:\xampp\htdocs\mcm\
   ├── index.php                 (Home page)
   ├── booking.php               (Check Availability & Slideshow Booking)
   ├── facilities.php            (Facilities & Hourly Pricing)
   ├── contact.php               (Contact & Interactive Location Map)
   ├── booking-success.php       (Booking Acknowledgement)
   ├── schema.sql                (Complete Database Schema & Seed Data)
   ├── config/
   │   ├── database.php          (Database PDO connection & auto-installer)
   │   ├── security.php          (OWASP security headers, CSRF & rate limiter)
   │   └── mail.php              (Email notification dispatcher)
   ├── includes/
   │   ├── header.php            (Main site header & branding)
   │   └── footer.php            (Main site footer)
   ├── admin/
   │   ├── login.php             (Admin login gateway)
   │   ├── dashboard.php         (Admin overview & KPIs)
   │   ├── bookings.php          (Booking requests management)
   │   ├── blocked-dates.php     (Booked Slots 2-color management)
   │   ├── export-csv.php        (GDPR CSV export)
   │   └── ...
   └── api/
       └── check-availability.php (JSON calendar availability API)
   ```

*(Note: If you copied the entire repository into `C:\xampp\htdocs\mcm\`, the included gateway will automatically route requests to `http://localhost/mcm/php-app/index.php`).*

### Step 3: MySQL Database Setup
Our database connection includes **Self-Healing Auto-Installation**. When you open the website, it will automatically connect to MySQL and create the database if permissions allow.

Alternatively, to set it up manually in phpMyAdmin:
1. Open your browser and navigate to:
   ```text
   http://localhost/phpmyadmin/
   ```
2. Click **New** in the left sidebar.
3. Database Name: `madani_booking_db`
   - Collation: `utf8mb4_unicode_ci`
4. Click **Create**.
5. Select `madani_booking_db`, go to the **Import** tab at the top.
6. Click **Choose File**, select `schema.sql`, and click **Import**.

### Step 4: Verify Database Connection (`config/database.php`)
Open `config/database.php` and verify the credentials match your local setup:
```php
$db_host = 'localhost';
$db_port = '3306';
$db_name = 'madani_booking_db';
$db_user = 'root';
$db_pass = ''; // Default for XAMPP is blank
```

---

## Part 2: Default Administrator Credentials

To access the administrative portal:
* **URL:** `http://localhost/mcm/admin/login.php` (or `http://localhost/mcm/php-app/admin/login.php`)
* **Username:** `admin` (or `admin@madanicenter.org.uk`)
* **Password:** `MadaniAdmin2026!`

The authentication system includes automatic bcrypt upgrading and brute-force protection (maximum 5 failed attempts per 60 seconds).

---

## Part 3: Testing Phase Checklist

Complete these tests on localhost before migrating to IONOS:

### 1. Home Page & Facilities
- [ ] Open `http://localhost/mcm/index.php`.
- [ ] Verify that all 4 facilities are displayed with correct hourly and weekend rates.
- [ ] Verify styling displays in official Madani Navy (`#0B2545`), Ocean Blue (`#0077C8`), and Teal (`#00A896`).
- [ ] Check DevTools Console (`F12`) to confirm zero Content Security Policy (CSP) errors.

### 2. 3-Step Slideshow Booking Flow
- [ ] Open `http://localhost/mcm/booking.php`.
- [ ] **Step 1 (Select Date & Space):**
  - Verify that the calendar displays 2 statuses:
    - 🟢 **Available (Green)**: Clickable and selectable.
    - 🔴 **Booked Slot (Red)**: Disabled and unclickable.
  - Attempt clicking a Red date; confirm the alert message prevents selection and blocks proceeding to Step 2.
  - Select a Green date and click **Continue to Step 2**.
- [ ] **Step 2 (Event Details):**
  - Choose attendee count, layout style, catering/kitchen access, and additional requirements.
  - Click **Continue to Step 3**.
- [ ] **Step 3 (Contact & Confirmation):**
  - Enter name, email, phone number, and organization.
  - Accept terms and declaration, then submit.
  - Confirm redirection to `booking-success.php` with a generated reference (e.g., `MCC-2026-XXXX`).

### 3. Admin Dashboard & Slot Management
- [ ] Navigate to `http://localhost/mcm/admin/login.php`.
- [ ] Log in with `admin` / `MadaniAdmin2026!`.
- [ ] Confirm access to `dashboard.php` showing summary KPI cards.
- [ ] Go to **Booked Slots** (`blocked-dates.php`):
  - View the interactive calendar with 2-color legend (**Available Green** vs **Booked Slot Red**).
  - Add a new Booked Slot date for maintenance or community events.
  - Verify that the newly booked date immediately turns Red on the public calendar.
  - Test releasing a booked slot and verify it turns Green again.
- [ ] Go to **Bookings** (`bookings.php`):
  - Approve or reject a pending customer booking request.
  - Download booking records via **Export CSV**.

---

## Part 4: Step-by-Step Migration to IONOS Web Hosting

Once local testing is complete, follow these steps to deploy to your live IONOS hosting account:

### Step 1: Create a MySQL Database on IONOS
1. Log in to your **IONOS Cloud Panel / Webhosting Dashboard** at [https://my.ionos.co.uk](https://my.ionos.co.uk).
2. Go to **Databases** > **MySQL**.
3. Click **Create Database**.
4. Set a strong password and note down your credentials:
   - **Host Name:** e.g., `db5012345678.hosting-data.io` (IONOS provides a specific host address, not `localhost`)
   - **Database Name:** e.g., `dbs12345678`
   - **User Name:** e.g., `dbu12345678`
   - **Port:** `3306`
   - **Password:** Your chosen database password

### Step 2: Import `schema.sql` into IONOS MySQL
1. In your IONOS MySQL Databases list, click the **phpMyAdmin** link next to your new database.
2. Inside IONOS phpMyAdmin, select your database.
3. Click the **Import** tab.
4. Upload `schema.sql` and click **Import**.
5. Verify that all 8 tables are created (`facilities`, `bookings`, `customers`, `administrators`, `blocked_dates`, `audit_logs`, `rate_limits`, `password_resets`).

### Step 3: Update `config/database.php` for IONOS
Edit `php-app/config/database.php` with your IONOS database credentials:
```php
$db_host = 'db5012345678.hosting-data.io'; // Your IONOS host
$db_port = '3306';
$db_name = 'dbs12345678';                  // Your IONOS database name
$db_user = 'dbu12345678';                  // Your IONOS database user
$db_pass = 'YourStrongIonosPasswordHere!'; // Your IONOS password
```

### Step 4: Upload Files via SFTP (FileZilla)
1. In the IONOS dashboard, go to **Hosting** > **FTP / Secure FTP**.
2. Note your SFTP host, username, and password.
3. Open **FileZilla** or your preferred FTP client:
   - **Host:** `sftp://your-ionos-server.ionos.com`
   - **Port:** `22` (SFTP)
   - **User:** Your IONOS SFTP user
   - **Password:** Your SFTP password
4. On the remote side, navigate to your domain's document root (e.g., `/` or `/madani-center/`).
5. Upload all files from `php-app/` into that directory.
   Ensure that:
   - `.htaccess` is uploaded (enable "Show hidden files" in FileZilla).
   - `config/database.php` has permissions set to `640` or `644`.

### Step 5: Enable SSL (HTTPS) on IONOS
1. In the IONOS Dashboard, navigate to **Domains & SSL**.
2. Select your domain (e.g., `madanicenter.org.uk`).
3. Click **Activate SSL** (free IONOS Wildcard or Let's Encrypt certificate).
4. Once active, `.htaccess` will automatically enforce HTTPS redirection for all visitors.

### Step 6: Post-Deployment Verification
1. Visit `https://yourdomain.co.uk/index.php`.
2. Confirm the site loads with valid HTTPS lock icon.
3. Test a live booking submission and verify receipt in the admin portal.
4. Log in to `https://yourdomain.co.uk/admin/login.php` using `admin` / `MadaniAdmin2026!`.
5. Change the default administrator password in the admin settings for security.

---

## Part 5: Troubleshooting Common Issues

### Issue 1: "index.php:1 GET http://localhost/mcm/index.php 404 (Not Found)"
* **Cause:** The folder inside `htdocs` is not named `mcm`, or files were saved in a subfolder.
* **Fix:** Ensure the folder is named `C:\xampp\htdocs\mcm\` and contains `index.php`.

### Issue 2: Navbar loads but the rest of the page is blank
* **Cause:** Database table `facilities` did not exist and threw an uncaught error after header output.
* **Fix:** We have updated `config/database.php` with self-healing auto-init, plus safe fallback arrays in `index.php` and `facilities.php`. Simply refresh the page.

### Issue 3: "HTTP ERROR 500 on admin/login.php"
* **Cause:** Missing `administrators` or `rate_limits` table in MySQL, or password hash mismatch.
* **Fix:** We have added full `try/catch` error trapping, auto-seeding of the default `admin` account with native PHP bcrypt hashing, and defensive rate limiting. Log in with `admin` and `MadaniAdmin2026!`.

### Issue 4: CSP source map error in browser console
* **Cause:** Tailwind CDN source map request (`cdn.jsdelivr.net`) blocked by missing `connect-src`.
* **Fix:** Added `connect-src 'self' https://cdn.jsdelivr.net;` to the Content Security Policy header in `config/security.php`.

### Issue 5: Windows Case-Insensitivity & Infinite Require Loop (`Database.php` vs `database.php`)
* **Cause:** On Windows NTFS file systems, file names are case-insensitive. If both `Database.php` and `database.php` existed in `config/`, Windows treated them as the same file, causing `database.php` to require itself in a loop and leaving `$pdo` undefined.
* **Fix:** We removed the redundant `Database.php` file. All scripts now uniformly include `config/database.php` (lowercase), which works identically on Windows and Linux (IONOS).

### Issue 6: Admin Password Reset / Recovery on Localhost
If you ever need to manually reset the administrator password in phpMyAdmin:
1. Open `http://localhost/phpmyadmin/`.
2. Select `madani_booking_db` -> `administrators`.
3. Run this SQL query to restore the password to `MadaniAdmin2026!`:
```sql
UPDATE administrators 
SET password_hash = '$2y$12$vHyyd.jLbxk3ww63PW2W..62i15AaRUyWfl3Q1.Kch8nE00jadpei',
    failed_login_attempts = 0,
    lockout_until = NULL,
    is_active = 1
WHERE username = 'admin';
```
