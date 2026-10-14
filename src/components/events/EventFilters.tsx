import React from 'react';
import { EventCategory } from '../../data/eventsData';

interface EventFiltersProps {
  selectedCategory: EventCategory;
  onSelectCategory: (cat: EventCategory) => void;
  categories: EventCategory[];
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  categories,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-200/60 rounded-full border border-stone-200">
      {categories.map((category) => {
        const isActive = selectedCategory === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077C8] cursor-pointer ${
              isActive
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};
