# Madani Community Center - Online Booking Platform (PHP & MySQL)

A modern, secure, full-stack community centre booking platform designed for traditional PHP & MySQL web hosting (Apache, XAMPP, MAMP, WampServer, and IONOS).

---

## 🚀 Key Features

1. **Streamlined 4-Section Public Website**:
   - **Home (`index.php`)**: Center photography, introduction, facilities summary, and quick "Check Availability" & "Book Now" actions.
   - **Facilities & Pricing (`facilities.php`)**: Room breakdowns, dimensions, hourly rates (weekday & weekend), capacities, equipment amenities.
   - **Availability & Booking (`booking.php`)**: Live date & time availability checker, transactional race-condition conflict prevention, multi-step booking request form, and automated reference generation (`MCC-2026-XXXX`).
   - **Contact & Location (`contact.php`)**: Interactive Google Maps embed, Tinsley Park Road address, phone, email, and enquiry form.

2. **Secure Admin Dashboard (`admin/`)**:
   - **Session Security**: Hardened session cookies (`HttpOnly`, `SameSite=Strict`, `Secure` over HTTPS), automatic 15-minute inactivity timeout, session fixation protection via `session_regenerate_id()`.
   - **Authentication**: Password hashing using PHP `password_hash()` and `password_verify()`, brute-force login rate limiting, generic OWASP error messages, 2FA support.
   - **Booking Management**: Approve, reject (with custom reason), edit internal notes, cancel reservations, add manual/phone bookings.
   - **Blackout Dates**: Block dates for maintenance or religious holidays to immediately prevent public reservations.
   - **Facility & Pricing Management**: Edit capacities, hourly rates, and weekend surcharges.
   - **Export to CSV**: Download complete booking records with CSRF token verification.
   - **Security Audit Log**: Immutable record of all logins, status changes, and data modifications with IP tracking.
   - **UK GDPR Tools**: Customer lookup, historical booking query, and "Right to be Forgotten" (anonymization) tool.

---

## 🛠 Local Setup Instructions (Apache, PHP & MySQL / XAMPP)

### Step 1: Place Files in Web Root
1. Copy the entire `php-app` folder into your Apache document root:
   - **XAMPP (Windows)**: `C:\xampp\htdocs\madani-booking\`
   - **MAMP (Mac)**: `/Applications/MAMP/htdocs/madani-booking/`
   - **Linux / LAMP**: `/var/www/html/madani-booking/`

### Step 2: Create MySQL Database
1. Open your browser and navigate to **phpMyAdmin**:
   `http://localhost/phpmyadmin/`
2. Click **New** in the left sidebar.
3. Enter database name: `madani_booking_db` (Collation: `utf8mb4_unicode_ci`).
4. Click **Create**.
5. Select the newly created database, go to the **Import** tab, choose the `schema.sql` file from this folder, and click **Import**.

### Step 3: Configure Database Connection
Open `config/database.php` in a text editor and adjust your credentials if needed:
```php
$db_host = 'localhost';
$db_port = '3306';
$db_name = 'madani_booking_db';
$db_user = 'root';      // Default for XAMPP
$db_pass = '';          // Default empty password for XAMPP
```

### Step 4: Test in Browser
- **Public Website**: `http://localhost/madani-booking/index.php`
- **Admin Gateway**: `http://localhost/madani-booking/admin/login.php`

---

## 🔐 Default Administrator Account

- **Username**: `admin` or `admin@madanicenter.org.uk`
- **Password**: `MadaniAdmin2026!`

> **Security Note**: Immediately change this password upon deployment or add a new administrative user with a strong, unique password.
