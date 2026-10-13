import React, { useState } from 'react';
import {
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
  Coffee,
  Wifi,
  Tv,
  Mic,
  Maximize2,
} from 'lucide-react';
import { bookingStore, Facility } from '../data/bookingStore';
import { PlaceholderImage } from '../components/common/PlaceholderImage';

interface FacilitiesPageProps {
  onNavigate: (path: string) => void;
  onSelectFacilityForBooking?: (facilityId: string) => void;
}

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({
  onNavigate,
  onSelectFacilityForBooking,
}) => {
  const [facilities] = useState<Facility[]>(() => bookingStore.getFacilities());
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredFacilities = facilities.filter((fac) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'hall') return fac.id === 'fac-main-hall';
    if (selectedFilter === 'meeting') return fac.id === 'fac-meeting-suite';
    if (selectedFilter === 'classroom') return fac.id === 'fac-classrooms';
    if (selectedFilter === 'lounge') return fac.id === 'fac-youth-lounge';
    return true;
  });

  const handleBookFacility = (facilityId: string) => {
    if (onSelectFacilityForBooking) {
      onSelectFacilityForBooking(facilityId);
    }
    onNavigate('/booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-12 sm:space-y-16 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <section className="rounded-3xl border border-stone-200/90 bg-gradient-to-b from-[#142318] to-[#0F1B12] text-white p-8 sm:p-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#B8C053]/10 blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#B8C053]/20 text-[#B8C053] border border-[#B8C053]/30">
            <Sparkles className="w-3.5 h-3.5" />
            Transparent Pricing & Capacities
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-brand font-bold tracking-tight text-white leading-tight">
            Facilities & Hire Pricing
          </h1>
          <p className="text-base sm:text-lg text-stone-300 leading-relaxed">
            High-standard, multi-purpose event halls, meeting suites, and classroom spaces on Tinsley Park Road in Sheffield. All bookings include high-speed Wi-Fi, audio-visual presentation equipment, and step-free accessibility.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/booking')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#B8C053] text-[#14220C] hover:bg-[#c5cd62] transition-colors shadow-sm cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              Check Availability & Book
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('pricing-table');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium text-stone-200 hover:text-white border border-white/20 hover:bg-white/5 transition-colors cursor-pointer"
            >
              Compare Hire Rates
            </button>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-serif-brand font-bold text-[#182B1C]">
            Available Spaces
          </h2>
          <p className="text-xs text-stone-500">
            Select a room to view technical specifications, equipment, and hire fees
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
          {[
            { id: 'all', label: 'All Spaces' },
            { id: 'hall', label: 'Main Hall' },
            { id: 'meeting', label: 'Meeting Suite' },
            { id: 'classroom', label: 'Classrooms' },
            { id: 'lounge', label: 'Youth Lounge' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-white text-[#182B1C] shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Facility Cards */}
      <div className="space-y-12">
        {filteredFacilities.map((facility) => (
          <div
            key={facility.id}
            id={facility.slug}
            className="rounded-3xl border border-stone-200 bg-white shadow-xs overflow-hidden transition-all hover:shadow-md"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Photo & Quick Specs */}
              <div className="lg:col-span-5 bg-stone-100 relative min-h-[280px] lg:min-h-full">
                <PlaceholderImage
                  placeholderKey={facility.placeholderKey}
                  aspectRatio="16:9"
                  alt={`${facility.name} at Madani Community Center Sheffield`}
                  className="w-full h-full object-cover min-h-[280px]"
                />
                <div className="absolute top-4 left-4 bg-[#142318]/90 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-full font-semibold border border-white/20">
                  {facility.category}
                </div>
              </div>

              {/* Facility Details & Pricing */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-stone-100 pb-4">
                    <div>
                      <h3 className="text-2xl font-serif-brand font-bold text-[#182B1C]">
                        {facility.name}
                      </h3>
                      {facility.dimensions && (
                        <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5" />
                          Floor Area: {facility.dimensions}
                        </p>
                      )}
                    </div>

                    <div className="text-left sm:text-right bg-stone-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">
                      <div className="flex items-baseline sm:justify-end gap-1">
                        <span className="text-3xl font-extrabold text-[#182B1C]">
                          £{facility.hourlyRate}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">
                          / hour (Weekdays)
                        </span>
                      </div>
                      <span className="text-[11px] text-[#B8C053] font-semibold block">
                        £{facility.weekendRate} / hr on Saturdays & Sundays
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-stone-600 leading-relaxed mt-4">
                    {facility.description}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="bg-[#FAF9F5] p-3.5 rounded-2xl border border-stone-200/80">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#182B1C] uppercase tracking-wider mb-2">
                        <Users className="w-4 h-4 text-[#B8C053]" />
                        Capacity & Layout
                      </div>
                      <p className="text-sm font-semibold text-stone-800">
                        Up to {facility.capacity} attendees
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Flexible seating, banquet rounds, or open floor layout
                      </p>
                    </div>

                    <div className="bg-[#FAF9F5] p-3.5 rounded-2xl border border-stone-200/80">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#182B1C] uppercase tracking-wider mb-2">
                        <ShieldCheck className="w-4 h-4 text-[#B8C053]" />
                        Security & Booking Terms
                      </div>
                      <p className="text-sm font-semibold text-stone-800">
                        Deposit: £{facility.depositRequired} refundable
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Alcohol-free community ethos, keyholder on site
                      </p>
                    </div>
                  </div>

                  {/* Key Features & Included Equipment */}
                  <div className="mt-6 pt-4 border-t border-stone-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2.5">
                      Included Facilities & Audio-Visual Amenities
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {facility.equipment.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-stone-600">
                          <CheckCircle2 className="w-4 h-4 text-[#437A3B] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-100 flex-wrap gap-3">
                  <div className="text-xs text-stone-500">
                    Subject to administrator confirmation. Registered charity discounts available.
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBookFacility(facility.id)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#182B1C] text-white hover:bg-[#253f2a] transition-colors cursor-pointer shadow-xs"
                    >
                      Book This Space
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Comparison Table */}
      <section id="pricing-table" className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="max-w-2xl mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
            Rate Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C] mt-1">
            Complete Price & Capacity Schedule
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Standard hourly rates for commercial and private functions. Registered charities and local community organisations are eligible for a 15% discount upon enquiry.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-200 text-xs font-bold text-[#182B1C] uppercase tracking-wider">
                <th className="py-3 px-4">Facility Space</th>
                <th className="py-3 px-4">Max Capacity</th>
                <th className="py-3 px-4">Weekday Rate</th>
                <th className="py-3 px-4">Weekend Rate</th>
                <th className="py-3 px-4">Refundable Deposit</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {facilities.map((fac) => (
                <tr key={fac.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-4 px-4 font-semibold text-[#182B1C]">
                    {fac.name}
                    <span className="block text-xs font-normal text-stone-500">{fac.dimensions || fac.category}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 font-medium text-stone-800">
                      <Users className="w-3.5 h-3.5 text-stone-400" />
                      {fac.capacity} people
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-[#182B1C]">
                    £{fac.hourlyRate} / hr
                  </td>
                  <td className="py-4 px-4 font-bold text-[#437A3B]">
                    £{fac.weekendRate} / hr
                  </td>
                  <td className="py-4 px-4 text-stone-600">
                    £{fac.depositRequired}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleBookFacility(fac.id)}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#B8C053] text-[#14220C] hover:bg-[#c5cd62] transition-colors cursor-pointer"
                    >
                      Book Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Catering & Kitchen Add-on Notice */}
        <div className="mt-8 p-4 rounded-2xl bg-[#FAF9F5] border border-stone-200/80 flex items-start sm:items-center gap-3">
          <Coffee className="w-5 h-5 text-[#B8C053] shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs text-stone-600">
            <strong className="text-[#182B1C]">Commercial Warming Kitchen Add-On:</strong> Available for main hall bookings at £15/hour. Includes food warming ovens, preparation stainless steel counters, hot water boiler, and refrigerator storage.
          </div>
        </div>
      </section>

      {/* Community Ethos & Hire Rules Notice */}
      <section className="rounded-3xl border border-[#273E2C] bg-[#142318] text-white p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#B8C053]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Ethos & Alcohol-Free Policy</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              As an Islamic community centre, strictly no alcohol, gambling, or unlawful activities are permitted on site. All events must align with respectful family standards.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#B8C053]">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Setup & Pack-Down Timing</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Your booked time slot must include adequate time for setting up tables, chairs, AV equipment, and returning the room clean and vacuumed at the finish time.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#B8C053]">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Approval & Payment Confirmation</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              All bookings are submitted as Pending Approval. Our facility manager will review your request, confirm date availability, and issue payment instructions within 24–48 hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
