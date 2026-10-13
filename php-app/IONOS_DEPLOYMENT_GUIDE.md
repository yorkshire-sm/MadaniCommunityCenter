# IONOS Hosting Deployment Guide

Step-by-step instructions for deploying the **Madani Community Center Booking Platform** to **IONOS Web Hosting** using PHP and MySQL.

---

## 1. Prerequisites on IONOS
- An active IONOS Web Hosting package (e.g. Web Hosting Plus or Pro).
- Access to the **IONOS Cloud Panel** / Control Panel (`https://my.ionos.co.uk` or `https://my.ionos.com`).
- An FTP/SFTP client (such as FileZilla, Cyberduck, or WinSCP).

---

## 2. Step 1: Create the MySQL Database on IONOS
1. Log in to your IONOS Account.
2. In the navigation menu, select **Databases** (or **Hosting & Domains &rarr; MySQL Database**).
3. Click **Create Database**.
4. Set a strong password and add a note/description (e.g., `Madani Booking System`).
5. Once created, IONOS will display your connection parameters:
   - **Host name**: e.g., `db5012345678.hosting-data.io`
   - **Database name**: e.g., `dbs1234567`
   - **User name**: e.g., `dbu1234567`
   - **Port**: `3306`
   - **Password**: The password you set.

---

## 3. Step 2: Import the Database Schema
1. Beside your new database in the IONOS Control Panel, click **Open phpMyAdmin**.
2. Once phpMyAdmin opens, select your database in the left sidebar.
3. Click the **Import** tab at the top.
4. Click **Choose File** and select `schema.sql` from the `php-app` folder.
5. Leave all settings at default (`utf8mb4`) and click **Import** at the bottom.
6. Verify that the 8 tables (`administrators`, `facilities`, `customers`, `bookings`, `blocked_dates`, `audit_logs`, `rate_limits`, `password_resets`) are created.

---

## 4. Step 3: Configure `config/database.php`
Before uploading, open `config/database.php` and enter your IONOS MySQL credentials:

```php
$db_host = 'db5012345678.hosting-data.io'; // Your IONOS host name
$db_port = '3306';
$db_name = 'dbs1234567';                   // Your IONOS database name
$db_user = 'dbu1234567';                   // Your IONOS database user
$db_pass = 'YourStrongIONOSPassword!';     // Your password
$app_env = 'production';                   // Suppresses technical error traces
```

---

## 5. Step 4: Upload Files via SFTP
1. In the IONOS Control Panel, go to **Hosting &rarr; SFTP / SSH accounts**. Note your server address, username, and password.
2. Open FileZilla and connect to your IONOS SFTP account.
3. Navigate to your website's root directory (often `/` or `/htdocs` or `/your-domain-folder`).
4. Upload all files and folders from `php-app`:
   - `index.php`
   - `facilities.php`
   - `booking.php`
   - `booking-success.php`
   - `contact.php`
   - `.htaccess`
   - `config/`
   - `includes/`
   - `admin/`
   - `api/`

---

## 6. Step 5: Enable SSL / HTTPS on IONOS
1. In the IONOS Control Panel, go to **SSL Certificates**.
2. If not already active, activate the free Wildcard SSL certificate for your domain (`https://yourdomain.co.uk`).
3. The uploaded `.htaccess` file will automatically redirect all insecure `http://` requests to encrypted `https://`.

---

## 7. Step 6: Verify PHP Version
1. In the IONOS Control Panel, navigate to **PHP Settings**.
2. Ensure your domain is using **PHP 8.1, 8.2, or 8.3**.
3. Older PHP versions (such as PHP 7.x) are deprecated and should not be used.

---

## 8. Step 7: Post-Deployment Security Checks
1. Visit `https://yourdomain.co.uk/admin/login.php`.
2. Log in using `admin` and `MadaniAdmin2026!`.
3. In phpMyAdmin or via your database manager, update the administrator password:
   Run in phpMyAdmin:
   ```sql
   UPDATE administrators 
   SET password_hash = '$2y$12$...' -- Generate with password_hash("YourNewPassword", PASSWORD_BCRYPT)
   WHERE id = 1;
   ```
4. Verify that trying to directly access `https://yourdomain.co.uk/config/database.php` returns **403 Forbidden** (enforced by `.htaccess`).
5. Submit a test booking on `https://yourdomain.co.uk/booking.php` to ensure MySQL transactions and email notifications operate smoothly.
