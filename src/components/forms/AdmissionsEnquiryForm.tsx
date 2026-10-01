import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

export const AdmissionsEnquiryForm: React.FC = () => {
  const [formData, setFormData] = useState({
    parentName: '',
    childName: '',
    yearGroup: 'Reception (Age 4-5)',
    entryYear: '2026/2027 Academic Year',
    email: '',
    phone: '',
    postcode: '',
    notes: '',
    consent: false,
    botCheck: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.parentName.trim()) newErrors.parentName = 'Parent / Guardian name is required';
    if (!formData.childName.trim()) newErrors.childName = 'Child’s name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email address required';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.consent) newErrors.consent = 'Consent is required to process enquiry';

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
          Admissions Enquiry Logged
        </h4>
        <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
          Thank you for registering interest in Darul Madinah Sheffield for{' '}
          <span className="font-semibold text-stone-800">{formData.childName}</span>. Our admissions team will be in touch with prospectus materials and open morning dates.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              parentName: '',
              childName: '',
              yearGroup: 'Reception (Age 4-5)',
              entryYear: '2026/2027 Academic Year',
              email: '',
              phone: '',
              postcode: '',
              notes: '',
              consent: false,
              botCheck: '',
            });
          }}
          className="text-xs font-semibold text-[#0E4D34] hover:underline pt-1"
        >
          Submit another admissions query
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
          <label htmlFor="adm-parent" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Parent / Guardian Name <span className="text-emerald-700">*</span>
          </label>
          <input
            type="text"
            id="adm-parent"
            value={formData.parentName}
            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
            placeholder="e.g. Fatima Hussain"
            className={`w-full rounded-md border px-3 py-2 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 ${
              errors.parentName ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
            }`}
          />
          {errors.parentName && <p className="mt-1 text-xs text-red-600">{errors.parentName}</p>}
        </div>

        <div>
          <label htmlFor="adm-child" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Child’s Full Name <span className="text-emerald-700">*</span>
          </label>
          <input
            type="text"
            id="adm-child"
            value={formData.childName}
            onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
            placeholder="e.g. Ibrahim Hussain"
            className={`w-full rounded-md border px-3 py-2 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 ${
              errors.childName ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
            }`}
          />
          {errors.childName && <p className="mt-1 text-xs text-red-600">{errors.childName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="adm-year" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Year Group Applying For
          </label>
          <select
            id="adm-year"
            value={formData.yearGroup}
            onChange={(e) => setFormData({ ...formData, yearGroup: e.target.value })}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0E4D34]"
          >
            <option value="Reception (Age 4-5)">Reception (Ages 4–5)</option>
            <option value="Year 1 (Age 5-6)">Year 1 (Ages 5–6)</option>
            <option value="Year 2 (Age 6-7)">Year 2 (Ages 6–7)</option>
            <option value="Year 3 (Age 7-8)">Year 3 (Ages 7–8)</option>
            <option value="Year 4 (Age 8-9)">Year 4 (Ages 8–9)</option>
            <option value="Year 5 (Age 9-10)">Year 5 (Ages 9–10)</option>
            <option value="Year 6 (Age 10-11)">Year 6 (Ages 10–11)</option>
          </select>
        </div>

        <div>
          <label htmlFor="adm-entry" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Intended Academic Year
          </label>
          <select
            id="adm-entry"
            value={formData.entryYear}
            onChange={(e) => setFormData({ ...formData, entryYear: e.target.value })}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0E4D34]"
          >
            <option value="2026/2027 Academic Year">2026 / 2027 Academic Year</option>
            <option value="2027/2028 Academic Year">2027 / 2028 Academic Year</option>
            <option value="In-Year Transfer (Current Year)">In-Year Transfer (Immediate Enquiry)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="adm-email" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Email Address <span className="text-emerald-700">*</span>
          </label>
          <input
            type="email"
            id="adm-email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="parent@example.org"
            className={`w-full rounded-md border px-3 py-2 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
            }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="adm-postcode" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Postcode
          </label>
          <input
            type="text"
            id="adm-postcode"
            value={formData.postcode}
            onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
            placeholder="e.g. S9 5DL"
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0E4D34]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="adm-phone" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
          Telephone Number <span className="text-emerald-700">*</span>
        </label>
        <input
          type="tel"
          id="adm-phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="0114 123 4567 or mobile"
          className={`w-full rounded-md border px-3 py-2 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 ${
            errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
          }`}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="adm-notes" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
          Additional Notes <span className="text-stone-400 font-normal">(Optional)</span>
        </label>
        <textarea
          id="adm-notes"
          rows={2}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any specific educational background, language, or visit date request..."
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
            I consent to Darul Madinah Sheffield processing this enquiry in line with the school admissions & privacy policy.
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
        {isSubmitting ? 'Registering...' : 'Submit Admissions Enquiry'}
      </Button>
    </form>
  );
};
