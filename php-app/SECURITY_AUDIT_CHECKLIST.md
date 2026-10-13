# Security Audit & Verification Checklist

This checklist reviews the defensive security implementations in the **Madani Community Center Booking System** against recognized OWASP standards.

---

### A. Authentication & Session Management
- [x] **Password Hashing**: Stored using `password_hash()` with BCrypt cost factor 12. Never stored in plaintext.
- [x] **Password Verification**: Verified using timing-safe `password_verify()`.
- [x] **Brute-Force Rate Limiting**: The `rate_limits` table and `check_rate_limit()` helper enforce a temporary block (60s) after 5 consecutive failed attempts from an IP address without permanent lockout.
- [x] **Generic Error Messages**: Failed logins return generic messages ("Invalid administrative credentials") to prevent user enumeration attacks.
- [x] **Session Fixation Defense**: `session_regenerate_id(true)` called upon successful authentication.
- [x] **Hardened Cookies**: `session_set_cookie_params()` enforces `HttpOnly=true` (XSS protection), `SameSite=Strict` (CSRF defense), and `Secure=true` over HTTPS.
- [x] **Inactivity Timeout**: Automatic expiration of admin sessions after 15 minutes (900 seconds) of inactivity via `check_session_timeout()`.
- [x] **Complete Logout**: `logout.php` invalidates `$_SESSION`, removes session cookies with expired timestamps, and terminates the PHP session.

---

### B. Access Control & Authorization
- [x] **Server-Side Authentication Checks**: `require_admin_auth()` called at the top of every admin script (`header.php`).
- [x] **Direct URL Protection**: Accessing `admin/dashboard.php`, `admin/bookings.php`, or any sub-script without an active session immediately redirects to `login.php`.
- [x] **Role-Based Enforcement**: `require_admin_role()` helper verifies user privileges for destructive actions.
- [x] **No Sensitive Data in URLs**: Booking references use non-sequential identifiers; customer contact information is never passed through GET query parameters or public APIs.
- [x] **Search Engine Privacy**: Admin pages transmit `<meta name="robots" content="noindex, nofollow">` to prevent web crawlers from indexing management screens.

---

### C. Database Security
- [x] **PDO Prepared Statements**: 100% of queries use PDO parameterized statements with bound variables. No raw SQL concatenation.
- [x] **Emulation Disabled**: `PDO::ATTR_EMULATE_PREPARES => false` ensures true database-level prepared statements.
- [x] **Exception Handling**: Database errors are caught and logged to server logs; generic friendly messages are displayed in production to avoid leaking database schemas.
- [x] **Transactional Conflict Defense**: Booking submissions execute within a `BEGIN TRANSACTION` block using `FOR UPDATE` row-locking to prevent simultaneous double-booking collisions.
- [x] **Credential Protection**: Apache `.htaccess` denies web access to `config/` and `.env` files.

---

### D. Input Validation & XSS/CSRF Defenses
- [x] **CSRF Token Verification**: Every state-changing form (bookings, approvals, cancellations, note updates, blocked dates) validates a cryptographic CSRF token via `verify_csrf_token()`.
- [x] **Context-Appropriate XSS Escaping**: All dynamic outputs use `e()` wrapper calling `htmlspecialchars(..., ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')`.
- [x] **Spam Protection**: Invisible honeypot field catches automated web scrapers and bot form submissions.
- [x] **Security HTTP Headers**:
  - `X-Frame-Options: SAMEORIGIN` (prevents clickjacking)
  - `X-Content-Type-Options: nosniff` (prevents MIME-type confusion attacks)
  - `Content-Security-Policy` (restricts unauthorized script execution)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Strict-Transport-Security` (enforces HTTPS)

---

### E. UK GDPR & Data Minimization
- [x] **Customer Separation**: Customers table isolates personal contact information from public availability feeds.
- [x] **Privacy-Safe Availability**: Public availability API and calendar return only time slots and room names—never names, phone numbers, or emails.
- [x] **Right to Erasure ("Right to be Forgotten")**: Admin GDPR tool allows searching by email and redacting customer identifiers (`[Anonymized Customer]`, `[Removed]`).
- [x] **Audit Trail**: High-risk actions and GDPR erasures are logged in the `audit_logs` table with IP tracking.
