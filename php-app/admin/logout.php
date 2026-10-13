<?php
define('APP_ROOT', dirname(__DIR__));
require_once APP_ROOT . '/config/database.php';
require_once APP_ROOT . '/config/security.php';

if (!empty($_SESSION['admin_logged_in'])) {
    $admin_email = $_SESSION['admin_email'] ?? 'Admin';
    log_audit_event($pdo, 'LOGOUT', 'auth', null, "Admin {$admin_email} logged out");
}

// Invalidate all session variables
$_SESSION = [];

// Destroy session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Destroy session
session_destroy();

header("Location: login.php");
exit;
