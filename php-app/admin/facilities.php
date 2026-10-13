<?php
define('APP_ROOT', dirname(__DIR__));
$page_title = "Facility & Pricing Management";
require_once APP_ROOT . '/admin/header.php';

$feedback = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $feedback = ['type' => 'error', 'msg' => 'Security token invalid.'];
    } else {
        $id = trim($_POST['facility_id'] ?? '');
        $capacity = (int)($_POST['capacity'] ?? 0);
        $hourly = (float)($_POST['hourly_rate'] ?? 0);
        $weekend = (float)($_POST['weekend_rate'] ?? 0);
        $deposit = (float)($_POST['deposit_required'] ?? 0);

        if ($id && $capacity > 0 && $hourly > 0) {
            $pdo->prepare("UPDATE facilities SET capacity = :cap, hourly_rate = :hr, weekend_rate = :wk, deposit_required = :dep WHERE id = :id")
                ->execute([':cap' => $capacity, ':hr' => $hourly, ':wk' => $weekend, ':dep' => $deposit, ':id' => $id]);
            log_audit_event($pdo, 'FACILITY_UPDATED', 'facility', $id, "Updated pricing/capacity for {$id}");
            $feedback = ['type' => 'success', 'msg' => "Facility parameters updated successfully."];
        }
    }
}

$facilities = $pdo->query("SELECT * FROM facilities ORDER BY name ASC")->fetchAll();
?>

<div class="space-y-6">
    <div>
        <h2 class="text-2xl font-serif-brand font-bold text-[#182B1C]">Facilities &amp; Pricing Management</h2>
        <p class="text-xs text-stone-500">Edit capacities, hourly prices, and weekend surcharges that update the public website live.</p>
    </div>

    <?php if ($feedback): ?>
        <div class="p-3.5 rounded-xl text-xs <?= $feedback['type'] === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800' ?>">
            <?= e($feedback['msg']) ?>
        </div>
    <?php endif; ?>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <?php foreach ($facilities as $f): ?>
            <form method="POST" action="facilities.php" class="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
                <?= csrf_input_field() ?>
                <input type="hidden" name="facility_id" value="<?= e($f['id']) ?>">

                <div class="flex items-start justify-between border-b border-stone-100 pb-3">
                    <div>
                        <h3 class="text-lg font-serif-brand font-bold text-[#182B1C]"><?= e($f['name']) ?></h3>
                        <span class="text-xs text-stone-400"><?= e($f['category']) ?></span>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Active</span>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                        <label class="font-bold text-stone-700 block mb-1">Capacity</label>
                        <input type="number" name="capacity" value="<?= (int)$f['capacity'] ?>" required class="w-full py-1.5 px-2.5 rounded-lg border border-stone-300">
                    </div>
                    <div>
                        <label class="font-bold text-stone-700 block mb-1">Weekday (£/hr)</label>
                        <input type="number" step="0.5" name="hourly_rate" value="<?= (float)$f['hourly_rate'] ?>" required class="w-full py-1.5 px-2.5 rounded-lg border border-stone-300">
                    </div>
                    <div>
                        <label class="font-bold text-stone-700 block mb-1">Weekend (£/hr)</label>
                        <input type="number" step="0.5" name="weekend_rate" value="<?= (float)$f['weekend_rate'] ?>" required class="w-full py-1.5 px-2.5 rounded-lg border border-stone-300">
                    </div>
                    <div>
                        <label class="font-bold text-stone-700 block mb-1">Deposit (£)</label>
                        <input type="number" step="1" name="deposit_required" value="<?= (float)$f['deposit_required'] ?>" required class="w-full py-1.5 px-2.5 rounded-lg border border-stone-300">
                    </div>
                </div>

                <p class="text-xs text-stone-600"><?= e($f['description']) ?></p>

                <div class="pt-2 border-t border-stone-100 flex justify-end">
                    <button type="submit" class="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#182B1C] text-white hover:bg-[#253f2a] shadow-xs">
                        Save Changes
                    </button>
                </div>
            </form>
        <?php endforeach; ?>
    </div>
</div>

<?php require_once APP_ROOT . '/admin/footer.php'; ?>
