<?php
define('APP_ROOT', __DIR__);
$page_title = "Availability & Online Booking";
require_once APP_ROOT . '/includes/header.php';
require_once APP_ROOT . '/config/mail.php';

// Fetch facilities
$stmt = $pdo->query("SELECT * FROM facilities WHERE is_active = 1 ORDER BY capacity DESC");
$facilities = $stmt->fetchAll();

$errors = [];
$success_ref = null;

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Verify CSRF Token
    $submitted_token = $_POST['csrf_token'] ?? '';
    if (!verify_csrf_token($submitted_token)) {
        $errors[] = "Security token validation failed (CSRF). Please refresh the page and try again.";
    }

    // 2. Honeypot check
    if (!empty($_POST['website_url'])) {
        // Bot caught by honeypot
        die("Invalid submission.");
    }

    // 3. Extract & Sanitize Inputs
    $facility_id = trim($_POST['facility_id'] ?? '');
    $booking_date = trim($_POST['booking_date'] ?? '');
    $start_time = trim($_POST['start_time'] ?? '');
    $finish_time = trim($_POST['finish_time'] ?? '');
    $full_name = trim($_POST['full_name'] ?? '');
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
    $phone = trim($_POST['phone'] ?? '');
    $organisation = trim($_POST['organisation'] ?? '');
    $event_type = trim($_POST['event_type'] ?? 'Community Function');
    $attendees = (int)($_POST['attendees'] ?? 1);
    $layout_preference = trim($_POST['layout_preference'] ?? 'Theatre style');
    $needs_kitchen = !empty($_POST['needs_kitchen']) ? 1 : 0;
    $additional_requirements = trim($_POST['additional_requirements'] ?? '');
    $terms_accepted = !empty($_POST['terms_accepted']) ? 1 : 0;
    $privacy_accepted = !empty($_POST['privacy_accepted']) ? 1 : 0;

    // 4. Validate Inputs
    if (empty($facility_id)) $errors[] = "Please select a facility space.";
    if (empty($booking_date) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $booking_date)) $errors[] = "Please provide a valid booking date.";
    if ($booking_date < date('Y-m-d')) $errors[] = "Booking date cannot be in the past.";
    if (empty($start_time) || empty($finish_time)) $errors[] = "Start time and finish time are required.";
    if ($finish_time <= $start_time) $errors[] = "Finish time must be after start time.";
    if (empty($full_name)) $errors[] = "Full name is required.";
    if (!$email) $errors[] = "A valid email address is required.";
    if (empty($phone)) $errors[] = "Contact telephone number is required.";
    if (!$terms_accepted) $errors[] = "You must agree to the center rules and alcohol-free policy.";
    if (!$privacy_accepted) $errors[] = "You must agree to the privacy notice.";

    // Check facility exists
    $fac_stmt = $pdo->prepare("SELECT * FROM facilities WHERE id = :id AND is_active = 1 LIMIT 1");
    $fac_stmt->execute([':id' => $facility_id]);
    $facility = $fac_stmt->fetch();
    if (!$facility) {
        $errors[] = "Selected facility was not found.";
    } elseif ($attendees > $facility['capacity']) {
        $errors[] = "Expected attendees ({$attendees}) exceeds maximum capacity of {$facility['name']} ({$facility['capacity']} people).";
    }

    // 5. Transactional Collision and Conflict Check
    if (empty($errors) && $facility) {
        try {
            $pdo->beginTransaction();

            // Check if date is blocked by admin
            $blk_stmt = $pdo->prepare("SELECT reason FROM blocked_dates WHERE blocked_date = :bdate AND (facility_id = 'all' OR facility_id = :fac_id) LIMIT 1 FOR UPDATE");
            $blk_stmt->execute([':bdate' => $booking_date, ':fac_id' => $facility_id]);
            $blocked = $blk_stmt->fetch();

            if ($blocked) {
                $pdo->rollBack();
                $errors[] = "This date is unavailable due to center closure: " . e($blocked['reason']);
            } else {
                // Check if overlapping CONFIRMED booking exists (FOR UPDATE prevents race conditions)
                $conf_stmt = $pdo->prepare("SELECT reference, start_time, finish_time FROM bookings 
                    WHERE facility_id = :fac_id 
                    AND booking_date = :bdate 
                    AND status = 'confirmed' 
                    AND (:start < finish_time AND :finish > start_time) 
                    LIMIT 1 FOR UPDATE");
                $conf_stmt->execute([
                    ':fac_id' => $facility_id,
                    ':bdate' => $booking_date,
                    ':start' => $start_time,
                    ':finish' => $finish_time,
                ]);
                $overlap = $conf_stmt->fetch();

                if ($overlap) {
                    $pdo->rollBack();
                    $errors[] = "A confirmed reservation already exists for this room on {$booking_date} ({$overlap['start_time']} - {$overlap['finish_time']}). Please select an alternate time.";
                } else {
                    // Calculate Duration & Pricing
                    $s_dt = new DateTime("{$booking_date} {$start_time}");
                    $f_dt = new DateTime("{$booking_date} {$finish_time}");
                    $diff = $s_dt->diff($f_dt);
                    $duration_hours = max(1, $diff->h + ($diff->i / 60));

                    $day_of_week = date('N', strtotime($booking_date)); // 6=Sat, 7=Sun
                    $is_weekend = ($day_of_week >= 6);
                    $hourly_rate = $is_weekend ? (float)$facility['weekend_rate'] : (float)$facility['hourly_rate'];
                    $base_cost = $duration_hours * $hourly_rate;
                    $kitchen_cost = $needs_kitchen ? ($duration_hours * 15.00) : 0.00;
                    $total_cost = $base_cost + $kitchen_cost;

                    // Generate secure reference: MCC-2026-XXXX
                    $reference = 'MCC-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(2)));

                    // 1. Insert or reuse Customer record
                    $cust_stmt = $pdo->prepare("SELECT id FROM customers WHERE email = :email LIMIT 1");
                    $cust_stmt->execute([':email' => $email]);
                    $customer_row = $cust_stmt->fetch();

                    if ($customer_row) {
                        $customer_id = (int)$customer_row['id'];
                        // Update phone/org if changed
                        $pdo->prepare("UPDATE customers SET full_name = :name, phone = :phone, organisation = :org WHERE id = :id")
                            ->execute([':name' => $full_name, ':phone' => $phone, ':org' => $organisation, ':id' => $customer_id]);
                    } else {
                        $pdo->prepare("INSERT INTO customers (full_name, email, phone, organisation) VALUES (:name, :email, :phone, :org)")
                            ->execute([':name' => $full_name, ':email' => $email, ':phone' => $phone, ':org' => $organisation]);
                        $customer_id = (int)$pdo->lastInsertId();
                    }

                    // 2. Insert Booking Record
                    $client_ip = get_client_ip();
                    $user_agent = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 250);

                    $bkg_insert = $pdo->prepare("INSERT INTO bookings (
                        reference, facility_id, customer_id, event_type, attendees, booking_date, start_time, finish_time,
                        duration_hours, hourly_rate, total_cost, needs_kitchen, layout_preference, additional_requirements,
                        status, terms_accepted, privacy_accepted, ip_address, user_agent
                    ) VALUES (
                        :ref, :fac_id, :cust_id, :event_type, :attendees, :bdate, :start, :finish,
                        :hours, :rate, :total, :kitchen, :layout, :reqs,
                        'pending', :terms, :priv, :ip, :ua
                    )");

                    $bkg_insert->execute([
                        ':ref' => $reference,
                        ':fac_id' => $facility_id,
                        ':cust_id' => $customer_id,
                        ':event_type' => $event_type,
                        ':attendees' => $attendees,
                        ':bdate' => $booking_date,
                        ':start' => $start_time,
                        ':finish' => $finish_time,
                        ':hours' => $duration_hours,
                        ':rate' => $hourly_rate,
                        ':total' => $total_cost,
                        ':kitchen' => $needs_kitchen,
                        ':layout' => $layout_preference,
                        ':reqs' => $additional_requirements,
                        ':terms' => $terms_accepted,
                        ':priv' => $privacy_accepted,
                        ':ip' => $client_ip,
                        ':ua' => $user_agent,
                    ]);

                    // 3. Log Audit Record
                    log_audit_event($pdo, 'BOOKING_CREATED', 'booking', $reference, "New booking request submitted by {$full_name} for {$facility['name']} on {$booking_date}");

                    $pdo->commit();

                    // 4. Send Confirmation Email
                    $booking_data = [
                        'reference' => $reference,
                        'facility_name' => $facility['name'],
                        'booking_date' => $booking_date,
                        'start_time' => $start_time,
                        'finish_time' => $finish_time,
                        'duration_hours' => $duration_hours,
                        'attendees' => $attendees,
                        'total_cost' => $total_cost,
                    ];
                    send_booking_acknowledgement_email($booking_data, $email, $full_name);

                    // Redirect to success page
                    header("Location: booking-success.php?ref=" . urlencode($reference));
                    exit;
                }
            }
        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            error_log("Booking submission failed: " . $e->getMessage());
            $errors[] = "An unexpected error occurred while processing your booking. Please try again or contact the centre directly.";
        }
    }
}

// Pre-selected facility parameter
$preselect_fac = $_GET['facility'] ?? 'fac-main-hall';
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
    <!-- Header -->
    <section class="max-w-3xl space-y-2">
        <span class="text-xs font-bold uppercase tracking-wider text-[#B8C053]">Simple Online Booking</span>
        <h1 class="text-3xl sm:text-4xl font-serif-brand font-bold text-[#182B1C]">
            Check Availability & Request a Booking
        </h1>
        <p class="text-sm text-stone-600 leading-relaxed">
            Select your preferred room, date, and times below. Our system checks real-time availability and calculates estimated hire costs immediately. All submissions are sent directly to the facility manager for rapid review.
        </p>
    </section>

    <?php if (!empty($errors)): ?>
        <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
            <strong class="font-bold block">Please resolve the following:</strong>
            <ul class="list-disc list-inside">
                <?php foreach ($errors as $err): ?>
                    <li><?= e($err) ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left Column: Calendar & Policy (5 cols) -->
        <div class="lg:col-span-5 space-y-6">
            <div class="p-6 rounded-3xl border border-stone-200 bg-white shadow-xs space-y-4">
                <h3 class="text-base font-bold text-[#182B1C] border-b border-stone-100 pb-2">
                    Availability Guidelines
                </h3>
                <p class="text-xs text-stone-600 leading-relaxed">
                    Confirmed reservations and maintenance closures are locked to prevent overlapping events. Choose your preferred times and our database will verify immediate slot clearance.
                </p>
                <div class="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1.5">
                    <div><strong>Weekday Rates:</strong> Monday &ndash; Friday standard fees</div>
                    <div><strong>Weekend Rates:</strong> Saturday &ndash; Sunday events</div>
                    <div><strong>Deposit:</strong> Refundable bond required prior to key issue</div>
                </div>
            </div>

            <div class="p-5 rounded-3xl bg-[#FAF9F5] border border-stone-200 text-xs text-stone-600 space-y-2">
                <strong class="text-[#182B1C] block font-semibold">Privacy Notice (UK GDPR):</strong>
                <p>We collect customer contact information solely for facility hire coordination. Customer names and contact details are strictly private and never exposed to the public.</p>
            </div>
        </div>

        <!-- Right Column: Booking Request Form (7 cols) -->
        <div class="lg:col-span-7">
            <form method="POST" action="booking.php" class="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
                <?= csrf_input_field() ?>

                <!-- Bot Honeypot (Invisible to humans) -->
                <div style="display:none;" aria-hidden="true">
                    <input type="text" name="website_url" tabindex="-1" autocomplete="off">
                </div>

                <div>
                    <h3 class="text-xl font-serif-brand font-bold text-[#182B1C]">Booking Request Details</h3>
                    <p class="text-xs text-stone-500">All submissions are reviewed by the facility coordinator.</p>
                </div>

                <!-- Facility Select -->
                <div>
                    <label class="text-xs font-bold text-stone-700 block mb-1">Select Facility Space *</label>
                    <select name="facility_id" required class="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300">
                        <?php foreach ($facilities as $fac): ?>
                            <option value="<?= e($fac['id']) ?>" <?= $preselect_fac === $fac['id'] ? 'selected' : '' ?>>
                                <?= e($fac['name']) ?> (Capacity: <?= (int)$fac['capacity'] ?> &bull; £<?= number_format($fac['hourly_rate'], 0) ?>/hr)
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <!-- Date & Times -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label class="text-xs font-bold text-stone-700 block mb-1">Date *</label>
                        <input type="date" name="booking_date" min="<?= date('Y-m-d') ?>" value="<?= e($_POST['booking_date'] ?? date('Y-m-d', strtotime('+3 days'))) ?>" required class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-stone-700 block mb-1">Start Time *</label>
                        <input type="time" name="start_time" value="<?= e($_POST['start_time'] ?? '10:00') ?>" required class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-stone-700 block mb-1">Finish Time *</label>
                        <input type="time" name="finish_time" value="<?= e($_POST['finish_time'] ?? '14:00') ?>" required class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
                    </div>
                </div>

                <!-- Event Info -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="text-xs font-bold text-stone-700 block mb-1">Event Type *</label>
                        <input type="text" name="event_type" value="<?= e($_POST['event_type'] ?? '') ?>" placeholder="e.g. Community Seminar, Youth Tuition..." required class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-stone-700 block mb-1">Attendees *</label>
                        <input type="number" name="attendees" min="1" max="250" value="<?= e($_POST['attendees'] ?? '40') ?>" required class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
                    </div>
                </div>

                <!-- Customer Details -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-100">
                    <div>
                        <label class="text-xs font-bold text-stone-700 block mb-1">Full Name *</label>
                        <input type="text" name="full_name" value="<?= e($_POST['full_name'] ?? '') ?>" required placeholder="Your full name" class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-stone-700 block mb-1">Email Address *</label>
                        <input type="email" name="email" value="<?= e($_POST['email'] ?? '') ?>" required placeholder="your.email@example.com" class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="text-xs font-bold text-stone-700 block mb-1">Phone Number *</label>
                        <input type="tel" name="phone" value="<?= e($_POST['phone'] ?? '') ?>" required placeholder="07700 900123" class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-stone-700 block mb-1">Organisation (Optional)</label>
                        <input type="text" name="organisation" value="<?= e($_POST['organisation'] ?? '') ?>" placeholder="Charity or group name" class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
                    </div>
                </div>

                <!-- Requirements & Checkboxes -->
                <div>
                    <label class="text-xs font-bold text-stone-700 block mb-1">Special Requirements</label>
                    <textarea name="additional_requirements" rows="2" placeholder="Microphone setup, projector, classroom layout..." class="w-full text-xs p-2.5 rounded-xl border border-stone-300"><?= e($_POST['additional_requirements'] ?? '') ?></textarea>
                </div>

                <div class="space-y-2 pt-2">
                    <label class="flex items-start gap-2 text-xs text-stone-600 cursor-pointer">
                        <input type="checkbox" name="terms_accepted" value="1" required class="mt-0.5 rounded">
                        <span>I confirm this booking adheres to the center’s alcohol-free ethos and community guidelines. *</span>
                    </label>
                    <label class="flex items-start gap-2 text-xs text-stone-600 cursor-pointer">
                        <input type="checkbox" name="privacy_accepted" value="1" required class="mt-0.5 rounded">
                        <span>I consent to the processing of contact information in accordance with UK GDPR. *</span>
                    </label>
                </div>

                <div class="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span class="text-xs text-stone-500">Reference generated immediately.</span>
                    <button type="submit" class="px-6 py-3 rounded-full text-xs font-bold bg-[#B8C053] text-[#14220C] hover:bg-[#c5cd62] transition-colors shadow-sm">
                        Submit Booking Request &rarr;
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once APP_ROOT . '/includes/footer.php'; ?>
