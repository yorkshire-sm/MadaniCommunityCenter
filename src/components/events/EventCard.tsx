import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { EventItem } from '../../data/eventsData';
import { PlaceholderImage } from '../common/PlaceholderImage';

interface EventCardProps {
  event: EventItem;
  onSelect: (slug: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:border-[#00A896] hover:shadow-md transition-all duration-300">
      {/* Event Media / Placeholder */}
      <div className="relative overflow-hidden cursor-pointer" onClick={() => onSelect(event.slug)}>
        <PlaceholderImage
          placeholderKey={event.placeholderKey}
          aspectRatio="16:9"
          alt={event.title}
          className="group-hover:scale-[1.02] transition-transform duration-300"
        />
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-6 space-y-4">
        <div className="space-y-2.5">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="text-[#0B2545] font-bold uppercase tracking-wider">{event.category}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{event.audience}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-400 font-mono text-[11px]">{event.status}</span>
          </div>

          <h3
            onClick={() => onSelect(event.slug)}
            className="text-lg font-serif-brand font-bold tracking-tight text-slate-900 group-hover:text-[#0077C8] transition-colors cursor-pointer leading-snug"
          >
            {event.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Operational Strip */}
        <div className="border-t border-slate-100 pt-3.5 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-[#00A896] shrink-0" aria-hidden="true" />
            <span className="font-semibold text-slate-800">{event.dateFormatted}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span>{event.startTime} – {event.endTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Action Button: Rounded Pill */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => onSelect(event.slug)}
            className="inline-flex w-full items-center justify-between rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-[#0B2545] hover:text-white hover:border-[#0B2545] transition-all cursor-pointer"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
};
