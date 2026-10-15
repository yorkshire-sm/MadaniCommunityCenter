<?php
define('APP_ROOT', __DIR__);
$page_title = "Home - Community Center Bookings";
require_once APP_ROOT . '/includes/header.php';

// Fetch active facilities from MySQL database
$stmt = $pdo->query("SELECT * FROM facilities WHERE is_active = 1 ORDER BY capacity DESC");
$facilities = $stmt->fetchAll();
?>

<!-- Hero Section -->
<section class="bg-gradient-to-b from-[#07192F] via-[#0B2545] to-[#07192F] text-white pt-12 pb-20 sm:pt-20 sm:pb-28">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div class="lg:col-span-7 space-y-6">
                <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#00A896]/15 text-[#00A896] border border-[#00A896]/30">
                    Sheffield Premier Community &amp; Event Venue
                </span>

                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif-brand font-bold tracking-tight text-white leading-tight">
                    Book Flexible Spaces for Community, Education &amp; Private Events
                </h1>

                <p class="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                    Welcome to <strong>Madani Community Center</strong> on Tinsley Park Road in Sheffield. We offer high-spec event halls, modern meeting rooms, and classroom spaces with transparent hire prices and rapid online availability confirmation.
                </p>

                <div class="flex flex-wrap items-center gap-3.5 pt-2">
                    <a href="booking.php" class="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold bg-[#0077C8] text-white hover:bg-[#005FA3] transition-all shadow-md">
                        Check Availability &amp; Book
                    </a>
                    <a href="facilities.php" class="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-white border border-white/25 hover:bg-white/10 transition-colors">
                        Explore Rooms &amp; Rates &rarr;
                    </a>
                </div>

                <div class="pt-4 grid grid-cols-3 gap-3 border-t border-white/10 text-xs text-slate-300">
                    <div>&bull; Step-Free Access</div>
                    <div>&bull; From £20/Hour</div>
                    <div>&bull; Free On-Site Parking</div>
                </div>
            </div>

            <!-- Hero Photography Card -->
            <div class="lg:col-span-5">
                <div class="rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-slate-900 relative aspect-4/3 flex items-center justify-center p-8 text-center bg-gradient-to-br from-[#0B2545] to-[#07192F]">
                    <div class="space-y-2">
                        <span class="text-[#00A896] font-bold text-xs uppercase tracking-widest block">Building Exterior</span>
                        <h3 class="text-2xl font-serif-brand font-bold text-white">Madani Community Center</h3>
                        <p class="text-xs text-slate-300">Tinsley Park Road, Sheffield, S9 5DL</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- 4 Simple Booking Steps -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="text-center max-w-2xl mx-auto space-y-2 mb-12">
        <span class="text-xs font-bold uppercase tracking-wider text-[#00A896]">Simple 4-Step Process</span>
        <h2 class="text-3xl font-serif-brand font-bold text-[#0B2545]">How to Book the Center</h2>
        <p class="text-sm text-slate-600">No account registration required. Submit preferred dates online and receive prompt coordinator review.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-2">
            <span class="text-3xl font-extrabold text-[#0077C8]/40 font-mono">01</span>
            <h3 class="text-base font-bold text-[#0B2545]">Choose Facility</h3>
            <p class="text-xs text-slate-600">Select from our assembly hall, boardroom suite, classrooms, or youth activity lounge.</p>
        </div>
        <div class="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-2">
            <span class="text-3xl font-extrabold text-[#0077C8]/40 font-mono">02</span>
            <h3 class="text-base font-bold text-[#0B2545]">Check Live Calendar</h3>
            <p class="text-xs text-slate-600">View real-time availability to ensure no conflicting reservations on your chosen date.</p>
        </div>
        <div class="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-2">
            <span class="text-3xl font-extrabold text-[#0077C8]/40 font-mono">03</span>
            <h3 class="text-base font-bold text-[#0B2545]">Submit Request</h3>
            <p class="text-xs text-slate-600">Fill out your event requirements and receive your official reference code instantly.</p>
        </div>
        <div class="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-2">
            <span class="text-3xl font-extrabold text-[#0077C8]/40 font-mono">04</span>
            <h3 class="text-base font-bold text-[#0B2545]">Coordinator Approval</h3>
            <p class="text-xs text-slate-600">Our bookings coordinator reviews your request and emails confirmation within 24–48 hours.</p>
        </div>
    </div>
</section>

<!-- Facilities Showcase -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <div class="flex items-end justify-between border-b border-slate-200 pb-4">
        <div>
            <span class="text-xs font-bold uppercase tracking-wider text-[#00A896]">Spaces for Every Occasion</span>
            <h2 class="text-3xl font-serif-brand font-bold text-[#0B2545] mt-1">Available Rooms &amp; Hire Prices</h2>
        </div>
        <a href="facilities.php" class="text-xs font-bold text-[#0077C8] hover:text-[#0B2545] transition-colors">
            View Full Specs &amp; Pricing &rarr;
        </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <?php foreach ($facilities as $fac): ?>
            <div class="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                <div class="p-6 space-y-3">
                    <div class="flex items-center justify-between">
                        <h3 class="text-xl font-serif-brand font-bold text-[#0B2545]"><?= e($fac['name']) ?></h3>
                        <span class="text-xs font-bold px-3 py-1 bg-[#0B2545] text-white rounded-full">
                            £<?= number_format($fac['hourly_rate'], 0) ?>/hr
                        </span>
                    </div>
                    <span class="text-xs text-slate-500 font-medium block">Capacity: Up to <?= (int)$fac['capacity'] ?> attendees</span>
                    <p class="text-xs text-slate-600 leading-relaxed"><?= e($fac['description']) ?></p>
                </div>
                <div class="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                    <span class="text-xs text-slate-500">Deposit: £<?= number_format($fac['deposit_required'], 0) ?> refundable</span>
                    <a href="booking.php?facility=<?= urlencode($fac['id']) ?>" class="px-4 py-2 rounded-full text-xs font-bold bg-[#0077C8] text-white hover:bg-[#0B2545] transition-colors">
                        Book This Space &rarr;
                    </a>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</section>

<?php require_once APP_ROOT . '/includes/footer.php'; ?>
