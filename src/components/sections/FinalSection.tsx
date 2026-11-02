"use client";

import { useState } from "react";
import { CalendarDays, Heart, Share2, Navigation } from "lucide-react";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { coupleAssets } from "@/data/wedding";
import { venues } from "@/data/venues";
import { weddingEvents } from "@/data/events";
import { C, F, styles } from "@/lib/styles";
import ShareInvitation from "@/components/sections/ShareInvitation";
import CalendarMenu from "@/components/sections/CalendarMenu";

export default function FinalSection() {
  const ref1 = useScrollReveal<HTMLDivElement>();
  const ref2 = useScrollReveal<HTMLDivElement>();
  const ref3 = useScrollReveal<HTMLDivElement>();
  const [shareOpen, setShareOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);

  const weddingVenue = venues.find(v => v.id === "hollywood-dreams");
  const hasMap = weddingVenue?.mapUrl && !weddingVenue.mapUrl.startsWith("PLACEHOLDER");

  return (
    <>
      <section id="final" aria-labelledby="final-heading" style={{
        background: `linear-gradient(180deg, ${C.ivory} 0%, ${C.champagne} 100%)`,
        backgroundImage: "radial-gradient(ellipse at 50% 90%, rgba(243,222,217,0.35) 0%, transparent 60%)",
        padding: "clamp(2rem, 6vw, 3.5rem) clamp(1.25rem, 5vw, 2rem) clamp(1.5rem, 4vw, 2.5rem)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative arches */}
        <svg aria-hidden="true" viewBox="0 0 300 200" fill="none" style={{ position: "absolute", bottom: 60, left: 0, width: 200, opacity: 0.07, pointerEvents: "none" }}>
          <path d="M-20,200 L-20,80 Q-20,10 80,10 Q180,10 180,80 L180,200" stroke={C.gold} strokeWidth="1.5" />
          <path d="M10,200 L10,95 Q10,35 80,35 Q150,35 150,95 L150,200"  stroke={C.gold} strokeWidth="1" />
        </svg>
        <svg aria-hidden="true" viewBox="0 0 300 200" fill="none" style={{ position: "absolute", bottom: 60, right: 0, width: 200, opacity: 0.07, pointerEvents: "none", transform: "scaleX(-1)" }}>
          <path d="M-20,200 L-20,80 Q-20,10 80,10 Q180,10 180,80 L180,200" stroke={C.gold} strokeWidth="1.5" />
          <path d="M10,200 L10,95 Q10,35 80,35 Q150,35 150,95 L150,200"  stroke={C.gold} strokeWidth="1" />
        </svg>

        <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 10 }}>

          {/* Portrait with glowing rotating ring */}
          <div ref={ref1} className="reveal" style={{ width: "clamp(130px, 38vw, 170px)", aspectRatio: "1/1", margin: "0 auto 18px", position: "relative" }}>

            {/* Rotating glow ring */}
            <style>{`
              @keyframes ringRotate {
                0%   { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes ringPulse {
                0%, 100% { opacity: 0.4; filter: blur(3px); }
                50%       { opacity: 0.7; filter: blur(5px); }
              }
            `}</style>

            {/* Outer glow halo */}
            <div aria-hidden="true" style={{
              position: "absolute",
              inset: -14,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(229,170,70,0.12) 0%, transparent 70%)`,
              animation: "ringPulse 3s ease-in-out infinite",
              pointerEvents: "none",
            }} />

            {/* Rotating dashed ring with gradient */}
            <svg
              aria-hidden="true"
              viewBox="0 0 200 200"
              style={{
                position: "absolute",
                inset: -12,
                width: "calc(100% + 24px)",
                height: "calc(100% + 24px)",
                animation: "ringRotate 12s linear infinite",
                pointerEvents: "none",
              }}
            >
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor={C.gold}      stopOpacity="0.7" />
                  <stop offset="35%"  stopColor={C.marigold}   stopOpacity="0.5" />
                  <stop offset="65%"  stopColor={C.dustyRose}  stopOpacity="0.4" />
                  <stop offset="100%" stopColor={C.gold}       stopOpacity="0.7" />
                </linearGradient>
              </defs>
              {/* Main rotating ring */}
              <circle
                cx="100" cy="100" r="95"
                stroke="url(#ringGrad)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="12 8 4 8"
                strokeLinecap="round"
              />
              {/* Inner subtle ring */}
              <circle
                cx="100" cy="100" r="88"
                stroke={C.gold}
                strokeWidth="0.5"
                fill="none"
                opacity="0.2"
                strokeDasharray="3 12"
              />
            </svg>

            {/* Small sparkle dots on the ring */}
            <svg
              aria-hidden="true"
              viewBox="0 0 200 200"
              style={{
                position: "absolute",
                inset: -12,
                width: "calc(100% + 24px)",
                height: "calc(100% + 24px)",
                animation: "ringRotate 18s linear infinite reverse",
                pointerEvents: "none",
              }}
            >
              <circle cx="100" cy="5" r="2.5" fill={C.gold} opacity="0.6">
                <animate attributeName="opacity" values="0.6;0.15;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="195" cy="100" r="2" fill={C.marigold} opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle cx="100" cy="195" r="2.5" fill={C.dustyRose} opacity="0.55">
                <animate attributeName="opacity" values="0.55;0.12;0.55" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="5" cy="100" r="2" fill={C.gold} opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.6s" repeatCount="indefinite" />
              </circle>
            </svg>

            {/* Photo circle */}
            <div style={{
              width: "100%", height: "100%",
              borderRadius: "50%",
              overflow: "hidden",
              border: `2px solid rgba(182,150,89,0.3)`,
              boxShadow: `0 0 0 6px rgba(244,235,221,0.75), 0 0 20px rgba(229,170,70,0.15), 0 12px 40px rgba(66,58,54,0.12)`,
              position: "relative",
              background: C.champagne,
            }}>
              <ImageWithFallback
                src={coupleAssets.final.src}
                alt={coupleAssets.final.alt}
                fill
                focalPosition={coupleAssets.final.focalPosition}
                assetLabel="Final couple illustration"
                sizes="(max-width: 480px) 55vw, 230px"
              />
            </div>
          </div>

          {/* Heading */}
          <div ref={ref2} className="reveal">
            <p style={{ fontFamily: F.body, fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: C.gold, marginBottom: 8 }}>
              December 2026
            </p>
            <h2 id="final-heading" style={{
              fontFamily: F.display,
              fontSize: "clamp(1.75rem, 7vw, 2.6rem)",
              fontWeight: 300,
              lineHeight: 1.1,
              color: C.charcoal,
              letterSpacing: "-0.01em",
              marginBottom: 8,
            }}>
              See You in December
            </h2>
            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, rgba(182,150,89,0.45), transparent)`, maxWidth: 80, margin: "0 auto 10px" }} />
            <p style={{ fontFamily: F.script, fontSize: "clamp(0.9rem, 3.5vw, 1.1rem)", color: C.dustyRose, marginBottom: 6 }}>
              Your love and blessings mean the world to us.
            </p>
            <p style={{ fontFamily: F.display, fontSize: "clamp(1.1rem, 4.5vw, 1.5rem)", fontWeight: 400, color: C.charcoal, letterSpacing: "0.04em", marginBottom: 4 }}>
              ARYAN &amp; TANYA
            </p>
            <p style={{ fontFamily: F.body, fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: C.secondary, marginBottom: 20, opacity: 0.8 }}>
              2–4 December 2026
            </p>
          </div>

          {/* Actions */}
          <div ref={ref3} className="reveal" style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            <button onClick={() => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })} style={{ ...styles.btnGold, gap: 8 }}>
              <Heart size={14} /> RSVP
            </button>
            <button onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })} style={{ ...styles.btnPrimary, gap: 8 }}>
              <CalendarDays size={14} /> View Celebrations
            </button>
            {hasMap && (
              <a href={weddingVenue!.mapUrl} target="_blank" rel="noopener noreferrer" style={{ ...styles.btnOutline, gap: 8 }}>
                <Navigation size={14} /> Open Wedding Location
              </a>
            )}
            <button onClick={() => setShareOpen(true)} style={{ ...styles.btnOutline, gap: 8 }}>
              <Share2 size={14} /> Share Invitation
            </button>
            <button
              onClick={() => setCalOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F.body, fontSize: "0.78rem", color: C.secondary, textDecoration: "underline", padding: "8px 0" }}
            >
              Add all celebrations to calendar
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "16px 16px calc(env(safe-area-inset-bottom, 0px) + 80px)",
        background: C.champagne,
        borderTop: "1px solid rgba(182,150,89,0.15)",
      }} role="contentinfo">
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(182,150,89,0.4), transparent)", maxWidth: 80, margin: "0 auto 10px" }} />
        <p style={{ fontFamily: F.body, fontSize: "0.7rem", color: C.muted, letterSpacing: "0.08em" }}>
          Made with love for Aryan &amp; Tanya
        </p>
        <p style={{ fontFamily: F.body, fontSize: "0.78rem", color: C.secondary, opacity: 0.7, marginTop: 3 }}>
          2–4 December 2026
        </p>
      </footer>

      {shareOpen && <ShareInvitation variant="modal" onClose={() => setShareOpen(false)} />}
      {calOpen && <CalendarMenu events={weddingEvents} onClose={() => setCalOpen(false)} />}
    </>
  );
}
