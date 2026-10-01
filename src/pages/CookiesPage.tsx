import React from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

interface CookiesPageProps {
  onNavigate: (path: string) => void;
}

export const CookiesPage: React.FC<CookiesPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('/') },
          { label: 'Cookie Policy' },
        ]}
      />

      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
          Cookie Policy
        </h1>
        <p className="text-xs font-mono text-stone-500">
          Last Updated: October 2026 · Dawat-e-Islami Sheffield
        </p>
      </div>

      <div className="prose prose-stone text-sm leading-relaxed space-y-6 text-stone-700">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-stone-900">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files placed on your computer or mobile device when you browse websites. They help website features operate efficiently and remember your browsing preferences.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-stone-900">2. How We Use Cookies</h2>
          <p>
            The Dawat-e-Islami Sheffield website uses minimal, strictly necessary technical cookies to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Ensure security and prevent cross-site request forgery during form submissions.</li>
            <li>Maintain page navigation states across different sections of the website.</li>
            <li>Remember basic user interface accessibility settings.</li>
          </ul>
          <p className="text-xs">
            We do not use invasive third-party tracking, advertising pixels, or cross-site behavioral tracking cookies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-stone-900">3. Managing Cookies in Your Browser</h2>
          <p>
            Most modern web browsers allow you to control or block cookies through browser settings. Please note that disabling essential cookies may impact the proper functioning of enquiry forms.
          </p>
        </section>
      </div>
    </div>
  );
};
