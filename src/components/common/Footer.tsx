import React from 'react';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const handleLink = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#101A12] text-stone-300 border-t border-[#1C2C1F]">
      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Logo & Overview (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex flex-col">
              <div className="flex items-center text-lg sm:text-xl font-bold font-sans">
                <span className="text-white tracking-wide">MADANI</span>
                <span className="text-[#B8C053] ml-1.5 font-extrabold tracking-wider">
                  COMMUNITY CENTRE
                </span>
              </div>
              <span className="text-[11px] text-stone-400 uppercase tracking-widest mt-0.5">
                {siteConfig.regionalSubtitle}
              </span>
            </div>

            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Integrating academic excellence with Islamic teachings and community life on Tinsley Park Road in Sheffield.
            </p>

            {/* Social Links */}
            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold block mb-2.5">
                Connect With Us
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={siteConfig.links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#18261A] text-stone-300 hover:text-[#18260D] hover:bg-[#B8C053] transition-colors"
                  aria-label="Dawat-e-Islami Facebook"
                >
                  <span className="text-xs font-bold">FB</span>
                </a>
                <a
                  href={siteConfig.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#18261A] text-stone-300 hover:text-[#18260D] hover:bg-[#B8C053] transition-colors"
                  aria-label="Dawat-e-Islami Instagram"
                >
                  <span className="text-xs font-bold">IG</span>
                </a>
                <a
                  href={siteConfig.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#18261A] text-stone-300 hover:text-[#18260D] hover:bg-[#B8C053] transition-colors"
                  aria-label="Dawat-e-Islami YouTube"
                >
                  <span className="text-xs font-bold">YT</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Explore (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleLink('/')}
                  className="text-stone-400 hover:text-[#B8C053] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/about')}
                  className="text-stone-400 hover:text-[#B8C053] transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/events')}
                  className="text-stone-400 hover:text-[#B8C053] transition-colors cursor-pointer"
                >
                  Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/youth')}
                  className="text-stone-400 hover:text-[#B8C053] transition-colors cursor-pointer"
                >
                  Youth
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/sisters')}
                  className="text-stone-400 hover:text-[#B8C053] transition-colors cursor-pointer"
                >
                  Sisters
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/venue-hire')}
                  className="text-stone-400 hover:text-[#B8C053] transition-colors cursor-pointer"
                >
                  Venue Hire
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/get-involved')}
                  className="text-stone-400 hover:text-[#B8C053] transition-colors cursor-pointer"
                >
                  Volunteering
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Education & Governance (2.5 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Education
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleLink('/darul-madinah')}
                  className="text-stone-400 hover:text-[#B8C053] transition-colors cursor-pointer"
                >
                  Darul Madinah Primary
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/darul-madinah#admissions')}
                  className="text-stone-400 hover:text-[#B8C053] transition-colors cursor-pointer"
                >
                  Admissions Enquiry
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/policies')}
                  className="text-stone-400 hover:text-[#B8C053] transition-colors cursor-pointer"
                >
                  School Policies
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/safeguarding')}
                  className="text-stone-400 hover:text-[#B8C053] transition-colors cursor-pointer"
                >
                  Safeguarding Commitment
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/darul-madinah#curriculum')}
                  className="text-stone-400 hover:text-[#B8C053] transition-colors cursor-pointer"
                >
                  Curriculum Framework
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Contact Us
            </h3>
            <div className="space-y-2.5 text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#B8C053] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-stone-200 font-medium">Madani Community Centre</p>
                  <p>{siteConfig.address.line1}</p>
                  <p>{siteConfig.address.city}</p>
                  <p className="font-mono text-xs">{siteConfig.address.postcode}</p>
                  <p className="text-xs text-stone-500">{siteConfig.address.country}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="h-4 w-4 text-[#B8C053] shrink-0" aria-hidden="true" />
                <span className="font-mono text-xs text-stone-300">
                  {siteConfig.contact.telephoneDisplay}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#B8C053] shrink-0" aria-hidden="true" />
                <span className="text-xs text-stone-300">
                  {siteConfig.contact.email}
                </span>
              </div>

              <div className="pt-2">
                <a
                  href={siteConfig.links.googleMapsPlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#B8C053] hover:text-white transition-colors"
                >
                  <span>Google Maps Profile</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#B8C053]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal & Accessibility */}
        <div className="mt-12 pt-8 border-t border-[#1C2C1F] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {currentYear} {siteConfig.centreName} · {siteConfig.organisationName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <button
              onClick={() => handleLink('/privacy')}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleLink('/cookies')}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Cookie Policy
            </button>
            <button
              onClick={() => handleLink('/policies')}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => handleLink('/safeguarding')}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Safeguarding
            </button>
            <button
              onClick={() => handleLink('/accessibility')}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Accessibility
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
