// ─── RSVP TypeScript types ────────────────────────────────────────────────────

import type { AttendanceStatus } from "@/data/events";

export interface RSVPData {
  // Step 1
  name: string;
  mobile: string;
  email?: string;
  guestCount: number;

  // Step 2
  attendance: Record<string, AttendanceStatus>;

  // Step 3
  dietaryRequirements: string;
  accommodationRequired: boolean;
  transportRequired: boolean;
  childrenCount: number;
  message: string;
}
