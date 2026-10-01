import React from 'react';
import {
  ArrowRight,
  GraduationCap,
  Users,
  Building,
  HeartHandshake,
  CheckCircle,
  ExternalLink,
  Shield,
  Compass,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { sampleEvents } from '../data/eventsData';
import { centreFacilities } from '../data/facilitiesData';
import { Button } from '../components/common/Button';
import { PlaceholderImage } from '../components/common/PlaceholderImage';
import { EventCard } from '../components/events/EventCard';
import { LuqmanHeroBackdrop } from '../components/home/LuqmanHeroBackdrop';
import { GoogleMapInteractive } from '../components/common/GoogleMapInteractive';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectEvent: (slug: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectEvent }) => {
  const upcomingEvents = sampleEvents.slice(0, 3);

  const facilityIcons: Record<string, React.ReactNode> = {
    Building: <Building className="h-5 w-5 text-[#182B1C]" />,
    GraduationCap: <GraduationCap className="h-5 w-5 text-[#182B1C]" />,
    Users: <Users className="h-5 w-5 text-[#182B1C]" />,
    HeartHandshake: <HeartHandshake className="h-5 w-5 text-[#182B1C]" />,
    Calendar: <Calendar className="h-5 w-5 text-[#182B1C]" />,
    Compass: <Compass className="h-5 w-5 text-[#182B1C]" />,
    Shield: <Shield className="h-5 w-5 text-[#182B1C]" />,
    BookOpen: <BookOpen className="h-5 w-5 text-[#182B1C]" />,
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* =========================================================================
          HERO SECTION (LUQMAN ACADEMY STYLE)
          ========================================================================= */}
      <section className="relative -mt-4 bg-[#142016] text-white">
        {/* Curved Container with signature Luqman Academy bottom-right scoop */}
        <div className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center overflow-hidden hero-scoop shadow-2xl">
          {/* Atmospheric photo background in warm amber / forest tones */}
          <LuqmanHeroBackdrop />

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 w-full">
            <div className="max-w-3xl ml-auto text-left space-y-6 lg:pr-8">
              {/* Kicker in Olive-Chartreuse */}
              <div className="inline-block">
                <span className="text-sm sm:text-base font-semibold text-[#B8C053] tracking-wide block">
                  Madani Community Centre is an education & community hub in Sheffield
                </span>
              </div>

              {/* Bold Editorial Serif Display Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-brand font-bold tracking-tight text-white leading-[1.12]">
                Integrating academic excellence with Islamic teachings
              </h1>

              {/* Supporting Subtitle */}
              <p className="text-base sm:text-lg text-stone-200/90 leading-relaxed font-normal max-w-2xl">
                Our centre fosters a nurturing, inclusive, and respectful atmosphere where students, youth, sisters, and families are encouraged to develop their character, confidence, and leadership skills.
              </p>

              {/* Action Buttons (Pill styling matching Luqman Academy) */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Button
                  variant="primary"
                  size="lg"
                  roundedPill={true}
                  onClick={() => onNavigate('/darul-madinah')}
                >
                  Apply Now
                </Button>

                <Button
                  variant="outline-white"
                  size="lg"
                  roundedPill={true}
                  onClick={() => {
                    const el = document.getElementById('welcome');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  icon={<ArrowRight className="h-4 w-4" />}
                >
                  Explore the Centre
                </Button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#B8C053]" />
                  <span>Darul Madinah Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#B8C053]" />
                  <span>Youth & Sisters Hub</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#B8C053]" />
                  <span>Halls & Event Spaces</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: "WELCOME TO MADANI COMMUNITY CENTRE"
          ========================================================================= */}
      <section id="welcome" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#B8C053]">
            Dawat-e-Islami Sheffield
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-brand font-bold text-[#182B1C] tracking-tight">
            Welcome To Madani Community Centre
          </h2>
          <div className="w-16 h-1 bg-[#B8C053] mx-auto rounded-full" />
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal pt-2">
            Established on Tinsley Park Road in Sheffield, Madani Community Centre brings together high-standard primary education, youth engagement, sisters' programmes, and multi-purpose community facilities under one roof. Working under the guidance of Dawat-e-Islami, our centre provides an inspiring environment that pairs academic ambition with authentic Islamic values.
          </p>
        </div>

        {/* 4 Core Pillars Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:border-[#B8C053] hover:shadow-md transition-all text-center space-y-3 group">
            <div className="h-12 w-12 rounded-full bg-[#F0F4E8] text-[#182B1C] flex items-center justify-center mx-auto group-hover:bg-[#B8C053] transition-colors">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif-brand">
              Primary Education
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Home to Darul Madinah primary school, offering an exceptional academic foundation alongside Islamic ethos.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigate('/darul-madinah')}
                className="text-xs font-semibold text-[#182B1C] hover:text-[#A5AD3F] transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                Learn More →
              </button>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:border-[#B8C053] hover:shadow-md transition-all text-center space-y-3 group">
            <div className="h-12 w-12 rounded-full bg-[#F0F4E8] text-[#182B1C] flex items-center justify-center mx-auto group-hover:bg-[#B8C053] transition-colors">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif-brand">
              Youth Activities
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Sports, study circles, skills workshops, and mentoring circles for teenagers and young adults in Sheffield.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigate('/youth')}
                className="text-xs font-semibold text-[#182B1C] hover:text-[#A5AD3F] transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                Explore Youth →
              </button>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:border-[#B8C053] hover:shadow-md transition-all text-center space-y-3 group">
            <div className="h-12 w-12 rounded-full bg-[#F0F4E8] text-[#182B1C] flex items-center justify-center mx-auto group-hover:bg-[#B8C053] transition-colors">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif-brand">
              Sisters' Programmes
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Dedicated gatherings, Islamic classes, wellbeing workshops, and family sessions in a private, dignified space.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigate('/sisters')}
                className="text-xs font-semibold text-[#182B1C] hover:text-[#A5AD3F] transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                View Programmes →
              </button>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:border-[#B8C053] hover:shadow-md transition-all text-center space-y-3 group">
            <div className="h-12 w-12 rounded-full bg-[#F0F4E8] text-[#182B1C] flex items-center justify-center mx-auto group-hover:bg-[#B8C053] transition-colors">
              <Building className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif-brand">
              Venue & Hall Hire
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Flexible halls, meeting rooms, and classroom spaces available for hire for community events and functions.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigate('/venue-hire')}
                className="text-xs font-semibold text-[#182B1C] hover:text-[#A5AD3F] transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                Hire Spaces →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          DARUL MADINAH PRIMARY FEATURE SECTION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Visual half */}
            <div className="lg:col-span-6 bg-stone-900 relative min-h-[340px]">
              <PlaceholderImage
                placeholderKey="darul-madinah-classroom"
                aspectRatio="16:9"
                alt="Darul Madinah Primary School Classroom at Madani Community Centre"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Content half */}
            <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
                  Primary Education
                </span>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-brand font-bold tracking-tight text-[#182B1C] leading-tight">
                  Darul Madinah Primary School
                </h2>

                <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
                  Providing children with a strong academic foundation alongside Islamic values, character development, and a nurturing learning environment.
                </p>

                <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700 pt-1">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-[#B8C053] shrink-0" />
                    <span>Broad & balanced National Curriculum subjects</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-[#B8C053] shrink-0" />
                    <span>Integrated Tajweed, Islamic studies, and moral etiquette</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-[#B8C053] shrink-0" />
                    <span>Small class sizes with high teacher engagement</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  roundedPill={true}
                  onClick={() => onNavigate('/darul-madinah')}
                >
                  Admissions Information
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  roundedPill={true}
                  onClick={() => onNavigate('/darul-madinah#admissions')}
                >
                  Enquire Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          UPCOMING EVENTS & WHAT'S ON
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
              What's On
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-brand font-bold text-[#182B1C] mt-1">
              Events at Madani Centre
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              Join upcoming seminars, youth gatherings, open mornings, and community programmes on Tinsley Park Road.
            </p>
          </div>
          <div className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              roundedPill={true}
              onClick={() => onNavigate('/events')}
              icon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              View All Events
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} onSelect={onSelectEvent} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          YOUTH & SISTERS DUAL SPOTLIGHT
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Youth Feature */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
                Youth Development
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C]">
                A Space for Young People
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Empowering the next generation with faith, friendship, leadership, and practical skills through weekly gatherings, football tournaments, study circles, and community volunteering.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs text-stone-700">
                <span className="p-2.5 rounded-lg bg-[#FAF9F5] border border-stone-200/80">· Youth Circles</span>
                <span className="p-2.5 rounded-lg bg-[#FAF9F5] border border-stone-200/80">· Sports & Fitness</span>
                <span className="p-2.5 rounded-lg bg-[#FAF9F5] border border-stone-200/80">· Skills Workshops</span>
                <span className="p-2.5 rounded-lg bg-[#FAF9F5] border border-stone-200/80">· Islamic Learning</span>
                <span className="p-2.5 rounded-lg bg-[#FAF9F5] border border-stone-200/80">· Mentoring</span>
                <span className="p-2.5 rounded-lg bg-[#FAF9F5] border border-stone-200/80">· Day Trips</span>
              </div>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  roundedPill={true}
                  onClick={() => onNavigate('/youth')}
                  icon={<ArrowRight className="h-4 w-4" />}
                >
                  Explore Youth
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <PlaceholderImage
                placeholderKey="youth-workshop"
                aspectRatio="16:9"
                alt="Youth workshop and mentoring circle at Madani Community Centre"
              />
            </div>
          </div>
        </div>

        {/* Sisters Feature */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <PlaceholderImage
                placeholderKey="sisters-event"
                aspectRatio="16:9"
                alt="Sisters community gathering and lecture setup"
              />
            </div>

            <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
                Sisters & Families
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C]">
                Programmes for Sisters
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Dedicated activities, educational lectures, wellbeing sessions, and supportive social meetups organised in a comfortable, welcoming, and dignified environment.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs text-stone-700">
                <span className="p-2.5 rounded-lg bg-[#FAF9F5] border border-stone-200/80">· Islamic Learning</span>
                <span className="p-2.5 rounded-lg bg-[#FAF9F5] border border-stone-200/80">· Coffee Mornings</span>
                <span className="p-2.5 rounded-lg bg-[#FAF9F5] border border-stone-200/80">· Family Seminars</span>
                <span className="p-2.5 rounded-lg bg-[#FAF9F5] border border-stone-200/80">· Parenting Guidance</span>
                <span className="p-2.5 rounded-lg bg-[#FAF9F5] border border-stone-200/80">· Wellbeing Circles</span>
                <span className="p-2.5 rounded-lg bg-[#FAF9F5] border border-stone-200/80">· Community Aid</span>
              </div>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  roundedPill={true}
                  onClick={() => onNavigate('/sisters')}
                  icon={<ArrowRight className="h-4 w-4" />}
                >
                  View Sisters' Activities
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VENUE HIRE SPOTLIGHT
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-stone-200 bg-[#FAF9F5] p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
                Facility Hire
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-brand font-bold text-[#182B1C]">
                A Venue for Your Event
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed font-normal">
                Flexible spaces in Sheffield for suitable community events, meetings, educational workshops, and private functions.
              </p>

              <div className="space-y-2 text-xs text-stone-700">
                <p className="font-semibold text-stone-900">Suitable For:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span>· Community Gatherings</span>
                  <span>· Educational Seminars</span>
                  <span>· Training Sessions</span>
                  <span>· Family Milestones (Ethos-compliant)</span>
                  <span>· Committee Meetings</span>
                  <span>· Charity Fundraisers</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="dark"
                  size="md"
                  roundedPill={true}
                  onClick={() => onNavigate('/venue-hire')}
                  icon={<ArrowRight className="h-4 w-4" />}
                >
                  Make a Venue Enquiry
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <PlaceholderImage
                placeholderKey="venue-hall"
                aspectRatio="16:9"
                alt="Main Event Hall at Madani Community Centre"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FACILITIES SECTION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
            Building Facilities
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-brand font-bold text-[#182B1C] mt-1">
            Our Centre Facilities
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Overview of key spaces and amenities within the Tinsley Park Road building.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {centreFacilities.map((fac) => (
            <div
              key={fac.id}
              className="p-5 rounded-2xl border border-stone-200/90 bg-white shadow-xs space-y-2.5 hover:border-[#B8C053] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-[#F0F4E8] flex items-center justify-center">
                  {facilityIcons[fac.iconName] || <Building className="h-5 w-5 text-[#182B1C]" />}
                </div>
                <span className="text-[11px] font-mono text-stone-400">
                  {fac.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-stone-900">
                {fac.name}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {fac.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          COMMUNITY CTA SECTION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#142217] text-white p-8 sm:p-12 text-center shadow-lg relative overflow-hidden border border-[#233827]">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B8C053]">
              Get Involved
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-brand font-bold text-white leading-tight">
              Be Part of Madani Community Centre
            </h2>
            <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-normal">
              Whether by attending upcoming activities, volunteering your skills, helping organise local initiatives, or enrolling children at Darul Madinah, there are many ways to get involved in Sheffield.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Button
                variant="primary"
                size="md"
                roundedPill={true}
                onClick={() => onNavigate('/get-involved')}
              >
                Volunteer With Us
              </Button>
              <Button
                variant="outline-white"
                size="md"
                roundedPill={true}
                onClick={() => onNavigate('/contact')}
              >
                Contact Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE GOOGLE MAP & LOCATION SECTION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
                Location & Accessibility
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C] mt-1">
                Find Us on Tinsley Park Road
              </h2>
              <p className="text-sm text-stone-600 mt-0.5">
                Sheffield, S9 5DL · Easily accessible via car, bus routes, and local transit.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                roundedPill={true}
                asLink
                href={siteConfig.links.googleMapsDirections}
                external
                icon={<ExternalLink className="h-3.5 w-3.5" />}
              >
                Get Directions
              </Button>
            </div>
          </div>

          {/* Interactive Google Map */}
          <GoogleMapInteractive heightClass="h-[360px] sm:h-[420px]" />
        </div>
      </section>
    </div>
  );
};
