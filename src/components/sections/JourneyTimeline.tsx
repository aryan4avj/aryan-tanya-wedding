"use client";

import { useState, useEffect, useRef } from "react";
import { Heart, ChevronLeft, ChevronRight, X } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSwipe } from "@/hooks/useSwipe";
import { timelineMilestones } from "@/data/timeline";
import { C, F, styles } from "@/lib/styles";
import type { TimelineMilestone, TimelineImage } from "@/data/timeline";

// ─── Full-screen lightbox ─────────────────────────────────────────────────────
function Lightbox({ images, index: initialIdx, year, onClose }: {
  images: TimelineImage[];
  index: number;
  year: string;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIdx);
  const total = images.length;
  const current = images[idx];
  // Loops in both directions (last -> first, first -> last), same as the circle collage
  const goNext = () => setIdx(i => (i + 1) % total);
  const goPrev = () => setIdx(i => (i - 1 + total) % total);
  const swipe = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrev });
  // Neighbours are preloaded so stepping round the loop feels instant
  const neighbours = total > 1
    ? [...new Set([(idx + 1) % total, (idx - 1 + total) % total])].filter(i => i !== idx)
    : [];

  useEffect(() => {
    // Lock scroll + hide bottom nav
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.setAttribute("data-gallery-open", "true");

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowRight") setIdx(i => (i + 1) % total);
      if (e.key === "ArrowLeft")  setIdx(i => (i - 1 + total) % total);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.removeAttribute("data-gallery-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [total, onClose]);

  if (!current) return null;

  return (
    <div
      onClick={onClose}
      role="dialog" aria-modal="true"
      style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(22,16,12,0.96)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", width: "100%", maxWidth: 500, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        {/* Close */}
        <button onClick={onClose} aria-label="Close" style={{ alignSelf: "flex-end", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <X size={18} color="#fff" />
        </button>

        {/* Image - swipeable, respects portrait/landscape */}
        <div {...swipe} style={{
          position: "relative",
          width: "100%",
          // For portrait: limit height so it fits screen; for landscape: use full width
          maxHeight: "65dvh",
          aspectRatio: current.orientation === "portrait" ? "9/16" : current.orientation === "square" ? "1/1" : "4/3",
          borderRadius: 14,
          overflow: "hidden",
          background: C.champagne,
        }}>
          <style>{`@keyframes lbFade { from { opacity: 0; } to { opacity: 1; } }`}</style>
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            style={{ objectFit: "contain", objectPosition: "center", animation: "lbFade 0.3s ease" }}
            sizes="(max-width: 600px) 95vw, 500px"
            priority
          />
        </div>

        {/* Off-screen copies of the previous/next photos so they're already loaded */}
        {neighbours.length > 0 && (
          <div aria-hidden="true" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none" }}>
            {neighbours.map(i => (
              <Image key={images[i].src} src={images[i].src} alt="" fill sizes="(max-width: 600px) 95vw, 500px" loading="eager" />
            ))}
          </div>
        )}

        {/* Caption */}
        <div style={{ textAlign: "center" }}>
          {year && <p style={{ fontFamily: F.body, fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(229,170,70,0.8)", marginBottom: 5 }}>{year}</p>}
          <p style={{ fontFamily: F.body, fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>{current.alt}</p>
        </div>

        {/* Dot nav */}
        {total > 1 && (
          <>
            {/* Always shown - the gallery wraps around at both ends */}
            <button onClick={goPrev} aria-label="Previous photo" style={{ position: "absolute", left: -4, top: "40%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.14)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronLeft size={20} color="#fff" />
            </button>
            <button onClick={goNext} aria-label="Next photo" style={{ position: "absolute", right: -4, top: "40%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.14)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={20} color="#fff" />
            </button>
            <div style={{ display: "flex", gap: 6 }}>
              {images.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} aria-label={`Photo ${i + 1} of ${total}`} aria-current={i === idx ? "true" : undefined} style={{ width: i === idx ? 20 : 7, height: 7, borderRadius: 4, background: i === idx ? C.gold : "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.25s" }} />
              ))}
            </div>
          </>
        )}

        <p style={{ fontFamily: F.body, fontSize: "0.62rem", color: "rgba(255,255,255,0.22)", letterSpacing: "0.08em" }}>Tap outside to close</p>
      </div>
    </div>
  );
}

// ─── Circular photo collage - centre rotates one at a time, loops ─────────────
function CircleCollage({ images, onOpen }: { images: TimelineImage[]; onOpen: (i: number) => void }) {
  const [centre, setCentre] = useState(0);
  const total = images.length;

  const prev = (centre - 1 + total) % total;
  const next = (centre + 1) % total;

  const go = (dir: 1 | -1) => setCentre(c => (c + dir + total) % total);
  const swipe = useSwipe({ onSwipeLeft: () => go(1), onSwipeRight: () => go(-1) });

  if (total === 1) {
    return (
      <button onClick={() => onOpen(0)} aria-label="View photo"
        style={{ width: 160, height: 160, borderRadius: "50%", overflow: "hidden", border: `3px solid rgba(182,150,89,0.35)`, boxShadow: `0 0 0 5px rgba(244,235,221,0.7), 0 8px 28px rgba(66,58,54,0.14)`, position: "relative", cursor: "pointer", background: C.champagne, padding: 0 }}>
        <Image src={images[0].src} alt={images[0].alt} fill style={{ objectFit: "cover", objectPosition: images[0].focalPosition ?? "center" }} sizes="160px" />
      </button>
    );
  }

  // Show left neighbour | centre | right neighbour
  const slots = total === 2
    ? [images[prev], images[centre]]
    : [images[prev], images[centre], images[next]];

  const slotIdx = total === 2
    ? [prev, centre]
    : [prev, centre, next];

  const slotSizes  = total === 2 ? [130, 130]        : [100, 150, 100];
  const slotOffset = total === 2 ? [0, 0]            : [18, 0, 18];   // flanking drops down
  const slotZ      = total === 2 ? [1, 2]            : [1, 3, 1];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>

      {/* Circle row - swipeable */}
      <div {...swipe} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, position: "relative", touchAction: "pan-y" }}>

        {/* Prev arrow - left */}
        {total > 1 && (
          <button onClick={() => go(-1)} aria-label="Previous photo"
            style={{ position: "absolute", left: -18, top: "50%", transform: "translateY(-50%)", width: 30, height: 30, borderRadius: "50%", background: "rgba(255,249,241,0.9)", border: "1px solid rgba(182,150,89,0.3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, boxShadow: "0 2px 8px rgba(66,58,54,0.1)" }}>
            <ChevronLeft size={14} color={C.charcoal} />
          </button>
        )}

        {slots.map((img, i) => {
          const isCentre = total === 2 ? i === 1 : i === 1;
          const sz = slotSizes[i];
          const mt = slotOffset[i];
          const z  = slotZ[i];
          return (
            <button
              key={slotIdx[i]}
              onClick={() => onOpen(slotIdx[i])}
              aria-label={`View photo ${slotIdx[i] + 1}`}
              style={{
                width: sz, height: sz,
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                border: `${isCentre ? 3 : 2}px solid rgba(182,150,89,${isCentre ? 0.45 : 0.25})`,
                boxShadow: isCentre
                  ? `0 0 0 5px rgba(244,235,221,0.9), 0 10px 28px rgba(66,58,54,0.16)`
                  : `0 0 0 3px rgba(244,235,221,0.7)`,
                position: "relative",
                cursor: "pointer",
                background: C.champagne,
                padding: 0,
                marginTop: mt,
                zIndex: z,
                transition: "all 0.35s cubic-bezier(0.34,1.2,0.64,1)",
                opacity: isCentre ? 1 : 0.72,
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                style={{ objectFit: "cover", objectPosition: img.focalPosition ?? "center", transition: "opacity 0.3s ease" }}
                sizes={`${sz}px`}
              />
            </button>
          );
        })}

        {/* Next arrow - right */}
        {total > 1 && (
          <button onClick={() => go(1)} aria-label="Next photo"
            style={{ position: "absolute", right: -18, top: "50%", transform: "translateY(-50%)", width: 30, height: 30, borderRadius: "50%", background: "rgba(255,249,241,0.9)", border: "1px solid rgba(182,150,89,0.3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, boxShadow: "0 2px 8px rgba(66,58,54,0.1)" }}>
            <ChevronRight size={14} color={C.charcoal} />
          </button>
        )}
      </div>

      {/* Dot indicators */}
      {total > 1 && (
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {images.map((_, i) => (
            <button key={i} onClick={() => setCentre(i)} aria-label={`Photo ${i + 1}`}
              style={{ width: i === centre ? 18 : 6, height: 6, borderRadius: 3, background: i === centre ? C.gold : "rgba(182,150,89,0.25)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.25s" }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Single milestone card ────────────────────────────────────────────────────
function MilestoneCard({ milestone, index: cardIdx, onImageOpen }: {
  milestone: TimelineMilestone;
  index: number;
  onImageOpen: (images: TimelineImage[], idx: number, year: string) => void;
}) {
  const ref = useScrollReveal<HTMLDivElement>();
  const isLeft = cardIdx % 2 === 0; // alternate left/right on desktop, always centred on mobile

  // Silent gap
  if (milestone.isSilent) {
    return (
      <div ref={ref} className="reveal" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0 4px" }}>
        <div style={{ width: 1, height: 36, background: `linear-gradient(to bottom, rgba(182,150,89,0.3), transparent)` }} />
        {milestone.caption && (
          <p style={{ fontFamily: F.body, fontSize: "0.95rem", fontStyle: "italic", color: C.secondary, textAlign: "center", margin: "10px 20px" }}>
            "{milestone.caption}"
          </p>
        )}
        <div style={{ width: 1, height: 36, background: `linear-gradient(to bottom, transparent, rgba(182,150,89,0.3))` }} />
      </div>
    );
  }

  const isSpecial = milestone.isEngagement || milestone.isProposal;
  const hasImages = milestone.images.length > 0;

  return (
    <div
      ref={ref}
      className="reveal"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 8, position: "relative" }}
    >
      {/* Node dot on the centre line */}
      <div style={{
        width: isSpecial ? 28 : 20,
        height: isSpecial ? 28 : 20,
        borderRadius: "50%",
        background: isSpecial ? C.gold : C.ivory,
        border: `2px solid ${isSpecial ? C.gold : "rgba(182,150,89,0.5)"}`,
        boxShadow: isSpecial ? `0 0 0 5px rgba(229,170,70,0.18)` : `0 0 0 3px rgba(244,235,221,0.9)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 2, flexShrink: 0, marginBottom: 14,
      }} aria-hidden="true">
        {isSpecial && <Heart size={11} color="#fff" fill="#fff" />}
      </div>

      {/* Content card */}
      <div style={{
        background: isSpecial ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.72)",
        backdropFilter: "blur(12px)",
        borderRadius: 20,
        border: isSpecial ? `1.5px solid rgba(182,150,89,0.35)` : `1px solid rgba(182,150,89,0.2)`,
        boxShadow: isSpecial ? "0 4px 28px rgba(66,58,54,0.1)" : "0 2px 16px rgba(66,58,54,0.06)",
        padding: "18px 18px 16px",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Sparkle for special milestones */}
        {isSpecial && (
          <div aria-hidden="true" style={{ position: "absolute", top: -4, right: -4, opacity: 0.25 }}>
            <svg viewBox="0 0 60 60" width="60" fill="none">
              <path d="M30,6 L32,25 L51,23 L34,30 L51,37 L32,35 L30,54 L28,35 L9,37 L26,30 L9,23 L28,25 Z" fill={C.marigold} />
            </svg>
          </div>
        )}

        {/* Year */}
        {milestone.year && (
          <p style={{ fontFamily: F.body, fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: C.gold, marginBottom: 4 }}>
            {milestone.year}
          </p>
        )}

        {/* Title */}
        <h3 style={{ fontFamily: F.display, fontSize: "clamp(1.1rem, 4vw, 1.4rem)", fontWeight: 400, color: C.charcoal, marginBottom: hasImages ? 14 : 8, lineHeight: 1.2 }}>
          {milestone.title}
        </h3>

        {/* Circular collage or single image */}
        {hasImages && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <CircleCollage
              images={milestone.images}
              onOpen={i => onImageOpen(milestone.images, i, milestone.year)}
            />
          </div>
        )}

        {/* Caption */}
        {milestone.caption && (
          <p style={{ fontFamily: F.body, fontSize: "0.8rem", fontStyle: "italic", color: C.secondary, textAlign: "center", lineHeight: 1.5 }}>
            "{milestone.caption}"
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Animated vertical line with arrow ───────────────────────────────────────
function TimelineLine({ totalHeight }: { totalHeight: number }) {
  const ref = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(0); // 0–1 progress

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Animate draw as user scrolls
        const onScroll = () => {
          const rect = el.getBoundingClientRect();
          const vh   = window.innerHeight;
          // Progress: 0 when top enters viewport, 1 when bottom leaves
          const p = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh)));
          setDrawn(p);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
      },
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const h       = totalHeight || 800;
  // Curvy SVG path down the centre
  const path    = `M 50 0 C 50 ${h * 0.15} 50 ${h * 0.15} 50 ${h * 0.3} C 50 ${h * 0.45} 50 ${h * 0.45} 50 ${h * 0.6} C 50 ${h * 0.75} 50 ${h * 0.75} 50 ${h}`;
  const pathLen = h * 1.05; // approximate

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)", width: 100, height: "100%", pointerEvents: "none", zIndex: 0 }}
    >
      <svg viewBox={`0 0 100 ${h}`} width="100" height={h} style={{ overflow: "visible" }}>
        {/* Background track */}
        <path d={path} stroke="rgba(182,150,89,0.12)" strokeWidth="2" fill="none" />

        {/* Animated gold draw */}
        <path
          ref={ref}
          d={path}
          stroke="url(#goldGrad)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={pathLen}
          strokeDashoffset={pathLen * (1 - drawn)}
          style={{ transition: "stroke-dashoffset 0.15s ease" }}
        />

        {/* Arrow at current draw tip */}
        {drawn > 0.02 && drawn < 0.99 && (() => {
          // Approximate tip Y position
          const tipY = drawn * h;
          return (
            <g transform={`translate(50, ${tipY})`} style={{ transition: "transform 0.15s ease" }}>
              <circle r="5" fill={C.gold} opacity="0.9" />
              {/* Arrow chevron */}
              <path d="M -4 -3 L 0 3 L 4 -3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          );
        })()}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={C.gold} stopOpacity="0.6" />
            <stop offset="100%" stopColor={C.dustyRose} stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function JourneyTimeline() {
  const [lightbox, setLightbox] = useState<{ images: TimelineImage[]; idx: number; year: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(800);
  const endRef = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) setContainerHeight(containerRef.current.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <>
      <section id="journey" aria-labelledby="journey-heading" style={{
        background: C.champagne,
        backgroundImage: `
          radial-gradient(ellipse at 85% 10%, rgba(213,154,145,0.14) 0%, transparent 45%),
          radial-gradient(ellipse at 10% 90%, rgba(168,182,157,0.12) 0%, transparent 45%)
        `,
        padding: "clamp(1.75rem, 5vw, 2.75rem) clamp(1.25rem, 5vw, 2rem)",
      }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <SectionHeading
            eyebrow="Our Story"
            title="From Then to Forever"
            accent="A love that grew with time"
          />

          {/* Timeline container with animated centre line */}
          <div ref={containerRef} style={{ position: "relative", paddingTop: 8 }}>
            <TimelineLine totalHeight={containerHeight} />

            {/* Milestone cards - stacked vertically, centred */}
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              {timelineMilestones.map((m, i) => (
                <MilestoneCard
                  key={m.id}
                  milestone={m}
                  index={i}
                  onImageOpen={(imgs, idx, year) => setLightbox({ images: imgs, idx, year })}
                />
              ))}
            </div>
          </div>

          {/* End - no card, just a quiet close to the timeline */}
        </div>
      </section>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.idx}
          year={lightbox.year}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}

