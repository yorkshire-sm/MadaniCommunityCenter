    </main>

    <!-- Footer Component -->
    <footer class="bg-[#101A12] text-stone-300 border-t border-[#1C2C1F]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
                <!-- Col 1: Brand Info (5 cols) -->
                <div className="lg:col-span-5 space-y-4">
                    <div class="flex items-center gap-3">
                        <div class="h-10 w-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
                            <span class="text-[#142318] font-bold text-xs">MCC</span>
                        </div>
                        <div class="flex flex-col">
                            <div class="text-lg font-bold font-sans text-white">
                                MADANI <span class="text-[#B8C053]">COMMUNITY CENTER</span>
                            </div>
                            <span class="text-[10px] text-stone-400 uppercase tracking-widest">
                                DAWAT-E-ISLAMI SHEFFIELD
                            </span>
                        </div>
                    </div>
                    <p class="text-sm text-stone-400 leading-relaxed max-w-sm mt-3">
                        Sheffield’s dedicated community centre booking platform on Tinsley Park Road. Providing transparent availability and easy online reservations for event halls, training suites, and classrooms.
                    </p>
                </div>

                <!-- Col 2: Navigation (3 cols) -->
                <div class="lg:col-span-3 space-y-3">
                    <h4 class="text-xs font-semibold text-white uppercase tracking-wider">Navigation</h4>
                    <ul class="space-y-2 text-sm text-stone-400">
                        <li><a href="index.php" class="hover:text-[#B8C053] transition-colors">Home</a></li>
                        <li><a href="facilities.php" class="hover:text-[#B8C053] transition-colors">Facilities & Pricing</a></li>
                        <li><a href="booking.php" class="hover:text-[#B8C053] transition-colors">Availability & Booking</a></li>
                        <li><a href="contact.php" class="hover:text-[#B8C053] transition-colors">Contact & Location</a></li>
                        <li class="pt-2 border-t border-[#1C2C1F]"><a href="admin/login.php" class="hover:text-white transition-colors text-xs">&rarr; Administrator Gateway</a></li>
                    </ul>
                </div>

                <!-- Col 3: Venue Information (4 cols) -->
                <div class="lg:col-span-4 space-y-3">
                    <h4 class="text-xs font-semibold text-white uppercase tracking-wider">Venue Location</h4>
                    <p class="text-xs text-stone-400 leading-relaxed">
                        Tinsley Park Road, Sheffield, S9 5DL, United Kingdom<br>
                        Telephone: 0114 244 8000<br>
                        Email: venuehire@madanicenter.org.uk
                    </p>
                    <div class="p-3 rounded-xl bg-[#162419] border border-[#233827] text-[11px] text-stone-300 mt-2">
                        Alcohol-free community facility. Bookings subject to administrative approval.
                    </div>
                </div>
            </div>
        </div>

        <div class="border-t border-[#1C2C1F] bg-[#0C150E] text-stone-500 text-xs py-4 text-center">
            &copy; <?= date('Y') ?> Madani Community Center &middot; Dawat-e-Islami Sheffield. All rights reserved.
        </div>
    </footer>
</body>
</html>
