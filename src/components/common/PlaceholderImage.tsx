import React, { useState } from 'react';

export type PlaceholderKey =
  | 'centre-exterior'
  | 'darul-madinah-classroom'
  | 'children-learning'
  | 'youth-activity'
  | 'youth-workshop'
  | 'sisters-event'
  | 'venue-hall'
  | 'venue-hire-setup'
  | 'community-event'
  | 'islamic-educational-event'
  | 'volunteers'
  | 'building-facilities';

export interface PlaceholderConfig {
  label: string;
  brief: string;
  suggestedFilename: string;
  dominantColor: string;
  accentColor: string;
}

export const placeholderCatalog: Record<PlaceholderKey, PlaceholderConfig> = {
  'centre-exterior': {
    label: 'Main Centre Exterior',
    brief: 'Dignified exterior elevation of the new Sheffield centre building on Tinsley Park Road showing contemporary entrance and signage.',
    suggestedFilename: '/images/placeholders/centre-exterior.jpg',
    dominantColor: '#16281F',
    accentColor: '#C59B27',
  },
  'darul-madinah-classroom': {
    label: 'Darul Madinah Classroom',
    brief: 'Bright, orderly primary school classroom with pupils’ desks, literacy displays, and Islamic values curriculum resources.',
    suggestedFilename: '/images/placeholders/darul-madinah-classroom.jpg',
    dominantColor: '#1A3326',
    accentColor: '#68B388',
  },
  'children-learning': {
    label: 'Children Learning',
    brief: 'Children engaged attentively in structured group learning, reading, or calligraphy activity.',
    suggestedFilename: '/images/placeholders/children-learning.jpg',
    dominantColor: '#203A2E',
    accentColor: '#93C5AA',
  },
  'youth-activity': {
    label: 'Youth Activities',
    brief: 'Young people in Sheffield engaging in sports, teamwork challenges, and informal social mentoring.',
    suggestedFilename: '/images/placeholders/youth-activity.jpg',
    dominantColor: '#182736',
    accentColor: '#60A5FA',
  },
  'youth-workshop': {
    label: 'Youth Workshop & Mentoring',
    brief: 'Interactive seminar setup with presentation screen, notebooks, and young attendees participating in discussion.',
    suggestedFilename: '/images/placeholders/youth-workshop.jpg',
    dominantColor: '#1E2C3D',
    accentColor: '#93C5FD',
  },
  'sisters-event': {
    label: "Sisters' Gathering & Activity",
    brief: "Dignified, welcoming atmosphere for sisters' educational workshop, community coffee morning, or family lecture.",
    suggestedFilename: '/images/placeholders/sisters-event.jpg',
    dominantColor: '#2B2329',
    accentColor: '#D8B4E2',
  },
  'venue-hall': {
    label: 'Main Event Hall',
    brief: 'Spacious hall with polished wood flooring, arranged seating rows, warm ambient lighting, and presentation dais.',
    suggestedFilename: '/images/placeholders/venue-hall.jpg',
    dominantColor: '#222320',
    accentColor: '#D4AF37',
  },
  'venue-hire-setup': {
    label: 'Venue Hire Setup',
    brief: 'Banquet dining or conference workshop tables configured for private community celebrations or corporate training.',
    suggestedFilename: '/images/placeholders/venue-hire-setup.jpg',
    dominantColor: '#252523',
    accentColor: '#E2C26D',
  },
  'community-event': {
    label: 'Community Gathering',
    brief: 'Multi-generational Sheffield community members and families attending an open exhibition, tea, or local forum.',
    suggestedFilename: '/images/placeholders/community-event.jpg',
    dominantColor: '#192C23',
    accentColor: '#A7D7BD',
  },
  'islamic-educational-event': {
    label: 'Islamic Educational Seminar',
    brief: 'Focused educational lecture or Qur’an study circle with students and community attendees.',
    suggestedFilename: '/images/placeholders/islamic-educational-event.jpg',
    dominantColor: '#15241D',
    accentColor: '#D4AF37',
  },
  'volunteers': {
    label: 'Community Volunteers',
    brief: 'Local volunteers preparing the centre, organising community aid boxes, and welcoming guests.',
    suggestedFilename: '/images/placeholders/volunteers.jpg',
    dominantColor: '#1F2922',
    accentColor: '#86EFAC',
  },
  'building-facilities': {
    label: 'Building Facilities & Suites',
    brief: 'Clean corridors, modern meeting suites, prayer and ablution areas, and secure visitor entrance.',
    suggestedFilename: '/images/placeholders/building-facilities.jpg',
    dominantColor: '#1F2224',
    accentColor: '#CBD5E1',
  },
};

interface PlaceholderImageProps {
  placeholderKey: PlaceholderKey | string;
  aspectRatio?: '16:9' | '4:3' | '3:2' | '1:1';
  alt: string;
  className?: string;
  customBrief?: string;
  src?: string;
  priority?: boolean;
}

export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  placeholderKey,
  aspectRatio = '16:9',
  alt,
  className = '',
  customBrief,
  src,
  priority = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const config: PlaceholderConfig =
    placeholderCatalog[placeholderKey as PlaceholderKey] || {
      label: placeholderKey.replace(/-/g, ' ').toUpperCase(),
      brief: customBrief || 'Editorial photograph representing centre activity and facilities.',
      suggestedFilename: `/images/placeholders/${placeholderKey}.jpg`,
      dominantColor: '#16281F',
      accentColor: '#C59B27',
    };

  const ratioClass = {
    '16:9': 'aspect-[16/9]',
    '4:3': 'aspect-[4/3]',
    '3:2': 'aspect-[3/2]',
    '1:1': 'aspect-square',
  }[aspectRatio];

  const dimensionsLabel = {
    '16:9': '1600 × 900',
    '4:3': '800 × 600',
    '3:2': '1200 × 800',
    '1:1': '800 × 800',
  }[aspectRatio];

  // If a real image path is passed and has not errored, render real image with fallback
  if (src && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-stone-100 ${ratioClass} ${className}`}>
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
      </div>
    );
  }

  return (
    <figure
      className={`group relative overflow-hidden rounded-lg border border-stone-200/80 bg-stone-900 text-stone-100 shadow-xs select-none ${ratioClass} ${className}`}
      style={{
        background: `radial-gradient(ellipse at 70% 30%, ${config.dominantColor}EE 0%, ${config.dominantColor} 60%, #0F1713 100%)`,
      }}
      aria-label={`Photo placeholder: ${alt}`}
    >
      {/* Subtle architectural hairline grid & light motif */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-15"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <pattern id={`grid-${placeholderKey}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${placeholderKey})`} />
      </svg>

      {/* Soft warm aperture highlight in corner */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full blur-2xl opacity-20"
        style={{ backgroundColor: config.accentColor }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex h-full w-full flex-col justify-between p-4 sm:p-6 text-left">
        {/* Top Header: Unboxed metadata */}
        <div className="flex items-center justify-between gap-2 text-xs font-medium text-stone-300">
          <span className="flex items-center gap-1.5 tracking-wider uppercase text-[11px] text-stone-400">
            <svg
              className="h-3.5 w-3.5 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            Photo Placeholder
          </span>
          <span className="text-[11px] text-stone-400 tracking-wider">
            {aspectRatio} · {dimensionsLabel}
          </span>
        </div>

        {/* Center/Bottom: Descriptive Brief */}
        <div className="mt-auto space-y-1.5 pt-4">
          <div className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: config.accentColor }}
              aria-hidden="true"
            />
            {config.label}
          </div>
          <p className="line-clamp-2 text-xs leading-relaxed text-stone-300/90 font-normal">
            {customBrief || config.brief}
          </p>
          <div className="pt-1 text-[11px] text-stone-400 font-mono">
            Target file: <code className="text-stone-300">{config.suggestedFilename}</code>
          </div>
        </div>
      </div>
    </figure>
  );
};
