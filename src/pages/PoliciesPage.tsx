import React, { useState } from 'react';
import {
  FileText,
  Download,
  AlertCircle,
  Shield,
  Search,
  CheckCircle,
} from 'lucide-react';
import { schoolAndCenterPolicies, PolicyDocument } from '../data/policiesData';
import { siteConfig } from '../config/siteConfig';
import { Button } from '../components/common/Button';
import { SectionHeading } from '../components/common/SectionHeading';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

interface PoliciesPageProps {
  onNavigate: (path: string) => void;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ onNavigate }) => {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = [
    'All',
    'School Governance',
    'Safeguarding & Safety',
    'General Operations',
    'Data & Privacy',
  ];

  const filtered = schoolAndCenterPolicies.filter(
    (p) => filterCategory === 'All' || p.category === filterCategory
  );

  const handleDownloadClick = (policy: PolicyDocument) => {
    setDownloadNotice(
      `"${policy.title}" is currently in draft review by the Dawat-e-Islami / Darul Madinah governance committee. The final ratified PDF will be published prior to term commencement.`
    );
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 sm:space-y-12">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('/') },
          { label: 'Policies & Governance' },
        ]}
      />

      {/* Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0E4D34]">
          <span className="h-px w-6 bg-[#C59B27]" aria-hidden="true" />
          <span>Governance & Statutory Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 leading-tight">
          School & Center Policies
        </h1>
        <p className="text-base text-stone-600 leading-relaxed font-normal">
          Statutory policies, codes of practice, and procedural guidance for Darul Madinah Primary School and the Dawat-e-Islami Sheffield community center.
        </p>
      </section>

      {/* Important Disclaimer Notice */}
      <div className="rounded-xl border border-amber-200/90 bg-amber-50/70 p-5 flex items-start gap-3.5 text-xs text-amber-900">
        <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-sm">Policy Transition Notice</p>
          <p className="leading-relaxed">
            Following the building transition, policies previously associated with Luqman Academy are intentionally being replaced with dedicated Dawat-e-Islami and Darul Madinah educational policies. Draft frameworks are currently under ratification by our governance advisory panel.
          </p>
        </div>
      </div>

      {downloadNotice && (
        <div className="rounded-xl border border-stone-300 bg-white p-5 flex items-start justify-between gap-3 text-xs text-stone-700 shadow-sm animate-fade-in">
          <div className="flex items-start gap-2.5">
            <CheckCircle className="h-5 w-5 text-[#0E4D34] shrink-0" />
            <p>{downloadNotice}</p>
          </div>
          <button
            onClick={() => setDownloadNotice(null)}
            className="text-stone-400 hover:text-stone-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Categories Filter */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-lg border border-stone-200 w-fit">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterCategory === cat
                ? 'bg-white text-[#0E4D34] font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Policies List */}
      <div className="space-y-4">
        {filtered.map((policy) => (
          <div
            key={policy.id}
            className="rounded-lg border border-stone-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-stone-300 transition-colors"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-[#0E4D34]">{policy.category}</span>
                <span className="text-stone-300">·</span>
                <span className="font-mono text-stone-400 text-[11px]">{policy.status}</span>
                <span className="text-stone-300">·</span>
                <span className="text-stone-400 text-[11px]">{policy.lastUpdated}</span>
              </div>
              <h3 className="text-base font-bold text-stone-900">{policy.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {policy.description}
              </p>
              <p className="text-[11px] font-mono text-stone-400 pt-1">
                Format: {policy.documentType} ({policy.fileSizePlaceholder})
              </p>
            </div>

            <div className="shrink-0 pt-2 sm:pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadClick(policy)}
                icon={<Download className="h-3.5 w-3.5" />}
              >
                Download Policy
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dedicated Safeguarding Link */}
      <div className="rounded-xl border border-stone-200 bg-[#FAF9F5] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#0E4D34]" />
            Looking for Our Safeguarding Statement?
          </h4>
          <p className="text-xs text-stone-600">
            Read our dedicated safeguarding policy, reporting procedures, and child protection standards.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onNavigate('/safeguarding')}
        >
          View Safeguarding Page
        </Button>
      </div>
    </div>
  );
};
