"use client";

import { useState } from "react";
import Image from "next/image";
import { C, F } from "@/lib/styles";

export default function InvitationOpening({ onOpen }: { onOpen: () => void }) {
  const [fading, setFading] = useState(false);
  const [skipAttempt, setSkipAttempt] = useState(0);

  const handleOpen = () => {
    setFading(true);
    setTimeout(onOpen, 700);
  };

  const handleSkip = () => {
    setSkipAttempt(prev => prev + 1);
  };

  const skipMessages = [
    "Nice try! There's no skipping a wedding invitation 😄",
    "Still no shortcut... just open the invitation! 🙏",
    "Okay fine, we get it. But the button is right above ↑",
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 900,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: C.ivory,
        backgroundImage: `
          radial-gradient(ellipse at 15% 15%, rgba(244,235,221,0.7) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 85%, rgba(243,222,217,0.5) 0%, transparent 55%),
          radial-gradient(ellipse at 50% 50%, rgba(229,170,70,0.04) 0%, transparent 70%)
        `,
        opacity: fading ? 0 : 1,
        transition: "opacity 0.7s ease",
        overflow: "hidden",
      }}
      aria-label="Wedding invitation - tap to open"
    >
      {/* Decorative arch lines */}
      <svg
        aria-hidden="true"
        viewBox="0 0 320 400"
        fill="none"
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-52%)", width: "min(320px, 90vw)", height: "auto", opacity: 0.12, pointerEvents: "none" }}
      >
        <path d="M40,400 L40,140 Q40,40 160,40 Q280,40 280,140 L280,400" stroke={C.gold} strokeWidth="1.5" />
        <path d="M65,400 L65,155 Q65,70 160,70 Q255,70 255,155 L255,400" stroke={C.gold} strokeWidth="1" />
        <circle cx="160" cy="38" r="10" fill={C.marigold} opacity="0.6" />
        <path d="M148,28 Q160,16 172,28" fill={C.marigold} opacity="0.4" />
        {/* Lattice */}
        {[110,130,150,170,190].map(y => (
          <path key={y} d={`M70,${y} Q160,${y-12} 250,${y}`} stroke={C.gold} strokeWidth="0.7" opacity="0.4" fill="none" />
        ))}
      </svg>

      {/* Floral corner top-left */}
      <svg aria-hidden="true" viewBox="0 0 120 120" fill="none" style={{ position: "absolute", top: 0, left: 0, width: 110, height: 110, opacity: 0.18, pointerEvents: "none" }}>
        <path d="M5,5 Q40,2 65,28 Q90,55 75,85 Q60,115 30,108 Q0,100 2,65 Q4,30 5,5Z" stroke={C.gold} strokeWidth="0.8" fill="none" opacity="0.7" />
        <ellipse cx="68" cy="82" rx="6" ry="4" fill={C.marigold} opacity="0.5" />
        <path d="M15,18 Q25,10 35,22 Q25,34 15,26Z" fill={C.dustyRose} opacity="0.55" />
        <path d="M38,8 Q50,5 55,18 Q43,26 36,17Z" fill={C.sage} opacity="0.55" />
      </svg>

      {/* Floral corner bottom-right */}
      <svg aria-hidden="true" viewBox="0 0 120 120" fill="none" style={{ position: "absolute", bottom: 0, right: 0, width: 110, height: 110, opacity: 0.18, pointerEvents: "none", transform: "rotate(180deg)" }}>
        <path d="M5,5 Q40,2 65,28 Q90,55 75,85 Q60,115 30,108 Q0,100 2,65 Q4,30 5,5Z" stroke={C.gold} strokeWidth="0.8" fill="none" opacity="0.7" />
        <ellipse cx="68" cy="82" rx="6" ry="4" fill={C.marigold} opacity="0.5" />
        <path d="M15,18 Q25,10 35,22 Q25,34 15,26Z" fill={C.dustyRose} opacity="0.55" />
        <path d="M38,8 Q50,5 55,18 Q43,26 36,17Z" fill={C.sage} opacity="0.55" />
      </svg>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 2rem" }}>

        {/* Hindi blessing - at the very top */}
        <p style={{
          fontFamily: F.hindi,
          fontSize: "clamp(1.05rem, 3.8vw, 1.2rem)",
          color: C.gold,
          marginBottom: 14,
          opacity: 0.85,
          letterSpacing: "0.02em",
        }} lang="hi" aria-label="Shree Mahaveeray Namah">
          श्री महावीराय नमः
        </p>

        {/* Gold top rule */}
        <div style={{ width: 60, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, marginBottom: 16 }} />

        {/* Logo */}
        <div style={{ position: "relative", width: "clamp(140px, 40vw, 190px)", aspectRatio: "1/1", marginBottom: 4 }}>
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(244,235,221,0.85) 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />
          <Image
            src="/assets/couple/logo.png"
            alt="Aryan & Tanya monogram"
            fill
            style={{ objectFit: "contain" }}
            priority
            sizes="(max-width: 480px) 40vw, 190px"
          />
        </div>

        {/* Tagline */}
        <p style={{
          fontFamily: F.body,
          fontSize: "0.6rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: C.secondary,
          marginBottom: 10,
          opacity: 0.7,
        }}>
          Aryan &nbsp;·&nbsp; Tanya
        </p>

        {/* Script tagline */}
        <p style={{ fontFamily: F.script, fontSize: "clamp(1.1rem, 4vw, 1.4rem)", color: C.dustyRose, marginBottom: 6, letterSpacing: "0.02em" }}>
          Jain Family welcomes you
        </p>

        {/* Date - no Vaishali */}
        <p style={{ fontFamily: F.body, fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: C.secondary, marginBottom: 36, opacity: 0.75 }}>
          2–4 December 2026
        </p>

        {/* Gold rule */}
        <div style={{ width: 80, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, marginBottom: 28 }} />

        {/* Open button */}
        <button
          onClick={handleOpen}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 56,
            padding: "0 2.5rem",
            background: C.charcoal,
            color: C.ivory,
            fontFamily: F.body,
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            borderRadius: 9999,
            border: "none",
            cursor: "pointer",
            minWidth: 220,
            boxShadow: "0 4px 24px rgba(66,58,54,0.18)",
          }}
          aria-label="Open the wedding invitation"
        >
          Open Invitation
        </button>

        {/* Skip - shows funny message instead of skipping */}
        {skipAttempt === 0 ? (
          <button
            onClick={handleSkip}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F.body, fontSize: "0.72rem", color: C.muted, letterSpacing: "0.08em", marginTop: 18, padding: "8px 16px" }}
          >
            Skip
          </button>
        ) : (
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <p style={{
              fontFamily: F.body,
              fontSize: 13,
              color: C.dustyRose,
              marginBottom: skipAttempt < 3 ? 8 : 0,
              lineHeight: 1.5,
              padding: "8px 16px",
              background: "rgba(213,154,145,0.08)",
              borderRadius: 12,
              border: "1px solid rgba(213,154,145,0.15)",
            }}>
              {skipMessages[Math.min(skipAttempt - 1, skipMessages.length - 1)]}
            </p>
            {skipAttempt < 3 && (
              <button
                onClick={handleSkip}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F.body, fontSize: "0.68rem", color: C.muted, letterSpacing: "0.06em", padding: "6px 12px" }}
              >
                Skip anyway
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

