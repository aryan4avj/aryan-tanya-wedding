"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { C, F } from "@/lib/styles";

export default function InvitationLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fading,   setFading]   = useState(false);

  useEffect(() => {
    const start    = performance.now();
    const duration = 2000;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setProgress(p);
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setFading(true);
          setTimeout(onComplete, 600);
        }, 300);
      }
    };
    requestAnimationFrame(tick);
  }, [onComplete]);

  return (
    <div
      role="status"
      aria-label="Loading invitation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: C.ivory,
        opacity: fading ? 0 : 1,
        transition: "opacity 0.6s ease",
      }}
    >
      {/* Logo + tagline */}
      <div style={{ position: "relative", width: 170, height: 170, marginBottom: 16 }}>
        {/* Soft glow behind the logo */}
        <div style={{
          position: "absolute",
          inset: 10,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(244,235,221,0.9) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <Image
          src="/assets/couple/logo.png"
          alt="Aryan & Tanya monogram"
          fill
          style={{ objectFit: "contain" }}
          priority
          sizes="170px"
        />
      </div>

      {/* Tagline below logo */}
      <p style={{
        fontFamily: F.body,
        fontSize: "0.65rem",
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: C.secondary,
        marginBottom: 22,
        opacity: 0.75,
      }}>
        Aryan &nbsp;·&nbsp; Tanya
      </p>

      {/* Label */}
      <p style={{
        fontFamily: F.body,
        fontSize: "0.72rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: C.secondary,
        marginBottom: 20,
        opacity: 0.8,
      }}>
        Preparing your invitation
      </p>

      {/* Progress bar */}
      <div style={{ width: 200, height: 2, background: "rgba(182,150,89,0.15)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          width: `${progress * 100}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${C.gold}, ${C.dustyRose})`,
          borderRadius: 2,
          transition: "width 0.05s linear",
        }} />
      </div>
    </div>
  );
}
