<?php
/**
 * Database Connection & PDO Wrapper
 * Compatible with local Apache (XAMPP/MAMP/WAMP) and IONOS MySQL Hosting.
 * 
 * Security Measures:
 * - Uses PDO prepared statements exclusively to prevent SQL injection.
 * - Forces UTF-8 mb4 charset to avoid multibyte character exploits.
 * - Disables emulated prepared statements.
 * - Suppresses technical database error traces in production.
 */

// Production configuration: change these to match your local or IONOS database credentials
$db_host = getenv('DB_HOST') ?: 'localhost';
$db_port = getenv('DB_PORT') ?: '3306';
$db_name = getenv('DB_NAME') ?: 'madani_booking_db';
$db_user = getenv('DB_USER') ?: 'root';
$db_pass = getenv('DB_PASS') ?: '';

// Application Environment: 'development' or 'production'
$app_env = getenv('APP_ENV') ?: 'production';

try {
    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
    ];

    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
} catch (PDOException $e) {
    // Log technical error securely to server error log
    error_log("Database connection failure: " . $e->getMessage());

    if ($app_env === 'development') {
        die("Database Connection Error (Dev Mode): " . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8'));
    } else {
        // OWASP best practice: Generic error message to visitors, no stack trace or database names revealed
        http_response_code(500);
        die("The system is currently unavailable due to maintenance. Please try again shortly or contact the center directly.");
    }
}

/**
 * Helper function to safely execute prepared queries
 */
function db_query(PDO $pdo, string $sql, array $params = []): PDOStatement {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt;
}
