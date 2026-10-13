import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  BookOpen,
  Heart,
} from 'lucide-react';
import { bookingStore } from '../data/bookingStore';
import { PlaceholderImage } from '../components/common/PlaceholderImage';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectFacilityForBooking?: (facilityId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectFacilityForBooking,
}) => {
  const facilities = bookingStore.getFacilities();

  const handleBookFacility = (facilityId: string) => {
    if (onSelectFacilityForBooking) {
      onSelectFacilityForBooking(facilityId);
    }
    onNavigate('/booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#07192F] via-[#0B2545] to-[#051324] text-white pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00A896_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#00A896]/15 text-[#00A896] border border-[#00A896]/30 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Learn &bull; Connect &bull; Belong &bull; Sheffield</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-brand font-bold tracking-tight text-white leading-[1.15]">
                Book Flexible Spaces for Community, Education &amp; Private Events
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                Welcome to <strong className="text-white font-semibold">Madani Community Center</strong> on Tinsley Park Road in Sheffield. We offer high-spec event halls, modern meeting rooms, and classroom spaces with transparent hire prices and rapid online availability confirmation.
              </p>

              {/* Prominent Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('/booking')}
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#0077C8] to-[#00A896] hover:from-[#0284C7] hover:to-[#02B19E] transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Check Availability &amp; Book</span>
                </button>

                <button
                  onClick={() => onNavigate('/facilities')}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full text-sm font-semibold text-white border border-white/25 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span>Explore Rooms &amp; Rates</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 border-t border-white/10 text-[11px] sm:text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00A896] shrink-0" />
                  <span>Step-Free Access</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00A896] shrink-0" />
                  <span>From £20/Hour</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00A896] shrink-0" />
                  <span>Free On-Site Parking</span>
                </div>
              </div>
            </div>

            {/* Hero Main Photography */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-slate-900 group">
                <PlaceholderImage
                  placeholderKey="center-exterior"
                  aspectRatio="4:3"
                  alt="Madani Community Center Building Exterior on Tinsley Park Road Sheffield"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs space-y-1">
                  <span className="font-semibold text-sm block">Madani Community Center</span>
                  <span className="text-slate-300 flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-[#00A896]" />
                    Tinsley Park Road, Sheffield, S9 5DL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW BOOKING WORKS (4 SIMPLE STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00A896]">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl font-serif-brand font-bold text-[#0B2545]">
            How to Book the Center
          </h2>
          <p className="text-sm text-slate-600">
            No account required. Submit your preferred dates online and receive prompt coordinator review.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Choose Facility',
              desc: 'Select from our main assembly hall, boardroom suite, classrooms, or youth activity lounge.',
            },
            {
              step: '02',
              title: 'Check Live Calendar',
              desc: 'View real-time availability to ensure no conflicting reservations on your chosen date.',
            },
            {
              step: '03',
              title: 'Submit Request',
              desc: 'Fill out your event requirements and receive your official reference code instantly.',
            },
            {
              step: '04',
              title: 'Coordinator Approval',
              desc: 'Our bookings coordinator reviews your request and emails confirmation within 24–48 hours.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-3 relative overflow-hidden hover:border-[#0077C8]/40 transition-colors"
            >
              <span className="text-3xl font-extrabold text-[#0077C8]/25 block font-mono">
                {item.step}
              </span>
              <h3 className="text-base font-bold text-[#0B2545]">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED FACILITIES OVERVIEW WITH PRICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A896]">
              Spaces for Every Occasion
            </span>
            <h2 className="text-3xl font-serif-brand font-bold text-[#0B2545] mt-1">
              Available Rooms &amp; Hire Prices
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/facilities')}
            className="text-xs font-bold text-[#0077C8] hover:text-[#00A896] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Technical Specs &amp; Pricing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <PlaceholderImage
                    placeholderKey={fac.placeholderKey}
                    aspectRatio="16:9"
                    alt={fac.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-[#0B2545]/90 text-white text-xs px-3 py-1 rounded-full font-bold">
                    £{fac.hourlyRate}/hr
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-serif-brand font-bold text-[#0B2545]">
                      {fac.name}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Up to {fac.capacity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {fac.description}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {fac.equipment.slice(0, 3).map((eq, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <span className="text-xs text-slate-500 font-medium">
                  Deposit: £{fac.depositRequired} refundable
                </span>
                <button
                  onClick={() => handleBookFacility(fac.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#0B2545] text-white hover:bg-[#0077C8] transition-colors cursor-pointer"
                >
                  <span>Book This Space</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. COMMUNITY ETHOS & CONDITIONS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#143A66] bg-gradient-to-r from-[#0B2545] to-[#0A1D36] text-white p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00A896]">
                Respectful Community Ethos
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-brand font-bold text-white leading-tight">
                Family-Oriented, Alcohol-Free &amp; Inclusive Environment
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                As a community centre under Dawat-e-Islami Sheffield, we take pride in offering a welcoming, safe space for voluntary groups, local families, charity workshops, and educational clinics. In keeping with our ethos, strictly no alcohol, gambling, or unlawful activities are permitted on site.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                onClick={() => onNavigate('/booking')}
                className="w-full py-3.5 px-6 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#0077C8] to-[#00A896] hover:from-[#0284C7] hover:to-[#02B19E] transition-all text-center cursor-pointer shadow-xs"
              >
                Check Date Availability Now
              </button>
              <button
                onClick={() => onNavigate('/contact')}
                className="w-full py-3 px-6 rounded-full text-xs font-medium text-slate-300 hover:text-white border border-white/20 hover:bg-white/5 transition-colors text-center cursor-pointer"
              >
                Have Questions? Contact Team
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
