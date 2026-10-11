"use client";

import { useState } from "react";
import { MapPin, CalendarPlus, ChevronDown, Flower2, Music, Landmark, Heart } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { C, F, styles } from "@/lib/styles";
import type { WeddingEvent } from "@/data/events";
import CalendarMenu from "@/components/sections/CalendarMenu";

const ACCENT: Record<string, { bg: string; border: string; dot: string }> = {
  "haldi-mehndi":   { bg: "rgba(229,170,70,0.09)",  border: "rgba(229,170,70,0.28)",  dot: "#E5AA46" },
  sangeet:          { bg: "rgba(182,150,89,0.08)",  border: "rgba(182,150,89,0.26)",  dot: "#B69659" },
  nikrosi:          { bg: "rgba(199,124,103,0.08)", border: "rgba(199,124,103,0.26)", dot: "#C77C67" },
  "baraat-wedding": { bg: "rgba(213,154,145,0.1)",  border: "rgba(213,154,145,0.35)", dot: "#D59A91" },
};
const FALLBACK = { bg: "rgba(182,150,89,0.07)", border: "rgba(182,150,89,0.22)", dot: "#B69659" };

// Map iconName to Lucide component
const ICONS: Record<string, React.ElementType> = {
  flower:   Flower2,
  music:    Music,
  landmark: Landmark,
  heart:    Heart,
};

export default function EventCard({ event }: { event: WeddingEvent }) {
  const [open,    setOpen]    = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const ref = useScrollReveal<HTMLDivElement>();
  const a   = ACCENT[event.id] ?? FALLBACK;
  const hasMap = event.mapLinks.length > 0 && !event.mapLinks[0].url.startsWith("PLACEHOLDER");
  const IconComponent = ICONS[event.iconName] ?? Flower2;

  return (
    <>
      <div ref={ref} className="reveal" style={{ marginBottom: 12 }}>
        <article
          style={{
            background: a.bg,
            border: `1.5px solid ${a.border}`,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 2px 14px rgba(66,58,54,0.05)",
          }}
          aria-label={`${event.name} - ${event.dateDisplay}`}
        >
          {/* Always-visible summary */}
          <div style={{ padding: "16px 18px 14px" }}>

            {/* Name + date */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
              {/* Icon circle */}
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: `${a.dot}18`, border: `1px solid ${a.dot}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 2,
              }}>
                <IconComponent size={15} color={a.dot} strokeWidth={1.8} />
              </div>
              <div>
                <h3 style={{ fontFamily: F.display, fontSize: "clamp(1.15rem, 4.5vw, 1.4rem)", fontWeight: 500, color: C.charcoal, lineHeight: 1.2, margin: 0 }}>
                  {event.name}
                </h3>
                <p style={{ fontFamily: F.body, fontSize: 13, color: C.secondary, marginTop: 2 }}>
                  {event.dateDisplay}
                </p>
              </div>
            </div>

            {/* Time */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
              <span style={{ fontFamily: F.body, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: C.gold, fontWeight: 600 }}>
                Time
              </span>
              <span style={{ fontFamily: F.body, fontSize: 15, fontWeight: 600, color: C.charcoal }}>
                {event.timeDisplay}
              </span>
            </div>

            {/* Venue */}
            {event.venue ? (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                <MapPin size={13} color={C.dustyRose} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: F.body, fontSize: 14, color: C.secondary, lineHeight: 1.4 }}>{event.venue}</span>
              </div>
            ) : (
              <p style={{ fontFamily: F.body, fontSize: 13, fontStyle: "italic", color: C.muted }}>Venue to be confirmed</p>
            )}

            {/* View more toggle */}
            <button
              onClick={() => setOpen(p => !p)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4,
                marginTop: 12, padding: 0,
                fontFamily: F.body, fontSize: 12,
                letterSpacing: "0.12em", textTransform: "uppercase" as const,
                color: C.gold, fontWeight: 600,
              }}
              aria-expanded={open}
              aria-controls={`event-expand-${event.id}`}
            >
              {open ? "View Less" : "View More"}
              <ChevronDown size={13} style={{ transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>
          </div>

          {/* Expandable detail */}
          <div
            id={`event-expand-${event.id}`}
            role="region"
            style={{
              maxHeight: open ? "400px" : "0",
              overflow: "hidden",
              transition: "max-height 0.35s ease",
            }}
          >
            <div style={{ padding: "14px 18px 18px", borderTop: `1px solid ${a.border}` }}>
              {/* Description */}
              <p style={{ fontFamily: F.body, fontSize: 15, lineHeight: 1.65, color: C.secondary, marginBottom: 16 }}>
                {event.description}
              </p>

              {/* Actions */}
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
                <button
                  onClick={() => setCalOpen(true)}
                  style={{ ...styles.btnOutline, ...styles.btnSm, gap: 5 }}
                  aria-label={`Add ${event.name} to calendar`}
                >
                  <CalendarPlus size={14} /> Add to Calendar
                </button>
                {hasMap && event.mapLinks.map(link => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...styles.btnPrimary, ...styles.btnSm, gap: 5, textDecoration: "none" }}
                    aria-label={link.label}
                  >
                    <MapPin size={14} /> Directions
                  </a>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>

      {calOpen && <CalendarMenu event={event} onClose={() => setCalOpen(false)} />}
    </>
  );
}
