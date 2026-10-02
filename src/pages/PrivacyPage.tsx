import React from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { siteConfig } from '../config/siteConfig';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('/') },
          { label: 'Privacy Policy' },
        ]}
      />

      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
          Privacy Policy & Data Protection (UK GDPR)
        </h1>
        <p className="text-xs font-mono text-stone-500">
          Last Updated: October 2026 · Dawat-e-Islami Sheffield
        </p>
      </div>

      <div className="prose prose-stone text-sm leading-relaxed space-y-6 text-stone-700">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-stone-900">1. Who We Are</h2>
          <p>
            Dawat-e-Islami Sheffield operates the community and education center located at Tinsley Park Road, Sheffield, S9 5DL, United Kingdom. We act as the Data Controller under the UK Data Protection Act 2018 and the UK General Data Protection Regulation (UK GDPR).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-stone-900">2. The Information We Collect</h2>
          <p>We may collect and process personal data when you:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Submit an enquiry form for general queries or admissions at Darul Madinah Primary School.</li>
            <li>Submit a venue hire request for event hall bookings.</li>
            <li>Register interest for youth activities, sisters' gatherings, or volunteering.</li>
            <li>Register to attend a scheduled seminar or open morning.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-stone-900">3. How We Use Your Data</h2>
          <p>
            Your information is processed strictly for the administrative purpose for which it was provided:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>To respond to your questions and communicate relevant event logistics.</li>
            <li>To process school admissions expressions of interest in accordance with educational statutory requirements.</li>
            <li>To evaluate venue hire eligibility and execute hire contracts.</li>
            <li>To fulfil safeguarding duties where applicable.</li>
          </ul>
          <p className="text-xs">We do not sell, rent, or trade personal data to any commercial third parties.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-stone-900">4. Data Retention & Security</h2>
          <p>
            We retain personal details only for as long as necessary to fulfil the stated purposes or comply with statutory record-keeping periods. All data is protected using appropriate technical and organizational safeguards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-stone-900">5. Your Legal Rights</h2>
          <p>
            Under UK data protection law, you have rights including the right to request access to your data, rectification of inaccurate information, erasure, and restriction of processing.
          </p>
          <p className="text-xs">
            To exercise your rights, please contact our data governance lead at: <code>{siteConfig.contact.email}</code>.
          </p>
        </section>
      </div>
    </div>
  );
};
