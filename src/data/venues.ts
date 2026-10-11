// ─── Venues data ─────────────────────────────────────────────────────────────

export interface Venue {
  id: string;
  name: string;
  subName?: string;
  events: string[];
  address: string;       // empty string = not yet confirmed
  mapUrl: string;        // empty string = not yet confirmed
  travelNote?: string;
  contacts: VenueContact[];
}

export interface VenueContact {
  name: string;
  role: string;
  phone: string;
}

const CONTACTS_MAIN: VenueContact[] = [
  { name: "Vikas Jain", role: "Groom's Father", phone: "+91 98733 45021" },
  { name: "Manav",      role: "Groom's Brother", phone: "+91 98217 84448" },
  { name: "Tanishq",    role: "Groom's Brother", phone: "+91 99589 74507" },
];

export const venues: Venue[] = [
  {
    id: "mahagun-mansion",
    name: "Mahagun Mansion Phase 1 Clubhouse",
    events: ["haldi-mehndi"],
    address: "Mahagun Mansion Phase 1, Sector 3, Vaishali, Ghaziabad",
    mapUrl: "https://maps.app.goo.gl/dxj2FxjCyE7hb6hA8",
    travelNote: "Inside Mahagun Mansion residential complex, Sector 3.",
    contacts: CONTACTS_MAIN,
  },
  {
    id: "ambrosia",
    name: "Ambrosia Palace",
    subName: "Sapphire Hall",
    events: ["sangeet"],
    address: "Plot 3, Sector 3, Vaishali, Ghaziabad",
    mapUrl: "https://maps.google.com/?q=Ambrosia+Palace+Plot+3+Sector+3+Vaishali+Ghaziabad",
    contacts: CONTACTS_MAIN,
  },
  {
    id: "roseman",
    name: "The Roseman Hotel & Suites",
    events: ["nikrosi"],
    address: "",
    mapUrl: "https://maps.app.goo.gl/4wwHrXVPVw1M4e7T7",
    contacts: CONTACTS_MAIN,
  },
  {
    id: "hollywood-dreams",
    name: "Hollywood Dreams",
    subName: "Queen Hall",
    events: ["baraat-wedding"],
    address: "Vaishali Metro Station, Sector 4, Vaishali, Ghaziabad",
    mapUrl: "https://maps.google.com/?q=Hollywood+Dreams+Banquet+Vaishali+Metro+Station+Sector+4+Ghaziabad",
    travelNote: "At Vaishali Metro Station, Blue Line.",
    contacts: CONTACTS_MAIN,
  },
];
