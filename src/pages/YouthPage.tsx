import React from 'react';
import {
  Trophy,
  BookOpen,
  Users,
  Briefcase,
  Plane,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { sampleEvents } from '../data/eventsData';
import { Button } from '../components/common/Button';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PlaceholderImage } from '../components/common/PlaceholderImage';
import { EventCard } from '../components/events/EventCard';
import { YouthEnquiryForm } from '../components/forms/YouthEnquiryForm';

interface YouthPageProps {
  onNavigate: (path: string) => void;
  onSelectEvent: (slug: string) => void;
}

export const YouthPage: React.FC<YouthPageProps> = ({ onNavigate, onSelectEvent }) => {
  const youthEvents = sampleEvents.filter(
    (e) => e.category === 'Youth' || e.category === 'Community'
  );

  const activities = [
    {
      title: 'Sports & Active Recreation',
      icon: <Trophy className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Regular 5-a-side football tournaments, badminton sessions, table tennis, and outdoor fitness meetups.',
    },
    {
      title: 'Islamic Study Circles & Halaqahs',
      icon: <BookOpen className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Approachable discussions on daily faith, identity, overcoming doubts, prayer, and character.',
    },
    {
      title: 'Skills & Practical Workshops',
      icon: <Briefcase className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Public speaking masterclasses, CV advice, career mentoring with professionals, and coding basics.',
    },
    {
      title: 'Mentoring & Positive Peer Support',
      icon: <Users className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Connecting secondary and college students with experienced older mentors and university students.',
    },
    {
      title: 'Trips, Hiking & Outdoors',
      icon: <Plane className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Organised Peak District day hikes, team-building retreats, and visits to historical cultural sites.',
    },
    {
      title: 'Volunteering & Community Action',
      icon: <Heart className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Leading food parcel drives, event stewarding, and neighbourhood clean-up projects in Sheffield.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12 sm:space-y-16">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('/') },
          { label: 'Youth Engagement' },
        ]}
      />

      {/* Hero Section */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
              Youth at Madani Community Center
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-brand font-bold tracking-tight text-[#182B1C] leading-tight">
              Faith. Friendship. Skills. Community.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
              A constructive, vibrant space for teenagers, college students, and young adults in Sheffield to develop confidence, build lifelong friendships, and serve the community.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                roundedPill={true}
                onClick={() => {
                  const el = document.getElementById('youth-enquiry');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Join Youth Activities
              </Button>
              <Button
                variant="outline"
                size="md"
                roundedPill={true}
                onClick={() => {
                  const el = document.getElementById('youth-events');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Upcoming Calendar
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <PlaceholderImage
              placeholderKey="youth-activity"
              aspectRatio="16:9"
              alt="Youth participating in active recreational activity at Madani Community Center"
            />
          </div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
            What We Do
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C] mt-1">
            Activities Designed for Young People
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Everything we organise focuses on real connection, practical life skills, and authentic moral values.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((act) => (
            <div
              key={act.title}
              className="p-6 rounded-2xl border border-stone-200/90 bg-white shadow-xs space-y-2.5"
            >
              <div className="p-2.5 rounded-lg bg-[#F0F4E8] w-fit">
                {act.icon}
              </div>
              <h3 className="text-base font-bold text-stone-900 font-serif-brand">{act.title}</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {act.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Youth Events */}
      <section id="youth-events" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
              Upcoming Sessions
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C] mt-1">
              Youth Fixtures & Circles
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
          {youthEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} onSelect={onSelectEvent} />
          ))}
        </div>
      </section>

      {/* Youth Registration Form */}
      <section id="youth-enquiry" className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
              Get Connected
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C]">
              Want to Get Involved?
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Whether you’re interested in football tournaments, study circles, leadership workshops, or volunteering, register below to join our youth updates.
            </p>
            <div className="rounded-xl bg-[#FAF9F5] border border-stone-200 p-5 text-xs text-stone-600 space-y-2">
              <p className="font-semibold text-stone-800">Who is this for?</p>
              <p>Young people aged 11–25 living in Sheffield or nearby areas. All activities are supervised by vetted mentors with enhanced DBS clearance.</p>
              <p className="font-mono text-[11px] text-stone-400">Questions? Email {siteConfig.contact.youthEmail}</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <YouthEnquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
};
