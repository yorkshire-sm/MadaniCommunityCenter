<?php
define('APP_ROOT', __DIR__);
$page_title = "Contact & Location";
require_once APP_ROOT . '/includes/header.php';

$feedback = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $feedback = ['type' => 'error', 'msg' => 'Security token invalid. Please refresh.'];
    } elseif (!empty($_POST['website_bot'])) {
        die("Invalid.");
    } else {
        $name = trim($_POST['name'] ?? '');
        $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $message = trim($_POST['message'] ?? '');

        if ($name && $email && $message) {
            $feedback = ['type' => 'success', 'msg' => 'Thank you for contacting Madani Community Center. Our team will get back to you shortly.'];
        } else {
            $feedback = ['type' => 'error', 'msg' => 'Please complete all required fields.'];
        }
    }
}
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
    <!-- Header -->
    <section class="max-w-2xl space-y-2">
        <span class="text-xs font-bold uppercase tracking-wider text-[#B8C053]">Get in Touch</span>
        <h1 class="text-3xl sm:text-4xl font-serif-brand font-bold text-[#182B1C]">
            Contact & Venue Location
        </h1>
        <p class="text-sm text-stone-600 leading-relaxed">
            We are here to assist with room viewings, event planning, and general community inquiries on Tinsley Park Road in Sheffield.
        </p>
    </section>

    <!-- Google Map Embed Section -->
    <section class="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
        <div class="flex items-center justify-between">
            <div>
                <h3 class="text-lg font-serif-brand font-bold text-[#182B1C]">Location & Travel</h3>
                <p class="text-xs text-stone-500">Easily accessible via Sheffield Parkway &amp; M1 Junction 34</p>
            </div>
            <a href="https://maps.google.com/?q=Madani+Community+Center+Sheffield" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-[#182B1C] hover:text-[#437A3B]">
                Open in Maps App &rarr;
            </a>
        </div>
        <div class="rounded-2xl overflow-hidden border border-stone-200 aspect-16/9 sm:aspect-21/9 bg-stone-100">
            <iframe 
                src="https://maps.google.com/maps?q=53.3974483,-1.418529+(Madani+Community+Center)&t=&z=17&ie=UTF8&iwloc=B&output=embed" 
                class="w-full h-full border-0" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade"
                title="Madani Community Center Map">
            </iframe>
        </div>
    </section>

    <!-- 2 Column: Info on Left, Form on Right -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-5 space-y-6">
            <div class="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
                <div>
                    <span class="text-xs font-bold uppercase tracking-wider text-[#B8C053]">Center Address</span>
                    <h3 class="text-xl font-bold text-[#182B1C] mt-0.5">Madani Community Center</h3>
                    <p class="text-xs text-stone-500">Dawat-e-Islami Sheffield</p>
                </div>

                <div class="text-xs text-stone-700 space-y-1">
                    <p class="font-semibold text-stone-900">Tinsley Park Road</p>
                    <p>Sheffield, South Yorkshire</p>
                    <p class="font-mono">S9 5DL</p>
                    <p class="text-stone-500">United Kingdom</p>
                </div>

                <div class="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-700">
                    <div><strong>Telephone:</strong> 0114 244 8000</div>
                    <div><strong>Bookings Email:</strong> venuehire@madanicenter.org.uk</div>
                    <div><strong>General Email:</strong> info@madanicenter.org.uk</div>
                </div>

                <div class="pt-3 border-t border-stone-100 text-xs text-stone-600">
                    <strong>Opening Times:</strong><br>
                    Monday &ndash; Sunday: 08:00 &ndash; 22:00 (By appointment &amp; pre-booked functions)
                </div>
            </div>
        </div>

        <div class="lg:col-span-7">
            <form method="POST" action="contact.php" class="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <?= csrf_input_field() ?>
                <div style="display:none;" aria-hidden="true"><input type="text" name="website_bot"></div>

                <h3 class="text-lg font-serif-brand font-bold text-[#182B1C]">Send an Enquiry</h3>

                <?php if ($feedback): ?>
                    <div class="p-3.5 rounded-xl text-xs <?= $feedback['type'] === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200' ?>">
                        <?= e($feedback['msg']) ?>
                    </div>
                <?php endif; ?>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="text-xs font-bold text-stone-700 block mb-1">Your Name *</label>
                        <input type="text" name="name" required class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-stone-700 block mb-1">Email Address *</label>
                        <input type="email" name="email" required class="w-full text-xs py-2 px-3 rounded-xl border border-stone-300">
                    </div>
                </div>

                <div>
                    <label class="text-xs font-bold text-stone-700 block mb-1">Message / Question *</label>
                    <textarea name="message" rows="4" required placeholder="Tell us how we can help..." class="w-full text-xs p-3 rounded-xl border border-stone-300"></textarea>
                </div>

                <div class="pt-2">
                    <button type="submit" class="px-6 py-2.5 rounded-full text-xs font-bold bg-[#182B1C] text-white hover:bg-[#253f2a] transition-colors shadow-xs">
                        Send Message &rarr;
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once APP_ROOT . '/includes/footer.php'; ?>
