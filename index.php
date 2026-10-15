<?php
/**
 * Madani Community Center - Root Gateway
 * Seamlessly routes to php-app/ whether accessed as:
 * - http://localhost/mcm/
 * - http://localhost/mcm/index.php
 */
if (file_exists(__DIR__ . '/php-app/index.php')) {
    $qs = !empty($_SERVER['QUERY_STRING']) ? '?' . $_SERVER['QUERY_STRING'] : '';
    // Send 302 Found redirect to php-app/
    header("Location: php-app/index.php" . $qs);
    exit;
} elseif (file_exists(__DIR__ . '/includes/header.php')) {
    // The user moved php-app files directly into root
    define('APP_ROOT', __DIR__);
    require_once __DIR__ . '/includes/header.php';
} else {
    header("Content-Type: text/html; charset=UTF-8");
    echo "<!DOCTYPE html><html><head><title>Madani Community Center - Setup Guide</title>";
    echo "<style>body{font-family:sans-serif;max-width:640px;margin:50px auto;padding:24px;line-height:1.6;color:#1e293b;background:#f8fafc;border-radius:16px;border:1px solid #cbd5e1;}</style></head><body>";
    echo "<h2 style='color:#0B2545;margin-top:0;'>Madani Community Center Setup</h2>";
    echo "<p><strong>Missing PHP files:</strong> Apache found this gateway, but the application files from <code>php-app/</code> are not present in this folder.</p>";
    echo "<p>Please copy all contents of the <code>php-app/</code> folder into your Apache directory: <code>htdocs/mcm/</code>.</p>";
    echo "</body></html>";
    exit;
}
