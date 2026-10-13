<?php
define('APP_ROOT', dirname(__DIR__));
$page_title = "Manage Blocked Dates";
require_once APP_ROOT . '/admin/header.php';

$feedback = null;

// Handle Add Blocked Date
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $feedback = ['type' => 'error', 'msg' => 'Security token invalid.'];
    } else {
        $action = trim($_POST['action'] ?? '');
        if ($action === 'add') {
            $date = trim($_POST['blocked_date'] ?? '');
            $fac_id = trim($_POST['facility_id'] ?? 'all');
            $reason = trim($_POST['reason'] ?? 'Facility Maintenance');

            if ($date && $reason) {
                $pdo->prepare("INSERT INTO blocked_dates (facility_id, blocked_date, reason, created_by) VALUES (:fac, :bdate, :reason, :by)")
                    ->execute([':fac' => $fac_id, ':bdate' => $date, ':reason' => $reason, ':by' => $_SESSION['admin_username'] ?? 'Admin']);
                log_audit_event($pdo, 'DATE_BLOCKED', 'blocked_date', null, "Blocked {$date} ({$fac_id}): {$reason}");
                $feedback = ['type' => 'success', 'msg' => "Date {$date} successfully blocked."];
            }
        } elseif ($action === 'delete') {
            $id = (int)($_POST['id'] ?? 0);
            $pdo->prepare("DELETE FROM blocked_dates WHERE id = :id")->execute([':id' => $id]);
            log_audit_event($pdo, 'DATE_UNBLOCKED', 'blocked_date', (string)$id, "Removed date blackout ID {$id}");
            $feedback = ['type' => 'success', 'msg' => "Blocked date removed."];
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
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-2xl font-serif-brand font-bold text-[#182B1C]">Blocked Dates &amp; Blackouts</h2>
            <p class="text-xs text-stone-500">Dates blocked here immediately prevent public bookings and display as closed.</p>
        </div>
    </div>

    <?php if ($feedback): ?>
        <div class="p-3.5 rounded-xl text-xs <?= $feedback['type'] === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800' ?>">
            <?= e($feedback['msg']) ?>
        </div>
    <?php endif; ?>

    <!-- Add Block Form -->
    <form method="POST" action="blocked-dates.php" class="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-wrap items-end gap-3 text-xs">
        <?= csrf_input_field() ?>
        <input type="hidden" name="action" value="add">

        <div>
            <label class="font-bold text-stone-700 block mb-1">Date to Block *</label>
            <input type="date" name="blocked_date" required min="<?= date('Y-m-d') ?>" value="<?= date('Y-m-d') ?>" class="py-2 px-3 rounded-xl border border-stone-300">
        </div>

        <div>
            <label class="font-bold text-stone-700 block mb-1">Facility Scope *</label>
            <select name="facility_id" class="py-2 px-3 rounded-xl border border-stone-300 bg-stone-50">
                <option value="all">All Center Facilities (Whole Building)</option>
                <?php foreach ($facilities as $f): ?>
                    <option value="<?= e($f['id']) ?>"><?= e($f['name']) ?></option>
                <?php endforeach; ?>
            </select>
        </div>

        <div class="flex-1 min-w-[200px]">
            <label class="font-bold text-stone-700 block mb-1">Closure Reason *</label>
            <input type="text" name="reason" required placeholder="e.g. Floor Polishing, Holiday Closure, Internal Programme" class="w-full py-2 px-3 rounded-xl border border-stone-300">
        </div>

        <button type="submit" class="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-xs">
            + Block Date
        </button>
    </form>

    <!-- Blocked List Table -->
    <div class="rounded-3xl border border-stone-200 bg-white shadow-xs overflow-hidden">
        <table class="w-full text-left text-xs border-collapse">
            <thead>
                <tr class="border-b border-stone-200 bg-stone-50 text-[11px] font-bold text-stone-600 uppercase">
                    <th class="py-3 px-4">Blocked Date</th>
                    <th class="py-3 px-4">Facility Scope</th>
                    <th class="py-3 px-4">Reason</th>
                    <th class="py-3 px-4">Logged By</th>
                    <th class="py-3 px-4 text-right">Action</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 text-stone-700">
                <?php if (empty($blocked_dates)): ?>
                    <tr><td colspan="5" class="py-8 text-center text-stone-400">No dates are currently blocked.</td></tr>
                <?php else: ?>
                    <?php foreach ($blocked_dates as $b): ?>
                        <tr>
                            <td class="py-3.5 px-4 font-bold text-[#182B1C]"><?= e($b['blocked_date']) ?></td>
                            <td class="py-3.5 px-4"><?= e($b['facility_name']) ?></td>
                            <td class="py-3.5 px-4"><?= e($b['reason']) ?></td>
                            <td class="py-3.5 px-4 text-stone-400 text-[11px]"><?= e($b['created_by']) ?></td>
                            <td class="py-3.5 px-4 text-right">
                                <form method="POST" action="blocked-dates.php" onsubmit="return confirm('Remove this date block?');" class="inline">
                                    <?= csrf_input_field() ?>
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="id" value="<?= (int)$b['id'] ?>">
                                    <button type="submit" class="px-3 py-1 rounded text-[11px] font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer">
                                        Remove Block
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
