<?php
define('APP_ROOT', dirname(__DIR__));
$page_title = "UK GDPR & Privacy Tools";
require_once APP_ROOT . '/admin/header.php';

$search_email = trim($_GET['email'] ?? '');
$results = [];
$feedback = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $feedback = ['type' => 'error', 'msg' => 'Security token invalid.'];
    } else {
        $action = trim($_POST['action'] ?? '');
        if ($action === 'anonymize') {
            $customer_id = (int)($_POST['customer_id'] ?? 0);
            if ($customer_id) {
                // Anonymize personal details in customers table
                $pdo->prepare("UPDATE customers SET full_name = '[Anonymized Customer]', email = CONCAT('anonymized_', id, '@deleted.local'), phone = '[Removed]', organisation = '[Removed]', is_anonymized = 1 WHERE id = :id")
                    ->execute([':id' => $customer_id]);
                
                // Clear any personal requirements in bookings
                $pdo->prepare("UPDATE bookings SET additional_requirements = NULL, internal_notes = 'Personal data anonymized under UK GDPR Right to Erasure.' WHERE customer_id = :id")
                    ->execute([':id' => $customer_id]);

                log_audit_event($pdo, 'GDPR_ERASURE', 'customer', (string)$customer_id, "Executed Right to Erasure for customer ID {$customer_id}");
                $feedback = ['type' => 'success', 'msg' => "Customer personal identifiers successfully anonymized."];
            }
        }
    }
}

if (!empty($search_email)) {
    $stmt = $pdo->prepare("SELECT c.*, COUNT(b.id) as booking_count 
        FROM customers c 
        LEFT JOIN bookings b ON c.id = b.customer_id 
        WHERE c.email LIKE :email OR c.phone LIKE :email 
        GROUP BY c.id");
    $stmt->execute([':email' => "%{$search_email}%"]);
    $results = $stmt->fetchAll();
}
?>

<div class="space-y-6">
    <div>
        <h2 class="text-2xl font-serif-brand font-bold text-[#182B1C]">UK GDPR &amp; Customer Privacy</h2>
        <p class="text-xs text-stone-500">Search customer personal records, query data history, and execute Right to Erasure requests.</p>
    </div>

    <?php if ($feedback): ?>
        <div class="p-3.5 rounded-xl text-xs <?= $feedback['type'] === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800' ?>">
            <?= e($feedback['msg']) ?>
        </div>
    <?php endif; ?>

    <!-- Search Form -->
    <form method="GET" action="gdpr.php" class="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex items-center gap-3 text-xs max-w-lg">
        <input type="text" name="email" required value="<?= e($search_email) ?>" placeholder="Customer email or phone number..." class="flex-1 py-2 px-3 rounded-xl border border-stone-300">
        <button type="submit" class="px-5 py-2 rounded-xl bg-[#182B1C] text-white font-bold hover:bg-[#253f2a]">
            Search Records
        </button>
    </form>

    <?php if (!empty($search_email)): ?>
        <div class="rounded-3xl border border-stone-200 bg-white shadow-xs p-6 space-y-4">
            <h3 class="text-sm font-bold text-[#182B1C] border-b border-stone-100 pb-2">
                Search Results for "<?= e($search_email) ?>" (<?= count($results) ?> customer match)
            </h3>

            <?php if (empty($results)): ?>
                <p class="text-xs text-stone-400 py-4 text-center">No matching customer records found.</p>
            <?php else: ?>
                <div class="space-y-4">
                    <?php foreach ($results as $c): ?>
                        <div class="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
                            <div class="space-y-1">
                                <strong class="text-stone-900 text-sm block"><?= e($c['full_name']) ?></strong>
                                <div>Email: <?= e($c['email']) ?> &bull; Phone: <?= e($c['phone']) ?></div>
                                <div class="text-stone-500">Associated Bookings: <?= (int)$c['booking_count'] ?> requests &bull; Registered: <?= e($c['created_at']) ?></div>
                            </div>

                            <div>
                                <?php if ($c['is_anonymized']): ?>
                                    <span class="px-3 py-1 rounded-full text-[10px] font-bold bg-stone-200 text-stone-600">Already Anonymized</span>
                                <?php else: ?>
                                    <form method="POST" action="gdpr.php?email=<?= urlencode($search_email) ?>" onsubmit="return confirm('Execute Right to Erasure? This permanently replaces customer identifiers with anonymized placeholders.');">
                                        <?= csrf_input_field() ?>
                                        <input type="hidden" name="action" value="anonymize">
                                        <input type="hidden" name="customer_id" value="<?= (int)$c['id'] ?>">
                                        <button type="submit" class="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-xs">
                                            Execute Erasure
                                        </button>
                                    </form>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    <?php endif; ?>
</div>

<?php require_once APP_ROOT . '/admin/footer.php'; ?>
