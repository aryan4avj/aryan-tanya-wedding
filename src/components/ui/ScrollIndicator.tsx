"use client";

import { useEffect, useState, useRef } from "react";
import { C } from "@/lib/styles";

export default function ScrollIndicator() {
  const [visible,   setVisible]   = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [atBottom,  setAtBottom]  = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const scrollY   = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const p         = maxScroll > 0 ? scrollY / maxScroll : 0;
        setVisible(scrollY > 120);
        setProgress(p);
        setAtBottom(p > 0.92);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!visible) return null;

  const r          = 18;
  const circ       = 2 * Math.PI * r;
  const dashOffset = circ * (1 - progress);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <style>{`
        @keyframes arrowPulse {
          0%, 100% { opacity: 0.5; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(2px); }
        }
        @keyframes arrowUpPulse {
          0%, 100% { opacity: 0.6; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(-2px); }
        }
      `}</style>

      {/* When at bottom: back-to-top button (clickable) */}
      {/* When scrolling: progress indicator (non-interactive) */}
      <div
        onClick={atBottom ? scrollToTop : undefined}
        role={atBottom ? "button" : undefined}
        aria-label={atBottom ? "Back to top" : undefined}
        tabIndex={atBottom ? 0 : -1}
        onKeyDown={atBottom ? (e) => { if (e.key === "Enter" || e.key === " ") scrollToTop(); } : undefined}
        style={{
          position: "fixed",
          right: 14,
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 78px)",
          zIndex: 400,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.4s ease, transform 0.3s ease",
          cursor: atBottom ? "pointer" : "default",
          pointerEvents: atBottom ? "auto" : "none",
          // Slight scale-up when it becomes the back-to-top button
          transform: atBottom ? "scale(1.1)" : "scale(1)",
        }}
      >
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          {/* Background fill */}
          <circle
            cx="22" cy="22" r={r}
            stroke="rgba(182,150,89,0.15)"
            strokeWidth="2"
            fill={atBottom ? "rgba(255,249,241,0.95)" : "rgba(255,249,241,0.7)"}
            style={{ transition: "fill 0.3s" }}
          />

          {/* Progress arc - fades out when at bottom */}
          <circle
            cx="22" cy="22" r={r}
            stroke={C.gold}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 22 22)"
            style={{ transition: "stroke-dashoffset 0.2s linear, opacity 0.3s" }}
            opacity={atBottom ? 0 : 1}
          />

          {/* Full gold ring when at bottom */}
          {atBottom && (
            <circle
              cx="22" cy="22" r={r}
              stroke={C.gold}
              strokeWidth="2"
              fill="none"
              opacity="0.7"
            />
          )}

          {atBottom ? (
            /* Up arrow - back to top */
            <g style={{ animation: "arrowUpPulse 1.4s ease-in-out infinite" }}>
              <path
                d="M22,28 L22,16"
                stroke={C.gold}
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M16,22 L22,15 L28,22"
                stroke={C.gold}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          ) : (
            /* Down arrow - scroll progress */
            <g style={{ animation: "arrowPulse 1.6s ease-in-out infinite" }}>
              <path
                d="M22,15 L22,25"
                stroke={C.gold}
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M17,21 L22,27 L27,21"
                stroke={C.gold}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          )}
        </svg>
      </div>
    </>
  );
}
