import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { sampleEvents, EventCategory } from '../data/eventsData';
import { SectionHeading } from '../components/common/SectionHeading';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EventCard } from '../components/events/EventCard';
import { EventFilters } from '../components/events/EventFilters';

interface EventsPageProps {
  onNavigate: (path: string) => void;
  onSelectEvent: (slug: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onNavigate, onSelectEvent }) => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: EventCategory[] = [
    'All',
    'Youth',
    'Sisters',
    'Darul Madinah',
    'Community',
    'Family',
  ];

  const filteredEvents = useMemo(() => {
    return sampleEvents.filter((event) => {
      const matchesCategory =
        selectedCategory === 'All' || event.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 sm:space-y-12">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('/') },
          { label: 'Events & What’s On' },
        ]}
      />

      {/* Header */}
      <section className="space-y-4 max-w-2xl">
        <SectionHeading
          kicker="Center Calendar"
          title="What’s On at the Sheffield Center"
          description="Browse scheduled workshops, youth circles, sisters’ gatherings, open mornings, and community assemblies. All entries below represent sample development fixtures."
        />
      </section>

      {/* Filter and Search Bar */}
      <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <EventFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="w-full rounded-md border border-stone-300 pl-9 pr-3 py-1.5 text-xs text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0E4D34]"
          />
        </div>
      </section>

      {/* Events Listing */}
      <section>
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} onSelect={onSelectEvent} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-stone-200 bg-white p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-stone-800">
              No events match your current filter or search criteria.
            </p>
            <p className="text-xs text-stone-500">
              Try adjusting your category selection or clear your search query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-[#0E4D34] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Note about events data */}
      <div className="rounded-lg bg-stone-100 border border-stone-200 p-4 text-xs text-stone-500">
        <p className="font-semibold text-stone-700">Notice for Organisers:</p>
        <p>
          Event listings are driven by the central structured data catalog. To submit a community event for consideration or request hall availability, please visit our <button onClick={() => onNavigate('/venue-hire')} className="text-[#0E4D34] font-medium underline">Venue Hire</button> section.
        </p>
      </div>
    </div>
  );
};
