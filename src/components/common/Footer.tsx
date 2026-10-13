import React from 'react';
import { MapPin, Phone, Mail, Lock, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { MadaniLogo } from './MadaniLogo';

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
    <footer className="bg-[#07192F] text-slate-300 border-t border-[#143A66]">
      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Logo & Overview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-white p-1 shadow-md border border-white/20 flex items-center justify-center shrink-0">
                <MadaniLogo className="w-full h-full" variant="emblem" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center text-base sm:text-xl font-bold font-sans whitespace-nowrap">
                  <span className="text-white tracking-wide">MADANI</span>
                  <span className="text-[#00A896] ml-1 sm:ml-1.5 font-extrabold tracking-wider">
                    COMMUNITY CENTER
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-300 uppercase tracking-widest mt-0.5 whitespace-nowrap truncate">
                  LEARN &bull; CONNECT &bull; BELONG
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Sheffield’s dedicated community centre booking platform on Tinsley Park Road. Providing transparent availability and easy online reservations for event halls, training suites, and classrooms.
            </p>

            {/* Social Links */}
            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-2.5">
                Connect With Dawat-e-Islami Sheffield
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={siteConfig.links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F2D52] text-slate-200 hover:text-white hover:bg-[#0077C8] transition-colors"
                  aria-label="Facebook"
                >
                  <span className="text-xs font-bold">FB</span>
                </a>
                <a
                  href={siteConfig.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F2D52] text-slate-200 hover:text-white hover:bg-[#00A896] transition-colors"
                  aria-label="Instagram"
                >
                  <span className="text-xs font-bold">IG</span>
                </a>
                <a
                  href={siteConfig.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F2D52] text-slate-200 hover:text-white hover:bg-rose-600 transition-colors"
                  aria-label="YouTube"
                >
                  <span className="text-xs font-bold">YT</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Booking Navigation (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Booking Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleLink('/')}
                  className="text-slate-300 hover:text-[#00A896] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/facilities')}
                  className="text-slate-300 hover:text-[#00A896] transition-colors cursor-pointer"
                >
                  Facilities &amp; Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/booking')}
                  className="text-slate-300 hover:text-[#00A896] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Availability &amp; Booking</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#00A896]/20 text-[#00A896] font-semibold">Live</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/contact')}
                  className="text-slate-300 hover:text-[#00A896] transition-colors cursor-pointer"
                >
                  Contact &amp; Location
                </button>
              </li>
              <li className="pt-2 border-t border-[#143A66]">
                <button
                  onClick={() => handleLink('/admin')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
                >
                  <Lock className="w-3.5 h-3.5 text-[#00A896]" />
                  <span>Admin Dashboard Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Ethos (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Venue Location &amp; Hours
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#00A896] shrink-0 mt-0.5" />
                <span>
                  {siteConfig.address.line1}, {siteConfig.address.city}, {siteConfig.address.postcode}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#00A896] shrink-0" />
                <a href={`tel:${siteConfig.contact.telephone}`} className="hover:text-white transition-colors">
                  {siteConfig.contact.telephoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#00A896] shrink-0" />
                <a href={`mailto:${siteConfig.contact.venueEmail}`} className="hover:text-white transition-colors">
                  {siteConfig.contact.venueEmail}
                </a>
              </div>
            </div>

            <div className="pt-3">
              <div className="p-3 rounded-xl bg-[#0D2442] border border-[#143A66] text-[11px] text-slate-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00A896] shrink-0 mt-0.5" />
                <span>Alcohol-free community facility. Bookings subject to administrative approval.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="border-t border-[#143A66] bg-[#040E1B] text-slate-400 text-xs py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>&copy; {currentYear} {siteConfig.centerName} &middot; {siteConfig.organisationName}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => handleLink('/contact')}
              className="hover:text-[#00A896] transition-colors cursor-pointer"
            >
              Enquiries
            </button>
            <span className="text-slate-600">&middot;</span>
            <button
              onClick={() => handleLink('/admin')}
              className="hover:text-[#00A896] transition-colors cursor-pointer"
            >
              Staff Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
