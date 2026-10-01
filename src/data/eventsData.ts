/**
 * Structured Events Data
 * 
 * Reusable data structure for upcoming events, workshops, and gatherings.
 * All entries below are SAMPLE/DEVELOPMENT events and can be updated by administrators.
 */

export type EventCategory = 'All' | 'Youth' | 'Sisters' | 'Darul Madinah' | 'Community' | 'Family';

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  category: 'Youth' | 'Sisters' | 'Darul Madinah' | 'Community' | 'Family';
  date: string; // ISO date string e.g. "2026-10-18"
  dateFormatted: string; // e.g. "Sunday, 18 October 2026"
  startTime: string; // e.g. "14:00"
  endTime: string; // e.g. "17:00"
  venue: string;
  address: string;
  audience: string;
  description: string;
  fullDescription: string;
  placeholderKey: string;
  featured: boolean;
  status: 'Open for Registration' | 'Details Coming Soon' | 'Drop-in Welcome';
  registrationRequired: boolean;
  programmeSchedule?: Array<{
    time: string;
    item: string;
    notes?: string;
  }>;
  speakerOrFacilitator?: string;
}

export const sampleEvents: EventItem[] = [
  {
    id: 'evt-001',
    slug: 'sheffield-youth-leadership-circle',
    title: 'Sheffield Youth Skills & Leadership Circle',
    category: 'Youth',
    date: '2026-10-18',
    dateFormatted: 'Sunday, 18 October 2026',
    startTime: '14:00',
    endTime: '16:30',
    venue: 'Youth Activity Space, First Floor',
    address: 'Tinsley Park Road, Sheffield, S9 5DL',
    audience: 'Brothers aged 14–24',
    description: 'An interactive afternoon workshop focusing on practical communication skills, peer mentoring, teamwork, and Islamic character.',
    fullDescription: 'Join our welcoming youth circle designed for young people in Sheffield. The session brings together local students and young professionals to explore personal development, public speaking fundamentals, and faith-inspired leadership. Light refreshments and sports social will follow the main session.',
    placeholderKey: 'youth-workshop',
    featured: true,
    status: 'Open for Registration',
    registrationRequired: true,
    programmeSchedule: [
      { time: '14:00', item: 'Arrival & Welcome Refreshments' },
      { time: '14:20', item: 'Interactive Skills Workshop: Public Speaking & Teamwork' },
      { time: '15:15', item: 'Break & Discussion Circle' },
      { time: '15:45', item: 'Mentoring Q&A with Community Mentors' },
      { time: '16:15', item: 'Concluding Reflections & Social Networking' },
    ],
    speakerOrFacilitator: 'Local Youth Mentors & Guest Educator',
  },
  {
    id: 'evt-002',
    slug: 'sisters-autumn-wellbeing-gathering',
    title: "Sisters' Community Gathering & Wellbeing Workshop",
    category: 'Sisters',
    date: '2026-10-24',
    dateFormatted: 'Saturday, 24 October 2026',
    startTime: '11:00',
    endTime: '13:30',
    venue: 'Main Hall (Dedicated Sisters Setup)',
    address: 'Tinsley Park Road, Sheffield, S9 5DL',
    audience: 'Sisters of all ages (Crèche space available)',
    description: 'A relaxed and dignified morning gathering for sisters featuring a talk on holistic wellbeing, family life, and community connections.',
    fullDescription: "A dedicated morning organised by and for sisters across Sheffield. Connect with local families, participate in an inspiring talk on balancing work, home, and spiritual wellbeing, and enjoy artisan tea and pastries in a comfortable, welcoming environment.",
    placeholderKey: 'sisters-event',
    featured: true,
    status: 'Open for Registration',
    registrationRequired: true,
    programmeSchedule: [
      { time: '11:00', item: 'Registration & Welcome Tea' },
      { time: '11:25', item: 'Keynote Talk: Spiritual Mindfulness & Everyday Wellbeing' },
      { time: '12:15', item: 'Interactive Workshop & Small Group Discussions' },
      { time: '13:00', item: 'Community Lunch & Networking' },
    ],
    speakerOrFacilitator: 'Guest Educator & Community Health Practitioner',
  },
  {
    id: 'evt-003',
    slug: 'darul-madinah-sheffield-admissions-open-morning',
    title: 'Darul Madinah Sheffield Primary Open Morning',
    category: 'Darul Madinah',
    date: '2026-11-07',
    dateFormatted: 'Saturday, 7 November 2026',
    startTime: '10:00',
    endTime: '12:30',
    venue: 'Darul Madinah Primary Wing',
    address: 'Tinsley Park Road, Sheffield, S9 5DL',
    audience: 'Parents and prospective pupils (Ages 4–11)',
    description: 'Tour our newly prepared classrooms, meet the educational leadership, and learn about the national curriculum and Islamic values curriculum.',
    fullDescription: 'We invite prospective parents to tour the new Sheffield Darul Madinah primary school facilities. Discover how we balance core National Curriculum academic standards with a nurturing Islamic ethos, moral development, and Qur’an studies. Staff will be available to answer questions regarding the admissions process.',
    placeholderKey: 'darul-madinah-classroom',
    featured: true,
    status: 'Open for Registration',
    registrationRequired: true,
    programmeSchedule: [
      { time: '10:00', item: 'Headteacher Welcome & Educational Vision Presentation' },
      { time: '10:45', item: 'Guided Tours of Classrooms and Facilities' },
      { time: '11:30', item: 'Admissions Desk & Individual Q&A Session' },
      { time: '12:15', item: 'Closing Remarks & Information Pack Distribution' },
    ],
    speakerOrFacilitator: 'Darul Madinah Academic Team & School Leaders',
  },
  {
    id: 'evt-004',
    slug: 'community-welcome-and-open-doors-day',
    title: 'Sheffield Community Open Doors & Exhibition',
    category: 'Community',
    date: '2026-11-14',
    dateFormatted: 'Saturday, 14 November 2026',
    startTime: '12:00',
    endTime: '16:00',
    venue: 'Full Centre & Main Hall',
    address: 'Tinsley Park Road, Sheffield, S9 5DL',
    audience: 'Open to all Sheffield neighbours, families, and local organisations',
    description: 'Come and explore the new multi-purpose centre, meet your local community neighbours, and learn about upcoming activities and venue hire.',
    fullDescription: 'An open invitation to all residents of Sheffield and surrounding areas. Explore our facilities on Tinsley Park Road, learn about our educational programmes, see how you can volunteer, and discuss venue hire for your community events. Stalls, refreshments, and children activities will run throughout the afternoon.',
    placeholderKey: 'community-event',
    featured: false,
    status: 'Drop-in Welcome',
    registrationRequired: false,
    programmeSchedule: [
      { time: '12:00', item: 'Doors Open & Exhibition Stalls' },
      { time: '13:00', item: 'Community Welcome Address' },
      { time: '13:30', item: 'Children Activities & Facility Tours' },
      { time: '15:00', item: 'Community Tea & Volunteer Information Session' },
    ],
    speakerOrFacilitator: 'Dawat-e-Islami Sheffield Committee',
  },
  {
    id: 'evt-005',
    slug: 'family-parenting-seminar',
    title: 'Nurturing Character: Modern Parenting Seminar',
    category: 'Family',
    date: '2026-11-21',
    dateFormatted: 'Saturday, 21 November 2026',
    startTime: '13:30',
    endTime: '15:30',
    venue: 'Main Hall',
    address: 'Tinsley Park Road, Sheffield, S9 5DL',
    audience: 'Parents, guardians, and carers',
    description: 'Practical guidance for raising confident, grounded children in modern Britain, bridging academic success with strong moral foundations.',
    fullDescription: 'A practical, supportive seminar for parents in Sheffield. Experienced educators will share evidence-based parenting strategies, digital media navigation for families, and character cultivation rooted in traditional Islamic wisdom.',
    placeholderKey: 'children-learning',
    featured: false,
    status: 'Open for Registration',
    registrationRequired: true,
    programmeSchedule: [
      { time: '13:30', item: 'Welcome & Introduction' },
      { time: '13:45', item: 'Part 1: Communication and Boundaries with Children' },
      { time: '14:30', item: 'Part 2: Managing Screens and Cultivating Faith at Home' },
      { time: '15:00', item: 'Open Floor Q&A with Educational Consultants' },
    ],
    speakerOrFacilitator: 'Family Educational Specialists',
  }
];
