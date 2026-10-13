<?php
define('APP_ROOT', __DIR__);
$page_title = "Facilities & Pricing";
require_once APP_ROOT . '/includes/header.php';

$stmt = $pdo->query("SELECT * FROM facilities WHERE is_active = 1 ORDER BY capacity DESC");
$facilities = $stmt->fetchAll();
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
    <!-- Header Banner -->
    <section class="rounded-3xl bg-gradient-to-b from-[#142318] to-[#0F1B12] text-white p-8 sm:p-12 shadow-sm">
        <div class="max-w-3xl space-y-4">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#B8C053]/20 text-[#B8C053] border border-[#B8C053]/30">
                Transparent Pricing & Capacities
            </span>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-serif-brand font-bold text-white">
                Facilities & Hire Pricing
            </h1>
            <p class="text-base text-stone-300 leading-relaxed">
                High-standard, multi-purpose event halls, meeting suites, and classroom spaces on Tinsley Park Road in Sheffield. All bookings include high-speed Wi-Fi, audio-visual presentation equipment, and step-free accessibility.
            </p>
            <div class="pt-2">
                <a href="booking.php" class="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-[#B8C053] text-[#14220C] hover:bg-[#c5cd62] transition-colors shadow-sm">
                    Check Availability & Book Online
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
            <div class="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row gap-8 justify-between">
                <div class="space-y-4 max-w-2xl">
                    <div class="flex items-center gap-3">
                        <h3 class="text-2xl font-serif-brand font-bold text-[#182B1C]"><?= e($fac['name']) ?></h3>
                        <span class="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium"><?= e($fac['category']) ?></span>
                    </div>

                    <p class="text-sm text-stone-600 leading-relaxed"><?= e($fac['description']) ?></p>

                    <div class="grid grid-cols-2 gap-4 text-xs pt-2">
                        <div class="bg-[#FAF9F5] p-3 rounded-xl border border-stone-200">
                            <span class="font-bold text-[#182B1C] block">CAPACITY & SPECS</span>
                            <span>Up to <?= (int)$fac['capacity'] ?> people &bull; <?= e($fac['dimensions'] ?? 'Flexible layout') ?></span>
                        </div>
                        <div class="bg-[#FAF9F5] p-3 rounded-xl border border-stone-200">
                            <span class="font-bold text-[#182B1C] block">REFUNDABLE BOND</span>
                            <span>Deposit: £<?= number_format($fac['deposit_required'], 2) ?></span>
                        </div>
                    </div>

                    <?php if (!empty($equipment)): ?>
                        <div class="pt-2">
                            <span class="text-xs font-bold text-stone-700 block mb-1">Included Equipment:</span>
                            <div class="flex flex-wrap gap-1.5">
                                <?php foreach ($equipment as $item): ?>
                                    <span class="text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-700">&check; <?= e($item) ?></span>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>

                <div class="lg:w-72 bg-stone-50 p-6 rounded-2xl border border-stone-200/80 flex flex-col justify-between space-y-4 shrink-0 text-center lg:text-right">
                    <div>
                        <span class="text-3xl font-extrabold text-[#182B1C] block">
                            £<?= number_format($fac['hourly_rate'], 2) ?>
                        </span>
                        <span class="text-xs text-stone-500 font-medium block">per hour (Weekdays)</span>
                        <span class="text-xs text-[#437A3B] font-bold block mt-1">
                            £<?= number_format($fac['weekend_rate'], 2) ?> / hr (Weekends)
                        </span>
                    </div>
                    <a href="booking.php?facility=<?= urlencode($fac['id']) ?>" class="w-full py-3 rounded-full text-xs font-bold bg-[#182B1C] text-white hover:bg-[#253f2a] transition-colors text-center shadow-xs">
                        Book This Space &rarr;
                    </a>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<?php require_once APP_ROOT . '/includes/footer.php'; ?>
