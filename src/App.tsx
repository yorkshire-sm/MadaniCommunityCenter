import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { TransitionBanner } from './components/common/TransitionBanner';

// 4 Core Pages + Admin Dashboard
import { HomePage } from './pages/HomePage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { BookingPage } from './pages/BookingPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Helper to determine GitHub Pages repository subfolder prefix (e.g. /MadaniCommunityCenter)
const getRepoBase = (): string => {
  const path = window.location.pathname || '/';
  const lower = path.toLowerCase();
  if (lower.startsWith('/madanicommunitycenter')) {
    return path.substring(0, '/madanicommunitycenter'.length);
  }
  if (lower.startsWith('/madanicommunitycentre')) {
    return path.substring(0, '/madanicommunitycentre'.length);
  }
  return '';
};

// Normalize browser pathname into internal app route (e.g. /MadaniCommunityCenter/booking -> /booking)
const normalizeAppPath = (pathname: string): string => {
  const base = getRepoBase();
  let p = pathname || '/';
  if (base && p.toLowerCase().startsWith(base.toLowerCase())) {
    p = p.substring(base.length);
  }
  if (!p.startsWith('/')) {
    p = '/' + p;
  }
  if (p.length > 1 && p.endsWith('/')) {
    p = p.slice(0, -1);
  }
  return p || '/';
};

// Convert internal app route into full browser URL maintaining GitHub Pages subfolder
const toBrowserPath = (appPath: string): string => {
  const base = getRepoBase();
  if (!base) return appPath;
  if (appPath === '/') return `${base}/`;
  return `${base}${appPath.startsWith('/') ? '' : '/'}${appPath}`;
};

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return normalizeAppPath(window.location.pathname);
  });

  const [preselectedFacilityId, setPreselectedFacilityId] = useState<string>('fac-main-hall');

  // Synchronise with browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      const appPath = normalizeAppPath(window.location.pathname);
      setCurrentPath(appPath);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    const cleanAppPath = path.split('#')[0] || '/';
    const hash = path.includes('#') ? path.substring(path.indexOf('#')) : '';
    const fullBrowserPath = toBrowserPath(cleanAppPath) + hash;

    if (window.location.pathname + window.location.hash !== fullBrowserPath) {
      window.history.pushState({}, '', fullBrowserPath);
    }
    setCurrentPath(cleanAppPath);

    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectFacilityForBooking = (facilityId: string) => {
    setPreselectedFacilityId(facilityId);
    navigateTo('/booking');
  };

  const renderContent = () => {
    switch (currentPath) {
      case '/':
        return (
          <HomePage
            onNavigate={navigateTo}
            onSelectFacilityForBooking={handleSelectFacilityForBooking}
          />
        );
      case '/facilities':
      case '/pricing':
      case '/venue-hire': // legacy redirect support
        return (
          <FacilitiesPage
            onNavigate={navigateTo}
            onSelectFacilityForBooking={handleSelectFacilityForBooking}
          />
        );
      case '/booking':
      case '/availability':
        return (
          <BookingPage
            onNavigate={navigateTo}
            preselectedFacilityId={preselectedFacilityId}
          />
        );
      case '/contact':
      case '/location':
        return <ContactPage onNavigate={navigateTo} />;
      case '/admin':
      case '/dashboard':
        return <AdminDashboardPage onNavigate={navigateTo} />;
      default:
        return <NotFoundPage onNavigate={navigateTo} />;
    }
  };

  const isAdminPage = currentPath === '/admin' || currentPath === '/dashboard';

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#FAF9F5] text-stone-900 font-sans selection:bg-[#B8C053]/30 selection:text-[#18260D]">
      {/* Skip to Content Link (Accessibility) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#182B1C] focus:text-white focus:rounded-md focus:shadow-md focus:text-xs font-semibold"
      >
        Skip to main content
      </a>

      {/* Building transition / booking announcement informative banner */}
      {!isAdminPage && (
        <TransitionBanner onLearnMore={() => navigateTo('/booking')} />
      )}

      {/* Sticky Navigation Header */}
      <Header currentPath={currentPath} onNavigate={navigateTo} />

      {/* Main Page Area */}
      <main id="main-content" className="flex-1 pb-12 outline-none">
        {renderContent()}
      </main>

      {/* Substantial Footer */}
      {!isAdminPage && <Footer onNavigate={navigateTo} />}
    </div>
  );
}
