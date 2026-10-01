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

export interface ImageConfig {
  label: string;
  brief: string;
  imageUrl: string;
  dominantColor: string;
  accentColor: string;
}

export const imageCatalog: Record<PlaceholderKey, ImageConfig> = {
  'centre-exterior': {
    label: 'Madani Community Centre Building',
    brief: 'Main entrance and exterior elevation of the centre building on Tinsley Park Road in Sheffield.',
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#16281F',
    accentColor: '#B8C053',
  },
  'darul-madinah-classroom': {
    label: 'Darul Madinah Primary Classroom',
    brief: 'Bright primary school classroom environment with student desks, books, and Islamic curriculum resources.',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#1A3326',
    accentColor: '#B8C053',
  },
  'children-learning': {
    label: 'Primary Pupils Engaged in Learning',
    brief: 'Children engaged attentively in structured group reading, phonics, and writing activities.',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#203A2E',
    accentColor: '#93C5AA',
  },
  'youth-activity': {
    label: 'Youth Sports & Recreation',
    brief: 'Young people in Sheffield participating in active sports, fitness challenges, and outdoor team recreation.',
    imageUrl: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#182736',
    accentColor: '#B8C053',
  },
  'youth-workshop': {
    label: 'Youth Workshop & Mentoring',
    brief: 'Interactive seminar and study circle with young students collaborating on laptops and project discussions.',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#1E2C3D',
    accentColor: '#93C5FD',
  },
  'sisters-event': {
    label: "Sisters' Gathering & Activity",
    brief: "Welcoming and dignified atmosphere for sisters' educational workshops, coffee mornings, and family seminars.",
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#2B2329',
    accentColor: '#D8B4E2',
  },
  'venue-hall': {
    label: 'Main Multi-Purpose Event Hall',
    brief: 'Spacious hall with warm ambient lighting, conference rows, and audio-visual stage setup.',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#222320',
    accentColor: '#B8C053',
  },
  'venue-hire-setup': {
    label: 'Venue Hire Dining & Banquet Setup',
    brief: 'Banquet and conference tables arranged for private community celebrations and corporate training.',
    imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#252523',
    accentColor: '#B8C053',
  },
  'community-event': {
    label: 'Sheffield Community Gathering',
    brief: 'Multi-generational Sheffield community members and families attending an open forum and community tea.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#192C23',
    accentColor: '#B8C053',
  },
  'islamic-educational-event': {
    label: 'Islamic Educational Seminar',
    brief: 'Focused educational lecture and Qur’an study circle with students and community attendees.',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#15241D',
    accentColor: '#B8C053',
  },
  'volunteers': {
    label: 'Community Volunteers in Action',
    brief: 'Local volunteers preparing the centre, organising community aid boxes, and welcoming guests.',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#1F2922',
    accentColor: '#B8C053',
  },
  'building-facilities': {
    label: 'Reception & Meeting Suites',
    brief: 'Clean corridors, modern meeting suites, prayer areas, and welcoming reception at Madani Centre.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
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
  const [imgLoaded, setImgLoaded] = useState(false);

  const config: ImageConfig =
    imageCatalog[placeholderKey as PlaceholderKey] || {
      label: placeholderKey.replace(/-/g, ' ').toUpperCase(),
      brief: customBrief || 'Editorial photograph representing centre activity and facilities.',
      imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80',
      dominantColor: '#16281F',
      accentColor: '#B8C053',
    };

  const imageToUse = src || config.imageUrl;

  const ratioClass = {
    '16:9': 'aspect-[16/9]',
    '4:3': 'aspect-[4/3]',
    '3:2': 'aspect-[3/2]',
    '1:1': 'aspect-square',
  }[aspectRatio];

  if (!imgError && imageToUse) {
    return (
      <div
        className={`group relative overflow-hidden rounded-xl border border-stone-200/90 bg-stone-900 shadow-xs ${ratioClass} ${className}`}
      >
        {/* Placeholder skeleton while loading */}
        {!imgLoaded && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{ backgroundColor: config.dominantColor }}
          />
        )}

        <img
          src={imageToUse}
          alt={alt}
          referrerPolicy="no-referrer"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.03] ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Subtle dark gradient scrim at bottom to ensure photo feel & caption readability if text overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Minimal dignified photo credit / category caption badge */}
        <div className="absolute bottom-2.5 left-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide bg-black/60 text-white backdrop-blur-xs">
            {config.label}
          </span>
        </div>
      </div>
    );
  }

  // Graceful visual fallback if network ever fails
  return (
    <figure
      className={`group relative overflow-hidden rounded-xl border border-stone-200/90 bg-stone-900 text-stone-100 shadow-xs select-none ${ratioClass} ${className}`}
      style={{
        background: `radial-gradient(ellipse at 70% 30%, ${config.dominantColor}EE 0%, ${config.dominantColor} 60%, #0F1713 100%)`,
      }}
      aria-label={alt}
    >
      <div
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full blur-2xl opacity-25"
        style={{ backgroundColor: config.accentColor }}
      />
      <div className="relative z-10 flex h-full w-full flex-col justify-end p-4 text-left">
        <div className="space-y-1">
          <div className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: config.accentColor }}
              aria-hidden="true"
            />
            {config.label}
          </div>
          <p className="line-clamp-2 text-xs leading-relaxed text-stone-300 font-normal">
            {customBrief || config.brief}
          </p>
        </div>
      </div>
    </figure>
  );
};
