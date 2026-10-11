"use client";

import { useEffect, useRef } from "react";
import { X, Calendar, ExternalLink } from "lucide-react";
import { buildGoogleCalendarUrl, downloadICS } from "@/lib/calendar";
import type { WeddingEvent } from "@/data/events";

interface CalendarMenuProps {
  event: WeddingEvent;
  onClose: () => void;
}

export default function CalendarMenu({ event, onClose }: CalendarMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Trap focus
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      "button, a, [tabindex]:not([tabindex='-1'])"
    );
    focusable[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const mapUrl = event.mapLinks[0]?.url;
  const googleUrl = buildGoogleCalendarUrl(event, mapUrl && !mapUrl.startsWith("PLACEHOLDER") ? mapUrl : undefined);

  return (
    <div
      className="fixed inset-0 z-[7000] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Add ${event.name} to calendar`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(30,24,20,0.6)" }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={ref}
        className="relative w-full sm:w-auto sm:min-w-[320px] rounded-t-2xl sm:rounded-2xl p-6"
        style={{ background: "var(--ivory)", maxWidth: 400, zIndex: 1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="font-display text-lg"
            style={{ fontFamily: "var(--font-display)", color: "var(--charcoal)" }}
          >
            Add to Calendar
          </h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{ background: "rgba(182,150,89,0.1)" }}
            aria-label="Close calendar menu"
          >
            <X size={15} />
          </button>
        </div>

        <p className="font-body text-sm mb-4" style={{ color: "var(--secondary)" }}>
          {event.name} - {event.dateDisplay}
        </p>

        <div className="flex flex-col gap-2">
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline flex items-center gap-2"
            style={{ justifyContent: "flex-start", textTransform: "none", letterSpacing: "0.03em" }}
          >
            <Calendar size={16} style={{ color: "var(--gold)" }} />
            Google Calendar
            <ExternalLink size={13} className="ml-auto" style={{ opacity: 0.4 }} />
          </a>

          <button
            onClick={() => { downloadICS(event, mapUrl && !mapUrl.startsWith("PLACEHOLDER") ? mapUrl : undefined); onClose(); }}
            className="btn-outline flex items-center gap-2"
            style={{ justifyContent: "flex-start", textTransform: "none", letterSpacing: "0.03em" }}
          >
            <Calendar size={16} style={{ color: "var(--sage)" }} />
            Apple / Outlook (.ics)
          </button>
        </div>
      </div>
    </div>
  );
}

