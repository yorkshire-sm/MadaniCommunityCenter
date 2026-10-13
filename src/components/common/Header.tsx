import React, { useState, useEffect } from 'react';
import { Menu, X, Lock, Calendar } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { MadaniLogo } from './MadaniLogo';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHomepage = currentPath === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Facilities & Pricing', path: '/facilities' },
    { label: 'Availability & Booking', path: '/booking' },
    { label: 'Contact & Location', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0B2545]/95 backdrop-blur-md shadow-md py-3 border-b border-[#143A66]'
            : isHomepage
            ? 'bg-[#0B2545]/90 backdrop-blur-xs py-4 border-b border-white/10'
            : 'bg-[#0B2545] py-4 border-b border-[#143A66]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
            {/* Wordmark & Official Emblem Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/');
              }}
              className="flex items-center gap-2 sm:gap-3 text-left group focus-visible:outline-none min-w-0 shrink"
              aria-label="Madani Community Center Home"
            >
              {/* Logo Emblem badge on the left side */}
              <div className="h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-xl bg-white p-1 sm:p-1.5 shadow-md border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                <MadaniLogo className="w-full h-full" variant="emblem" />
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center whitespace-nowrap tracking-tight text-sm sm:text-lg md:text-xl font-bold font-sans">
                  <span className="text-white tracking-wide">MADANI</span>
                  <span className="text-[#00A896] ml-1 sm:ml-1.5 font-extrabold tracking-wider">
                    COMMUNITY CENTER
                  </span>
                </div>
                <span className="hidden sm:block text-[10px] sm:text-[11px] tracking-widest uppercase text-slate-300 font-medium whitespace-nowrap truncate">
                  LEARN &bull; CONNECT &bull; BELONG &bull; SHEFFIELD
                </span>
              </div>
            </a>

            {/* Navigation Links (Streamlined 4 Core Sections) */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-8 text-sm font-medium shrink min-w-0" aria-label="Main Navigation">
              {navItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.path);
                    }}
                    className={`transition-colors whitespace-nowrap py-1 relative ${
                      isActive
                        ? 'text-[#00A896] font-bold'
                        : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#00A896] rounded-full" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Actions: Admin Portal Link + Prominent "Book Now" CTA */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <button
                onClick={() => handleNavClick('/admin')}
                className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors cursor-pointer ${
                  currentPath === '/admin'
                    ? 'bg-[#00A896] text-white border-[#00A896]'
                    : 'text-slate-300 hover:text-white border-white/20 hover:bg-white/10'
                }`}
                title="Admin Dashboard Gateway"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>

              <button
                onClick={() => handleNavClick('/booking')}
                className="hidden xs:inline-flex sm:inline-flex items-center gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white bg-gradient-to-r from-[#0077C8] to-[#00A896] hover:from-[#0284C7] hover:to-[#02B19E] rounded-full transition-all shadow-sm cursor-pointer active:scale-98"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Now</span>
              </button>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#00A896] cursor-pointer"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#0B2545] text-slate-100 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-[#143A66]"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#143A66]">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-white p-1 shadow-sm flex items-center justify-center shrink-0">
                    <MadaniLogo className="w-full h-full" variant="emblem" />
                  </div>
                  <div className="flex flex-col shrink-0">
                    <div className="flex items-center text-sm font-bold whitespace-nowrap">
                      <span className="text-white">MADANI</span>
                      <span className="text-[#00A896] ml-1">COMMUNITY CENTER</span>
                    </div>
                    <span className="text-[10px] text-slate-300 whitespace-nowrap">
                      LEARN &bull; CONNECT &bull; BELONG
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-5 flex flex-col space-y-1.5">
                {navItems.map((item) => {
                  const isActive = currentPath === item.path;
                  return (
                    <a
                      key={item.path}
                      href={item.path}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.path);
                      }}
                      className={`px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-[#0077C8] to-[#00A896] text-white font-bold'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>

              <div className="mt-6 pt-5 border-t border-[#143A66] space-y-2.5">
                <button
                  onClick={() => handleNavClick('/booking')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#0077C8] to-[#00A896] hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Check Availability & Book</span>
                </button>
                <button
                  onClick={() => handleNavClick('/admin')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-semibold text-slate-300 border border-white/20 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#00A896]" />
                  <span>Admin Dashboard</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#143A66] text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-200">{siteConfig.centerName}</p>
              <p>{siteConfig.address.line1}, Sheffield, S9 5DL</p>
              <p className="text-[11px] text-[#00A896] pt-1 font-medium">Learn &bull; Connect &bull; Belong</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
