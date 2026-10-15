<?php
define('APP_ROOT', __DIR__);
$page_title = "Check Availability & Request a Booking";
require_once APP_ROOT . '/includes/header.php';
require_once APP_ROOT . '/config/mail.php';

// Fetch facilities, blocked dates, and active bookings with safe fallbacks
$facilities = [];
$blocked_dates = [];
$existing_bookings = [];

try {
    if (!empty($pdo)) {
        $stmt = $pdo->query("SELECT * FROM facilities WHERE is_active = 1 ORDER BY capacity DESC");
        $facilities = $stmt->fetchAll();

        $blk_stmt = $pdo->query("SELECT blocked_date, facility_id, reason FROM blocked_dates");
        $blocked_dates = $blk_stmt->fetchAll();

        $bkg_stmt = $pdo->query("SELECT booking_date, facility_id, start_time, finish_time FROM bookings WHERE status NOT IN ('cancelled', 'rejected')");
        $existing_bookings = $bkg_stmt->fetchAll();
    }
} catch (Throwable $e) {
    error_log("Failed to fetch booking data from DB: " . $e->getMessage());
}

if (empty($facilities)) {
    $facilities = [
        ['id' => 'fac-main-hall', 'name' => 'Main Community & Event Hall', 'hourly_rate' => 45.00, 'capacity' => 250],
        ['id' => 'fac-meeting-suite', 'name' => 'Meeting & Training Suite', 'hourly_rate' => 25.00, 'capacity' => 35],
        ['id' => 'fac-classrooms', 'name' => 'Modular Classroom Spaces', 'hourly_rate' => 20.00, 'capacity' => 28],
        ['id' => 'fac-youth-lounge', 'name' => 'Youth & Community Activity Lounge', 'hourly_rate' => 30.00, 'capacity' => 50]
    ];
}

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
    if (empty($booking_date) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $booking_date)) $errors[] = "Please select an available booking date from the calendar.";
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

            // Check if date is a booked slot in blocked_dates
            $blk_check = $pdo->prepare("SELECT reason FROM blocked_dates WHERE blocked_date = :bdate AND (facility_id = 'all' OR facility_id = :fac_id) LIMIT 1 FOR UPDATE");
            $blk_check->execute([':bdate' => $booking_date, ':fac_id' => $facility_id]);
            $blocked = $blk_check->fetch();

            if ($blocked) {
                $pdo->rollBack();
                $errors[] = "This date is already a Booked Slot: " . e($blocked['reason']) . ". Please select an available green date.";
            } else {
                // Check if overlapping CONFIRMED booking exists
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
                    $errors[] = "This date/time overlaps with a Booked Slot ({$overlap['start_time']} - {$overlap['finish_time']}). Please choose an alternative time slot.";
                } else {
                    // Calculate Duration & Pricing
                    $start_dt = new DateTime($booking_date . ' ' . $start_time);
                    $finish_dt = new DateTime($booking_date . ' ' . $finish_time);
                    $duration_interval = $start_dt->diff($finish_dt);
                    $duration_hours = max(1, $duration_interval->h + ($duration_interval->i / 60));

                    $day_of_week = (int)$start_dt->format('N');
                    $is_weekend = ($day_of_week >= 6);
                    $hourly_rate = $is_weekend ? (float)$facility['weekend_rate'] : (float)$facility['hourly_rate'];
                    $base_cost = $duration_hours * $hourly_rate;
                    $kitchen_cost = $needs_kitchen ? ($duration_hours * 15.0) : 0.0;
                    $total_cost = $base_cost + $kitchen_cost;

                    $reference = generate_booking_reference();
                    $client_ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
                    $user_agent = substr($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown', 0, 255);

                    // Insert customer record
                    $cust_stmt = $pdo->prepare("INSERT INTO customers (full_name, email, phone, organisation) 
                        VALUES (:name, :email, :phone, :org) 
                        ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), phone = VALUES(phone), organisation = VALUES(organisation)");
                    $cust_stmt->execute([
                        ':name' => $full_name,
                        ':email' => $email,
                        ':phone' => $phone,
                        ':org' => $organisation ?: null,
                    ]);

                    // Insert booking record
                    $ins_stmt = $pdo->prepare("INSERT INTO bookings 
                        (reference, facility_id, facility_name, customer_name, customer_email, customer_phone, organisation, 
                         event_type, attendees, booking_date, start_time, finish_time, hours, hourly_rate, total_cost, 
                         needs_kitchen, layout_preference, additional_requirements, status, terms_accepted, privacy_accepted, client_ip, user_agent)
                        VALUES 
                        (:ref, :fac_id, :fac_name, :cname, :cemail, :cphone, :org, 
                         :event_type, :attendees, :bdate, :start, :finish, :hours, :rate, :total, 
                         :kitchen, :layout, :reqs, 'pending', :terms, :priv, :ip, :ua)");
                    
                    $ins_stmt->execute([
                        ':ref' => $reference,
                        ':fac_id' => $facility_id,
                        ':fac_name' => $facility['name'],
                        ':cname' => $full_name,
                        ':cemail' => $email,
                        ':cphone' => $phone,
                        ':org' => $organisation ?: null,
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

                    log_audit_event($pdo, 'BOOKING_CREATED', 'booking', $reference, "New booking request submitted by {$full_name} for {$facility['name']} on {$booking_date}");
                    $pdo->commit();

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

$preselect_fac = $_GET['facility'] ?? 'fac-main-hall';
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <!-- Header -->
    <section class="max-w-3xl space-y-2">
        <span class="text-xs font-bold uppercase tracking-wider text-[#00A896]">Live Availability &amp; Booking</span>
        <h1 class="text-3xl sm:text-4xl font-serif-brand font-bold text-[#0B2545]">
            Check Availability &amp; Request a Booking
        </h1>
        <p class="text-sm text-slate-600 leading-relaxed">
            Follow our 3 simple steps below. First select your space and an available date on the live calendar. Dates marked as <strong class="text-rose-600 font-semibold">Booked Slot (Red)</strong> are unavailable, while <strong class="text-emerald-700 font-semibold">Available (Green)</strong> dates can be selected immediately.
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

    <!-- Slideshow Stepper Progress Bar -->
    <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-xs">
        <div class="grid grid-cols-3 gap-2 sm:gap-4">
            <button type="button" id="stepBtn1" onclick="goToStep(1)" class="flex items-center gap-3 p-3 rounded-2xl text-left bg-[#0B2545] text-white shadow-sm ring-2 ring-[#0077C8] transition-all">
                <div id="stepBadge1" class="w-8 h-8 rounded-xl bg-[#0077C8] text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <div class="min-w-0">
                    <span class="text-[10px] uppercase font-bold tracking-wider block opacity-80">Step 1</span>
                    <span class="text-xs sm:text-sm font-bold truncate block">Select Date &amp; Space</span>
                </div>
            </button>
            <button type="button" id="stepBtn2" onclick="goToStep(2)" class="flex items-center gap-3 p-3 rounded-2xl text-left bg-slate-50 text-slate-400 transition-all">
                <div id="stepBadge2" class="w-8 h-8 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <div class="min-w-0">
                    <span class="text-[10px] uppercase font-bold tracking-wider block opacity-80">Step 2</span>
                    <span class="text-xs sm:text-sm font-bold truncate block">Event Details</span>
                </div>
            </button>
            <button type="button" id="stepBtn3" onclick="goToStep(3)" class="flex items-center gap-3 p-3 rounded-2xl text-left bg-slate-50 text-slate-400 transition-all">
                <div id="stepBadge3" class="w-8 h-8 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <div class="min-w-0">
                    <span class="text-[10px] uppercase font-bold tracking-wider block opacity-80">Step 3</span>
                    <span class="text-xs sm:text-sm font-bold truncate block">Contact &amp; Submit</span>
                </div>
            </button>
        </div>
    </div>

    <!-- Active Warning Notice if clicked Red date -->
    <div id="dateNotice" style="display:none;" class="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between gap-3">
        <span id="dateNoticeText">This date is a Booked Slot (Red) and cannot be selected. Please select a green available date.</span>
        <button type="button" onclick="document.getElementById('dateNotice').style.display='none'" class="font-bold underline text-rose-700">Dismiss</button>
    </div>

    <form method="POST" action="booking.php" id="bookingForm" class="space-y-6">
        <?= csrf_input_field() ?>

        <!-- Honeypot -->
        <div style="display:none;" aria-hidden="true">
            <input type="text" name="website_url" tabindex="-1" autocomplete="off">
        </div>

        <!-- ======================================================== -->
        <!-- SLIDE 1: SELECT FACILITY & DATE (CALENDAR)                -->
        <!-- ======================================================== -->
        <div id="slide1" class="space-y-6">
            <!-- Facility Selection Cards -->
            <div class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-[#00A896]">1. Choose Facility</span>
                        <h2 class="text-xl sm:text-2xl font-serif-brand font-bold text-[#0B2545]">Select Desired Room or Space</h2>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <?php foreach ($facilities as $fac): ?>
                        <label class="fac-card p-4 rounded-2xl border text-left cursor-pointer flex flex-col justify-between transition-all <?= $preselect_fac === $fac['id'] ? 'border-[#0077C8] bg-[#F0F7FF] ring-2 ring-[#0077C8]' : 'border-slate-200 bg-white hover:border-slate-300' ?>" data-fac-id="<?= e($fac['id']) ?>">
                            <input type="radio" name="facility_id" value="<?= e($fac['id']) ?>" <?= $preselect_fac === $fac['id'] ? 'checked' : '' ?> class="sr-only" onchange="onFacilityChange(this.value)">
                            <div class="space-y-1">
                                <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Capacity: <?= (int)$fac['capacity'] ?></span>
                                <h3 class="font-bold text-sm text-[#0B2545] leading-tight"><?= e($fac['name']) ?></h3>
                            </div>
                            <div class="pt-3 mt-3 border-t border-slate-100 flex items-baseline justify-between text-xs">
                                <span class="font-extrabold text-[#0077C8]">£<?= number_format($fac['hourly_rate'], 0) ?>/hr</span>
                                <span class="text-[10px] text-slate-400">Bond: £<?= number_format($fac['deposit_required'] ?? 100, 0) ?></span>
                            </div>
                        </label>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- 2-Colour Live Calendar -->
            <div class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-4">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-[#00A896]">2. Live Availability Calendar</span>
                        <h2 class="text-xl sm:text-2xl font-serif-brand font-bold text-[#0B2545]">Pick an Available Date (Green)</h2>
                        <p class="text-xs text-slate-500 mt-0.5">
                            Dates marked in <strong class="text-rose-600 font-semibold">Red (Booked Slot)</strong> are unavailable and cannot be clicked.
                        </p>
                    </div>

                    <!-- 2-Option Legend -->
                    <div class="flex items-center gap-3 bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 shrink-0 text-xs">
                        <div class="flex items-center gap-1.5 font-semibold text-emerald-800">
                            <span class="w-3 h-3 rounded-full bg-[#10B981] shadow-xs"></span>
                            <span>Available (Green)</span>
                        </div>
                        <div class="h-4 w-px bg-slate-300"></div>
                        <div class="flex items-center gap-1.5 font-semibold text-rose-800">
                            <span class="w-3 h-3 rounded-full bg-[#EF4444] shadow-xs"></span>
                            <span>Booked Slot (Red)</span>
                        </div>
                    </div>
                </div>

                <!-- Calendar View -->
                <div class="max-w-3xl mx-auto">
                    <div class="flex items-center justify-between mb-4 px-2">
                        <button type="button" onclick="changeMonth(-1)" class="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer">&larr; Previous</button>
                        <h3 id="calMonthTitle" class="text-base sm:text-lg font-bold text-[#0B2545] font-serif-brand"></h3>
                        <button type="button" onclick="changeMonth(1)" class="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer">Next &rarr;</button>
                    </div>

                    <div class="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 uppercase py-2 border-b border-slate-100">
                        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                    </div>

                    <div id="calendarGrid" class="grid grid-cols-7 gap-1.5 pt-3"></div>
                </div>

                <!-- Hidden Input for Date -->
                <input type="hidden" name="booking_date" id="selectedBookingDate" value="<?= e($_POST['booking_date'] ?? '') ?>">

                <!-- Selected Date Confirmation Strip -->
                <div class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center font-bold text-lg shrink-0">✓</div>
                        <div>
                            <span class="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">🟢 Available Date Chosen</span>
                            <strong id="displayDate" class="text-sm sm:text-base text-[#0B2545] font-serif-brand">Please select an available date on the calendar</strong>
                        </div>
                    </div>

                    <button type="button" onclick="validateStep1AndProceed()" class="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#0077C8] to-[#00A896] hover:from-[#0284C7] hover:to-[#02B19E] shadow-md transition-all cursor-pointer">
                        <span>Continue to Step 2: Event Details &rarr;</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- ======================================================== -->
        <!-- SLIDE 2: EVENT DETAILS & TIMES                            -->
        <!-- ======================================================== -->
        <div id="slide2" style="display:none;" class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
            <div>
                <span class="text-xs font-bold uppercase tracking-wider text-[#00A896]">Step 2 of 3</span>
                <h2 class="text-2xl font-serif-brand font-bold text-[#0B2545]">Event Details &amp; Timings</h2>
                <p class="text-xs text-slate-500">Configure your required hours and setup arrangements.</p>
            </div>

            <!-- Times -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="text-xs font-bold text-slate-700 block mb-1">Start Time *</label>
                    <input type="time" name="start_time" id="startTimeInput" value="<?= e($_POST['start_time'] ?? '10:00') ?>" required class="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300">
                </div>
                <div>
                    <label class="text-xs font-bold text-slate-700 block mb-1">Finish Time *</label>
                    <input type="time" name="finish_time" id="finishTimeInput" value="<?= e($_POST['finish_time'] ?? '14:00') ?>" required class="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300">
                </div>
            </div>

            <!-- Event Type & Attendees -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="text-xs font-bold text-slate-700 block mb-1">Event Type *</label>
                    <input type="text" name="event_type" value="<?= e($_POST['event_type'] ?? 'Community Function') ?>" required class="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300" placeholder="e.g. Seminar, Workshop, Family Gathering">
                </div>
                <div>
                    <label class="text-xs font-bold text-slate-700 block mb-1">Expected Attendees *</label>
                    <input type="number" name="attendees" min="1" max="250" value="<?= e($_POST['attendees'] ?? '40') ?>" required class="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300">
                </div>
            </div>

            <!-- Layout & Kitchen -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="text-xs font-bold text-slate-700 block mb-1">Seating Layout Preference</label>
                    <select name="layout_preference" class="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300">
                        <option value="Theatre style (Chairs facing stage)">Theatre style (Chairs facing stage)</option>
                        <option value="Classroom tables (Workshop style)">Classroom tables (Workshop style)</option>
                        <option value="Boardroom conference table">Boardroom conference table</option>
                        <option value="Open circle discussion">Open circle discussion</option>
                        <option value="Clear floor space">Clear floor space</option>
                    </select>
                </div>
                <div class="flex items-center pt-5">
                    <label class="flex items-center gap-2.5 text-xs text-slate-700 font-medium cursor-pointer">
                        <input type="checkbox" name="needs_kitchen" value="1" <?= !empty($_POST['needs_kitchen']) ? 'checked' : '' ?> class="rounded text-[#00A896]">
                        <span>Include Warming Kitchen Access (+£15/hr)</span>
                    </label>
                </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button type="button" onclick="goToStep(1)" class="px-6 py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">&larr; Back to Step 1</button>
                <button type="button" onclick="goToStep(3)" class="px-8 py-3 rounded-full text-xs font-bold text-white bg-[#0B2545] hover:bg-[#0077C8] cursor-pointer">Continue to Step 3: Contact &amp; Submit &rarr;</button>
            </div>
        </div>

        <!-- ======================================================== -->
        <!-- SLIDE 3: CONTACT INFORMATION & SUBMIT                     -->
        <!-- ======================================================== -->
        <div id="slide3" style="display:none;" class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
            <div>
                <span class="text-xs font-bold uppercase tracking-wider text-[#00A896]">Step 3 of 3</span>
                <h2 class="text-2xl font-serif-brand font-bold text-[#0B2545]">Contact Information &amp; Submission</h2>
                <p class="text-xs text-slate-500">Provide your contact details so our coordinator can send confirmation.</p>
            </div>

            <!-- Name & Email -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                    <input type="text" name="full_name" value="<?= e($_POST['full_name'] ?? '') ?>" required class="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300" placeholder="Your full name">
                </div>
                <div>
                    <label class="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                    <input type="email" name="email" value="<?= e($_POST['email'] ?? '') ?>" required class="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300" placeholder="name@example.com">
                </div>
            </div>

            <!-- Phone & Org -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="text-xs font-bold text-slate-700 block mb-1">Telephone / WhatsApp *</label>
                    <input type="tel" name="phone" value="<?= e($_POST['phone'] ?? '') ?>" required class="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300" placeholder="07123 456789">
                </div>
                <div>
                    <label class="text-xs font-bold text-slate-700 block mb-1">Organisation (Optional)</label>
                    <input type="text" name="organisation" value="<?= e($_POST['organisation'] ?? '') ?>" class="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300" placeholder="Community group or charity">
                </div>
            </div>

            <!-- Requirements -->
            <div>
                <label class="text-xs font-bold text-slate-700 block mb-1">Special Requirements (Optional)</label>
                <textarea name="additional_requirements" rows="2" class="w-full text-xs p-3 rounded-xl border border-slate-300" placeholder="Projector screen, microphone, table arrangement..."><?= e($_POST['additional_requirements'] ?? '') ?></textarea>
            </div>

            <!-- Checkboxes -->
            <div class="space-y-2 pt-2 border-t border-slate-100">
                <label class="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                    <input type="checkbox" name="terms_accepted" value="1" required class="mt-0.5 rounded text-[#00A896]">
                    <span>I confirm this booking adheres to the center’s alcohol-free ethos and community guidelines. *</span>
                </label>
                <label class="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                    <input type="checkbox" name="privacy_accepted" value="1" required class="mt-0.5 rounded text-[#00A896]">
                    <span>I consent to the processing of contact information in accordance with UK GDPR. *</span>
                </label>
            </div>

            <!-- Navigation Buttons -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button type="button" onclick="goToStep(2)" class="px-6 py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">&larr; Back to Step 2</button>
                <button type="submit" class="px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#0077C8] to-[#00A896] hover:from-[#0284C7] hover:to-[#02B19E] shadow-md transition-all cursor-pointer">
                    Submit Booking Request &rarr;
                </button>
            </div>
        </div>
    </form>
</div>

<!-- Reactive 2-Colour Calendar Script & Slideshow Step Controller -->
<script>
const blockedDates = <?= json_encode($blocked_dates) ?>;
const existingBookings = <?= json_encode($existing_bookings) ?>;

let currentStep = 1;
let selectedFacilityId = '<?= e($preselect_fac) ?>';
let selectedDate = '<?= e($_POST['booking_date'] ?? '') ?>';
let calDate = new Date();

function goToStep(step) {
    if (step === 2 || step === 3) {
        if (!selectedDate) {
            document.getElementById('dateNoticeText').innerText = "Please first select an Available (Green) date from the calendar in Step 1.";
            document.getElementById('dateNotice').style.display = 'flex';
            window.scrollTo({ top: 150, behavior: 'smooth' });
            return;
        }
    }

    currentStep = step;
    document.getElementById('slide1').style.display = (step === 1) ? 'block' : 'none';
    document.getElementById('slide2').style.display = (step === 2) ? 'block' : 'none';
    document.getElementById('slide3').style.display = (step === 3) ? 'block' : 'none';

    // Update buttons
    [1, 2, 3].forEach(s => {
        const btn = document.getElementById('stepBtn' + s);
        const badge = document.getElementById('stepBadge' + s);
        if (s === step) {
            btn.className = "flex items-center gap-3 p-3 rounded-2xl text-left bg-[#0B2545] text-white shadow-sm ring-2 ring-[#0077C8] transition-all";
            badge.className = "w-8 h-8 rounded-xl bg-[#0077C8] text-white flex items-center justify-center text-xs font-bold shrink-0";
        } else if (s < step) {
            btn.className = "flex items-center gap-3 p-3 rounded-2xl text-left bg-slate-100 text-slate-800 hover:bg-slate-200 transition-all cursor-pointer";
            badge.className = "w-8 h-8 rounded-xl bg-[#00A896] text-white flex items-center justify-center text-xs font-bold shrink-0";
        } else {
            btn.className = "flex items-center gap-3 p-3 rounded-2xl text-left bg-slate-50 text-slate-400 transition-all";
            badge.className = "w-8 h-8 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0";
        }
    });

    window.scrollTo({ top: 150, behavior: 'smooth' });
}

function validateStep1AndProceed() {
    if (!selectedDate) {
        document.getElementById('dateNoticeText').innerText = "Please select an available green date from the calendar before continuing.";
        document.getElementById('dateNotice').style.display = 'flex';
        return;
    }
    goToStep(2);
}

function onFacilityChange(facId) {
    selectedFacilityId = facId;
    document.querySelectorAll('.fac-card').forEach(c => {
        if (c.getAttribute('data-fac-id') === facId) {
            c.className = "fac-card p-4 rounded-2xl border text-left cursor-pointer flex flex-col justify-between transition-all border-[#0077C8] bg-[#F0F7FF] ring-2 ring-[#0077C8]";
        } else {
            c.className = "fac-card p-4 rounded-2xl border text-left cursor-pointer flex flex-col justify-between transition-all border-slate-200 bg-white hover:border-slate-300";
        }
    });
    renderCalendar();
}

function changeMonth(delta) {
    calDate.setMonth(calDate.getMonth() + delta);
    renderCalendar();
}

function isDateBooked(dateStr) {
    // Check blocked_dates
    const isBlocked = blockedDates.some(b => b.blocked_date === dateStr && (b.facility_id === 'all' || b.facility_id === selectedFacilityId));
    if (isBlocked) return true;

    // Check existing confirmed/pending bookings
    const isBooked = existingBookings.some(b => b.booking_date === dateStr && b.facility_id === selectedFacilityId);
    return isBooked;
}

function renderCalendar() {
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('calMonthTitle').innerText = monthNames[month] + " " + year;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date().toISOString().split('T')[0];

    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = "h-14 sm:h-16 rounded-xl bg-transparent";
        grid.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
        const isPast = (dStr < today);
        const booked = isDateBooked(dStr);
        const isSelected = (dStr === selectedDate);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.innerHTML = `<span class="font-bold text-xs">${d}</span><span class="w-2 h-2 rounded-full ${booked ? 'bg-[#EF4444]' : isSelected ? 'bg-[#00A896]' : 'bg-[#10B981]'}"></span><span class="text-[9px] font-semibold hidden sm:block">${isPast ? 'Past' : booked ? 'Booked' : 'Available'}</span>`;

        if (isPast) {
            btn.className = "h-14 sm:h-16 rounded-xl flex flex-col items-center justify-between p-1.5 text-xs bg-slate-100/60 text-slate-300 border border-slate-100 cursor-not-allowed opacity-50";
            btn.disabled = true;
        } else if (booked) {
            // Booked Slot (Red) - Cannot be selected
            btn.className = "h-14 sm:h-16 rounded-xl flex flex-col items-center justify-between p-1.5 text-xs bg-rose-50/90 border border-rose-200 text-rose-500 cursor-not-allowed opacity-80";
            btn.disabled = true;
            btn.onclick = function() {
                document.getElementById('dateNoticeText').innerText = `Date ${dStr} is a Booked Slot (Red) and cannot be selected. Please choose a green available date.`;
                document.getElementById('dateNotice').style.display = 'flex';
            };
        } else {
            // Available (Green)
            if (isSelected) {
                btn.className = "h-14 sm:h-16 rounded-xl flex flex-col items-center justify-between p-1.5 text-xs bg-[#0B2545] text-white border-[#0B2545] ring-2 ring-[#0077C8] shadow-md cursor-pointer";
            } else {
                btn.className = "h-14 sm:h-16 rounded-xl flex flex-col items-center justify-between p-1.5 text-xs bg-emerald-50/50 hover:bg-emerald-100 border border-emerald-200 text-slate-800 cursor-pointer";
            }
            btn.onclick = function() {
                selectedDate = dStr;
                document.getElementById('selectedBookingDate').value = dStr;
                document.getElementById('displayDate').innerText = dStr + " (Available)";
                document.getElementById('dateNotice').style.display = 'none';
                renderCalendar();
            };
        }

        grid.appendChild(btn);
    }
}

// Auto-select initial available date if none selected
if (!selectedDate) {
    const today = new Date();
    for (let i = 2; i <= 30; i++) {
        const nextD = new Date(today);
        nextD.setDate(today.getDate() + i);
        const str = nextD.toISOString().split('T')[0];
        if (!isDateBooked(str)) {
            selectedDate = str;
            document.getElementById('selectedBookingDate').value = str;
            document.getElementById('displayDate').innerText = str + " (Available)";
            break;
        }
    }
}

renderCalendar();
</script>

<?php require_once APP_ROOT . '/includes/footer.php'; ?>
