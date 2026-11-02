"use client";

import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import EventCard from "@/components/sections/EventCard";
import CalendarMenu from "@/components/sections/CalendarMenu";
import { weddingEvents, eventsByDate } from "@/data/events";
import { C, F, styles } from "@/lib/styles";

type DateFilter = "all" | "2026-12-02" | "2026-12-03" | "2026-12-04";

const FILTERS: { key: DateFilter; label: string }[] = [
  { key: "all",        label: "All Events" },
  { key: "2026-12-02", label: "2 Dec" },
  { key: "2026-12-03", label: "3 Dec" },
  { key: "2026-12-04", label: "4 Dec" },
];

const DATE_LABELS: Record<string, string> = {
  "2026-12-02": "Wednesday · 2 December",
  "2026-12-03": "Thursday · 3 December",
  "2026-12-04": "Friday · 4 December",
};

export default function EventTimeline() {
  const [active, setActive] = useState<DateFilter>("all");
  const [calOpen, setCalOpen] = useState(false);
  const events = eventsByDate[active] ?? weddingEvents;

  const byDate: Record<string, typeof events> = {};
  for (const ev of events) {
    if (!byDate[ev.date]) byDate[ev.date] = [];
    byDate[ev.date].push(ev);
  }

  return (
    <section
      id="events"
      aria-labelledby="events-heading"
      style={{
        background: C.ivory,
        backgroundImage: "radial-gradient(circle, rgba(168,182,157,0.07) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
        padding: "clamp(1.75rem, 5vw, 2.75rem) clamp(1.25rem, 5vw, 2rem)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <SectionHeading
          eyebrow="The Celebrations"
          title="Celebration Schedule"
        />

        {/* Filter tabs */}
        <div
          role="tablist"
          aria-label="Filter by date"
          style={{ display: "flex", gap: 8, marginBottom: 28, overflowX: "auto" as const, paddingBottom: 4, scrollbarWidth: "none" as const }}
        >
          {FILTERS.map(f => (
            <button
              key={f.key}
              role="tab"
              aria-selected={active === f.key}
              onClick={() => setActive(f.key)}
              style={{
                flexShrink: 0,
                minHeight: 40,
                padding: "0 16px",
                borderRadius: 9999,
                fontFamily: F.body,
                fontSize: "0.8rem",
                fontWeight: active === f.key ? 600 : 400,
                letterSpacing: "0.04em",
                background: active === f.key ? C.charcoal : "rgba(182,150,89,0.1)",
                color:      active === f.key ? C.ivory    : C.secondary,
                border: active === f.key ? "none" : "1px solid rgba(182,150,89,0.2)",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Events */}
        {Object.entries(byDate).map(([date, dateEvents], gi) => (
          <div key={date}>
            {active === "all" && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontFamily: F.body, fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: C.gold, textAlign: "center", marginBottom: 10 }}>
                  {DATE_LABELS[date]}
                </p>
                <div style={{ height: 1, background: `linear-gradient(90deg, transparent, rgba(182,150,89,0.35), transparent)`, marginBottom: 16 }} />
              </div>
            )}
            {dateEvents.map(ev => <EventCard key={ev.id} event={ev} />)}
            {gi < Object.entries(byDate).length - 1 && <div style={{ height: 8 }} />}
          </div>
        ))}

        {/* Add all */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={() => setCalOpen(true)}
            style={{
              ...styles.btnOutline,
              gap: 6,
              whiteSpace: "normal",
              lineHeight: 1.3,
              padding: "10px 20px",
              maxWidth: "100%",
            }}
          >
            <CalendarPlus size={14} style={{ flexShrink: 0 }} />
            Add All Celebrations to Calendar
          </button>
        </div>
      </div>

      {calOpen && <CalendarMenu events={weddingEvents} onClose={() => setCalOpen(false)} />}
    </section>
  );
}

