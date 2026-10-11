// ─── Calendar link generation ─────────────────────────────────────────────────

import type { WeddingEvent } from "@/data/events";

// Formats a date + time string into a UTC-based ICS / Google calendar value
// Times are in IST (UTC+5:30)
function toCalDateTime(dateStr: string, timeStr: string): string {
  // e.g. dateStr = "2026-12-02", timeStr = "12:00 PM"
  if (!timeStr || timeStr.toLowerCase().includes("following")) {
    // Use midnight of the date as fallback
    return dateStr.replace(/-/g, "") + "T000000Z";
  }
  const [time, period] = timeStr.split(" ");
  const [hoursRaw, minutes] = time.split(":").map(Number);
  let hours = hoursRaw;
  if (period?.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (period?.toUpperCase() === "AM" && hours === 12) hours = 0;
  // Convert IST → UTC (subtract 5h30m)
  const totalMinutesIST = hours * 60 + (minutes ?? 0);
  const totalMinutesUTC = totalMinutesIST - 330;
  const utcHours = Math.floor(((totalMinutesUTC % 1440) + 1440) % 1440 / 60);
  const utcMins  = ((totalMinutesUTC % 1440) + 1440) % 1440 % 60;
  // Date adjustment if rollover
  const date = new Date(dateStr + "T00:00:00Z");
  if (totalMinutesUTC < 0) date.setUTCDate(date.getUTCDate() - 1);
  const d = date.toISOString().slice(0, 10).replace(/-/g, "");
  return `${d}T${String(utcHours).padStart(2,"0")}${String(utcMins).padStart(2,"0")}00Z`;
}

function getEndDateTime(event: WeddingEvent): string {
  if (event.timeEnd) {
    return toCalDateTime(event.date, event.timeEnd);
  }
  // "Onwards" events: use start + calendarDuration minutes
  const start = toCalDateTime(event.date, event.timeStart);
  if (start.endsWith("Z")) {
    const d = new Date(
      start.replace(
        /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/,
        "$1-$2-$3T$4:$5:$6Z"
      )
    );
    d.setMinutes(d.getMinutes() + event.calendarDuration);
    return d.toISOString().replace(/[-:]/g, "").replace(".000", "");
  }
  return start;
}

export function buildGoogleCalendarUrl(event: WeddingEvent, mapUrl?: string): string {
  const start = toCalDateTime(event.date, event.timeStart);
  const end   = getEndDateTime(event);
  const details = encodeURIComponent(
    `${event.description}${mapUrl && !mapUrl.startsWith("PLACEHOLDER") ? "\n\nLocation: " + mapUrl : ""}`
  );
  const location = encodeURIComponent(event.venue ?? "Vaishali, Ghaziabad, India");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name + " - Aryan & Tanya's Wedding")}&dates=${start}/${end}&details=${details}&location=${location}`;
}

export function buildICSContent(event: WeddingEvent, mapUrl?: string): string {
  const start = toCalDateTime(event.date, event.timeStart);
  const end   = getEndDateTime(event);
  const uid   = `${event.id}-aryan-tanya-wedding-2026@wedding`;
  const description = event.description.replace(/\n/g, "\\n");
  const location    = event.venue ?? "Vaishali, Ghaziabad, India";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aryan & Tanya Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(".000", "")}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.name} - Aryan & Tanya's Wedding`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadICS(event: WeddingEvent, mapUrl?: string): void {
  const content  = buildICSContent(event, mapUrl);
  const blob     = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url      = URL.createObjectURL(blob);
  const anchor   = document.createElement("a");
  anchor.href    = url;
  anchor.download = `${event.id}-aryan-tanya-wedding.ics`;
  anchor.click();
  URL.revokeObjectURL(url);
}

// Build a combined ICS for all events
export function downloadAllICS(events: WeddingEvent[]): void {
  const eventBlocks = events.map((e) => {
    const start = toCalDateTime(e.date, e.timeStart);
    const end   = getEndDateTime(e);
    const uid   = `${e.id}-aryan-tanya-wedding-2026@wedding`;
    return [
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(".000", "")}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${e.name} - Aryan & Tanya's Wedding`,
      `DESCRIPTION:${e.description}`,
      `LOCATION:${e.venue ?? "Vaishali, Ghaziabad, India"}`,
      "END:VEVENT",
    ].join("\r\n");
  });

  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aryan & Tanya Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...eventBlocks,
    "END:VCALENDAR",
  ].join("\r\n");

  const blob     = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url      = URL.createObjectURL(blob);
  const anchor   = document.createElement("a");
  anchor.href    = url;
  anchor.download = "aryan-tanya-all-celebrations.ics";
  anchor.click();
  URL.revokeObjectURL(url);
}

