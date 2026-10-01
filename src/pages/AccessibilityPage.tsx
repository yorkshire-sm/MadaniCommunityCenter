import React from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

interface AccessibilityPageProps {
  onNavigate: (path: string) => void;
}

export const AccessibilityPage: React.FC<AccessibilityPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('/') },
          { label: 'Accessibility Statement' },
        ]}
      />

      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
          Accessibility Statement
        </h1>
        <p className="text-xs font-mono text-stone-500">
          Conformance Target: WCAG 2.2 Level AA · Dawat-e-Islami Sheffield
        </p>
      </div>

      <div className="prose prose-stone text-sm leading-relaxed space-y-6 text-stone-700">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-stone-900">Our Commitment</h2>
          <p>
            Dawat-e-Islami Sheffield is committed to ensuring digital accessibility for people of all abilities, including older visitors, people using screen readers, and keyboard-only navigators. We strive to adhere to the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA standards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-stone-900">Accessibility Features on This Website</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li><strong>Clear Contrast:</strong> Text colors meet or exceed WCAG AA contrast thresholds (minimum 4.5:1 for body copy).</li>
            <li><strong>Keyboard Navigation:</strong> All interactive buttons, menus, modal windows, and form inputs are operable via standard keyboard tabs and keys.</li>
            <li><strong>Visible Focus Indicators:</strong> High-visibility outline rings appear around elements when navigating using a keyboard.</li>
            <li><strong>Skip-to-Content:</strong> A hidden skip link is accessible at the top of the DOM to allow users to bypass top navigation.</li>
            <li><strong>Form Accessibility:</strong> All inputs have distinct, associated <code>&lt;label&gt;</code> elements and explicit validation error alerts.</li>
            <li><strong>Descriptive Alt Text:</strong> All photographs, illustrations, and placeholders include descriptive alternative text for screen readers.</li>
            <li><strong>Respect for Reduced Motion:</strong> Animations and transitions obey the <code>prefers-reduced-motion</code> user system preference.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-stone-900">Physical Building Accessibility</h2>
          <p>
            Our building on Tinsley Park Road, Sheffield, is currently undergoing access upgrades. We are auditing ramps, doorway clear-widths, accessible toilets, and ground-floor hall access to ensure a welcoming experience for wheelchair users and those with mobility requirements.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-stone-900">Feedback & Contact</h2>
          <p>
            If you encounter any accessibility barrier or require information in an alternative accessible format, please contact our accessibility coordinator via the general contact form.
          </p>
        </section>
      </div>
    </div>
  );
};
