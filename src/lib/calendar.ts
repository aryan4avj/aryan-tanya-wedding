// ─── Calendar links & .ics files ──────────────────────────────────────────────
// Pure helpers (no DOM), shared by the add-to-calendar sheet and the
// /calendar/[file] route that serves the .ics files.

import type { WeddingEvent } from "@/data/events";

const IST_OFFSET_MINUTES = 330; // India has no daylight saving, so this is fixed
const TIMEZONE = "Asia/Kolkata";
const TITLE_SUFFIX = " - Aryan & Tanya's Wedding";
const DEFAULT_LOCATION = "Vaishali, Ghaziabad, India";
// Keep UIDs stable: re-adding a file then updates the same event instead of duplicating it
const UID_SUFFIX = "-aryan-tanya-wedding-2026@wedding";
// Bump whenever an event's date, time or venue changes (1 = Haldi moved to 1-7 PM)
const ICS_SEQUENCE = 1;

/** File id for the combined "all celebrations" calendar */
export const ALL_EVENTS_ID = "all";

/** Same-origin URL of an event's .ics file (served by app/calendar/[file]/route.ts) */
export const icsHref = (id: string) => `/calendar/${id}.ics`;

export const icsFileName = (id: string) =>
  id === ALL_EVENTS_ID ? "aryan-tanya-wedding-celebrations.ics" : `aryan-tanya-${id}.ics`;

// ── Times ─────────────────────────────────────────────────────────────────────
interface EventTimes {
  start: Date;
  end: Date;
  allDay: boolean; // used if a time can't be read (e.g. "Following the Baraat")
}

/** "1:00 PM" on "2026-12-02", in IST → Date (null if the time isn't in h:mm AM/PM form) */
function parseIST(date: string, time: string | null): Date | null {
  const m = time ? /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim()) : null;
  if (!m) return null;
  const hours = (Number(m[1]) % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0);
  const [y, mo, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1, d, hours, Number(m[2])) - IST_OFFSET_MINUTES * 60_000);
}

function eventTimes(event: WeddingEvent): EventTimes {
  const start = parseIST(event.date, event.timeStart);
  if (!start) {
    const day = new Date(`${event.date}T00:00:00Z`);
    return { start: day, end: new Date(day.getTime() + 86_400_000), allDay: true };
  }
  let end = parseIST(event.date, event.timeEnd) ?? new Date(start.getTime() + event.calendarDuration * 60_000);
  if (end <= start) end = new Date(end.getTime() + 86_400_000); // finishes after midnight
  return { start, end, allDay: false };
}

// 2026-12-02T07:30:00.000Z → 20261202T073000Z
const utcStamp = (d: Date) => d.toISOString().replace(/\.\d{3}Z$/, "Z").replace(/[-:]/g, "");
// 2026-12-02T07:30:00.000Z → 2026-12-02T07:30:00Z
const isoNoMs = (d: Date) => d.toISOString().replace(/\.\d{3}Z$/, "Z");
// → 20261202
const dateStamp = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, "");

// ── Event text ────────────────────────────────────────────────────────────────
const eventTitle = (e: WeddingEvent) => `${e.name}${TITLE_SUFFIX}`;
const eventLocation = (e: WeddingEvent) => e.venue ?? DEFAULT_LOCATION;
const eventMapUrl = (e: WeddingEvent) =>
  e.mapLinks.find((l) => l.url && !l.url.startsWith("PLACEHOLDER"))?.url;

function eventDetails(e: WeddingEvent): string {
  const map = eventMapUrl(e);
  return map ? `${e.description}\n\nDirections: ${map}` : e.description;
}

// ── Web calendars ─────────────────────────────────────────────────────────────
/** Google Calendar "add event" page (opens the Calendar app's editor on most Android phones) */
export function googleCalendarUrl(e: WeddingEvent): string {
  const t = eventTimes(e);
  const dates = t.allDay
    ? `${dateStamp(t.start)}/${dateStamp(t.end)}`
    : `${utcStamp(t.start)}/${utcStamp(t.end)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle(e),
    dates,
    details: eventDetails(e),
    location: eventLocation(e),
    ctz: TIMEZONE,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** Outlook.com / Hotmail "new event" page */
export function outlookCalendarUrl(e: WeddingEvent): string {
  const t = eventTimes(e);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: eventTitle(e),
    startdt: t.allDay ? e.date : isoNoMs(t.start),
    enddt: t.allDay ? t.end.toISOString().slice(0, 10) : isoNoMs(t.end),
    allday: String(t.allDay),
    body: eventDetails(e),
    location: eventLocation(e),
  });
  return `https://outlook.live.com/calendar/deeplink/compose?${params}`;
}

// ── .ics (Apple Calendar, Samsung, Outlook desktop, ...) ──────────────────────
// RFC 5545 TEXT escaping
const escapeText = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

const utf8Length = (ch: string) => {
  const cp = ch.codePointAt(0) ?? 0;
  return cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4;
};

// RFC 5545 §3.1: lines over 75 octets are folded onto continuation lines starting with a space
function foldLine(line: string): string {
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const size = utf8Length(ch);
    const limit = parts.length === 0 ? 75 : 74;
    if (bytes + size > limit) {
      parts.push(current);
      current = "";
      bytes = 0;
    }
    current += ch;
    bytes += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

function vevent(e: WeddingEvent, stamp: string): string[] {
  const t = eventTimes(e);
  const map = eventMapUrl(e);
  return [
    "BEGIN:VEVENT",
    `UID:${e.id}${UID_SUFFIX}`,
    `SEQUENCE:${ICS_SEQUENCE}`,
    `DTSTAMP:${stamp}`,
    ...(t.allDay
      ? [`DTSTART;VALUE=DATE:${dateStamp(t.start)}`, `DTEND;VALUE=DATE:${dateStamp(t.end)}`]
      : [`DTSTART:${utcStamp(t.start)}`, `DTEND:${utcStamp(t.end)}`]),
    `SUMMARY:${escapeText(eventTitle(e))}`,
    `DESCRIPTION:${escapeText(eventDetails(e))}`,
    `LOCATION:${escapeText(eventLocation(e))}`,
    ...(map ? [`URL:${map}`] : []),
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
  ];
}

/** A complete VCALENDAR document for one or more events */
export function buildICS(events: WeddingEvent[], now: Date = new Date()): string {
  const stamp = utcStamp(now);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aryan & Tanya//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText("Aryan & Tanya's Wedding")}`,
    `X-WR-TIMEZONE:${TIMEZONE}`,
    ...events.flatMap((e) => vevent(e, stamp)),
    "END:VCALENDAR",
  ];
  return lines.map(foldLine).join("\r\n") + "\r\n";
}
