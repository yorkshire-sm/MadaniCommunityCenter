import React, { useRef } from 'react';
import {
  GraduationCap,
  BookOpen,
  Heart,
  Shield,
  Calendar,
  FileText,
  Mail,
  CheckCircle,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { Button } from '../components/common/Button';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PlaceholderImage } from '../components/common/PlaceholderImage';
import { AdmissionsEnquiryForm } from '../components/forms/AdmissionsEnquiryForm';

interface DarulMadinahPageProps {
  onNavigate: (path: string) => void;
}

export const DarulMadinahPage: React.FC<DarulMadinahPageProps> = ({ onNavigate }) => {
  const admissionsRef = useRef<HTMLDivElement>(null);

  const scrollToAdmissions = () => {
    admissionsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const approaches = [
    {
      title: 'Academic Excellence',
      icon: <GraduationCap className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Teaching core subjects including English reading, writing, mathematics, and science with dedicated teachers and small class sizes.',
    },
    {
      title: 'Islamic Values',
      icon: <BookOpen className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Integrating moral education, prophetic etiquette (Sunnah), daily supplications, and Qur’an recitation into the daily school rhythm.',
    },
    {
      title: 'Character Development',
      icon: <Heart className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Fostering honesty, humility, perseverance, compassion, and respect for all members of British society.',
    },
    {
      title: 'Safe & Supportive Environment',
      icon: <Shield className="h-5 w-5 text-[#182B1C]" />,
      desc: 'Rigorous child protection safeguarding policies, dedicated pastoral care, and secure premises at Madani Community Center.',
    },
  ];

  const schoolLifeAreas = [
    { title: 'Core Primary Learning', desc: 'National curriculum subjects structured for conceptual understanding, inquiry, and creativity.' },
    { title: 'Islamic Studies & Hadith', desc: 'Age-appropriate understanding of faith, prophetic biography (Seerah), and practical worship.' },
    { title: 'Qur’an & Tajweed', desc: 'Careful pronunciation, memorisation of short surahs, and reverent connection to scripture.' },
    { title: 'Arabic Language Basics', desc: 'Foundational vocabulary, script literacy, and conversational awareness.' },
    { title: 'Physical Activity & Sport', desc: 'Active play, physical coordination, team games, and physical wellbeing.' },
    { title: 'Personal & Social Development', desc: 'Promoting responsibility, kindness, cooperation, and good citizenship.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12 sm:space-y-16">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('/') },
          { label: 'Darul Madinah Primary School' },
        ]}
      />

      {/* HERO SECTION */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
              Dawat-e-Islami Educational Network
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-brand font-bold tracking-tight text-[#182B1C] leading-tight">
              Darul Madinah Primary School, Sheffield
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
              Based at Madani Community Center on Tinsley Park Road: providing children with a strong academic foundation alongside Islamic values, character development, and a nurturing learning environment.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button variant="primary" size="md" roundedPill={true} onClick={scrollToAdmissions}>
                Admissions Enquiry
              </Button>
              <Button
                variant="outline"
                size="md"
                roundedPill={true}
                onClick={() => onNavigate('/contact')}
              >
                Book a Visit
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <PlaceholderImage
              placeholderKey="darul-madinah-classroom"
              aspectRatio="16:9"
              alt="Darul Madinah Primary Classroom Environment at Madani Community Center"
            />
          </div>
        </div>
      </section>

      {/* WELCOME STATEMENT */}
      <section className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
          Headteacher Welcome
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C]">
          Welcome to Darul Madinah Sheffield
        </h2>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Welcome to Darul Madinah Sheffield, proudly established at Madani Community Center on Tinsley Park Road. Our school aims to offer children an inspiring educational journey where academic ambition is paired with timeless moral character.
        </p>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          As part of the international Darul Madinah educational system, our Sheffield campus is committed to high standards of pedagogy, safe learning environments, and close partnership with parents. We nurture confident, curious learners who take pride in their Islamic identity while flourishing in modern British society.
        </p>
      </section>

      {/* OUR APPROACH */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
            Educational Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C] mt-1">
            Our Approach to Learning
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Four foundations supporting the holistic growth of every child in our care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {approaches.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl border border-stone-200/90 bg-white shadow-xs space-y-3"
            >
              <div className="p-2.5 rounded-lg bg-[#F0F4E8] w-fit">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-stone-900 font-serif-brand">{item.title}</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CURRICULUM OVERVIEW */}
      <section id="curriculum" className="rounded-2xl bg-[#FAF9F5] border border-stone-200 p-6 sm:p-10 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
            Curriculum Framework
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C] mt-1">
            Balanced & Purposeful Curriculum
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            A high-level overview of our primary learning structure. Detailed syllabi and scheme of work brochures are published each term.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          <div className="space-y-3 p-6 rounded-xl bg-white border border-stone-200/80">
            <h4 className="text-base font-bold text-stone-900 font-serif-brand flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#182B1C]" />
              National Curriculum Core Standards
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              We align our core academic subjects with Key Stage 1 and Key Stage 2 national curriculum benchmarks:
            </p>
            <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-4">
              <li>English: Phonics (systematic synthetic), reading comprehension, grammar, and creative writing</li>
              <li>Mathematics: Number fluency, problem-solving, and mathematical reasoning</li>
              <li>Science: Experimental inquiry, living organisms, and physical processes</li>
              <li>Foundation subjects: History, Geography, Art, Computing, and Physical Education</li>
            </ul>
          </div>

          <div className="space-y-3 p-6 rounded-xl bg-white border border-stone-200/80">
            <h4 className="text-base font-bold text-stone-900 font-serif-brand flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#B8C053]" />
              Islamic Studies & Moral Cultivation
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Carefully calibrated religious instruction designed to instil love for learning and pious character:
            </p>
            <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-4">
              <li>Qur’anic recitation with correct Tajweed rules and basic translation</li>
              <li>Prophetic manners (Adab), honest speech, and social duties</li>
              <li>Daily morning assembly supplications, reflection, and mindful conduct</li>
              <li>Islamic historical appreciation and appreciation of creation</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-stone-500 font-mono italic">
          * Note: Full academic subject timetables and year group schemes of work will be provided in the official school prospectus.
        </p>
      </section>

      {/* SCHOOL LIFE */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
            Daily Experience
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C] mt-1">
            School Life at Darul Madinah
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            A day in the life of our pupils balances intellectual curiosity, disciplined study, and warm camaraderie.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {schoolLifeAreas.map((area) => (
            <div
              key={area.title}
              className="p-5 rounded-xl border border-stone-200/90 bg-white shadow-xs space-y-1.5"
            >
              <h4 className="text-sm font-bold text-stone-900 font-serif-brand">{area.title}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{area.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PARENTS & GOVERNANCE PORTAL */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
          Parent Information
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C]">
          Information for Parents & Carers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <button
            onClick={() => onNavigate('/policies')}
            className="p-5 rounded-xl bg-[#FAF9F5] border border-stone-200/80 hover:border-[#B8C053] transition-colors text-left space-y-1.5 cursor-pointer"
          >
            <FileText className="h-5 w-5 text-[#182B1C]" />
            <span className="block text-xs font-bold text-stone-900">School Policies</span>
            <span className="block text-[11px] text-stone-500">Admissions, Behaviour & SEND</span>
          </button>

          <button
            onClick={() => onNavigate('/safeguarding')}
            className="p-5 rounded-xl bg-[#FAF9F5] border border-stone-200/80 hover:border-[#B8C053] transition-colors text-left space-y-1.5 cursor-pointer"
          >
            <Shield className="h-5 w-5 text-[#182B1C]" />
            <span className="block text-xs font-bold text-stone-900">Safeguarding & Safety</span>
            <span className="block text-[11px] text-stone-500">Child protection procedures</span>
          </button>

          <div className="p-5 rounded-xl bg-[#FAF9F5] border border-stone-200/80 text-left space-y-1.5">
            <Calendar className="h-5 w-5 text-[#B8C053]" />
            <span className="block text-xs font-bold text-stone-900">Term Dates 2026/27</span>
            <span className="block text-[11px] text-stone-600">Autumn: 3 Sept – 18 Dec</span>
            <span className="block text-[10px] text-stone-500">Spring: 5 Jan – 26 Mar</span>
          </div>

          <div className="p-5 rounded-xl bg-[#FAF9F5] border border-stone-200/80 text-left space-y-1.5">
            <Mail className="h-5 w-5 text-stone-400" />
            <span className="block text-xs font-bold text-stone-900">School Office</span>
            <span className="block text-[11px] text-stone-500">{siteConfig.contact.darulMadinahEmail}</span>
          </div>
        </div>
      </section>

      {/* ADMISSIONS ENQUIRY SECTION */}
      <section ref={admissionsRef} id="admissions" className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8C053]">
              Join Our School
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#182B1C]">
              Admissions Enquiry
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We welcome applications from families across Sheffield seeking an inspiring, values-led education. Complete the form to request our prospectus, book a school tour, or discuss in-year transfers.
            </p>
            <div className="p-4 rounded-xl bg-[#F0F4E8] border border-[#D5DEC4] text-xs text-[#182B1C] space-y-1">
              <p className="font-bold">Next Open Morning</p>
              <p>Saturday, 7 November 2026 (10:00 – 12:30)</p>
              <p className="text-[11px] text-[#182B1C]/80">Tour classrooms & meet the headteacher at Madani Center</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <AdmissionsEnquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
};
