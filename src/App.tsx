import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { TransitionBanner } from './components/common/TransitionBanner';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DarulMadinahPage } from './pages/DarulMadinahPage';
import { YouthPage } from './pages/YouthPage';
import { SistersPage } from './pages/SistersPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { VenueHirePage } from './pages/VenueHirePage';
import { GetInvolvedPage } from './pages/GetInvolvedPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { SafeguardingPage } from './pages/SafeguardingPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { CookiesPage } from './pages/CookiesPage';
import { AccessibilityPage } from './pages/AccessibilityPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [activeEventSlug, setActiveEventSlug] = useState<string | null>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/events/') && path.length > 8) {
      return path.replace('/events/', '');
    }
    return null;
  });

  // Synchronise with browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      if (path.startsWith('/events/') && path.length > 8) {
        setActiveEventSlug(path.replace('/events/', ''));
      } else {
        setActiveEventSlug(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    // Strip hash if navigating to a page with hash
    const cleanPath = path.split('#')[0] || '/';
    const hash = path.includes('#') ? path.substring(path.indexOf('#')) : '';

    if (window.location.pathname !== cleanPath) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(cleanPath);

    if (cleanPath.startsWith('/events/') && cleanPath.length > 8) {
      setActiveEventSlug(cleanPath.replace('/events/', ''));
    } else {
      setActiveEventSlug(null);
    }

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

  const handleSelectEvent = (slug: string) => {
    setActiveEventSlug(slug);
    const targetPath = `/events/${slug}`;
    window.history.pushState({}, '', targetPath);
    setCurrentPath(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    // Check for individual event route
    if (activeEventSlug || (currentPath.startsWith('/events/') && currentPath.length > 8)) {
      const slug = activeEventSlug || currentPath.replace('/events/', '');
      return (
        <EventDetailPage
          slug={slug}
          onNavigate={navigateTo}
          onSelectEvent={handleSelectEvent}
        />
      );
    }

    switch (currentPath) {
      case '/':
        return (
          <HomePage
            onNavigate={navigateTo}
            onSelectEvent={handleSelectEvent}
          />
        );
      case '/about':
        return <AboutPage onNavigate={navigateTo} />;
      case '/darul-madinah':
        return <DarulMadinahPage onNavigate={navigateTo} />;
      case '/youth':
        return (
          <YouthPage
            onNavigate={navigateTo}
            onSelectEvent={handleSelectEvent}
          />
        );
      case '/sisters':
        return (
          <SistersPage
            onNavigate={navigateTo}
            onSelectEvent={handleSelectEvent}
          />
        );
      case '/events':
        return (
          <EventsPage
            onNavigate={navigateTo}
            onSelectEvent={handleSelectEvent}
          />
        );
      case '/venue-hire':
        return <VenueHirePage onNavigate={navigateTo} />;
      case '/get-involved':
        return <GetInvolvedPage onNavigate={navigateTo} />;
      case '/policies':
        return <PoliciesPage onNavigate={navigateTo} />;
      case '/safeguarding':
        return <SafeguardingPage onNavigate={navigateTo} />;
      case '/contact':
        return <ContactPage onNavigate={navigateTo} />;
      case '/privacy':
        return <PrivacyPage onNavigate={navigateTo} />;
      case '/cookies':
        return <CookiesPage onNavigate={navigateTo} />;
      case '/accessibility':
        return <AccessibilityPage onNavigate={navigateTo} />;
      default:
        return <NotFoundPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 font-sans selection:bg-[#B8C053]/30 selection:text-[#18260D]">
      {/* Skip to Content Link (Accessibility) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#182B1C] focus:text-white focus:rounded-md focus:shadow-md focus:text-xs font-semibold"
      >
        Skip to main content
      </a>

      {/* Building transition informative banner */}
      <TransitionBanner onLearnMore={() => navigateTo('/about')} />

      {/* Sticky Navigation Header */}
      <Header currentPath={currentPath} onNavigate={navigateTo} />

      {/* Main Page Area */}
      <main id="main-content" className="flex-1 pb-16 outline-none">
        {renderContent()}
      </main>

      {/* Substantial, Uncluttered Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
