<?php
define('APP_ROOT', dirname(__DIR__));
require_once APP_ROOT . '/config/database.php';
require_once APP_ROOT . '/config/security.php';

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-cache, must-revalidate');

$facility_id = trim($_GET['facility_id'] ?? 'all');
$month = trim($_GET['month'] ?? date('Y-m'));

if (!preg_match('/^\d{4}-\d{2}$/', $month)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid month format (expected YYYY-MM)']);
    exit;
}

$start_date = "{$month}-01";
$end_date = date('Y-m-t', strtotime($start_date));

try {
    // 1. Fetch blocked dates in this month
    $blk_sql = "SELECT blocked_date, reason FROM blocked_dates 
                WHERE blocked_date BETWEEN :start AND :end 
                AND (facility_id = 'all' OR facility_id = :fac_id)";
    $blk_stmt = $pdo->prepare($blk_sql);
    $blk_stmt->execute([':start' => $start_date, ':end' => $end_date, ':fac_id' => $facility_id]);
    $blocked = $blk_stmt->fetchAll();

    // 2. Fetch confirmed bookings in this month (NO customer data returned)
    $bkg_sql = "SELECT booking_date, start_time, finish_time FROM bookings 
                WHERE booking_date BETWEEN :start AND :end 
                AND status = 'confirmed'";
    if ($facility_id !== 'all') {
        $bkg_sql .= " AND facility_id = :fac_id";
    }

    $bkg_stmt = $pdo->prepare($bkg_sql);
    $bkg_params = [':start' => $start_date, ':end' => $end_date];
    if ($facility_id !== 'all') {
        $bkg_params[':fac_id'] = $facility_id;
    }
    $bkg_stmt->execute($bkg_params);
    $confirmed = $bkg_stmt->fetchAll();

    echo json_encode([
        'month' => $month,
        'blocked_dates' => $blocked,
        'confirmed_slots' => $confirmed,
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Unable to query availability']);
}
