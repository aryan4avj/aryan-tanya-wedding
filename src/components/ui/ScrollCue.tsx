"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { C, F } from "@/lib/styles";

/**
 * ScrollCue - tells guests there is more below the home screen.
 *
 * Three layers, from subtle to playful:
 *  1. A labelled, animated cue at the bottom of the hero. Tap / click / Enter scrolls to the
 *     next section, so the bottom nav isn't the only way down.
 *  2. A rotating teaser of what's further down ("to meet our families", "for the countdown"...).
 *     Only shown on taller screens where there's room for the extra line.
 *  3. An idle "peek": if the guest hasn't scrolled after a few seconds, the page lifts to show
 *     a glimpse of the next section and springs back. At most two peeks, cancelled by any
 *     interaction, and skipped entirely when the guest prefers reduced motion.
 *
 * Must be rendered inside the hero <section>; the section's next sibling is the scroll target.
 */

const TEASERS = [
  "to meet our families",
  "for the countdown",
  "for the celebrations",
  "for our story",
  "for venues & RSVP",
] as const;

// Darker gold for the small label so it stays readable on ivory (~4.8:1; C.gold alone is ~2.6:1)
const GOLD_INK = "#8A6A2E";

const AWAY_AFTER_PX = 48;              // hide the cue once the guest has started scrolling
const TEASER_INTERVAL_MS = 2600;
const PEEK_SCHEDULE_MS = [3800, 9000]; // first peek 3.8s after the hero appears, second 9s later
const PEEK_DURATION_MS = 1300;
const REVEAL_LEAD_MS = 350;            // un-hide the next section's reveal content before lifting
const DESKTOP_NAV_PX = 64;             // fixed top nav on md+ screens
const INTERACTIONS = ["pointerdown", "touchstart", "wheel", "keydown"] as const;

// Keep in sync with the hero's compact layout (side-by-side CTAs)
const COMPACT_MQ = "(max-height: 600px), (min-width: 768px) and (max-height: 640px)";

// ── External stores (scroll position, reduced-motion preference) ──────────────
function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}
const getScrolledAway = () => window.scrollY > AWAY_AFTER_PX;

const REDUCED_MOTION_MQ = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_MQ);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_MQ).matches;
const getServerSnapshot = () => false;

// ── Motion ────────────────────────────────────────────────────────────────────
// Flick up, hold for a beat so the next section registers, drop back with a small overshoot.
const peekFrames = (distance: number): Keyframe[] => [
  { transform: "translateY(0)", easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  { transform: `translateY(${-distance}px)`, offset: 0.3 },
  { transform: `translateY(${-distance}px)`, offset: 0.42, easing: "cubic-bezier(0.55, 0, 0.45, 1)" },
  { transform: `translateY(${Math.round(distance * 0.06)}px)`, offset: 0.78, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  { transform: "translateY(0)" },
];

// Two little downward tugs on the cue as the page settles
const TUG_FRAMES: Keyframe[] = [
  { transform: "translateY(0)" },
  { transform: "translateY(7px)", offset: 0.22 },
  { transform: "translateY(0)", offset: 0.48 },
  { transform: "translateY(4px)", offset: 0.7 },
  { transform: "translateY(0)" },
];

// Document-relative top that ignores in-flight transforms (unlike getBoundingClientRect)
function documentTop(el: HTMLElement) {
  let y = 0;
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
    y += node.offsetTop;
  }
  return y;
}

function Chevrons({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path className="sc-c1" d="M6 6.5 12 12l6-5.5" />
      <path className="sc-c2" d="M6 12.5 12 18l6-5.5" />
    </svg>
  );
}

export default function ScrollCue() {
  const cueRef = useRef<HTMLButtonElement>(null);
  const peeksRef = useRef<Animation[]>([]);
  const [teaser, setTeaser] = useState(0);

  const scrolledAway  = useSyncExternalStore(subscribeScroll, getScrolledAway, getServerSnapshot);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getServerSnapshot);

  // Rotate the teaser while the cue is on screen
  useEffect(() => {
    if (reducedMotion || scrolledAway) return;
    const id = window.setInterval(() => setTeaser((i) => (i + 1) % TEASERS.length), TEASER_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, scrolledAway]);

  // Idle peek - the page itself demonstrates that it scrolls
  useEffect(() => {
    if (reducedMotion) return;
    const cue = cueRef.current;
    const hero = cue?.closest("section");
    const next = hero?.nextElementSibling;
    if (!cue || !hero || !(next instanceof HTMLElement) || typeof hero.animate !== "function") return;

    const inner = cue.querySelector<HTMLElement>(".sc-inner");
    const running = peeksRef.current;
    const timers = new Set<number>();
    let cancelled = false;

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (!cancelled) fn();
      }, ms);
      timers.add(id);
    };

    const detach = () => {
      INTERACTIONS.forEach((type) => window.removeEventListener(type, cancel));
      window.removeEventListener("scroll", onScroll);
    };
    // Any sign of life from the guest stops future peeks (a running one just finishes)
    function cancel() {
      if (cancelled) return;
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      detach();
    }
    function onScroll() {
      if (window.scrollY > 4) cancel();
    }

    const peek = (index: number) => {
      if (window.scrollY > 4) return cancel();

      if (document.visibilityState === "visible") {
        // Show the next section's scroll-reveal content now, so the glimpse isn't blank
        next.querySelectorAll(".reveal:not(.visible)").forEach((el) => el.classList.add("visible"));

        // Lift past whatever covers the bottom of the hero (the mobile nav) plus enough to show
        // the next section's heading and the top of its content
        const covered = parseFloat(getComputedStyle(hero).paddingBottom) || 0;
        const full = Math.min(window.innerHeight * 0.26, Math.max(84, covered + 84));
        const distance = Math.round(index === 0 ? full : full * 0.75);

        later(() => {
          const frames = peekFrames(distance);
          running.push(hero.animate(frames, { duration: PEEK_DURATION_MS }));
          running.push(next.animate(frames, { duration: PEEK_DURATION_MS }));
          inner?.animate(TUG_FRAMES, { duration: 900, delay: PEEK_DURATION_MS - 200, easing: "ease-in-out" });
        }, REVEAL_LEAD_MS);
      }

      if (index + 1 < PEEK_SCHEDULE_MS.length) later(() => peek(index + 1), PEEK_SCHEDULE_MS[index + 1]);
      else detach();
    };

    later(() => peek(0), PEEK_SCHEDULE_MS[0]);
    INTERACTIONS.forEach((type) => window.addEventListener(type, cancel, { passive: true }));
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancel();
      running.forEach((a) => a.cancel());
      running.length = 0;
    };
  }, [reducedMotion]);

  const scrollDown = () => {
    const next = cueRef.current?.closest("section")?.nextElementSibling;
    if (!(next instanceof HTMLElement)) return;
    const navOffset = window.matchMedia("(min-width: 768px)").matches ? DESKTOP_NAV_PX : 0;
    window.scrollTo({
      top: Math.max(0, documentTop(next) - navOffset),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <>
      <style>{CSS}</style>
      <button
        ref={cueRef}
        type="button"
        className="sc"
        data-scroll-cue=""
        data-away={scrolledAway ? "" : undefined}
        tabIndex={scrolledAway ? -1 : 0}
        aria-label="Scroll down to see the rest of the invitation"
        onClick={scrollDown}
      >
        <span className="sc-inner">
          <Chevrons className="sc-chev sc-chev--side" />
          <span className="sc-label">
            <span className="sc-label-text">Scroll down</span>
          </span>
          <span className="sc-teaser" aria-hidden="true">
            <span key={teaser} className="sc-word">{TEASERS[teaser]}</span>
          </span>
          <Chevrons className="sc-chev sc-chev--main" />
          <Chevrons className="sc-chev sc-chev--side" />
        </span>
      </button>
    </>
  );
}

const CSS = `
  .sc {
    position: relative;
    z-index: 10;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    margin: 0 auto;
    padding: 6px 22px 8px;
    background: none;
    border: none;
    border-radius: 18px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: opacity 0.35s ease, transform 0.35s ease;
  }
  .sc[data-away] { opacity: 0; transform: translateY(8px); pointer-events: none; }

  .sc-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    animation: scIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 1.25s both;
  }

  .sc-label {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    font-family: ${F.body};
    font-size: 10px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: ${GOLD_INK};
    white-space: nowrap;
  }
  .sc-label::before,
  .sc-label::after {
    content: "";
    width: 18px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(182,150,89,0.65));
  }
  .sc-label::after { background: linear-gradient(90deg, rgba(182,150,89,0.65), transparent); }
  .sc-label-text {
    /* letter-spacing trails the last letter; pad the front so the word stays centred */
    padding-left: 0.28em;
    background: linear-gradient(100deg, ${GOLD_INK} 0%, ${GOLD_INK} 40%, #E2C178 50%, ${GOLD_INK} 60%, ${GOLD_INK} 100%);
    background-size: 250% 100%;
    background-position: 100% 0;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: scShimmer 4.2s ease-in-out 2.2s infinite;
  }

  .sc-teaser {
    display: none;
    min-height: 19px;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 15px;
    font-style: italic;
    line-height: 1.25;
    color: ${C.secondary};
    white-space: nowrap;
  }
  .sc-word { display: inline-block; animation: scWord 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }

  .sc-chev { display: block; width: 24px; height: 24px; overflow: visible; }
  .sc-chev--side { display: none; width: 16px; height: 16px; }
  .sc-chev path {
    stroke: ${C.gold};
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .sc-c1 { animation: scCascade 1.8s ease-in-out infinite; }
  .sc-c2 { animation: scCascade 1.8s ease-in-out 0.22s infinite; }
  .sc:hover .sc-chev path { stroke: ${GOLD_INK}; }

  /* Taller screens have room for the teaser line */
  @media (min-height: 720px) {
    .sc-teaser { display: block; }
  }

  /* Short screens (e.g. iPhone SE): one compact row - chevron, label, chevron */
  @media ${COMPACT_MQ} {
    .sc { padding: 4px 18px 6px; min-height: 30px; }
    .sc-inner { flex-direction: row; gap: 7px; }
    .sc-label::before, .sc-label::after { display: none; }
    .sc-teaser, .sc-chev--main { display: none; }
    .sc-chev--side { display: block; }
  }

  @keyframes scIn      { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  @keyframes scWord    { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  @keyframes scCascade {
    0%        { opacity: 0.22; transform: translateY(-4px); }
    35%       { opacity: 1;    transform: translateY(0); }
    75%, 100% { opacity: 0.22; transform: translateY(4px); }
  }
  @keyframes scShimmer {
    0%   { background-position: 100% 0; }
    45%  { background-position: 0% 0; }
    100% { background-position: 0% 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .sc-inner, .sc-word, .sc-c1, .sc-c2, .sc-label-text { animation: none !important; }
  }
`;
