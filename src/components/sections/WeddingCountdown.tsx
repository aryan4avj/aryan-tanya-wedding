"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, Share2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { siteConfig } from "@/config/site";
import { C, F, styles } from "@/lib/styles";

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; started: boolean; }

function getTimeLeft(): TimeLeft {
  const target = new Date(siteConfig.weddingDates.countdownTarget);
  const diff   = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true };
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
    started: false,
  };
}

function Block({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
      <div style={{
        width: 62, height: 66,
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(8px)",
        borderRadius: 12,
        border: "1px solid rgba(182,150,89,0.2)",
        boxShadow: "0 2px 12px rgba(66,58,54,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <span style={{
          fontFamily: F.body,
          fontSize: "1.65rem",
          fontWeight: 600,
          color: C.charcoal,
          lineHeight: 1,
          minWidth: "2ch",
          textAlign: "center",
        }}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span style={{
        fontFamily: F.body,
        fontSize: "0.65rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase" as const,
        color: C.secondary,
      }}>
        {label}
      </span>
    </div>
  );
}

export default function WeddingCountdown({ onCalendar, onShare }: { onCalendar: () => void; onShare: () => void }) {
  const [time, setTime] = useState<TimeLeft>(getTimeLeft());
  const ref = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="countdown"
      aria-labelledby="countdown-heading"
      style={{
        background: C.champagne,
        padding: "clamp(1.75rem, 5vw, 2.5rem) clamp(1.25rem, 5vw, 2rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Celebration confetti background */}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg) scale(1); opacity: 0; }
          8%   { opacity: 0.85; }
          85%  { opacity: 0.6; }
          100% { transform: translateY(calc(100% + 40px)) rotate(var(--rot)) scale(0.7); opacity: 0; }
        }
        @keyframes confettiSway {
          0%, 100% { margin-left: 0; }
          25%  { margin-left: var(--sway); }
          75%  { margin-left: calc(var(--sway) * -0.6); }
        }
        @keyframes sparkPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.6) rotate(0deg); }
          50%       { opacity: 0.9; transform: scale(1.1) rotate(180deg); }
        }
      `}</style>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {/* Confetti pieces — mix of shapes */}
        {[
          // left: %, top-delay: s, size: px, duration: s, colour, shape, rotation, sway
          { l: 5,  dl: 0,   sz: 8,  dur: 4.5, c: C.gold,      sh: "rect",   rot: 540, sw: 25 },
          { l: 12, dl: 1.2, sz: 6,  dur: 5.0, c: C.dustyRose,  sh: "circle", rot: 360, sw: 18 },
          { l: 18, dl: 0.5, sz: 10, dur: 4.2, c: C.marigold,   sh: "rect",   rot: 720, sw: 30 },
          { l: 25, dl: 2.0, sz: 7,  dur: 5.5, c: C.sage,       sh: "circle", rot: 450, sw: 20 },
          { l: 32, dl: 0.8, sz: 9,  dur: 4.8, c: C.gold,       sh: "star",   rot: 600, sw: 22 },
          { l: 38, dl: 1.5, sz: 6,  dur: 5.2, c: C.blush,      sh: "rect",   rot: 380, sw: 15 },
          { l: 45, dl: 0.3, sz: 8,  dur: 4.4, c: C.dustyRose,  sh: "circle", rot: 500, sw: 28 },
          { l: 52, dl: 2.5, sz: 11, dur: 5.0, c: C.marigold,   sh: "star",   rot: 660, sw: 24 },
          { l: 58, dl: 0.7, sz: 7,  dur: 4.6, c: C.gold,       sh: "rect",   rot: 420, sw: 18 },
          { l: 65, dl: 1.8, sz: 5,  dur: 5.3, c: C.sage,       sh: "circle", rot: 300, sw: 12 },
          { l: 72, dl: 0.2, sz: 9,  dur: 4.3, c: C.dustyRose,  sh: "rect",   rot: 580, sw: 26 },
          { l: 78, dl: 1.0, sz: 7,  dur: 5.1, c: C.marigold,   sh: "star",   rot: 480, sw: 20 },
          { l: 84, dl: 2.2, sz: 6,  dur: 4.7, c: C.gold,       sh: "circle", rot: 400, sw: 16 },
          { l: 90, dl: 0.6, sz: 10, dur: 5.4, c: C.blush,      sh: "rect",   rot: 700, sw: 30 },
          { l: 95, dl: 1.4, sz: 8,  dur: 4.9, c: C.dustyRose,  sh: "star",   rot: 550, sw: 22 },
          // Second wave — offset
          { l: 8,  dl: 3.0, sz: 7,  dur: 5.0, c: C.marigold,   sh: "circle", rot: 440, sw: 20 },
          { l: 22, dl: 3.5, sz: 9,  dur: 4.5, c: C.gold,       sh: "rect",   rot: 620, sw: 25 },
          { l: 35, dl: 2.8, sz: 6,  dur: 5.2, c: C.sage,       sh: "star",   rot: 380, sw: 15 },
          { l: 48, dl: 3.2, sz: 8,  dur: 4.8, c: C.dustyRose,  sh: "rect",   rot: 520, sw: 22 },
          { l: 62, dl: 2.6, sz: 10, dur: 5.5, c: C.marigold,   sh: "circle", rot: 460, sw: 28 },
          { l: 75, dl: 3.8, sz: 7,  dur: 4.4, c: C.gold,       sh: "star",   rot: 580, sw: 18 },
          { l: 88, dl: 3.3, sz: 5,  dur: 5.1, c: C.blush,      sh: "rect",   rot: 340, sw: 14 },
          // Sparkle stars
          { l: 15, dl: 0.4, sz: 12, dur: 3.0, c: C.gold,       sh: "sparkle", rot: 360, sw: 10 },
          { l: 40, dl: 1.6, sz: 10, dur: 3.5, c: C.marigold,   sh: "sparkle", rot: 360, sw: 8 },
          { l: 68, dl: 0.9, sz: 14, dur: 2.8, c: C.gold,       sh: "sparkle", rot: 360, sw: 12 },
          { l: 85, dl: 2.1, sz: 11, dur: 3.2, c: C.marigold,   sh: "sparkle", rot: 360, sw: 10 },
          { l: 50, dl: 3.0, sz: 13, dur: 3.4, c: C.gold,       sh: "sparkle", rot: 360, sw: 8 },
        ].map((p, i) => {
          if (p.sh === "sparkle") {
            // 4-point star sparkle
            return (
              <svg
                key={i}
                viewBox="0 0 20 20"
                style={{
                  position: "absolute",
                  left: `${p.l}%`,
                  top: `${20 + (i * 7) % 60}%`,
                  width: p.sz,
                  height: p.sz,
                  animation: `sparkPulse ${p.dur}s ease-in-out ${p.dl}s infinite`,
                }}
              >
                <path d="M10,0 L12,7 L20,8 L13,12 L15,20 L10,14 L5,20 L7,12 L0,8 L8,7 Z" fill={p.c} opacity="0.5" />
              </svg>
            );
          }

          const borderRadius = p.sh === "circle" ? "50%"
            : p.sh === "star" ? "2px"
            : `${p.sz > 7 ? 2 : 1}px`;

          const width  = p.sh === "star" ? p.sz * 0.4 : p.sz;
          const height = p.sh === "rect" ? p.sz * 0.4 : p.sz;

          return (
            <span
              key={i}
              style={{
                position: "absolute",
                left: `${p.l}%`,
                top: -10,
                width,
                height,
                background: p.c,
                borderRadius,
                opacity: 0,
                ["--rot" as string]: `${p.rot}deg`,
                ["--sway" as string]: `${p.sw}px`,
                animation: `confettiFall ${p.dur}s ease-in ${p.dl}s infinite, confettiSway ${p.dur * 0.7}s ease-in-out ${p.dl}s infinite`,
              } as React.CSSProperties}
            />
          );
        })}
      </div>
      <div ref={ref} className="reveal" style={{ maxWidth: 440, margin: "0 auto", textAlign: "center" }}>

        {/* Eyebrow */}
        <p style={{
          fontFamily: F.body,
          fontSize: "0.62rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          color: C.gold,
          marginBottom: 6,
        }}>
          Save the Date
        </p>

        {/* Title */}
        <p style={{
          fontFamily: F.display,
          fontSize: "clamp(1.3rem, 5vw, 1.75rem)",
          fontWeight: 400,
          color: C.charcoal,
          marginBottom: 4,
          letterSpacing: "-0.01em",
        }}>
          Our forever begins in
        </p>

        {/* Date accent */}
        <p style={{
          fontFamily: F.script,
          fontSize: "clamp(0.9rem, 3vw, 1.05rem)",
          color: C.dustyRose,
          marginBottom: 16,
          opacity: 0.85,
        }}>
          2–4 December 2026
        </p>

        {/* Countdown blocks */}
        {time.started ? (
          <p style={{ fontFamily: F.display, fontSize: "1.5rem", fontWeight: 400, color: C.charcoal, marginBottom: 16 }}>
            The celebrations have begun! 🎉
          </p>
        ) : (
          <div
            aria-live="polite"
            aria-atomic="true"
            aria-label={`${time.days} days, ${time.hours} hours, ${time.minutes} minutes, ${time.seconds} seconds`}
            style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 8, marginBottom: 18 }}
          >
            <Block value={time.days}    label="Days" />
            <span aria-hidden="true" style={{ fontFamily: F.display, fontSize: "1.4rem", color: C.gold, marginTop: 10, opacity: 0.5 }}>:</span>
            <Block value={time.hours}   label="Hours" />
            <span aria-hidden="true" style={{ fontFamily: F.display, fontSize: "1.4rem", color: C.gold, marginTop: 10, opacity: 0.5 }}>:</span>
            <Block value={time.minutes} label="Mins" />
            <span aria-hidden="true" style={{ fontFamily: F.display, fontSize: "1.4rem", color: C.gold, marginTop: 10, opacity: 0.5 }}>:</span>
            <Block value={time.seconds} label="Secs" />
          </div>
        )}

        {/* Thin gold rule */}
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(182,150,89,0.35),transparent)", maxWidth: 160, margin: "0 auto 16px" }} />

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" as const }}>
          <button onClick={onCalendar}
            style={{ ...styles.btnPrimary, ...styles.btnSm, gap: 6 }}
            aria-label="Add to calendar">
            <CalendarPlus size={13} /> Calendar
          </button>
          <button onClick={onShare}
            style={{ ...styles.btnOutline, ...styles.btnSm, gap: 6 }}
            aria-label="Share on WhatsApp">
            <Share2 size={13} /> Share
          </button>
        </div>
      </div>
    </section>
  );
}
