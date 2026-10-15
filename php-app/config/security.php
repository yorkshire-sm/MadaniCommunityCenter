<?php
/**
 * Core Security Module
 * Enforces OWASP recommendations, CSRF tokens, session hardening, security headers,
 * XSS escaping, brute-force rate-limiting, and server-side authorization checks.
 */

// 1. Enforce Secure Session Cookie Configuration before starting session
if (session_status() === PHP_SESSION_NONE) {
    // Only send cookie over HTTPS if HTTPS is currently active
    $is_https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);

    ini_set('session.use_strict_mode', 1);
    ini_set('session.use_only_cookies', 1);

    session_set_cookie_params([
        'lifetime' => 0, // Until browser closes
        'path' => '/',
        'domain' => '',
        'secure' => $is_https,
        'httponly' => true, // Prevents JavaScript document.cookie access (XSS defense)
        'samesite' => 'Strict', // Mitigates CSRF attacks
    ]);

    session_start();
}

// 2. Set Defensive HTTP Security Headers
header("X-Frame-Options: SAMEORIGIN");
header("X-Content-Type-Options: nosniff");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Permissions-Policy: camera=(), microphone=(), geolocation=()");

// Content-Security-Policy tailored for Apache/IONOS deployment (includes connect-src for Tailwind browser CDN source maps)
header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://www.google.com https://maps.google.com; connect-src 'self' https://cdn.jsdelivr.net;");

if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
    header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
}

// 3. XSS Context Escaper Helper
function e(?string $string): string {
    return htmlspecialchars($string ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

// 4. CSRF Token Generation & Verification
function get_csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf_token(?string $token): bool {
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    // Timing-attack safe comparison
    return hash_equals($_SESSION['csrf_token'], $token);
}

function csrf_input_field(): string {
    $token = e(get_csrf_token());
    return '<input type="hidden" name="csrf_token" value="' . $token . '">';
}

// 5. Inactivity Timeout (15 minutes)
function check_session_timeout(int $timeout_seconds = 900): void {
    if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
        if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $timeout_seconds)) {
            // Log session expiration
            session_unset();
            session_destroy();
            header("Location: login.php?msg=session_expired");
            exit;
        }
        $_SESSION['last_activity'] = time();
    }
}

// 6. Server-Side Authentication Guard for Admin Dashboard
function require_admin_auth(): void {
    check_session_timeout();

    if (empty($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true || empty($_SESSION['admin_id'])) {
        // Disallow cached copies of admin pages
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Pragma: no-cache");
        header("Location: login.php");
        exit;
    }
}

// 7. Role-Based Authorization Guard
function require_admin_role(array $allowed_roles): void {
    require_admin_auth();
    $user_role = $_SESSION['admin_role'] ?? 'coordinator';
    if (!in_array($user_role, $allowed_roles, true)) {
        http_response_code(403);
        die("403 Forbidden: Your administrative account does not have sufficient permissions for this action.");
    }
}

// 8. Client IP Helper
function get_client_ip(): string {
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        return filter_var($_SERVER['HTTP_CF_CONNECTING_IP'], FILTER_VALIDATE_IP) ?: '127.0.0.1';
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $ip = trim($ips[0]);
        if (filter_var($ip, FILTER_VALIDATE_IP)) {
            return $ip;
        }
    }
    return filter_var($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1', FILTER_VALIDATE_IP) ?: '127.0.0.1';
}

// 9. Login Rate Limiter (Protects against brute force)
function check_rate_limit(PDO $pdo, string $action_key, int $max_attempts = 5, int $block_seconds = 60): bool {
    try {
        $ip = get_client_ip();
        $now = date('Y-m-d H:i:s');

        // Clean expired blocks
        $pdo->prepare("DELETE FROM rate_limits WHERE blocked_until IS NOT NULL AND blocked_until < :now")->execute([':now' => $now]);

        $stmt = $pdo->prepare("SELECT attempt_count, blocked_until FROM rate_limits WHERE ip_address = :ip AND action_key = :action LIMIT 1");
        $stmt->execute([':ip' => $ip, ':action' => $action_key]);
        $record = $stmt->fetch();

        if ($record && !empty($record['blocked_until']) && $record['blocked_until'] > $now) {
            return false; // Still blocked
        }

        return true;
    } catch (Throwable $e) {
        // Log warning and allow auth to proceed rather than crashing with 500
        error_log("Rate limit check warning: " . $e->getMessage());
        return true;
    }
}

function record_failed_attempt(PDO $pdo, string $action_key, int $max_attempts = 5, int $block_seconds = 60): void {
    try {
        $ip = get_client_ip();
        $now = date('Y-m-d H:i:s');

        $stmt = $pdo->prepare("SELECT attempt_count FROM rate_limits WHERE ip_address = :ip AND action_key = :action LIMIT 1");
        $stmt->execute([':ip' => $ip, ':action' => $action_key]);
        $record = $stmt->fetch();

        if ($record) {
            $new_attempts = $record['attempt_count'] + 1;
            $blocked_until = ($new_attempts >= $max_attempts) ? date('Y-m-d H:i:s', time() + $block_seconds) : null;

            $pdo->prepare("UPDATE rate_limits SET attempt_count = :count, last_attempt_at = :now, blocked_until = :blocked WHERE ip_address = :ip AND action_key = :action")
                ->execute([
                    ':count' => $new_attempts,
                    ':now' => $now,
                    ':blocked' => $blocked_until,
                    ':ip' => $ip,
                    ':action' => $action_key,
                ]);
        } else {
            $pdo->prepare("INSERT INTO rate_limits (ip_address, action_key, attempt_count, last_attempt_at) VALUES (:ip, :action, 1, :now)")
                ->execute([':ip' => $ip, ':action' => $action_key, ':now' => $now]);
        }
    } catch (Throwable $e) {
        error_log("Record failed attempt warning: " . $e->getMessage());
    }
}

function reset_rate_limit(PDO $pdo, string $action_key): void {
    try {
        $ip = get_client_ip();
        $pdo->prepare("DELETE FROM rate_limits WHERE ip_address = :ip AND action_key = :action")->execute([':ip' => $ip, ':action' => $action_key]);
    } catch (Throwable $e) {
        error_log("Reset rate limit warning: " . $e->getMessage());
    }
}

// 10. Audit Log Helper
function log_audit_event(PDO $pdo, string $action, string $target_type, ?string $target_id, string $details): void {
    try {
        $admin_user = $_SESSION['admin_email'] ?? $_SESSION['admin_username'] ?? 'System/Public';
        $ip = get_client_ip();

        $stmt = $pdo->prepare("INSERT INTO audit_logs (admin_user, action, target_type, target_id, details, ip_address) VALUES (:user, :action, :type, :id, :details, :ip)");
        $stmt->execute([
            ':user' => $admin_user,
            ':action' => $action,
            ':type' => $target_type,
            ':id' => $target_id,
            ':details' => $details,
            ':ip' => $ip,
        ]);
    } catch (Throwable $e) {
        // If audit table missing, fail gracefully so critical workflows don't crash
        error_log("Audit log warning: " . $e->getMessage());
    }
}
