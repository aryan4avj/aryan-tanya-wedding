# Aryan & Tanya — Wedding Invitation Website

A premium, mobile-first wedding invitation website for Aryan & Tanya, 2–4 December 2026, Vaishali.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in environment variables
cp .env.example .env.local

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Main page — assembles all sections
│   └── globals.css         # Design tokens, global styles
├── config/
│   └── site.ts             # ← Edit couple details, dates, features
├── data/
│   ├── events.ts           # ← Edit event times, venues, dress codes
│   ├── venues.ts           # ← Edit venue addresses and map URLs
│   ├── timeline.ts         # ← Edit story milestones and image paths
│   └── wedding.ts          # Re-exports + couple portrait asset paths
├── components/
│   ├── ui/                 # Reusable UI primitives
│   └── sections/           # Full-page sections
├── lib/
│   ├── calendar.ts         # ICS + Google Calendar link generation
│   └── rsvp.ts             # RSVP backend abstraction
├── hooks/                  # useScrollReveal, useActiveSection
└── types/
    └── rsvp.ts             # RSVP data types
public/
├── assets/
│   ├── audio/              # wedding-instrumental.mp3
│   ├── couple/             # hero-couple.webp, final-couple.webp
│   ├── story/              # Relationship timeline images
│   ├── events/             # Per-ceremony illustrations
│   ├── decor/              # Botanical decorative assets
│   └── social/             # OG preview image
├── robots.txt              # Disallows all search indexing
└── manifest.json           # PWA manifest
```

---

## Updating Content

### Couple details & dates
Edit `src/config/site.ts`

### Event times, venues, dress codes
Edit `src/data/events.ts`  
Search for `PLACEHOLDER` to find every field awaiting confirmation.

### Map URLs
Edit `src/data/venues.ts` and `src/data/events.ts`  
Replace `PLACEHOLDER_MAP_URL_*` values with real Google Maps / Apple Maps links.

### Story timeline
Edit `src/data/timeline.ts`  
Update image paths and captions per milestone.

---

## Replacing Images

Drop images into the `public/assets/` folder matching the filenames in the data files.  
All images should be in `.webp` format (or `.avif`). Use `.jpg` / `.png` as fallbacks.

### Required images

| Path | Description |
|------|-------------|
| `/assets/couple/hero-couple.webp` | Illustrated portrait — hero section |
| `/assets/couple/final-couple.webp` | Illustrated portrait — final section |
| `/assets/story/2018-college.webp` | College days milestone |
| `/assets/story/2022-video-calls.webp` | Video call reconnection |
| `/assets/story/2023-closer.webp` | Growing closer |
| `/assets/story/long-distance-01.webp` | Long distance 1 |
| `/assets/story/long-distance-02.webp` | Long distance 2 |
| `/assets/story/together-01.webp` | Together 1 |
| `/assets/story/together-02.webp` | Together 2 |
| `/assets/story/2026-engagement.webp` | Engagement |
| `/assets/story/2026-after-engagement-01.webp` | After engagement 1 |
| `/assets/story/2026-after-engagement-02.webp` | After engagement 2 |
| `/assets/story/2026-after-engagement-03.webp` | After engagement 3 |
| `/assets/story/2026-wedding-finale.webp` | Wedding finale |
| `/assets/social/aryan-tanya-wedding-preview.jpg` | OG/social preview (1200×630) |
| `/assets/audio/wedding-instrumental.mp3` | Background music (muted by default) |

---

## RSVP Backend Setup

The RSVP form works in **mock mode** by default (logs to console).

To connect a real backend:

1. Set `NEXT_PUBLIC_RSVP_MODE=live` in `.env.local`
2. Set `NEXT_PUBLIC_RSVP_ENDPOINT=https://your-endpoint.com/api/rsvp`
3. Your endpoint should accept `POST` with JSON body matching `RSVPData` in `src/types/rsvp.ts`

**Supported backends:**
- **Supabase** — create an Edge Function and set the URL
- **Firebase** — create a Cloud Function and set the URL
- **Airtable** — use a server-side Next.js Route Handler (do not expose API key client-side)
- **Google Sheets** — use a server-side handler with the Sheets API
- **Custom REST API** — any POST endpoint accepting JSON

---

## Deployment

### Vercel (recommended)
```bash
npx vercel
```
Set environment variables in the Vercel dashboard.

### Other platforms
```bash
npm run build
npm start
```

---

## Environment Variables

See `.env.example` for all available variables.

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Live website URL for sharing links |
| `NEXT_PUBLIC_RSVP_MODE` | No | `mock` (default) or `live` |
| `NEXT_PUBLIC_RSVP_ENDPOINT` | If live | RSVP POST endpoint URL |
| `NEXT_PUBLIC_INVITATION_CODE` | No | Enable private-mode gate |

---

## Information Still Needed

See `CHECKLIST.md` for a complete list.

---

## Features

- Mobile-first, WhatsApp-shareable
- Animated invitation opening experience
- Animated countdown to Haldi (2 Dec 2026, 12:00 PM IST)
- Complete event schedule with expand/collapse, dress codes, map links
- Visual relationship timeline with image lightbox and carousel
- Five venue cards with map + copy-address actions
- Multi-step RSVP form with validation and backend abstraction
- Add to Calendar (Google, Apple, Outlook) for each event + all events
- WhatsApp sharing with pre-filled text
- Optional background music (muted by default)
- Floating petal animation (respects prefers-reduced-motion)
- Mobile sticky bottom navigation
- Desktop top navigation
- No search indexing (robots.txt + meta)
- WCAG 2.2 AA accessibility targets
