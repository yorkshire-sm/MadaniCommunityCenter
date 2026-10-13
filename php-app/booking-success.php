<?php
define('APP_ROOT', __DIR__);
$page_title = "Booking Request Submitted";
require_once APP_ROOT . '/includes/header.php';

$reference = trim($_GET['ref'] ?? '');
$booking = null;

if (!empty($reference)) {
    $stmt = $pdo->prepare("SELECT b.*, f.name as facility_name, c.full_name, c.email, c.phone 
        FROM bookings b 
        JOIN facilities f ON b.facility_id = f.id 
        JOIN customers c ON b.customer_id = c.id 
        WHERE b.reference = :ref LIMIT 1");
    $stmt->execute([':ref' => $reference]);
    $booking = $stmt->fetch();
}
?>

<div class="max-w-3xl mx-auto px-4 py-16">
    <div class="rounded-3xl border-2 border-[#437A3B] bg-[#F2F8F1] p-8 sm:p-12 shadow-md space-y-6">
        <div class="flex items-center gap-4 border-b border-[#437A3B]/20 pb-6">
            <div class="w-12 h-12 rounded-2xl bg-[#437A3B] text-white flex items-center justify-center font-bold text-xl shrink-0">
                &check;
            </div>
            <div>
                <span class="text-xs font-bold uppercase tracking-wider text-[#437A3B]">Booking Request Received</span>
                <h1 class="text-2xl font-serif-brand font-bold text-[#142318]">
                    Thank You<?= $booking ? ', ' . e($booking['full_name']) : '' ?>!
                </h1>
                <p class="text-xs text-stone-600">Your booking request has been securely recorded in our database.</p>
            </div>
        </div>

        <?php if ($booking): ?>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-4 rounded-2xl border border-stone-200">
                <div>
                    <span class="text-stone-400 block font-semibold">REFERENCE</span>
                    <strong class="font-mono text-sm text-[#142318]"><?= e($booking['reference']) ?></strong>
                </div>
                <div>
                    <span class="text-stone-400 block font-semibold">FACILITY</span>
                    <strong class="text-stone-900"><?= e($booking['facility_name']) ?></strong>
                </div>
                <div>
                    <span class="text-stone-400 block font-semibold">DATE & TIME</span>
                    <span class="text-stone-900 font-medium"><?= e($booking['booking_date']) ?> (<?= e($booking['start_time']) ?>-<?= e($booking['finish_time']) ?>)</span>
                </div>
                <div>
                    <span class="text-stone-400 block font-semibold">STATUS</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">Pending Approval</span>
                </div>
            </div>
        <?php else: ?>
            <div class="p-4 bg-white rounded-2xl border border-stone-200 text-xs">
                Reference Code: <strong class="font-mono text-base text-[#142318]"><?= e($reference) ?></strong>
            </div>
        <?php endif; ?>

        <div class="p-4 bg-white rounded-2xl border border-[#437A3B]/30 text-xs text-stone-700 space-y-2">
            <strong class="text-[#142318] block font-bold">What happens next?</strong>
            <p>1. An automated confirmation email has been dispatched to your email address.</p>
            <p>2. Our community coordinator reviews calendar arrangements to ensure no facility conflicts.</p>
            <p>3. You will receive an official approval confirmation and deposit instructions within 24–48 hours.</p>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-[#437A3B]/20">
            <button onclick="window.print()" class="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-stone-300 hover:bg-stone-50 cursor-pointer">
                Print Confirmation
            </button>
            <a href="index.php" class="px-5 py-2 rounded-full text-xs font-bold bg-[#142318] text-white hover:bg-[#253f2a]">
                Return to Home &rarr;
            </a>
        </div>
    </div>
</div>

<?php require_once APP_ROOT . '/includes/footer.php'; ?>
