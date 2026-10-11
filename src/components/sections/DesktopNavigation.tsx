"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useActiveSection } from "@/hooks/useActiveSection";
import { C, F } from "@/lib/styles";

const NAV = [
  { id: "home",    label: "Home" },
  { id: "events",  label: "Events" },
  { id: "journey", label: "Our Story" },
  { id: "venues",  label: "Venues" },
  { id: "rsvp",    label: "RSVP" },
] as const;

export default function DesktopNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(NAV.map(n => n.id));

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      aria-label="Desktop navigation"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(1.5rem, 4vw, 3rem)",
        background: scrolled ? "rgba(255,249,241,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(182,150,89,0.15)" : "none",
        transition: "background 0.3s, border-color 0.3s",
      }}
      // Only visible on md+
      className="hidden md:flex"
    >
      {/* Logo only - no tagline text */}
      <button
        onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })}
        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
        aria-label="Go to top"
      >
        <Image
          src="/assets/couple/logo.png"
          alt="Aryan & Tanya"
          width={50}
          height={50}
          style={{ objectFit: "contain" }}
        />
      </button>

      {/* Links */}
      <ul style={{ display: "flex", alignItems: "center", gap: "1.75rem", listStyle: "none", margin: 0, padding: 0 }}>
        {NAV.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <button
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                aria-current={isActive ? "page" : undefined}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: isActive ? `2px solid ${C.gold}` : "2px solid transparent",
                  cursor: "pointer",
                  fontFamily: F.body,
                  fontSize: "0.75rem",
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: isActive ? C.charcoal : C.secondary,
                  paddingBottom: 2,
                  transition: "color 0.2s, border-color 0.2s",
                  lineHeight: 1,
                }}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
