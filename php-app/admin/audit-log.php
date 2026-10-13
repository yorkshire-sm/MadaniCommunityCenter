<?php
define('APP_ROOT', dirname(__DIR__));
$page_title = "Security & Audit Log";
require_once APP_ROOT . '/admin/header.php';

$stmt = $pdo->query("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 150");
$logs = $stmt->fetchAll();
?>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-2xl font-serif-brand font-bold text-[#182B1C]">Security Audit Log</h2>
            <p class="text-xs text-stone-500">Immutable chronological record of logins, booking status changes, and administrator actions.</p>
        </div>
        <span class="text-xs text-stone-400 font-mono">Showing latest <?= count($logs) ?> events</span>
    </div>

    <div class="rounded-3xl border border-stone-200 bg-white shadow-xs overflow-hidden">
        <table class="w-full text-left text-xs border-collapse">
            <thead>
                <tr class="border-b border-stone-200 bg-stone-50 text-[11px] font-bold text-stone-600 uppercase">
                    <th class="py-3 px-4">Timestamp (UTC)</th>
                    <th class="py-3 px-4">Action</th>
                    <th class="py-3 px-4">User</th>
                    <th class="py-3 px-4">Details</th>
                    <th class="py-3 px-4 text-right">IP Address</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 font-mono text-[11px] text-stone-700">
                <?php if (empty($logs)): ?>
                    <tr><td colspan="5" class="py-8 text-center text-stone-400">No audit logs recorded yet.</td></tr>
                <?php else: ?>
                    <?php foreach ($logs as $l): ?>
                        <tr class="hover:bg-stone-50/70">
                            <td class="py-3 px-4 text-stone-500 whitespace-nowrap"><?= e($l['created_at']) ?></td>
                            <td class="py-3 px-4 font-bold">
                                <?php
                                $cls = 'bg-stone-100 text-stone-800';
                                if (str_contains($l['action'], 'SUCCESS') || str_contains($l['action'], 'APPROVED')) $cls = 'bg-emerald-100 text-emerald-800';
                                if (str_contains($l['action'], 'FAILED') || str_contains($l['action'], 'REJECTED')) $cls = 'bg-rose-100 text-rose-800';
                                ?>
                                <span class="px-2 py-0.5 rounded text-[10px] <?= $cls ?>"><?= e($l['action']) ?></span>
                            </td>
                            <td class="py-3 px-4 text-stone-800 font-sans font-medium"><?= e($l['admin_user']) ?></td>
                            <td class="py-3 px-4 text-stone-600 font-sans max-w-md truncate"><?= e($l['details']) ?></td>
                            <td class="py-3 px-4 text-stone-400 text-right"><?= e($l['ip_address']) ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once APP_ROOT . '/admin/footer.php'; ?>
