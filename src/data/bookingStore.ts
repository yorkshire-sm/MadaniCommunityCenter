/**
 * Central Data Store for Booking System, Facilities, Availability & Audit Logs
 * Operates with reactive state and LocalStorage persistence for realistic local testing.
 */

export interface Facility {
  id: string;
  name: string;
  slug: string;
  category: string;
  capacity: number;
  hourlyRate: number;
  weekendRate: number;
  depositRequired: number;
  description: string;
  features: string[];
  equipment: string[];
  suitableFor: string[];
  dimensions?: string;
  placeholderKey: string;
  isActive: boolean;
}

export interface Booking {
  id: string;
  reference: string;
  facilityId: string;
  facilityName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  organisation?: string;
  eventType: string;
  attendees: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  finishTime: string; // HH:MM
  hours: number;
  hourlyRate: number;
  totalCost: number;
  additionalRequirements?: string;
  layoutPreference?: string;
  needsKitchen: boolean;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  rejectionReason?: string;
  internalNotes?: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  clientIp?: string;
}

export interface BlockedDate {
  id: string;
  facilityId: string; // 'all' or specific facilityId
  facilityName: string;
  date: string; // YYYY-MM-DD
  reason: string;
  createdBy: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminUser: string;
  action: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'BOOKING_APPROVED' | 'BOOKING_REJECTED' | 'BOOKING_CANCELLED' | 'BOOKING_CREATED' | 'DATE_BLOCKED' | 'FACILITY_UPDATED' | 'CSV_EXPORT' | 'GDPR_ERASURE';
  targetType: 'booking' | 'facility' | 'blocked_date' | 'auth' | 'customer';
  targetId?: string;
  details: string;
  ipAddress: string;
}

export const initialFacilities: Facility[] = [
  {
    id: 'fac-main-hall',
    name: 'Main Community & Event Hall',
    slug: 'main-hall',
    category: 'Large Assembly & Functions',
    capacity: 250,
    hourlyRate: 45,
    weekendRate: 55,
    depositRequired: 150,
    description: 'Our primary assembly space offers high ceilings, clean timber-finish flooring, and flexible seating arrangements. Perfect for community conferences, large seminars, youth rallies, and dignified family gatherings.',
    features: [
      'High ceilings with natural perimeter daylight',
      'Step-free ground floor entrance and wide double doors',
      'Direct access to reception foyer and restroom facilities',
      'High-spec ventilation and climate control',
      'Direct serving hatch access to adjacent warming kitchen',
    ],
    equipment: [
      'PA Sound system with 2 wireless microphones',
      'High-definition ceiling projector & motorised 120" screen',
      '200 upholstered chairs & 25 banquet/seminar tables',
      'Presentation lectern & stage riser setup',
      'High-speed guest Wi-Fi',
    ],
    suitableFor: [
      'Community consultations & conferences',
      'Educational workshops & lectures',
      'Family celebrations & gatherings (Alcohol-free ethos)',
      'Charity general meetings & presentations',
    ],
    dimensions: '18m × 12m (216 sqm)',
    placeholderKey: 'venue-hall',
    isActive: true,
  },
  {
    id: 'fac-meeting-suite',
    name: 'Meeting & Training Suite',
    slug: 'meeting-suite',
    category: 'Small to Medium Meetings',
    capacity: 35,
    hourlyRate: 25,
    weekendRate: 30,
    depositRequired: 50,
    description: 'A focused, quiet acoustic environment specifically designed for trustee board meetings, committee discussions, staff training sessions, and small group seminars.',
    features: [
      'Acoustic sound-dampened privacy walls',
      'Natural daylight with blackout blinds for presentations',
      'Adjoining tea/coffee beverage preparation station',
      'Executive conference layout or flexible U-shape setup',
    ],
    equipment: [
      '65" 4K Smart TV display with HDMI & wireless screen share',
      'Conference speakerphone for hybrid Zoom meetings',
      'Magnetic dry-wipe whiteboard & flipcharts',
      'Ergonomic meeting chairs & conference boardroom tables',
    ],
    suitableFor: [
      'Trustee & board meetings',
      'Professional team training & CPD sessions',
      'Voluntary sector committee meetings',
      'Small group study & tuition clinics',
    ],
    dimensions: '8m × 5m (40 sqm)',
    placeholderKey: 'building-facilities',
    isActive: true,
  },
  {
    id: 'fac-classrooms',
    name: 'Modular Classroom Spaces',
    slug: 'classrooms',
    category: 'Teaching & Study Circles',
    capacity: 28,
    hourlyRate: 20,
    weekendRate: 25,
    depositRequired: 40,
    description: 'Well-appointed educational rooms equipped with standard pupil desks and presentation boards. Ideal for supplementary evening education, adult Arabic and language courses, and revision clinics.',
    features: [
      'Quiet dedicated educational wing away from main hall',
      'Natural daylight and bright LED reading illumination',
      'Multiple electrical points for student laptops',
      'Teacher presentation desk and whiteboards',
    ],
    equipment: [
      'Standard classroom single/double desks & student chairs',
      'Large teaching whiteboard and dry-wipe markers',
      'Wall projection space',
      'High-speed educational Wi-Fi',
    ],
    suitableFor: [
      'Evening Quran & Islamic study classes',
      'Weekend youth tuition & GCSE revision',
      'Adult language & skills classes',
      'Community workshops',
    ],
    dimensions: '7m × 6m (42 sqm)',
    placeholderKey: 'darul-madinah-classroom',
    isActive: true,
  },
  {
    id: 'fac-youth-lounge',
    name: 'Youth & Community Activity Lounge',
    slug: 'youth-lounge',
    category: 'Social & Recreational',
    capacity: 50,
    hourlyRate: 30,
    weekendRate: 35,
    depositRequired: 60,
    description: 'A vibrant, multi-purpose space with resilient flooring suited to youth social meetups, table tennis, mentoring circles, sisters’ morning teas, and health & wellbeing workshops.',
    features: [
      'Durable non-slip vinyl sports flooring',
      'Modular soft seating & breakout zones',
      'Tea & refreshment counter area',
      'Step-free ground level access',
    ],
    equipment: [
      'Table tennis tables & recreational games equipment',
      'Bluetooth audio speaker system',
      'Modular folding tables & light stackable chairs',
      'High-speed Wi-Fi',
    ],
    suitableFor: [
      'Youth club sessions & mentoring circles',
      'Sisters’ coffee & tea circles',
      'Health and wellbeing workshops',
      'Community social gatherings',
    ],
    dimensions: '12m × 8m (96 sqm)',
    placeholderKey: 'youth-activity',
    isActive: true,
  },
];

export const initialBookings: Booking[] = [
  {
    id: 'bkg-101',
    reference: 'MCC-2026-8492',
    facilityId: 'fac-main-hall',
    facilityName: 'Main Community & Event Hall',
    customerName: 'Muhammad Hamza',
    customerEmail: 'm.hamza@sheffield-charity.org.uk',
    customerPhone: '07700 900123',
    organisation: 'South Yorkshire Youth Network',
    eventType: 'Community Youth Mentoring Workshop',
    attendees: 80,
    date: '2026-10-18',
    startTime: '13:00',
    finishTime: '17:00',
    hours: 4,
    hourlyRate: 55,
    totalCost: 220,
    additionalRequirements: 'Need projector screen setup and microphone for guest speaker. Setting up tables in workshop format.',
    layoutPreference: 'Classroom tables',
    needsKitchen: true,
    status: 'confirmed',
    internalNotes: 'Payment deposit received (£150). Keyholder assigned: Br. Tariq. Confirmed alcohol-free policy.',
    termsAccepted: true,
    privacyAccepted: true,
    createdAt: '2026-10-05T10:14:00Z',
    updatedAt: '2026-10-06T09:30:00Z',
    clientIp: '82.35.120.44',
  },
  {
    id: 'bkg-102',
    reference: 'MCC-2026-3195',
    facilityId: 'fac-meeting-suite',
    facilityName: 'Meeting & Training Suite',
    customerName: 'Fatima Zahra',
    customerEmail: 'f.zahra@darnall-education.org',
    customerPhone: '07812 345678',
    organisation: 'Sheffield Community Educators',
    eventType: 'Trustee Board Strategic Meeting',
    attendees: 16,
    date: '2026-10-22',
    startTime: '18:00',
    finishTime: '20:30',
    hours: 2.5,
    hourlyRate: 25,
    totalCost: 62.5,
    additionalRequirements: 'HDMI cable and smart TV display connectivity required. Refreshment station setup.',
    layoutPreference: 'Boardroom setup',
    needsKitchen: false,
    status: 'confirmed',
    internalNotes: 'Regular monthly committee meeting. Good track record.',
    termsAccepted: true,
    privacyAccepted: true,
    createdAt: '2026-10-08T14:22:00Z',
    updatedAt: '2026-10-09T11:00:00Z',
    clientIp: '86.14.78.201',
  },
  {
    id: 'bkg-103',
    reference: 'MCC-2026-5821',
    facilityId: 'fac-main-hall',
    facilityName: 'Main Community & Event Hall',
    customerName: 'Dr. Zeeshan Ali',
    customerEmail: 'zeeshan.ali@nhs-sy.net',
    customerPhone: '07944 882211',
    organisation: 'Sheffield Health Outreach',
    eventType: 'Community Health Awareness & Diabetes Seminar',
    attendees: 120,
    date: '2026-10-25',
    startTime: '10:00',
    finishTime: '14:00',
    hours: 4,
    hourlyRate: 55,
    totalCost: 220,
    additionalRequirements: 'Requires stage riser, microphones, and seating layout for 120 attendees with central aisle.',
    layoutPreference: 'Theatre style',
    needsKitchen: true,
    status: 'pending',
    internalNotes: 'Awaiting coordinator review for parking marshal coverage.',
    termsAccepted: true,
    privacyAccepted: true,
    createdAt: '2026-10-11T16:45:00Z',
    updatedAt: '2026-10-11T16:45:00Z',
    clientIp: '152.17.90.12',
  },
  {
    id: 'bkg-104',
    reference: 'MCC-2026-9043',
    facilityId: 'fac-youth-lounge',
    facilityName: 'Youth & Community Activity Lounge',
    customerName: 'Amina Begum',
    customerEmail: 'amina.b@sistershub.co.uk',
    customerPhone: '07722 554433',
    organisation: 'Sheffield Muslim Sisters Hub',
    eventType: 'Sisters Coffee Morning & Mental Wellbeing Circle',
    attendees: 30,
    date: '2026-10-27',
    startTime: '10:00',
    finishTime: '12:30',
    hours: 2.5,
    hourlyRate: 30,
    totalCost: 75,
    additionalRequirements: 'Tea urn and hot water access. Private ground floor setting.',
    layoutPreference: 'Informal lounge seating',
    needsKitchen: true,
    status: 'pending',
    internalNotes: 'New request - check volunteer host availability.',
    termsAccepted: true,
    privacyAccepted: true,
    createdAt: '2026-10-12T09:15:00Z',
    updatedAt: '2026-10-12T09:15:00Z',
    clientIp: '80.194.22.65',
  },
  {
    id: 'bkg-105',
    reference: 'MCC-2026-1184',
    facilityId: 'fac-classrooms',
    facilityName: 'Modular Classroom Spaces',
    customerName: 'Kareem Siddiqui',
    customerEmail: 'kareem.siddiqui@gmail.com',
    customerPhone: '07555 123456',
    eventType: 'Weekend GCSE Maths Revision Clinic',
    attendees: 18,
    date: '2026-11-07',
    startTime: '09:30',
    finishTime: '12:30',
    hours: 3,
    hourlyRate: 25,
    totalCost: 75,
    additionalRequirements: 'Whiteboard markers and access to classroom 1.',
    layoutPreference: 'Traditional classroom desks',
    needsKitchen: false,
    status: 'confirmed',
    internalNotes: 'Tutor DBS check verified on file.',
    termsAccepted: true,
    privacyAccepted: true,
    createdAt: '2026-10-04T12:00:00Z',
    updatedAt: '2026-10-05T15:20:00Z',
    clientIp: '92.40.188.19',
  },
];

export const initialBlockedDates: BlockedDate[] = [
  {
    id: 'blk-001',
    facilityId: 'all',
    facilityName: 'All Center Facilities',
    date: '2026-10-19',
    reason: 'Annual Facility Maintenance & Timber Floor Resurfacing',
    createdBy: 'System Admin',
    createdAt: '2026-09-20T08:00:00Z',
  },
  {
    id: 'blk-002',
    facilityId: 'fac-main-hall',
    facilityName: 'Main Community & Event Hall',
    date: '2026-11-15',
    reason: 'Internal Dawat-e-Islami Sheffield Community Programme',
    createdBy: 'Admin Tariq',
    createdAt: '2026-10-01T10:00:00Z',
  },
];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-10-13T08:30:15Z',
    adminUser: 'admin@madanicenter.org.uk',
    action: 'LOGIN_SUCCESS',
    targetType: 'auth',
    details: 'Administrator logged in successfully via 2FA session from 192.168.1.55',
    ipAddress: '192.168.1.55',
  },
  {
    id: 'aud-002',
    timestamp: '2026-10-09T11:00:22Z',
    adminUser: 'admin@madanicenter.org.uk',
    action: 'BOOKING_APPROVED',
    targetType: 'booking',
    targetId: 'MCC-2026-3195',
    details: 'Approved booking for Fatima Zahra (Meeting & Training Suite, 22/10/2026)',
    ipAddress: '192.168.1.55',
  },
  {
    id: 'aud-003',
    timestamp: '2026-10-06T09:30:00Z',
    adminUser: 'admin@madanicenter.org.uk',
    action: 'BOOKING_APPROVED',
    targetType: 'booking',
    targetId: 'MCC-2026-8492',
    details: 'Approved booking for Muhammad Hamza (Main Hall, 18/10/2026)',
    ipAddress: '192.168.1.55',
  },
  {
    id: 'aud-004',
    timestamp: '2026-09-20T08:00:00Z',
    adminUser: 'admin@madanicenter.org.uk',
    action: 'DATE_BLOCKED',
    targetType: 'blocked_date',
    details: 'Blocked date 2026-10-19 for All Center Facilities (Annual Floor Maintenance)',
    ipAddress: '192.168.1.55',
  },
];

// LocalStorage helpers with automatic fallback
const STORAGE_KEYS = {
  BOOKINGS: 'mcc_bookings_v2',
  FACILITIES: 'mcc_facilities_v2',
  BLOCKED: 'mcc_blocked_dates_v2',
  AUDIT: 'mcc_audit_logs_v2',
  ADMIN_AUTH: 'mcc_admin_session_v2',
};

export const bookingStore = {
  getBookings(): Booking[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : initialBookings;
    } catch {
      return initialBookings;
    }
  },

  saveBookings(bookings: Booking[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  },

  getFacilities(): Facility[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FACILITIES);
      return data ? JSON.parse(data) : initialFacilities;
    } catch {
      return initialFacilities;
    }
  },

  saveFacilities(facilities: Facility[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(facilities));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  },

  getBlockedDates(): BlockedDate[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BLOCKED);
      return data ? JSON.parse(data) : initialBlockedDates;
    } catch {
      return initialBlockedDates;
    }
  },

  saveBlockedDates(dates: BlockedDate[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOCKED, JSON.stringify(dates));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  },

  getAuditLogs(): AuditLogEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT);
      return data ? JSON.parse(data) : initialAuditLogs;
    } catch {
      return initialAuditLogs;
    }
  },

  addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    try {
      const logs = this.getAuditLogs();
      const newEntry: AuditLogEntry = {
        ...entry,
        id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
      };
      logs.unshift(newEntry);
      // Keep last 150 logs
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(logs.slice(0, 150)));
    } catch (e) {
      console.warn('Audit log write failed:', e);
    }
  },

  generateReference(): string {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `MCC-2026-${random}`;
  },

  // Check if a time slot has a conflict with confirmed bookings or blocked dates
  checkConflict(facilityId: string, date: string, startTime: string, finishTime: string, excludeBookingId?: string): { hasConflict: boolean; reason?: string } {
    const blocked = this.getBlockedDates();
    const isBlocked = blocked.some(b => b.date === date && (b.facilityId === 'all' || b.facilityId === facilityId));
    if (isBlocked) {
      const blockReason = blocked.find(b => b.date === date && (b.facilityId === 'all' || b.facilityId === facilityId))?.reason || 'Center closed';
      return { hasConflict: true, reason: `This date is closed by administration: ${blockReason}` };
    }

    const bookings = this.getBookings();
    // Confirmed bookings prevent conflicts; pending bookings will be checked by admin
    const overlapping = bookings.find(b => {
      if (b.id === excludeBookingId) return false;
      if (b.date !== date) return false;
      if (b.facilityId !== facilityId) return false;
      if (b.status !== 'confirmed') return false;

      // Overlap formula: (startA < endB) && (endA > startB)
      return startTime < b.finishTime && finishTime > b.startTime;
    });

    if (overlapping) {
      return {
        hasConflict: true,
        reason: `Overlaps with an existing confirmed booking (${overlapping.startTime} - ${overlapping.finishTime}). Please choose an alternative time slot.`,
      };
    }

    return { hasConflict: false };
  },

  // Add new public booking request
  submitBookingRequest(data: Omit<Booking, 'id' | 'reference' | 'status' | 'createdAt' | 'updatedAt'>): { success: boolean; booking?: Booking; error?: string } {
    // Server-side conflict check simulation
    const conflict = this.checkConflict(data.facilityId, data.date, data.startTime, data.finishTime);
    if (conflict.hasConflict) {
      return { success: false, error: conflict.reason };
    }

    const reference = this.generateReference();
    const now = new Date().toISOString();

    const newBooking: Booking = {
      ...data,
      id: `bkg-${Date.now()}`,
      reference,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      clientIp: '127.0.0.1 (Client Submission)',
    };

    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    this.saveBookings(bookings);

    this.addAuditLog({
      adminUser: 'Public Customer',
      action: 'BOOKING_CREATED',
      targetType: 'booking',
      targetId: reference,
      details: `New booking request submitted by ${data.customerName} for ${data.facilityName} on ${data.date} (${data.startTime}-${data.finishTime})`,
      ipAddress: '127.0.0.1',
    });

    return { success: true, booking: newBooking };
  },

  // Admin update booking status
  updateBookingStatus(bookingId: string, status: 'confirmed' | 'rejected' | 'cancelled', reason?: string, internalNote?: string, adminUser = 'admin@madanicenter.org.uk'): { success: boolean; error?: string } {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) return { success: false, error: 'Booking not found' };

    const target = bookings[index];

    // If approving, verify no conflict exists
    if (status === 'confirmed') {
      const conflict = this.checkConflict(target.facilityId, target.date, target.startTime, target.finishTime, target.id);
      if (conflict.hasConflict) {
        return { success: false, error: `Cannot approve: ${conflict.reason}` };
      }
    }

    target.status = status;
    target.updatedAt = new Date().toISOString();
    if (reason) target.rejectionReason = reason;
    if (internalNote) target.internalNotes = internalNote;

    bookings[index] = target;
    this.saveBookings(bookings);

    const actionMap = {
      confirmed: 'BOOKING_APPROVED' as const,
      rejected: 'BOOKING_REJECTED' as const,
      cancelled: 'BOOKING_CANCELLED' as const,
    };

    this.addAuditLog({
      adminUser,
      action: actionMap[status],
      targetType: 'booking',
      targetId: target.reference,
      details: `Booking ${target.reference} marked as ${status.toUpperCase()} by ${adminUser}${reason ? ` (Reason: ${reason})` : ''}`,
      ipAddress: '192.168.1.55',
    });

    return { success: true };
  },

  // Admin update booking notes
  updateInternalNotes(bookingId: string, notes: string, adminUser = 'admin@madanicenter.org.uk'): void {
    const bookings = this.getBookings();
    const target = bookings.find(b => b.id === bookingId);
    if (target) {
      target.internalNotes = notes;
      target.updatedAt = new Date().toISOString();
      this.saveBookings(bookings);
    }
  },

  // Reset to initial state
  resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.FACILITIES);
    localStorage.removeItem(STORAGE_KEYS.BLOCKED);
    localStorage.removeItem(STORAGE_KEYS.AUDIT);
  },
};
