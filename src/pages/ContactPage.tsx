import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Car,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { Button } from '../components/common/Button';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ContactForm } from '../components/forms/ContactForm';
import { GoogleMapInteractive } from '../components/common/GoogleMapInteractive';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const mapPlaceUrl = "https://www.google.com/maps/place/Madani+Community+Centre/@53.3974483,-1.418529,17z/data=!3m1!4b1!4m6!3m5!1s0x487977f260864137:0xa8da2b647132fa87!8m2!3d53.3974483!4d-1.418529!16s%2Fg%2F11kmrw06cb";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 sm:space-y-12">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('/') },
          { label: 'Contact Us' },
        ]}
      />

      {/* Header */}
      <section className="space-y-3 max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-brand font-bold text-[#182B1C] tracking-tight">
          Contact Madani Community Centre
        </h1>
        <p className="text-base text-stone-600 leading-relaxed font-normal">
          We are here to assist with school admissions, youth activities, sisters’ gatherings, venue hire, or general community queries in Sheffield.
        </p>
      </section>

      {/* Interactive Google Map Section (Full Width Feature Card) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif-brand font-bold text-[#182B1C]">
              Interactive Location Map
            </h2>
            <p className="text-xs text-stone-500">
              Located on Tinsley Park Road, Sheffield (S9 5DL) · Easily accessible via Sheffield Parkway & M1 J34
            </p>
          </div>
          <a
            href={mapPlaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#FAF9F5] text-[#182B1C] hover:bg-[#F0F4E8] border border-stone-300 transition-colors"
          >
            <span>Open in Google Maps App</span>
            <ExternalLink className="h-3 w-3 text-[#B8C053]" />
          </a>
        </div>

        {/* Embedded Interactive Map */}
        <GoogleMapInteractive heightClass="h-[400px] sm:h-[480px]" />
      </section>

      {/* Two Column Layout on Desktop, 1 Column on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-4">
        {/* Left Column (5 cols): Visit Us, Opening Hours, Directory */}
        <div className="lg:col-span-5 space-y-6">
          {/* Address & Quick Links Card */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053] block mb-1">
                Centre Address
              </span>
              <h3 className="text-xl font-serif-brand font-bold text-stone-900">
                {siteConfig.centreName}
              </h3>
              <p className="text-xs text-stone-500">{siteConfig.regionalSubtitle}</p>
            </div>

            <div className="flex items-start gap-3 text-sm text-stone-700">
              <MapPin className="h-4 w-4 text-[#B8C053] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-stone-900">{siteConfig.address.line1}</p>
                <p>{siteConfig.address.city}</p>
                <p className="font-mono text-xs">{siteConfig.address.postcode}</p>
                <p className="text-xs text-stone-500">{siteConfig.address.country}</p>
              </div>
            </div>

            {/* Directions Action */}
            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="sm"
                fullWidth
                roundedPill={true}
                asLink
                href={siteConfig.links.googleMapsDirections}
                external
                icon={<Navigation className="h-3.5 w-3.5" />}
              >
                Get Driving & Transit Directions
              </Button>
            </div>
          </div>

          {/* Operational Status (Opening Hours & Parking) */}
          <div className="rounded-2xl border border-stone-200 bg-[#FAF9F5] p-6 space-y-4 text-xs text-stone-600">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-semibold text-stone-800">
                <Clock className="h-4 w-4 text-[#B8C053]" />
                <span>Centre Opening Hours</span>
              </div>
              <p className="italic text-stone-500">
                {siteConfig.status.openingHoursPlaceholder}
              </p>
            </div>

            <div className="pt-2 border-t border-stone-200 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-stone-800">
                <Car className="h-4 w-4 text-[#B8C053]" />
                <span>Parking & Public Transport</span>
              </div>
              <p className="italic text-stone-500">
                {siteConfig.status.parkingPlaceholder}
              </p>
            </div>
          </div>

          {/* Department Contact Placeholders */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
              Department Enquiries
            </h4>
            <div className="divide-y divide-stone-100 text-xs text-stone-600">
              <div className="py-2.5 flex items-center justify-between">
                <span className="font-medium text-stone-800">General Enquiries</span>
                <span className="font-mono text-stone-500">{siteConfig.contact.email}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="font-medium text-stone-800">Darul Madinah Primary</span>
                <span className="font-mono text-stone-500">{siteConfig.contact.darulMadinahEmail}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="font-medium text-stone-800">Venue & Hall Hire</span>
                <span className="font-mono text-stone-500">{siteConfig.contact.venueEmail}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="font-medium text-stone-800">Youth Engagement</span>
                <span className="font-mono text-stone-500">{siteConfig.contact.youthEmail}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="font-medium text-stone-800">Sisters’ Activities</span>
                <span className="font-mono text-stone-500">{siteConfig.contact.sistersEmail}</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-400 font-mono pt-1">
              * Note: Official department emails will be activated upon centre launch.
            </p>
          </div>
        </div>

        {/* Right Column (7 cols): Enquiry Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-2xl font-serif-brand font-bold text-stone-900">
                Send Us a Message
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Fill in the form below and select the appropriate enquiry type to reach the right coordinator at Madani Community Centre.
              </p>
            </div>

            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};
