<?php
define('APP_ROOT', dirname(__DIR__));
$page_title = "Booked Slots & Reserved Dates";
require_once APP_ROOT . '/admin/header.php';

$feedback = null;

// Handle Add / Release Booked Slot
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $feedback = ['type' => 'error', 'msg' => 'Security token invalid.'];
    } else {
        $action = trim($_POST['action'] ?? '');
        if ($action === 'add') {
            $date = trim($_POST['blocked_date'] ?? '');
            $fac_id = trim($_POST['facility_id'] ?? 'all');
            $reason = trim($_POST['reason'] ?? 'Reserved Date');

            if ($date && $reason) {
                $pdo->prepare("INSERT INTO blocked_dates (facility_id, blocked_date, reason, created_by) VALUES (:fac, :bdate, :reason, :by)")
                    ->execute([':fac' => $fac_id, ':bdate' => $date, ':reason' => $reason, ':by' => $_SESSION['admin_username'] ?? 'Admin']);
                log_audit_event($pdo, 'DATE_BLOCKED', 'blocked_date', null, "Reserved Booked Slot {$date} ({$fac_id}): {$reason}");
                $feedback = ['type' => 'success', 'msg' => "Date {$date} successfully marked as Booked Slot (Red)."];
            }
        } elseif ($action === 'delete') {
            $id = (int)($_POST['id'] ?? 0);
            $pdo->prepare("DELETE FROM blocked_dates WHERE id = :id")->execute([':id' => $id]);
            log_audit_event($pdo, 'DATE_UNBLOCKED', 'blocked_date', (string)$id, "Released Booked Slot ID {$id}");
            $feedback = ['type' => 'success', 'msg' => "Booked slot released. Date is now Available (Green)."];
        }
    }
}

$stmt = $pdo->query("SELECT bd.*, COALESCE(f.name, 'All Center Facilities') as facility_name 
    FROM blocked_dates bd 
    LEFT JOIN facilities f ON bd.facility_id = f.id 
    ORDER BY bd.blocked_date DESC");
$blocked_dates = $stmt->fetchAll();

$facilities = $pdo->query("SELECT id, name FROM facilities ORDER BY name ASC")->fetchAll();
?>

<div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-2xl font-serif-brand font-bold text-[#0B2545]">Booked Slots &amp; Reserved Dates</h2>
            <p class="text-xs text-slate-500">Dates marked here immediately appear in <strong class="text-rose-600 font-semibold">Red (Booked Slot)</strong> on the calendar, preventing public bookings.</p>
        </div>

        <!-- 2-Colour Legend -->
        <div class="flex items-center gap-3 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 text-xs shadow-xs">
            <div class="flex items-center gap-1.5 font-semibold text-emerald-800">
                <span class="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-xs"></span>
                <span>Available (Green)</span>
            </div>
            <div class="h-3.5 w-px bg-slate-300"></div>
            <div class="flex items-center gap-1.5 font-semibold text-rose-800">
                <span class="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-xs"></span>
                <span>Booked Slot (Red)</span>
            </div>
        </div>
    </div>

    <?php if ($feedback): ?>
        <div class="p-3.5 rounded-xl text-xs <?= $feedback['type'] === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200' ?>">
            <?= e($feedback['msg']) ?>
        </div>
    <?php endif; ?>

    <!-- Add Booked Slot Form -->
    <form method="POST" action="blocked-dates.php" class="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-end gap-3 text-xs">
        <?= csrf_input_field() ?>
        <input type="hidden" name="action" value="add">

        <div>
            <label class="font-bold text-slate-700 block mb-1">Date to Reserve *</label>
            <input type="date" name="blocked_date" required min="<?= date('Y-m-d') ?>" value="<?= date('Y-m-d') ?>" class="py-2 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0077C8]">
        </div>

        <div>
            <label class="font-bold text-slate-700 block mb-1">Facility Scope *</label>
            <select name="facility_id" class="py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#0077C8]">
                <option value="all">All Center Facilities (Whole Building)</option>
                <?php foreach ($facilities as $f): ?>
                    <option value="<?= e($f['id']) ?>"><?= e($f['name']) ?></option>
                <?php endforeach; ?>
            </select>
        </div>

        <div class="flex-1 min-w-[200px]">
            <label class="font-bold text-slate-700 block mb-1">Booking / Reserve Reason *</label>
            <input type="text" name="reason" required placeholder="e.g. Internal Community Programme, Routine Maintenance, Private Function" class="w-full py-2 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0077C8]">
        </div>

        <button type="submit" class="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#EF4444] text-white hover:bg-rose-700 shadow-xs cursor-pointer transition-colors">
            + Add Booked Slot (Red)
        </button>
    </form>

    <!-- Booked Slots List Table -->
    <div class="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <table class="w-full text-left text-xs border-collapse min-w-[550px]">
            <thead>
                <tr class="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
                    <th class="py-3 px-4">Date</th>
                    <th class="py-3 px-4">Facility Scope</th>
                    <th class="py-3 px-4">Booking / Reserve Reason</th>
                    <th class="py-3 px-4">Reserved By</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4 text-right">Action</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
                <?php if (empty($blocked_dates)): ?>
                    <tr><td colspan="6" class="py-8 text-center text-slate-400">No dates are currently marked as Booked Slots. All dates are Available (Green).</td></tr>
                <?php else: ?>
                    <?php foreach ($blocked_dates as $b): ?>
                        <tr class="hover:bg-slate-50/70 transition-colors">
                            <td class="py-3.5 px-4 font-bold text-[#0B2545] font-mono"><?= e($b['blocked_date']) ?></td>
                            <td class="py-3.5 px-4 font-medium text-slate-800"><?= e($b['facility_name']) ?></td>
                            <td class="py-3.5 px-4 text-slate-800"><?= e($b['reason']) ?></td>
                            <td class="py-3.5 px-4 text-slate-400 text-[11px]"><?= e($b['created_by']) ?></td>
                            <td class="py-3.5 px-4">
                                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                    <span class="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></span>
                                    Booked Slot (Red)
                                </span>
                            </td>
                            <td class="py-3.5 px-4 text-right">
                                <form method="POST" action="blocked-dates.php" onsubmit="return confirm('Release this booked slot and make date Available (Green)?');" class="inline">
                                    <?= csrf_input_field() ?>
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="id" value="<?= (int)$b['id'] ?>">
                                    <button type="submit" class="px-3 py-1 rounded-lg text-[11px] font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 cursor-pointer transition-colors">
                                        Release Slot
                                    </button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once APP_ROOT . '/admin/footer.php'; ?>
