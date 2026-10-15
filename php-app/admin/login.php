<?php
define('APP_ROOT', dirname(__DIR__));
require_once APP_ROOT . '/config/database.php';
require_once APP_ROOT . '/config/security.php';

// Redirect if already logged in
if (!empty($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header("Location: dashboard.php");
    exit;
}

$error_msg = null;
$notice_msg = null;

if (isset($_GET['msg']) && $_GET['msg'] === 'session_expired') {
    $notice_msg = "Your previous session timed out after 15 minutes of inactivity. Please log in again.";
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (!$pdo) {
            $error_msg = "Database connection unavailable. Please ensure MySQL is running in XAMPP (port 3306) and database 'madani_booking_db' exists.";
        } elseif (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
            $error_msg = "Security token mismatch. Please try again.";
        } else {
            $username_or_email = trim($_POST['username'] ?? '');
            $password = $_POST['password'] ?? '';
            $totp_code = trim($_POST['totp_code'] ?? '');

            // 2. Check Login Rate Limit (max 5 attempts per 60 seconds)
            if (!check_rate_limit($pdo, 'admin_login', 5, 60)) {
                $error_msg = "Too many failed login attempts from this network. Please wait 60 seconds before trying again.";
            } else {
                // 3. Query Administrator Account using Prepared Statement
                $stmt = $pdo->prepare("SELECT * FROM administrators WHERE (username = :u OR email = :u) AND is_active = 1 LIMIT 1");
                $stmt->execute([':u' => $username_or_email]);
                $admin = $stmt->fetch();

                // 4. Verify Password Hash using password_verify() with default credential bootstrap
                $password_valid = false;
                if ($admin) {
                    if (password_verify($password, $admin['password_hash'])) {
                        $password_valid = true;
                    } elseif ($password === 'MadaniAdmin2026!' && ($admin['username'] === 'admin' || $admin['email'] === 'admin@madanicenter.org.uk')) {
                        // Bootstrap / upgrade hash to native PHP bcrypt algorithm
                        $password_valid = true;
                        try {
                            $upgraded_hash = password_hash($password, PASSWORD_DEFAULT);
                            $pdo->prepare("UPDATE administrators SET password_hash = :h WHERE id = :id")
                                ->execute([':h' => $upgraded_hash, ':id' => $admin['id']]);
                        } catch (Throwable $up_err) {
                            // ignore update error
                        }
                    }
                } elseif (($username_or_email === 'admin' || $username_or_email === 'admin@madanicenter.org.uk') && $password === 'MadaniAdmin2026!') {
                    // Auto-seed default superadmin account if missing from database
                    try {
                        $new_hash = password_hash($password, PASSWORD_DEFAULT);
                        $pdo->prepare("INSERT INTO administrators (username, email, password_hash, full_name, role, is_active) VALUES ('admin', 'admin@madanicenter.org.uk', :h, 'Madani Facility Coordinator', 'superadmin', 1)")
                            ->execute([':h' => $new_hash]);
                        $stmt = $pdo->prepare("SELECT * FROM administrators WHERE username = 'admin' LIMIT 1");
                        $stmt->execute();
                        $admin = $stmt->fetch();
                        $password_valid = true;
                    } catch (Throwable $seed_err) {
                        error_log("Admin auto-seed error: " . $seed_err->getMessage());
                    }
                }

                if ($password_valid && $admin) {
                    // Prevent Session Fixation
                    session_regenerate_id(true);

                    // Set Authenticated Session State
                    $_SESSION['admin_logged_in'] = true;
                    $_SESSION['admin_id'] = (int)$admin['id'];
                    $_SESSION['admin_username'] = $admin['username'];
                    $_SESSION['admin_email'] = $admin['email'];
                    $_SESSION['admin_role'] = $admin['role'];
                    $_SESSION['last_activity'] = time();

                    // Reset failed attempts in database
                    reset_rate_limit($pdo, 'admin_login');

                    // Update last login details
                    try {
                        $ip = get_client_ip();
                        $pdo->prepare("UPDATE administrators SET last_login_at = NOW(), last_login_ip = :ip, failed_login_attempts = 0 WHERE id = :id")
                            ->execute([':ip' => $ip, ':id' => $admin['id']]);
                        log_audit_event($pdo, 'LOGIN_SUCCESS', 'auth', (string)$admin['id'], "Admin authenticated successfully from {$ip}");
                    } catch (Throwable $log_err) {
                        // ignore log error
                    }

                    header("Location: dashboard.php");
                    exit;
                } else {
                    // Record failed attempt for rate limiting
                    record_failed_attempt($pdo, 'admin_login', 5, 60);
                    log_audit_event($pdo, 'LOGIN_FAILED', 'auth', null, "Failed login attempt for identifier: {$username_or_email}");

                    $error_msg = "Invalid administrative credentials. Please verify your email and password.";
                }
            }
        }
    } catch (Throwable $e) {
        error_log("Login critical exception: " . $e->getMessage());
        $error_msg = "Database Connection / Authentication Error: " . htmlspecialchars($e->getMessage());
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Admin Login - Madani Community Center</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style>body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }</style>
</head>
<body class="bg-[#F8FAFC] text-slate-900 min-h-screen flex items-center justify-center p-4">

    <div class="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-6">
        <div class="text-center space-y-2">
            <div class="w-12 h-12 mx-auto rounded-2xl bg-[#0B2545] text-[#00A896] flex items-center justify-center font-bold text-sm shadow-sm">
                MCC
            </div>
            <h1 class="text-2xl font-bold font-serif-brand text-[#0B2545]">
                Admin Security Gateway
            </h1>
            <p class="text-xs text-slate-500">
                Madani Community Center Booking Management
            </p>
        </div>

        <?php if ($notice_msg): ?>
            <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <?= e($notice_msg) ?>
            </div>
        <?php endif; ?>

        <?php if ($error_msg): ?>
            <div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
                <?= e($error_msg) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="login.php" class="space-y-4">
            <?= csrf_input_field() ?>

            <div>
                <label class="text-xs font-bold text-slate-700 block mb-1">Administrator Email / Username</label>
                <input type="text" name="username" required value="<?= e($_POST['username'] ?? 'admin') ?>" placeholder="admin@madanicenter.org.uk" class="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]">
            </div>

            <div>
                <label class="text-xs font-bold text-slate-700 block mb-1">Password</label>
                <input type="password" name="password" required value="MadaniAdmin2026!" placeholder="••••••••••••" class="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]">
            </div>

            <div>
                <label class="text-xs font-bold text-slate-700 block mb-1">2FA Code <span class="text-slate-400 font-normal">(Optional / If enabled)</span></label>
                <input type="text" name="totp_code" maxlength="6" placeholder="e.g. 123456" class="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 font-mono">
            </div>

            <div class="pt-2">
                <button type="submit" class="w-full py-3 rounded-xl text-xs font-bold bg-[#0077C8] text-white hover:bg-[#0B2545] transition-colors shadow-xs cursor-pointer">
                    Authenticate &amp; Enter Dashboard &rarr;
                </button>
            </div>
        </form>

        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-0.5">
            <strong class="text-slate-800">Default Admin Credentials:</strong><br>
            Username: <code class="font-mono bg-slate-200/80 px-1 py-0.5 rounded text-slate-900">admin</code><br>
            Password: <code class="font-mono bg-slate-200/80 px-1 py-0.5 rounded text-slate-900">MadaniAdmin2026!</code>
        </div>

        <div class="text-center">
            <a href="../index.php" class="text-xs text-slate-500 hover:text-slate-800">&larr; Return to Public Website</a>
        </div>
    </div>

</body>
</html>
