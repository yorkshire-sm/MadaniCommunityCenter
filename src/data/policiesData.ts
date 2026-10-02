/**
 * Policies & Governance Data
 * 
 * NOTE: Policies from the previous organisation have intentionally been excluded.
 * The policies below represent the core governance framework being updated by
 * Dawat-e-Islami / Darul Madinah Sheffield trustees and legal advisors.
 */

export interface PolicyDocument {
  id: string;
  title: string;
  category: 'School Governance' | 'Safeguarding & Safety' | 'General Operations' | 'Data & Privacy';
  status: 'Under Review' | 'Draft Framework' | 'Statutory Requirement';
  lastUpdated: string;
  fileSizePlaceholder: string;
  description: string;
  documentType: 'PDF Document';
}

export const schoolAndCenterPolicies: PolicyDocument[] = [
  {
    id: 'pol-safeguarding-child-protection',
    title: 'Safeguarding & Child Protection Policy',
    category: 'Safeguarding & Safety',
    status: 'Draft Framework',
    lastUpdated: 'October 2026',
    fileSizePlaceholder: 'PDF (approx. 420 KB)',
    description: 'Comprehensive procedures for child protection, safer recruitment, mandatory staff training, and referral protocols in accordance with Keeping Children Safe in Education (KCSIE).',
    documentType: 'PDF Document',
  },
  {
    id: 'pol-behaviour-anti-bullying',
    title: 'Behaviour, Values & Anti-Bullying Policy',
    category: 'School Governance',
    status: 'Draft Framework',
    lastUpdated: 'October 2026',
    fileSizePlaceholder: 'PDF (approx. 310 KB)',
    description: 'Guidelines setting out pupil expectations, positive reinforcement, restorative conflict resolution, and zero-tolerance approaches to bullying.',
    documentType: 'PDF Document',
  },
  {
    id: 'pol-health-and-safety',
    title: 'Health, Safety & Building Welfare Policy',
    category: 'Safeguarding & Safety',
    status: 'Draft Framework',
    lastUpdated: 'October 2026',
    fileSizePlaceholder: 'PDF (approx. 380 KB)',
    description: 'Facility management standards, fire safety protocols, first aid provision, risk assessments for activities, and visitor site regulations.',
    documentType: 'PDF Document',
  },
  {
    id: 'pol-admissions-criteria',
    title: 'Darul Madinah Primary Admissions Policy',
    category: 'School Governance',
    status: 'Draft Framework',
    lastUpdated: 'October 2026',
    fileSizePlaceholder: 'PDF (approx. 240 KB)',
    description: 'Transparent criteria for primary pupil intake, application procedures, oversubscription criteria, appeals, and mid-year transfers.',
    documentType: 'PDF Document',
  },
  {
    id: 'pol-complaints-procedure',
    title: 'Complaints & Concerns Procedure',
    category: 'General Operations',
    status: 'Draft Framework',
    lastUpdated: 'October 2026',
    fileSizePlaceholder: 'PDF (approx. 195 KB)',
    description: 'A structured, impartial three-stage process for parents, neighbours, and community members to voice concerns or lodge formal representations.',
    documentType: 'PDF Document',
  },
  {
    id: 'pol-send-inclusion',
    title: 'Special Educational Needs & Disabilities (SEND) Policy',
    category: 'School Governance',
    status: 'Draft Framework',
    lastUpdated: 'October 2026',
    fileSizePlaceholder: 'PDF (approx. 280 KB)',
    description: 'Commitment to inclusive education, personalised learning support, and multi-agency collaboration for pupils with additional educational needs.',
    documentType: 'PDF Document',
  },
  {
    id: 'pol-privacy-gdpr',
    title: 'Data Protection & Privacy Notice (UK GDPR)',
    category: 'Data & Privacy',
    status: 'Draft Framework',
    lastUpdated: 'October 2026',
    fileSizePlaceholder: 'PDF (approx. 210 KB)',
    description: 'How personal information regarding pupils, guardians, venue hirers, and volunteers is legally processed, retained, and safeguarded.',
    documentType: 'PDF Document',
  },
  {
    id: 'pol-venue-hire-terms',
    title: 'Venue Hire Terms, Conditions & Ethos Guidelines',
    category: 'General Operations',
    status: 'Draft Framework',
    lastUpdated: 'October 2026',
    fileSizePlaceholder: 'PDF (approx. 260 KB)',
    description: 'Rules governing hall bookings, allowable decorations, alcohol prohibition, noise curfews, deposits, and cancellation policies.',
    documentType: 'PDF Document',
  },
];
