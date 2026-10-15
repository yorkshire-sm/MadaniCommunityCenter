<?php
define('APP_ROOT', __DIR__);
$page_title = "Facilities & Pricing";
require_once APP_ROOT . '/includes/header.php';

$facilities = [];
try {
    if (!empty($pdo)) {
        $stmt = $pdo->query("SELECT * FROM facilities WHERE is_active = 1 ORDER BY capacity DESC");
        $facilities = $stmt->fetchAll();
    }
} catch (Throwable $e) {
    error_log("Failed to load facilities in facilities.php: " . $e->getMessage());
}

if (empty($facilities)) {
    $facilities = [
        [
            'id' => 'fac-main-hall',
            'name' => 'Main Community & Event Hall',
            'category' => 'Large Assembly & Functions',
            'capacity' => 250,
            'hourly_rate' => 45.00,
            'weekend_rate' => 55.00,
            'deposit_required' => 150.00,
            'description' => 'Our primary assembly space offers high ceilings, clean timber-finish flooring, and flexible seating arrangements. Perfect for community conferences, seminars, youth rallies, and family gatherings.',
            'dimensions' => '18m x 12m (216 sqm)',
            'features_json' => json_encode(["High ceilings with natural perimeter daylight", "Step-free ground floor entrance and wide double doors", "Direct access to reception foyer", "Climate control & ventilation"]),
            'equipment_json' => json_encode(["PA Sound system with 2 wireless microphones", "HD ceiling projector & motorized 120 inch screen", "200 upholstered chairs & 25 tables", "Stage riser setup", "High-speed Wi-Fi"]),
        ],
        [
            'id' => 'fac-meeting-suite',
            'name' => 'Meeting & Training Suite',
            'category' => 'Small to Medium Meetings',
            'capacity' => 35,
            'hourly_rate' => 25.00,
            'weekend_rate' => 30.00,
            'deposit_required' => 50.00,
            'description' => 'A focused, quiet acoustic environment designed for trustee board meetings, committee discussions, staff training sessions, and small group seminars.',
            'dimensions' => '8m x 5m (40 sqm)',
            'features_json' => json_encode(["Acoustic sound-dampened privacy walls", "Natural daylight with blackout blinds", "Beverage preparation counter", "Executive boardroom layout"]),
            'equipment_json' => json_encode(["65 inch 4K Smart TV display with HDMI share", "Conference speakerphone for hybrid Zoom", "Dry-wipe whiteboard & flipcharts", "Ergonomic meeting chairs"]),
        ],
        [
            'id' => 'fac-classrooms',
            'name' => 'Modular Classroom Spaces',
            'category' => 'Teaching & Study Circles',
            'capacity' => 28,
            'hourly_rate' => 20.00,
            'weekend_rate' => 25.00,
            'deposit_required' => 40.00,
            'description' => 'Well-appointed educational rooms equipped with standard pupil desks and presentation boards. Ideal for supplementary evening education, adult Arabic classes, and GCSE revision.',
            'dimensions' => '7m x 6m (42 sqm)',
            'features_json' => json_encode(["Quiet educational wing", "Natural daylight & bright LED reading lights", "Multiple laptop electrical points", "Teacher presentation desk"]),
            'equipment_json' => json_encode(["Standard single/double desks & chairs", "Large whiteboard & dry-wipe markers", "Wall projection area", "Educational Wi-Fi"]),
        ],
        [
            'id' => 'fac-youth-lounge',
            'name' => 'Youth & Community Activity Lounge',
            'category' => 'Social & Recreational',
            'capacity' => 50,
            'hourly_rate' => 30.00,
            'weekend_rate' => 35.00,
            'deposit_required' => 60.00,
            'description' => 'A vibrant, multi-purpose space with resilient flooring suited to youth social meetups, table tennis, mentoring circles, sisters morning teas, and wellbeing workshops.',
            'dimensions' => '12m x 8m (96 sqm)',
            'features_json' => json_encode(["Durable non-slip vinyl sports flooring", "Modular soft seating & breakout zones", "Tea & refreshment counter", "Step-free ground level access"]),
            'equipment_json' => json_encode(["Table tennis tables & recreational games", "Bluetooth audio speaker", "Folding tables & light stackable chairs", "High-speed Wi-Fi"]),
        ]
    ];
}
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
    <!-- Header Banner -->
    <section class="rounded-3xl bg-gradient-to-b from-[#07192F] to-[#0B2545] text-white p-8 sm:p-12 shadow-sm">
        <div class="max-w-3xl space-y-4">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#00A896]/20 text-[#00A896] border border-[#00A896]/30">
                Transparent Pricing &amp; Capacities
            </span>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-serif-brand font-bold text-white">
                Facilities &amp; Hire Pricing
            </h1>
            <p class="text-base text-slate-300 leading-relaxed">
                High-standard, multi-purpose event halls, meeting suites, and classroom spaces on Tinsley Park Road in Sheffield. All bookings include high-speed Wi-Fi, audio-visual presentation equipment, and step-free accessibility.
            </p>
            <div class="pt-2">
                <a href="booking.php" class="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-[#0077C8] text-white hover:bg-[#005FA3] transition-colors shadow-sm">
                    Check Availability &amp; Book Online
                </a>
            </div>
        </div>
    </section>

    <!-- Detailed Space Breakdown -->
    <div class="space-y-8">
        <?php foreach ($facilities as $fac): 
            $features = !empty($fac['features_json']) ? json_decode($fac['features_json'], true) : [];
            $equipment = !empty($fac['equipment_json']) ? json_decode($fac['equipment_json'], true) : [];
        ?>
            <div class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row gap-8 justify-between">
                <div class="space-y-4 max-w-2xl">
                    <div class="flex items-center gap-3">
                        <h3 class="text-2xl font-serif-brand font-bold text-[#0B2545]"><?= e($fac['name']) ?></h3>
                        <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium"><?= e($fac['category']) ?></span>
                    </div>

                    <p class="text-sm text-slate-600 leading-relaxed"><?= e($fac['description']) ?></p>

                    <div class="grid grid-cols-2 gap-4 text-xs pt-2">
                        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <span class="font-bold text-[#0B2545] block">CAPACITY &amp; SPECS</span>
                            <span>Up to <?= (int)$fac['capacity'] ?> people &bull; <?= e($fac['dimensions'] ?? 'Flexible layout') ?></span>
                        </div>
                        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <span class="font-bold text-[#0B2545] block">REFUNDABLE BOND</span>
                            <span>Deposit: £<?= number_format($fac['deposit_required'], 2) ?></span>
                        </div>
                    </div>

                    <?php if (!empty($equipment)): ?>
                        <div class="pt-2">
                            <span class="text-xs font-bold text-slate-700 block mb-1">Included Equipment:</span>
                            <div class="flex flex-wrap gap-1.5">
                                <?php foreach ($equipment as $item): ?>
                                    <span class="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">&check; <?= e($item) ?></span>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>

                <div class="lg:w-72 bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-4 shrink-0 text-center lg:text-right">
                    <div>
                        <span class="text-3xl font-extrabold text-[#0B2545] block">
                            £<?= number_format($fac['hourly_rate'], 2) ?>
                        </span>
                        <span class="text-xs text-slate-500 font-medium block">per hour (Weekdays)</span>
                        <span class="text-xs text-[#00A896] font-bold block mt-1">
                            £<?= number_format($fac['weekend_rate'], 2) ?> / hr (Weekends)
                        </span>
                    </div>
                    <a href="booking.php?facility=<?= urlencode($fac['id']) ?>" class="w-full py-3 rounded-full text-xs font-bold bg-[#0077C8] text-white hover:bg-[#0B2545] transition-colors text-center shadow-xs">
                        Book This Space &rarr;
                    </a>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<?php require_once APP_ROOT . '/includes/footer.php'; ?>
