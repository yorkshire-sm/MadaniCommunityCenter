<?php
define('APP_ROOT', dirname(__DIR__));
$page_title = "Manage Bookings";
require_once APP_ROOT . '/admin/header.php';

// Filter Parameters
$status = trim($_GET['status'] ?? 'all');
$facility_id = trim($_GET['facility'] ?? 'all');
$q = trim($_GET['q'] ?? '');

$sql = "SELECT b.*, f.name as facility_name, c.full_name, c.email, c.phone, c.organisation 
        FROM bookings b 
        JOIN facilities f ON b.facility_id = f.id 
        JOIN customers c ON b.customer_id = c.id 
        WHERE 1=1";
$params = [];

if ($status !== 'all') {
    $sql .= " AND b.status = :status";
    $params[':status'] = $status;
}

if ($facility_id !== 'all') {
    $sql .= " AND b.facility_id = :fac_id";
    $params[':fac_id'] = $facility_id;
}

if (!empty($q)) {
    $sql .= " AND (b.reference LIKE :q OR c.full_name LIKE :q OR c.email LIKE :q OR c.organisation LIKE :q)";
    $params[':q'] = "%{$q}%";
}

$sql .= " ORDER BY b.booking_date DESC, b.start_time DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$bookings = $stmt->fetchAll();

$fac_stmt = $pdo->query("SELECT id, name FROM facilities ORDER BY name ASC");
$all_facilities = $fac_stmt->fetchAll();
?>

<div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h2 class="text-2xl font-serif-brand font-bold text-[#182B1C]">Booking Records</h2>
            <p class="text-xs text-stone-500">Search, review customer contact information, and approve/reject requests.</p>
        </div>
        <div class="flex items-center gap-2">
            <a href="export-csv.php?csrf=<?= e(get_csrf_token()) ?>" class="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 transition-colors shadow-xs">
                Export to CSV
            </a>
            <a href="add-booking.php" class="px-4 py-2 rounded-xl text-xs font-bold bg-[#182B1C] text-white hover:bg-[#253f2a] transition-colors shadow-xs">
                + Add Booking
            </a>
        </div>
    </div>

    <!-- Filter Form -->
    <form method="GET" action="bookings.php" class="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <input type="text" name="q" value="<?= e($q) ?>" placeholder="Search reference, customer, email..." class="flex-1 min-w-[200px] py-2 px-3 rounded-xl border border-stone-300">
        
        <select name="status" class="py-2 px-3 rounded-xl border border-stone-300 bg-stone-50">
            <option value="all" <?= $status === 'all' ? 'selected' : '' ?>>All Statuses</option>
            <option value="pending" <?= $status === 'pending' ? 'selected' : '' ?>>Pending Approval</option>
            <option value="confirmed" <?= $status === 'confirmed' ? 'selected' : '' ?>>Confirmed</option>
            <option value="rejected" <?= $status === 'rejected' ? 'selected' : '' ?>>Rejected</option>
            <option value="cancelled" <?= $status === 'cancelled' ? 'selected' : '' ?>>Cancelled</option>
        </select>

        <select name="facility" class="py-2 px-3 rounded-xl border border-stone-300 bg-stone-50">
            <option value="all">All Facilities</option>
            <?php foreach ($all_facilities as $f): ?>
                <option value="<?= e($f['id']) ?>" <?= $facility_id === $f['id'] ? 'selected' : '' ?>><?= e($f['name']) ?></option>
            <?php endforeach; ?>
        </select>

        <button type="submit" class="px-4 py-2 rounded-xl bg-stone-800 text-white font-semibold hover:bg-stone-900 cursor-pointer">
            Filter
        </button>
        <?php if (!empty($q) || $status !== 'all' || $facility_id !== 'all'): ?>
            <a href="bookings.php" class="text-xs text-stone-500 hover:text-stone-800">Reset</a>
        <?php endif; ?>
    </form>

    <!-- Data Table -->
    <div class="rounded-3xl border border-stone-200 bg-white shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
                <thead>
                    <tr class="border-b border-stone-200 bg-stone-50 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                        <th class="py-3 px-4">Reference</th>
                        <th class="py-3 px-4">Customer</th>
                        <th class="py-3 px-4">Facility</th>
                        <th class="py-3 px-4">Date &amp; Times</th>
                        <th class="py-3 px-4">Total Fee</th>
                        <th class="py-3 px-4">Status</th>
                        <th class="py-3 px-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-stone-100 text-stone-700">
                    <?php if (empty($bookings)): ?>
                        <tr><td colspan="7" class="py-8 text-center text-stone-400">No bookings match the specified criteria.</td></tr>
                    <?php else: ?>
                        <?php foreach ($bookings as $b): ?>
                            <tr class="hover:bg-stone-50/70 transition-colors">
                                <td class="py-3.5 px-4 font-mono font-bold text-[#182B1C]"><?= e($b['reference']) ?></td>
                                <td class="py-3.5 px-4">
                                    <strong class="text-stone-900 block"><?= e($b['full_name']) ?></strong>
                                    <span class="text-[10px] text-stone-500"><?= e($b['email']) ?> &bull; <?= e($b['phone']) ?></span>
                                </td>
                                <td class="py-3.5 px-4">
                                    <span class="font-medium text-stone-800"><?= e($b['facility_name']) ?></span>
                                    <span class="block text-[10px] text-stone-400"><?= e($b['event_type']) ?></span>
                                </td>
                                <td class="py-3.5 px-4">
                                    <span class="font-semibold text-stone-900"><?= e($b['booking_date']) ?></span>
                                    <span class="block text-[10px] text-stone-500"><?= e($b['start_time']) ?> &ndash; <?= e($b['finish_time']) ?></span>
                                </td>
                                <td class="py-3.5 px-4 font-bold text-stone-900">£<?= number_format($b['total_cost'], 2) ?></td>
                                <td class="py-3.5 px-4">
                                    <?php if ($b['status'] === 'confirmed'): ?>
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Confirmed</span>
                                    <?php elseif ($b['status'] === 'pending'): ?>
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Pending</span>
                                    <?php elseif ($b['status'] === 'rejected'): ?>
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Rejected</span>
                                    <?php else: ?>
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200">Cancelled</span>
                                    <?php endif; ?>
                                </td>
                                <td class="py-3.5 px-4 text-right">
                                    <a href="booking-details.php?id=<?= (int)$b['id'] ?>" class="px-3 py-1 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors">
                                        View Details &rarr;
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once APP_ROOT . '/admin/footer.php'; ?>
