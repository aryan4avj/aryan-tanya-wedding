// ─── Events data ─────────────────────────────────────────────────────────────

export type AttendanceStatus = "attending" | "not-attending" | "maybe";

export interface EventMapLink {
  label: string;
  url: string;
}

export interface WeddingEvent {
  id: string;
  name: string;
  date: string;
  dateDisplay: string;
  timeStart: string;
  timeEnd: string | null;
  timeDisplay: string;
  venue: string | null;
  venueId: string | null;
  description: string;
  mapLinks: EventMapLink[];
  calendarDuration: number;
  iconName: string; // Lucide icon name
  accentColor: string;
}

export const weddingEvents: WeddingEvent[] = [
  // ── 2 December ────────────────────────────────────────────────────────────
  {
    id: "haldi-mehndi",
    name: "Haldi, Mehndi & Bhaat",
    date: "2026-12-02",
    dateDisplay: "Wednesday, 2 December 2026",
    timeStart: "12:00 PM",
    timeEnd: "5:00 PM",
    timeDisplay: "12:00 PM – 5:00 PM",
    venue: "Mahagun Mansion Phase 1 Clubhouse, Vaishali",
    venueId: "mahagun-mansion",
    description:
      "A full afternoon of joy and tradition - starting with sunshine and haldi, flowing into beautiful Mehndi art, music, and the warm celebrations of Bhaat. A day full of colour, laughter and family.",
    mapLinks: [
      { label: "Open Location", url: "https://maps.app.goo.gl/dxj2FxjCyE7hb6hA8" },
    ],
    calendarDuration: 300,
    iconName: "flower",
    accentColor: "#E5AA46",
  },

  // ── 3 December ────────────────────────────────────────────────────────────
  {
    id: "sangeet",
    name: "Tilak & Sangeet",
    date: "2026-12-03",
    dateDisplay: "Thursday, 3 December 2026",
    timeStart: "6:00 PM",
    timeEnd: null,
    timeDisplay: "6:00 PM onwards",
    venue: "Ambrosia Palace, Sapphire Hall, Vaishali",
    venueId: "ambrosia",
    description:
      "An unforgettable evening of traditions, music, performances and dancing. Join us as the two families come together in celebration.",
    mapLinks: [
      { label: "Open Location", url: "https://maps.google.com/?q=Ambrosia+Palace+Plot+3+Sector+3+Vaishali+Ghaziabad" },
    ],
    calendarDuration: 240,
    iconName: "music",
    accentColor: "#B69659",
  },

  // ── 4 December ────────────────────────────────────────────────────────────
  {
    id: "nikrosi",
    name: "Nikrosi/Gurchadi",
    date: "2026-12-04",
    dateDisplay: "Friday, 4 December 2026",
    timeStart: "4:00 PM",
    timeEnd: null,
    timeDisplay: "4:00 PM onwards",
    venue: "The Roseman Hotel & Suites, Vaishali",
    venueId: "roseman",
    description:
      "The wedding celebrations begin with the sacred Nikrosi/Gurchadi ceremonies at The Roseman Hotel & Suites. From here, the groom's party will make its way to the nearby Jain Temple for the ceremonial journey.",
    mapLinks: [
      { label: "Open Location", url: "https://maps.app.goo.gl/4wwHrXVPVw1M4e7T7" },
    ],
    calendarDuration: 150,
    iconName: "landmark",
    accentColor: "#C77C67",
  },
  {
    // Baraat + Wedding merged - same venue, same evening
    id: "baraat-wedding",
    name: "Baraat & Wedding",
    date: "2026-12-04",
    dateDisplay: "Friday, 4 December 2026",
    timeStart: "7:00 PM",
    timeEnd: null,
    timeDisplay: "7:00 PM onwards",
    venue: "Hollywood Dreams, Queen Hall, Vaishali",
    venueId: "hollywood-dreams",
    description:
      "We assemble outside Hollywood Dreams, then the Baraat begins - dhol, dancing and festive cheer all the way. The wedding ceremony follows the Baraat. With the love and blessings of our families, we begin our forever.",
    mapLinks: [
      { label: "Open Location", url: "https://maps.google.com/?q=Hollywood+Dreams+Banquet+Vaishali+Metro+Station+Sector+4+Ghaziabad" },
    ],
    calendarDuration: 360,
    iconName: "heart",
    accentColor: "#D59A91",
  },
];

export const eventsByDate: Record<string, WeddingEvent[]> = {
  all:          weddingEvents,
  "2026-12-02": weddingEvents.filter((e) => e.date === "2026-12-02"),
  "2026-12-03": weddingEvents.filter((e) => e.date === "2026-12-03"),
  "2026-12-04": weddingEvents.filter((e) => e.date === "2026-12-04"),
};

