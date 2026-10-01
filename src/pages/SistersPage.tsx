import React from 'react';
import {
  Heart,
  BookOpen,
  Sparkles,
  Coffee,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { sampleEvents } from '../data/eventsData';
import { Button } from '../components/common/Button';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PlaceholderImage } from '../components/common/PlaceholderImage';
import { EventCard } from '../components/events/EventCard';
import { ContactForm } from '../components/forms/ContactForm';

interface SistersPageProps {
  onNavigate: (path: string) => void;
  onSelectEvent: (slug: string) => void;
}

export const SistersPage: React.FC<SistersPageProps> = ({ onNavigate, onSelectEvent }) => {
  const sistersEvents = sampleEvents.filter(
    (e) => e.category === 'Sisters' || e.category === 'Family'
  );

  const pillars = [
    {
      title: 'Dedicated Islamic Learning',
      icon: <BookOpen className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Weekly classes in Tajweed, understanding the Qur’an, prophetic character (Seerah), and everyday fiqh for women.',
    },
    {
      title: 'Wellbeing & Practical Workshops',
      icon: <Sparkles className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Interactive sessions on mental wellbeing, nutrition, creative arts, and personal development led by qualified facilitators.',
    },
    {
      title: 'Community Coffee & Social Circles',
      icon: <Coffee className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Relaxed morning meetups where mothers, students, and elders build lasting friendships and mutual support networks.',
    },
    {
      title: 'Family & Parenting Seminars',
      icon: <Heart className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Guidance and discussion circles on raising resilient children in modern Britain, managing screens, and cultivating a spiritual home.',
    },
    {
      title: 'Charity & Community Projects',
      icon: <Heart className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Leading community outreach, organising aid drives, seasonal gift boxes, and supporting vulnerable families across Sheffield.',
    },
    {
      title: 'Private & Dignified Facilities',
      icon: <Shield className="h-5 w-5 text-[#182B1C]" />,
      desc: 'All programmes are hosted in private, comfortable, and fully equipped spaces designed with dignity and privacy in mind.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12 sm:space-y-16">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('/') },
          { label: "Sisters' Programmes" },
        ]}
      />

      {/* Hero Section */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
              Sisters at Madani Community Centre
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-brand font-bold tracking-tight text-[#182B1C] leading-tight">
              A Warm, Inspiring Space for Sisters
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
              A welcoming community hosting regular educational circles, wellbeing seminars, creative workshops, and family gatherings in Sheffield.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                roundedPill={true}
                onClick={() => {
                  const el = document.getElementById('sisters-updates');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Join Sisters’ Updates
              </Button>
              <Button
                variant="outline"
                size="md"
                roundedPill={true}
                onClick={() => {
                  const el = document.getElementById('sisters-calendar');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Upcoming Gatherings
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <PlaceholderImage
              placeholderKey="sisters-event"
              aspectRatio="16:9"
              alt="Dignified sisters community gathering and lecture setup at Madani Community Centre"
            />
          </div>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
            Our Programmes
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C] mt-1">
            What We Offer for Sisters
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Designed by sisters, for sisters: nurturing spiritual growth, companionship, and local community service.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="p-6 rounded-2xl border border-stone-200/90 bg-white shadow-xs space-y-2.5"
            >
              <div className="p-2.5 rounded-lg bg-[#F0F4E8] w-fit">
                {pillar.icon}
              </div>
              <h3 className="text-base font-bold text-stone-900 font-serif-brand">{pillar.title}</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="sisters-calendar" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
              Calendar
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C] mt-1">
              Upcoming Sisters’ Gatherings
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            roundedPill={true}
            onClick={() => onNavigate('/events')}
          >
            All Events
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sistersEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} onSelect={onSelectEvent} />
          ))}
        </div>
      </section>

      {/* Join Updates Form */}
      <section id="sisters-updates" className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
              Stay Connected
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C]">
              Join Our Sisters’ Updates
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Be the first to hear about upcoming workshops, morning teas, sister halaqahs, and family seminars hosted at Madani Community Centre.
            </p>
            <div className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200 text-xs text-stone-600 space-y-2">
              <p className="font-semibold text-stone-800">Crèche & Family Amenities</p>
              <p>Where designated, specific gatherings offer supervised play areas to allow mothers with young children to participate comfortably.</p>
              <p className="font-mono text-[11px] text-stone-400">Direct contact: {siteConfig.contact.sistersEmail}</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ContactForm initialEnquiryType="Sisters" />
          </div>
        </div>
      </section>
    </div>
  );
};
