// ─── Site-wide configuration ────────────────────────────────────────────────
// Edit this file to update couple details, dates, and global settings.

export const siteConfig = {
  coupleNames: {
    partner1: "Aryan",
    partner2: "Tanya",
    combined: "Aryan & Tanya",
    initials: "A & T",
  },

  weddingDates: {
    start: "2026-12-02",
    end:   "2026-12-04",
    display: "2–4 December 2026",
    countdownTarget: "2026-12-02T13:00:00+05:30", // Haldi start (1:00 PM IST)
    timezone: "Asia/Kolkata",
  },

  location: {
    city: "Vaishali",
    state: "Ghaziabad",
    country: "India",
    display: "Vaishali, Ghaziabad",
  },

  // Social sharing
  social: {
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://aryan-tanya-wedding.vercel.app",
    title: "Aryan & Tanya | Wedding Invitation",
    description: "Join us for our wedding celebrations from 2–4 December 2026 in Vaishali.",
    ogImage: "/assets/couple/hero-couple-v3.png",
    whatsappText: "With great joy, Aryan and Tanya invite you to celebrate their wedding from 2–4 December 2026 in Vaishali. Open the invitation for event details and RSVP: ",
  },

  // Music
  music: {
    src: "/assets/audio/wedding-instrumental.mp3",
    defaultMuted: true,
  },

  // Optional private-invitation code (set to "" to disable)
  invitationCode: process.env.NEXT_PUBLIC_INVITATION_CODE ?? "",

  // Feature flags
  features: {
    music: true,
    rsvp: true,
    timeline: true,
    lightbox: true,
    floatingPetals: true,
    privateMode: false,  // set to true + invitationCode to enable
  },
};
