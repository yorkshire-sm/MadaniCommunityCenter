import React from 'react';
import {
  Shield,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  FileText,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { Button } from '../components/common/Button';
import { SectionHeading } from '../components/common/SectionHeading';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

interface SafeguardingPageProps {
  onNavigate: (path: string) => void;
}

export const SafeguardingPage: React.FC<SafeguardingPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 sm:space-y-12">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('/') },
          { label: 'Safeguarding & Child Protection' },
        ]}
      />

      {/* Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0E4D34]">
          <Shield className="h-4 w-4" />
          <span>Child Protection & Welfare</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 leading-tight">
          Safeguarding Commitment
        </h1>
        <p className="text-base text-stone-600 leading-relaxed font-normal">
          Dawat-e-Islami Sheffield and Darul Madinah Primary School consider the safety, protection, and emotional wellbeing of children and vulnerable individuals to be of paramount importance.
        </p>
      </section>

      {/* Core Principles */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg border border-stone-200 bg-white shadow-xs space-y-2.5">
          <CheckCircle className="h-5 w-5 text-[#0E4D34]" />
          <h3 className="text-base font-bold text-stone-900">Safer Recruitment</h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            All teachers, teaching assistants, youth mentors, and regular volunteers undergo rigorous vetting including Enhanced DBS checks, identity verification, and professional reference reviews.
          </p>
        </div>

        <div className="p-6 rounded-lg border border-stone-200 bg-white shadow-xs space-y-2.5">
          <Lock className="h-5 w-5 text-[#0E4D34]" />
          <h3 className="text-base font-bold text-stone-900">Mandatory Staff Training</h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Staff undertake statutory annual safeguarding updates in alignment with the UK Department for Education’s ‘Keeping Children Safe in Education’ (KCSIE) framework.
          </p>
        </div>

        <div className="p-6 rounded-lg border border-stone-200 bg-white shadow-xs space-y-2.5">
          <AlertTriangle className="h-5 w-5 text-[#0E4D34]" />
          <h3 className="text-base font-bold text-stone-900">Clear Referral Pathways</h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            We maintain an open culture where any concern, no matter how small, is promptly documented and investigated by our Designated Safeguarding Leads.
          </p>
        </div>
      </section>

      {/* Designated Safeguarding Leads (Placeholders clearly marked) */}
      <section className="rounded-xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6">
        <SectionHeading
          kicker="Safeguarding Leadership"
          title="Designated Safeguarding Contacts"
          description="Designated leads for child protection and welfare at Tinsley Park Road."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-lg bg-[#FAF9F5] border border-stone-200 space-y-2">
            <span className="text-xs font-semibold text-[#0E4D34] uppercase tracking-wider block">
              Designated Safeguarding Lead (DSL)
            </span>
            <h4 className="text-base font-bold text-stone-900">
              [DESIGNATED SAFEGUARDING LEAD NAME]
            </h4>
            <p className="text-xs text-stone-500">
              School Leadership & Safeguarding Coordinator
            </p>
            <div className="pt-2 text-xs space-y-1 text-stone-600">
              <p>Email: safeguarding.sheffield@example.org <span className="text-stone-400 font-mono">(Placeholder)</span></p>
              <p>Telephone: 01234 567890 <span className="text-stone-400 font-mono">(Placeholder)</span></p>
            </div>
          </div>

          <div className="p-5 rounded-lg bg-[#FAF9F5] border border-stone-200 space-y-2">
            <span className="text-xs font-semibold text-[#0E4D34] uppercase tracking-wider block">
              Deputy Designated Safeguarding Lead (DDSL)
            </span>
            <h4 className="text-base font-bold text-stone-900">
              [DEPUTY SAFEGUARDING LEAD NAME]
            </h4>
            <p className="text-xs text-stone-500">
              Pastoral Care & Community Welfare Officer
            </p>
            <div className="pt-2 text-xs space-y-1 text-stone-600">
              <p>Email: deputy.safeguarding@example.org <span className="text-stone-400 font-mono">(Placeholder)</span></p>
              <p>Telephone: 01234 567890 <span className="text-stone-400 font-mono">(Placeholder)</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* External Statutory Contacts */}
      <section className="rounded-xl border border-stone-200 bg-[#FAF9F5] p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-stone-900">
          Statutory External Helplines & Sheffield Local Authority
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          If a child is in immediate danger, always call <strong>999</strong> for emergency services.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-stone-700">
          <div className="p-4 rounded-md bg-white border border-stone-200 space-y-1">
            <p className="font-bold text-stone-900">Sheffield Children's Social Care</p>
            <p className="text-stone-500">Sheffield Safeguarding Hub (Sheffield City Council)</p>
            <p className="font-mono text-stone-800 font-semibold pt-1">0114 273 4855</p>
          </div>

          <div className="p-4 rounded-md bg-white border border-stone-200 space-y-1">
            <p className="font-bold text-stone-900">NSPCC Helpline</p>
            <p className="text-stone-500">National helpline for child protection advice</p>
            <p className="font-mono text-stone-800 font-semibold pt-1">0808 800 5000</p>
          </div>

          <div className="p-4 rounded-md bg-white border border-stone-200 space-y-1">
            <p className="font-bold text-stone-900">Childline</p>
            <p className="text-stone-500">Direct confidential support for children & youth</p>
            <p className="font-mono text-stone-800 font-semibold pt-1">0800 1111</p>
          </div>
        </div>
      </section>

      <div className="pt-2 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('/policies')}
          icon={<FileText className="h-4 w-4" />}
        >
          View Full Policies List
        </Button>
      </div>
    </div>
  );
};
