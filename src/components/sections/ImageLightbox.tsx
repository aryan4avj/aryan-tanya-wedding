"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { C, F } from "@/lib/styles";
import { useSwipe } from "@/hooks/useSwipe";
import type { TimelineImage } from "@/data/timeline";

interface ImageLightboxProps {
  images: TimelineImage[];
  initialIndex: number;
  year?: string;
  onClose: () => void;
}

export default function ImageLightbox({ images, initialIndex, year, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [imgError, setImgError] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const current = images[index];
  const goNext = () => setIndex(i => Math.min(i + 1, images.length - 1));
  const goPrev = () => setIndex(i => Math.max(i - 1, 0));
  const swipe = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrev });

  useEffect(() => { setImgError(false); }, [index]);

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.setAttribute("data-gallery-open", "true");
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.removeAttribute("data-gallery-open");
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     { e.preventDefault(); onClose(); }
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft")  goPrev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  if (!current) return null;

  // Button style reused for all overlay controls
  const ctrlBtn: React.CSSProperties = {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.2)",
    cursor: "pointer",
    zIndex: 10,
    padding: 0,
  };

  return (
    // Full-screen dark overlay - clicking the backdrop closes
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo${year ? ` from ${year}` : ""}`}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "rgba(22,16,12,0.95)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      {/* Inner panel - click doesn't bubble to backdrop */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 600,
          gap: 16,
        }}
      >
        {/* ── Close button ── top-right of the image area */}
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close photo"
          style={{ ...ctrlBtn, top: -52, right: 0, position: "relative", alignSelf: "flex-end", flexShrink: 0 }}
        >
          <X size={20} color="#fff" />
        </button>

        {/* ── Image frame ── strictly bounded */}
        <div style={{ position: "relative", width: "100%" }}>
          {/* Prev arrow */}
          {index > 0 && (
            <button
              onClick={() => setIndex(i => i - 1)}
              aria-label="Previous photo"
              style={{ ...ctrlBtn, left: -12, top: "50%", transform: "translateY(-50%)" }}
            >
              <ChevronLeft size={20} color="#fff" />
            </button>
          )}

          {/* Next arrow */}
          {index < images.length - 1 && (
            <button
              onClick={() => setIndex(i => i + 1)}
              aria-label="Next photo"
              style={{ ...ctrlBtn, right: -12, top: "50%", transform: "translateY(-50%)" }}
            >
              <ChevronRight size={20} color="#fff" />
            </button>
          )}

          {/* The image itself - swipeable, fixed height */}
          <div {...swipe} style={{
            width: "100%",
            // Max height keeps it well within the viewport on any phone
            maxHeight: "min(65vh, 520px)",
            aspectRatio: current.orientation === "portrait"
              ? "3 / 4"
              : current.orientation === "square"
              ? "1 / 1"
              : "4 / 3",
            borderRadius: 16,
            overflow: "hidden",
            background: C.champagne,
            position: "relative",
          }}>
            {imgError ? (
              <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{ fontFamily: F.body, fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>Photo not yet available</span>
              </div>
            ) : (
              <Image
                key={current.src + index}
                src={current.src}
                alt={current.alt}
                fill
                style={{ objectFit: "cover", objectPosition: current.focalPosition ?? "center center" }}
                sizes="(max-width: 600px) 95vw, 600px"
                priority
                onError={() => setImgError(true)}
              />
            )}
          </div>
        </div>

        {/* ── Caption ── */}
        <div style={{ textAlign: "center", paddingBottom: 4 }}>
          {year && (
            <p style={{
              fontFamily: F.body,
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(229,170,70,0.85)",
              marginBottom: 6,
            }}>
              {year}
            </p>
          )}
          <p style={{
            fontFamily: F.body,
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.5,
          }}>
            {current.alt}
          </p>
        </div>

        {/* ── Dot navigation ── */}
        {images.length > 1 && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Photo ${i + 1}`}
                aria-current={i === index}
                style={{
                  width:  i === index ? 22 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === index ? "rgba(229,170,70,0.9)" : "rgba(255,255,255,0.3)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.25s ease",
                }}
              />
            ))}
          </div>
        )}

        {/* ── Tap outside hint (mobile) ── */}
        <p style={{
          fontFamily: F.body,
          fontSize: "0.65rem",
          color: "rgba(255,255,255,0.25)",
          letterSpacing: "0.1em",
        }}>
          Tap outside to close
        </p>
      </div>
    </div>
  );
}
