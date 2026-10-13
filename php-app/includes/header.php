<?php
if (!defined('APP_ROOT')) {
    define('APP_ROOT', dirname(__DIR__));
}
require_once APP_ROOT . '/config/database.php';
require_once APP_ROOT . '/config/security.php';

$current_page = basename($_SERVER['PHP_SELF'], '.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($page_title) ? e($page_title) . ' - ' : '' ?>Madani Community Center Sheffield</title>
    <meta name="description" content="Book flexible event halls, meeting rooms, and classroom spaces at Madani Community Center on Tinsley Park Road in Sheffield.">
    <!-- Google Fonts & Tailwind CDN for responsive modern styling -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style>
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .font-serif-brand { font-family: 'Playfair Display', Georgia, serif; }
    </style>
</head>
<body class="bg-[#FAF9F5] text-stone-900 antialiased min-h-screen flex flex-col selection:bg-[#B8C053]/30 selection:text-[#18260D]">

    <!-- Top Announcement Banner -->
    <div class="bg-[#0E1810] text-stone-200 border-b border-[#213525] py-2 px-4 text-xs">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <span class="truncate">
                <strong class="text-[#B8C053]">Madani Community Center:</strong> Online room & hall bookings are now open on Tinsley Park Road in Sheffield.
            </span>
            <a href="booking.php" class="text-[#B8C053] hover:text-white font-medium shrink-0 underline-offset-2 hover:underline">
                Check Availability &rarr;
            </a>
        </div>
    </div>

    <!-- Main Header Bar -->
    <header class="sticky top-0 z-40 w-full bg-[#142318]/95 backdrop-blur-md py-4 border-b border-[#233827] text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between gap-4">
                <!-- Brand Title -->
                <a href="index.php" class="flex items-center gap-3 text-left group">
                    <div class="h-11 w-11 rounded-xl bg-white p-1 shadow-md border border-white/20 flex items-center justify-center shrink-0">
                        <!-- Emblem Mark -->
                        <svg viewBox="0 0 500 420" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="gGold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#DFBD5E"/><stop offset="100%" stop-color="#9C7718"/></linearGradient>
                                <linearGradient id="gEmerald" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#145A40"/><stop offset="100%" stop-color="#072F21"/></linearGradient>
                            </defs>
                            <path d="M268 52 C268 67 256 79 240 79 C236.5 79 233.2 78.3 230 77.1 C241.5 73.2 249.5 62.5 249.5 50 C249.5 44 247.3 38.5 243.6 34.2 C257.6 36.5 268 43 268 52 Z" fill="url(#gGold)"/>
                            <path d="M250 82 C253 92, 276 114, 308 138 C340 162, 344 195, 344 250 L326 250 C326 200, 321 174, 294 152 C270 132, 253 112, 250 98 C247 112, 230 132, 206 152 C179 174, 174 200, 174 250 L156 250 C156 195, 160 162, 192 138 C224 114, 247 92, 250 82 Z" fill="url(#gEmerald)"/>
                            <circle cx="250" cy="172" r="18" fill="url(#gEmerald)"/>
                            <path d="M250 273 C265 264, 305 250, 348 262 C332 276, 295 288, 258 296 C205 288, 168 276, 152 262 C195 250, 235 264, 250 273 Z" fill="url(#gGold)"/>
                            <path d="M250 293 C270 282, 320 270, 362 284 C340 302, 295 316, 250 322 C205 316, 160 302, 138 284 C180 270, 230 282, 250 293 Z" fill="url(#gEmerald)"/>
                        </svg>
                    </div>
                    <div class="flex flex-col shrink-0">
                        <div class="flex items-center tracking-tight text-lg sm:text-xl font-bold font-sans whitespace-nowrap">
                            <span class="text-white tracking-wide">MADANI</span>
                            <span class="text-[#B8C053] ml-1.5 font-extrabold tracking-wider">COMMUNITY CENTER</span>
                        </div>
                        <span class="text-[10px] tracking-widest uppercase text-stone-300 font-medium whitespace-nowrap">
                            DAWAT-E-ISLAMI SHEFFIELD
                        </span>
                    </div>
                </a>

                <!-- 4 Main Navigation Links -->
                <nav class="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
                    <a href="index.php" class="<?= $current_page === 'index' ? 'text-[#B8C053] font-bold' : 'text-stone-200 hover:text-white' ?> transition-colors">Home</a>
                    <a href="facilities.php" class="<?= $current_page === 'facilities' ? 'text-[#B8C053] font-bold' : 'text-stone-200 hover:text-white' ?> transition-colors">Facilities & Pricing</a>
                    <a href="booking.php" class="<?= $current_page === 'booking' ? 'text-[#B8C053] font-bold' : 'text-stone-200 hover:text-white' ?> transition-colors">Availability & Booking</a>
                    <a href="contact.php" class="<?= $current_page === 'contact' ? 'text-[#B8C053] font-bold' : 'text-stone-200 hover:text-white' ?> transition-colors">Contact & Location</a>
                </nav>

                <!-- Actions -->
                <div class="flex items-center gap-3">
                    <a href="admin/login.php" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-white/20 text-stone-300 hover:text-white hover:bg-white/10 transition-colors">
                        <span>Admin</span>
                    </a>
                    <a href="booking.php" class="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs font-bold text-[#14220C] bg-[#B8C053] hover:bg-[#c5cd62] rounded-full transition-all shadow-sm">
                        <span>Book Now</span>
                    </a>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Body Container -->
    <main class="flex-1 pb-16">
