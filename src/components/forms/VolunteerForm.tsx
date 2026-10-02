import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

export const VolunteerForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interests: [] as string[],
    availability: 'Weekends',
    skills: '',
    consent: false,
    botCheck: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const interestOptions = [
    'Community Events & Stewarding',
    'Youth Mentoring & Sports Support',
    'Sisters’ Programmes Organisation',
    'Administrative & Visitor Reception',
    'Building Care & Maintenance Support',
    'Food Distribution & Community Welfare',
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email required';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.consent) newErrors.consent = 'Consent required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.botCheck) return;
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
          Volunteer Interest Received
        </h4>
        <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
          Thank you for offering your time and skills to support the Sheffield community center. A volunteer team lead will contact you with induction details.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              name: '',
              email: '',
              phone: '',
              interests: [],
              availability: 'Weekends',
              skills: '',
              consent: false,
              botCheck: '',
            });
          }}
          className="text-xs font-semibold text-[#0E4D34] hover:underline pt-1"
        >
          Submit another volunteer registration
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          value={formData.botCheck}
          onChange={(e) => setFormData({ ...formData, botCheck: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="vol-name" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Full Name <span className="text-emerald-700">*</span>
          </label>
          <input
            type="text"
            id="vol-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Bilal Ahmed"
            className={`w-full rounded-md border px-3 py-2 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 ${
              errors.name ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
            }`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="vol-email" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Email Address <span className="text-emerald-700">*</span>
          </label>
          <input
            type="email"
            id="vol-email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@example.org"
            className={`w-full rounded-md border px-3 py-2 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
            }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="vol-phone" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Phone / Mobile <span className="text-emerald-700">*</span>
          </label>
          <input
            type="tel"
            id="vol-phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="07123 456789"
            className={`w-full rounded-md border px-3 py-2 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 ${
              errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
            }`}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="vol-availability" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            General Availability
          </label>
          <select
            id="vol-availability"
            value={formData.availability}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0E4D34]"
          >
            <option value="Weekends">Weekends (Saturdays / Sundays)</option>
            <option value="Weekday Evenings">Weekday Evenings</option>
            <option value="Weekday Daytimes">Weekday Daytimes</option>
            <option value="Flexible / As Needed">Flexible / Major Events Only</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
          Areas You Wish to Support
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {interestOptions.map((opt) => {
            const isChecked = formData.interests.includes(opt);
            return (
              <label
                key={opt}
                className={`flex items-center gap-2 p-2.5 rounded-md border text-xs cursor-pointer ${
                  isChecked
                    ? 'border-[#0E4D34] bg-[#F0F6F2] text-[#0E4D34] font-medium'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleInterestToggle(opt)}
                  className="rounded text-[#0E4D34] focus:ring-[#0E4D34] h-3.5 w-3.5"
                />
                <span className="truncate">{opt}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="vol-skills" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
          Relevant Experience or Skills <span className="text-stone-400 font-normal">(Optional)</span>
        </label>
        <textarea
          id="vol-skills"
          rows={2}
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          placeholder="e.g. First aid certified, teaching, DIY/trades, IT/AV skills, catering..."
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
            I agree to receive communications regarding volunteering opportunities and understand that roles working with children/vulnerable adults require DBS clearance.
          </span>
        </label>
        {errors.consent && (
          <p className="mt-1 text-xs text-red-600 pl-5.5">{errors.consent}</p>
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
        {isSubmitting ? 'Registering...' : 'Register as a Volunteer'}
      </Button>
    </form>
  );
};
