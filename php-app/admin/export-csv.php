<?php
define('APP_ROOT', dirname(__DIR__));
require_once APP_ROOT . '/config/database.php';
require_once APP_ROOT . '/config/security.php';

require_admin_auth();

// Verify CSRF Token
$token = $_GET['csrf'] ?? '';
if (!verify_csrf_token($token)) {
    http_response_code(403);
    die("Security verification failed (Invalid CSRF Token).");
}

log_audit_event($pdo, 'CSV_EXPORT', 'booking', null, "Exported all booking records to CSV");

header('Content-Type: text/csv; charset=UTF-8');
header('Content-Disposition: attachment; filename="madani_bookings_' . date('Y-m-d') . '.csv"');
header('Pragma: no-cache');
header('Expires: 0');

$output = fopen('php://output', 'w');

// UTF-8 BOM for Excel compatibility
fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

fputcsv($output, [
    'Reference', 'Status', 'Date', 'Start Time', 'Finish Time',
    'Facility', 'Customer Name', 'Email', 'Phone', 'Organisation',
    'Event Type', 'Attendees', 'Total (£)', 'Deposit (£)', 'Created At'
]);

$stmt = $pdo->query("SELECT b.*, f.name as facility_name, c.full_name, c.email, c.phone, c.organisation 
    FROM bookings b 
    JOIN facilities f ON b.facility_id = f.id 
    JOIN customers c ON b.customer_id = c.id 
    ORDER BY b.booking_date DESC");

while ($row = $stmt->fetch()) {
    fputcsv($output, [
        $row['reference'],
        strtoupper($row['status']),
        $row['booking_date'],
        $row['start_time'],
        $row['finish_time'],
        $row['facility_name'],
        $row['full_name'],
        $row['email'],
        $row['phone'],
        $row['organisation'] ?? '',
        $row['event_type'],
        $row['attendees'],
        $row['total_cost'],
        $row['hourly_rate'],
        $row['created_at'],
    ]);
}

fclose($output);
exit;
