// ─── Relationship timeline ────────────────────────────────────────────────────

export type FrameStyle = "organic" | "postcard" | "torn" | "none";
export type Orientation = "portrait" | "landscape" | "square";

export interface TimelineImage {
  src: string;
  alt: string;
  focalPosition?: string;
  orientation: Orientation;
  frameStyle?: FrameStyle;
}

export interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  caption?: string;
  images: TimelineImage[];
  layout: "single" | "carousel" | "scrapbook";
  isSilent?: boolean;
  isEngagement?: boolean;
  isProposal?: boolean;
  isWeddingFinale?: boolean;
}

export const timelineMilestones: TimelineMilestone[] = [
  // ── 2018–2019 ─────────────────────────────────────────────────────────────
  {
    id: "college",
    year: "2018 – 2019",
    title: "Where It All Began",
    caption: "Two college friends, at the beginning of a story they could not yet see.",
    images: [
      {
        src: "/assets/story/2018-college.png",
        alt: "Aryan and Tanya during their college days",
        focalPosition: "center center",
        orientation: "landscape",
        frameStyle: "organic",
      },
      {
        src: "/assets/story/2018-college-2.png",
        alt: "Another memory from their college days together",
        focalPosition: "center center",
        orientation: "landscape",
        frameStyle: "organic",
      },
      {
        src: "/assets/story/2018-college-3.png",
        alt: "College days - 2018",
        focalPosition: "center center",
        orientation: "landscape",
        frameStyle: "organic",
      },
    ],
    layout: "carousel",
  },

  // ── Gap ────────────────────────────────────────────────────────────────────
  {
    id: "distance",
    year: "",
    title: "A Little Distance",
    caption: "Life took us in different directions for a while.",
    images: [],
    layout: "single",
    isSilent: true,
  },

  // ── 2022 ──────────────────────────────────────────────────────────────────
  {
    id: "reconnected",
    year: "2022",
    title: "Back Online",
    caption: "Across screens and distance, the conversations began again.",
    images: [
      {
        src: "/assets/story/long-distance-01.png",
        alt: "Aryan and Tanya - reconnecting across the distance",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "postcard",
      },
      {
        src: "/assets/story/long-distance-02.png",
        alt: "Calls that made the distance feel smaller",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "postcard",
      },
      {
        src: "/assets/story/long-distance-03.png",
        alt: "Different places, one story",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "postcard",
      },
      {
        src: "/assets/story/long-distance-04.png",
        alt: "Every call brought us closer",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "postcard",
      },
    ],
    layout: "carousel",
  },

  // ── 2023–2025 ─────────────────────────────────────────────────────────────
  {
    id: "long-distance",
    year: "2023 – 2025",
    title: "Places, Memories & Each Other",
    caption: "Different places, one story - and every moment made us closer.",
    images: [
      {
        src: "/assets/story/memories-01.png",
        alt: "Aryan and Tanya - memories together",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "postcard",
      },
      {
        src: "/assets/story/memories-02.png",
        alt: "Places visited together",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "postcard",
      },
      {
        src: "/assets/story/memories-03.png",
        alt: "More memories - 2023 to 2025",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "torn",
      },
      {
        src: "/assets/story/memories-04.png",
        alt: "Favourite moments together",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "torn",
      },
      {
        src: "/assets/story/memories-05.png",
        alt: "Adventures and memories",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "postcard",
      },
      {
        src: "/assets/story/memories-06.png",
        alt: "Every moment made us closer",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "postcard",
      },
    ],
    layout: "carousel",
  },

  // ── 2025 Proposal ─────────────────────────────────────────────────────────
  {
    id: "proposal",
    year: "2025",
    title: "She Said Yes",
    caption: "The question was asked. The answer changed everything.",
    images: [
      {
        src: "/assets/story/2025-proposal.png",
        alt: "The proposal - 2025",
        focalPosition: "center 30%",
        orientation: "portrait",
        frameStyle: "organic",
      },
    ],
    layout: "single",
    isProposal: true,
  },

  // ── Jan 2026 Engagement Party ──────────────────────────────────────────────
  {
    id: "engagement",
    year: "January 2026",
    title: "The Engagement",
    caption: "Surrounded by family and love, our next chapter officially began.",
    images: [
      {
        src: "/assets/story/2026-engagement-v2.png",
        alt: "Aryan and Tanya's engagement party, January 2026",
        focalPosition: "center 30%",
        orientation: "portrait",
        frameStyle: "organic",
      },
      {
        src: "/assets/story/2026-engagement-2.png",
        alt: "Engagement celebrations - January 2026",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "organic",
      },
      {
        src: "/assets/story/2026-engagement-3.png",
        alt: "Moments from the engagement party",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "organic",
      },
      {
        src: "/assets/story/2026-engagement-4.png",
        alt: "Family and love at the engagement",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "organic",
      },
      {
        src: "/assets/story/2026-engagement-5.png",
        alt: "Engagement party memories",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "organic",
      },
      {
        src: "/assets/story/2026-engagement-6.png",
        alt: "Engagement memories",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "organic",
      },
      {
        src: "/assets/story/2026-engagement-7.png",
        alt: "The beginning of forever - January 2026",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "organic",
      },
    ],
    layout: "carousel",
    isEngagement: true,
  },

  // ── Wedding finale ─────────────────────────────────────────────────────────
  {
    id: "finale",
    year: "December 2026",
    title: "Aryan & Tanya",
    caption: "From best friends to forever.",
    images: [
      {
        src: "/assets/events/wedding-01.png",
        alt: "Aryan and Tanya - the wedding",
        focalPosition: "center 25%",
        orientation: "portrait",
        frameStyle: "organic",
      },
      {
        src: "/assets/events/wedding-02.png",
        alt: "Wedding moments - December 2026",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "organic",
      },
      {
        src: "/assets/events/wedding-03.png",
        alt: "Together forever",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "organic",
      },
      {
        src: "/assets/events/wedding-04.png",
        alt: "Wedding celebrations",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "organic",
      },
      {
        src: "/assets/events/wedding-05.png",
        alt: "Love and blessings - December 2026",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "organic",
      },
      {
        src: "/assets/events/wedding-06.png",
        alt: "Aryan & Tanya - our forever begins",
        focalPosition: "center center",
        orientation: "portrait",
        frameStyle: "organic",
      },
    ],
    layout: "carousel",
    isWeddingFinale: true,
  },
];

