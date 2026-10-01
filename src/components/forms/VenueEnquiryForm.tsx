import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Clock, Calendar, Users, Building2 } from 'lucide-react';
import { Button } from '../common/Button';

export const VenueEnquiryForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    organisation: '',
    email: '',
    phone: '',
    eventType: 'Community Event',
    preferredDate: '',
    alternativeDate: '',
    guestCount: '',
    roomsRequired: [] as string[],
    startTime: '10:00',
    finishTime: '14:00',
    additionalRequirements: '',
    message: '',
    agreeNotConfirmed: false,
    agreePrivacy: false,
    // Honeypot field for spam protection
    botCheck: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const roomOptions = [
    'Main Community & Event Hall',
    'Meeting & Training Suite',
    'Modular Classroom Space',
    'Youth & Community Activity Area',
  ];

  const handleRoomToggle = (room: string) => {
    setFormData((prev) => {
      const exists = prev.roomsRequired.includes(room);
      return {
        ...prev,
        roomsRequired: exists
          ? prev.roomsRequired.filter((r) => r !== room)
          : [...prev.roomsRequired, room],
      };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid UK email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact telephone number is required';
    }
    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Please select your preferred date';
    }
    if (!formData.guestCount || parseInt(formData.guestCount) <= 0) {
      newErrors.guestCount = 'Estimated guest count is required';
    }
    if (formData.roomsRequired.length === 0) {
      newErrors.roomsRequired = 'Please select at least one room';
    }
    if (!formData.agreeNotConfirmed) {
      newErrors.agreeNotConfirmed = 'Please acknowledge that submission does not confirm a booking';
    }
    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = 'Please confirm you consent to our data privacy notice';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Spam honeypot check
    if (formData.botCheck) {
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate reliable API endpoint request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-8 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold text-stone-900">
          Venue Enquiry Received
        </h3>
        <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          Thank you, <span className="font-semibold text-stone-900">{formData.fullName}</span>. Your enquiry for{' '}
          <span className="font-medium text-stone-800">{formData.preferredDate}</span> has been logged. Our facilities coordinator will review the requirements and respond within 2–3 working days.
        </p>
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSubmitted(false);
              setFormData((prev) => ({
                ...prev,
                preferredDate: '',
                alternativeDate: '',
                roomsRequired: [],
                message: '',
                agreeNotConfirmed: false,
              }));
            }}
          >
            Submit Another Venue Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot field (hidden from genuine users) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="botCheck">Leave this blank</label>
        <input
          type="text"
          id="botCheck"
          name="botCheck"
          value={formData.botCheck}
          onChange={(e) => setFormData({ ...formData, botCheck: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div>
          <label htmlFor="venue-fullName" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Full Name <span className="text-emerald-700">*</span>
          </label>
          <input
            type="text"
            id="venue-fullName"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="e.g. Mohammed Ahmed"
            className={`w-full rounded-md border px-3.5 py-2.5 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 ${
              errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
            }`}
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
        </div>

        {/* Organisation */}
        <div>
          <label htmlFor="venue-organisation" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Organisation <span className="text-stone-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            id="venue-organisation"
            value={formData.organisation}
            onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
            placeholder="Community group, charity, or company"
            className="w-full rounded-md border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0E4D34]"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="venue-email" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Email Address <span className="text-emerald-700">*</span>
          </label>
          <input
            type="email"
            id="venue-email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@example.org"
            className={`w-full rounded-md border px-3.5 py-2.5 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
            }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="venue-phone" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Telephone Number <span className="text-emerald-700">*</span>
          </label>
          <input
            type="tel"
            id="venue-phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="e.g. 07123 456789"
            className={`w-full rounded-md border px-3.5 py-2.5 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 ${
              errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
            }`}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        {/* Event Type */}
        <div>
          <label htmlFor="venue-eventType" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Type of Event <span className="text-emerald-700">*</span>
          </label>
          <select
            id="venue-eventType"
            value={formData.eventType}
            onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
            className="w-full rounded-md border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0E4D34]"
          >
            <option value="Community Event">Community Event / Consultation</option>
            <option value="Educational Workshop">Educational Workshop / Class</option>
            <option value="Training Seminar">Professional Training / Seminar</option>
            <option value="Family Function">Family Gathering / Celebration (Ethos-compliant)</option>
            <option value="Committee Meeting">Board / Committee Meeting</option>
            <option value="Charity Fundraiser">Charity / Voluntary Sector Event</option>
            <option value="Other">Other Suitable Purpose</option>
          </select>
        </div>

        {/* Preferred Date */}
        <div>
          <label htmlFor="venue-preferredDate" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Preferred Date <span className="text-emerald-700">*</span>
          </label>
          <input
            type="date"
            id="venue-preferredDate"
            value={formData.preferredDate}
            onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
            className={`w-full rounded-md border px-3.5 py-2.5 text-sm text-stone-900 bg-white focus:outline-none focus:ring-1 ${
              errors.preferredDate ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
            }`}
          />
          {errors.preferredDate && <p className="mt-1 text-xs text-red-600">{errors.preferredDate}</p>}
        </div>

        {/* Alternative Date */}
        <div>
          <label htmlFor="venue-alternativeDate" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Alternative Date <span className="text-stone-400 font-normal">(Optional)</span>
          </label>
          <input
            type="date"
            id="venue-alternativeDate"
            value={formData.alternativeDate}
            onChange={(e) => setFormData({ ...formData, alternativeDate: e.target.value })}
            className="w-full rounded-md border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0E4D34]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Estimated Guests */}
        <div>
          <label htmlFor="venue-guestCount" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Estimated Guests <span className="text-emerald-700">*</span>
          </label>
          <input
            type="number"
            id="venue-guestCount"
            min="1"
            max="400"
            value={formData.guestCount}
            onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
            placeholder="e.g. 50"
            className={`w-full rounded-md border px-3.5 py-2.5 text-sm text-stone-900 bg-white focus:outline-none focus:ring-1 ${
              errors.guestCount ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
            }`}
          />
          {errors.guestCount && <p className="mt-1 text-xs text-red-600">{errors.guestCount}</p>}
        </div>

        {/* Start Time */}
        <div>
          <label htmlFor="venue-startTime" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Required Start Time
          </label>
          <input
            type="time"
            id="venue-startTime"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="w-full rounded-md border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0E4D34]"
          />
        </div>

        {/* Finish Time */}
        <div>
          <label htmlFor="venue-finishTime" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Required Finish Time
          </label>
          <input
            type="time"
            id="venue-finishTime"
            value={formData.finishTime}
            onChange={(e) => setFormData({ ...formData, finishTime: e.target.value })}
            className="w-full rounded-md border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0E4D34]"
          />
        </div>
      </div>

      {/* Rooms Required */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
          Spaces Required <span className="text-emerald-700">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {roomOptions.map((room) => {
            const isChecked = formData.roomsRequired.includes(room);
            return (
              <label
                key={room}
                className={`flex items-center gap-2.5 p-3 rounded-md border text-sm cursor-pointer transition-colors ${
                  isChecked
                    ? 'border-[#0E4D34] bg-[#F0F6F2] text-[#0E4D34] font-medium'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleRoomToggle(room)}
                  className="rounded text-[#0E4D34] focus:ring-[#0E4D34] h-4 w-4"
                />
                <span>{room}</span>
              </label>
            );
          })}
        </div>
        {errors.roomsRequired && <p className="mt-1 text-xs text-red-600">{errors.roomsRequired}</p>}
      </div>

      {/* Additional Message / Requirements */}
      <div>
        <label htmlFor="venue-message" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
          Additional Information & Requirements
        </label>
        <textarea
          id="venue-message"
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Please describe any AV equipment, layout preferences, catering warming requirements, or attendee details..."
          className="w-full rounded-md border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0E4D34]"
        />
      </div>

      {/* Disclaimers & Consents */}
      <div className="space-y-3 pt-1">
        <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreeNotConfirmed}
            onChange={(e) => setFormData({ ...formData, agreeNotConfirmed: e.target.checked })}
            className="mt-0.5 rounded text-[#0E4D34] focus:ring-[#0E4D34] h-4 w-4 shrink-0"
          />
          <span>
            <strong className="text-stone-900">I understand that submitting this enquiry form does not confirm a booking.</strong> A member of our team will contact you to discuss availability, terms, and hire agreement.
          </span>
        </label>
        {errors.agreeNotConfirmed && (
          <p className="text-xs text-red-600 pl-6.5">{errors.agreeNotConfirmed}</p>
        )}

        <label className="flex items-start gap-2.5 text-xs text-stone-600 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreePrivacy}
            onChange={(e) => setFormData({ ...formData, agreePrivacy: e.target.checked })}
            className="mt-0.5 rounded text-[#0E4D34] focus:ring-[#0E4D34] h-4 w-4 shrink-0"
          />
          <span>
            I consent to Dawat-e-Islami Sheffield processing this enquiry in accordance with our data protection policy.
          </span>
        </label>
        {errors.agreePrivacy && (
          <p className="text-xs text-red-600 pl-6.5">{errors.agreePrivacy}</p>
        )}
      </div>

      <div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isSubmitting}
          icon={<Send className="h-4 w-4" />}
        >
          {isSubmitting ? 'Submitting Enquiry...' : 'Send Venue Enquiry'}
        </Button>
        <p className="text-center text-[11px] text-stone-400 mt-2">
          Submissions are directly routed to the Sheffield venue coordination desk.
        </p>
      </div>
    </form>
  );
};
