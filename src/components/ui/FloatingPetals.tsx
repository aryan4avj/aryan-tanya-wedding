"use client";

import { useEffect, useRef } from "react";

const PETAL_COUNT = 12;

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  driftDuration: number;
  delay: number;
  color: string;
  shape: number; // 0=round, 1=elongated, 2=teardrop
}

const COLORS = [
  "rgba(243,222,217,0.75)",
  "rgba(213,154,145,0.6)",
  "rgba(229,170,70,0.5)",
  "rgba(168,182,157,0.55)",
  "rgba(244,235,221,0.7)",
];

function randomPetal(id: number): Petal {
  return {
    id,
    left:         Math.random() * 100,
    size:         Math.random() * 10 + 8,
    duration:     Math.random() * 8 + 10,
    driftDuration:Math.random() * 4 + 5,
    delay:        Math.random() * 15,
    color:        COLORS[Math.floor(Math.random() * COLORS.length)],
    shape:        Math.floor(Math.random() * 3),
  };
}

export default function FloatingPetals() {
  const petals = useRef<Petal[]>(
    Array.from({ length: PETAL_COUNT }, (_, i) => randomPetal(i))
  );

  // Respect reduced motion
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-10"
    >
      {petals.current.map((p) => {
        const borderRadius =
          p.shape === 0 ? "50% 45% 55% 40%"
          : p.shape === 1 ? "50% 30% 50% 30%"
          : "50% 60% 40% 70%";
        return (
          <span
            key={p.id}
            className="absolute"
            style={{
              left:             `${p.left}%`,
              top:              "-20px",
              width:            `${p.size}px`,
              height:           `${p.size * 0.85}px`,
              background:       p.color,
              borderRadius,
              animation: `petalFall ${p.duration}s ${p.delay}s linear infinite,
                          petalDrift ${p.driftDuration}s ${p.delay}s ease-in-out infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
