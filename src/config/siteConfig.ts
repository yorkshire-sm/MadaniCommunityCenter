/**
 * Dawat-e-Islami Sheffield - Central Configuration
 * 
 * IMPORTANT: Contact numbers, emails, and the permanent centre name
 * are placeholders and MUST be updated with official confirmed details prior to launch.
 */

export interface SiteConfig {
  centreName: string;
  organisationName: string;
  regionalSubtitle: string;
  motto: string;
  address: {
    line1: string;
    area: string;
    city: string;
    postcode: string;
    country: string;
    formatted: string;
  };
  contact: {
    telephone: string; // PLACEHOLDER - replace prior to launch
    telephoneDisplay: string;
    email: string; // PLACEHOLDER - replace prior to launch
    venueEmail: string; // PLACEHOLDER - replace prior to launch
    darulMadinahEmail: string; // PLACEHOLDER - replace prior to launch
    youthEmail: string; // PLACEHOLDER - replace prior to launch
    sistersEmail: string; // PLACEHOLDER - replace prior to launch
  };
  links: {
    darulMadinahInfo: string;
    venueEnquiry: string;
    donate: string;
    googleMapsDirections: string;
    googleMapsPlace: string;
    googleMapsEmbed: string;
    facebook: string;
    instagram: string;
    youtube: string;
  };
  status: {
    openingHoursPlaceholder: string;
    parkingPlaceholder: string;
    venuePricingPlaceholder: string;
    schoolTermDatesPlaceholder: string;
  };
}

export const siteConfig: SiteConfig = {
  // Official Centre Name
  centreName: "Madani Community Centre",
  organisationName: "Dawat-e-Islami",
  regionalSubtitle: "Dawat-e-Islami Sheffield",
  motto: "Integrating academic excellence with Islamic teachings and community life",
  address: {
    line1: "Tinsley Park Road",
    area: "Tinsley / Attercliffe",
    city: "Sheffield",
    postcode: "S9 5DL",
    country: "United Kingdom",
    formatted: "Tinsley Park Road, Sheffield, S9 5DL, United Kingdom",
  },
  contact: {
    // NOTE: Replace with confirmed Sheffield organisation telephone numbers
    telephone: "01234 567890",
    telephoneDisplay: "01234 567890 (Placeholder)",
    email: "info@example.org",
    venueEmail: "venue-hire@example.org",
    darulMadinahEmail: "darulmadinah.sheffield@example.org",
    youthEmail: "youth.sheffield@example.org",
    sistersEmail: "sisters.sheffield@example.org",
  },
  links: {
    darulMadinahInfo: "/darul-madinah",
    venueEnquiry: "/venue-hire",
    donate: "#support",
    googleMapsDirections: "https://www.google.com/maps/dir/?api=1&destination=53.3974483,-1.418529",
    googleMapsPlace: "https://www.google.com/maps/place/Madani+Community+Centre/@53.3974483,-1.418529,17z/data=!3m1!4b1!4m6!3m5!1s0x487977f260864137:0xa8da2b647132fa87!8m2!3d53.3974483!4d-1.418529!16s%2Fg%2F11kmrw06cb",
    googleMapsEmbed: "https://maps.google.com/maps?q=53.3974483,-1.418529+(Madani+Community+Centre)&t=&z=17&ie=UTF8&iwloc=B&output=embed",
    facebook: "https://www.facebook.com/dawateislami",
    instagram: "https://www.instagram.com/dawateislami",
    youtube: "https://www.youtube.com/dawateislami",
  },
  status: {
    openingHoursPlaceholder: "Official opening hours will be announced shortly. For enquiries, please use the contact form.",
    parkingPlaceholder: "On-site and local street parking guidance is currently being finalised.",
    venuePricingPlaceholder: "Competitive community and commercial hire rates are available upon request.",
    schoolTermDatesPlaceholder: "Academic calendar and term dates for Darul Madinah primary school will be published prior to term commencement.",
  },
};
