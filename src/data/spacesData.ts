/**
 * Venue Hire Spaces & Room Data
 * 
 * Capacity and exact technical specifications are marked as placeholders
 * until official architectural inspections and licensing are finalised.
 */

export interface VenueSpace {
  id: string;
  name: string;
  category: string;
  capacityText: string;
  idealFor: string[];
  layoutOptions: string[];
  features: string[];
  accessibilityNote: string;
  pricingText: string;
  description: string;
  placeholderKey: string;
}

export const venueSpaces: VenueSpace[] = [
  {
    id: 'main-hall',
    name: 'Main Community & Event Hall',
    category: 'Large Assembly & Functions',
    capacityText: 'Capacity: To be confirmed (Enquire for specifications)',
    idealFor: [
      'Community conferences & seminars',
      'Educational workshops',
      'Family celebrations & community meals',
      'Organisation general meetings',
      'Charity and voluntary sector events',
    ],
    layoutOptions: ['Theatre style', 'Banquet / dining rounds', 'Classroom tables', 'Open floor circle'],
    features: [
      'Generous open floor plan',
      'Audio & microphone setup support (Details coming soon)',
      'High ceilings & natural daylight',
      'Direct access to adjoining lobby',
      'Flexible table and chair arrangements',
    ],
    accessibilityNote: 'Ground-floor step-free access (Full audit details coming soon)',
    pricingText: 'Available upon enquiry / Subsidised rates for registered charities & community groups',
    description: 'Our primary assembly space offers high ceilings, clean timber-finish flooring, and flexible seating layouts suitable for major community gatherings, seminars, and dignified family functions.',
    placeholderKey: 'venue-hall',
  },
  {
    id: 'meeting-training-room',
    name: 'Meeting & Training Suite',
    category: 'Small to Medium Meetings',
    capacityText: 'Capacity: To be confirmed',
    idealFor: [
      'Trustee & board meetings',
      'Professional training sessions',
      'Small group seminars',
      'Consultation & committee meetings',
    ],
    layoutOptions: ['Boardroom setup', 'U-Shape discussion', 'Classroom layout'],
    features: [
      'Conference tables and ergonomic seating',
      'Display screen & presentation connectivity (Details coming soon)',
      'Whiteboard and flipchart facilities',
      'Quiet acoustic environment',
    ],
    accessibilityNote: 'Accessible facility access (Details coming soon)',
    pricingText: 'Hourly and half-day bookings available upon enquiry',
    description: 'A focused, quiet environment designed for professional meetings, team development, community committee discussions, and educational seminars.',
    placeholderKey: 'building-facilities',
  },
  {
    id: 'classroom-education-space',
    name: 'Modular Classroom Spaces',
    category: 'Teaching & Study Circles',
    capacityText: 'Capacity: To be confirmed',
    idealFor: [
      'Evening study classes',
      'Adult education & language courses',
      'Youth tuition & revision clinics',
      'Skills workshops',
    ],
    layoutOptions: ['Traditional classroom desks', 'Group pods of 4–6', 'Workshop circles'],
    features: [
      'Standard UK school desks and student seating',
      'Teaching presentation boards',
      'Natural perimeter daylight',
      'Quiet educational wing',
    ],
    accessibilityNote: 'Educational wing accessibility verified on enquiry',
    pricingText: 'Discounted block-booking rates for educational organisations',
    description: 'Well-appointed educational spaces equipped with pupil desks and presentation boards, ideal for supplementary education, tuition providers, and language courses.',
    placeholderKey: 'darul-madinah-classroom',
  },
  {
    id: 'community-activity-space',
    name: 'Youth & Community Activity Area',
    category: 'Interactive & Social',
    capacityText: 'Capacity: To be confirmed',
    idealFor: [
      'Youth club activities & sports socials',
      'Sisters’ coffee & tea circles',
      'Health and wellbeing workshops',
      'Informal community meetups',
    ],
    layoutOptions: ['Informal lounge seating', 'Activity tables', 'Cleared open perimeter'],
    features: [
      'Resilient multi-purpose flooring',
      'Comfortable modular seating',
      'Space for indoor youth games and icebreakers',
      'Adjoining tea-making preparation point (Subject to confirmation)',
    ],
    accessibilityNote: 'Ground-floor access (Details coming soon)',
    pricingText: 'Flexible rates for community and youth groups',
    description: 'A vibrant, versatile space suited to informal youth projects, social meetups, craft workshops, and community tea circles.',
    placeholderKey: 'youth-activity',
  }
];

export const suitableEventTypes = [
  'Community events and consultations',
  'Professional seminars and training sessions',
  'Family milestones and private gatherings (Alcohol-free and suitable ethos)',
  'Educational lectures and revision programmes',
  'Youth and student workshops',
  'Charity fundraisers and voluntary sector assemblies',
  'Committee and board meetings',
];
