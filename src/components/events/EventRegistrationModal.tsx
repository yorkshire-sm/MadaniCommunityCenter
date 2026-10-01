import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, Clock, MapPin, Send } from 'lucide-react';
import { EventItem } from '../../data/eventsData';
import { Button } from '../common/Button';

interface EventRegistrationModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attendees: '1',
    dietaryNotes: '',
    consent: false,
    botCheck: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Valid email is required';
    }
    if (!formData.consent) errs.consent = 'Consent is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.botCheck) return;
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-xl bg-white p-6 sm:p-7 shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-stone-900">
              Registration Confirmed
            </h3>
            <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
              Thank you, <span className="font-semibold text-stone-800">{formData.name}</span>. Your place has been reserved for:
            </p>
            <div className="rounded-lg bg-[#FAF9F5] border border-stone-200 p-4 text-left text-xs space-y-1 text-stone-700">
              <p className="font-semibold text-sm text-[#0E4D34]">{event.title}</p>
              <p>{event.dateFormatted} · {event.startTime} – {event.endTime}</p>
              <p className="text-stone-500">{event.venue}</p>
              <p className="pt-1 font-mono text-[11px] text-stone-500">Attendees: {formData.attendees}</p>
            </div>
            <div className="pt-2">
              <Button variant="primary" size="sm" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-[#0E4D34] uppercase tracking-wider">
                Event Registration
              </p>
              <h3 className="text-lg font-bold text-stone-900 mt-1 leading-snug">
                {event.title}
              </h3>
              <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-stone-600 border-y border-stone-100 py-2">
                <span className="flex items-center gap-1 font-medium text-stone-800">
                  <Calendar className="h-3.5 w-3.5 text-[#C59B27]" />
                  {event.dateFormatted}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-stone-400" />
                  {event.startTime} – {event.endTime}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  value={formData.botCheck}
                  onChange={(e) => setFormData({ ...formData, botCheck: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Full Name <span className="text-emerald-700">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className={`w-full rounded-md border px-3 py-2 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 ${
                    errors.name ? 'border-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Email Address <span className="text-emerald-700">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.org"
                    className={`w-full rounded-md border px-3 py-2 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 ${
                      errors.email ? 'border-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Number of Places
                  </label>
                  <select
                    value={formData.attendees}
                    onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                    className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0E4D34]"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4 People</option>
                    <option value="5+">5+ People (Group)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Telephone / WhatsApp <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="07123 456789"
                  className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0E4D34]"
                />
              </div>

              <div>
                <label className="flex items-start gap-2 text-xs text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 rounded text-[#0E4D34] focus:ring-[#0E4D34] h-3.5 w-3.5 shrink-0"
                  />
                  <span>
                    I confirm my registration and agree to receive event updates and confirmation.
                  </span>
                </label>
                {errors.consent && (
                  <p className="mt-1 text-xs text-red-600 pl-5.5">{errors.consent}</p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  disabled={isSubmitting}
                  icon={<Send className="h-4 w-4" />}
                >
                  {isSubmitting ? 'Registering...' : 'Confirm Registration'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
