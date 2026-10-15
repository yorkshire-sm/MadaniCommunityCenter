<?php
if (!defined('APP_ROOT')) {
    define('APP_ROOT', dirname(__DIR__));
}
require_once APP_ROOT . '/config/database.php';
require_once APP_ROOT . '/config/security.php';

// Enforce server-side authentication check on EVERY admin page
require_admin_auth();

// Anti-caching headers for admin dashboard pages
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

$admin_user = $_SESSION['admin_username'] ?? 'Admin';
$admin_email = $_SESSION['admin_email'] ?? '';
$admin_role = $_SESSION['admin_role'] ?? 'coordinator';

$current_page = basename($_SERVER['PHP_SELF'], '.php');

// Count pending requests safely
$pending_count = 0;
try {
    if (!empty($pdo)) {
        $pending_count = (int)$pdo->query("SELECT COUNT(*) FROM bookings WHERE status = 'pending'")->fetchColumn();
    }
} catch (Throwable $e) {
    $pending_count = 0;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title><?= isset($page_title) ? e($page_title) . ' - ' : '' ?>Admin Dashboard | Madani Community Center</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style>
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .font-serif-brand { font-family: 'Playfair Display', Georgia, serif; }
    </style>
</head>
<body class="bg-[#F8FAFC] text-slate-900 antialiased min-h-screen flex flex-col">

    <!-- Top Admin Security Bar -->
    <header class="bg-[#0B2545] text-white border-b border-[#143A66] py-3 px-4 sm:px-6">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
                <a href="dashboard.php" class="flex items-center gap-2">
                    <span class="w-8 h-8 rounded-lg bg-[#00A896] text-white flex items-center justify-center font-bold text-xs">MCC</span>
                    <span class="font-bold text-sm tracking-tight">Madani Admin Portal</span>
                </a>
                <span class="text-[11px] text-slate-400 hidden sm:inline">&bull; Role: <?= e($admin_role) ?> &bull; Session Secure</span>
            </div>

            <div class="flex items-center gap-3 text-xs">
                <a href="../index.php" target="_blank" class="text-slate-300 hover:text-white transition-colors">
                    View Public Site &rarr;
                </a>
                <a href="logout.php" class="px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white font-semibold transition-colors">
                    Logout
                </a>
            </div>
        </div>
    </header>

    <!-- Admin Navigation Links -->
    <nav class="bg-white border-b border-slate-200 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-2 text-xs font-semibold">
            <a href="dashboard.php" class="px-3.5 py-2 rounded-xl transition-colors <?= $current_page === 'dashboard' ? 'bg-[#0B2545] text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' ?>">
                Overview &amp; KPIs
            </a>
            <a href="bookings.php" class="px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 <?= $current_page === 'bookings' || $current_page === 'booking-details' ? 'bg-[#0B2545] text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' ?>">
                <span>Bookings</span>
                <?php if ($pending_count > 0): ?>
                    <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold"><?= $pending_count ?></span>
                <?php endif; ?>
            </a>
            <a href="blocked-dates.php" class="px-3.5 py-2 rounded-xl transition-colors <?= $current_page === 'blocked-dates' ? 'bg-[#0B2545] text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' ?>">
                Booked Slots
            </a>
            <a href="facilities.php" class="px-3.5 py-2 rounded-xl transition-colors <?= $current_page === 'facilities' ? 'bg-[#0B2545] text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' ?>">
                Facilities &amp; Pricing
            </a>
            <a href="audit-log.php" class="px-3.5 py-2 rounded-xl transition-colors <?= $current_page === 'audit-log' ? 'bg-[#0B2545] text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' ?>">
                Security &amp; Audit Log
            </a>
            <a href="gdpr.php" class="px-3.5 py-2 rounded-xl transition-colors <?= $current_page === 'gdpr' ? 'bg-[#0B2545] text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' ?>">
                GDPR / Privacy
            </a>
        </div>
    </nav>

    <!-- Admin Main Body -->
    <main class="flex-1 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
