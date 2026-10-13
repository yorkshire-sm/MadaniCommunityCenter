<?php
define('APP_ROOT', dirname(__DIR__));
$page_title = "Booking Details & Actions";
require_once APP_ROOT . '/admin/header.php';
require_once APP_ROOT . '/config/mail.php';

$booking_id = (int)($_GET['id'] ?? 0);
if (!$booking_id) {
    header("Location: bookings.php");
    exit;
}

$stmt = $pdo->prepare("SELECT b.*, f.name as facility_name, f.capacity as facility_capacity, f.deposit_required, c.full_name, c.email, c.phone, c.organisation 
    FROM bookings b 
    JOIN facilities f ON b.facility_id = f.id 
    JOIN customers c ON b.customer_id = c.id 
    WHERE b.id = :id LIMIT 1");
$stmt->execute([':id' => $booking_id]);
$booking = $stmt->fetch();

if (!$booking) {
    die("Booking not found.");
}

$action_message = null;
$action_error = null;

// Handle Status Updates (Approve, Reject, Cancel, Save Notes)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $action_error = "Security token mismatch (CSRF). Please retry.";
    } else {
        $action = trim($_POST['action'] ?? '');

        if ($action === 'approve') {
            // Verify no conflict exists
            $conf_stmt = $pdo->prepare("SELECT reference, start_time, finish_time FROM bookings 
                WHERE facility_id = :fac_id 
                AND booking_date = :bdate 
                AND status = 'confirmed' 
                AND id != :current_id
                AND (:start < finish_time AND :finish > start_time) 
                LIMIT 1");
            $conf_stmt->execute([
                ':fac_id' => $booking['facility_id'],
                ':bdate' => $booking['booking_date'],
                ':current_id' => $booking['id'],
                ':start' => $booking['start_time'],
                ':finish' => $booking['finish_time'],
            ]);
            $conflict = $conf_stmt->fetch();

            if ($conflict) {
                $action_error = "Cannot approve: A confirmed reservation already exists for this room ({$conflict['start_time']} - {$conflict['finish_time']}).";
            } else {
                $pdo->prepare("UPDATE bookings SET status = 'confirmed', updated_at = NOW() WHERE id = :id")->execute([':id' => $booking['id']]);
                log_audit_event($pdo, 'BOOKING_APPROVED', 'booking', $booking['reference'], "Admin approved booking {$booking['reference']}");
                send_booking_approval_email($booking, $booking['email'], $booking['full_name']);
                $action_message = "Booking {$booking['reference']} has been CONFIRMED. Customer notified by email.";
                // Refresh booking row
                $booking['status'] = 'confirmed';
            }
        } elseif ($action === 'reject') {
            $reason = trim($_POST['rejection_reason'] ?? 'Facility unavailable at requested schedule.');
            $pdo->prepare("UPDATE bookings SET status = 'rejected', rejection_reason = :reason, updated_at = NOW() WHERE id = :id")
                ->execute([':reason' => $reason, ':id' => $booking['id']]);
            log_audit_event($pdo, 'BOOKING_REJECTED', 'booking', $booking['reference'], "Admin rejected booking {$booking['reference']} (Reason: {$reason})");
            send_booking_rejection_email($booking, $booking['email'], $booking['full_name'], $reason);
            $action_message = "Booking request marked as REJECTED. Notification sent to customer.";
            $booking['status'] = 'rejected';
            $booking['rejection_reason'] = $reason;
        } elseif ($action === 'cancel') {
            $pdo->prepare("UPDATE bookings SET status = 'cancelled', updated_at = NOW() WHERE id = :id")->execute([':id' => $booking['id']]);
            log_audit_event($pdo, 'BOOKING_CANCELLED', 'booking', $booking['reference'], "Admin cancelled booking {$booking['reference']}");
            $action_message = "Booking marked as CANCELLED. Space has been released on the calendar.";
            $booking['status'] = 'cancelled';
        } elseif ($action === 'save_notes') {
            $notes = trim($_POST['internal_notes'] ?? '');
            $pdo->prepare("UPDATE bookings SET internal_notes = :notes WHERE id = :id")->execute([':notes' => $notes, ':id' => $booking['id']]);
            $action_message = "Internal staff notes saved.";
            $booking['internal_notes'] = $notes;
        }
    }
}
?>

<div class="space-y-6 max-w-4xl mx-auto">
    <div class="flex items-center justify-between">
        <a href="bookings.php" class="text-xs text-stone-500 hover:text-stone-800">&larr; Back to Bookings List</a>
        <span class="font-mono text-xs font-bold bg-stone-200 px-2.5 py-1 rounded text-[#182B1C]"><?= e($booking['reference']) ?></span>
    </div>

    <?php if ($action_message): ?>
        <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            &check; <?= e($action_message) ?>
        </div>
    <?php endif; ?>

    <?php if ($action_error): ?>
        <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            &cross; <?= e($action_error) ?>
        </div>
    <?php endif; ?>

    <!-- Booking Details Card -->
    <div class="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div class="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
                <h2 class="text-2xl font-serif-brand font-bold text-[#182B1C]"><?= e($booking['full_name']) ?></h2>
                <span class="text-xs text-stone-500"><?= !empty($booking['organisation']) ? e($booking['organisation']) . ' &bull; ' : '' ?><?= e($booking['email']) ?> &bull; <?= e($booking['phone']) ?></span>
            </div>
            <div>
                <?php if ($booking['status'] === 'confirmed'): ?>
                    <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Confirmed</span>
                <?php elseif ($booking['status'] === 'pending'): ?>
                    <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Pending Approval</span>
                <?php elseif ($booking['status'] === 'rejected'): ?>
                    <span class="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">Rejected</span>
                <?php else: ?>
                    <span class="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600">Cancelled</span>
                <?php endif; ?>
            </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div class="bg-stone-50 p-3 rounded-xl border border-stone-100">
                <span class="text-stone-400 block font-semibold">FACILITY</span>
                <strong class="text-stone-900"><?= e($booking['facility_name']) ?></strong>
            </div>
            <div class="bg-stone-50 p-3 rounded-xl border border-stone-100">
                <span class="text-stone-400 block font-semibold">DATE &amp; TIME</span>
                <strong class="text-stone-900"><?= e($booking['booking_date']) ?><br><?= e($booking['start_time']) ?> &ndash; <?= e($booking['finish_time']) ?></strong>
            </div>
            <div class="bg-stone-50 p-3 rounded-xl border border-stone-100">
                <span class="text-stone-400 block font-semibold">ATTENDEES</span>
                <strong class="text-stone-900"><?= (int)$booking['attendees'] ?> people</strong>
            </div>
            <div class="bg-stone-50 p-3 rounded-xl border border-stone-100">
                <span class="text-stone-400 block font-semibold">HIRE TOTAL</span>
                <strong class="text-stone-900 text-sm">£<?= number_format($booking['total_cost'], 2) ?></strong>
            </div>
        </div>

        <div class="text-xs space-y-2">
            <div><strong>Event Purpose:</strong> <?= e($booking['event_type']) ?></div>
            <div><strong>Layout Preference:</strong> <?= e($booking['layout_preference'] ?? 'Not specified') ?></div>
            <div><strong>Kitchen Warming Add-On:</strong> <?= $booking['needs_kitchen'] ? 'Yes (+£15/hr)' : 'No' ?></div>
            <?php if (!empty($booking['additional_requirements'])): ?>
                <div><strong>Special Requirements:</strong> <?= e($booking['additional_requirements']) ?></div>
            <?php endif; ?>
            <?php if (!empty($booking['rejection_reason'])): ?>
                <div class="text-rose-700"><strong>Rejection Reason:</strong> <?= e($booking['rejection_reason']) ?></div>
            <?php endif; ?>
        </div>

        <!-- Internal Notes Form -->
        <form method="POST" action="booking-details.php?id=<?= $booking['id'] ?>" class="pt-4 border-t border-stone-100 space-y-2">
            <?= csrf_input_field() ?>
            <input type="hidden" name="action" value="save_notes">
            <label class="text-xs font-bold text-stone-700 block">Internal Staff Notes (Private):</label>
            <textarea name="internal_notes" rows="2" class="w-full text-xs p-2.5 rounded-xl border border-stone-300"><?= e($booking['internal_notes'] ?? '') ?></textarea>
            <button type="submit" class="px-3 py-1 rounded text-xs font-semibold bg-stone-100 hover:bg-stone-200">
                Save Notes
            </button>
        </form>

        <!-- Actions Panel -->
        <div class="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
                <?php if ($booking['status'] === 'pending'): ?>
                    <form method="POST" action="booking-details.php?id=<?= $booking['id'] ?>">
                        <?= csrf_input_field() ?>
                        <input type="hidden" name="action" value="approve">
                        <button type="submit" class="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#437A3B] text-white hover:bg-[#34612e] shadow-xs cursor-pointer">
                            Approve Booking &rarr;
                        </button>
                    </form>

                    <!-- Reject Form -->
                    <form method="POST" action="booking-details.php?id=<?= $booking['id'] ?>" class="flex items-center gap-2" onsubmit="return confirm('Confirm rejection of this booking?');">
                        <?= csrf_input_field() ?>
                        <input type="hidden" name="action" value="reject">
                        <input type="text" name="rejection_reason" placeholder="Reason for rejection..." required class="text-xs py-2 px-2.5 rounded-xl border border-stone-300 w-48">
                        <button type="submit" class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer">
                            Reject
                        </button>
                    </form>
                <?php elseif ($booking['status'] === 'confirmed'): ?>
                    <form method="POST" action="booking-details.php?id=<?= $booking['id'] ?>" onsubmit="return confirm('Are you sure you want to cancel this confirmed booking?');">
                        <?= csrf_input_field() ?>
                        <input type="hidden" name="action" value="cancel">
                        <button type="submit" class="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 cursor-pointer">
                            Cancel Booking
                        </button>
                    </form>
                <?php endif; ?>
            </div>

            <a href="bookings.php" class="text-xs text-stone-500 hover:text-stone-800">Return to Bookings</a>
        </div>
    </div>
</div>

<?php require_once APP_ROOT . '/admin/footer.php'; ?>
