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
  ArrowLeft,
  Info,
  Building,
  HelpCircle,
  Printer,
  ChevronLeft,
  ChevronRight,
  Lock,
  CalendarCheck,
  Ban,
  Check,
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

  // Slideshow Wizard Step: 1 = Date & Facility, 2 = Event Details, 3 = Contact & Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [facilityId, setFacilityId] = useState<string>(preselectedFacilityId || 'fac-main-hall');

  // Find initial available date (next upcoming date that is not a booked slot)
  const getFirstAvailableDate = (facId: string): string => {
    const today = new Date();
    for (let i = 1; i <= 60; i++) {
      const nextD = new Date(today);
      nextD.setDate(today.getDate() + i);
      const dateStr = nextD.toISOString().split('T')[0];
      const isBlocked = blockedDates.some(
        (b) => b.date === dateStr && (b.facilityId === 'all' || b.facilityId === facId)
      );
      const isBooked = bookings.some(
        (b) =>
          b.date === dateStr &&
          b.facilityId === facId &&
          b.status !== 'cancelled' &&
          b.status !== 'rejected'
      );
      if (!isBlocked && !isBooked) {
        return dateStr;
      }
    }
    return new Date().toISOString().split('T')[0];
  };

  const [bookingDate, setBookingDate] = useState<string>(() =>
    getFirstAvailableDate(preselectedFacilityId || 'fac-main-hall')
  );

  const [startTime, setStartTime] = useState<string>('10:00');
  const [finishTime, setFinishTime] = useState<string>('14:00');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [organisation, setOrganisation] = useState<string>('');
  const [eventType, setEventType] = useState<string>('Community Seminar / Workshop');
  const [attendees, setAttendees] = useState<number>(50);
  const [layoutPreference, setLayoutPreference] = useState<string>('Theatre style (Chairs facing stage)');
  const [needsKitchen, setNeedsKitchen] = useState<boolean>(false);
  const [additionalRequirements, setAdditionalRequirements] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(false);
  const [honeypot, setHoneypot] = useState<string>(''); // Spam protection bot-trap

  // Calendar View State
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => new Date());
  const [calendarNotice, setCalendarNotice] = useState<string | null>(null);

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

  // Check availability status for any date (2 options only: Available Green vs Booked Slot Red)
  const getDayAvailability = (dateStr: string) => {
    const isBlocked = blockedDates.some(
      (b) => b.date === dateStr && (b.facilityId === 'all' || b.facilityId === facilityId)
    );
    const bookingsOnDate = bookings.filter(
      (b) =>
        b.date === dateStr &&
        b.facilityId === facilityId &&
        b.status !== 'cancelled' &&
        b.status !== 'rejected'
    );

    // If there is any booking or blackout, it's a Booked Slot (Red)
    if (isBlocked || bookingsOnDate.length > 0) {
      return {
        status: 'booked' as const,
        label: 'Booked Slot',
        isSelectable: false,
      };
    }

    // Otherwise it is Available (Green)
    return {
      status: 'available' as const,
      label: 'Available',
      isSelectable: true,
    };
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

  const prevMonth = () => setCalendarMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCalendarMonth(new Date(year, month + 1, 1));

  // Date Selection handler with strict restriction on Red Booked Slot
  const handleSelectDate = (dateStr: string) => {
    setCalendarNotice(null);
    setErrorMsg(null);

    // Check if in past
    const todayStr = new Date().toISOString().split('T')[0];
    if (dateStr < todayStr) {
      setCalendarNotice('Past dates cannot be booked. Please select an upcoming green date.');
      return;
    }

    const availability = getDayAvailability(dateStr);
    if (!availability.isSelectable) {
      setCalendarNotice('This date is a Booked Slot (Red) and cannot be selected. Please select a green available date.');
      return;
    }

    setBookingDate(dateStr);
    setCalendarNotice(null);
  };

  // Facility Selection change
  const handleFacilityChange = (newFacId: string) => {
    setFacilityId(newFacId);
    setCalendarNotice(null);
    setErrorMsg(null);
    // If current date is booked for the newly selected facility, re-pick first available
    const avail = getDayAvailability(bookingDate);
    if (!avail.isSelectable) {
      const nextAvail = getFirstAvailableDate(newFacId);
      setBookingDate(nextAvail);
    }
  };

  // Slide navigation validations
  const handleProceedToStep2 = () => {
    setErrorMsg(null);
    setCalendarNotice(null);

    const avail = getDayAvailability(bookingDate);
    if (!avail.isSelectable) {
      setErrorMsg('The selected date is a Booked Slot and is unavailable. Please select an available date (Green) from the calendar.');
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

    if (conflictCheck.hasConflict) {
      setErrorMsg(conflictCheck.reason || 'This time slot is unavailable. Please choose another time.');
      return;
    }

    setCurrentStep(2);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleProceedToStep3 = () => {
    setErrorMsg(null);

    if (attendees < 1) {
      setErrorMsg('Please specify the expected number of attendees.');
      return;
    }

    if (isOverCapacity) {
      setErrorMsg(`Expected attendees (${attendees}) exceeds room capacity for ${selectedFacility.name} (${selectedFacility.capacity} max). Please adjust attendee count.`);
      return;
    }

    setCurrentStep(3);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Final Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (honeypot) {
      console.warn('Spam submission intercepted.');
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please complete your full name, email address, and contact telephone number.');
      return;
    }

    if (!termsAccepted || !privacyAccepted) {
      setErrorMsg('Please confirm agreement to the booking terms and privacy notice.');
      return;
    }

    const avail = getDayAvailability(bookingDate);
    if (!avail.isSelectable) {
      setErrorMsg('Selected date is a Booked Slot. Please return to Step 1 and select an available green date.');
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
        setErrorMsg(result.error || 'Failed to submit booking request. Please check your details and try again.');
        setIsSubmitting(false);
        return;
      }

      setSubmittedBooking(result.booking);
      setBookings(bookingStore.getBookings());
      setBlockedDates(bookingStore.getBlockedDates());
      setIsSubmitting(false);
      window.scrollTo({ top: 80, behavior: 'smooth' });
    } catch {
      setErrorMsg('An unexpected error occurred while processing your booking. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Format friendly date string (e.g. "Saturday, 24 October 2026")
  const formatFriendlyDate = (dateString: string) => {
    try {
      const [y, m, d] = dateString.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8 sm:space-y-12 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00A896]">
            Step-by-Step Booking System
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-brand font-bold text-[#0B2545] tracking-tight">
            Check Availability &amp; Request a Booking
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Follow our 3 simple steps below. First select your preferred space and date on the live calendar. Dates marked as <strong className="text-rose-600 font-semibold">Booked Slot (Red)</strong> are unavailable, while <strong className="text-emerald-700 font-semibold">Available (Green)</strong> dates can be selected immediately.
          </p>

          <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Public privacy protected: Customer names and personal information are never displayed on the public calendar.</span>
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
                onClick={() => {
                  setSubmittedBooking(null);
                  setCurrentStep(1);
                }}
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
              <span className="text-slate-400 font-semibold block mb-1">DATE &amp; TIME</span>
              <strong className="text-sm text-[#0B2545]">
                {formatFriendlyDate(submittedBooking.date)} ({submittedBooking.startTime} - {submittedBooking.finishTime})
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
              <strong>Next Steps:</strong> An automated confirmation acknowledgement has been logged for <span className="font-semibold text-slate-900">{submittedBooking.customerEmail}</span>. The Madani Community Centre manager will review your request and send confirmation within 24–48 hours.
            </div>
          </div>
        </div>
      )}

      {/* Main Slideshow Wizard Container (when not submitted) */}
      {!submittedBooking && (
        <div className="space-y-6">
          {/* Slideshow Progress Stepper Header */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {/* Step 1 */}
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-2xl text-left transition-all cursor-pointer ${
                  currentStep === 1
                    ? 'bg-[#0B2545] text-white shadow-sm ring-2 ring-[#0077C8]'
                    : currentStep > 1
                    ? 'bg-slate-100 text-slate-800 hover:bg-slate-200/80'
                    : 'bg-slate-50 text-slate-400'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    currentStep === 1
                      ? 'bg-[#0077C8] text-white'
                      : currentStep > 1
                      ? 'bg-[#00A896] text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider block opacity-80">
                    Step 1
                  </span>
                  <span className="text-xs sm:text-sm font-bold truncate block">
                    Select Date &amp; Space
                  </span>
                </div>
              </button>

              {/* Step 2 */}
              <button
                type="button"
                onClick={() => {
                  if (currentStep > 2) setCurrentStep(2);
                  else if (currentStep === 1) handleProceedToStep2();
                }}
                className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-2xl text-left transition-all cursor-pointer ${
                  currentStep === 2
                    ? 'bg-[#0B2545] text-white shadow-sm ring-2 ring-[#0077C8]'
                    : currentStep > 2
                    ? 'bg-slate-100 text-slate-800 hover:bg-slate-200/80'
                    : 'bg-slate-50 text-slate-400'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    currentStep === 2
                      ? 'bg-[#0077C8] text-white'
                      : currentStep > 2
                      ? 'bg-[#00A896] text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider block opacity-80">
                    Step 2
                  </span>
                  <span className="text-xs sm:text-sm font-bold truncate block">
                    Event Details
                  </span>
                </div>
              </button>

              {/* Step 3 */}
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 2) handleProceedToStep3();
                }}
                className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-2xl text-left transition-all cursor-pointer ${
                  currentStep === 3
                    ? 'bg-[#0B2545] text-white shadow-sm ring-2 ring-[#0077C8]'
                    : 'bg-slate-50 text-slate-400'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    currentStep === 3
                      ? 'bg-[#0077C8] text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  3
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider block opacity-80">
                    Step 3
                  </span>
                  <span className="text-xs sm:text-sm font-bold truncate block">
                    Contact &amp; Submit
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Active Error Alert */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 shadow-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <strong className="font-bold">Please check your selection:</strong> {errorMsg}
              </div>
            </div>
          )}

          {/* Calendar Feedback Notice */}
          {calendarNotice && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{calendarNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setCalendarNotice(null)}
                className="text-xs font-bold text-rose-700 hover:text-rose-900 underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* SLIDE 1: SELECT FACILITY & DATE (CALENDAR CENTERPIECE)   */}
          {/* ======================================================== */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-fade-in">
              {/* Facility Selection Cards */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00A896]">
                      1. Choose Facility
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif-brand font-bold text-[#0B2545]">
                      Select Desired Room or Space
                    </h2>
                  </div>
                  <span className="text-xs text-slate-500">
                    Selected: <strong className="text-[#0B2545]">{selectedFacility.name}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {facilities.map((fac) => {
                    const isSelected = facilityId === fac.id;
                    return (
                      <button
                        key={fac.id}
                        type="button"
                        onClick={() => handleFacilityChange(fac.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#0077C8] bg-[#F0F7FF] ring-2 ring-[#0077C8] shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Capacity: {fac.capacity}
                            </span>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-[#0077C8] text-white flex items-center justify-center text-[10px]">
                                <Check className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-sm text-[#0B2545] leading-tight">
                            {fac.name}
                          </h3>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-100/80 flex items-baseline justify-between">
                          <span className="text-xs font-extrabold text-[#0077C8]">
                            £{isWeekend ? fac.weekendRate : fac.hourlyRate}/hr
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Bond: £{fac.depositRequired}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Interactive Availability Calendar (2 Colours: Green vs Red) */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00A896]">
                      2. Interactive Calendar
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif-brand font-bold text-[#0B2545]">
                      Pick an Available Date (Green)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Dates marked in <strong className="text-rose-600 font-semibold">Red (Booked Slot)</strong> are already taken and cannot be clicked.
                    </p>
                  </div>

                  {/* 2-Option Legend (Available Green vs Booked Slot Red) */}
                  <div className="flex items-center gap-3 bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                      <span className="w-3 h-3 rounded-full bg-[#10B981] shadow-xs" />
                      <span>Available (Green)</span>
                    </div>
                    <div className="h-4 w-px bg-slate-300" />
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-800">
                      <span className="w-3 h-3 rounded-full bg-[#EF4444] shadow-xs" />
                      <span>Booked Slot (Red)</span>
                    </div>
                  </div>
                </div>

                {/* Calendar Navigation & Grid */}
                <div className="max-w-3xl mx-auto">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-4 px-2">
                    <button
                      type="button"
                      onClick={prevMonth}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <h3 className="text-base sm:text-lg font-bold text-[#0B2545] font-serif-brand">
                      {monthNames[month]} {year}
                    </h3>

                    <button
                      type="button"
                      onClick={nextMonth}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Days of Week Header */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 uppercase py-2 border-b border-slate-100">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                  </div>

                  {/* Calendar Dates Grid */}
                  <div className="grid grid-cols-7 gap-1.5 pt-3">
                    {/* Empty leading days */}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-14 sm:h-16 rounded-xl bg-transparent" />
                    ))}

                    {/* Month Days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                      const isPast = dateStr < todayStr;
                      const availability = getDayAvailability(dateStr);
                      const isSelected = bookingDate === dateStr;
                      const isBooked = availability.status === 'booked';

                      // Style definitions strictly adhering to the 2-color rule
                      let dayStyle = '';
                      let statusText = 'Available';

                      if (isPast) {
                        dayStyle = 'bg-slate-100/60 text-slate-300 border border-slate-100 cursor-not-allowed opacity-50';
                        statusText = 'Past';
                      } else if (isBooked) {
                        // Red Booked Slot (Cannot be selected)
                        dayStyle = 'bg-rose-50/90 border border-rose-200/90 text-rose-500 cursor-not-allowed opacity-80 hover:bg-rose-100/80';
                        statusText = 'Booked';
                      } else {
                        // Green Available
                        if (isSelected) {
                          dayStyle = 'bg-[#0B2545] text-white border-[#0B2545] ring-2 ring-[#0077C8] shadow-md';
                          statusText = 'Selected';
                        } else {
                          dayStyle = 'bg-emerald-50/40 hover:bg-emerald-100/70 border border-emerald-200/70 text-slate-800 cursor-pointer';
                          statusText = 'Available';
                        }
                      }

                      return (
                        <button
                          key={dateStr}
                          type="button"
                          disabled={isPast || isBooked}
                          onClick={() => handleSelectDate(dateStr)}
                          title={
                            isPast
                              ? 'Past date'
                              : isBooked
                              ? 'Booked Slot (Unavailable for selection)'
                              : `Select ${dateStr} (Available)`
                          }
                          aria-disabled={isPast || isBooked}
                          className={`h-14 sm:h-16 rounded-xl flex flex-col items-center justify-between p-1.5 transition-all text-xs relative ${dayStyle}`}
                        >
                          <span className="font-bold text-xs">{dayNum}</span>

                          {/* 2-Color Indicator Dot */}
                          {!isPast && (
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isBooked
                                  ? 'bg-[#EF4444]'
                                  : isSelected
                                  ? 'bg-[#00A896]'
                                  : 'bg-[#10B981]'
                              }`}
                            />
                          )}

                          {/* Status Label (Readable on larger screens) */}
                          <span
                            className={`text-[9px] font-semibold hidden sm:block ${
                              isSelected
                                ? 'text-teal-200'
                                : isBooked
                                ? 'text-rose-600'
                                : isPast
                                ? 'text-slate-300'
                                : 'text-emerald-700'
                            }`}
                          >
                            {statusText}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Date & Time Selection Box */}
                <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-6 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Confirmed Selection
                    </span>
                    <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <CalendarCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                          🟢 Available Date Chosen
                        </span>
                        <strong className="text-sm sm:text-base text-[#0B2545] font-serif-brand">
                          {formatFriendlyDate(bookingDate)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Start & Finish Times */}
                  <div className="md:col-span-6 grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Start Time <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={startTime}
                        onChange={(e) => {
                          setStartTime(e.target.value);
                          setErrorMsg(null);
                        }}
                        className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
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
                        onChange={(e) => {
                          setFinishTime(e.target.value);
                          setErrorMsg(null);
                        }}
                        className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
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
                </div>

                {/* Live Hire Estimate Bar */}
                <div className="p-4 rounded-2xl bg-[#0B2545] text-white flex items-center justify-between flex-wrap gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold block">
                      Estimated Hire Rate
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <span>{durationHours} Hours duration</span>
                      <span>•</span>
                      <span>£{hourlyRate}/hr ({isWeekend ? 'Weekend rate' : 'Weekday rate'})</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-[#00A896]">
                      £{totalCost.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-300 block">
                      Refundable Bond: £{selectedFacility.depositRequired}
                    </span>
                  </div>
                </div>

                {/* Step 1 Action Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleProceedToStep2}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#0077C8] to-[#00A896] hover:from-[#0284C7] hover:to-[#02B19E] shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    <span>Continue to Step 2: Event Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SLIDE 2: EVENT DETAILS & REQUIREMENTS                    */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-8 animate-fade-in">
              {/* Selected Booking Recap Header */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B2545] text-[#00A896] flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Booking Window Selected
                    </span>
                    <strong className="text-sm sm:text-base text-[#0B2545]">
                      {selectedFacility.name} • {formatFriendlyDate(bookingDate)} ({startTime} – {finishTime})
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-[#0077C8] hover:underline self-start sm:self-auto cursor-pointer"
                >
                  Change Date or Time
                </button>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00A896]">
                  Step 2 of 3
                </span>
                <h2 className="text-2xl font-serif-brand font-bold text-[#0B2545] mt-1">
                  Event Purpose &amp; Requirements
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Help us prepare the right hall setup, furniture layout, and facilities for your group.
                </p>
              </div>

              <div className="space-y-6">
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
                      max="350"
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
                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={needsKitchen}
                        onChange={(e) => setNeedsKitchen(e.target.checked)}
                        className="rounded text-[#0077C8] focus:ring-[#0077C8]"
                      />
                      <span className="text-xs text-slate-700">
                        Add warming kitchen (+£15/hour)
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Additional Equipment or Special Requirements
                  </label>
                  <textarea
                    rows={3}
                    value={additionalRequirements}
                    onChange={(e) => setAdditionalRequirements(e.target.value)}
                    placeholder="e.g. Wireless microphones, stage lectern, audio testing, disabled parking access..."
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
                  />
                </div>

                {/* Live Hire Estimate Bar */}
                <div className="p-4 rounded-2xl bg-[#0B2545] text-white flex items-center justify-between flex-wrap gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold block">
                      Live Total Estimate
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

                {/* Navigation Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Date Selection</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToStep3}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#0077C8] to-[#00A896] hover:from-[#0284C7] hover:to-[#02B19E] shadow-sm transition-all cursor-pointer"
                  >
                    <span>Continue to Step 3: Contact &amp; Submit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SLIDE 3: CONTACT & CONFIRMATION SUBMISSION               */}
          {/* ======================================================== */}
          {currentStep === 3 && (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-8 animate-fade-in"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00A896]">
                  Step 3 of 3
                </span>
                <h2 className="text-2xl font-serif-brand font-bold text-[#0B2545] mt-1">
                  Contact Information &amp; Final Review
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm your booking summary and enter your contact details to receive your booking reference code.
                </p>
              </div>

              {/* Full Summary Review Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B2545] block">
                  Booking Summary Review
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-semibold mb-0.5">FACILITY</span>
                    <strong className="text-slate-900">{selectedFacility.name}</strong>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-semibold mb-0.5">DATE &amp; TIME</span>
                    <strong className="text-slate-900">
                      {formatFriendlyDate(bookingDate)} ({startTime} – {finishTime})
                    </strong>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-semibold mb-0.5">ATTENDEES &amp; PURPOSE</span>
                    <strong className="text-slate-900">
                      {attendees} people • {eventType}
                    </strong>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-semibold mb-0.5">TOTAL ESTIMATE</span>
                    <strong className="text-emerald-700 text-sm font-extrabold">
                      £{totalCost.toFixed(2)}
                    </strong>
                    <span className="text-[10px] text-slate-400 block">+ £{selectedFacility.depositRequired} bond</span>
                  </div>
                </div>
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

              {/* Customer Contact Fields */}
              <div className="space-y-4">
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
                      placeholder="e.g. Sheffield Community Association"
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
                    />
                  </div>
                </div>

                {/* Compliance & Privacy Checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      required
                      className="mt-0.5 rounded text-[#0077C8] focus:ring-[#0077C8]"
                    />
                    <span className="text-xs text-slate-600">
                      I confirm this booking adheres to the center’s alcohol-free ethos and community guidelines. I understand bookings are initially marked Pending Approval and subject to coordinator review. <span className="text-rose-500">*</span>
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
                      I agree to the privacy notice for processing this booking in accordance with UK GDPR. Customer contact details are kept strictly private and will never be exposed on public calendars. <span className="text-rose-500">*</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Navigation Actions */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Event Details</span>
                </button>

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
          )}
        </div>
      )}
    </div>
  );
};
