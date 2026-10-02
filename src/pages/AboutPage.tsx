import React from 'react';
import { ArrowRight, ShieldCheck, Heart, BookOpen, Users, Award } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { Button } from '../components/common/Button';
import { SectionHeading } from '../components/common/SectionHeading';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PlaceholderImage } from '../components/common/PlaceholderImage';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const coreValues = [
    {
      title: 'Faith & Taqwa',
      icon: <Award className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Grounding all our work in sound Islamic teaching, sincere devotion, and devotion to God.',
    },
    {
      title: 'Academic Diligence',
      icon: <BookOpen className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Nurturing curiosity, intellectual excellence, moral clarity, and lifelong learning.',
    },
    {
      title: 'Inclusive Community',
      icon: <Users className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Cultivating authentic brotherhood, sisterhood, neighbourly harmony, and mutual respect.',
    },
    {
      title: 'Selfless Service',
      icon: <Heart className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Dedicated selfless community service (Khidmat) to the people of Sheffield and surrounding areas.',
    },
    {
      title: 'Dignity & Respect',
      icon: <ShieldCheck className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Upholding human dignity, child safety, courteous conduct, and responsible citizenship.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12 sm:space-y-16">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('/') },
          { label: 'About Us' },
        ]}
      />

      {/* Hero Section */}
      <section className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
          About {siteConfig.centerName}
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-brand font-bold tracking-tight text-[#182B1C] leading-[1.15]">
          A Dedicated Center for Sheffield Communities
        </h1>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
          Madani Community Center has been established by Dawat-e-Islami Sheffield on Tinsley Park Road to create an inspiring, multi-purpose community and educational hub serving children, young people, sisters, and families across South Yorkshire.
        </p>
      </section>

      {/* SECTION: Our Center & Transition */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
              The Building & Transition
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C]">
              Our Building on Tinsley Park Road
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              The building formerly associated with Luqman Academy has entered an exciting new chapter under the stewardship of Dawat-e-Islami. Rather than operating exclusively as an independent school, the site is now being managed as <strong>Madani Community Center</strong> — hosting a balanced range of primary education, community gatherings, youth mentoring, sisters' events, and flexible venue hire.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              Our priority is creating a well-managed, welcoming, and safe environment that local Sheffield residents, parents, and community groups can trust and enjoy for generations to come.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Button variant="primary" size="sm" roundedPill={true} onClick={() => onNavigate('/darul-madinah')}>
                Explore Primary School
              </Button>
              <Button variant="outline" size="sm" roundedPill={true} onClick={() => onNavigate('/venue-hire')}>
                Venue Hire Information
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <PlaceholderImage
              placeholderKey="center-exterior"
              aspectRatio="4:3"
              alt="Madani Community Center Exterior on Tinsley Park Road"
            />
          </div>
        </div>
      </section>

      {/* SECTION: Our Purpose */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
            Our Purpose
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C] mt-1">
            Why Madani Community Center Exists
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            A clear and grounded mission focused on education, family life, and community service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-stone-200 bg-white shadow-xs space-y-3">
            <h3 className="text-base font-bold text-stone-900 font-serif-brand">
              1. Excellence in Primary Education
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Hosting Darul Madinah primary school, where children gain solid foundational numeracy, literacy, and science alongside authentic character development and Islamic values.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-stone-200 bg-white shadow-xs space-y-3">
            <h3 className="text-base font-bold text-stone-900 font-serif-brand">
              2. Inspiring Younger Generations
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Providing positive peer circles, sports, life skills, and mentoring for teenagers and young adults navigating modern British society.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-stone-200 bg-white shadow-xs space-y-3">
            <h3 className="text-base font-bold text-stone-900 font-serif-brand">
              3. Dedicated Spaces for Sisters & Families
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Ensuring sisters have dedicated, private, and high-quality venues for educational circles, wellbeing seminars, social gatherings, and community work.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: Our Values */}
      <section id="values" className="rounded-2xl bg-[#FAF9F5] border border-stone-200 p-6 sm:p-10 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
            Guiding Principles
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C] mt-1">
            Our Core Values
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Five principles that guide our conduct, governance, teaching, and hospitality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {coreValues.map((val) => (
            <div
              key={val.title}
              className="p-5 rounded-xl border border-stone-200/90 bg-white shadow-xs space-y-2 text-left"
            >
              <div className="p-2 rounded-lg bg-[#F0F4E8] w-fit">
                {val.icon}
              </div>
              <h4 className="text-sm font-bold text-stone-900 font-serif-brand">{val.title}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: Serving Sheffield & Surrounding Areas */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <PlaceholderImage
              placeholderKey="community-event"
              aspectRatio="4:3"
              alt="Sheffield Community Gathering at Madani Community Center"
            />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
              Local Commitment
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C]">
              Serving Sheffield & South Yorkshire
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Sheffield is known for its strong community fabric, industrial heritage, and warmth. Located on Tinsley Park Road, Madani Community Center is easily reachable from across Sheffield including Darnall, Burngreave, Firth Park, and neighbouring Rotherham.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              We collaborate with local voluntary organisations, interfaith partners, emergency services, and education authorities to make a tangible positive difference to the local neighbourhood.
            </p>
            <div className="pt-1">
              <Button
                variant="outline"
                size="sm"
                roundedPill={true}
                onClick={() => onNavigate('/contact')}
              >
                Contact Our Community Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="rounded-2xl bg-[#142217] text-white p-8 sm:p-10 text-center space-y-4 border border-[#233827]">
        <h3 className="text-2xl font-serif-brand font-bold">Have Questions About the Center?</h3>
        <p className="text-sm text-stone-200 max-w-lg mx-auto">
          Whether you want to learn more about the school, offer volunteer time, or inquire about hall hire, our team is happy to assist.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Button variant="primary" size="sm" roundedPill={true} onClick={() => onNavigate('/contact')}>
            Get In Touch
          </Button>
          <Button variant="outline-white" size="sm" roundedPill={true} onClick={() => onNavigate('/events')}>
            View Upcoming Events
          </Button>
        </div>
      </section>
    </div>
  );
};
