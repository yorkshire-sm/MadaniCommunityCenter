<?php
/**
 * Root-level Database.php compatibility wrapper for local setups
 */
if (file_exists(__DIR__ . '/php-app/config/database.php')) {
    require_once __DIR__ . '/php-app/config/database.php';
} elseif (file_exists(__DIR__ . '/config/database.php')) {
    require_once __DIR__ . '/config/database.php';
}
