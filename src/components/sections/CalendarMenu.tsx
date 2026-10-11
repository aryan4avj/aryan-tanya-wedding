"use client";

import { buildGoogleCalendarUrl } from "@/lib/calendar";
import type { WeddingEvent } from "@/data/events";

interface CalendarMenuProps {
  event: WeddingEvent;
  onClose: () => void;
}

/**
 * Directly opens Google Calendar add-event URL.
 * Works on all phones and browsers:
 * - Android: opens Google Calendar app if installed, otherwise web
 * - iOS: opens Google Calendar in browser (Safari) where user can add to any calendar
 * - Desktop: opens Google Calendar web
 * 
 * Google Calendar URL is the most universal approach — no file downloads,
 * no CORS issues, works across all platforms.
 */
export default function CalendarMenu({ event, onClose }: CalendarMenuProps) {
  const mapUrl = event.mapLinks[0]?.url;
  const hasMap = mapUrl && !mapUrl.startsWith("PLACEHOLDER");
  const googleUrl = buildGoogleCalendarUrl(event, hasMap ? mapUrl : undefined);

  // Open Google Calendar directly and close
  if (typeof window !== "undefined") {
    setTimeout(() => {
      window.open(googleUrl, "_blank");
      onClose();
    }, 50);
  }

  return null;
}
