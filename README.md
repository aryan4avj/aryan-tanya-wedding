# Aryan & Tanya - Wedding Invitation

A premium mobile-first wedding invitation website for Aryan & Tanya.

**2-4 December 2026 | Vaishali, Ghaziabad**

## Live Website

Deployed on Vercel: [View Invitation](https://avj.vercel.app)

## Features

- Mobile-first design optimized for WhatsApp sharing
- Elegant loading and invitation opening experience
- Interactive celebration countdown
- Event schedule with calendar integration
- Visual relationship timeline with photo galleries
- Venue cards with Google Maps directions
- Multi-step RSVP form connected to Google Sheets
- Native share support (iOS & Android)
- Touch/swipe support on all carousels
- Floating petals and confetti animations
- Bodoni Moda + Manrope typography
- Hindi text support (Noto Sans Devanagari)

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion (dynamic imports)
- React Hook Form + Zod
- Lucide Icons
- Google Apps Script (RSVP backend)
- Vercel (hosting)

## Project Structure

```
src/
  app/          - Next.js pages and layout
  components/
    sections/   - Page sections (Hero, Events, Timeline, etc.)
    ui/         - Reusable UI components
  config/       - Site configuration
  data/         - Wedding events, venues, timeline, couple data
  hooks/        - Custom React hooks
  lib/          - Calendar, RSVP, styling utilities
  types/        - TypeScript interfaces
public/
  assets/       - Photos, logo, audio
```

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Live website URL |
| `NEXT_PUBLIC_RSVP_MODE` | `mock` or `live` |
| `NEXT_PUBLIC_RSVP_ENDPOINT` | Google Apps Script URL |

## Deployment

Deployed automatically via Vercel on push to `main`.

```bash
git add .
git commit -m "your message"
git push origin main
```

## RSVP Backend

Connected to the Google Sheets via Google Apps Script. RSVP submissions are stored in a Google Sheet with columns: Timestamp, Name, Mobile, Email, Guests, Event Attendance, Message.

---

Made with love for Aryan & Tanya | December 2026
