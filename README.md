# ItinerAI

AI-powered travel itinerary generator with an interactive map interface.

## What it does

Search for any city and get a complete travel plan — 1-day, 3-day, and 5-day itineraries — with points of interest plotted on an interactive map. All itineraries are generated in parallel via streaming, so results appear progressively as they're ready.

## Stack

- **Next.js 16** (App Router)
- **OpenAI GPT-4o mini** — itinerary generation
- **MapLibre GL / react-map-gl** — interactive map
- **Zustand** — global state
- **Framer Motion** — animations
- **Tailwind CSS v4** + shadcn/ui

## Getting started

```bash
npm install
```

Create a `.env.local`:

```env
OPENAI_API_KEY=your_key_here

# Optional: use mock data to skip AI calls during development
USE_MOCK_DATA=true
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
