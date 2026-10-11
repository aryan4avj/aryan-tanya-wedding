"use client";

import { downloadICS } from "@/lib/calendar";
import type { WeddingEvent } from "@/data/events";

interface CalendarMenuProps {
  event: WeddingEvent;
  onClose: () => void;
}

/**
 * On mobile phones:
 * - ICS file download automatically opens the native Calendar app (both iOS and Android)
 * - iOS Safari: opens Apple Calendar "Add Event" screen
 * - Android Chrome: opens Google Calendar or default calendar app
 * 
 * No need for a menu — just trigger the download directly.
 */
export default function CalendarMenu({ event, onClose }: CalendarMenuProps) {
  // Immediately download the ICS file and close
  const mapUrl = event.mapLinks[0]?.url;
  const hasMap = mapUrl && !mapUrl.startsWith("PLACEHOLDER");
  
  // Use setTimeout to ensure the component renders before triggering download
  if (typeof window !== "undefined") {
    setTimeout(() => {
      downloadICS(event, hasMap ? mapUrl : undefined);
      onClose();
    }, 100);
  }

  // Return nothing visible — the download happens automatically
  return null;
}
