# Madani Community Center - PHP & MySQL Booking Application

Comprehensive setup, testing, and deployment instructions for running locally on **XAMPP / Apache** and migrating to **IONOS Web Hosting**.

---

## 📋 Table of Contents
1. [Localhost Testing with XAMPP](#1-localhost-testing-with-xampp)
2. [Default Admin Credentials](#2-default-admin-credentials)
3. [Testing Phase Checklist](#3-testing-phase-checklist)
4. [Step-by-Step Migration to IONOS](#4-step-by-step-migration-to-ionos)
5. [Self-Healing & Security Measures](#5-self-healing--security-measures)

---

## 1. Localhost Testing with XAMPP

### Step 1: Copy Files to `htdocs`
Copy all files and subdirectories from this `php-app/` directory directly into your Apache web directory:
- **Windows (XAMPP):** `C:\xampp\htdocs\mcm\`
- **macOS (MAMP/XAMPP):** `/Applications/XAMPP/xamppfiles/htdocs/mcm/`
- **Linux (LAMP):** `/var/www/html/mcm/`

Ensure the following structure exists in `C:\xampp\htdocs\mcm\`:
```text
C:\xampp\htdocs\mcm\
├── index.php                 (Public Home)
├── booking.php               (Check Availability & 3-Step Booking)
├── facilities.php            (Room specifications & pricing)
├── contact.php               (Location map & contact form)
├── booking-success.php       (Acknowledgement screen)
├── schema.sql                (Full database schema & seeds)
├── config/
│   ├── database.php          (PDO connection with auto-init)
│   ├── security.php          (Security headers, CSP, CSRF, rate-limiter)
│   └── mail.php              (Email delivery)
├── includes/
│   ├── header.php            (Logo navigation header)
│   └── footer.php            (Site footer)
└── admin/
    ├── login.php             (Admin security gateway)
    ├── dashboard.php         (Admin overview)
    ├── bookings.php          (Manage booking requests)
    ├── blocked-dates.php     (Manage Booked Slots & Red/Green Calendar)
    └── ...
```

### Step 2: Start Apache and MySQL
In the **XAMPP Control Panel**, click **Start** next to both **Apache** and **MySQL**.

### Step 3: Database Initialization
Our application includes an **automatic self-healing installer**. When you open `http://localhost/mcm/index.php`, it will attempt to connect to MySQL (`localhost:3306`), auto-create `madani_booking_db` if not found, and auto-import all tables and seeds from `schema.sql`.

If you prefer setting it up manually via phpMyAdmin:
1. Open `http://localhost/phpmyadmin/`.
2. Create database: `madani_booking_db` (Collation: `utf8mb4_unicode_ci`).
3. Click on the database, open **Import**, choose `schema.sql`, and click **Import**.

### Step 4: Access URLs
- **Public Website:** `http://localhost/mcm/index.php`
- **Booking Flow:** `http://localhost/mcm/booking.php`
- **Admin Gateway:** `http://localhost/mcm/admin/login.php`

---

## 2. Default Admin Credentials

* **URL:** `http://localhost/mcm/admin/login.php`
* **Username:** `admin` or `admin@madanicenter.org.uk`
* **Password:** `MadaniAdmin2026!`

---

## 3. Testing Phase Checklist

Before deploying to live hosting, verify each feature locally:

1. **Brand Theme & Styling**:
   - Home page loads completely with the official Madani logo, navy header, and room cards.
   - Zero Content Security Policy (CSP) errors in browser console.
2. **Slideshow Booking Process (`booking.php`)**:
   - **Step 1 (Select Date & Space)**: The calendar displays **Available (Green)** and **Booked Slot (Red)**. Red booked dates are strictly blocked from selection.
   - **Step 2 (Event Details)**: Form fields for event type, layout preference, kitchen access, and attendee numbers.
   - **Step 3 (Contact & Confirmation)**: Contact details, terms acceptance, and submission.
   - Generates official reference format: `MCC-2026-XXXX`.
3. **Admin Dashboard (`admin/`)**:
   - Log in using `admin` / `MadaniAdmin2026!`.
   - Test approving, rejecting, or editing bookings.
   - Test **Booked Slots** (`blocked-dates.php`): click a date to reserve it as a Booked Slot (Red) or release it back to Available (Green).
   - Test **Export CSV** download.

---

## 4. Step-by-Step Migration to IONOS

When you are ready to launch live on IONOS:

### Step 1: Create MySQL Database on IONOS
1. Log into your [IONOS Control Panel](https://my.ionos.co.uk/).
2. Navigate to **Hosting** > **Databases** > **MySQL**.
3. Click **Create Database**.
4. Set a strong password and record:
   - **Host Name:** (e.g. `db5012345678.hosting-data.io`)
   - **Database Name:** (e.g. `dbs12345678`)
   - **User Name:** (e.g. `dbu12345678`)
   - **Password:** Your chosen password

### Step 2: Import `schema.sql` via IONOS phpMyAdmin
1. In the IONOS Databases list, click **Open phpMyAdmin**.
2. Select your IONOS database.
3. Click **Import**, upload `schema.sql`, and execute.

### Step 3: Configure Database Credentials
Edit `config/database.php` on your computer or server:
```php
$db_host = 'db5012345678.hosting-data.io'; // IONOS database host
$db_port = '3306';
$db_name = 'dbs12345678';                  // IONOS database name
$db_user = 'dbu12345678';                  // IONOS database user
$db_pass = 'YourSecretIonosPassword!';     // IONOS database password
```

### Step 4: Upload via SFTP (FileZilla)
1. In IONOS, open **Hosting** > **FTP / Secure FTP** to retrieve your SFTP login.
2. In FileZilla, connect via SFTP (`Port 22`).
3. Upload all files from `php-app/` into your live website directory (e.g. `/` or your domain folder).
4. Make sure `.htaccess` is uploaded.

### Step 5: Enable Free SSL / HTTPS
1. In IONOS, go to **Domains & SSL**.
2. Click **Activate SSL** for your domain.
3. Once the certificate is issued, all HTTP requests will be automatically redirected to secure HTTPS by `.htaccess`.

---

## 5. Self-Healing & Security Measures

- **CSP Map Resolution**: Content Security Policy allows source maps from `https://cdn.jsdelivr.net`.
- **Fail-Safe Fallbacks**: Missing database records or query exceptions will fall back gracefully rather than crashing or showing a blank page.
- **Auto-Password Bootstrap**: Logging in with `admin` / `MadaniAdmin2026!` automatically verifies and upgrades the password to native PHP bcrypt.
- **CSRF & Rate Limiting**: All form submissions enforce CSRF tokens; administrative logins enforce rate limits against brute force attacks.
