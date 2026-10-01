import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { MadaniLogo } from './MadaniLogo';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);

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
    {
      label: 'About',
      path: '/about',
      hasDropdown: true,
      subItems: [
        { label: 'About the Centre', path: '/about' },
        { label: 'Our Purpose & Values', path: '/about#values' },
        { label: 'Facilities Overview', path: '/about#facilities' },
        { label: 'Safeguarding', path: '/safeguarding' },
        { label: 'Governance & Policies', path: '/policies' },
      ],
    },
    { label: 'Darul Madinah', path: '/darul-madinah' },
    { label: 'Youth', path: '/youth' },
    { label: 'Sisters', path: '/sisters' },
    { label: 'Events', path: '/events' },
    { label: 'Venue Hire', path: '/venue-hire' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#121E14]/95 backdrop-blur-md shadow-md py-3 border-b border-[#233827]'
            : isHomepage
            ? 'bg-[#121E14]/70 backdrop-blur-xs py-4 border-b border-white/10'
            : 'bg-[#142217] py-4 border-b border-[#233827]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Wordmark & Official Emblem Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/');
              }}
              className="flex items-center gap-2.5 sm:gap-3 text-left group focus-visible:outline-none"
              aria-label="Madani Community Centre Home"
            >
              {/* Logo Emblem badge on the left side - Enlarged and prominently featured */}
              <div className="h-13 w-13 sm:h-16 sm:w-16 rounded-2xl bg-white p-1.5 sm:p-2 shadow-lg border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                <MadaniLogo className="w-full h-full" variant="emblem" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center tracking-tight text-lg sm:text-xl font-bold font-sans">
                  <span className="text-white tracking-wide">MADANI</span>
                  <span className="text-[#B8C053] ml-1.5 font-extrabold tracking-wider">
                    COMMUNITY CENTRE
                  </span>
                </div>
                <span className="text-[10px] tracking-widest uppercase text-stone-300/80 font-medium">
                  {siteConfig.regionalSubtitle}
                </span>
              </div>
            </a>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium" aria-label="Main Navigation">
              {navItems.map((item) => {
                const isActive = currentPath === item.path;

                if (item.hasDropdown) {
                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => setAboutDropdownOpen(true)}
                      onMouseLeave={() => setAboutDropdownOpen(false)}
                    >
                      <button
                        onClick={() => handleNavClick(item.path)}
                        className={`flex items-center gap-1 py-1 transition-colors cursor-pointer ${
                          isActive
                            ? 'text-[#B8C053] font-semibold'
                            : 'text-stone-200 hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="h-3.5 w-3.5 text-stone-400 group-hover:text-white" />
                      </button>

                      {/* Dropdown Menu */}
                      {aboutDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-52 rounded-xl bg-[#152418] border border-[#273E2C] shadow-xl py-2 z-50">
                          {item.subItems?.map((sub) => (
                            <a
                              key={sub.label}
                              href={sub.path}
                              onClick={(e) => {
                                e.preventDefault();
                                handleNavClick(sub.path);
                              }}
                              className="block px-4 py-2 text-xs text-stone-200 hover:text-white hover:bg-[#1D3222] transition-colors"
                            >
                              {sub.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

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
                        ? 'text-[#B8C053] font-semibold'
                        : 'text-stone-200 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#B8C053] rounded-full" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Actions: "Find Us" Outline Pill Button & "Venue Hire" Accent Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('/contact')}
                className="hidden sm:inline-flex items-center gap-1.5 px-5 py-1.5 text-xs font-semibold text-white hover:bg-white/10 border border-white/60 rounded-full transition-all duration-200 shadow-xs whitespace-nowrap cursor-pointer"
              >
                <span>Find Us</span>
              </button>

              <button
                onClick={() => handleNavClick('/venue-hire')}
                className="hidden xl:inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-[#18260D] bg-[#B8C053] hover:bg-[#A5AD3F] rounded-full transition-all duration-200 shadow-xs whitespace-nowrap cursor-pointer"
              >
                <span>Venue Hire</span>
              </button>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-stone-200 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#B8C053] cursor-pointer"
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
          className="fixed inset-0 z-50 lg:hidden bg-stone-900/60 backdrop-blur-xs transition-opacity duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#121E14] text-stone-100 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-[#273E2C]"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#233827]">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center shrink-0">
                    <MadaniLogo className="w-full h-full" variant="emblem" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center text-sm font-bold">
                      <span className="text-white">MADANI</span>
                      <span className="text-[#B8C053] ml-1">CENTRE</span>
                    </div>
                    <span className="text-[10px] text-stone-400">
                      {siteConfig.regionalSubtitle}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-4 flex flex-col space-y-1">
                {navItems.map((item) => {
                  const isActive = currentPath === item.path;
                  return (
                    <a
                      key={item.label}
                      href={item.path}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.path);
                      }}
                      className={`px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#B8C053] text-[#16220B] font-semibold'
                          : 'text-stone-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>

              <div className="mt-5 pt-4 border-t border-[#233827] space-y-2">
                <button
                  onClick={() => handleNavClick('/venue-hire')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-semibold text-[#18260D] bg-[#B8C053] hover:bg-[#A5AD3F] transition-colors cursor-pointer"
                >
                  <span>Venue Hire Enquiry</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleNavClick('/contact')}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full text-xs font-medium text-white border border-white/40 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span>Find Us & Contact</span>
                </button>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#233827] text-xs text-stone-400 space-y-1">
              <p className="font-semibold text-stone-200">Tinsley Park Road, Sheffield</p>
              <p>Postcode: S9 5DL</p>
              <p className="text-[11px] text-stone-400">Tel: {siteConfig.contact.telephoneDisplay}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
