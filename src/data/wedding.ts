// ─── Core wedding data ────────────────────────────────────────────────────────
// Central re-export + couple / ceremony configuration.

export { siteConfig } from "@/config/site";
export { weddingEvents, eventsByDate } from "@/data/events";
export { venues } from "@/data/venues";
export { timelineMilestones } from "@/data/timeline";

// Couple portrait assets
export const coupleAssets = {
  hero: {
    src: "/assets/couple/hero-couple-v3.png",
    alt: "Aryan and Tanya",
    focalPosition: "center 30%",
  },
  final: {
    src: "/assets/couple/final-couple-v3.png",
    alt: "Aryan and Tanya",
    focalPosition: "center 30%",
  },
  logo: {
    src: "/assets/couple/logo.png",
    alt: "Aryan & Tanya monogram logo",
  },
};
