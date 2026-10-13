<?php
define('APP_ROOT', dirname(__DIR__));
$page_title = "Add Manual Booking";
require_once APP_ROOT . '/admin/header.php';

$facilities = $pdo->query("SELECT * FROM facilities WHERE is_active = 1 ORDER BY name ASC")->fetchAll();
$error = null;
$success = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = "CSRF security verification failed.";
    } else {
        $facility_id = trim($_POST['facility_id'] ?? '');
        $booking_date = trim($_POST['booking_date'] ?? '');
        $start_time = trim($_POST['start_time'] ?? '');
        $finish_time = trim($_POST['finish_time'] ?? '');
        $full_name = trim($_POST['full_name'] ?? '');
        $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $phone = trim($_POST['phone'] ?? '');
        $organisation = trim($_POST['organisation'] ?? '');
        $event_type = trim($_POST['event_type'] ?? 'Manual Reservation');
        $attendees = (int)($_POST['attendees'] ?? 20);

        if (!$facility_id || !$booking_date || !$start_time || !$finish_time || !$full_name || !$email || !$phone) {
            $error = "Please complete all required fields.";
        } else {
            // Check conflicts
            $conf_stmt = $pdo->prepare("SELECT reference FROM bookings 
                WHERE facility_id = :fac_id AND booking_date = :bdate AND status = 'confirmed' 
                AND (:start < finish_time AND :finish > start_time) LIMIT 1");
            $conf_stmt->execute([':fac_id' => $facility_id, ':bdate' => $booking_date, ':start' => $start_time, ':finish' => $finish_time]);
            if ($conf_stmt->fetch()) {
                $error = "Conflict: A confirmed reservation already exists for this room and time slot.";
            } else {
                $fac = $pdo->prepare("SELECT * FROM facilities WHERE id = :id LIMIT 1");
                $fac->execute([':id' => $facility_id]);
                $facility = $fac->fetch();

                $s_dt = new DateTime("{$booking_date} {$start_time}");
                $f_dt = new DateTime("{$booking_date} {$finish_time}");
                $diff = $s_dt->diff($f_dt);
                $duration = max(1, $diff->h + ($diff->i / 60));
                $total = $duration * $facility['hourly_rate'];

                $ref = 'MCC-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(2)));

                // Insert customer
                $cust = $pdo->prepare("INSERT INTO customers (full_name, email, phone, organisation) VALUES (:name, :email, :phone, :org)");
                $cust->execute([':name' => $full_name, ':email' => $email, ':phone' => $phone, ':org' => $organisation]);
                $cust_id = (int)$pdo->lastInsertId();

                // Insert confirmed booking
                $pdo->prepare("INSERT INTO bookings (reference, facility_id, customer_id, event_type, attendees, booking_date, start_time, finish_time, duration_hours, hourly_rate, total_cost, status, terms_accepted, privacy_accepted, ip_address, internal_notes)
                    VALUES (:ref, :fac, :cust, :evt, :att, :bdate, :start, :finish, :dur, :rate, :total, 'confirmed', 1, 1, '127.0.0.1 (Admin Entry)', 'Created manually via Admin Portal')")
                    ->execute([
                        ':ref' => $ref, ':fac' => $facility_id, ':cust' => $cust_id, ':evt' => $event_type, ':att' => $attendees,
                        ':bdate' => $booking_date, ':start' => $start_time, ':finish' => $finish_time, ':dur' => $duration,
                        ':rate' => $facility['hourly_rate'], ':total' => $total,
                    ]);

                log_audit_event($pdo, 'BOOKING_CREATED', 'booking', $ref, "Admin manually created and confirmed booking for {$full_name}");
                header("Location: booking-details.php?id=" . $pdo->lastInsertId());
                exit;
            }
        }
    }
}
?>

<div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
        <h2 class="text-2xl font-serif-brand font-bold text-[#182B1C]">Add Manual Booking</h2>
        <a href="bookings.php" class="text-xs text-stone-500 hover:text-stone-800">&larr; Back</a>
    </div>

    <?php if ($error): ?>
        <div class="p-3.5 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200"><?= e($error) ?></div>
    <?php endif; ?>

    <form method="POST" action="add-booking.php" class="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <?= csrf_input_field() ?>

        <div>
            <label class="text-xs font-bold text-stone-700 block mb-1">Facility *</label>
            <select name="facility_id" required class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
                <?php foreach ($facilities as $f): ?>
                    <option value="<?= e($f['id']) ?>"><?= e($f['name']) ?> (£<?= number_format($f['hourly_rate'], 0) ?>/hr)</option>
                <?php endforeach; ?>
            </select>
        </div>

        <div class="grid grid-cols-3 gap-3">
            <div>
                <label class="text-xs font-bold text-stone-700 block mb-1">Date *</label>
                <input type="date" name="booking_date" required value="<?= date('Y-m-d') ?>" class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
            </div>
            <div>
                <label class="text-xs font-bold text-stone-700 block mb-1">Start Time *</label>
                <input type="time" name="start_time" required value="10:00" class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
            </div>
            <div>
                <label class="text-xs font-bold text-stone-700 block mb-1">Finish Time *</label>
                <input type="time" name="finish_time" required value="13:00" class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-2 border-t border-stone-100">
            <div>
                <label class="text-xs font-bold text-stone-700 block mb-1">Customer Full Name *</label>
                <input type="text" name="full_name" required placeholder="Full Name" class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
            </div>
            <div>
                <label class="text-xs font-bold text-stone-700 block mb-1">Telephone *</label>
                <input type="tel" name="phone" required placeholder="07700 900123" class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
            <div>
                <label class="text-xs font-bold text-stone-700 block mb-1">Email *</label>
                <input type="email" name="email" required placeholder="customer@example.com" class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
            </div>
            <div>
                <label class="text-xs font-bold text-stone-700 block mb-1">Organisation</label>
                <input type="text" name="organisation" placeholder="Optional" class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
            <div>
                <label class="text-xs font-bold text-stone-700 block mb-1">Event Type *</label>
                <input type="text" name="event_type" required value="Community Meeting" class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
            </div>
            <div>
                <label class="text-xs font-bold text-stone-700 block mb-1">Attendees *</label>
                <input type="number" name="attendees" required value="30" class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
            </div>
        </div>

        <div class="pt-3 border-t border-stone-100 flex justify-end gap-2">
            <a href="bookings.php" class="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100">Cancel</a>
            <button type="submit" class="px-5 py-2 rounded-xl text-xs font-bold bg-[#182B1C] text-white hover:bg-[#253f2a] shadow-xs">
                Save &amp; Confirm Booking
            </button>
        </div>
    </form>
</div>

<?php require_once APP_ROOT . '/admin/footer.php'; ?>
