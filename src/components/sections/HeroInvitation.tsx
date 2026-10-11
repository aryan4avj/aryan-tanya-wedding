"use client";

import { useEffect, useRef } from "react";
import { C, F, styles } from "@/lib/styles";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { coupleAssets } from "@/data/wedding";

interface HeroProps {
  onViewEvents: () => void;
  onRSVP: () => void;
  onShare: () => void;
  onCalendar: () => void;
}

const KEYFRAMES = `
  @keyframes hFadeUp   { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes hFadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes hSlideL   { from { opacity:0; transform:translateX(-18px); } to { opacity:1; transform:translateX(0); } }
  @keyframes hSlideR   { from { opacity:0; transform:translateX(18px); }  to { opacity:1; transform:translateX(0); } }
  @keyframes hPop      { 0%{opacity:0;transform:scale(0.5);} 70%{transform:scale(1.12);} 100%{opacity:1;transform:scale(1);} }
  @keyframes hThread   { from{stroke-dashoffset:200;opacity:0;} 10%{opacity:1;} to{stroke-dashoffset:0;opacity:0.45;} }
  @keyframes hFloat    { 0%,100%{transform:translateX(-50%) translateY(0);} 50%{transform:translateX(-50%) translateY(-5px);} }
  @keyframes hDotScroll{ 0%{cy:8;opacity:0.7;} 100%{cy:22;opacity:0;} }
`;

export default function HeroInvitation({ onViewEvents, onRSVP, onShare, onCalendar }: HeroProps) {
  const injected = useRef(false);
  useEffect(() => {
    if (injected.current) return;
    injected.current = true;
    const s = document.createElement("style");
    s.textContent = KEYFRAMES;
    document.head.appendChild(s);
  }, []);

  const a = (name: string, delay: number, dur = 0.6) =>
    `${name} ${dur}s cubic-bezier(0.22,1,0.36,1) ${delay}s both`;

  return (
    <section
      id="home"
      aria-labelledby="hero-names"
      style={{
        position: "relative",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: C.ivory,
        backgroundImage: `
          radial-gradient(ellipse at 90% 5%,  rgba(244,235,221,0.75) 0%, transparent 45%),
          radial-gradient(ellipse at 5%  95%, rgba(243,222,217,0.45) 0%, transparent 45%)
        `,
        overflow: "hidden",
        paddingTop:    "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Party popper confetti falling from top */}
      <style>{`
        @keyframes heroConfettiFall {
          0%   { transform: translateY(-15px) rotate(0deg); opacity: 0; }
          6%   { opacity: 0.85; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(105dvh) rotate(var(--hcr)) scale(0.6); opacity: 0; }
        }
        @keyframes heroConfettiSway {
          0%,100% { margin-left: 0; }
          30%  { margin-left: var(--hcs); }
          70%  { margin-left: calc(var(--hcs) * -0.5); }
        }
      `}</style>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 1 }}>
        {[
          { l:3,  sz:8,  c:C.gold,     sh:"r", dur:5.0, dl:0.2, rot:500, sw:20 },
          { l:8,  sz:6,  c:C.dustyRose, sh:"c", dur:5.8, dl:1.0, rot:360, sw:15 },
          { l:14, sz:10, c:C.marigold,  sh:"r", dur:4.5, dl:0.5, rot:650, sw:28 },
          { l:20, sz:5,  c:C.sage,      sh:"c", dur:6.0, dl:1.8, rot:400, sw:12 },
          { l:26, sz:8,  c:C.gold,      sh:"r", dur:5.2, dl:0.1, rot:550, sw:22 },
          { l:32, sz:7,  c:C.blush,     sh:"c", dur:5.5, dl:2.2, rot:420, sw:18 },
          { l:38, sz:9,  c:C.dustyRose, sh:"r", dur:4.8, dl:0.7, rot:600, sw:25 },
          { l:44, sz:6,  c:C.marigold,  sh:"c", dur:5.6, dl:1.5, rot:380, sw:14 },
          { l:50, sz:11, c:C.gold,      sh:"r", dur:4.4, dl:0.3, rot:720, sw:30 },
          { l:56, sz:5,  c:C.sage,      sh:"c", dur:6.2, dl:2.5, rot:340, sw:10 },
          { l:62, sz:8,  c:C.dustyRose, sh:"r", dur:5.1, dl:0.9, rot:520, sw:20 },
          { l:68, sz:7,  c:C.marigold,  sh:"c", dur:5.4, dl:1.3, rot:460, sw:16 },
          { l:74, sz:9,  c:C.gold,      sh:"r", dur:4.6, dl:0.4, rot:580, sw:24 },
          { l:80, sz:6,  c:C.blush,     sh:"c", dur:5.9, dl:2.0, rot:400, sw:15 },
          { l:86, sz:10, c:C.dustyRose, sh:"r", dur:4.7, dl:0.6, rot:640, sw:26 },
          { l:92, sz:5,  c:C.gold,      sh:"c", dur:5.3, dl:1.7, rot:380, sw:12 },
          { l:97, sz:8,  c:C.marigold,  sh:"r", dur:4.9, dl:0.8, rot:560, sw:22 },
          // Second wave
          { l:5,  sz:7,  c:C.sage,      sh:"c", dur:5.7, dl:3.0, rot:440, sw:18 },
          { l:16, sz:9,  c:C.gold,      sh:"r", dur:4.3, dl:3.5, rot:620, sw:28 },
          { l:28, sz:6,  c:C.dustyRose, sh:"c", dur:5.4, dl:2.8, rot:360, sw:14 },
          { l:40, sz:8,  c:C.marigold,  sh:"r", dur:5.0, dl:3.2, rot:500, sw:20 },
          { l:52, sz:10, c:C.blush,     sh:"c", dur:4.6, dl:3.8, rot:460, sw:24 },
          { l:64, sz:7,  c:C.gold,      sh:"r", dur:5.2, dl:3.1, rot:540, sw:16 },
          { l:76, sz:5,  c:C.dustyRose, sh:"c", dur:5.8, dl:2.6, rot:380, sw:12 },
          { l:88, sz:9,  c:C.marigold,  sh:"r", dur:4.4, dl:3.4, rot:660, sw:26 },
          // Third wave - smaller pieces
          { l:10, sz:4,  c:C.gold,      sh:"c", dur:6.5, dl:4.0, rot:300, sw:10 },
          { l:30, sz:4,  c:C.dustyRose, sh:"c", dur:6.0, dl:4.5, rot:320, sw:8 },
          { l:48, sz:4,  c:C.marigold,  sh:"c", dur:6.3, dl:4.2, rot:280, sw:11 },
          { l:66, sz:4,  c:C.sage,      sh:"c", dur:5.8, dl:4.8, rot:340, sw:9 },
          { l:82, sz:4,  c:C.gold,      sh:"c", dur:6.1, dl:4.3, rot:310, sw:10 },
        ].map((p, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${p.l}%`,
              top: -12,
              width: p.sh === "r" ? p.sz : p.sz * 0.8,
              height: p.sh === "r" ? p.sz * 0.4 : p.sz * 0.8,
              background: p.c,
              borderRadius: p.sh === "c" ? "50%" : 2,
              opacity: 0,
              ["--hcr" as string]: `${p.rot}deg`,
              ["--hcs" as string]: `${p.sw}px`,
              animation: `heroConfettiFall ${p.dur}s ease-in ${p.dl}s infinite, heroConfettiSway ${p.dur * 0.6}s ease-in-out ${p.dl}s infinite`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Decorative corner top-right */}
      <svg aria-hidden="true" viewBox="0 0 120 120" fill="none"
        style={{ position:"absolute", top:0, right:0, width:100, height:100, opacity:0.12, pointerEvents:"none" }}>
        <path d="M120,0 Q80,6 60,38 Q40,70 60,102 Q80,134 116,128 L120,120Z" fill={C.blush} />
        <ellipse cx="68" cy="40" rx="6" ry="3.5" fill={C.marigold} opacity="0.7" transform="rotate(-25,68,40)" />
        <path d="M94,8 Q116,4 118,28" stroke={C.gold} strokeWidth="0.8" fill="none" opacity="0.5" />
      </svg>

      {/* Decorative corner bottom-left */}
      <svg aria-hidden="true" viewBox="0 0 120 120" fill="none"
        style={{ position:"absolute", bottom:64, left:0, width:88, height:88, opacity:0.1, pointerEvents:"none", transform:"rotate(180deg)" }}>
        <path d="M120,0 Q80,6 60,38 Q40,70 60,102 Q80,134 116,128 L120,120Z" fill={C.champagne} />
        <ellipse cx="68" cy="40" rx="6" ry="3.5" fill={C.marigold} opacity="0.7" transform="rotate(-25,68,40)" />
      </svg>

      {/* ── Content stack ──────────────────────────────────────── */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
        maxWidth: 420,
        padding: "0 clamp(1rem, 5vw, 2rem)",
        gap: 0,
      }}>

        {/* Subtle down arrow above Hindi text */}
        <div aria-hidden="true" style={{
          marginBottom: "clamp(4px, 1vh, 8px)",
          animation: a("hFadeIn", 0, 0.4),
        }}>
          <svg viewBox="0 0 20 12" width="18" height="10" fill="none" style={{ animation: "hFloat 2.5s ease-in-out 2s infinite" }}>
            <path d="M2,2 L10,9 L18,2" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
          </svg>
        </div>

        {/* Hindi */}
        <p lang="hi" aria-label="Shubh Vivah" style={{
          fontFamily: F.hindi,
          fontSize: "clamp(0.95rem, 3vw, 1.1rem)",
          color: C.gold, opacity: 0.9, letterSpacing: "0.04em",
          marginBottom: "clamp(5px, 1.2vh, 10px)",
          animation: a("hFadeIn", 0.05, 0.5),
        }}>
          शुभ विवाह
        </p>

        {/* Portrait - deliberately compact */}
        <div style={{
          position: "relative",
          width: "clamp(140px, 40vw, 185px)",
          aspectRatio: "3/4",
          marginBottom: "clamp(6px, 1.5vh, 12px)",
          flexShrink: 0,
          animation: a("hFadeUp", 0.1, 0.7),
        }}>
          <div aria-hidden="true" style={{
            position:"absolute", inset:-5,
            borderRadius:"50% 50% 48% 52% / 55% 55% 45% 45%",
            border:`1px solid rgba(182,150,89,0.16)`,
            pointerEvents:"none",
          }} />
          <div style={{
            width:"100%", height:"100%",
            borderRadius:"50% 50% 48% 52% / 55% 55% 45% 45%",
            overflow:"hidden",
            border:`3px solid ${C.gold}`,
            boxShadow:`0 0 0 5px rgba(244,235,221,0.9), 0 0 12px rgba(182,150,89,0.25), 0 0 0 8px rgba(182,150,89,0.1), 0 10px 32px rgba(66,58,54,0.15)`,
            position:"relative",
            background: C.champagne,
          }}>
            <ImageWithFallback
              src={coupleAssets.hero.src}
              alt={coupleAssets.hero.alt}
              fill
              focalPosition={coupleAssets.hero.focalPosition}
              priority
              assetLabel="Couple photo"
              sizes="(max-width:480px) 42vw, 185px"
            />
          </div>
        </div>

        {/* Invite line */}
        <p style={{
          fontFamily: F.body,
          fontSize: "clamp(0.54rem, 1.6vw, 0.64rem)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: C.secondary, opacity: 0.8,
          marginBottom: "clamp(2px, 0.6vh, 5px)",
          animation: a("hFadeIn", 0.25, 0.5),
        }}>
          Jain Family welcomes you
        </p>

        {/* ── Names - Aryan & Tanya on one row, & perfectly centred ── */}
        <h1
          id="hero-names"
          aria-label="Aryan and Tanya"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(6px, 2.5vw, 14px)",
            margin: "0 0 clamp(4px, 1vh, 8px)",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{
            fontFamily: F.display,
            fontSize: "clamp(2rem, 8.5vw, 3.2rem)",
            fontWeight: 300,
            color: C.charcoal,
            letterSpacing: "-0.01em",
            lineHeight: 1,
            animation: a("hSlideL", 0.3),
          }}>
            Aryan
          </span>

          {/* & with threads above and below */}
          <span style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            flexShrink: 0,
          }} aria-hidden="true">
            <svg viewBox="0 0 50 5" style={{ width: "clamp(20px,6vw,44px)", height: 5 }}>
              <path d="M0,2.5 Q12.5,0 25,2.5 Q37.5,5 50,2.5"
                stroke={C.gold} strokeWidth="0.7" fill="none"
                strokeDasharray="200" strokeDashoffset="200"
                style={{ animation: a("hThread", 0.65, 1.1) }} />
            </svg>
            <span style={{
              fontFamily: F.display,
              fontSize: "clamp(1rem, 3.8vw, 1.5rem)",
              fontWeight: 400,
              color: C.gold,
              lineHeight: 1,
              animation: a("hPop", 0.6, 0.5),
              display: "inline-block",
            }}>
              &amp;
            </span>
            <svg viewBox="0 0 50 5" style={{ width: "clamp(20px,6vw,44px)", height: 5 }}>
              <path d="M0,2.5 Q12.5,0 25,2.5 Q37.5,5 50,2.5"
                stroke={C.gold} strokeWidth="0.7" fill="none"
                strokeDasharray="200" strokeDashoffset="200"
                style={{ animation: a("hThread", 0.65, 1.1) }} />
            </svg>
          </span>

          <span style={{
            fontFamily: F.display,
            fontSize: "clamp(2rem, 8.5vw, 3.2rem)",
            fontWeight: 300,
            color: C.charcoal,
            letterSpacing: "-0.01em",
            lineHeight: 1,
            animation: a("hSlideR", 0.35),
          }}>
            Tanya
          </span>
        </h1>

        {/* Floral divider */}
        <div aria-hidden="true" style={{
          display:"flex", alignItems:"center", gap:6,
          width:"100%", maxWidth:180,
          marginBottom: "clamp(5px, 1.2vh, 10px)",
          animation: a("hFadeIn", 0.5, 0.5),
        }}>
          <div style={{ flex:1, height:1, background:`linear-gradient(90deg,transparent,rgba(182,150,89,0.4))` }} />
          <svg viewBox="0 0 26 12" width="26" height="12" fill="none">
            <circle cx="13" cy="6" r="2" fill={C.marigold} opacity="0.7" />
            <circle cx="5"  cy="6" r="1.2" fill={C.dustyRose} opacity="0.55" />
            <circle cx="21" cy="6" r="1.2" fill={C.dustyRose} opacity="0.55" />
            <path d="M1,6 Q3,2.5 5,6 Q7,9.5 10,6"  stroke={C.gold} strokeWidth="0.6" fill="none" opacity="0.5" />
            <path d="M16,6 Q18,2.5 21,6 Q23,9.5 26,6" stroke={C.gold} strokeWidth="0.6" fill="none" opacity="0.5" />
          </svg>
          <div style={{ flex:1, height:1, background:`linear-gradient(90deg,rgba(182,150,89,0.4),transparent)` }} />
        </div>

        {/* Date */}
        <p style={{
          fontFamily: F.display,
          fontSize: "clamp(0.95rem, 3.5vw, 1.2rem)",
          fontWeight: 400,
          color: C.charcoal,
          letterSpacing: "0.04em",
          marginBottom: 2,
          animation: a("hFadeUp", 0.55, 0.5),
        }}>
          2–4 December 2026
        </p>
        <p style={{
          fontFamily: F.body,
          fontSize: "clamp(0.58rem, 1.8vw, 0.68rem)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: C.secondary, opacity: 0.78,
          marginBottom: "clamp(10px, 2.5vh, 18px)",
          animation: a("hFadeUp", 0.6, 0.5),
        }}>
          Vaishali, Ghaziabad · India
        </p>

        {/* Primary CTAs - only two buttons, no calendar/share clutter */}
        <div style={{
          display:"flex", flexDirection:"column", gap:9,
          width:"100%", maxWidth:290,
          animation: a("hFadeUp", 0.67, 0.55),
        }}>
          <button onClick={onViewEvents}
            style={{ ...styles.btnPrimary, minHeight:46 }}>
            View Celebrations
          </button>
          <button onClick={onRSVP}
            style={{ ...styles.btnGold, minHeight:46 }}>
            RSVP
          </button>
        </div>

      </div>
    </section>
  );
}
