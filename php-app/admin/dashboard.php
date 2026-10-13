<?php
define('APP_ROOT', dirname(__DIR__));
$page_title = "Overview & Metrics";
require_once APP_ROOT . '/admin/header.php';

// Calculate KPIs
$total_bookings = (int)$pdo->query("SELECT COUNT(*) FROM bookings")->fetchColumn();
$pending_count = (int)$pdo->query("SELECT COUNT(*) FROM bookings WHERE status = 'pending'")->fetchColumn();
$confirmed_count = (int)$pdo->query("SELECT COUNT(*) FROM bookings WHERE status = 'confirmed'")->fetchColumn();
$cancelled_count = (int)$pdo->query("SELECT COUNT(*) FROM bookings WHERE status IN ('cancelled', 'rejected')")->fetchColumn();
$total_revenue = (float)$pdo->query("SELECT COALESCE(SUM(total_cost), 0) FROM bookings WHERE status = 'confirmed'")->fetchColumn();

// Fetch Pending Requests requiring coordinator attention
$pending_stmt = $pdo->query("SELECT b.*, f.name as facility_name, c.full_name, c.email, c.phone, c.organisation 
    FROM bookings b 
    JOIN facilities f ON b.facility_id = f.id 
    JOIN customers c ON b.customer_id = c.id 
    WHERE b.status = 'pending' 
    ORDER BY b.booking_date ASC LIMIT 10");
$pending_requests = $pending_stmt->fetchAll();

// Fetch Upcoming Confirmed Bookings
$upcoming_stmt = $pdo->query("SELECT b.*, f.name as facility_name, c.full_name, c.phone 
    FROM bookings b 
    JOIN facilities f ON b.facility_id = f.id 
    JOIN customers c ON b.customer_id = c.id 
    WHERE b.status = 'confirmed' AND b.booking_date >= CURDATE() 
    ORDER BY b.booking_date ASC, b.start_time ASC LIMIT 6");
$upcoming_events = $upcoming_stmt->fetchAll();
?>

<div class="space-y-8">
    <!-- Header Summary & CSV Export -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h2 class="text-2xl font-serif-brand font-bold text-[#182B1C]">
                Administrative Dashboard
            </h2>
            <p class="text-xs text-stone-500">Live booking statistics, real-time requests, and calendar overviews.</p>
        </div>

        <div class="flex items-center gap-2">
            <a href="export-csv.php?csrf=<?= e(get_csrf_token()) ?>" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 transition-colors shadow-xs">
                <span>Export Bookings to CSV</span>
            </a>
            <a href="add-booking.php" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#182B1C] text-white hover:bg-[#253f2a] transition-colors shadow-xs">
                <span>+ Add Manual Booking</span>
            </a>
        </div>
    </div>

    <!-- 5 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
            <span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">Total Requests</span>
            <div class="text-3xl font-extrabold text-[#182B1C]"><?= $total_bookings ?></div>
            <span class="text-[10px] text-stone-500">All recorded requests</span>
        </div>

        <div class="p-5 rounded-3xl bg-amber-50 border border-amber-200 shadow-xs space-y-2">
            <span class="text-[11px] font-bold uppercase tracking-wider text-amber-800 block flex items-center justify-between">
                <span>Pending Approval</span>
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            </span>
            <div class="text-3xl font-extrabold text-amber-900"><?= $pending_count ?></div>
            <span class="text-[10px] text-amber-700">Awaiting coordinator review</span>
        </div>

        <div class="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-xs space-y-2">
            <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">Confirmed</span>
            <div class="text-3xl font-extrabold text-emerald-900"><?= $confirmed_count ?></div>
            <span class="text-[10px] text-emerald-700">Calendar space secured</span>
        </div>

        <div class="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
            <span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">Cancelled</span>
            <div class="text-3xl font-extrabold text-stone-700"><?= $cancelled_count ?></div>
            <span class="text-[10px] text-stone-500">Released time slots</span>
        </div>

        <div class="p-5 rounded-3xl bg-[#142318] text-white border border-[#273E2C] shadow-xs space-y-2">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#B8C053] block">Confirmed Revenue</span>
            <div class="text-3xl font-extrabold text-white">£<?= number_format($total_revenue, 0) ?></div>
            <span class="text-[10px] text-stone-300">Excluding deposit bonds</span>
        </div>
    </div>

    <!-- Priority Queue: Pending Approvals -->
    <div class="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
                <h3 class="text-base font-bold text-[#182B1C]">Bookings Awaiting Approval (<?= count($pending_requests) ?>)</h3>
                <p class="text-xs text-stone-500">Public customer requests requiring confirmation or rejection</p>
            </div>
            <?php if (!empty($pending_requests)): ?>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Review Required</span>
            <?php endif; ?>
        </div>

        <?php if (empty($pending_requests)): ?>
            <div class="py-8 text-center text-xs text-stone-400">
                &check; No pending approvals at this time. All submissions have been addressed.
            </div>
        <?php else: ?>
            <div class="divide-y divide-stone-100">
                <?php foreach ($pending_requests as $req): ?>
                    <div class="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="space-y-1">
                            <div class="flex items-center gap-2">
                                <span class="font-mono text-xs font-bold bg-stone-100 px-2 py-0.5 rounded text-[#182B1C]"><?= e($req['reference']) ?></span>
                                <strong class="text-sm text-stone-900"><?= e($req['full_name']) ?></strong>
                                <?php if (!empty($req['organisation'])): ?>
                                    <span class="text-xs text-stone-500">(<?= e($req['organisation']) ?>)</span>
                                <?php endif; ?>
                            </div>
                            <p class="text-xs text-stone-600">
                                <?= e($req['facility_name']) ?> &bull; <strong><?= e($req['booking_date']) ?></strong> (<?= e($req['start_time']) ?> &ndash; <?= e($req['finish_time']) ?>) &bull; £<?= number_format($req['total_cost'], 2) ?>
                            </p>
                            <p class="text-[11px] text-stone-500 italic">"<?= e($req['event_type']) ?>" &bull; <?= (int)$req['attendees'] ?> attendees</p>
                        </div>

                        <div class="flex items-center gap-2 shrink-0">
                            <a href="booking-details.php?id=<?= (int)$req['id'] ?>" class="px-3.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors">
                                Review &amp; Actions &rarr;
                            </a>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

    <!-- Upcoming Events Timeline -->
    <div class="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
        <h3 class="text-base font-bold text-[#182B1C] border-b border-stone-100 pb-3">Upcoming Confirmed Events</h3>
        <?php if (empty($upcoming_events)): ?>
            <p class="text-xs text-stone-400 py-4 text-center">No upcoming events scheduled.</p>
        <?php else: ?>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <?php foreach ($upcoming_events as $ev): ?>
                    <div class="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-1.5 text-xs">
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-[#182B1C]"><?= e($ev['booking_date']) ?></span>
                            <span class="text-[10px] font-mono text-stone-500"><?= e($ev['start_time']) ?>-<?= e($ev['finish_time']) ?></span>
                        </div>
                        <strong class="text-sm text-stone-900 block"><?= e($ev['event_type']) ?></strong>
                        <span class="text-stone-600 block"><?= e($ev['facility_name']) ?> &bull; <?= e($ev['full_name']) ?></span>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php require_once APP_ROOT . '/admin/footer.php'; ?>
