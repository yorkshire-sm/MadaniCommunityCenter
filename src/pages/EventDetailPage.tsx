import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  Check,
  ArrowLeft,
  UserCheck,
  Mail,
  Shield,
} from 'lucide-react';
import { sampleEvents } from '../data/eventsData';
import { siteConfig } from '../config/siteConfig';
import { Button } from '../components/common/Button';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PlaceholderImage } from '../components/common/PlaceholderImage';
import { EventRegistrationModal } from '../components/events/EventRegistrationModal';

interface EventDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  onSelectEvent: (slug: string) => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  slug,
  onNavigate,
  onSelectEvent,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const event = sampleEvents.find((e) => e.slug === slug) || sampleEvents[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const otherEvents = sampleEvents
    .filter((e) => e.id !== event.id)
    .slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 sm:space-y-12">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('/') },
          { label: 'Events', onClick: () => onNavigate('/events') },
          { label: event.title },
        ]}
      />

      {/* Back button */}
      <div>
        <button
          onClick={() => onNavigate('/events')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#0E4D34] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Events</span>
        </button>
      </div>

      {/* Main Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column (8 cols): Event Overview, Media & Programme */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header & Meta */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-500">
              <span className="text-[#0E4D34] font-semibold">{event.category}</span>
              <span aria-hidden="true">·</span>
              <span>{event.audience}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-stone-400">{event.status}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 leading-tight">
              {event.title}
            </h1>

            <p className="text-base text-stone-600 leading-relaxed font-normal">
              {event.description}
            </p>
          </div>

          {/* Hero Media */}
          <PlaceholderImage
            placeholderKey={event.placeholderKey}
            aspectRatio="16:9"
            alt={event.title}
            className="shadow-xs"
          />

          {/* Full Narrative Description */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xl font-bold text-stone-900">
              About This Programme
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {event.fullDescription}
            </p>
          </div>

          {/* Programme Schedule / Timetable */}
          {event.programmeSchedule && event.programmeSchedule.length > 0 && (
            <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-stone-900">
                Programme Timetable
              </h3>
              <div className="divide-y divide-stone-100">
                {event.programmeSchedule.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-start gap-4 text-xs sm:text-sm">
                    <span className="font-mono font-semibold text-[#0E4D34] shrink-0 w-16">
                      {item.time}
                    </span>
                    <div>
                      <p className="font-medium text-stone-900">{item.item}</p>
                      {item.notes && (
                        <p className="text-stone-500 text-xs mt-0.5">{item.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Speaker or Facilitator details */}
          {event.speakerOrFacilitator && (
            <div className="rounded-xl border border-stone-200 bg-[#FAF9F5] p-5 flex items-start gap-3">
              <UserCheck className="h-5 w-5 text-[#0E4D34] shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <span className="font-semibold text-stone-900 block">Facilitator / Speaker</span>
                <span className="text-stone-600">{event.speakerOrFacilitator}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Operational Details Card & Registration */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 rounded-xl border border-stone-200 bg-white p-6 shadow-xs space-y-6">
            <div className="space-y-4 text-sm text-stone-700">
              <h3 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
                Event Logistics
              </h3>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-[#C59B27] shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-stone-500 uppercase">Date</p>
                  <p className="font-medium text-stone-900">{event.dateFormatted}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-[#C59B27] shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-stone-500 uppercase">Time</p>
                  <p className="font-medium text-stone-900">{event.startTime} – {event.endTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#C59B27] shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-stone-500 uppercase">Location</p>
                  <p className="font-medium text-stone-900">{event.venue}</p>
                  <p className="text-xs text-stone-500">{event.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 text-[#C59B27] shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-stone-500 uppercase">Audience</p>
                  <p className="text-xs text-stone-700">{event.audience}</p>
                </div>
              </div>
            </div>

            {/* Registration CTA */}
            <div className="pt-2 space-y-3">
              {event.registrationRequired ? (
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => setModalOpen(true)}
                >
                  Register for This Event
                </Button>
              ) : (
                <div className="p-3 rounded-md bg-stone-100 text-center text-xs text-stone-600 font-medium">
                  No advance registration needed. Drop-in visitors are warmly welcome.
                </div>
              )}

              {/* Share button */}
              <button
                type="button"
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-700" />
                    <span className="text-emerald-700">Link copied to clipboard!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Share Event Link</span>
                  </>
                )}
              </button>
            </div>

            <div className="border-t border-stone-100 pt-4 text-xs text-stone-500 space-y-1">
              <p className="font-semibold text-stone-700">Need Assistance?</p>
              <p>For questions or accessibility requirements, email: {siteConfig.contact.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <EventRegistrationModal
        event={event}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {/* Other Upcoming Events */}
      <section className="border-t border-stone-200 pt-10 space-y-6">
        <h3 className="text-lg font-bold text-stone-900">
          Other Upcoming Programmes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherEvents.map((oe) => (
            <div
              key={oe.id}
              onClick={() => onSelectEvent(oe.slug)}
              className="p-5 rounded-lg border border-stone-200 bg-white hover:border-[#0E4D34]/40 transition-colors cursor-pointer space-y-2"
            >
              <span className="text-xs font-semibold text-[#0E4D34]">{oe.category}</span>
              <h4 className="text-base font-bold text-stone-900 hover:text-[#0E4D34] transition-colors">
                {oe.title}
              </h4>
              <p className="text-xs text-stone-500">{oe.dateFormatted} · {oe.startTime}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
