"use client";

import { useEffect, useState } from "react";
import { Home, CalendarDays, BookOpen, MapPin, Heart } from "lucide-react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { C, F } from "@/lib/styles";

const NAV = [
  { id: "home",    label: "Home",      Icon: Home },
  { id: "events",  label: "Events",    Icon: CalendarDays },
  { id: "journey", label: "Our Story", Icon: BookOpen },
  { id: "venues",  label: "Venues",    Icon: MapPin },
  { id: "rsvp",    label: "RSVP",      Icon: Heart },
] as const;

export default function MobileBottomNav() {
  const active = useActiveSection(NAV.map(n => n.id));
  const [hidden, setHidden] = useState(false);

  // Hide nav when gallery is open (body has data-gallery-open attribute)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setHidden(document.body.hasAttribute("data-gallery-open"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-gallery-open"] });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (hidden) return null;

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        background: "rgba(255,249,241,0.94)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(182,150,89,0.18)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        boxShadow: "0 -2px 20px rgba(66,58,54,0.08)",
        display: "flex",
      }}
      className="md:hidden"
    >
      {NAV.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            aria-current={isActive ? "page" : undefined}
            aria-label={label}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              minHeight: 58,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px 2px 8px",
              outline: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <Icon
              size={20}
              color={isActive ? C.gold : C.muted}
              strokeWidth={isActive ? 2 : 1.5}
              style={{ transition: "color 0.2s" }}
            />
            <span style={{
              fontFamily: F.body,
              fontSize: "0.6rem",
              letterSpacing: "0.05em",
              color: isActive ? C.charcoal : C.muted,
              fontWeight: isActive ? 600 : 400,
              transition: "color 0.2s",
              lineHeight: 1,
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
