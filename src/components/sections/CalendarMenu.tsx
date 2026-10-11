"use client";

import { useEffect, useRef } from "react";
import { X, Calendar } from "lucide-react";
import { buildGoogleCalendarUrl, downloadICS } from "@/lib/calendar";
import { C, F, styles } from "@/lib/styles";
import type { WeddingEvent } from "@/data/events";

interface CalendarMenuProps {
  event: WeddingEvent;
  onClose: () => void;
}

export default function CalendarMenu({ event, onClose }: CalendarMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const mapUrl = event.mapLinks[0]?.url;
  const hasMap = mapUrl && !mapUrl.startsWith("PLACEHOLDER");
  const googleUrl = buildGoogleCalendarUrl(event, hasMap ? mapUrl : undefined);

  const handleGoogle = () => {
    // Opens Google Calendar add event page — works on both iOS and Android
    window.open(googleUrl, "_blank");
    onClose();
  };

  const handleICS = () => {
    downloadICS(event, hasMap ? mapUrl : undefined);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Add ${event.name} to calendar`}
      style={{
        position: "fixed", inset: 0, zIndex: 7000,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        background: "rgba(30,24,20,0.6)",
      }}
    >
      <div
        ref={ref}
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 400,
          background: C.ivory,
          borderRadius: "20px 20px 0 0",
          padding: "20px 20px calc(env(safe-area-inset-bottom, 0px) + 20px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <h3 style={{ fontFamily: F.display, fontSize: 18, fontWeight: 400, color: C.charcoal, margin: 0 }}>
            Add to Calendar
          </h3>
          <button onClick={onClose} aria-label="Close" style={{
            width: 32, height: 32, borderRadius: "50%", background: "rgba(182,150,89,0.1)",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={14} color={C.charcoal} />
          </button>
        </div>

        <p style={{ fontFamily: F.body, fontSize: 13, color: C.secondary, marginBottom: 14 }}>
          {event.name} - {event.dateDisplay}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Google Calendar — opens directly */}
          <button onClick={handleGoogle} style={{ ...styles.btnPrimary, width: "100%", gap: 8 }}>
            <Calendar size={16} /> Google Calendar
          </button>

          {/* ICS download — for Apple/Outlook */}
          <button onClick={handleICS} style={{ ...styles.btnOutline, width: "100%", gap: 8 }}>
            <Calendar size={16} /> Apple / Outlook (.ics)
          </button>
        </div>
      </div>
    </div>
  );
}
