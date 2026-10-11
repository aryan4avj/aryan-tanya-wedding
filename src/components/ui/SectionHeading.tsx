"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { C, F } from "@/lib/styles";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  accent?: string;
  centered?: boolean;
}

export default function SectionHeading({ eyebrow, title, subtitle, accent, centered = true }: SectionHeadingProps) {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="reveal"
      style={{
        textAlign: centered ? "center" : "left",
        marginBottom: "clamp(1.25rem, 4vw, 1.75rem)",
      }}
    >
      {eyebrow && (
        <p style={{
          fontFamily: F.body,
          fontSize: "0.62rem",
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: C.gold,
          marginBottom: 8,
        }}>
          {eyebrow}
        </p>
      )}

      <h2 style={{
        fontFamily: F.display,
        fontSize: "clamp(1.8rem, 7vw, 2.8rem)",
        fontWeight: 400,
        lineHeight: 1.1,
        color: C.charcoal,
        letterSpacing: "-0.01em",
        margin: 0,
      }}>
        {title}
      </h2>

      {accent && (
        <p aria-hidden="true" style={{
          fontFamily: F.script,
          fontSize: "clamp(0.85rem, 3vw, 1.05rem)",
          color: C.dustyRose,
          marginTop: 4,
          marginBottom: 0,
        }}>
          {accent}
        </p>
      )}

      {/* Gold divider */}
      <div style={{
        width: 60,
        height: 1,
        background: `linear-gradient(90deg, ${centered ? "transparent, " : ""}rgba(182,150,89,0.5), transparent)`,
        margin: centered ? "10px auto 0" : "10px 0 0",
      }} />

      {subtitle && (
        <p style={{
          fontFamily: F.body,
          fontSize: "clamp(0.78rem, 2.5vw, 0.875rem)",
          lineHeight: 1.55,
          color: C.secondary,
          marginTop: 10,
          maxWidth: 480,
          marginLeft: centered ? "auto" : 0,
          marginRight: centered ? "auto" : 0,
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
