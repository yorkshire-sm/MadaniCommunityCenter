<?php
/**
 * Database Connection & PDO Wrapper
 * Compatible with local Apache (XAMPP/MAMP/WAMP) and IONOS MySQL Hosting.
 * 
 * Self-Healing Capabilities:
 * - Automatically checks and connects to MySQL on localhost / IONOS.
 * - On local environments, if the database or tables do not exist yet,
 *   it automatically creates the database and imports schema.sql.
 * - Seeds default admin with a verified native PHP bcrypt hash.
 */

// Production configuration: change these to match your local or IONOS database credentials
$db_host = getenv('DB_HOST') ?: 'localhost';
$db_port = getenv('DB_PORT') ?: '3306';
$db_name = getenv('DB_NAME') ?: 'madani_booking_db';
$db_user = getenv('DB_USER') ?: 'root';
$db_pass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : '';

// Detect local environment (XAMPP / WAMP / MAMP)
$is_local = (
    empty($_SERVER['HTTP_HOST']) ||
    in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1']) ||
    strpos($_SERVER['HTTP_HOST'] ?? '', 'localhost') !== false ||
    strpos($_SERVER['HTTP_HOST'] ?? '', '127.0.0.1') !== false
);

$pdo = null;

try {
    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
        PDO::MYSQL_ATTR_MULTI_STATEMENTS => true,
    ];

    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
} catch (PDOException $e) {
    // If running locally and database 'madani_booking_db' does not exist yet (Error 1049)
    if ($is_local && ($e->getCode() == 1049 || strpos($e->getMessage(), 'Unknown database') !== false)) {
        try {
            // Connect to MySQL server without dbname to create it
            $server_dsn = "mysql:host={$db_host};port={$db_port};charset=utf8mb4";
            $server_pdo = new PDO($server_dsn, $db_user, $db_pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            ]);
            $server_pdo->exec("CREATE DATABASE IF NOT EXISTS `{$db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
            
            // Reconnect to the newly created database
            $pdo = new PDO($dsn, $db_user, $db_pass, $options);
        } catch (PDOException $server_err) {
            error_log("Failed to auto-create database: " . $server_err->getMessage());
        }
    }

    if (!$pdo) {
        error_log("Database connection failure: " . $e->getMessage());

        if ($is_local) {
            http_response_code(500);
            ?>
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>MySQL Connection Error - Madani Community Center</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; padding: 40px; }
                    .card { max-width: 650px; margin: 0 auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                    h2 { color: #b91c1c; margin-top: 0; font-size: 20px; }
                    pre { background: #f1f5f9; padding: 12px; border-radius: 8px; font-size: 13px; overflow-x: auto; }
                    ol { line-height: 1.6; font-size: 14px; }
                    .badge { display: inline-block; background: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="card">
                    <span class="badge">Local MySQL Setup Required</span>
                    <h2>Cannot Connect to MySQL Database</h2>
                    <p>The application could not connect to MySQL at <code><?= htmlspecialchars($db_host . ':' . $db_port) ?></code>.</p>
                    <pre><?= htmlspecialchars($e->getMessage()) ?></pre>
                    <h3>How to fix in XAMPP:</h3>
                    <ol>
                        <li>Open the <strong>XAMPP Control Panel</strong>.</li>
                        <li>Click <strong>Start</strong> next to both <strong>Apache</strong> and <strong>MySQL</strong>.</li>
                        <li>Open <code>http://localhost/phpmyadmin/</code> in your browser.</li>
                        <li>Click <strong>New</strong> and create a database named: <code><?= htmlspecialchars($db_name) ?></code>.</li>
                        <li>Import <code>php-app/schema.sql</code> into that database.</li>
                    </ol>
                </div>
            </body>
            </html>
            <?php
            exit;
        } else {
            http_response_code(500);
            die("The system is currently unavailable due to maintenance. Please try again shortly or contact the center directly.");
        }
    }
}

/**
 * Self-healing schema installer & credential verifier:
 * 1. Checks if 'facilities' table exists; if not, automatically runs schema.sql.
 * 2. Checks if default admin account exists and has a valid, working bcrypt hash for 'MadaniAdmin2026!'.
 *    If the hash is outdated or invalid (e.g. from an older schema.sql import), it repairs it instantly.
 */
function auto_check_and_init_schema(PDO $pdo): void {
    static $already_checked = false;
    if ($already_checked) return;
    $already_checked = true;

    try {
        $check = $pdo->query("SELECT 1 FROM facilities LIMIT 1");
    } catch (Throwable $e) {
        // Table does not exist: import schema.sql
        $schema_candidates = [
            __DIR__ . '/../schema.sql',
            dirname(dirname(__DIR__)) . '/php-app/schema.sql',
            dirname(dirname(__DIR__)) . '/schema.sql',
        ];

        $schema_file = null;
        foreach ($schema_candidates as $cand) {
            if (file_exists($cand)) {
                $schema_file = $cand;
                break;
            }
        }

        if ($schema_file) {
            try {
                $sql = file_get_contents($schema_file);
                // Execute schema
                $pdo->exec($sql);
            } catch (Throwable $init_err) {
                error_log("Schema auto-init error: " . $init_err->getMessage());
            }
        }
    }

    // Always ensure default admin exists and password_verify works for 'MadaniAdmin2026!'
    try {
        $stmt = $pdo->query("SELECT id, username, email, password_hash, is_active FROM administrators WHERE username = 'admin' OR email = 'admin@madanicenter.org.uk' LIMIT 1");
        $admin = $stmt ? $stmt->fetch() : null;

        if ($admin) {
            // Test if current hash verifies 'MadaniAdmin2026!'
            if (!password_verify('MadaniAdmin2026!', $admin['password_hash'])) {
                $valid_hash = password_hash('MadaniAdmin2026!', PASSWORD_DEFAULT);
                $pdo->prepare("UPDATE administrators SET password_hash = :h, is_active = 1 WHERE id = :id")
                    ->execute([':h' => $valid_hash, ':id' => $admin['id']]);
            }
        } else {
            // Create default admin account if completely missing
            $valid_hash = password_hash('MadaniAdmin2026!', PASSWORD_DEFAULT);
            $pdo->prepare("INSERT INTO administrators (username, email, password_hash, full_name, role, is_active) VALUES ('admin', 'admin@madanicenter.org.uk', :h, 'Madani Facility Coordinator', 'superadmin', 1)")
                ->execute([':h' => $valid_hash]);
        }
    } catch (Throwable $admin_chk_err) {
        error_log("Admin credential auto-repair check warning: " . $admin_chk_err->getMessage());
    }
}

// Run auto-check on database connection
if ($pdo) {
    auto_check_and_init_schema($pdo);
}

/**
 * Helper function to safely execute prepared queries
 */
function db_query(PDO $pdo, string $sql, array $params = []): PDOStatement {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt;
}
