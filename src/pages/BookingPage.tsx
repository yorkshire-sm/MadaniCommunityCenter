import React, { useState, useId } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info,
  Building,
  HelpCircle,
  Printer,
  ChevronLeft,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { bookingStore, Facility, Booking, BlockedDate } from '../data/bookingStore';

interface BookingPageProps {
  onNavigate: (path: string) => void;
  preselectedFacilityId?: string;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  onNavigate,
  preselectedFacilityId,
}) => {
  const honeypotId = useId();
  const [facilities] = useState<Facility[]>(() => bookingStore.getFacilities());
  const [bookings, setBookings] = useState<Booking[]>(() => bookingStore.getBookings());
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(() => bookingStore.getBlockedDates());

  // Form State
  const [facilityId, setFacilityId] = useState<string>(preselectedFacilityId || 'fac-main-hall');
  const [bookingDate, setBookingDate] = useState<string>(() => {
    // Default to next Saturday
    const d = new Date();
    d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState<string>('10:00');
  const [finishTime, setFinishTime] = useState<string>('14:00');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [organisation, setOrganisation] = useState<string>('');
  const [eventType, setEventType] = useState<string>('Community Seminar / Workshop');
  const [attendees, setAttendees] = useState<number>(50);
  const [layoutPreference, setLayoutPreference] = useState<string>('Theatre style');
  const [needsKitchen, setNeedsKitchen] = useState<boolean>(false);
  const [additionalRequirements, setAdditionalRequirements] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(false);
  const [honeypot, setHoneypot] = useState<string>(''); // Spam protection bot-trap

  // Calendar View State
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [calendarFacilityFilter, setCalendarFacilityFilter] = useState<string>('all');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);

  // Selected Facility Info
  const selectedFacility = facilities.find((f) => f.id === facilityId) || facilities[0];

  // Calculate Duration & Pricing
  const startHour = parseInt(startTime.split(':')[0], 10) + parseInt(startTime.split(':')[1], 10) / 60;
  const finishHour = parseInt(finishTime.split(':')[0], 10) + parseInt(finishTime.split(':')[1], 10) / 60;
  const durationHours = Math.max(0, finishHour - startHour);

  // Determine if selected date is weekend
  const isWeekend = (() => {
    try {
      const day = new Date(bookingDate).getDay();
      return day === 0 || day === 6;
    } catch {
      return false;
    }
  })();

  const hourlyRate = isWeekend ? selectedFacility.weekendRate : selectedFacility.hourlyRate;
  const baseCost = durationHours * hourlyRate;
  const kitchenCost = needsKitchen ? durationHours * 15 : 0;
  const totalCost = baseCost + kitchenCost;

  // Capacity Warning
  const isOverCapacity = attendees > selectedFacility.capacity;

  // Instant Conflict Check
  const conflictCheck = bookingStore.checkConflict(facilityId, bookingDate, startTime, finishTime);

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Spam honeypot check
    if (honeypot) {
      console.warn('Spam submission caught by honeypot.');
      return;
    }

    // Validation
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please complete your full name, email address, and contact telephone.');
      return;
    }

    if (durationHours < 1) {
      setErrorMsg('Bookings must be at least 1 hour in duration.');
      return;
    }

    if (finishTime <= startTime) {
      setErrorMsg('Finish time must be after start time.');
      return;
    }

    if (isOverCapacity) {
      setErrorMsg(`Expected attendee count (${attendees}) exceeds the maximum capacity of ${selectedFacility.name} (${selectedFacility.capacity} people).`);
      return;
    }

    if (!termsAccepted || !privacyAccepted) {
      setErrorMsg('Please confirm agreement to the booking conditions and privacy notice.');
      return;
    }

    if (conflictCheck.hasConflict) {
      setErrorMsg(conflictCheck.reason || 'This time slot is unavailable. Please pick a different date or time.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = bookingStore.submitBookingRequest({
        facilityId: selectedFacility.id,
        facilityName: selectedFacility.name,
        customerName: fullName.trim(),
        customerEmail: email.trim().toLowerCase(),
        customerPhone: phone.trim(),
        organisation: organisation.trim() || undefined,
        eventType,
        attendees,
        date: bookingDate,
        startTime,
        finishTime,
        hours: durationHours,
        hourlyRate,
        totalCost,
        additionalRequirements: additionalRequirements.trim() || undefined,
        layoutPreference,
        needsKitchen,
        termsAccepted,
        privacyAccepted,
      });

      if (!result.success || !result.booking) {
        setErrorMsg(result.error || 'Failed to submit booking. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setSubmittedBooking(result.booking);
      // Refresh local bookings list
      setBookings(bookingStore.getBookings());
      setBlockedDates(bookingStore.getBlockedDates());
      setIsSubmitting(false);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch {
      setErrorMsg('An unexpected error occurred while processing your booking. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Calendar Helpers
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigate Calendar Months
  const prevMonth = () => setCalendarMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCalendarMonth(new Date(year, month + 1, 1));

  // Determine availability status for a specific date on the calendar
  const getDayAvailability = (dateStr: string) => {
    // Check blocked
    const isBlocked = blockedDates.some((b) => b.date === dateStr && (calendarFacilityFilter === 'all' || b.facilityId === 'all' || b.facilityId === calendarFacilityFilter));
    if (isBlocked) {
      const block = blockedDates.find((b) => b.date === dateStr && (calendarFacilityFilter === 'all' || b.facilityId === 'all' || b.facilityId === calendarFacilityFilter));
      return { status: 'blocked', label: block?.reason || 'Center Closed' };
    }

    // Check confirmed bookings (public view: never expose customer names!)
    const confirmedOnDate = bookings.filter((b) => b.date === dateStr && b.status === 'confirmed' && (calendarFacilityFilter === 'all' || b.facilityId === calendarFacilityFilter));
    if (confirmedOnDate.length > 0) {
      return {
        status: 'booked',
        label: `${confirmedOnDate.length} Booked Slot${confirmedOnDate.length > 1 ? 's' : ''}`,
        slots: confirmedOnDate.map((b) => `${b.startTime} - ${b.finishTime}`),
      };
    }

    // Check pending bookings
    const pendingOnDate = bookings.filter((b) => b.date === dateStr && b.status === 'pending' && (calendarFacilityFilter === 'all' || b.facilityId === calendarFacilityFilter));
    if (pendingOnDate.length > 0) {
      return {
        status: 'pending',
        label: `${pendingOnDate.length} Pending Enquiry`,
      };
    }

    return { status: 'available', label: 'Slots Available' };
  };

  return (
    <div className="space-y-12 sm:space-y-16 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00A896]">
            Simple Online Booking
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-brand font-bold text-[#0B2545] tracking-tight">
            Check Availability & Request a Booking
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Select your preferred room, date, and times below. Our system checks real-time availability and calculates estimated hire costs immediately. All submissions are sent directly to the facility manager for rapid review.
          </p>

          <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Public privacy protected: Personal customer details are never visible on the public availability calendar.</span>
          </div>
        </div>
      </section>

      {/* Success Modal / Banner */}
      {submittedBooking && (
        <div className="rounded-3xl border-2 border-[#00A896] bg-[#F0FDF4] p-6 sm:p-10 shadow-md animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-[#00A896]/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00A896] text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00A896]">
                  Booking Request Received
                </span>
                <h3 className="text-2xl font-serif-brand font-bold text-[#0B2545]">
                  Thank You, {submittedBooking.customerName}!
                </h3>
                <p className="text-sm text-slate-700">
                  Your request has been securely logged with Reference Number:{' '}
                  <strong className="text-base text-[#0B2545] bg-white px-2 py-0.5 rounded border border-slate-300 font-mono">
                    {submittedBooking.reference}
                  </strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Confirmation
              </button>
              <button
                type="button"
                onClick={() => setSubmittedBooking(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#0B2545] text-white hover:bg-[#0077C8] transition-colors cursor-pointer"
              >
                Make Another Booking
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 text-xs text-slate-700">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-semibold block mb-1">FACILITY</span>
              <strong className="text-sm text-[#0B2545]">{submittedBooking.facilityName}</strong>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-semibold block mb-1">DATE & TIME</span>
              <strong className="text-sm text-[#0B2545]">
                {submittedBooking.date} ({submittedBooking.startTime} - {submittedBooking.finishTime})
              </strong>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-semibold block mb-1">ESTIMATED TOTAL</span>
              <strong className="text-sm text-[#0B2545]">
                £{submittedBooking.totalCost} ({submittedBooking.hours} hrs)
              </strong>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-semibold block mb-1">STATUS</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Pending Approval
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-white border border-[#00A896]/30 flex items-start gap-3 text-xs text-slate-700">
            <Info className="w-4 h-4 text-[#00A896] shrink-0 mt-0.5" />
            <div>
              <strong>Next Steps:</strong> An automated confirmation email has been logged for <span className="font-semibold text-slate-900">{submittedBooking.customerEmail}</span>. Our bookings team will review calendar arrangements and send your official invoice & keyholder confirmation within 24–48 hours.
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Calendar on Left, Booking Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Public Availability Calendar (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#0077C8]" />
                <h3 className="text-base font-bold text-[#0B2545]">
                  Live Availability Calendar
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Click a date to select
              </span>
            </div>

            {/* Facility Filter for Calendar */}
            <div className="mt-4">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Filter Calendar by Space
              </label>
              <select
                value={calendarFacilityFilter}
                onChange={(e) => setCalendarFacilityFilter(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
              >
                <option value="all">All Spaces & Halls</option>
                {facilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mt-5 mb-3 px-1">
              <span className="text-sm font-bold text-[#0B2545]">
                {monthNames[month]} {year}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase py-1 border-b border-slate-100">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 pt-2">
              {/* Empty leading days */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10 sm:h-12 rounded-lg bg-transparent" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const availability = getDayAvailability(dateStr);
                const isSelected = bookingDate === dateStr;

                let dayBg = 'bg-slate-50 hover:bg-slate-100 text-slate-800';
                let indicatorDot = 'bg-[#00A896]';

                if (availability.status === 'blocked') {
                  dayBg = 'bg-rose-50/80 text-rose-800 hover:bg-rose-100';
                  indicatorDot = 'bg-rose-500';
                } else if (availability.status === 'booked') {
                  dayBg = 'bg-amber-50 text-amber-900 hover:bg-amber-100';
                  indicatorDot = 'bg-amber-500';
                }

                if (isSelected) {
                  dayBg = 'bg-[#0B2545] text-white shadow-xs font-bold';
                  indicatorDot = 'bg-[#00A896]';
                }

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => {
                      setBookingDate(dateStr);
                      setErrorMsg(null);
                    }}
                    className={`h-11 sm:h-12 rounded-xl flex flex-col items-center justify-between p-1 transition-all text-xs cursor-pointer ${dayBg} ${
                      isSelected ? 'ring-2 ring-[#0077C8]' : ''
                    }`}
                  >
                    <span className="font-semibold text-[11px]">{dayNum}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${indicatorDot}`} />
                  </button>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00A896]" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Booked Slot</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Blocked / Closed</span>
              </div>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="p-5 rounded-3xl bg-[#F0F7FF]/50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0B2545] uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-[#0077C8]" />
              Booking Policy Summary
            </div>
            <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00A896] shrink-0 mt-0.5" />
                <span><strong>No Account Needed:</strong> Anyone can submit a booking request without prior registration.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00A896] shrink-0 mt-0.5" />
                <span><strong>Pending Review:</strong> All submissions require administrator approval to prevent conflicting events.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00A896] shrink-0 mt-0.5" />
                <span><strong>Deposit Policy:</strong> A refundable bond is required before keys or access are issued.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Multi-Step Booking Request Form (7 cols) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-8"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00A896]">
                Step 1 of 3
              </span>
              <h3 className="text-2xl font-serif-brand font-bold text-[#0B2545] mt-1">
                Select Space, Date & Times
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Prices and duration update live as you choose your booking window.
              </p>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <strong className="font-bold">Booking Request Notice:</strong> {errorMsg}
                </div>
              </div>
            )}

            {/* Conflict Warning */}
            {conflictCheck.hasConflict && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <strong className="font-bold">Schedule Conflict Detected:</strong> {conflictCheck.reason}
                </div>
              </div>
            )}

            {/* Section 1: Facility & Schedule */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Select Facility Space <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {facilities.map((fac) => (
                    <button
                      key={fac.id}
                      type="button"
                      onClick={() => setFacilityId(fac.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        facilityId === fac.id
                          ? 'border-[#0077C8] bg-[#F0F7FF] ring-2 ring-[#0077C8]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs text-[#0B2545] block">
                          {fac.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Capacity: {fac.capacity} people
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#0077C8] mt-2 block">
                        £{isWeekend ? fac.weekendRate : fac.hourlyRate} / hr
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Booking Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
                  />
                  {isWeekend && (
                    <span className="text-[10px] text-amber-700 font-semibold block mt-1">
                      Weekend rate applies
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Start Time <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
                  >
                    {[
                      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
                      '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
                      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
                      '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
                      '20:00'
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Finish Time <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={finishTime}
                    onChange={(e) => setFinishTime(e.target.value)}
                    required
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
                  >
                    {[
                      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
                      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
                      '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
                      '21:00', '21:30', '22:00'
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Cost Summary Bar */}
              <div className="p-4 rounded-2xl bg-[#0B2545] text-white flex items-center justify-between flex-wrap gap-3">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold block">
                    Estimated Hire Total
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span>{durationHours} Hours</span>
                    <span>•</span>
                    <span>£{hourlyRate}/hr</span>
                    {needsKitchen && (
                      <>
                        <span>•</span>
                        <span>+£15/hr Kitchen</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-extrabold text-[#00A896]">
                    £{totalCost.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-300 block">
                    Deposit: £{selectedFacility.depositRequired} refundable
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Event Details */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00A896]">
                  Step 2 of 3
                </span>
                <h4 className="text-lg font-serif-brand font-bold text-[#0B2545] mt-0.5">
                  Event Purpose & Requirements
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Event Type / Description <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    required
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
                  >
                    <option value="Community Seminar / Workshop">Community Seminar / Workshop</option>
                    <option value="Educational Course / Tuition">Educational Course / Tuition</option>
                    <option value="Trustee / Board Meeting">Trustee / Board Meeting</option>
                    <option value="Youth Mentoring / Sports Social">Youth Mentoring / Sports Social</option>
                    <option value="Sisters Gathering / Halaqah">Sisters Gathering / Halaqah</option>
                    <option value="Family Gathering (Alcohol-free)">Family Gathering (Alcohol-free)</option>
                    <option value="Charity Fundraiser / Consultation">Charity Fundraiser / Consultation</option>
                    <option value="Other Suitable Community Function">Other Suitable Community Function</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Expected Number of Attendees <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={attendees}
                    onChange={(e) => setAttendees(parseInt(e.target.value, 10) || 0)}
                    required
                    className={`w-full text-xs py-2.5 px-3 rounded-xl border focus:outline-none focus:ring-2 ${
                      isOverCapacity
                        ? 'border-rose-400 bg-rose-50 text-rose-900 focus:ring-rose-400'
                        : 'border-slate-300 focus:ring-[#0077C8]'
                    }`}
                  />
                  {isOverCapacity && (
                    <span className="text-[10px] text-rose-600 font-semibold block mt-1">
                      Exceeds {selectedFacility.name} capacity ({selectedFacility.capacity} max).
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Preferred Room Layout
                  </label>
                  <select
                    value={layoutPreference}
                    onChange={(e) => setLayoutPreference(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
                  >
                    <option value="Theatre style (Chairs facing stage)">Theatre style (Chairs facing stage)</option>
                    <option value="Banquet / Dining rounds">Banquet / Dining rounds</option>
                    <option value="Classroom tables with chairs">Classroom tables with chairs</option>
                    <option value="Boardroom discussion format">Boardroom discussion format</option>
                    <option value="Open floor perimeter layout">Open floor perimeter layout</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Commercial Warming Kitchen Add-On
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needsKitchen}
                      onChange={(e) => setNeedsKitchen(e.target.checked)}
                      className="rounded text-[#0077C8] focus:ring-[#0077C8]"
                    />
                    <span className="text-xs text-slate-700">
                      Yes, add warming kitchen (£15/hour)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Additional Equipment or Special Requirements
                </label>
                <textarea
                  rows={2}
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="e.g. Wireless microphones, stage lectern, audio testing, disabled parking space..."
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
                />
              </div>
            </div>

            {/* Section 3: Customer Information */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00A896]">
                  Step 3 of 3
                </span>
                <h4 className="text-lg font-serif-brand font-bold text-[#0B2545] mt-0.5">
                  Contact & Organisation Details
                </h4>
              </div>

              {/* Bot Honeypot Input (Invisible to Humans) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor={honeypotId}>Do not fill this field</label>
                <input
                  id={honeypotId}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Tariq Mahmood"
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="e.g. tariq@example.com"
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Telephone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="e.g. 07700 900123"
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Organisation / Charity Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                    placeholder="e.g. Sheffield Youth Network"
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
                  />
                </div>
              </div>

              {/* Compliance & Privacy Checkboxes */}
              <div className="space-y-3 pt-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                    className="mt-0.5 rounded text-[#0077C8] focus:ring-[#0077C8]"
                  />
                  <span className="text-xs text-slate-600">
                    I confirm this booking adheres to the center’s alcohol-free ethos and community guidelines. I understand bookings are subject to administrator approval. <span className="text-rose-500">*</span>
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    required
                    className="mt-0.5 rounded text-[#0077C8] focus:ring-[#0077C8]"
                  />
                  <span className="text-xs text-slate-600">
                    I agree to the privacy notice for processing this booking in accordance with UK GDPR. Customer contact details will never be displayed publicly. <span className="text-rose-500">*</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
              <span className="text-xs text-slate-500">
                You will receive a reference code immediately on submission.
              </span>

              <button
                type="submit"
                disabled={isSubmitting || conflictCheck.hasConflict || isOverCapacity}
                className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold shadow-md transition-all cursor-pointer ${
                  isSubmitting || conflictCheck.hasConflict || isOverCapacity
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#0077C8] to-[#00A896] hover:from-[#0284C7] hover:to-[#02B19E] text-white active:scale-98'
                }`}
              >
                {isSubmitting ? (
                  <span>Processing Request...</span>
                ) : (
                  <>
                    <span>Submit Booking Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
