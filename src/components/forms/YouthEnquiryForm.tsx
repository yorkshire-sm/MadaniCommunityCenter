import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

export const YouthEnquiryForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    ageGroup: '16–18',
    email: '',
    phone: '',
    area: '',
    activities: [] as string[],
    message: '',
    privacyConsent: false,
    botCheck: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const availableActivities = [
    'Sports & Fitness Activities',
    'Study Circles & Islamic Learning',
    'Skills & Career Development Workshops',
    'Mentoring & Youth Circles',
    'Volunteering & Community Projects',
    'Youth Outings & Trips',
  ];

  const handleActivityToggle = (activity: string) => {
    setFormData((prev) => {
      const exists = prev.activities.includes(activity);
      return {
        ...prev,
        activities: exists
          ? prev.activities.filter((a) => a !== activity)
          : [...prev.activities, activity],
      };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email address required';
    }
    if (!formData.area.trim()) newErrors.area = 'Please mention your local area (e.g. Tinsley, Darnall, Burngreave)';
    if (!formData.privacyConsent) newErrors.privacyConsent = 'Consent is required';

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
          Registration Received!
        </h4>
        <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
          Salam {formData.name}, thanks for getting in touch. Our youth coordinator will message you with details of the next youth circles and activities.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              name: '',
              ageGroup: '16–18',
              email: '',
              phone: '',
              area: '',
              activities: [],
              message: '',
              privacyConsent: false,
              botCheck: '',
            });
          }}
          className="text-xs font-semibold text-[#0E4D34] hover:underline pt-1"
        >
          Submit another enquiry
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
          <label htmlFor="youth-name" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Your Name <span className="text-emerald-700">*</span>
          </label>
          <input
            type="text"
            id="youth-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Zayd Khan"
            className={`w-full rounded-md border px-3 py-2 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 ${
              errors.name ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
            }`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="youth-age" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Age Group <span className="text-emerald-700">*</span>
          </label>
          <select
            id="youth-age"
            value={formData.ageGroup}
            onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0E4D34]"
          >
            <option value="11–13 (Junior Youth)">11–13 (Secondary Years 7–8)</option>
            <option value="14–15 (Mid Youth)">14–15 (GCSE Years 9–11)</option>
            <option value="16–18 (Sixth Form / College)">16–18 (Sixth Form / College / Apprentice)</option>
            <option value="19–25 (Young Adults / University)">19–25 (Young Adults / University)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="youth-email" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Email <span className="text-emerald-700">*</span>
          </label>
          <input
            type="email"
            id="youth-email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@example.org"
            className={`w-full rounded-md border px-3 py-2 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
            }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="youth-phone" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
            Mobile / WhatsApp <span className="text-stone-400 font-normal">(Optional)</span>
          </label>
          <input
            type="tel"
            id="youth-phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="07123 456789"
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0E4D34]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="youth-area" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
          Area / Neighbourhood in Sheffield <span className="text-emerald-700">*</span>
        </label>
        <input
          type="text"
          id="youth-area"
          value={formData.area}
          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          placeholder="e.g. Darnall, Tinsley, Firth Park, Nether Edge"
          className={`w-full rounded-md border px-3 py-2 text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 ${
            errors.area ? 'border-red-500 focus:ring-red-500' : 'border-stone-300 focus:ring-[#0E4D34]'
          }`}
        />
        {errors.area && <p className="mt-1 text-xs text-red-600">{errors.area}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
          Activities of Interest
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availableActivities.map((act) => {
            const isChecked = formData.activities.includes(act);
            return (
              <label
                key={act}
                className={`flex items-center gap-2 p-2.5 rounded-md border text-xs cursor-pointer ${
                  isChecked
                    ? 'border-[#0E4D34] bg-[#F0F6F2] text-[#0E4D34] font-medium'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleActivityToggle(act)}
                  className="rounded text-[#0E4D34] focus:ring-[#0E4D34] h-3.5 w-3.5"
                />
                <span className="truncate">{act}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="youth-message" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
          Questions or Comments <span className="text-stone-400 font-normal">(Optional)</span>
        </label>
        <textarea
          id="youth-message"
          rows={2}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell us what you'd like to see at the centre..."
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0E4D34]"
        />
      </div>

      <div>
        <label className="flex items-start gap-2 text-xs text-stone-600 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.privacyConsent}
            onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
            className="mt-0.5 rounded text-[#0E4D34] focus:ring-[#0E4D34] h-3.5 w-3.5 shrink-0"
          />
          <span>
            I consent to the youth team contacting me about upcoming events and circles. Under-16s require parent or guardian awareness.
          </span>
        </label>
        {errors.privacyConsent && (
          <p className="mt-1 text-xs text-red-600 pl-5.5">{errors.privacyConsent}</p>
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
        {isSubmitting ? 'Registering...' : 'Register Youth Interest'}
      </Button>
    </form>
  );
};
