import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

interface ContactFormProps {
  initialEnquiryType?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ initialEnquiryType = 'General' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: initialEnquiryType,
    message: '',
    privacyConsent: false,
    botCheck: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Please provide your full name';
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    if (!formData.message.trim()) newErrors.message = 'Please enter your message';
    if (!formData.privacyConsent) {
      newErrors.privacyConsent = 'Please confirm consent to data processing';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.botCheck) return; // honeypot
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-6 text-center space-y-3">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h4 className="text-base font-semibold text-stone-900">
          Thank you for contacting us
        </h4>
        <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
          Your message has been sent to our community enquiries team. We aim to respond within 2–3 working days.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              name: '',
              email: '',
              phone: '',
              enquiryType: 'General',
              message: '',
              privacyConsent: false,
              botCheck: '',
            });
          }}
          className="text-xs font-semibold text-[#0E4D34] hover:underline pt-1"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Honeypot field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="botContact">Leave blank</label>
        <input
          type="text"
          id="botContact"
          value={formData.botCheck}
          onChange={(e) => setFormData({ ...formData, botCheck: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
          Full Name <span className="text-emerald-700">*</span>
        </label>
        <input
          type="text"
          id="contact-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Usman Tariq"
          className={`w-full rounded-md border px-3.5 py-2 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 ${
            errors.name ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
          }`}
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Email Address <span className="text-emerald-700">*</span>
          </label>
          <input
            type="email"
            id="contact-email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@example.org"
            className={`w-full rounded-md border px-3.5 py-2 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
            }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="contact-phone" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Phone <span className="text-stone-400 font-normal">(Optional)</span>
          </label>
          <input
            type="tel"
            id="contact-phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="01234 567890"
            className="w-full rounded-md border border-stone-300 px-3.5 py-2 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0E4D34]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-type" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
          Enquiry Type <span className="text-emerald-700">*</span>
        </label>
        <select
          id="contact-type"
          value={formData.enquiryType}
          onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
          className="w-full rounded-md border border-stone-300 px-3.5 py-2 text-sm text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0E4D34]"
        >
          <option value="General">General Enquiry</option>
          <option value="Darul Madinah">Darul Madinah Primary School</option>
          <option value="Youth">Youth Engagement & Activities</option>
          <option value="Sisters">Sisters’ Programmes & Gatherings</option>
          <option value="Venue Hire">Venue & Hall Hire</option>
          <option value="Volunteering">Volunteering & Community Action</option>
          <option value="Other">Other Query</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
          Your Message <span className="text-emerald-700">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="How can we assist you?"
          className={`w-full rounded-md border px-3.5 py-2 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 ${
            errors.message ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
          }`}
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
      </div>

      <div>
        <label className="flex items-start gap-2 text-xs text-stone-600 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.privacyConsent}
            onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
            className="mt-0.5 rounded text-[#0E4D34] focus:ring-[#0E4D34] h-4 w-4 shrink-0"
          />
          <span>
            I consent to Dawat-e-Islami Sheffield holding and processing my submitted details to respond to this enquiry.
          </span>
        </label>
        {errors.privacyConsent && (
          <p className="mt-1 text-xs text-red-600 pl-6">{errors.privacyConsent}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        disabled={isSubmitting}
        icon={<Send className="h-4 w-4" />}
      >
        {isSubmitting ? 'Sending Enquiry...' : 'Send Message'}
      </Button>
    </form>
  );
};
