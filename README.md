# TECHIN 510 Week 5 — Full-Stack Development

This repo contains two independent apps built with Next.js and Supabase, plus a lab report for the Week 5 assignment.

---

## What's in this repo

| Path | What it is |
|------|------------|
| `report.md` / `report.pdf` | Lab report covering all components A through E |
| `assets/` | Images referenced in the report (system map, architecture diagrams, screenshots) |
| `src/app/(main)/` | Component B — Equipment Return Tracker (staff-facing dashboard) |
| `src/app/events/` | Component E — GIX Events Browser (student-facing events page) |
| `src/app/api/` | Server-side API routes for items, events, weather, and QR code |
| `src/components/` | Shared UI components (ItemForm, ItemList, WeatherCard, EventCard, CategoryFilter, Navbar) |
| `src/lib/` | Supabase client and TypeScript types |
| `lab-manual.md` | Original lab instructions |

---

## The two apps

### Component B — Equipment Return Tracker
**URL:** https://510-lab.vercel.app/dashboard

A tool for GIX IT staff (Maason and Kevin) to track equipment returns at the end of the year. Staff can add items, advance them through a three-step workflow (pending → returned → labeled), enter asset tag barcodes, and generate QR codes. Also shows a 7-day Seattle weather forecast via the Open-Meteo API.

### Component E — GIX Events Browser
**URL:** https://510-lab.vercel.app/events

A standalone events page where students can browse upcoming GIX lectures, workshops, career panels, and social events, with a category filter. Reads from a separate `events` table in Supabase.

---

## How to run locally

**1. Install dependencies**
```bash
npm install
```

**2. Set up environment variables**

Create a `.env.local` file in the root with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**3. Start the dev server**
```bash
npm run dev
```

Then open:
- http://localhost:3000 — landing page
- http://localhost:3000/dashboard — equipment return tracker
- http://localhost:3000/events — events browser

---

## Supabase tables

**`items`** — tracks equipment return workflow
- `id`, `created_at`, `item_name`, `team_name`, `category` (it / makerspace / discard), `status` (pending / returned / labeled), `asset_tag`, `description`

**`events`** — stores GIX events
- `id`, `created_at`, `title`, `category` (lecture / workshop / career / social), `date`, `time`, `location`, `description`

RLS is disabled on both tables.

---

## External APIs

- **Open-Meteo** — free weather forecast API, no key required, proxied via `/api/weather`
- **QR Server** — generates QR code PNGs from asset tag values, proxied via `/api/qrcode`
