"use client";

import { MapPin, Navigation, Phone } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { venues } from "@/data/venues";
import { weddingEvents } from "@/data/events";
import { C, F, styles } from "@/lib/styles";
import type { Venue } from "@/data/venues";

// Contacts shown once at bottom
const HELP_CONTACTS = [
  { name: "Vikas Jain", role: "Groom's Father",  phone: "+919873345021",  display: "+91 98733 45021" },
  { name: "Manav",      role: "Groom's Brother",  phone: "+919821784448",  display: "+91 98217 84448" },
  { name: "Tanishq",    role: "Groom's Brother",  phone: "+919958974507",  display: "+91 99589 74507" },
];

function VenueCard({ venue }: { venue: Venue }) {
  const ref = useScrollReveal<HTMLDivElement>();

  const hasMap      = !!venue.mapUrl;
  const venueEvents = weddingEvents.filter(e => venue.events.includes(e.id));

  return (
    <div ref={ref} className="reveal" style={{ marginBottom: 10 }}>
      <article style={{
        background: "rgba(255,255,255,0.75)",
        borderRadius: 16,
        border: "1px solid rgba(182,150,89,0.2)",
        boxShadow: "0 1px 12px rgba(66,58,54,0.05)",
        padding: "14px 16px",
      }}>
        {/* Name row + action buttons - wraps on narrow screens */}
        <div style={{ display: "flex", flexWrap: "wrap" as const, alignItems: "center", justifyContent: "space-between", gap: "8px 10px" }}>
          {/* Left: icon + name */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flex: "1 1 200px", minWidth: 0 }}>
            <MapPin size={14} color={C.gold} style={{ marginTop: 3, flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontFamily: F.display, fontSize: "clamp(1rem, 3.5vw, 1.15rem)", fontWeight: 500, color: C.charcoal, margin: 0, lineHeight: 1.2 }}>
                {venue.name}
              </p>
              {venue.subName && (
                <p style={{ fontFamily: F.body, fontSize: 13, color: C.secondary, marginTop: 1 }}>{venue.subName}</p>
              )}
            </div>
          </div>

          {/* Maps button - wraps to own row on very narrow screens */}
          {hasMap && (
            <a href={venue.mapUrl} target="_blank" rel="noopener noreferrer"
              style={{ ...styles.btnPrimary, minHeight: 38, padding: "0 16px", fontSize: 13, gap: 5, textDecoration: "none", flexShrink: 0 }}
              aria-label={`Open ${venue.name} in maps`}>
              <Navigation size={13} /> Maps
            </a>
          )}
        </div>

        {/* Event tags */}
        {venueEvents.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 5, marginTop: 10, paddingLeft: 22 }}>
            {venueEvents.map(e => (
              <span key={e.id} style={{ fontFamily: F.body, fontSize: "0.68rem", padding: "2px 9px", borderRadius: 9999, background: "rgba(182,150,89,0.1)", border: "1px solid rgba(182,150,89,0.18)", color: C.secondary }}>
                {e.name}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}

function HelpContacts() {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal" style={{ marginTop: 6, padding: "16px", background: "rgba(255,255,255,0.6)", borderRadius: 16, border: "1px solid rgba(182,150,89,0.15)" }}>
      <p style={{ fontFamily: F.body, fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: C.gold, marginBottom: 12 }}>
        Need help getting there?
      </p>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
        {HELP_CONTACTS.map(c => (
          <div key={c.phone} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div>
              <p style={{ fontFamily: F.body, fontSize: "0.85rem", fontWeight: 600, color: C.charcoal, margin: 0, lineHeight: 1.3 }}>{c.name}</p>
              <p style={{ fontFamily: F.body, fontSize: "0.7rem", color: C.secondary, margin: 0 }}>{c.role}</p>
            </div>
            <a href={`tel:${c.phone}`}
              style={{ ...styles.btnOutline, ...styles.btnSm, gap: 5, textDecoration: "none", flexShrink: 0, minHeight: 38, fontSize: "0.75rem" }}
              aria-label={`Call ${c.name}`}>
              <Phone size={12} /> {c.display}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VenueSection() {
  return (
    <section id="venues" aria-labelledby="venues-heading" style={{
      background: C.ivory,
      backgroundImage: "radial-gradient(ellipse at 80% 20%, rgba(168,182,157,0.08) 0%, transparent 50%)",
      padding: "clamp(1.75rem, 5vw, 2.75rem) clamp(1.25rem, 5vw, 2rem)",
    }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <SectionHeading
          eyebrow="Getting There"
          title="Find Your Way"
        />
        {venues.map(v => <VenueCard key={v.id} venue={v} />)}
        <HelpContacts />
      </div>
    </section>
  );
}
