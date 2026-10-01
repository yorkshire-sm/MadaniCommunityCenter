import React, { useRef } from 'react';
import {
  Heart,
  Users,
  Sparkles,
  Calendar,
  Gift,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { Button } from '../components/common/Button';
import { SectionHeading } from '../components/common/SectionHeading';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PlaceholderImage } from '../components/common/PlaceholderImage';
import { VolunteerForm } from '../components/forms/VolunteerForm';

interface GetInvolvedPageProps {
  onNavigate: (path: string) => void;
}

export const GetInvolvedPage: React.FC<GetInvolvedPageProps> = ({ onNavigate }) => {
  const volunteerRef = useRef<HTMLDivElement>(null);

  const scrollToVolunteer = () => {
    volunteerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const waysToHelp = [
    {
      title: 'Volunteer Your Time',
      icon: <Users className="h-5 w-5 text-[#0E4D34]" />,
      desc: 'Join our friendly team of local volunteers who help steward events, mentor youth, assist in the office, or prepare halls.',
    },
    {
      title: 'Support Centre Development',
      icon: <Gift className="h-5 w-5 text-[#0E4D34]" />,
      desc: 'Contribute towards the acquisition and ongoing renovation of the Sheffield building. Every contribution helps build a lasting community legacy.',
    },
    {
      title: 'Spread the Word',
      icon: <Sparkles className="h-5 w-5 text-[#0E4D34]" />,
      desc: 'Tell Sheffield families, neighbours, and friends about Darul Madinah primary school, youth circles, and upcoming community open days.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12 sm:space-y-16">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('/') },
          { label: 'Get Involved & Volunteering' },
        ]}
      />

      {/* Hero Section */}
      <section className="rounded-xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0E4D34]">
              <span className="h-px w-6 bg-[#C59B27]" aria-hidden="true" />
              <span>Community Action & Volunteering</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
              Be Part of Our Sheffield Journey
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
              A thriving community centre relies on dedicated volunteers, skilled supporters, and local families working hand-in-hand. Find out how you can contribute.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button variant="primary" size="md" onClick={scrollToVolunteer}>
                Register as a Volunteer
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => onNavigate('/events')}
              >
                Attend Community Days
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <PlaceholderImage
              placeholderKey="volunteers"
              aspectRatio="16:9"
              alt="Community volunteers collaborating on Sheffield centre projects"
            />
          </div>
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="space-y-8">
        <SectionHeading
          kicker="Ways to Support"
          title="How You Can Help"
          description="Whether you have an hour a month or specialised professional expertise, there are several meaningful ways to support."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {waysToHelp.map((way) => (
            <div
              key={way.title}
              className="p-6 rounded-lg border border-stone-200/90 bg-white shadow-xs space-y-3"
            >
              <div className="p-2.5 rounded-md bg-[#F0F6F2] w-fit">
                {way.icon}
              </div>
              <h3 className="text-base font-bold text-stone-900">{way.title}</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {way.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Volunteer Registration Section */}
      <section ref={volunteerRef} className="rounded-xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <SectionHeading
              kicker="Volunteer Team"
              title="Register Your Interest"
              description="Tell us about your availability, skills, and the areas you would like to help with."
            />
            <div className="rounded-lg bg-[#FAF9F5] border border-stone-200 p-4 text-xs text-stone-600 space-y-2">
              <p className="font-semibold text-stone-800">Safeguarding & DBS Notice</p>
              <p>
                In line with our strict safeguarding policy, any volunteer role involving direct contact with children or vulnerable adults will require an Enhanced DBS check and safer recruitment reference checks.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <VolunteerForm />
          </div>
        </div>
      </section>
    </div>
  );
};
