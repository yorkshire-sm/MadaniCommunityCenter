import React, { useRef } from 'react';
import {
  Users,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';
import { venueSpaces, suitableEventTypes } from '../data/spacesData';
import { siteConfig } from '../config/siteConfig';
import { Button } from '../components/common/Button';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PlaceholderImage } from '../components/common/PlaceholderImage';
import { VenueEnquiryForm } from '../components/forms/VenueEnquiryForm';

interface VenueHirePageProps {
  onNavigate: (path: string) => void;
}

export const VenueHirePage: React.FC<VenueHirePageProps> = ({ onNavigate }) => {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12 sm:space-y-16">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('/') },
          { label: 'Venue Hire' },
        ]}
      />

      {/* Hero Section */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
              Community & Private Hire
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-brand font-bold tracking-tight text-[#182B1C] leading-tight">
              Venue Hire at Madani Centre
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
              Flexible halls, meeting rooms, and classroom spaces for community events, seminars, workshops, and suitable private functions on Tinsley Park Road in Sheffield.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button variant="primary" size="md" roundedPill={true} onClick={scrollToForm}>
                Check Availability
              </Button>
              <Button
                variant="outline"
                size="md"
                roundedPill={true}
                onClick={() => {
                  const el = document.getElementById('spaces-list');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Available Spaces
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <PlaceholderImage
              placeholderKey="venue-hall"
              aspectRatio="16:9"
              alt="Main Event Hall ready for conference or banquet at Madani Community Centre"
            />
          </div>
        </div>
      </section>

      {/* Spaces Breakdown */}
      <section id="spaces-list" className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
            Our Spaces
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C] mt-1">
            Available Rooms & Halls
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Explore our range of spaces suitable for various group sizes and layout requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {venueSpaces.map((space) => (
            <div
              key={space.id}
              className="flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-white shadow-xs overflow-hidden"
            >
              <PlaceholderImage
                placeholderKey={space.placeholderKey}
                aspectRatio="16:9"
                alt={space.name}
              />

              <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-bold text-[#182B1C] uppercase tracking-wider">{space.category}</span>
                    <span className="font-mono text-[11px] text-stone-400">{space.capacityText}</span>
                  </div>

                  <h3 className="text-xl font-serif-brand font-bold text-stone-900">{space.name}</h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {space.description}
                  </p>

                  <div className="pt-2 border-t border-stone-100 space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-stone-800">Ideal For:</span>{' '}
                      <span className="text-stone-600">{space.idealFor.join(' · ')}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-stone-800">Layout Options:</span>{' '}
                      <span className="text-stone-600">{space.layoutOptions.join(', ')}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-stone-800">Accessibility:</span>{' '}
                      <span className="text-stone-500 italic">{space.accessibilityNote}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-stone-800">Hire Rates:</span>{' '}
                      <span className="text-stone-600">{space.pricingText}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    roundedPill={true}
                    onClick={scrollToForm}
                  >
                    Enquire About This Room
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Suitable For & Guidelines */}
      <section className="rounded-2xl bg-[#FAF9F5] border border-stone-200 p-6 sm:p-10 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
            Booking Guidelines
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C] mt-1">
            Suitable Events & Centre Ethos
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            As a family-oriented Islamic community centre, we welcome respectful events that align with our core values.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          <div className="p-6 rounded-xl bg-white border border-stone-200 space-y-3">
            <h4 className="text-base font-serif-brand font-bold text-stone-900 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#B8C053]" />
              Suitable Occasions
            </h4>
            <ul className="text-xs text-stone-600 space-y-2">
              {suitableEventTypes.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#182B1C]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-white border border-stone-200 space-y-3">
            <h4 className="text-base font-serif-brand font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#B8C053]" />
              Centre Ethos & Conditions
            </h4>
            <ul className="text-xs text-stone-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B8C053] mt-1 shrink-0" />
                <span>Strictly alcohol-free, smoke-free, and vape-free premises across all indoor and outdoor grounds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B8C053] mt-1 shrink-0" />
                <span>Respectful modesty and sound levels appropriate for a residential Sheffield neighbourhood.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B8C053] mt-1 shrink-0" />
                <span>All private food and catering must be fully Halal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B8C053] mt-1 shrink-0" />
                <span>Hirers are responsible for basic clearance and leaving spaces in good order.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Venue Gallery */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
            Gallery
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C] mt-1">
            Facility Impressions
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PlaceholderImage
            placeholderKey="venue-hire-setup"
            aspectRatio="4:3"
            alt="Venue Hire Dining Setup at Madani Community Centre"
          />
          <PlaceholderImage
            placeholderKey="venue-hall"
            aspectRatio="4:3"
            alt="Main Hall Arrangement"
          />
          <PlaceholderImage
            placeholderKey="building-facilities"
            aspectRatio="4:3"
            alt="Meeting Suite & Reception at Madani Community Centre"
          />
        </div>
      </section>

      {/* Enquiry Form */}
      <section ref={formRef} className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
              Booking Enquiry
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C]">
              Make a Venue Enquiry
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
              Complete the form below to register your event requirements with our Sheffield facilities coordinator. We will verify date availability and provide transparent quote options.
            </p>
          </div>
          <div className="pt-2">
            <VenueEnquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
};
