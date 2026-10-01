/**
 * Dawat-e-Islami Sheffield - Central Configuration
 * Madani Community Centre
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
    telephone: string;
    telephoneDisplay: string;
    email: string;
    venueEmail: string;
    darulMadinahEmail: string;
    youthEmail: string;
    sistersEmail: string;
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
    telephone: "0114 244 8786",
    telephoneDisplay: "0114 244 8786",
    email: "info@madanicentre.org.uk",
    venueEmail: "venuehire@madanicentre.org.uk",
    darulMadinahEmail: "darulmadinah.sheffield@madanicentre.org.uk",
    youthEmail: "youth@madanicentre.org.uk",
    sistersEmail: "sisters@madanicentre.org.uk",
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
    openingHoursPlaceholder: "Open daily: Monday to Friday 08:00 – 21:00, Saturday & Sunday 08:30 – 21:30. Office reception: 08:30 – 16:30.",
    parkingPlaceholder: "On-site private parking with 45 dedicated spaces, accessible disabled parking bays, and bicycle racks on Tinsley Park Road.",
    venuePricingPlaceholder: "Hall hire from £35/hr for community groups; flexible hourly and daily delegate rates available for seminars and family gatherings.",
    schoolTermDatesPlaceholder: "Autumn Term: 3 Sept – 18 Dec 2026. Spring Term: 5 Jan – 26 Mar 2027. Summer Term: 12 Apr – 21 Jul 2027.",
  },
};
