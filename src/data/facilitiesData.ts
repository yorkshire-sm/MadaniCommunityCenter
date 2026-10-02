/**
 * Center Facilities Overview
 * Clean line icon categories and confirmed / pending statuses.
 */

export interface FacilityItem {
  id: string;
  name: string;
  category: string;
  status: 'Available' | 'Confirmed' | 'Details coming soon';
  description: string;
  iconName: 'Building' | 'BookOpen' | 'Users' | 'GraduationCap' | 'HeartHandshake' | 'Calendar' | 'Compass' | 'Shield';
}

export const centerFacilities: FacilityItem[] = [
  {
    id: 'fac-main-hall',
    name: 'Main Assembly Hall',
    category: 'Assembly',
    status: 'Confirmed',
    description: 'Generous hall for major community programmes, youth events, seminars, and private bookings.',
    iconName: 'Building',
  },
  {
    id: 'fac-classrooms',
    name: 'Primary & Adult Classrooms',
    category: 'Education',
    status: 'Confirmed',
    description: 'Fully furnished primary classrooms supporting Darul Madinah school and evening Islamic studies.',
    iconName: 'GraduationCap',
  },
  {
    id: 'fac-meeting-rooms',
    name: 'Meeting & Seminar Rooms',
    category: 'Business & Voluntary',
    status: 'Confirmed',
    description: 'Dedicated spaces for community consultations, committees, and professional training.',
    iconName: 'Users',
  },
  {
    id: 'fac-youth-areas',
    name: 'Youth Activity Areas',
    category: 'Youth',
    status: 'Confirmed',
    description: 'Tailored recreational and educational spaces for young people, study circles, and mentorship.',
    iconName: 'HeartHandshake',
  },
  {
    id: 'fac-sisters-spaces',
    name: "Dedicated Sisters' Facilities",
    category: 'Community',
    status: 'Confirmed',
    description: 'Comfortable, private, and dignified environments dedicated to sisters’ programmes and gatherings.',
    iconName: 'Calendar',
  },
  {
    id: 'fac-prayer-areas',
    name: 'Prayer & Wudhu Facilities',
    category: 'Spiritual',
    status: 'Confirmed',
    description: 'Peaceful prayer spaces with ablution facilities for visitors attending programmes and classes.',
    iconName: 'Compass',
  },
  {
    id: 'fac-safeguarding',
    name: 'Secure Access & Safeguarding',
    category: 'Safety',
    status: 'Confirmed',
    description: 'Controlled visitor entry, CCTV monitored grounds, and school boundary safeguarding protocols.',
    iconName: 'Shield',
  },
  {
    id: 'fac-catering-kitchen',
    name: 'Catering & Refreshment Area',
    category: 'Hospitality',
    status: 'Details coming soon',
    description: 'Food preparation and warming area for community functions and event hospitality.',
    iconName: 'BookOpen',
  },
];
