// ─── Shared design system - all as JS/TS style objects ───────────────────────
// Using inline styles ensures 100% reliability regardless of CSS bundler.

export const C = {
  ivory:      "#FFF9F1",
  champagne:  "#F4EBDD",
  blush:      "#F3DED9",
  dustyRose:  "#D59A91",
  sage:       "#A8B69D",
  terracotta: "#C77C67",
  marigold:   "#E5AA46",
  gold:       "#B69659",
  charcoal:   "#423A36",
  secondary:  "#756A64",
  muted:      "#9E938D",
} as const;

export const F = {
  display: '"Bodoni Moda", "Cormorant Garamond", Georgia, serif',
  body:    '"Manrope", system-ui, sans-serif',
  script:  '"Dancing Script", cursive',
  // For Devanagari text - Dancing Script doesn't support Hindi characters
  hindi:   '"Noto Sans Devanagari", "Mangal", sans-serif',
} as const;

export const styles = {
  // ── Buttons ──────────────────────────────────────────────────────────────
  btnPrimary: {
    display: "inline-flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: "0.5rem",
    minHeight: 52,
    padding: "0 1.75rem",
    background: C.charcoal,
    color: C.ivory,
    fontFamily: F.body,
    fontSize: "0.8125rem",
    fontWeight: 600,
    letterSpacing: "0.09em",
    textTransform: "uppercase" as const,
    borderRadius: 9999,
    border: "none",
    cursor: "pointer" as const,
    textDecoration: "none" as const,
    whiteSpace: "nowrap" as const,
    transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
  },
  btnGold: {
    display: "inline-flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: "0.5rem",
    minHeight: 52,
    padding: "0 1.75rem",
    background: C.gold,
    color: "#fff",
    fontFamily: F.body,
    fontSize: "0.8125rem",
    fontWeight: 600,
    letterSpacing: "0.09em",
    textTransform: "uppercase" as const,
    borderRadius: 9999,
    border: "none",
    cursor: "pointer" as const,
    textDecoration: "none" as const,
    whiteSpace: "nowrap" as const,
    transition: "filter 0.2s, transform 0.15s",
  },
  btnOutline: {
    display: "inline-flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: "0.5rem",
    minHeight: 48,
    padding: "0 1.5rem",
    background: "transparent",
    color: C.charcoal,
    fontFamily: F.body,
    fontSize: "0.8125rem",
    fontWeight: 600,
    letterSpacing: "0.09em",
    textTransform: "uppercase" as const,
    borderRadius: 9999,
    border: `1.5px solid rgba(66,58,54,0.3)`,
    cursor: "pointer" as const,
    textDecoration: "none" as const,
    whiteSpace: "nowrap" as const,
    transition: "border-color 0.2s, background 0.2s, transform 0.15s",
  },
  btnSm: {
    minHeight: 40,
    padding: "0 1.1rem",
    fontSize: "0.78rem",
  },

  // ── Cards ─────────────────────────────────────────────────────────────────
  card: {
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(12px)",
    borderRadius: "1.25rem",
    border: "1px solid rgba(182,150,89,0.22)",
    boxShadow: "0 2px 24px rgba(66,58,54,0.07)",
  },

  // ── Image placeholder ─────────────────────────────────────────────────────
  imgPlaceholder: {
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: "0.5rem",
    background: C.champagne,
    border: `1.5px dashed rgba(182,150,89,0.4)`,
    borderRadius: "1rem",
    color: C.secondary,
    fontFamily: F.body,
    fontSize: "0.75rem",
    textAlign: "center" as const,
    padding: "1.5rem",
    width: "100%",
    height: "100%",
  },

  // ── Dividers ──────────────────────────────────────────────────────────────
  dividerGold: {
    width: "100%",
    height: 1,
    background: "linear-gradient(90deg, transparent, rgba(182,150,89,0.45), transparent)",
    margin: "0.25rem 0",
  },

  // ── Section wrapper ───────────────────────────────────────────────────────
  sectionPaper: {
    background: C.ivory,
    padding: "clamp(3rem, 8vw, 6rem) clamp(1.25rem, 5vw, 2rem)",
  },
  sectionChampagne: {
    background: C.champagne,
    padding: "clamp(3rem, 8vw, 6rem) clamp(1.25rem, 5vw, 2rem)",
  },
};

// Helper: merge style objects
export function cx(...objs: (React.CSSProperties | undefined | false | null)[]): React.CSSProperties {
  return Object.assign({}, ...objs.filter(Boolean));
}
